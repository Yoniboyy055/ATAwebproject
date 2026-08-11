/**
 * Proof Ledger — deterministic record preparation.
 *
 * Turns validated input into the exact record that will be written, and into
 * the before/after preview the owner confirms. Nothing here consults AI, the
 * network or the clock beyond a caller-supplied timestamp.
 */

import { formatTransactionCode, parseTransactionCode } from './codes'
import { computeSummary, computeWithdrawalViews, requiredBaseEffectCents } from './engine'
import { computeRecordHash, HashableRecord, sha256Hex } from './hash-chain'
import {
  AdjustmentScope,
  LedgerConfigRecord,
  LedgerSummary,
  LedgerTransactionRecord,
  TransactionType,
  WithdrawalView,
} from './types'

export class LedgerRuleError extends Error {
  readonly code: string
  constructor(code: string, message: string) {
    super(message)
    this.name = 'LedgerRuleError'
    this.code = code
  }
}

export interface PrepareRecordInput {
  type: TransactionType
  date: string
  amountCents: number
  reason: string
  originalInstruction?: string | null
  requiredRepaymentCents?: number | null
  linkedTransactionCode?: string | null
  adjustmentScope?: AdjustmentScope | null
  adjustmentEffectCents?: number | null
  correctsTransactionCode?: string | null
  evidenceId: string
  evidenceSha256: string
}

/** Everything needed to persist a record, minus the database identity. */
export interface PreparedRecord {
  sequence: number
  transactionCode: string
  date: string
  type: TransactionType
  amountCents: number
  reason: string
  originalInstruction: string | null
  baseEffectCents: number
  linkedWithdrawalId: string | null
  withdrawalPrincipalCents: number | null
  extraRepaymentCents: number | null
  requiredRepaymentCents: number | null
  adjustmentScope: AdjustmentScope | null
  adjustmentEffectCents: number | null
  correctsTransactionId: string | null
  evidenceId: string
  evidenceSha256: string
  instructionSha256: string | null
  previousRecordHash: string | null
  recordHash: string
}

export interface RecordPreview {
  record: PreparedRecord
  linkedWithdrawalCode: string | null
  correctsTransactionCode: string | null
  summaryBefore: LedgerSummary
  summaryAfter: LedgerSummary
  affectedWithdrawalBefore: WithdrawalView | null
  affectedWithdrawalAfter: WithdrawalView | null
}

function findByCode(
  transactions: readonly LedgerTransactionRecord[],
  code: string
): LedgerTransactionRecord {
  const sequence = parseTransactionCode(code)
  if (sequence === null) {
    throw new LedgerRuleError('LINK_INVALID', `${code} is not a valid transaction code`)
  }
  const match = transactions.find((tx) => tx.transactionCode === formatTransactionCode(sequence))
  if (!match) {
    throw new LedgerRuleError('LINK_NOT_FOUND', `${code} does not exist in this ledger`)
  }
  return match
}

/**
 * Build the record that would be applied, without writing anything.
 *
 * Throws `LedgerRuleError` when the request violates a ledger rule — a
 * rejected proposal mutates nothing.
 */
