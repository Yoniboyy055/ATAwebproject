/**
 * @jest-environment node
 *
 * Proof Ledger — scoped adjustments.
 *
 * A correction never rewrites the record it references. The original stays
 * exactly as recorded, the adjustment sits beside it in history, and the
 * engine derives the effective financial truth from both.
 */

import { computeWithdrawalTotals } from '../ledger/engine'
import { verifyChain } from '../ledger/hash-chain'
import { applyRecord, CAD, makeLedger, summaryOf, withdrawalsOf } from './helpers'

async function withdrawalOf(ledger: Awaited<ReturnType<typeof makeLedger>>) {
  const [view] = await withdrawalsOf(ledger)
  return view
}

describe('extra repayment corrections', () => {
  it('reduces the effective extra without touching the original record', async () => {
    const ledger = await makeLedger()
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })

    await applyRecord(ledger, {
      type: 'ADJUSTMENT',
      amountCents: 0,
      adjustmentScope: 'WITHDRAWAL_EXTRA',
      adjustmentEffectCents: -CAD(10),
      correctsTransactionCode: withdrawal.transactionCode,
      reason: 'Agreed extra was CAD $10, not CAD $20',
    })

    const view = await withdrawalOf(ledger)
    expect(view.originalPrincipalCents).toBe(CAD(100))
    expect(view.originalExtraRepaymentCents).toBe(CAD(20))
    expect(view.extraAdjustmentCents).toBe(-CAD(10))
    expect(view.extraRepaymentCents).toBe(CAD(10))
    expect(view.principalCents).toBe(CAD(100))
    expect(view.requiredRepaymentCents).toBe(CAD(110))
    expect(view.hasAdjustments).toBe(true)

    // The original withdrawal row is untouched.
    const transactions = await ledger.listTransactions()
    const original = transactions.find((tx) => tx.transactionCode === withdrawal.transactionCode)
    expect(original?.withdrawalPrincipalCents).toBe(CAD(100))
    expect(original?.extraRepaymentCents).toBe(CAD(20))
    expect(original?.requiredRepaymentCents).toBe(CAD(120))

    // The adjustment is visible in history.
    const adjustment = transactions.find((tx) => tx.type === 'ADJUSTMENT')
    expect(adjustment?.adjustmentScope).toBe('WITHDRAWAL_EXTRA')
    expect(adjustment?.adjustmentEffectCents).toBe(-CAD(10))
    expect(adjustment?.correctsTransactionId).toBe(withdrawal.id)
    expect(adjustment?.reason).toContain(`Corrects ${withdrawal.transactionCode}`)

    expect(verifyChain(transactions).ok).toBe(true)
  })

  it('increases the effective extra', async () => {
    const ledger = await makeLedger()
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    await applyRecord(ledger, {
      type: 'ADJUSTMENT',
      amountCents: 0,
      adjustmentScope: 'WITHDRAWAL_EXTRA',
      adjustmentEffectCents: CAD(15),
      correctsTransactionCode: withdrawal.transactionCode,
      reason: 'Agreed extra was CAD $35',
    })

    const view = await withdrawalOf(ledger)
    expect(view.extraRepaymentCents).toBe(CAD(35))
    expect(view.requiredRepaymentCents).toBe(CAD(135))
  })

  it('never moves the base obligation', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    const before = await summaryOf(ledger)

    await applyRecord(ledger, {
      type: 'ADJUSTMENT',
      amountCents: 0,
      adjustmentScope: 'WITHDRAWAL_EXTRA',
      adjustmentEffectCents: -CAD(10),
      correctsTransactionCode: withdrawal.transactionCode,
      reason: 'correction',
    })

    const after = await summaryOf(ledger)
    expect(after.baseRemainingCents).toBe(before.baseRemainingCents)
    expect(after.baseRemainingCents).toBe(CAD(35500))
    expect(after.baseAdjustmentCents).toBe(0)
  })
})

