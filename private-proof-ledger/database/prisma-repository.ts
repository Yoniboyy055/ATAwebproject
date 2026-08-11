/**
 * Proof Ledger — Prisma-backed repository.
 *
 * Reads and writes only the four ledger tables in the private ledger
 * database. It never touches an ATA table.
 */

import { PreparedRecord } from '../ledger/apply'
import { deriveWithdrawalStatus } from '../ledger/engine'
import {
  LedgerConfigRecord,
  LedgerEvidenceRecord,
  LedgerNoteRecord,
  LedgerRole,
  LedgerTransactionRecord,
  TransactionType,
  WithdrawalStatus,
} from '../ledger/types'
import { getLedgerPrisma } from './client'
import {
  EvidencePayload,
  EvidenceUpload,
  LedgerConflictError,
  LedgerRepository,
} from './repository'

function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10)
}

function fromIsoDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`)
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapConfig(row: any): LedgerConfigRecord {
  return {
    id: row.id,
    currency: 'CAD',
    originalObligationCents: row.originalObligationCents,
    lockedAt: row.lockedAt ? row.lockedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  }
}

function mapTransaction(row: any): LedgerTransactionRecord {
  return {
    id: row.id,
    sequence: row.sequence,
    transactionCode: row.transactionCode,
    date: toIsoDate(row.date),
    type: row.type as TransactionType,
    amountCents: row.amountCents,
    reason: row.reason,
    originalInstruction: row.originalInstruction ?? null,
    baseEffectCents: row.baseEffectCents,
    linkedWithdrawalId: row.linkedWithdrawalId ?? null,
    withdrawalPrincipalCents: row.withdrawalPrincipalCents ?? null,
    extraRepaymentCents: row.extraRepaymentCents ?? null,
    requiredRepaymentCents: row.requiredRepaymentCents ?? null,
    repaymentPaidCentsCache: row.repaymentPaidCents ?? null,
    statusCache: (row.status as WithdrawalStatus | null) ?? null,
    previousRecordHash: row.previousRecordHash ?? null,
    recordHash: row.recordHash,
    evidenceId: row.evidenceId ?? null,
    createdAt: row.createdAt.toISOString(),
  }
}

function mapNote(row: any): LedgerNoteRecord {
  return {
    id: row.id,
    transactionId: row.transactionId ?? null,
    authorRole: row.authorRole as LedgerRole,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    resolvedAt: row.resolvedAt ? row.resolvedAt.toISOString() : null,
  }
}

function mapEvidence(row: any): LedgerEvidenceRecord {
  return {
    id: row.id,
    mimeType: row.mimeType,
    byteSize: row.byteSize,
    sha256: row.sha256,
    createdAt: row.createdAt.toISOString(),
  }
}

export class PrismaLedgerRepository implements LedgerRepository {
  private get db() {
    return getLedgerPrisma()
  }

  async getConfig(): Promise<LedgerConfigRecord | null> {
    const row = await this.db.ledgerConfig.findFirst({ orderBy: { createdAt: 'asc' } })
    return row ? mapConfig(row) : null
  }

  async ensureConfig(originalObligationCents: number): Promise<LedgerConfigRecord> {
    const existing = await this.getConfig()
    if (existing) return existing
    const row = await this.db.ledgerConfig.create({
      data: { currency: 'CAD', originalObligationCents },
    })
    return mapConfig(row)
  }

  async lockConfig(originalObligationCents: number): Promise<LedgerConfigRecord> {
    const existing = await this.ensureConfig(originalObligationCents)
    if (existing.lockedAt) {
      throw new LedgerConflictError(
        'ALREADY_LOCKED',
        'The original obligation is already locked. Use an adjustment to correct it.'
      )
    }
    const row = await this.db.ledgerConfig.update({
      where: { id: existing.id },
      data: { originalObligationCents, lockedAt: new Date() },
    })
    return mapConfig(row)
  }

  async listTransactions(): Promise<LedgerTransactionRecord[]> {
    const rows = await this.db.ledgerTransaction.findMany({ orderBy: { sequence: 'asc' } })
    return rows.map(mapTransaction)
  }

  async appendTransaction(record: PreparedRecord): Promise<LedgerTransactionRecord> {
    return this.db.$transaction(async (tx: any) => {
      const head = await tx.ledgerTransaction.findFirst({ orderBy: { sequence: 'desc' } })
      // Guard against a concurrent write having moved the head since the
      // record was prepared — the hash chain must stay contiguous.
      const expectedPrevious = head?.recordHash ?? null
      if ((record.previousRecordHash ?? null) !== expectedPrevious) {
        throw new LedgerConflictError(
          'CHAIN_MOVED',
          'The ledger changed while this record was being confirmed. Re-run the analysis.'
        )
      }

      const created = await tx.ledgerTransaction.create({
        data: {
          sequence: record.sequence,
          transactionCode: record.transactionCode,
          date: fromIsoDate(record.date),
          type: record.type,
          amountCents: record.amountCents,
          reason: record.reason,
          originalInstruction: record.originalInstruction,
          baseEffectCents: record.baseEffectCents,
          linkedWithdrawalId: record.linkedWithdrawalId,
          withdrawalPrincipalCents: record.withdrawalPrincipalCents,
          extraRepaymentCents: record.extraRepaymentCents,
          requiredRepaymentCents: record.requiredRepaymentCents,
          repaymentPaidCents: record.type === 'WITHDRAWAL' ? 0 : null,
          status: record.type === 'WITHDRAWAL' ? 'OPEN' : null,
          previousRecordHash: record.previousRecordHash,
          recordHash: record.recordHash,
          evidenceId: record.evidenceId,
        },
      })

      // Refresh the denormalised cache on the linked withdrawal. These columns
      // are display conveniences only and are never part of the hash.
      if (record.linkedWithdrawalId) {
        const withdrawal = await tx.ledgerTransaction.findUnique({
          where: { id: record.linkedWithdrawalId },
        })
        if (withdrawal) {
          const paidAggregate = await tx.ledgerTransaction.aggregate({
            where: {
              type: 'WITHDRAWAL_REPAYMENT',
              linkedWithdrawalId: record.linkedWithdrawalId,
            },
            _sum: { amountCents: true },
          })
          const paid = paidAggregate._sum.amountCents ?? 0
          const required = withdrawal.requiredRepaymentCents ?? withdrawal.amountCents
          await tx.ledgerTransaction.update({
            where: { id: record.linkedWithdrawalId },
            data: {
              repaymentPaidCents: paid,
              status: deriveWithdrawalStatus(required, paid),
            },
          })
        }
      }

      return mapTransaction(created)
    })
  }

  async listNotes(): Promise<LedgerNoteRecord[]> {
    const rows = await this.db.ledgerNote.findMany({ orderBy: { createdAt: 'asc' } })
    return rows.map(mapNote)
  }

  async createNote(input: {
    transactionId: string | null
    authorRole: LedgerRole
    body: string
  }): Promise<LedgerNoteRecord> {
    const row = await this.db.ledgerNote.create({
      data: {
        transactionId: input.transactionId,
        authorRole: input.authorRole,
        body: input.body,
      },
    })
    return mapNote(row)
  }

  async resolveNote(noteId: string): Promise<LedgerNoteRecord | null> {
    const existing = await this.db.ledgerNote.findUnique({ where: { id: noteId } })
    if (!existing) return null
    if (existing.resolvedAt) return mapNote(existing)
    const row = await this.db.ledgerNote.update({
      where: { id: noteId },
      data: { resolvedAt: new Date() },
    })
    return mapNote(row)
  }

  async createEvidence(upload: EvidenceUpload): Promise<LedgerEvidenceRecord> {
    const row = await this.db.ledgerEvidence.create({
      data: {
        data: upload.data,
        mimeType: upload.mimeType,
        byteSize: upload.byteSize,
        sha256: upload.sha256,
      },
    })
    return mapEvidence(row)
  }

  async getEvidence(evidenceId: string): Promise<EvidencePayload | null> {
    const row = await this.db.ledgerEvidence.findUnique({ where: { id: evidenceId } })
    if (!row) return null
    return { ...mapEvidence(row), data: Buffer.from(row.data) }
  }

  async getEvidenceMeta(evidenceId: string): Promise<LedgerEvidenceRecord | null> {
    const row = await this.db.ledgerEvidence.findUnique({
      where: { id: evidenceId },
      select: { id: true, mimeType: true, byteSize: true, sha256: true, createdAt: true },
    })
    return row ? mapEvidence(row) : null
  }
}

let repository: PrismaLedgerRepository | undefined

export function getLedgerRepository(): LedgerRepository {
  if (!repository) repository = new PrismaLedgerRepository()
  return repository
}
