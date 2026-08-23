import { MemoryLedgerRepository } from '../database/memory-repository'
import { PrepareRecordInput, prepareRecord } from '../ledger/apply'
import { computeSummary, computeWithdrawalViews } from '../ledger/engine'
import { sha256Hex } from '../ledger/hash-chain'
import { DEFAULT_ORIGINAL_OBLIGATION_CENTS, LedgerTransactionRecord } from '../ledger/types'

export const CAD = (dollars: number): number => Math.round(dollars * 100)

export const TEST_EVIDENCE_BYTES = Buffer.from('fictional-screenshot-bytes')

export async function makeLedger(
  originalObligationCents: number = DEFAULT_ORIGINAL_OBLIGATION_CENTS
): Promise<MemoryLedgerRepository> {
  const repository = new MemoryLedgerRepository()
  await repository.lockConfig(originalObligationCents)
  return repository
}

/** Store a fictional screenshot and return its id and hash. */
export async function addEvidence(
  repository: MemoryLedgerRepository,
  data: Buffer = TEST_EVIDENCE_BYTES
): Promise<{ evidenceId: string; evidenceSha256: string }> {
  const sha256 = sha256Hex(data)
  const record = await repository.createEvidence({
    data,
    mimeType: 'image/png',
    byteSize: data.byteLength,
    sha256,
    expiresAt: new Date('2026-08-12T09:24:00.000Z'),
  })
  return { evidenceId: record.id, evidenceSha256: sha256 }
}

export async function applyRecord(
  repository: MemoryLedgerRepository,
  input: Partial<PrepareRecordInput> & Pick<PrepareRecordInput, 'type' | 'amountCents'>
): Promise<LedgerTransactionRecord> {
  const config = await repository.getConfig()
  if (!config) throw new Error('ledger config missing')

  const evidence =
    input.evidenceId && input.evidenceSha256
      ? { evidenceId: input.evidenceId, evidenceSha256: input.evidenceSha256 }
      : await addEvidence(repository)

  const transactions = await repository.listTransactions()
  const preview = prepareRecord(config, transactions, {
    date: '2026-08-11',
    reason: 'test record',
    ...input,
    ...evidence,
  })
  return repository.appendTransaction(preview.record)
}

export async function summaryOf(repository: MemoryLedgerRepository) {
  const config = await repository.getConfig()
  if (!config) throw new Error('ledger config missing')
  return computeSummary(config, await repository.listTransactions())
}

export async function withdrawalsOf(repository: MemoryLedgerRepository) {
  return computeWithdrawalViews(await repository.listTransactions())
}
