/**
 * @jest-environment node
 *
 * Proof Ledger — deterministic financial engine.
 *
 * These specs are the acceptance criteria for the money model: the base
 * obligation, withdrawal principal and extra repayment added are three
 * separate layers, and they must stay separate.
 */

import { LedgerRuleError } from '../ledger/apply'
import { computeWithdrawalTotals } from '../ledger/engine'
import { DEFAULT_ORIGINAL_OBLIGATION_CENTS } from '../ledger/types'
import { applyRecord, CAD, makeLedger, summaryOf, withdrawalsOf } from './helpers'

describe('opening obligation', () => {
  // Test 1
  it('starts at CAD $36,000 with no transactions', async () => {
    const ledger = await makeLedger()
    const summary = await summaryOf(ledger)

    expect(DEFAULT_ORIGINAL_OBLIGATION_CENTS).toBe(3_600_000)
    expect(summary.originalObligationCents).toBe(CAD(36000))
    expect(summary.baseDepositedCents).toBe(0)
    expect(summary.baseRemainingCents).toBe(CAD(36000))
    expect(summary.openWithdrawalRepaymentCents).toBe(0)
    expect(summary.totalExtraRepaymentAddedCents).toBe(0)
    expect(summary.totalCurrentlyOutstandingCents).toBe(CAD(36000))
  })

  it('refuses to apply any record before the obligation is locked', async () => {
    const { MemoryLedgerRepository } = await import('../database/memory-repository')
    const { prepareRecord } = await import('../ledger/apply')
    const repository = new MemoryLedgerRepository()
    const config = await repository.ensureConfig(CAD(36000))

    expect(() =>
      prepareRecord(config, [], {
        type: 'BASE_DEPOSIT',
        date: '2026-08-11',
        amountCents: CAD(500),
        reason: 'early',
        evidenceId: 'ev-1',
        evidenceSha256: 'a'.repeat(64),
      })
    ).toThrow(LedgerRuleError)
  })
})

describe('base obligation layer', () => {
  // Test 2
  it('reduces base remaining by a base deposit only', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })

    const summary = await summaryOf(ledger)
    expect(summary.baseDepositedCents).toBe(CAD(500))
    expect(summary.baseRemainingCents).toBe(CAD(35500))
    expect(summary.totalCurrentlyOutstandingCents).toBe(CAD(35500))
  })
})

describe('withdrawal layer', () => {
  // Test 3
  it('keeps principal, extra and required repayment separate and leaves base untouched', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })

    const [withdrawal] = await withdrawalsOf(ledger)
    expect(withdrawal.principalCents).toBe(CAD(100))
    expect(withdrawal.extraRepaymentCents).toBe(CAD(20))
    expect(withdrawal.requiredRepaymentCents).toBe(CAD(120))
    expect(withdrawal.baseEffectCents).toBe(0)
    expect(withdrawal.status).toBe('OPEN')

    const summary = await summaryOf(ledger)
    expect(summary.baseRemainingCents).toBe(CAD(35500))
    expect(summary.openWithdrawalRepaymentCents).toBe(CAD(120))
    expect(summary.totalCurrentlyOutstandingCents).toBe(CAD(35620))
  })

  // Test 5
  it('never invents an extra repayment', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, { type: 'WITHDRAWAL', amountCents: CAD(100) })

    const [withdrawal] = await withdrawalsOf(ledger)
    expect(withdrawal.principalCents).toBe(CAD(100))
    expect(withdrawal.extraRepaymentCents).toBe(0)
    expect(withdrawal.requiredRepaymentCents).toBe(CAD(100))
  })

  it('rejects a required repayment below the principal', async () => {
    const ledger = await makeLedger()
    await expect(
      applyRecord(ledger, {
        type: 'WITHDRAWAL',
        amountCents: CAD(100),
        requiredRepaymentCents: CAD(80),
      })
    ).rejects.toThrow(/cannot be lower/i)
  })

  // Test 6
  it('totals principal and extra separately across several withdrawals', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    await applyRecord(ledger, { type: 'WITHDRAWAL', amountCents: CAD(250) })
    await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(150),
      requiredRepaymentCents: CAD(180),
    })

    const totals = computeWithdrawalTotals(await withdrawalsOf(ledger))
    expect(totals.totalPrincipalWithdrawnCents).toBe(CAD(500))
    expect(totals.totalExtraRepaymentAddedCents).toBe(CAD(50))
    expect(totals.totalRequiredRepaymentCents).toBe(CAD(550))
    expect(
      totals.totalPrincipalWithdrawnCents + totals.totalExtraRepaymentAddedCents
    ).toBe(totals.totalRequiredRepaymentCents)
  })
})

