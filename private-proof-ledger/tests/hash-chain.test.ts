/**
 * @jest-environment node
 *
 * Proof Ledger — tamper evidence and adjustments.
 */

import { computeRecordHash, verifyChain } from '../ledger/hash-chain'
import { applyRecord, CAD, makeLedger, summaryOf } from './helpers'

describe('hash chain', () => {
  // Test 15
  it('verifies an unmodified history', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    await applyRecord(ledger, {
      type: 'WITHDRAWAL_REPAYMENT',
      amountCents: CAD(120),
      linkedTransactionCode: withdrawal.transactionCode,
    })

    const result = verifyChain(await ledger.listTransactions())
    expect(result.ok).toBe(true)
    expect(result.checkedRecords).toBe(3)
    expect(result.failures).toEqual([])
  })

  it('links each record to the one before it', async () => {
    const ledger = await makeLedger()
    const first = await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    const second = await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(250) })

    expect(first.previousRecordHash).toBeNull()
    expect(second.previousRecordHash).toBe(first.recordHash)
    expect(second.recordHash).not.toBe(first.recordHash)
  })

  // Test 16
  it('fails verification when an applied amount is edited directly', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(250) })

    ledger.tamperWith('TX-001', { amountCents: CAD(5000), baseEffectCents: -CAD(5000) })

    const result = verifyChain(await ledger.listTransactions())
    expect(result.ok).toBe(false)
    expect(result.failures.some((failure) => failure.reason === 'HASH_MISMATCH')).toBe(true)
    expect(result.failures.some((failure) => failure.transactionCode === 'TX-001')).toBe(true)
  })

  it('fails verification when a record is removed from the middle', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(250) })
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(125) })

    const transactions = await ledger.listTransactions()
    const withHole = transactions.filter((tx) => tx.transactionCode !== 'TX-002')

    const result = verifyChain(withHole)
    expect(result.ok).toBe(false)
    expect(result.failures.some((failure) => failure.reason === 'SEQUENCE_GAP')).toBe(true)
    expect(result.failures.some((failure) => failure.reason === 'BROKEN_LINK')).toBe(true)
  })

  it('detects an extra-repayment column edited away from principal and required', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })

    ledger.tamperWith('TX-001', { extraRepaymentCents: 0 })

    const result = verifyChain(await ledger.listTransactions())
    expect(result.ok).toBe(false)
    expect(result.failures.some((failure) => failure.reason === 'EXTRA_MISMATCH')).toBe(true)
  })

  it('does not hash the denormalised repayment caches', async () => {
    const ledger = await makeLedger()
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    const hashBefore = withdrawal.recordHash

    await applyRecord(ledger, {
      type: 'WITHDRAWAL_REPAYMENT',
      amountCents: CAD(120),
      linkedTransactionCode: withdrawal.transactionCode,
    })

    const [updated] = await ledger.listTransactions()
    // The cache moved from OPEN/0 to CLOSED/12000 …
    expect(updated.statusCache).toBe('CLOSED')
    expect(updated.repaymentPaidCentsCache).toBe(CAD(120))
    // … while the historical record and its hash are untouched.
    expect(updated.recordHash).toBe(hashBefore)
    expect(verifyChain(await ledger.listTransactions()).ok).toBe(true)
  })

  it('produces a stable hash regardless of field ordering', () => {
    const base = {
      sequence: 1,
      transactionCode: 'TX-001',
      date: '2026-08-11',
      type: 'WITHDRAWAL' as const,
      amountCents: 10000,
      reason: 'Personal expense',
      baseEffectCents: 0,
      linkedWithdrawalId: null,
      withdrawalPrincipalCents: 10000,
      extraRepaymentCents: 2000,
      requiredRepaymentCents: 12000,
      adjustmentScope: null,
      adjustmentEffectCents: null,
      correctsTransactionId: null,
      evidenceId: 'ev-1',
      evidenceSha256: 'b'.repeat(64),
      instructionSha256: null,
    }
    const reordered = {
      instructionSha256: null,
      evidenceSha256: 'b'.repeat(64),
      evidenceId: 'ev-1',
      correctsTransactionId: null,
      adjustmentEffectCents: null,
      adjustmentScope: null,
      requiredRepaymentCents: 12000,
      extraRepaymentCents: 2000,
      withdrawalPrincipalCents: 10000,
      linkedWithdrawalId: null,
      baseEffectCents: 0,
      reason: 'Personal expense',
      amountCents: 10000,
      type: 'WITHDRAWAL' as const,
      date: '2026-08-11',
      transactionCode: 'TX-001',
      sequence: 1,
    }

    expect(computeRecordHash(base, null)).toBe(computeRecordHash(reordered, null))
    expect(computeRecordHash(base, null)).not.toBe(computeRecordHash(base, 'other'))
  })
})

describe('adjustments', () => {
  // Test 14
  it('preserves the original record and corrects it with a new one', async () => {
    const ledger = await makeLedger()
    const original = await applyRecord(ledger, {
      type: 'BASE_DEPOSIT',
      amountCents: CAD(5000),
      reason: 'Deposit entered with a typo',
    })

    const before = await summaryOf(ledger)
    expect(before.baseRemainingCents).toBe(CAD(31000))

    const adjustment = await applyRecord(ledger, {
      type: 'ADJUSTMENT',
      amountCents: 0,
      adjustmentScope: 'BASE',
      adjustmentEffectCents: CAD(4500),
      correctsTransactionCode: original.transactionCode,
      reason: 'Deposit was CAD $500, not CAD $5,000',
    })

    const transactions = await ledger.listTransactions()
    const preserved = transactions.find((tx) => tx.transactionCode === original.transactionCode)

    expect(transactions).toHaveLength(2)
    expect(preserved?.amountCents).toBe(CAD(5000))
    expect(adjustment.reason).toContain(`Corrects ${original.transactionCode}`)

    const after = await summaryOf(ledger)
    expect(after.baseAdjustmentCents).toBe(CAD(4500))
    expect(after.baseRemainingCents).toBe(CAD(35500))
    expect(verifyChain(transactions).ok).toBe(true)
  })

  it('requires a reference to the record being corrected', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })

    await expect(
      applyRecord(ledger, {
        type: 'ADJUSTMENT',
        amountCents: 0,
        adjustmentScope: 'BASE',
        adjustmentEffectCents: CAD(100),
        reason: 'no target',
      })
    ).rejects.toThrow(/must reference/i)
  })
})
