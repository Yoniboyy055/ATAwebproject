/**
 * Proof Ledger — lightweight tamper-evident hash chain.
 *
 * Each applied record hashes its own canonical financial payload — including
 * the SHA-256 of its screenshot and of the owner's original instruction —
 * together with the hash of the record before it. Rewriting or removing any
 * historical record, swapping the screenshot bytes, or rewording the stored
 * instruction all break every hash from that point forward.
 *
 * This is deliberately not a blockchain: there is no consensus, no proof of
 * work and no distribution. It exists so that a silent edit to the database is
 * detectable.
 */

import { createHash } from 'crypto'

import { canonicalJson } from '../utils/canonical-json'
import { AdjustmentScope, LedgerTransactionRecord } from './types'

export const GENESIS_HASH = 'GENESIS'

export function sha256Hex(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex')
}

/**
 * The subset of a record that is covered by the hash.
 *
 * Denormalised caches (`repaymentPaidCentsCache`, `statusCache`) are excluded
 * on purpose: they change as later repayments arrive, while the historical
 * facts of this record do not.
 */
export interface HashableRecord {
  sequence: number
  transactionCode: string
  date: string
  type: LedgerTransactionRecord['type']
  amountCents: number
  reason: string
  baseEffectCents: number
  linkedWithdrawalId: string | null
  withdrawalPrincipalCents: number | null
  extraRepaymentCents: number | null
  requiredRepaymentCents: number | null
  adjustmentScope: AdjustmentScope | null
  adjustmentEffectCents: number | null
  correctsTransactionId: string | null
  evidenceId: string | null
  evidenceSha256: string | null
  instructionSha256: string | null
}

export function canonicalRecordPayload(record: HashableRecord): string {
  return canonicalJson({
    sequence: record.sequence,
    transactionCode: record.transactionCode,
    date: record.date,
    type: record.type,
    amountCents: record.amountCents,
    reason: record.reason,
    baseEffectCents: record.baseEffectCents,
    linkedWithdrawalId: record.linkedWithdrawalId,
    withdrawalPrincipalCents: record.withdrawalPrincipalCents,
    extraRepaymentCents: record.extraRepaymentCents,
    requiredRepaymentCents: record.requiredRepaymentCents,
    adjustmentScope: record.adjustmentScope,
    adjustmentEffectCents: record.adjustmentEffectCents,
    correctsTransactionId: record.correctsTransactionId,
    evidenceId: record.evidenceId,
    evidenceSha256: record.evidenceSha256,
    instructionSha256: record.instructionSha256,
  })
}

export function computeRecordHash(
  record: HashableRecord,
  previousRecordHash: string | null
): string {
  const previous = previousRecordHash ?? GENESIS_HASH
  return sha256Hex(`${previous}\n${canonicalRecordPayload(record)}`)
}

export type IntegrityFailureReason =
  | 'BROKEN_LINK'
  | 'HASH_MISMATCH'
  | 'SEQUENCE_GAP'
  | 'EXTRA_MISMATCH'
  | 'EVIDENCE_HASH_MISMATCH'
  | 'EVIDENCE_MISSING'
  | 'INSTRUCTION_HASH_MISMATCH'

export interface IntegrityFailure {
  sequence: number
  transactionCode: string
  reason: IntegrityFailureReason
  /** Deliberately generic — never echoes amounts, evidence or instructions. */
  detail: string
}

export interface IntegrityResult {
  ok: boolean
  checkedRecords: number
  /** How many records had their screenshot bytes re-hashed and compared. */
  evidenceChecked: number
  failures: IntegrityFailure[]
}

/**
 * Verify the chain itself, plus the internal consistency of the separately
 * stored extra-repayment column and the stored instruction hash.
 *
 * Screenshot bytes are not available here — use `verifyLedgerIntegrity` for a
 * check that also re-hashes evidence.
 */
