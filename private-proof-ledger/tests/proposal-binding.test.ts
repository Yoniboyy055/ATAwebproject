/**
 * @jest-environment node
 *
 * Proof Ledger — signed proposal binding.
 *
 * "Apply Record" can only apply the exact proposal the server signed. These
 * specs attack the seam between analysis and approval.
 */

import { NextRequest } from 'next/server'

import { hashLedgerPassword } from '../auth/passwords'
import {
  PROPOSAL_TTL_MS,
  resolveProposalSecret,
  signProposal,
  verifyProposal,
} from '../auth/proposal-token'
import { LEDGER_SESSION_COOKIE, createSessionToken } from '../auth/session'
import { MemoryLedgerRepository } from '../database/memory-repository'
import { headHash, sha256Hex } from '../ledger/hash-chain'
import { handleApplyRecord } from '../server/handlers'
import { addEvidence, CAD, makeLedger, summaryOf } from './helpers'

const SESSION_SECRET = 'test-session-secret-value-that-is-long-enough'
const INSTRUCTION = 'I deposited CAD $500 toward the original balance.'

function ownerRequest(body: unknown): NextRequest {
  const request = new NextRequest('http://ledger.test/api/proof-ledger/transactions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.9' },
    body: JSON.stringify(body),
  })
  request.cookies.set(LEDGER_SESSION_COOKIE, createSessionToken('OWNER', 1, SESSION_SECRET))
  return request
}

async function seeded(): Promise<MemoryLedgerRepository> {
  const ledger = await makeLedger()
  await ledger.seedCredential('OWNER', process.env.LEDGER_OWNER_PASSWORD_HASH as string)
  return ledger
}

/** Build the proposal the server would have signed for a CAD $500 deposit. */
async function issueProposal(
  ledger: MemoryLedgerRepository,
  overrides: Partial<Parameters<typeof signProposal>[0]> = {}
) {
  const { evidenceId, evidenceSha256 } = await addEvidence(ledger)
  const transactions = await ledger.listTransactions()
  const secret = resolveProposalSecret() as string

  const payload = {
    type: 'BASE_DEPOSIT' as const,
    date: '2026-08-11',
    amountCents: CAD(500),
    reason: 'Deposit toward the original balance',
    requiredRepaymentCents: null,
    linkedTransactionCode: null,
    adjustmentScope: null,
    adjustmentEffectCents: null,
    correctsTransactionCode: null,
    evidenceId,
    evidenceSha256,
    originalInstruction: INSTRUCTION,
    instructionSha256: sha256Hex(INSTRUCTION),
    ledgerHeadHash: headHash(transactions),
    ...overrides,
  }

  return { token: signProposal(payload, secret), payload, secret }
}

beforeAll(async () => {
  process.env.LEDGER_SESSION_SECRET = SESSION_SECRET
  process.env.LEDGER_OWNER_PASSWORD_HASH = await hashLedgerPassword('owner-password-2026')
  delete process.env.LEDGER_PROPOSAL_SECRET
})

describe('proposal signing key', () => {
  it('derives a key distinct from the session secret', () => {
    const derived = resolveProposalSecret({
      LEDGER_SESSION_SECRET: SESSION_SECRET,
    } as unknown as NodeJS.ProcessEnv)
    expect(derived).toBeTruthy()
    expect(derived).not.toBe(SESSION_SECRET)
  })

  it('prefers an explicit LEDGER_PROPOSAL_SECRET when configured', () => {
    const explicit = 'a-dedicated-proposal-signing-secret-value'
    expect(
      resolveProposalSecret({
        LEDGER_SESSION_SECRET: SESSION_SECRET,
        LEDGER_PROPOSAL_SECRET: explicit,
      } as unknown as NodeJS.ProcessEnv)
    ).toBe(explicit)
  })

  it('refuses to sign when nothing is configured', () => {
    expect(resolveProposalSecret({} as unknown as NodeJS.ProcessEnv)).toBeNull()
  })
})