describe('withdrawal repayment', () => {
  // Test 7
  it('reports PARTIAL with the correct remaining amount', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    await applyRecord(ledger, {
      type: 'WITHDRAWAL_REPAYMENT',
      amountCents: CAD(50),
      linkedTransactionCode: withdrawal.transactionCode,
    })

    const [view] = await withdrawalsOf(ledger)
    expect(view.principalCents).toBe(CAD(100))
    expect(view.extraRepaymentCents).toBe(CAD(20))
    expect(view.requiredRepaymentCents).toBe(CAD(120))
    expect(view.repaymentAppliedCents).toBe(CAD(50))
    expect(view.repaymentRemainingCents).toBe(CAD(70))
    expect(view.status).toBe('PARTIAL')

    const summary = await summaryOf(ledger)
    expect(summary.baseRemainingCents).toBe(CAD(35500))
    expect(summary.totalCurrentlyOutstandingCents).toBe(CAD(35570))
  })

  // Test 4
  it('closes the withdrawal on full repayment without touching the base', async () => {
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

    const [view] = await withdrawalsOf(ledger)
    expect(view.repaymentRemainingCents).toBe(0)
    expect(view.status).toBe('CLOSED')

    const summary = await summaryOf(ledger)
    expect(summary.baseRemainingCents).toBe(CAD(35500))
    expect(summary.totalCurrentlyOutstandingCents).toBe(CAD(35500))
    expect(summary.totalExtraRepaymentAddedCents).toBe(CAD(20))
  })

  // Test 8
  it('can never reduce the base obligation', async () => {
    const ledger = await makeLedger()
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    const before = await summaryOf(ledger)

    const repayment = await applyRecord(ledger, {
      type: 'WITHDRAWAL_REPAYMENT',
      amountCents: CAD(120),
      linkedTransactionCode: withdrawal.transactionCode,
    })

    expect(repayment.baseEffectCents).toBe(0)
    const after = await summaryOf(ledger)
    expect(after.baseRemainingCents).toBe(before.baseRemainingCents)
    expect(after.baseDepositedCents).toBe(0)
  })

  it('requires a link to an existing withdrawal', async () => {
    const ledger = await makeLedger()
    await expect(
      applyRecord(ledger, { type: 'WITHDRAWAL_REPAYMENT', amountCents: CAD(50) })
    ).rejects.toThrow(/must be linked/i)

    await expect(
      applyRecord(ledger, {
        type: 'WITHDRAWAL_REPAYMENT',
        amountCents: CAD(50),
        linkedTransactionCode: 'TX-099',
      })
    ).rejects.toThrow(/does not exist/i)
  })

  it('rejects a repayment larger than what is outstanding', async () => {
    const ledger = await makeLedger()
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    await expect(
      applyRecord(ledger, {
        type: 'WITHDRAWAL_REPAYMENT',
        amountCents: CAD(200),
        linkedTransactionCode: withdrawal.transactionCode,
      })
    ).rejects.toThrow(/outstanding/i)
  })

  it('rejects a repayment against an already closed withdrawal', async () => {
    const ledger = await makeLedger()
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
    })
    await applyRecord(ledger, {
      type: 'WITHDRAWAL_REPAYMENT',
      amountCents: CAD(100),
      linkedTransactionCode: withdrawal.transactionCode,
    })
    await expect(
      applyRecord(ledger, {
        type: 'WITHDRAWAL_REPAYMENT',
        amountCents: CAD(10),
        linkedTransactionCode: withdrawal.transactionCode,
      })
    ).rejects.toThrow(/already fully repaid/i)
  })

  // Test 9
  it('base deposits never silently close a withdrawal', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })

    const [view] = await withdrawalsOf(ledger)
    expect(view.status).toBe('OPEN')
    expect(view.repaymentAppliedCents).toBe(0)
    expect(view.repaymentRemainingCents).toBe(CAD(120))

    const summary = await summaryOf(ledger)
    expect(summary.baseRemainingCents).toBe(CAD(35500))
    expect(summary.openWithdrawalRepaymentCents).toBe(CAD(120))
  })
})

