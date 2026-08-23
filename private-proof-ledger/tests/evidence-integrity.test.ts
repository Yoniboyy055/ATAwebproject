/**
 * @jest-environment node
 *
 * Proof Ledger — evidence and instruction binding, and pending-evidence
 * lifecycle.
 */

import { prepareRecord } from '../ledger/apply'
import { sha256Hex, verifyLedgerIntegrity } from '../ledger/hash-chain'
import { addEvidence, applyRecord, CAD, makeLedger } from './helpers'

const INSTRUCTION = 'I deposited CAD $500 toward the original balance.'

async function verify(ledger: Awaited<ReturnType<typeof makeLedger>>) {
  return verifyLedgerIntegrity(await ledger.listTransactions(), (id) => ledger.getEvidence(id))
}

describe('evidence and instruction hashes are part of the record hash', () => {
  it('binds both into the applied record', async () => {
    const ledger = await makeLedger()
    const record = await applyRecord(ledger, {
      type: 'BASE_DEPOSIT',
      amountCents: CAD(500),
      originalInstruction: INSTRUCTION,
    })

    expect(record.evidenceSha256).toMatch(/^[0-9a-f]{64}$/)
    expect(record.instructionSha256).toBe(sha256Hex(INSTRUCTION))
  })

  it('changes the record hash when the evidence hash changes', async () => {
    const ledger = await makeLedger()
    const config = await ledger.getConfig()
    if (!config) throw new Error('missing config')

    const base = {
      type: 'BASE_DEPOSIT' as const,
      date: '2026-08-11',
      amountCents: CAD(500),
      reason: 'Deposit',
      evidenceId: 'ev-1',
    }

    const first = prepareRecord(config, [], { ...base, evidenceSha256: 'a'.repeat(64) })
    const second = prepareRecord(config, [], { ...base, evidenceSha256: 'b'.repeat(64) })
    expect(first.record.recordHash).not.toBe(second.record.recordHash)
  })

  it('changes the record hash when the instruction changes', async () => {
    const ledger = await makeLedger()
    const config = await ledger.getConfig()
    if (!config) throw new Error('missing config')

    const base = {
      type: 'BASE_DEPOSIT' as const,
      date: '2026-08-11',
      amountCents: CAD(500),
      reason: 'Deposit',
      evidenceId: 'ev-1',
      evidenceSha256: 'a'.repeat(64),
    }

    const first = prepareRecord(config, [], { ...base, originalInstruction: INSTRUCTION })
    const second = prepareRecord(config, [], {
      ...base,
      originalInstruction: 'A completely different instruction.',
    })
    expect(first.record.recordHash).not.toBe(second.record.recordHash)
  })
})

describe('full integrity verification', () => {
  it('passes on clean history and re-hashes every screenshot', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, {
      type: 'BASE_DEPOSIT',
      amountCents: CAD(500),
      originalInstruction: INSTRUCTION,
    })
    await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
      originalInstruction: 'I withdrew CAD $100 and must return CAD $120.',
    })

    const result = await verify(ledger)
    expect(result.ok).toBe(true)
    expect(result.checkedRecords).toBe(2)
    expect(result.evidenceChecked).toBe(2)
    expect(result.failures).toEqual([])
  })

  it('reports EVIDENCE_HASH_MISMATCH when the screenshot bytes are replaced', async () => {
    const ledger = await makeLedger()
    const record = await applyRecord(ledger, {
      type: 'BASE_DEPOSIT',
      amountCents: CAD(500),
      originalInstruction: INSTRUCTION,
    })

    ledger.tamperWithEvidence(record.evidenceId as string, Buffer.from('a-different-screenshot'))

    const result = await verify(ledger)
    expect(result.ok).toBe(false)
    expect(result.failures.some((f) => f.reason === 'EVIDENCE_HASH_MISMATCH')).toBe(true)
    // The failure names the record but never echoes its contents.
    const failure = result.failures.find((f) => f.reason === 'EVIDENCE_HASH_MISMATCH')
    expect(failure?.transactionCode).toBe(record.transactionCode)
    expect(failure?.detail).not.toContain('500')
  })

  it('reports EVIDENCE_MISSING when the screenshot is gone', async () => {
    const ledger = await makeLedger()
    const record = await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })

    const result = await verifyLedgerIntegrity(await ledger.listTransactions(), async () => null)
    expect(result.ok).toBe(false)
    expect(result.failures[0]).toMatchObject({
      reason: 'EVIDENCE_MISSING',
      transactionCode: record.transactionCode,
    })
  })

  it('reports INSTRUCTION_HASH_MISMATCH when the stored instruction is reworded', async () => {
    const ledger = await makeLedger()
    const record = await applyRecord(ledger, {
      type: 'BASE_DEPOSIT',
      amountCents: CAD(500),
      originalInstruction: INSTRUCTION,
    })

    ledger.tamperWith(record.transactionCode, {
      originalInstruction: 'I deposited CAD $5,000 toward the original balance.',
    })

    const result = await verify(ledger)
    expect(result.ok).toBe(false)
    expect(result.failures.some((f) => f.reason === 'INSTRUCTION_HASH_MISMATCH')).toBe(true)
  })
})

describe('pending evidence lifecycle', () => {
  it('stores new evidence as PENDING with an expiry', async () => {
    const ledger = await makeLedger()
    const { evidenceId } = await addEvidence(ledger)
    const meta = await ledger.getEvidenceMeta(evidenceId)
    expect(meta?.status).toBe('PENDING')
    expect(meta?.expiresAt).toBeTruthy()
  })

  it('marks evidence APPLIED and permanent once its record is applied', async () => {
    const ledger = await makeLedger()
    const record = await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })

    const meta = await ledger.getEvidenceMeta(record.evidenceId as string)
    expect(meta?.status).toBe('APPLIED')
    expect(meta?.expiresAt).toBeNull()
  })

  it('deletes expired pending evidence and keeps applied evidence', async () => {
    const ledger = await makeLedger()
    const applied = await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    const abandoned = await addEvidence(ledger, Buffer.from('never-confirmed'))

    // Well past the pending expiry.
    const removed = await ledger.purgeExpiredPendingEvidence(new Date('2026-09-01T00:00:00.000Z'))

    expect(removed).toBe(1)
    expect(await ledger.getEvidenceMeta(abandoned.evidenceId)).toBeNull()
    expect(await ledger.getEvidenceMeta(applied.evidenceId as string)).not.toBeNull()
    expect((await verify(ledger)).ok).toBe(true)
  })

  it('keeps pending evidence that has not expired yet', async () => {
    const ledger = await makeLedger()
    const pending = await addEvidence(ledger, Buffer.from('still-fresh'))
    const removed = await ledger.purgeExpiredPendingEvidence(new Date('2026-08-11T10:00:00.000Z'))
    expect(removed).toBe(0)
    expect(await ledger.getEvidenceMeta(pending.evidenceId)).not.toBeNull()
  })
})
