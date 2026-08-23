/**
 * Proof Ledger — persistence contract.
 *
 * The rest of the application talks to this interface only, which keeps the
 * deterministic engine and the server handlers testable without a database.
 */

import { PreparedRecord } from '../ledger/apply'
import {
  LedgerConfigRecord,
  LedgerCredentialRecord,
  LedgerEvidenceRecord,
  LedgerTransactionEvidenceRecord,
  LedgerNoteRecord,
  LedgerRole,
  LedgerTransactionRecord,
} from '../ledger/types'

export interface EvidenceUpload {
  data: Buffer
  mimeType: string
  byteSize: number
  sha256: string
  /** When an unapplied upload becomes eligible for cleanup. */
  expiresAt: Date
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
  listEvidenceForTransactions(
    transactionIds: readonly string[]
  ): Promise<Map<string, LedgerTransactionEvidenceRecord[]>>

  listNotes(): Promise<LedgerNoteRecord[]>
  createNote(input: {
    transactionId: string | null
    authorRole: LedgerRole
    body: string
  }): Promise<LedgerNoteRecord>
  resolveNote(noteId: string): Promise<LedgerNoteRecord | null>

  /** Stored PENDING until the record that uses it is applied. */
  createEvidence(upload: EvidenceUpload): Promise<LedgerEvidenceRecord>
  getEvidence(evidenceId: string): Promise<EvidencePayload | null>
  getEvidenceMeta(evidenceId: string): Promise<LedgerEvidenceRecord | null>
  /** Delete expired PENDING evidence. Never touches APPLIED evidence. */
  purgeExpiredPendingEvidence(now?: Date): Promise<number>

  getCredential(role: LedgerRole): Promise<LedgerCredentialRecord | null>
  /** First-run seed from the bootstrap hash. Never overwrites an existing row. */
  seedCredential(role: LedgerRole, passwordHash: string): Promise<LedgerCredentialRecord>
  /** Rotate a password and bump its credential version. */
  setCredential(role: LedgerRole, passwordHash: string): Promise<LedgerCredentialRecord>
  bumpCredentialVersion(role: LedgerRole): Promise<LedgerCredentialRecord | null>

  getSetting(key: string): Promise<string | null>
  setSetting(key: string, value: string): Promise<void>
}

export class LedgerConflictError extends Error {
  readonly code: string
  constructor(code: string, message: string) {
    super(message)
    this.name = 'LedgerConflictError'
    this.code = code
  }
}
