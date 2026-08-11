import { MemoryLedgerRepository } from '../database/memory-repository'
import { PrepareRecordInput, prepareRecord } from '../ledger/apply'
import { computeSummary, computeWithdrawalViews } from '../ledger/engine'
import { DEFAULT_ORIGINAL_OBLIGATION_CENTS, LedgerTransactionRecord } from '../ledger/types'

export const CAD = (dollars: number): number => Math.round(dollars * 100)

export async function makeLedger(
  originalObligationCents: number = DEFAULT_ORIGINAL_OBLIGATION_CENTS
): Promise<MemoryLedgerRepository> {
  const repository = new MemoryLedgerRepository()
  await repository.lockConfig(originalObligationCents)
  return repository
}

export async function applyRecord(
  repository: MemoryLedgerRepository,
  input: Partial<PrepareRecordInput> & Pick<PrepareRecordInput, 'type' | 'amountCents'>
): Promise<LedgerTransactionRecord> {
  const config = await repository.getConfig()
  if (!config) throw new Error('ledger config missing')
  const transactions = await repository.listTransactions()
  const preview = prepareRecord(config, transactions, {
    date: '2026-08-11',
    reason: 'test record',
    evidenceId: 'ev-test',
    ...input,
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