describe('token verification', () => {
  it('rejects a token signed with a different key', async () => {
    const ledger = await seeded()
    const { token } = await issueProposal(ledger)
    expect(verifyProposal(token, 'a-completely-different-secret-value-x').ok).toBe(false)
  })

  it('rejects a token whose body was edited', async () => {
    const ledger = await seeded()
    const { token, secret } = await issueProposal(ledger)
    const [body, signature] = [token.slice(0, token.lastIndexOf('.')), token.slice(token.lastIndexOf('.') + 1)]
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
    decoded.amountCents = CAD(100000)
    const tampered = `${Buffer.from(JSON.stringify(decoded)).toString('base64url')}.${signature}`

    const verification = verifyProposal(tampered, secret)
    expect(verification.ok).toBe(false)
    if (verification.ok) throw new Error('unreachable')
    expect(verification.reason).toBe('BAD_SIGNATURE')
  })

  it('rejects an expired token', async () => {
    const ledger = await seeded()
    const { payload, secret } = await issueProposal(ledger)
    const token = signProposal(payload, secret, Date.now() - PROPOSAL_TTL_MS - 1000)
    const verification = verifyProposal(token, secret)
    expect(verification.ok).toBe(false)
    if (verification.ok) throw new Error('unreachable')
    expect(verification.reason).toBe('EXPIRED')
  })
})