export function verifyChain(
  transactions: readonly LedgerTransactionRecord[]
): IntegrityResult {
  const ordered = [...transactions].sort((a, b) => a.sequence - b.sequence)
  const failures: IntegrityFailure[] = []
  let previousHash: string | null = null
  let expectedSequence = 1

  for (const record of ordered) {
    if (record.sequence !== expectedSequence) {
      failures.push({
        sequence: record.sequence,
        transactionCode: record.transactionCode,
        reason: 'SEQUENCE_GAP',
        detail: `expected sequence ${expectedSequence}, found ${record.sequence}`,
      })
    }
    expectedSequence = record.sequence + 1

    const expectedPrevious = previousHash ?? null
    if ((record.previousRecordHash ?? null) !== expectedPrevious) {
      failures.push({
        sequence: record.sequence,
        transactionCode: record.transactionCode,
        reason: 'BROKEN_LINK',
        detail: 'previousRecordHash does not match the preceding record hash',
      })
    }

    const expectedHash = computeRecordHash(record, expectedPrevious)
    if (record.recordHash !== expectedHash) {
      failures.push({
        sequence: record.sequence,
        transactionCode: record.transactionCode,
        reason: 'HASH_MISMATCH',
        detail: 'record content does not match its stored hash',
      })
    }

    if (record.type === 'WITHDRAWAL') {
      const principal = record.withdrawalPrincipalCents ?? 0
      const required = record.requiredRepaymentCents ?? 0
      const extra = record.extraRepaymentCents ?? 0
      if (required - principal !== extra) {
        failures.push({
          sequence: record.sequence,
          transactionCode: record.transactionCode,
          reason: 'EXTRA_MISMATCH',
          detail: 'extra repayment does not equal required repayment minus principal',
        })
      }
    }

    // The stored instruction must still hash to the value bound into the
    // record. Rewording it after the fact is detectable.
    if (record.instructionSha256 && record.originalInstruction !== null) {
      if (sha256Hex(record.originalInstruction) !== record.instructionSha256) {
        failures.push({
          sequence: record.sequence,
          transactionCode: record.transactionCode,
          reason: 'INSTRUCTION_HASH_MISMATCH',
          detail: 'the stored instruction does not match the hash recorded with it',
        })
      }
    }

    previousHash = record.recordHash
  }

  return {
    ok: failures.length === 0,
    checkedRecords: ordered.length,
    evidenceChecked: 0,
    failures,
  }
}

export interface EvidenceBytesLoader {
  (evidenceId: string): Promise<{ data: Buffer } | null>
}

/**
 * Full integrity check: the chain, plus re-hashing the actual screenshot bytes
 * of every record that carries evidence.
 */
export async function verifyLedgerIntegrity(
  transactions: readonly LedgerTransactionRecord[],
  loadEvidence: EvidenceBytesLoader
): Promise<IntegrityResult> {
  const base = verifyChain(transactions)
  const failures = [...base.failures]
  let evidenceChecked = 0

  for (const record of transactions) {
    if (!record.evidenceId || !record.evidenceSha256) continue
    const evidence = await loadEvidence(record.evidenceId)
    if (!evidence) {
      failures.push({
        sequence: record.sequence,
        transactionCode: record.transactionCode,
        reason: 'EVIDENCE_MISSING',
        detail: 'the screenshot recorded with this transaction is no longer stored',
      })
      continue
    }
    evidenceChecked += 1
    if (sha256Hex(evidence.data) !== record.evidenceSha256) {
      failures.push({
        sequence: record.sequence,
        transactionCode: record.transactionCode,
        reason: 'EVIDENCE_HASH_MISMATCH',
        detail: 'the stored screenshot does not match the hash recorded with it',
      })
    }
  }

  return {
    ok: failures.length === 0,
    checkedRecords: base.checkedRecords,
    evidenceChecked,
    failures,
  }
}

export function headHash(transactions: readonly LedgerTransactionRecord[]): string | null {
  const ordered = [...transactions].sort((a, b) => a.sequence - b.sequence)
  return ordered.length ? ordered[ordered.length - 1].recordHash : null
}
