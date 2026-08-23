/**
 * Proof Ledger — Prisma-backed repository.
 *
 * Reads and writes only the four ledger tables in the private ledger
 * database. It never touches an ATA table.
 */

import { PreparedRecord } from '../ledger/apply'
import { deriveWithdrawalStatus } from '../ledger/engine'
import {
  AdjustmentScope,
  EvidenceStatus,
  LedgerConfigRecord,
  LedgerCredentialRecord,
  LedgerEvidenceRecord,
  LedgerNoteRecord,
  LedgerRole,
  LedgerTransactionRecord,
  LedgerTransactionEvidenceRecord,
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
    adjustmentScope: (row.adjustmentScope as AdjustmentScope | null) ?? null,
    adjustmentEffectCents: row.adjustmentEffectCents ?? null,
    correctsTransactionId: row.correctsTransactionId ?? null,
    evidenceSha256: row.evidenceSha256 ?? null,
    instructionSha256: row.instructionSha256 ?? null,
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
    status: (row.status as EvidenceStatus) ?? 'PENDING',
    expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  }
}

function mapTransactionEvidence(row: any): LedgerTransactionEvidenceRecord {
  return {
    ...mapEvidence(row.evidence),
    transactionId: row.transactionId,
    position: row.position,
  }
}

function mapCredential(row: any): LedgerCredentialRecord {
  return {
    role: row.role as LedgerRole,
    passwordHash: row.passwordHash,
    credentialVersion: row.credentialVersion,
    updatedAt: row.updatedAt.toISOString(),
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

  async listEvidenceForTransactions(
    transactionIds: readonly string[]
  ): Promise<Map<string, LedgerTransactionEvidenceRecord[]>> {
    if (transactionIds.length === 0) return new Map()
    const rows = await this.db.ledgerTransactionEvidence.findMany({
      where: { transactionId: { in: [...transactionIds] } },
      include: { evidence: true },
      orderBy: [{ transactionId: 'asc' }, { position: 'asc' }],
    })
    const grouped = new Map<string, LedgerTransactionEvidenceRecord[]>()
    for (const row of rows) {
      const list = grouped.get(row.transactionId) ?? []
      list.push(mapTransactionEvidence(row))
      grouped.set(row.transactionId, list)
    }
    return grouped
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
          adjustmentScope: record.adjustmentScope,
          adjustmentEffectCents: record.adjustmentEffectCents,
          correctsTransactionId: record.correctsTransactionId,
          evidenceSha256: record.evidenceSha256,
          instructionSha256: record.instructionSha256,
          repaymentPaidCents: record.type === 'WITHDRAWAL' ? 0 : null,
          status: record.type === 'WITHDRAWAL' ? 'OPEN' : null,
          previousRecordHash: record.previousRecordHash,
          recordHash: record.recordHash,
          evidenceId: record.evidenceId,
        },
      })

      const evidenceItems =
        record.evidenceItems && record.evidenceItems.length > 0
          ? record.evidenceItems
          : [{ evidenceId: record.evidenceId, evidenceSha256: record.evidenceSha256 }]

      await tx.ledgerTransactionEvidence.createMany({
        data: evidenceItems.map((item, index) => ({
          transactionId: created.id,
          evidenceId: item.evidenceId,
          position: index,
        })),
      })

      // The screenshot behind an applied record is permanent proof and is
      // never eligible for pending cleanup again.
      await tx.ledgerEvidence.updateMany({
        where: { id: { in: evidenceItems.map((item) => item.evidenceId) } },
        data: { status: 'APPLIED', expiresAt: null },
      })

      // Refresh the denormalised cache on the affected withdrawal. These
      // columns are display conveniences only and are never part of the hash.
      const affectedWithdrawalId =
        record.linkedWithdrawalId ??
        (record.adjustmentScope && record.adjustmentScope !== 'BASE'
          ? record.correctsTransactionId
          : null)

      if (affectedWithdrawalId) {
        const withdrawal = await tx.ledgerTransaction.findUnique({
          where: { id: affectedWithdrawalId },
        })
        if (withdrawal && withdrawal.type === 'WITHDRAWAL') {
          const paidAggregate = await tx.ledgerTransaction.aggregate({
            where: {
              type: 'WITHDRAWAL_REPAYMENT',
              linkedWithdrawalId: affectedWithdrawalId,
            },
            _sum: { amountCents: true },
          })
          const adjustmentAggregate = await tx.ledgerTransaction.aggregate({
            where: {
              type: 'ADJUSTMENT',
              correctsTransactionId: affectedWithdrawalId,
              adjustmentScope: { in: ['WITHDRAWAL_PRINCIPAL', 'WITHDRAWAL_EXTRA'] },
            },
            _sum: { adjustmentEffectCents: true },
          })
          const paid = paidAggregate._sum.amountCents ?? 0
          const required = Math.max(
            0,
            (withdrawal.requiredRepaymentCents ?? withdrawal.amountCents) +
              (adjustmentAggregate._sum.adjustmentEffectCents ?? 0)
          )
          await tx.ledgerTransaction.update({
            where: { id: affectedWithdrawalId },
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
        status: 'PENDING',
        expiresAt: upload.expiresAt,
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
      select: {
        id: true,
        mimeType: true,
        byteSize: true,
        sha256: true,
        status: true,
        expiresAt: true,
        createdAt: true,
      },
    })
    return row ? mapEvidence(row) : null
  }

  async purgeExpiredPendingEvidence(now: Date = new Date()): Promise<number> {
    const result = await this.db.ledgerEvidence.deleteMany({
      where: { status: 'PENDING', expiresAt: { lt: now } },
    })
    return result.count
  }

  async getCredential(role: LedgerRole): Promise<LedgerCredentialRecord | null> {
    const row = await this.db.ledgerCredential.findUnique({ where: { role } })
    return row ? mapCredential(row) : null
  }

  async seedCredential(role: LedgerRole, passwordHash: string): Promise<LedgerCredentialRecord> {
    // `create`-only semantics: an existing row is never overwritten, which is
    // what makes an in-app password change survive redeployment.
    const row = await this.db.ledgerCredential.upsert({
      where: { role },
      update: {},
      create: { role, passwordHash, credentialVersion: 1 },
    })
    return mapCredential(row)
  }

  async setCredential(role: LedgerRole, passwordHash: string): Promise<LedgerCredentialRecord> {
    const row = await this.db.ledgerCredential.upsert({
      where: { role },
      update: { passwordHash, credentialVersion: { increment: 1 } },
      create: { role, passwordHash, credentialVersion: 1 },
    })
    return mapCredential(row)
  }

  async bumpCredentialVersion(role: LedgerRole): Promise<LedgerCredentialRecord | null> {
    const existing = await this.db.ledgerCredential.findUnique({ where: { role } })
    if (!existing) return null
    const row = await this.db.ledgerCredential.update({
      where: { role },
      data: { credentialVersion: { increment: 1 } },
    })
    return mapCredential(row)
  }

  async getSetting(key: string): Promise<string | null> {
    const row = await this.db.ledgerSetting.findUnique({ where: { key } })
    return row?.value ?? null
  }

  async setSetting(key: string, value: string): Promise<void> {
    await this.db.ledgerSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }
}

let repository: PrismaLedgerRepository | undefined

export function getLedgerRepository(): LedgerRepository {
  if (!repository) repository = new PrismaLedgerRepository()
  return repository
}
