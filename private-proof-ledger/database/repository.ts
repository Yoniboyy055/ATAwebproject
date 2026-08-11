/**
 * Proof Ledger — persistence contract.
 *
 * The rest of the application talks to this interface only, which keeps the
 * deterministic engine and the server handlers testable without a database.
 */

import { PreparedRecord } from '../ledger/apply'
import {
  LedgerConfigRecord,
  LedgerEvidenceRecord,
  LedgerNoteRecord,
  LedgerRole,
  LedgerTransactionRecord,
} from '../ledger/types'

export interface EvidenceUpload {
  data: Buffer
  mimeType: string
  byteSize: number
  sha256: string
}

export interface EvidencePayload extends LedgerEvidenceRecord {
  data: Buffer
}

export interface LedgerRepository {
  getConfig(): Promise<LedgerConfigRecord | null>
  /** Create the config row if absent. Never overwrites a locked obligation. */
  ensureConfig(originalObligationCents: number): Promise<LedgerConfigRecord>
  /** Lock the opening obligation. Rejected if already locked. */
  lockConfig(originalObligationCents: number): Promise<LedgerConfigRecord>

  listTransactions(): Promise<LedgerTransactionRecord[]>
  appendTransaction(record: PreparedRecord): Promise<LedgerTransactionRecord>

  listNotes(): Promise<LedgerNoteRecord[]>
  createNote(input: {
    transactionId: string | null
    authorRole: LedgerRole
    body: string
  }): Promise<LedgerNoteRecord>
  resolveNote(noteId: string): Promise<LedgerNoteRecord | null>

  createEvidence(upload: EvidenceUpload): Promise<LedgerEvidenceRecord>
  getEvidence(evidenceId: string): Promise<EvidencePayload | null>
  getEvidenceMeta(evidenceId: string): Promise<LedgerEvidenceRecord | null>
}

export class LedgerConflictError extends Error {
  readonly code: string
  constructor(code: string, message: string) {
    super(message)
    this.name = 'LedgerConflictError'
    this.code = code
  }
}
