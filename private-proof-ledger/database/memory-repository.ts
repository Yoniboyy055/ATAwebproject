/**
 * Proof Ledger — in-memory repository.
 *
 * Used by the test suite so the deterministic engine, the access model and the
 * server handlers can be proven without a live database. It is never wired
 * into the running application.
 */

import { PreparedRecord } from '../ledger/apply'
import { deriveWithdrawalStatus } from '../ledger/engine'
import {
  DEFAULT_ORIGINAL_OBLIGATION_CENTS,
  LedgerConfigRecord,
  LedgerCredentialRecord,
  LedgerEvidenceRecord,
  LedgerNoteRecord,
  LedgerRole,
  LedgerTransactionRecord,
  LedgerTransactionEvidenceRecord,
} from '../ledger/types'
import {
  EvidencePayload,
  EvidenceUpload,
  LedgerConflictError,
  LedgerRepository,
} from './repository'

function stripBytes(payload: EvidencePayload): LedgerEvidenceRecord {
  return {
    id: payload.id,
    mimeType: payload.mimeType,
    byteSize: payload.byteSize,
    sha256: payload.sha256,
    status: payload.status,
    expiresAt: payload.expiresAt,
    createdAt: payload.createdAt,
  }
}

export class MemoryLedgerRepository implements LedgerRepository {
  private config: LedgerConfigRecord | null = null
  private transactions: LedgerTransactionRecord[] = []
  private transactionEvidence = new Map<string, LedgerTransactionEvidenceRecord[]>()
  private notes: LedgerNoteRecord[] = []
  private evidence = new Map<string, EvidencePayload>()
  private credentials = new Map<LedgerRole, LedgerCredentialRecord>()
  private settings = new Map<string, string>()
  private counter = 0

  constructor(private readonly now: () => Date = () => new Date('2026-08-11T09:24:00.000Z')) {}

  private nextId(prefix: string): string {
    this.counter += 1
    return `${prefix}-${this.counter.toString().padStart(4, '0')}`
  }

  async getConfig(): Promise<LedgerConfigRecord | null> {
    return this.config
  }

  async ensureConfig(
    originalObligationCents: number = DEFAULT_ORIGINAL_OBLIGATION_CENTS
  ): Promise<LedgerConfigRecord> {
    if (!this.config) {
      this.config = {
        id: this.nextId('cfg'),
        currency: 'CAD',
        originalObligationCents,
        lockedAt: null,
        createdAt: this.now().toISOString(),
      }
    }
    return this.config
  }

  async lockConfig(originalObligationCents: number): Promise<LedgerConfigRecord> {
    const config = await this.ensureConfig(originalObligationCents)
    if (config.lockedAt) {
      throw new LedgerConflictError(
        'ALREADY_LOCKED',
        'The original obligation is already locked. Use an adjustment to correct it.'
      )
    }
    this.config = {
      ...config,
      originalObligationCents,
      lockedAt: this.now().toISOString(),
    }
    return this.config
  }

  async listTransactions(): Promise<LedgerTransactionRecord[]> {
    return [...this.transactions].sort((a, b) => a.sequence - b.sequence)
  }

  async listEvidenceForTransactions(
    transactionIds: readonly string[]
  ): Promise<Map<string, LedgerTransactionEvidenceRecord[]>> {
    const result = new Map<string, LedgerTransactionEvidenceRecord[]>()
    for (const id of transactionIds) {
      const linked = this.transactionEvidence.get(id)
      if (linked) result.set(id, [...linked].sort((a, b) => a.position - b.position))
    }
    return result
  }

  async appendTransaction(record: PreparedRecord): Promise<LedgerTransactionRecord> {
    const head = this.transactions[this.transactions.length - 1] ?? null
    if ((record.previousRecordHash ?? null) !== (head?.recordHash ?? null)) {
      throw new LedgerConflictError(
        'CHAIN_MOVED',
        'The ledger changed while this record was being confirmed. Re-run the analysis.'
      )
    }

    const created: LedgerTransactionRecord = {
      id: this.nextId('tx'),
      ...record,
      repaymentPaidCentsCache: record.type === 'WITHDRAWAL' ? 0 : null,
      statusCache: record.type === 'WITHDRAWAL' ? 'OPEN' : null,
      createdAt: this.now().toISOString(),
    }
    this.transactions.push(created)

    const evidenceItems =
      record.evidenceItems && record.evidenceItems.length > 0
        ? record.evidenceItems
        : [{ evidenceId: record.evidenceId, evidenceSha256: record.evidenceSha256 }]

    const linked: LedgerTransactionEvidenceRecord[] = []
    // The screenshot is now permanent proof and can never be cleaned up.
    evidenceItems.forEach((item, position) => {
      const evidence = this.evidence.get(item.evidenceId)
      if (!evidence) return
      const applied = {
        ...evidence,
        status: 'APPLIED' as const,
        expiresAt: null,
      }
      this.evidence.set(item.evidenceId, applied)
      linked.push({
        ...stripBytes(applied),
        transactionId: created.id,
        position,
      })
    })
    if (linked.length > 0) {
      this.transactionEvidence.set(created.id, linked)
    }

    if (record.linkedWithdrawalId) {
      this.refreshWithdrawalCache(record.linkedWithdrawalId)
    }
    if (record.correctsTransactionId && record.adjustmentScope !== 'BASE') {
      this.refreshWithdrawalCache(record.correctsTransactionId)
    }

    return created
  }

