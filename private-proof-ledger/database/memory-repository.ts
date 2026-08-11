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
  LedgerEvidenceRecord,
  LedgerNoteRecord,
  LedgerRole,
  LedgerTransactionRecord,
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
    createdAt: payload.createdAt,
  }
}

export class MemoryLedgerRepository implements LedgerRepository {
  private config: LedgerConfigRecord | null = null
  private transactions: LedgerTransactionRecord[] = []
  private notes: LedgerNoteRecord[] = []
  private evidence = new Map<string, EvidencePayload>()
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

    if (record.linkedWithdrawalId) {
      const index = this.transactions.findIndex((tx) => tx.id === record.linkedWithdrawalId)
      if (index >= 0) {
        const withdrawal = this.transactions[index]
        const paid = this.transactions
          .filter(
            (tx) =>
              tx.type === 'WITHDRAWAL_REPAYMENT' && tx.linkedWithdrawalId === withdrawal.id
          )
          .reduce((sum, tx) => sum + tx.amountCents, 0)
        const required = withdrawal.requiredRepaymentCents ?? withdrawal.amountCents
        this.transactions[index] = {
          ...withdrawal,
          repaymentPaidCentsCache: paid,
          statusCache: deriveWithdrawalStatus(required, paid),
        }
      }
    }

    return created
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

  /** Test-only: simulate a direct database edit of an applied record. */
  tamperWith(transactionCode: string, patch: Partial<LedgerTransactionRecord>): void {
    const index = this.transactions.findIndex((tx) => tx.transactionCode === transactionCode)
    if (index < 0) throw new Error(`${transactionCode} not found`)
    this.transactions[index] = { ...this.transactions[index], ...patch }
  }
}
