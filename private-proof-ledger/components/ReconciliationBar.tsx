'use client'

import { ReconciliationSnapshot } from '../ledger/types'
import { IntegrityResult } from '../ledger/hash-chain'
import { formatDisplayDateTime } from './primitives'

export default function ReconciliationBar({
  reconciliation,
  integrity,
}: {
  reconciliation: ReconciliationSnapshot
  integrity: IntegrityResult
}) {
  const items = [
    { label: 'Last Transaction', value: reconciliation.lastTransactionCode ?? '—' },
    {
      label: 'Last Updated',
      value: reconciliation.lastUpdatedAt
        ? formatDisplayDateTime(reconciliation.lastUpdatedAt)
        : '—',
    },
    { label: 'Open Withdrawals', value: String(reconciliation.openWithdrawalCount) },
    { label: 'Unresolved Notes', value: String(reconciliation.unresolvedNoteCount) },
    {
      label: 'Chain Integrity',
      value: integrity.ok ? `Verified (${integrity.checkedRecords})` : 'FAILED',
    },
  ]

  return (
    <div
      className={`grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border px-4 py-3 sm:grid-cols-5 ${
        integrity.ok
          ? 'border-slate-800 bg-slate-900/60'
          : 'border-rose-800 bg-rose-950/50'
      } print:border-slate-300 print:bg-white`}
    >
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-[10px] uppercase tracking-wide text-slate-500">{item.label}</p>
          <p className="mt-0.5 truncate text-sm font-medium text-slate-200 print:text-black">
            {item.value}
          </p>
        </div>
      ))}
      {!integrity.ok ? (
        <p className="col-span-2 text-xs text-rose-200 sm:col-span-5">
          Hash-chain verification failed on{' '}
          {integrity.failures.map((failure) => failure.transactionCode).join(', ')}. The stored
          history no longer matches its hashes.
        </p>
      ) : null}
    </div>
  )
}
