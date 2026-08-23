/**
 * @jest-environment node
 *
 * Proof Ledger — AI boundary.
 *
 * AI interprets evidence. It never computes a balance and it never causes a
 * mutation on its own: ambiguity and evidence conflicts stop the flow dead.
 */

import { NextRequest } from 'next/server'

import { analyzeEvidence, classifyProposal } from '../ai/analyze'
import { PROPOSAL_TOOL_SCHEMA } from '../ai/prompt'
import { LEDGER_SESSION_COOKIE, createSessionToken } from '../auth/session'
import { handleAnalyze } from '../server/handlers'
import { validateEvidence } from '../server/evidence'
import { hashLedgerPassword } from '../auth/passwords'
import { MemoryLedgerRepository } from '../database/memory-repository'
import { CAD, makeLedger } from './helpers'

/** A ledger with seeded credentials so session resolution succeeds. */
async function seededLedger(): Promise<MemoryLedgerRepository> {
  const ledger = await makeLedger()
  await ledger.seedCredential('OWNER', process.env.LEDGER_OWNER_PASSWORD_HASH as string)
  await ledger.seedCredential('VIEWER', process.env.LEDGER_VIEWER_PASSWORD_HASH as string)
  return ledger
}

const SESSION_SECRET = 'test-session-secret-value-that-is-long-enough'

// A one pixel PNG, used purely as an upload fixture.
const PNG_BYTES = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
)

function analyzeRequest(instruction: string, role: 'OWNER' | 'VIEWER' = 'OWNER'): NextRequest {
  const form = new FormData()
  form.append('evidence', new File([new Uint8Array(PNG_BYTES)], 'proof.png', { type: 'image/png' }))
  form.append('instruction', instruction)

  const request = new NextRequest('http://ledger.test/api/proof-ledger/analyze', {
    method: 'POST',
    body: form,
  })
  request.cookies.set(LEDGER_SESSION_COOKIE, createSessionToken(role, 1, SESSION_SECRET))
  return request
}

function toolReply(input: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      content: [{ type: 'tool_use', name: 'propose_ledger_record', input }],
    }),
  } as unknown as Response
}

beforeAll(async () => {
  process.env.LEDGER_SESSION_SECRET = SESSION_SECRET
  process.env.ANTHROPIC_API_KEY = 'test-key'
  process.env.LEDGER_ANTHROPIC_MODEL = 'test-model'
  process.env.LEDGER_OWNER_PASSWORD_HASH = await hashLedgerPassword('owner-password-2026')
  process.env.LEDGER_VIEWER_PASSWORD_HASH = await hashLedgerPassword('viewer-password-2026')
})

describe('proposal classification', () => {
  it('keeps the provider tool schema in a simple Claude-compatible shape', () => {
    expect(PROPOSAL_TOOL_SCHEMA).toMatchObject({
      type: 'object',
      additionalProperties: false,
    })
    expect(PROPOSAL_TOOL_SCHEMA.properties).toHaveProperty('adjustmentEffectCents')
    expect(PROPOSAL_TOOL_SCHEMA.properties).not.toHaveProperty('baseEffectCents')
    expect(JSON.stringify(PROPOSAL_TOOL_SCHEMA)).not.toContain('"minimum"')
    expect(JSON.stringify(PROPOSAL_TOOL_SCHEMA)).not.toContain('["integer","null"]')
    expect(JSON.stringify(PROPOSAL_TOOL_SCHEMA)).not.toContain('["string","null"]')
    expect(JSON.stringify(PROPOSAL_TOOL_SCHEMA)).not.toContain('["object","null"]')
  })

  it('accepts a confident, conflict-free proposal', () => {
    const outcome = classifyProposal({
      type: 'WITHDRAWAL',
      date: '2026-08-11',
      amountCents: CAD(100),
      reason: 'Personal expense',
      requiredRepaymentCents: CAD(120),
      confidence: 'HIGH',
      observations: 'Screenshot shows a CAD $100 withdrawal.',
    })

    expect(outcome.status).toBe('PROPOSAL')
    if (outcome.status !== 'PROPOSAL') throw new Error('unreachable')
    expect(outcome.proposal.amountCents).toBe(CAD(100))
    expect(outcome.proposal.requiredRepaymentCents).toBe(CAD(120))
  })

  // Test 11
  it('flags an evidence conflict instead of proposing', () => {
    const outcome = classifyProposal({
      type: 'BASE_DEPOSIT',
      date: '2026-08-11',
      amountCents: CAD(5000),
      reason: 'Deposit',
      confidence: 'LOW',
      conflict: {
        field: 'amount',
        screenshotValue: 'CAD $500.00',
        instructionValue: 'CAD $5,000.00',
        detail: 'The screenshot shows CAD $500.00 but the instruction says CAD $5,000.00.',
      },
      observations: 'Amounts disagree.',
    })

    expect(outcome.status).toBe('CONFLICT')
    if (outcome.status !== 'CONFLICT') throw new Error('unreachable')
    expect(outcome.message).toBe('Evidence Conflict Detected')
    expect(outcome.conflict.screenshotValue).toBe('CAD $500.00')
  })

  // Test 10
  it('treats low confidence as ambiguous', () => {
    const outcome = classifyProposal({
      type: 'WITHDRAWAL',
      date: '2026-08-11',
      amountCents: CAD(100),
      reason: 'unclear',
      confidence: 'LOW',
      observations: 'The screenshot is unreadable.',
    })
    expect(outcome.status).toBe('AMBIGUOUS')
  })

  it('treats a malformed reply as ambiguous', () => {
    expect(classifyProposal({ type: 'SOMETHING_ELSE' }).status).toBe('AMBIGUOUS')
    expect(classifyProposal({ type: 'WITHDRAWAL', amountCents: 12.5 }).status).toBe('AMBIGUOUS')
    expect(classifyProposal(null).status).toBe('AMBIGUOUS')
  })

  it('never lets the model return a balance field', () => {
    const outcome = classifyProposal({
      type: 'BASE_DEPOSIT',
      date: '2026-08-11',
      amountCents: CAD(500),
      reason: 'Deposit',
      confidence: 'HIGH',
      observations: '',
      baseRemainingCents: 1,
      totalOutstandingCents: 2,
    })
    expect(outcome.status).toBe('PROPOSAL')
    if (outcome.status !== 'PROPOSAL') throw new Error('unreachable')
    expect(Object.keys(outcome.proposal)).not.toContain('baseRemainingCents')
    expect(Object.keys(outcome.proposal)).not.toContain('totalOutstandingCents')
  })
})

