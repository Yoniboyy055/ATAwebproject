/**
 * Proof Ledger — AI analysis boundary.
 *
 * Calls the Anthropic Messages API server side, validates the reply against a
 * strict schema and classifies the result. Anything other than a confident,
 * conflict-free, schema-valid proposal results in zero mutation.
 */

import { AiProposal, aiProposalSchema } from '../schemas/proposal'
import {
  AnalysisContext,
  buildSystemPrompt,
  PROPOSAL_TOOL_NAME,
  PROPOSAL_TOOL_SCHEMA,
} from './prompt'

export type AnalysisOutcome =
  | { status: 'PROPOSAL'; proposal: AiProposal }
  | {
      status: 'CONFLICT'
      message: string
      conflict: NonNullable<AiProposal['conflict']>
      observations: string
    }
  | { status: 'AMBIGUOUS'; message: string; observations: string }
  | { status: 'ERROR'; message: string; providerStatus?: number }

export interface AnalyzeInput {
  imageBase64: string
  mimeType: string
  instruction: string
  context: AnalysisContext
}

export interface AnthropicSettings {
  apiKey: string
  model: string
  /** Override the API host. Used for self-hosted proxies and integration tests. */
  baseUrl?: string
  fetchImpl?: typeof fetch
}

export function readAnthropicSettings(
  env: NodeJS.ProcessEnv = process.env
): AnthropicSettings | { error: string } {
  const apiKey = env.ANTHROPIC_API_KEY
  const model = env.LEDGER_ANTHROPIC_MODEL
  if (!apiKey) return { error: 'ANTHROPIC_API_KEY is not configured on the server' }
  if (!model) return { error: 'LEDGER_ANTHROPIC_MODEL is not configured on the server' }
  const baseUrl = env.LEDGER_ANTHROPIC_BASE_URL
  return baseUrl ? { apiKey, model, baseUrl } : { apiKey, model }
}

/**
 * Classify a raw model reply. Exported separately from the network call so the
 * decision logic can be tested without contacting the API.
 */
export function classifyProposal(raw: unknown): AnalysisOutcome {
  const parsed = aiProposalSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      status: 'AMBIGUOUS',
      message:
        'The analysis did not return a well-formed proposal. Nothing has been recorded.',
      observations: parsed.error.issues.map((issue) => issue.message).join('; '),
    }
  }

  const proposal = parsed.data

  if (proposal.conflict) {
    return {
      status: 'CONFLICT',
      message: 'Evidence Conflict Detected',
      conflict: proposal.conflict,
      observations: proposal.observations,
    }
  }

  if (proposal.confidence === 'LOW') {
    return {
      status: 'AMBIGUOUS',
      message:
        'The transaction could not be determined confidently. Nothing has been recorded — please correct the instruction.',
      observations: proposal.observations,
    }
  }

  return { status: 'PROPOSAL', proposal }
}

interface AnthropicContentBlock {
  type: string
  name?: string
  input?: unknown
  text?: string
}

export async function analyzeEvidence(
  input: AnalyzeInput,
  settings: AnthropicSettings
): Promise<AnalysisOutcome> {
  const doFetch = settings.fetchImpl ?? fetch
  const baseUrl = settings.baseUrl ?? 'https://api.anthropic.com'

  let response: Response
  try {
    response = await doFetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': settings.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: settings.model,
        max_tokens: 1500,
        system: buildSystemPrompt(input.context),
        tools: [
          {
            name: PROPOSAL_TOOL_NAME,
            description: 'Return exactly one structured transaction proposal.',
            input_schema: PROPOSAL_TOOL_SCHEMA,
          },
        ],
        tool_choice: { type: 'tool', name: PROPOSAL_TOOL_NAME },
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: input.mimeType,
                  data: input.imageBase64,
                },
              },
              {
                type: 'text',
                text: `Owner instruction:\n${input.instruction}`,
              },
            ],
          },
        ],
      }),
    })
  } catch {
    // Network detail is deliberately not surfaced or logged — it can carry
    // request content.
    return { status: 'ERROR', message: 'The analysis service could not be reached.' }
  }

  if (!response.ok) {
    return {
      status: 'ERROR',
      providerStatus: response.status,
      message: `The analysis service returned status ${response.status}. Nothing has been recorded.`,
    }
  }

  let payload: { content?: AnthropicContentBlock[] }
  try {
    payload = (await response.json()) as { content?: AnthropicContentBlock[] }
  } catch {
    return { status: 'ERROR', message: 'The analysis reply could not be read.' }
  }

  const toolBlock = (payload.content ?? []).find(
    (block) => block.type === 'tool_use' && block.name === PROPOSAL_TOOL_NAME
  )

  if (!toolBlock) {
    return {
      status: 'AMBIGUOUS',
      message:
        'The analysis did not produce a structured proposal. Nothing has been recorded.',
      observations: '',
    }
  }

  return classifyProposal(toolBlock.input)
}
