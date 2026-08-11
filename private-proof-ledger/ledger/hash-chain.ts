/**
 * Proof Ledger — lightweight tamper-evident hash chain.
 *
 * Each applied record hashes its own canonical financial payload together with
 * the hash of the record before it. Rewriting or removing any historical
 * record breaks every hash from that point forward.
 *
 * This is deliberately not a blockchain: there is no consensus, no proof of
 * work and no distribution. It exists so that a silent edit to the database is
 * detectable.
 */

import { createHash } from 'crypto'

import { canonicalJson } from '../utils/canonical-json'
import { LedgerTransactionRecord } from './types'

export const GENESIS_HASH = 'GENESIS'

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
  evidenceId: string | null
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
    evidenceId: record.evidenceId,
  })
}

export function computeRecordHash(
  record: HashableRecord,
  previousRecordHash: string | null
): string {
  const previous = previousRecordHash ?? GENESIS_HASH
  return createHash('sha256')
    .update(`${previous}\n${canonicalRecordPayload(record)}`)
    .digest('hex')
}

export interface IntegrityFailure {
  sequence: number
  transactionCode: string
  reason: 'BROKEN_LINK' | 'HASH_MISMATCH' | 'SEQUENCE_GAP' | 'EXTRA_MISMATCH'
  detail: string
}

export interface IntegrityResult {
  ok: boolean
  checkedRecords: number
  failures: IntegrityFailure[]
}

/**
 * Verify the whole chain plus the internal consistency of the separately
 * stored extra-repayment column.
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

    previousHash = record.recordHash
  }

  return { ok: failures.length === 0, checkedRecords: ordered.length, failures }
}

export function headHash(transactions: readonly LedgerTransactionRecord[]): string | null {
  const ordered = [...transactions].sort((a, b) => a.sequence - b.sequence)
  return ordered.length ? ordered[ordered.length - 1].recordHash : null
}
