/**
 * Proof Ledger — deterministic financial engine.
 *
 * This is the single source of financial truth. AI never computes balances;
 * it only proposes structured input which is validated and then handed to the
 * functions below. Every number here is derived from transaction history, so
 * the ledger can always be reconstructed from its records.
 */

import { assertCents } from './money'
import {
  AdjustmentScope,
  LEDGER_CURRENCY,
  LedgerConfigRecord,
  LedgerNoteRecord,
  LedgerSummary,
  LedgerTransactionRecord,
  ReconciliationSnapshot,
  WithdrawalStatus,
  WithdrawalTotals,
  WithdrawalView,
} from './types'

function bySequence(a: LedgerTransactionRecord, b: LedgerTransactionRecord): number {
  return a.sequence - b.sequence
}

/** Chronological (oldest first) ordering used by every derivation below. */
export function orderTransactions(
  transactions: readonly LedgerTransactionRecord[]
): LedgerTransactionRecord[] {
  return [...transactions].sort(bySequence)
}

export function deriveWithdrawalStatus(
  requiredRepaymentCents: number,
  repaymentPaidCents: number
): WithdrawalStatus {
  if (repaymentPaidCents >= requiredRepaymentCents) return 'CLOSED'
  if (repaymentPaidCents <= 0) return 'OPEN'
  return 'PARTIAL'
}

/**
 * Sum of repayments linked to each withdrawal id.
 *
 * A `WITHDRAWAL_REPAYMENT` without a link is never applied to any withdrawal
 * and never touches the base — the apply path rejects it before it is stored.
 */
function repaymentsByWithdrawal(
  transactions: readonly LedgerTransactionRecord[]
): Map<string, number> {
  const paid = new Map<string, number>()
  for (const tx of transactions) {
    if (tx.type !== 'WITHDRAWAL_REPAYMENT') continue
    if (!tx.linkedWithdrawalId) continue
    const current = paid.get(tx.linkedWithdrawalId) ?? 0
    paid.set(tx.linkedWithdrawalId, current + tx.amountCents)
  }
  return paid
}

/**
 * Sum of adjustments applied to each withdrawal, by scope.
 *
 * An ADJUSTMENT never edits the record it corrects; it is a separate record
 * whose effect the engine folds in here.
 */
function adjustmentsByWithdrawal(
  transactions: readonly LedgerTransactionRecord[],
  scope: AdjustmentScope
): Map<string, number> {
  const totals = new Map<string, number>()
  for (const tx of transactions) {
    if (tx.type !== 'ADJUSTMENT') continue
    if (tx.adjustmentScope !== scope) continue
    if (!tx.correctsTransactionId) continue
    const current = totals.get(tx.correctsTransactionId) ?? 0
    totals.set(tx.correctsTransactionId, current + (tx.adjustmentEffectCents ?? 0))
  }
  return totals
}

/**
 * Derive the complete position of every withdrawal.
 *
 * Principal and extra repayment added are kept as separate values throughout —
 * they are never collapsed into a single required-repayment figure — and each
 * is reported as original, adjustment and effective.
 */
export function computeWithdrawalViews(
  transactions: readonly LedgerTransactionRecord[]
): WithdrawalView[] {
  const ordered = orderTransactions(transactions)
  const paidByWithdrawal = repaymentsByWithdrawal(ordered)
  const principalAdjustments = adjustmentsByWithdrawal(ordered, 'WITHDRAWAL_PRINCIPAL')
  const extraAdjustments = adjustmentsByWithdrawal(ordered, 'WITHDRAWAL_EXTRA')

  return ordered
    .filter((tx) => tx.type === 'WITHDRAWAL')
    .map((tx) => {
      const originalPrincipalCents = assertCents(
        tx.withdrawalPrincipalCents ?? tx.amountCents,
        'principal'
      )
      const originalRequiredRepaymentCents = assertCents(
        tx.requiredRepaymentCents ?? originalPrincipalCents,
        'required repayment'
      )
      // Extra is stored explicitly, but is always reconcilable as
      // required - principal so a tampered column cannot go unnoticed.
      const originalExtraRepaymentCents = Math.max(
        0,
        originalRequiredRepaymentCents - originalPrincipalCents
      )

      const principalAdjustmentCents = principalAdjustments.get(tx.id) ?? 0
      const extraAdjustmentCents = extraAdjustments.get(tx.id) ?? 0

      // Effective financial truth. Neither layer can be driven below zero.
      const principalCents = Math.max(0, originalPrincipalCents + principalAdjustmentCents)
      const extraRepaymentCents = Math.max(
        0,
        originalExtraRepaymentCents + extraAdjustmentCents
      )
      const requiredRepaymentCents = principalCents + extraRepaymentCents

      const repaymentPaidCents = paidByWithdrawal.get(tx.id) ?? 0
      const repaymentAppliedCents = Math.min(repaymentPaidCents, requiredRepaymentCents)
      const repaymentRemainingCents = Math.max(0, requiredRepaymentCents - repaymentPaidCents)
      const overpaidCents = Math.max(0, repaymentPaidCents - requiredRepaymentCents)

      return {
        id: tx.id,
        transactionCode: tx.transactionCode,
        date: tx.date,
        reason: tx.reason,
        evidenceId: tx.evidenceId,
        originalPrincipalCents,
        originalExtraRepaymentCents,
        originalRequiredRepaymentCents,
        principalAdjustmentCents,
        extraAdjustmentCents,
        hasAdjustments: principalAdjustmentCents !== 0 || extraAdjustmentCents !== 0,
        principalCents,
        extraRepaymentCents,
        requiredRepaymentCents,
        repaymentPaidCents,
        repaymentAppliedCents,
        repaymentRemainingCents,
        overpaidCents,
        status: deriveWithdrawalStatus(requiredRepaymentCents, repaymentPaidCents),
        // A withdrawal never moves the base obligation.
        baseEffectCents: 0,
      }
    })
}