describe('apply is bound to the signed proposal', () => {
  it('applies exactly what was signed', async () => {
    const ledger = await seeded()
    const { token } = await issueProposal(ledger)

    const response = await handleApplyRecord(
      ownerRequest({ proposalToken: token, confirm: true }),
      ledger
    )
    expect(response.status).toBe(201)

    const [applied] = await ledger.listTransactions()
    expect(applied.amountCents).toBe(CAD(500))
    expect(applied.type).toBe('BASE_DEPOSIT')
    expect(applied.instructionSha256).toBe(sha256Hex(INSTRUCTION))
    expect(applied.originalInstruction).toBe(INSTRUCTION)
    expect((await summaryOf(ledger)).baseRemainingCents).toBe(CAD(35500))
  })

  it('ignores transaction facts sent alongside the token', async () => {
    const ledger = await seeded()
    const { token } = await issueProposal(ledger)

    // The browser tries to smuggle a different amount, date and type.
    const response = await handleApplyRecord(
      ownerRequest({
        proposalToken: token,
        confirm: true,
        amountCents: CAD(100000),
        date: '2020-01-01',
        type: 'WITHDRAWAL',
        requiredRepaymentCents: CAD(999999),
      }),
      ledger
    )
    expect(response.status).toBe(201)

    const [applied] = await ledger.listTransactions()
    expect(applied.amountCents).toBe(CAD(500))
    expect(applied.date).toBe('2026-08-11')
    expect(applied.type).toBe('BASE_DEPOSIT')
    expect(applied.requiredRepaymentCents).toBeNull()
  })

  const alterations: Array<[string, Record<string, unknown>]> = [
    ['amount', { amountCents: CAD(1000) }],
    ['date', { date: '2020-01-01' }],
    ['type', { type: 'WITHDRAWAL' }],
    ['required repayment', { requiredRepaymentCents: CAD(999) }],
    ['evidence id', { evidenceId: 'ev-does-not-exist' }],
  ]

  it.each(alterations)('rejects a token whose %s was altered', async (_label, patch) => {
    const ledger = await seeded()
    const { token, secret } = await issueProposal(ledger)

    const body = token.slice(0, token.lastIndexOf('.'))
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
    Object.assign(decoded, patch)
    // Re-signing is impossible without the key, so the attacker keeps the
    // original signature over the original body.
    const forged = `${Buffer.from(JSON.stringify(decoded)).toString('base64url')}.${token.slice(
      token.lastIndexOf('.') + 1
    )}`

    expect(verifyProposal(forged, secret).ok).toBe(false)

    const response = await handleApplyRecord(
      ownerRequest({ proposalToken: forged, confirm: true }),
      ledger
    )
    expect(response.status).toBe(400)
    expect(await ledger.listTransactions()).toHaveLength(0)
  })

  it('rejects a replayed token after the record was applied', async () => {
    const ledger = await seeded()
    const { token } = await issueProposal(ledger)

    const first = await handleApplyRecord(
      ownerRequest({ proposalToken: token, confirm: true }),
      ledger
    )
    expect(first.status).toBe(201)

    const replay = await handleApplyRecord(
      ownerRequest({ proposalToken: token, confirm: true }),
      ledger
    )
    expect(replay.status).toBe(409)
    const payload = await replay.json()
    expect(payload.code).toBe('CHAIN_MOVED')
    expect(await ledger.listTransactions()).toHaveLength(1)
  })

  it('rejects a token issued against a different chain head', async () => {
    const ledger = await seeded()
    const { token } = await issueProposal(ledger, { ledgerHeadHash: 'some-other-head' })

    const response = await handleApplyRecord(
      ownerRequest({ proposalToken: token, confirm: true }),
      ledger
    )
    expect(response.status).toBe(409)
    expect(await ledger.listTransactions()).toHaveLength(0)
  })

  it('rejects an expired token at the handler', async () => {
    const ledger = await seeded()
    const { payload, secret } = await issueProposal(ledger)
    const expired = signProposal(payload, secret, Date.now() - PROPOSAL_TTL_MS - 1000)

    const response = await handleApplyRecord(
      ownerRequest({ proposalToken: expired, confirm: true }),
      ledger
    )
    expect(response.status).toBe(400)
    expect((await response.json()).code).toBe('EXPIRED')
    expect(await ledger.listTransactions()).toHaveLength(0)
  })

  it('rejects a token whose evidence bytes changed after analysis', async () => {
    const ledger = await seeded()
    const { token, payload } = await issueProposal(ledger)

    // Someone swaps the stored screenshot between analysis and approval.
    ledger.tamperWithEvidence(payload.evidenceId, Buffer.from('different-screenshot'))

    const response = await handleApplyRecord(
      ownerRequest({ proposalToken: token, confirm: true }),
      ledger
    )
    expect(response.status).toBe(400)
    expect((await response.json()).code).toBe('EVIDENCE_HASH_MISMATCH')
    expect(await ledger.listTransactions()).toHaveLength(0)
  })

  it('requires an explicit confirmation', async () => {
    const ledger = await seeded()
    const { token } = await issueProposal(ledger)
    const response = await handleApplyRecord(
      ownerRequest({ proposalToken: token, confirm: false }),
      ledger
    )
    expect(response.status).toBe(400)
    expect(await ledger.listTransactions()).toHaveLength(0)
  })
})

describe('applied records verify end to end', () => {
  it('produces a record whose hash already covers the instruction', async () => {
    const { verifyLedgerIntegrity } = await import('../ledger/hash-chain')
    const ledger = await seeded()
    const { token } = await issueProposal(ledger)

    const response = await handleApplyRecord(
      ownerRequest({ proposalToken: token, confirm: true }),
      ledger
    )
    expect(response.status).toBe(201)

    const result = await verifyLedgerIntegrity(await ledger.listTransactions(), (id) =>
      ledger.getEvidence(id)
    )
    expect(result.failures).toEqual([])
    expect(result.ok).toBe(true)
    expect(result.evidenceChecked).toBe(1)
  })

  it('rejects a token whose instruction was swapped for one with a different hash', async () => {
    const ledger = await seeded()
    const { payload, secret } = await issueProposal(ledger)
    const mismatched = signProposal(
      { ...payload, originalInstruction: 'A completely different instruction.' },
      secret
    )

    const response = await handleApplyRecord(
      ownerRequest({ proposalToken: mismatched, confirm: true }),
      ledger
    )
    expect(response.status).toBe(400)
    expect((await response.json()).code).toBe('INSTRUCTION_HASH_MISMATCH')
    expect(await ledger.listTransactions()).toHaveLength(0)
  })
})
