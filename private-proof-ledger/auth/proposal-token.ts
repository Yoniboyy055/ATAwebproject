/**
 * Proof Ledger — signed proposal tokens.
 *
 * After a screenshot has been analysed and the resulting proposal has survived
 * validation and the deterministic ledger rules, the server signs the exact
 * proposal it approved. "Apply Record" then submits only that token.
 *
 * This means the browser cannot substitute a different amount, date, type,
 * required repayment or screenshot between the proposal the owner reviewed and
 * the record that is written.
 */

import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

import { AdjustmentScope, TransactionType } from '../ledger/types'

export const PROPOSAL_TTL_MS = 20 * 60 * 1000

/** Everything the signature covers. */
export interface SignedProposalPayload {
  type: TransactionType
  date: string
  amountCents: number
  reason: string
  requiredRepaymentCents: number | null
  linkedTransactionCode: string | null
  adjustmentScope: AdjustmentScope | null
  adjustmentEffectCents: number | null
  correctsTransactionCode: string | null
  evidenceId: string
  evidenceSha256: string
  /** The owner's own words, preserved verbatim with the record. */
  originalInstruction: string
  instructionSha256: string
  /** Head of the chain when the proposal was issued. Replay protection. */
  ledgerHeadHash: string | null
  issuedAt: number
  expiresAt: number
  nonce: string
}

export type ProposalVerificationFailure =
  | 'MALFORMED'
  | 'BAD_SIGNATURE'
  | 'EXPIRED'

export type ProposalVerification =
  | { ok: true; payload: SignedProposalPayload }
  | { ok: false; reason: ProposalVerificationFailure }

/**
 * Derive a distinct signing key so proposal tokens and session cookies can
 * never be confused for one another, even when only one secret is configured.
 */
export function resolveProposalSecret(env: NodeJS.ProcessEnv = process.env): string | null {
  const explicit = env.LEDGER_PROPOSAL_SECRET
  if (explicit && explicit.length >= 32) return explicit

  const session = env.LEDGER_SESSION_SECRET
  if (!session || session.length < 32) return null
  return createHmac('sha256', session)
    .update('proof-ledger/proposal-signing/v1')
    .digest('hex')
}

function sign(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('base64url')
}

export function signProposal(
  payload: Omit<SignedProposalPayload, 'issuedAt' | 'expiresAt' | 'nonce'>,
  secret: string,
  now: number = Date.now(),
  ttlMs: number = PROPOSAL_TTL_MS
): string {
  const complete: SignedProposalPayload = {
    ...payload,
    issuedAt: now,
    expiresAt: now + ttlMs,
    nonce: randomBytes(12).toString('base64url'),
  }
  const body = Buffer.from(JSON.stringify(complete), 'utf8').toString('base64url')
  return `${body}.${sign(body, secret)}`
}

export function verifyProposal(
  token: string | undefined | null,
  secret: string | undefined | null,
  now: number = Date.now()
): ProposalVerification {
  if (!token || !secret) return { ok: false, reason: 'MALFORMED' }

  const separator = token.lastIndexOf('.')
  if (separator <= 0) return { ok: false, reason: 'MALFORMED' }

  const body = token.slice(0, separator)
  const signature = token.slice(separator + 1)

  const expected = sign(body, secret)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: 'BAD_SIGNATURE' }
  }

  let payload: SignedProposalPayload
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
  } catch {
    return { ok: false, reason: 'MALFORMED' }
  }

  if (typeof payload?.expiresAt !== 'number' || typeof payload?.evidenceId !== 'string') {
    return { ok: false, reason: 'MALFORMED' }
  }
  if (payload.expiresAt <= now) return { ok: false, reason: 'EXPIRED' }

  return { ok: true, payload }
}