/**
 * Withdrawal totals block.
 *
 * Historical totals (principal, extra, required, paid) include CLOSED
 * withdrawals. Only `withdrawalRepaymentRemainingCents` is a current figure.
 */
export function computeWithdrawalTotals(views: readonly WithdrawalView[]): WithdrawalTotals {
  const totals: WithdrawalTotals = {
    totalPrincipalWithdrawnCents: 0,
    totalExtraRepaymentAddedCents: 0,
    totalRequiredRepaymentCents: 0,
    totalRepaymentPaidCents: 0,
    withdrawalRepaymentRemainingCents: 0,
    totalOverpaidCents: 0,
    openWithdrawalCount: 0,
    withdrawalCount: views.length,
  }

  for (const view of views) {
    totals.totalPrincipalWithdrawnCents += view.principalCents
    totals.totalExtraRepaymentAddedCents += view.extraRepaymentCents
    totals.totalRequiredRepaymentCents += view.requiredRepaymentCents
    totals.totalRepaymentPaidCents += view.repaymentAppliedCents
    totals.withdrawalRepaymentRemainingCents += view.repaymentRemainingCents
    totals.totalOverpaidCents += view.overpaidCents
    if (view.status !== 'CLOSED') totals.openWithdrawalCount += 1
  }

  return totals
}

export function computeBaseDepositedCents(
  transactions: readonly LedgerTransactionRecord[]
): number {
  return transactions
    .filter((tx) => tx.type === 'BASE_DEPOSIT')
    .reduce((sum, tx) => sum + tx.amountCents, 0)
}

/**
 * Signed adjustments applied to the base obligation.
 *
 * Only `ADJUSTMENT` records may carry a non-zero base effect other than a
 * base deposit; the apply path enforces `baseEffectCents === 0` for
 * withdrawals and withdrawal repayments.
 */
export function computeBaseAdjustmentCents(
  transactions: readonly LedgerTransactionRecord[]
): number {
  return transactions
    .filter((tx) => tx.type === 'ADJUSTMENT' && tx.adjustmentScope === 'BASE')
    .reduce((sum, tx) => sum + tx.baseEffectCents, 0)
}

export function computeSummary(
  config: Pick<LedgerConfigRecord, 'originalObligationCents' | 'lockedAt'>,
  transactions: readonly LedgerTransactionRecord[]
): LedgerSummary {
  const ordered = orderTransactions(transactions)
  const views = computeWithdrawalViews(ordered)
  const withdrawalTotals = computeWithdrawalTotals(views)

  const originalObligationCents = assertCents(
    config.originalObligationCents,
    'original obligation'
  )
  const baseDepositedCents = computeBaseDepositedCents(ordered)
  const baseAdjustmentCents = computeBaseAdjustmentCents(ordered)
  const baseRemainingCents =
    originalObligationCents - baseDepositedCents + baseAdjustmentCents

  const openWithdrawalRepaymentCents = views
    .filter((view) => view.status !== 'CLOSED')
    .reduce((sum, view) => sum + view.repaymentRemainingCents, 0)

  // Extra repayment is already inside required withdrawal repayment and is
  // therefore deliberately NOT added again here.
  const totalCurrentlyOutstandingCents =
    baseRemainingCents + openWithdrawalRepaymentCents

  const progressPercent =
    originalObligationCents > 0
      ? Math.min(
          100,
          Math.max(0, (baseDepositedCents / originalObligationCents) * 100)
        )
      : 0

  return {
    currency: LEDGER_CURRENCY,
    originalObligationCents,
    obligationLocked: Boolean(config.lockedAt),
    baseDepositedCents,
    baseAdjustmentCents,
    baseRemainingCents,
    openWithdrawalRepaymentCents,
    totalCurrentlyOutstandingCents,
    totalExtraRepaymentAddedCents: withdrawalTotals.totalExtraRepaymentAddedCents,
    withdrawalTotals,
    progressPercent,
  }
}

/** Base Remaining immediately after a given transaction, for history rows. */
export function computeBaseRemainingTimeline(
  originalObligationCents: number,
  transactions: readonly LedgerTransactionRecord[]
): Map<string, number> {
  const ordered = orderTransactions(transactions)
  const timeline = new Map<string, number>()
  let running = originalObligationCents
  for (const tx of ordered) {
    running += tx.baseEffectCents
    timeline.set(tx.id, running)
  }
  return timeline
}

export function computeReconciliation(
  transactions: readonly LedgerTransactionRecord[],
  notes: readonly LedgerNoteRecord[]
): ReconciliationSnapshot {
  const ordered = orderTransactions(transactions)
  const last = ordered[ordered.length - 1] ?? null
  const views = computeWithdrawalViews(ordered)
  return {
    lastTransactionCode: last?.transactionCode ?? null,
    lastUpdatedAt: last?.createdAt ?? null,
    openWithdrawalCount: views.filter((view) => view.status !== 'CLOSED').length,
    unresolvedNoteCount: notes.filter((note) => !note.resolvedAt).length,
  }
}

/**
 * The signed base effect a record of a given type is allowed to carry.
 * Returns `null` when the type may carry an owner-specified signed effect.
 */
export function requiredBaseEffectCents(
  type: LedgerTransactionRecord['type'],
  amountCents: number
): number | null {
  switch (type) {
    case 'BASE_DEPOSIT':
      return -amountCents
    case 'WITHDRAWAL':
    case 'WITHDRAWAL_REPAYMENT':
      return 0
    case 'ADJUSTMENT':
      return null
  }
}