describe('historical versus current totals', () => {
  // Test 17
  it('keeps closed withdrawals in historical totals but out of the current balance', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    await applyRecord(ledger, {
      type: 'WITHDRAWAL_REPAYMENT',
      amountCents: CAD(50),
      linkedTransactionCode: withdrawal.transactionCode,
    })
    await applyRecord(ledger, {
      type: 'WITHDRAWAL_REPAYMENT',
      amountCents: CAD(70),
      linkedTransactionCode: withdrawal.transactionCode,
    })

    const summary = await summaryOf(ledger)
    const totals = summary.withdrawalTotals

    expect(totals.totalPrincipalWithdrawnCents).toBe(CAD(100))
    expect(totals.totalExtraRepaymentAddedCents).toBe(CAD(20))
    expect(totals.totalRequiredRepaymentCents).toBe(CAD(120))
    expect(totals.totalRepaymentPaidCents).toBe(CAD(120))
    expect(totals.withdrawalRepaymentRemainingCents).toBe(0)
    expect(totals.openWithdrawalCount).toBe(0)

    expect(summary.openWithdrawalRepaymentCents).toBe(0)
    expect(summary.baseRemainingCents).toBe(CAD(35500))
    expect(summary.totalCurrentlyOutstandingCents).toBe(CAD(35500))
  })

  // Test 18
  it('does not double-count extra repayment in the total outstanding', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(150),
      requiredRepaymentCents: CAD(180),
    })

    const summary = await summaryOf(ledger)

    const correct =
      summary.baseRemainingCents + summary.openWithdrawalRepaymentCents
    const doubleCounted = correct + summary.totalExtraRepaymentAddedCents

    expect(summary.totalCurrentlyOutstandingCents).toBe(correct)
    expect(summary.totalCurrentlyOutstandingCents).not.toBe(doubleCounted)
    expect(summary.totalCurrentlyOutstandingCents).toBe(CAD(35800))
    expect(summary.totalExtraRepaymentAddedCents).toBe(CAD(50))
  })
})

describe('final acceptance scenario', () => {
  it('walks the locked CAD $36,000 example end to end', async () => {
    const ledger = await makeLedger()

    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    expect((await summaryOf(ledger)).baseRemainingCents).toBe(CAD(35500))

    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })

    let summary = await summaryOf(ledger)
    expect(summary.baseRemainingCents).toBe(CAD(35500))
    expect(summary.withdrawalTotals.totalPrincipalWithdrawnCents).toBe(CAD(100))
    expect(summary.withdrawalTotals.totalExtraRepaymentAddedCents).toBe(CAD(20))
    expect(summary.openWithdrawalRepaymentCents).toBe(CAD(120))
    expect(summary.totalCurrentlyOutstandingCents).toBe(CAD(35620))

    await applyRecord(ledger, {
      type: 'WITHDRAWAL_REPAYMENT',
      amountCents: CAD(50),
      linkedTransactionCode: withdrawal.transactionCode,
    })

    let [view] = await withdrawalsOf(ledger)
    expect(view.repaymentRemainingCents).toBe(CAD(70))
    expect(view.status).toBe('PARTIAL')
    summary = await summaryOf(ledger)
    expect(summary.baseRemainingCents).toBe(CAD(35500))
    expect(summary.totalCurrentlyOutstandingCents).toBe(CAD(35570))

    await applyRecord(ledger, {
      type: 'WITHDRAWAL_REPAYMENT',
      amountCents: CAD(70),
      linkedTransactionCode: withdrawal.transactionCode,
    })

    ;[view] = await withdrawalsOf(ledger)
    expect(view.repaymentRemainingCents).toBe(0)
    expect(view.status).toBe('CLOSED')

    summary = await summaryOf(ledger)
    expect(summary.baseRemainingCents).toBe(CAD(35500))
    expect(summary.totalCurrentlyOutstandingCents).toBe(CAD(35500))
    expect(summary.withdrawalTotals.totalPrincipalWithdrawnCents).toBe(CAD(100))
    expect(summary.withdrawalTotals.totalExtraRepaymentAddedCents).toBe(CAD(20))
    expect(summary.withdrawalTotals.totalRequiredRepaymentCents).toBe(CAD(120))
    expect(summary.withdrawalTotals.withdrawalRepaymentRemainingCents).toBe(0)
  })
})

describe('transaction codes', () => {
  it('numbers records TX-001 upward with a separate database key', async () => {
    const ledger = await makeLedger()
    const first = await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    const second = await applyRecord(ledger, { type: 'WITHDRAWAL', amountCents: CAD(100) })

    expect(first.transactionCode).toBe('TX-001')
    expect(second.transactionCode).toBe('TX-002')
    expect(first.id).not.toBe(first.transactionCode)
  })
})
