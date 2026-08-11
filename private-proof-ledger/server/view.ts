/**
 * Proof Ledger — read model.
 *
 * Assembles everything the UI renders from the repository plus the
 * deterministic engine. Returns plain serialisable data so it can be handed
 * straight to client components.
 */

import { LedgerRepository } from '../database/repository'
import {
  computeBaseRemainingTimeline,
  computeReconciliation,
  computeSummary,
  computeWithdrawalViews,
} from '../ledger/engine'
import { IntegrityResult, verifyLedgerIntegrity } from '../ledger/hash-chain'
import {
  AdjustmentScope,
  DEFAULT_ORIGINAL_OBLIGATION_CENTS,
  LedgerNoteRecord,
  LedgerRole,
  LedgerSummary,
  LedgerTransactionRecord,
  ReconciliationSnapshot,
  TransactionType,
  WithdrawalStatus,
  WithdrawalView,
} from '../ledger/types'

export interface TransactionRow {
  id: string
  transactionCode: string
  date: string
  type: TransactionType
  amountCents: number
  reason: string
  baseEffectCents: number
  baseRemainingAfterCents: number
  linkedWithdrawalCode: string | null
  withdrawalPrincipalCents: number | null
  extraRepaymentCents: number | null
  requiredRepaymentCents: number | null
  adjustmentScope: AdjustmentScope | null
  adjustmentEffectCents: number | null
  correctsTransactionCode: string | null
  status: WithdrawalStatus | null
  evidenceId: string | null
  createdAt: string
}

export interface LedgerView {
  role: LedgerRole
  currency: 'CAD'
  configured: boolean
  obligationLocked: boolean
  proposedObligationCents: number
  summary: LedgerSummary
  transactions: TransactionRow[]
  withdrawals: WithdrawalView[]
  notes: LedgerNoteRecord[]
  reconciliation: ReconciliationSnapshot
  integrity: IntegrityResult
  generatedAt: string
}

function toRows(
  transactions: readonly LedgerTransactionRecord[],
  withdrawals: readonly WithdrawalView[],
  originalObligationCents: number
): TransactionRow[] {
  const timeline = computeBaseRemainingTimeline(originalObligationCents, transactions)
  const codeById = new Map(transactions.map((tx) => [tx.id, tx.transactionCode]))
  const statusById = new Map(withdrawals.map((view) => [view.id, view.status]))

  return [...transactions]
    .sort((a, b) => a.sequence - b.sequence)
    .map((tx) => ({
      id: tx.id,
      transactionCode: tx.transactionCode,
      date: tx.date,
      type: tx.type,
      amountCents: tx.amountCents,
      reason: tx.reason,
      baseEffectCents: tx.baseEffectCents,
      baseRemainingAfterCents: timeline.get(tx.id) ?? originalObligationCents,
      linkedWithdrawalCode: tx.linkedWithdrawalId
        ? codeById.get(tx.linkedWithdrawalId) ?? null
        : null,
      withdrawalPrincipalCents: tx.withdrawalPrincipalCents,
      extraRepaymentCents: tx.extraRepaymentCents,
      requiredRepaymentCents: tx.requiredRepaymentCents,
      adjustmentScope: tx.adjustmentScope,
      adjustmentEffectCents: tx.adjustmentEffectCents,
      correctsTransactionCode: tx.correctsTransactionId
        ? codeById.get(tx.correctsTransactionId) ?? null
        : null,
      status:
        tx.type === 'WITHDRAWAL'
          ? statusById.get(tx.id) ?? null
          : tx.linkedWithdrawalId
            ? statusById.get(tx.linkedWithdrawalId) ?? null
            : null,
      evidenceId: tx.evidenceId,
      createdAt: tx.createdAt,
    }))
}

export async function loadLedgerView(
  repository: LedgerRepository,
  role: LedgerRole,
  generatedAt: string = new Date().toISOString()
): Promise<LedgerView> {
  const [config, transactions, notes] = await Promise.all([
    repository.getConfig(),
    repository.listTransactions(),
    repository.listNotes(),
  ])

  const effectiveConfig = config ?? {
    id: 'unconfigured',
    currency: 'CAD' as const,
    originalObligationCents: DEFAULT_ORIGINAL_OBLIGATION_CENTS,
    lockedAt: null,
    createdAt: generatedAt,
  }

  const withdrawals = computeWithdrawalViews(transactions)
  const summary = computeSummary(effectiveConfig, transactions)

  return {
    role,
    currency: 'CAD',
    configured: Boolean(config),
    obligationLocked: Boolean(effectiveConfig.lockedAt),
    proposedObligationCents: effectiveConfig.originalObligationCents,
    summary,
    transactions: toRows(transactions, withdrawals, effectiveConfig.originalObligationCents),
    withdrawals,
    notes,
    reconciliation: computeReconciliation(transactions, notes),
    integrity: await verifyLedgerIntegrity(transactions, (id) => repository.getEvidence(id)),
    generatedAt,
  }
}