  /** Denormalised display columns only — the engine remains authoritative. */
  private refreshWithdrawalCache(withdrawalId: string): void {
    const index = this.transactions.findIndex((tx) => tx.id === withdrawalId)
    if (index < 0) return
    const withdrawal = this.transactions[index]
    if (withdrawal.type !== 'WITHDRAWAL') return

    const paid = this.transactions
      .filter(
        (tx) => tx.type === 'WITHDRAWAL_REPAYMENT' && tx.linkedWithdrawalId === withdrawal.id
      )
      .reduce((sum, tx) => sum + tx.amountCents, 0)

    const adjustment = this.transactions
      .filter(
        (tx) =>
          tx.type === 'ADJUSTMENT' &&
          tx.correctsTransactionId === withdrawal.id &&
          tx.adjustmentScope !== 'BASE'
      )
      .reduce((sum, tx) => sum + (tx.adjustmentEffectCents ?? 0), 0)

    const required = Math.max(
      0,
      (withdrawal.requiredRepaymentCents ?? withdrawal.amountCents) + adjustment
    )

    this.transactions[index] = {
      ...withdrawal,
      repaymentPaidCentsCache: paid,
      statusCache: deriveWithdrawalStatus(required, paid),
    }
  }

  async listNotes(): Promise<LedgerNoteRecord[]> {
    return [...this.notes]
  }

  async createNote(input: {
    transactionId: string | null
    authorRole: LedgerRole
    body: string
  }): Promise<LedgerNoteRecord> {
    const note: LedgerNoteRecord = {
      id: this.nextId('note'),
      transactionId: input.transactionId,
      authorRole: input.authorRole,
      body: input.body,
      createdAt: this.now().toISOString(),
      resolvedAt: null,
    }
    this.notes.push(note)
    return note
  }

  async resolveNote(noteId: string): Promise<LedgerNoteRecord | null> {
    const index = this.notes.findIndex((note) => note.id === noteId)
    if (index < 0) return null
    if (!this.notes[index].resolvedAt) {
      this.notes[index] = { ...this.notes[index], resolvedAt: this.now().toISOString() }
    }
    return this.notes[index]
  }

  async createEvidence(upload: EvidenceUpload): Promise<LedgerEvidenceRecord> {
    const record: EvidencePayload = {
      id: this.nextId('ev'),
      mimeType: upload.mimeType,
      byteSize: upload.byteSize,
      sha256: upload.sha256,
      status: 'PENDING',
      expiresAt: upload.expiresAt.toISOString(),
      createdAt: this.now().toISOString(),
      data: upload.data,
    }
    this.evidence.set(record.id, record)
    return stripBytes(record)
  }

  async getEvidence(evidenceId: string): Promise<EvidencePayload | null> {
    return this.evidence.get(evidenceId) ?? null
  }

  async getEvidenceMeta(evidenceId: string): Promise<LedgerEvidenceRecord | null> {
    const found = this.evidence.get(evidenceId)
    return found ? stripBytes(found) : null
  }

  async purgeExpiredPendingEvidence(now: Date = this.now()): Promise<number> {
    let removed = 0
    for (const [id, record] of this.evidence) {
      if (record.status !== 'PENDING') continue
      if (!record.expiresAt) continue
      if (new Date(record.expiresAt).getTime() > now.getTime()) continue
      this.evidence.delete(id)
      removed += 1
    }
    return removed
  }

  async getCredential(role: LedgerRole): Promise<LedgerCredentialRecord | null> {
    return this.credentials.get(role) ?? null
  }

  async seedCredential(role: LedgerRole, passwordHash: string): Promise<LedgerCredentialRecord> {
    const existing = this.credentials.get(role)
    if (existing) return existing
    const record: LedgerCredentialRecord = {
      role,
      passwordHash,
      credentialVersion: 1,
      updatedAt: this.now().toISOString(),
    }
    this.credentials.set(role, record)
    return record
  }

  async setCredential(role: LedgerRole, passwordHash: string): Promise<LedgerCredentialRecord> {
    const existing = this.credentials.get(role)
    const record: LedgerCredentialRecord = {
      role,
      passwordHash,
      credentialVersion: (existing?.credentialVersion ?? 0) + 1,
      updatedAt: this.now().toISOString(),
    }
    this.credentials.set(role, record)
    return record
  }

  async bumpCredentialVersion(role: LedgerRole): Promise<LedgerCredentialRecord | null> {
    const existing = this.credentials.get(role)
    if (!existing) return null
    const record: LedgerCredentialRecord = {
      ...existing,
      credentialVersion: existing.credentialVersion + 1,
      updatedAt: this.now().toISOString(),
    }
    this.credentials.set(role, record)
    return record
  }

  async getSetting(key: string): Promise<string | null> {
    return this.settings.get(key) ?? null
  }

  async setSetting(key: string, value: string): Promise<void> {
    this.settings.set(key, value)
  }

  /** Test-only: simulate a direct database edit of an applied record. */
  tamperWith(transactionCode: string, patch: Partial<LedgerTransactionRecord>): void {
    const index = this.transactions.findIndex((tx) => tx.transactionCode === transactionCode)
    if (index < 0) throw new Error(`${transactionCode} not found`)
    this.transactions[index] = { ...this.transactions[index], ...patch }
  }

  /** Test-only: simulate a direct database edit of stored screenshot bytes. */
  tamperWithEvidence(evidenceId: string, data: Buffer): void {
    const existing = this.evidence.get(evidenceId)
    if (!existing) throw new Error(`${evidenceId} not found`)
    this.evidence.set(evidenceId, { ...existing, data, byteSize: data.byteLength })
  }
}
