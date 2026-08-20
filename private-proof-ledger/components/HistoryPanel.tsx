'use client'

import { TransactionRow } from '../server/view'
import {
  EvidenceLink,
  formatDisplayDate,
  Panel,
  Row,
  StatusBadge,
  TYPE_LABELS,
} from './primitives'

function HistoryCard({ row }: { row: TransactionRow }) {
  const signedAmount =
    row.type === 'WITHDRAWAL' ? -row.amountCents : row.type === 'ADJUSTMENT' ? row.baseEffectCents : row.amountCents

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 shadow-sm print:border-slate-300 print:bg-white">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-stone-100 print:text-black">
            {row.transactionCode}
          </p>
          <p className="text-xs text-stone-500">
            {TYPE_LABELS[row.type]} • {formatDisplayDate(row.date)}
          </p>
        </div>
        {row.status ? <StatusBadge status={row.status} /> : null}
      </header>

      <div className="mt-3 divide-y divide-white/10 print:divide-slate-300">
        {row.type === 'WITHDRAWAL' ? (
          <>
            <Row label="Principal" cents={-row.amountCents} signed />
            <Row label="Extra Repayment Added" cents={row.extraRepaymentCents ?? 0} />
            <Row label="Required Repayment" cents={row.requiredRepaymentCents ?? 0} emphasis />
          </>
        ) : (
          <Row label="Amount" cents={signedAmount} signed emphasis />
        )}

        {row.correctsTransactionCode ? (
          <div className="flex items-baseline justify-between gap-4 py-1.5 text-sm">
            <span className="text-stone-400 print:text-slate-700">Corrects</span>
            <span className="text-stone-200 print:text-black">
              {row.correctsTransactionCode}
              {row.adjustmentScope ? ` • ${row.adjustmentScope}` : ''}
            </span>
          </div>
        ) : null}

        {row.linkedWithdrawalCode ? (
          <div className="flex items-baseline justify-between gap-4 py-1.5 text-sm">
            <span className="text-stone-400 print:text-slate-700">Linked</span>
            <span className="text-stone-200 print:text-black">{row.linkedWithdrawalCode}</span>
          </div>
        ) : null}

        <Row label="Base Effect" cents={row.baseEffectCents} signed />
        {row.type === 'BASE_DEPOSIT' ? (
          <Row label="Base Remaining After" cents={row.baseRemainingAfterCents} emphasis />
        ) : null}
      </div>

      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
        <span className="max-w-[70%] truncate print:text-slate-700">{row.reason}</span>
        <EvidenceLink evidenceId={row.evidenceId} />
      </footer>
    </article>
  )
}

export default function HistoryPanel({ transactions }: { transactions: TransactionRow[] }) {
  const newestFirst = [...transactions].reverse()

  return (
    <Panel
      id="history"
      title="Transaction History"
      subtitle={`${transactions.length} permanent record${transactions.length === 1 ? '' : 's'}`}
    >
      {newestFirst.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-stone-500">
          No transactions recorded yet.
        </p>
      ) : (
        <div className="space-y-3">
          {newestFirst.map((row) => (
            <HistoryCard key={row.id} row={row} />
          ))}
        </div>
      )}
    </Panel>
  )
}

export { HistoryCard }