describe('principal corrections', () => {
  it('corrects the effective principal', async () => {
    const ledger = await makeLedger()
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(150),
      requiredRepaymentCents: CAD(170),
    })

    await applyRecord(ledger, {
      type: 'ADJUSTMENT',
      amountCents: 0,
      adjustmentScope: 'WITHDRAWAL_PRINCIPAL',
      adjustmentEffectCents: -CAD(50),
      correctsTransactionCode: withdrawal.transactionCode,
      reason: 'Only CAD $100 was actually withdrawn',
    })

    const view = await withdrawalOf(ledger)
    expect(view.originalPrincipalCents).toBe(CAD(150))
    expect(view.principalAdjustmentCents).toBe(-CAD(50))
    expect(view.principalCents).toBe(CAD(100))
    expect(view.extraRepaymentCents).toBe(CAD(20))
    expect(view.requiredRepaymentCents).toBe(CAD(120))
  })

  it('refuses a correction that would push a withdrawal below zero', async () => {
    const ledger = await makeLedger()
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })

    await expect(
      applyRecord(ledger, {
        type: 'ADJUSTMENT',
        amountCents: 0,
        adjustmentScope: 'WITHDRAWAL_EXTRA',
        adjustmentEffectCents: -CAD(50),
        correctsTransactionCode: withdrawal.transactionCode,
        reason: 'too much',
      })
    ).rejects.toThrow(/below zero/i)
  })

  it('refuses a withdrawal-scoped correction against a base deposit', async () => {
    const ledger = await makeLedger()
    const deposit = await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })

    await expect(
      applyRecord(ledger, {
        type: 'ADJUSTMENT',
        amountCents: 0,
        adjustmentScope: 'WITHDRAWAL_PRINCIPAL',
        adjustmentEffectCents: -CAD(10),
        correctsTransactionCode: deposit.transactionCode,
        reason: 'wrong target',
      })
    ).rejects.toThrow(/not a withdrawal/i)
  })

  it('requires a scope', async () => {
    const ledger = await makeLedger()
    const withdrawal = await applyRecord(ledger, { type: 'WITHDRAWAL', amountCents: CAD(100) })

    await expect(
      applyRecord(ledger, {
        type: 'ADJUSTMENT',
        amountCents: 0,
        adjustmentEffectCents: -CAD(10),
        correctsTransactionCode: withdrawal.transactionCode,
        reason: 'no scope',
      })
    ).rejects.toThrow(/base, a withdrawal principal or an extra repayment/i)
  })
})

describe('repayments and totals after a correction', () => {
  it('recalculates status against the effective required repayment', async () => {
    const ledger = await makeLedger()
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

    expect((await withdrawalOf(ledger)).repaymentRemainingCents).toBe(CAD(70))

    await applyRecord(ledger, {
      type: 'ADJUSTMENT',
      amountCents: 0,
      adjustmentScope: 'WITHDRAWAL_EXTRA',
      adjustmentEffectCents: -CAD(10),
      correctsTransactionCode: withdrawal.transactionCode,
      reason: 'Agreed extra was CAD $10',
    })

    const view = await withdrawalOf(ledger)
    expect(view.requiredRepaymentCents).toBe(CAD(110))
    expect(view.repaymentAppliedCents).toBe(CAD(50))
    expect(view.repaymentRemainingCents).toBe(CAD(60))
    expect(view.status).toBe('PARTIAL')
  })

  it('closes the withdrawal when the correction brings required down to what was paid', async () => {
    const ledger = await makeLedger()
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    await applyRecord(ledger, {
      type: 'WITHDRAWAL_REPAYMENT',
      amountCents: CAD(110),
      linkedTransactionCode: withdrawal.transactionCode,
    })
    await applyRecord(ledger, {
      type: 'ADJUSTMENT',
      amountCents: 0,
      adjustmentScope: 'WITHDRAWAL_EXTRA',
      adjustmentEffectCents: -CAD(10),
      correctsTransactionCode: withdrawal.transactionCode,
      reason: 'Agreed extra was CAD $10',
    })

    const view = await withdrawalOf(ledger)
    expect(view.requiredRepaymentCents).toBe(CAD(110))
    expect(view.repaymentRemainingCents).toBe(0)
    expect(view.status).toBe('CLOSED')
  })

  it('reports effective totals, not the superseded originals', async () => {
    const ledger = await makeLedger()
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    await applyRecord(ledger, {
      type: 'ADJUSTMENT',
      amountCents: 0,
      adjustmentScope: 'WITHDRAWAL_EXTRA',
      adjustmentEffectCents: -CAD(10),
      correctsTransactionCode: withdrawal.transactionCode,
      reason: 'Agreed extra was CAD $10',
    })

    const totals = computeWithdrawalTotals(await withdrawalsOf(ledger))
    expect(totals.totalPrincipalWithdrawnCents).toBe(CAD(100))
    expect(totals.totalExtraRepaymentAddedCents).toBe(CAD(10))
    expect(totals.totalRequiredRepaymentCents).toBe(CAD(110))

    const summary = await summaryOf(ledger)
    expect(summary.openWithdrawalRepaymentCents).toBe(CAD(110))
    expect(summary.totalCurrentlyOutstandingCents).toBe(CAD(36110))
    // Still no double counting after a correction.
    expect(summary.totalCurrentlyOutstandingCents).toBe(
      summary.baseRemainingCents + summary.openWithdrawalRepaymentCents
    )
  })
})
