/**
 * Proof Ledger — domain types.
 *
 * This module is intentionally free of framework, database and network
 * imports so that the deterministic financial engine can be reasoned about
 * and tested in isolation.
 */

export const LEDGER_CURRENCY = 'CAD' as const

/** Production opening obligation: CAD $36,000.00 stored as integer cents. */
export const DEFAULT_ORIGINAL_OBLIGATION_CENTS = 3_600_000

export const TRANSACTION_TYPES = [
  'BASE_DEPOSIT',
  'WITHDRAWAL',
  'WITHDRAWAL_REPAYMENT',
  'ADJUSTMENT',
] as const

export type TransactionType = (typeof TRANSACTION_TYPES)[number]

export const ADJUSTMENT_SCOPES = [
  'BASE',
  'WITHDRAWAL_PRINCIPAL',
  'WITHDRAWAL_EXTRA',
] as const

/**
 * What an ADJUSTMENT corrects. An adjustment never rewrites the record it
 * references — it sits beside it and the engine derives the effective figures.
 */
export type AdjustmentScope = (typeof ADJUSTMENT_SCOPES)[number]

export const WITHDRAWAL_STATUSES = ['OPEN', 'PARTIAL', 'CLOSED'] as const

export type WithdrawalStatus = (typeof WITHDRAWAL_STATUSES)[number]

export type LedgerRole = 'OWNER' | 'VIEWER'

export interface LedgerConfigRecord {
  id: string
  currency: typeof LEDGER_CURRENCY
  originalObligationCents: number
  lockedAt: string | null
  createdAt: string
}

/**
 * A permanently applied ledger record.
 *
 * `statusCache` and `repaymentPaidCentsCache` are denormalised convenience
 * columns. They are deliberately NOT part of the hashed canonical payload —
 * the authoritative values are always derived from transaction history by
 * the engine (see `computeWithdrawalViews`).
 */
export interface LedgerTransactionRecord {
  id: string
  sequence: number
  transactionCode: string
  /** Calendar date of the real-world event, ISO `YYYY-MM-DD`. */
  date: string
  type: TransactionType
  amountCents: number
  reason: string
  originalInstruction: string | null
  /** Signed effect on Base Remaining. Always 0 for withdrawals/repayments. */
  baseEffectCents: number
  linkedWithdrawalId: string | null
  withdrawalPrincipalCents: number | null
  extraRepaymentCents: number | null
  requiredRepaymentCents: number | null
  adjustmentScope: AdjustmentScope | null
  adjustmentEffectCents: number | null
  correctsTransactionId: string | null
  /** SHA-256 of the screenshot bytes, covered by the record hash. */
  evidenceSha256: string | null
  /** SHA-256 of the owner's original instruction, covered by the record hash. */
  instructionSha256: string | null
  repaymentPaidCentsCache: number | null
  statusCache: WithdrawalStatus | null
  previousRecordHash: string | null
  recordHash: string
  evidenceId: string | null
  createdAt: string
}

export type EvidenceStatus = 'PENDING' | 'APPLIED'

export interface LedgerEvidenceRecord {
  id: string
  mimeType: string
  byteSize: number
  sha256: string
  status: EvidenceStatus
  expiresAt: string | null
  createdAt: string
}

export interface LedgerTransactionEvidenceRecord extends LedgerEvidenceRecord {
  transactionId: string
  position: number
}

export interface LedgerCredentialRecord {
  role: LedgerRole
  passwordHash: string
  credentialVersion: number
  updatedAt: string
}

export interface LedgerNoteRecord {
  id: string
  transactionId: string | null
  authorRole: LedgerRole
  body: string
  createdAt: string
  resolvedAt: string | null
}

/** Fully derived view of a single withdrawal and its repayment position. */
export interface WithdrawalView {
  id: string
  transactionCode: string
  date: string
  reason: string
  evidenceId: string | null
  evidenceItems?: LedgerTransactionEvidenceRecord[]
  /** As originally recorded. Never changes. */
  originalPrincipalCents: number
  originalExtraRepaymentCents: number
  originalRequiredRepaymentCents: number
  /** Sum of WITHDRAWAL_PRINCIPAL / WITHDRAWAL_EXTRA adjustments. */
  principalAdjustmentCents: number
  extraAdjustmentCents: number
  hasAdjustments: boolean
  /** Effective financial truth = original + adjustments. */
  principalCents: number
  extraRepaymentCents: number
  requiredRepaymentCents: number
  /** Raw sum of linked repayments (may exceed required if overpaid). */
  repaymentPaidCents: number
  /** Repayment credited against this withdrawal, capped at required. */
  repaymentAppliedCents: number
  /** Required minus applied. Never negative. */
  repaymentRemainingCents: number
  /** Paid beyond required. Requires an ADJUSTMENT to resolve. */
  overpaidCents: number
  status: WithdrawalStatus
  baseEffectCents: number
}

export interface WithdrawalTotals {
  /** Historical — includes CLOSED withdrawals. */
  totalPrincipalWithdrawnCents: number
  /** Historical — includes CLOSED withdrawals. Never merged into principal. */
  totalExtraRepaymentAddedCents: number
  /** Historical — principal + extra across every withdrawal ever created. */
  totalRequiredRepaymentCents: number
  /** Historical — repayment credited against withdrawals. */
  totalRepaymentPaidCents: number
  /** Current — outstanding repayment across OPEN/PARTIAL withdrawals. */
  withdrawalRepaymentRemainingCents: number
  totalOverpaidCents: number
  openWithdrawalCount: number
  withdrawalCount: number
}

export interface LedgerSummary {
  currency: typeof LEDGER_CURRENCY
  originalObligationCents: number
  obligationLocked: boolean
  baseDepositedCents: number
  baseAdjustmentCents: number
  baseRemainingCents: number
  /** Current unpaid required repayment across OPEN/PARTIAL withdrawals. */
  openWithdrawalRepaymentCents: number
  /** Base Remaining + Open Withdrawal Repayment. No double counting. */
  totalCurrentlyOutstandingCents: number
  /** Historical, informational only — already inside required repayments. */
  totalExtraRepaymentAddedCents: number
  withdrawalTotals: WithdrawalTotals
  progressPercent: number
}

export interface ReconciliationSnapshot {
  lastTransactionCode: string | null
  lastUpdatedAt: string | null
  openWithdrawalCount: number
  unresolvedNoteCount: number
}