export function prepareRecord(
  config: LedgerConfigRecord,
  transactions: readonly LedgerTransactionRecord[],
  input: PrepareRecordInput
): RecordPreview {
  if (!config.lockedAt) {
    throw new LedgerRuleError(
      'OBLIGATION_NOT_LOCKED',
      'The original obligation must be confirmed and locked before any record is applied'
    )
  }
  if (!input.evidenceId || !input.evidenceSha256) {
    throw new LedgerRuleError('EVIDENCE_REQUIRED', 'Every financial record requires screenshot proof')
  }
  if (!input.reason.trim()) {
    throw new LedgerRuleError('REASON_REQUIRED', 'A reason is required')
  }

  const ordered = [...transactions].sort((a, b) => a.sequence - b.sequence)
  const previous = ordered[ordered.length - 1] ?? null
  const sequence = (previous?.sequence ?? 0) + 1

  let amountCents = input.amountCents
  let baseEffectCents = 0
  let linkedWithdrawalId: string | null = null
  let linkedWithdrawalCode: string | null = null
  let withdrawalPrincipalCents: number | null = null
  let extraRepaymentCents: number | null = null
  let requiredRepaymentCents: number | null = null
  let adjustmentScope: AdjustmentScope | null = null
  let adjustmentEffectCents: number | null = null
  let correctsTransactionId: string | null = null
  let correctsTransactionCode: string | null = null
  let reason = input.reason.trim()

  switch (input.type) {
    case 'BASE_DEPOSIT': {
      if (amountCents <= 0) {
        throw new LedgerRuleError('AMOUNT_REQUIRED', 'A base deposit must be greater than zero')
      }
      baseEffectCents = requiredBaseEffectCents('BASE_DEPOSIT', amountCents) as number
      break
    }

    case 'WITHDRAWAL': {
      if (amountCents <= 0) {
        throw new LedgerRuleError('AMOUNT_REQUIRED', 'A withdrawal must be greater than zero')
      }
      withdrawalPrincipalCents = amountCents
      requiredRepaymentCents = input.requiredRepaymentCents ?? amountCents
      if (requiredRepaymentCents < withdrawalPrincipalCents) {
        throw new LedgerRuleError(
          'REQUIRED_BELOW_PRINCIPAL',
          'Required repayment cannot be lower than the amount withdrawn'
        )
      }
      // Extra repayment is stored in its own column, never folded into the
      // required repayment figure.
      extraRepaymentCents = requiredRepaymentCents - withdrawalPrincipalCents
      // A withdrawal never moves the base obligation.
      baseEffectCents = 0
      break
    }

    case 'WITHDRAWAL_REPAYMENT': {
      if (amountCents <= 0) {
        throw new LedgerRuleError('AMOUNT_REQUIRED', 'A repayment must be greater than zero')
      }
      if (!input.linkedTransactionCode) {
        throw new LedgerRuleError(
          'LINK_REQUIRED',
          'A withdrawal repayment must be linked to the withdrawal it repays'
        )
      }
      const withdrawal = findByCode(ordered, input.linkedTransactionCode)
      if (withdrawal.type !== 'WITHDRAWAL') {
        throw new LedgerRuleError(
          'LINK_NOT_WITHDRAWAL',
          `${withdrawal.transactionCode} is not a withdrawal`
        )
      }
      const view = computeWithdrawalViews(ordered).find((item) => item.id === withdrawal.id)
      if (!view) {
        throw new LedgerRuleError('LINK_NOT_FOUND', 'Linked withdrawal could not be derived')
      }
      if (view.status === 'CLOSED') {
        throw new LedgerRuleError(
          'WITHDRAWAL_CLOSED',
          `${withdrawal.transactionCode} is already fully repaid`
        )
      }
      if (amountCents > view.repaymentRemainingCents) {
        throw new LedgerRuleError(
          'REPAYMENT_EXCEEDS_REMAINING',
          `${withdrawal.transactionCode} only has ${view.repaymentRemainingCents} cents outstanding — record an adjustment for an overpayment`
        )
      }
      linkedWithdrawalId = withdrawal.id
      linkedWithdrawalCode = withdrawal.transactionCode
      // A repayment settles the withdrawal only. It can never touch the base.
      baseEffectCents = 0
      break
    }

    case 'ADJUSTMENT': {
      if (!input.correctsTransactionCode) {
        throw new LedgerRuleError(
          'CORRECTION_TARGET_REQUIRED',
          'An adjustment must reference the record it corrects'
        )
      }
      if (!input.adjustmentScope) {
        throw new LedgerRuleError(
          'ADJUSTMENT_SCOPE_REQUIRED',
          'An adjustment must state whether it corrects the base, a withdrawal principal or an extra repayment'
        )
      }
      const effect = input.adjustmentEffectCents ?? 0
      if (effect === 0) {
        throw new LedgerRuleError(
          'ADJUSTMENT_EFFECT_REQUIRED',
          'An adjustment must change something'
        )
      }

      const target = findByCode(ordered, input.correctsTransactionCode)
      adjustmentScope = input.adjustmentScope
      adjustmentEffectCents = effect
      correctsTransactionId = target.id
      correctsTransactionCode = target.transactionCode
      amountCents = Math.abs(effect)

      if (adjustmentScope === 'BASE') {
        // Only a base-scoped adjustment moves Base Remaining.
        baseEffectCents = effect
      } else {
        if (target.type !== 'WITHDRAWAL') {
          throw new LedgerRuleError(
            'ADJUSTMENT_TARGET_NOT_WITHDRAWAL',
            `${target.transactionCode} is not a withdrawal, so it has no principal or extra repayment to correct`
          )
        }
        baseEffectCents = 0

        const view = computeWithdrawalViews(ordered).find((item) => item.id === target.id)
        if (!view) {
          throw new LedgerRuleError('LINK_NOT_FOUND', 'Target withdrawal could not be derived')
        }
        const current =
          adjustmentScope === 'WITHDRAWAL_PRINCIPAL'
            ? view.principalCents
            : view.extraRepaymentCents
        if (current + effect < 0) {
          throw new LedgerRuleError(
            'ADJUSTMENT_BELOW_ZERO',
            'That correction would push the withdrawal below zero'
          )
        }
      }

      reason = `Corrects ${target.transactionCode} — ${reason}`
      break
    }
  }

  const originalInstruction = input.originalInstruction?.trim() || null
  const instructionSha256 = originalInstruction ? sha256Hex(originalInstruction) : null

  const hashable: HashableRecord = {
    sequence,
    transactionCode: formatTransactionCode(sequence),
    date: input.date,
    type: input.type,
    amountCents,
    reason,
    baseEffectCents,
    linkedWithdrawalId,
    withdrawalPrincipalCents,
    extraRepaymentCents,
    requiredRepaymentCents,
    adjustmentScope,
    adjustmentEffectCents,
    correctsTransactionId,
    evidenceId: input.evidenceId,
    evidenceSha256: input.evidenceSha256,
    instructionSha256,
  }

  const previousRecordHash = previous?.recordHash ?? null
  const record: PreparedRecord = {
    ...hashable,
    evidenceId: input.evidenceId,
    evidenceSha256: input.evidenceSha256,
    originalInstruction,
    previousRecordHash,
    recordHash: computeRecordHash(hashable, previousRecordHash),
  }

  const projected: LedgerTransactionRecord = {
    id: `preview-${sequence}`,
    ...record,
    repaymentPaidCentsCache: null,
    statusCache: null,
    createdAt: new Date(0).toISOString(),
  }

  const summaryBefore = computeSummary(config, ordered)
  const summaryAfter = computeSummary(config, [...ordered, projected])

  const affectedId =
    linkedWithdrawalId ??
    (adjustmentScope && adjustmentScope !== 'BASE' ? correctsTransactionId : null) ??
    (input.type === 'WITHDRAWAL' ? projected.id : null)

  const affectedWithdrawalBefore = affectedId
    ? computeWithdrawalViews(ordered).find((view) => view.id === affectedId) ?? null
    : null
  const affectedWithdrawalAfter = affectedId
    ? computeWithdrawalViews([...ordered, projected]).find((view) => view.id === affectedId) ?? null
    : null

  return {
    record,
    linkedWithdrawalCode,
    correctsTransactionCode,
    summaryBefore,
    summaryAfter,
    affectedWithdrawalBefore,
    affectedWithdrawalAfter,
  }
}