describe('analysis never mutates on an unusable result', () => {
  // Test 10
  it('records nothing when the model is not confident', async () => {
    const ledger = await makeLedger()
    const fetchImpl = jest.fn(async () =>
      toolReply({
        type: 'WITHDRAWAL',
        date: '2026-08-11',
        amountCents: CAD(100),
        reason: 'unclear',
        confidence: 'LOW',
        observations: 'Blurry screenshot.',
      })
    )

    const outcome = await analyzeEvidence(
      {
        imageBase64: PNG_BYTES.toString('base64'),
        mimeType: 'image/png',
        instruction: 'not sure what this is',
        context: { todayIso: '2026-08-11', openWithdrawals: [] },
      },
      { apiKey: 'k', model: 'm', fetchImpl: fetchImpl as unknown as typeof fetch }
    )

    expect(outcome.status).toBe('AMBIGUOUS')
    expect(await ledger.listTransactions()).toHaveLength(0)
  })

  it('retries with plain JSON when the provider rejects the tool request', async () => {
    const ledger = await makeLedger()
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: { type: 'invalid_request_error' } }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                type: 'WITHDRAWAL',
                date: '2026-08-11',
                amountCents: CAD(100),
                reason: 'Withdrawal',
                requiredRepaymentCents: CAD(120),
                confidence: 'HIGH',
                observations: 'Screenshot shows a CAD $100 withdrawal.',
              }),
            },
          ],
        }),
      } as unknown as Response)

    const outcome = await analyzeEvidence(
      {
        imageBase64: PNG_BYTES.toString('base64'),
        mimeType: 'image/jpeg',
        instruction: 'I withdrew CAD $100 and need to return CAD $120.',
        context: { todayIso: '2026-08-11', openWithdrawals: [] },
      },
      { apiKey: 'k', model: 'm', fetchImpl: fetchImpl as unknown as typeof fetch }
    )

    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(JSON.parse(String(fetchImpl.mock.calls[0][1]?.body))).toHaveProperty('tools')
    expect(JSON.parse(String(fetchImpl.mock.calls[1][1]?.body))).not.toHaveProperty('tools')
    expect(outcome.status).toBe('PROPOSAL')
    if (outcome.status !== 'PROPOSAL') throw new Error('unreachable')
    expect(outcome.proposal.requiredRepaymentCents).toBe(CAD(120))
    expect(await ledger.listTransactions()).toHaveLength(0)
  })

  it('returns a phone-friendly error and safe log when the analysis provider rejects the proof', async () => {
    const ledger = await seededLedger()
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 400,
      json: async () => ({
        error: {
          type: 'invalid_request_error',
          message: 'Image could not be processed.',
        },
      }),
    })) as unknown as typeof fetch

    try {
      const response = await handleAnalyze(
        analyzeRequest('Please analyse this proof screenshot.'),
        ledger
      )
      const payload = await response.json()

      expect(response.status).toBe(502)
      expect(payload).toMatchObject({
        status: 'ERROR',
        error:
          'This proof image could not be read by the analysis service. Try a smaller JPG, PNG or WebP screenshot. Nothing has been recorded.',
      })
      expect(payload.error).not.toContain('status 400')
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(
            `^\\[proof-ledger\\] analysis service rejected proof: status=400 category=image providerType=invalid_request_error attempt=plain_json mime=image/png bytes=${PNG_BYTES.byteLength} aiMime=image/jpeg aiBytes=\\d+$`
          )
        )
      )
      expect(await ledger.listTransactions()).toHaveLength(0)
      expect(await ledger.getEvidenceMeta('ev-0002')).toBeNull()
    } finally {
      errorSpy.mockRestore()
    }
  })

  it('sends a normalized JPEG copy to analysis while keeping original evidence unchanged', async () => {
    const ledger = await seededLedger()
    let requestBody: {
      messages: Array<{ content: Array<{ source?: { media_type?: string; data?: string } }> }>
    } | null = null
    global.fetch = jest.fn(async (_url, init) => {
      requestBody = JSON.parse(String(init?.body))
      return toolReply({
        type: 'WITHDRAWAL',
        date: '2026-08-11',
        amountCents: CAD(100),
        reason: 'Withdrawal',
        requiredRepaymentCents: CAD(120),
        confidence: 'HIGH',
        observations: 'Screenshot shows a CAD $100 withdrawal.',
      })
    }) as unknown as typeof fetch

    const response = await handleAnalyze(
      analyzeRequest('I withdrew CAD $100 and need to return CAD $120.'),
      ledger
    )
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.status).toBe('PROPOSAL')
    expect(requestBody?.messages[0]?.content[0]?.source?.media_type).toBe('image/jpeg')
    expect(requestBody?.messages[0]?.content[0]?.source?.data).not.toBe(
      PNG_BYTES.toString('base64')
    )

    const evidence = await ledger.getEvidenceMeta(payload.evidence.id)
    expect(evidence).toMatchObject({
      mimeType: 'image/png',
      byteSize: PNG_BYTES.byteLength,
    })
  })

  // Test 11
  it('stores no evidence row and no transaction when a conflict is detected', async () => {
    const ledger = await seededLedger()
    global.fetch = jest.fn(async () =>
      toolReply({
        type: 'BASE_DEPOSIT',
        date: '2026-08-11',
        amountCents: CAD(5000),
        reason: 'Deposit',
        confidence: 'LOW',
        conflict: {
          field: 'amount',
          screenshotValue: 'CAD $500.00',
          instructionValue: 'CAD $5,000.00',
          detail: 'Amounts disagree.',
        },
        observations: '',
      })
    ) as unknown as typeof fetch

    const response = await handleAnalyze(
      analyzeRequest('I deposited CAD $5,000 toward the original balance.'),
      ledger
    )
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.status).toBe('CONFLICT')
    expect(payload.message).toBe('Evidence Conflict Detected')
    expect(await ledger.listTransactions()).toHaveLength(0)
    expect(await ledger.getEvidenceMeta('ev-0002')).toBeNull()
  })

  it('rejects an analysis request from a viewer', async () => {
    const ledger = await seededLedger()
    const response = await handleAnalyze(
      analyzeRequest('I deposited CAD $500.', 'VIEWER'),
      ledger
    )
    expect(response.status).toBe(403)
    expect(await ledger.listTransactions()).toHaveLength(0)
  })

  it('stops when a proposal breaks a ledger rule, before storing evidence', async () => {
    const ledger = await seededLedger()
    global.fetch = jest.fn(async () =>
      toolReply({
        type: 'WITHDRAWAL_REPAYMENT',
        date: '2026-08-11',
        amountCents: CAD(120),
        reason: 'Repayment',
        linkedTransactionCode: 'TX-404',
        confidence: 'HIGH',
        observations: '',
      })
    ) as unknown as typeof fetch

    const response = await handleAnalyze(
      analyzeRequest('This CAD $120 deposit repays TX-404.'),
      ledger
    )
    const payload = await response.json()

    expect(payload.status).toBe('REJECTED')
    expect(payload.code).toBe('LINK_NOT_FOUND')
    expect(await ledger.listTransactions()).toHaveLength(0)
    expect(await ledger.getEvidenceMeta('ev-0002')).toBeNull()
  })
})

describe('evidence intake rules', () => {
  it('accepts a supported image and fingerprints it', () => {
    const result = validateEvidence(PNG_BYTES, 'image/png')
    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error('unreachable')
    expect(result.mimeType).toBe('image/png')
    expect(result.byteSize).toBe(PNG_BYTES.byteLength)
    expect(result.sha256).toMatch(/^[0-9a-f]{64}$/)
  })

  it('rejects unsupported types, empty files and oversized files', () => {
    expect(validateEvidence(PNG_BYTES, 'application/pdf')).toMatchObject({
      ok: false,
      code: 'UNSUPPORTED_TYPE',
    })
    expect(validateEvidence(Buffer.alloc(0), 'image/png')).toMatchObject({
      ok: false,
      code: 'EMPTY',
    })
    expect(validateEvidence(Buffer.alloc(9 * 1024 * 1024), 'image/png')).toMatchObject({
      ok: false,
      code: 'TOO_LARGE',
    })
    expect(validateEvidence(null, 'image/png')).toMatchObject({ ok: false, code: 'MISSING' })
  })
})
