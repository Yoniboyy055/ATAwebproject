'use client'

import { LedgerView } from '../server/view'
import {
  formatDisplayDate,
  formatDisplayDateTime,
  Money,
  TYPE_LABELS,
} from './primitives'
import { formatMoney } from '../ledger/money'

function StatementRow({
  label,
  cents,
  strong = false,
}: {
  label: string
  cents: number
  strong?: boolean
}) {
  return (
    <div className="flex justify-between gap-6 border-b border-slate-200 py-1.5 text-sm">
      <span className={strong ? 'font-semibold text-black' : 'text-slate-700'}>{label}</span>
      <span className={`tabular-nums ${strong ? 'font-semibold text-black' : 'text-black'}`}>
        {formatMoney(cents)}
      </span>
    </div>
  )
}

/**
 * Printable statement. Uses print CSS rather than a PDF library — the browser's
 * own "Save as PDF" is enough for a two-person private record.
 */
export default function StatementDocument({ view }: { view: LedgerView }) {
  const { summary } = view
  const totals = summary.withdrawalTotals

  return (
    <div className="min-h-screen bg-white px-5 py-8 text-black print:px-0 print:py-0">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-start justify-between gap-4 print:hidden">
          <a href="/proof-ledger" className="text-sm text-slate-600 underline">
            ← Back to ledger
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Print / Save Statement
          </button>
        </div>

        <header className="mt-6 border-b-2 border-black pb-3">
          <h1 className="text-xl font-bold">Proof Ledger</h1>
          <p className="text-sm text-slate-700">Private Financial Record</p>
          <p className="mt-1 text-xs text-slate-600">
            Generated {formatDisplayDateTime(view.generatedAt)} • Currency {view.currency}
          </p>
          <p className="text-xs text-slate-600">
            Chain integrity:{' '}
            {view.integrity.ok
              ? `verified across ${view.integrity.checkedRecords} record(s)`
              : 'FAILED — history does not match its hashes'}
          </p>
        </header>

        <section className="mt-5">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide">Position</h2>
          <StatementRow label="Original Obligation" cents={summary.originalObligationCents} />
          <StatementRow label="Total Base Deposited" cents={summary.baseDepositedCents} />
          {summary.baseAdjustmentCents !== 0 ? (
            <StatementRow label="Base Adjustments" cents={summary.baseAdjustmentCents} />
          ) : null}
          <StatementRow label="Base Remaining" cents={summary.baseRemainingCents} strong />
          <StatementRow
            label="Open Withdrawal Repayment Outstanding"
            cents={summary.openWithdrawalRepaymentCents}
            strong
          />
          <StatementRow
            label="Total Currently Outstanding"
            cents={summary.totalCurrentlyOutstandingCents}
            strong
          />
        </section>

        <section className="mt-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide">
            Withdrawal Totals (historical)
          </h2>
          <StatementRow
            label="Total Principal Withdrawn"
            cents={totals.totalPrincipalWithdrawnCents}
          />
          <StatementRow
            label="Total Extra Repayment Added"
            cents={totals.totalExtraRepaymentAddedCents}
            strong
          />
          <StatementRow
            label="Total Required Withdrawal Repayment"
            cents={totals.totalRequiredRepaymentCents}
          />
          <StatementRow label="Total Repayments Paid" cents={totals.totalRepaymentPaidCents} />
          <StatementRow
            label="Withdrawal Repayment Remaining (current)"
            cents={totals.withdrawalRepaymentRemainingCents}
            strong
          />
          <p className="mt-2 text-[11px] text-slate-600">
            Extra repayment added is reported separately from principal and is already included
            inside required withdrawal repayment. It is not added again to the total outstanding.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide">Withdrawals</h2>
          {view.withdrawals.length === 0 ? (
            <p className="text-sm text-slate-600">None recorded.</p>
          ) : (
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-black text-left">
                  <th className="py-1 pr-2">TX</th>
                  <th className="py-1 pr-2">Date</th>
                  <th className="py-1 pr-2 text-right">Principal</th>
                  <th className="py-1 pr-2 text-right">Extra</th>
                  <th className="py-1 pr-2 text-right">Required</th>
                  <th className="py-1 pr-2 text-right">Paid</th>
                  <th className="py-1 pr-2 text-right">Remaining</th>
                  <th className="py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {view.withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b border-slate-200">
                    <td className="py-1 pr-2">{withdrawal.transactionCode}</td>
                    <td className="py-1 pr-2">{formatDisplayDate(withdrawal.date)}</td>
                    <td className="py-1 pr-2 text-right tabular-nums">
                      {formatMoney(withdrawal.principalCents)}
                    </td>
                    <td className="py-1 pr-2 text-right tabular-nums">
                      {formatMoney(withdrawal.extraRepaymentCents)}
                    </td>
                    <td className="py-1 pr-2 text-right tabular-nums">
                      {formatMoney(withdrawal.requiredRepaymentCents)}
                    </td>
                    <td className="py-1 pr-2 text-right tabular-nums">
                      {formatMoney(withdrawal.repaymentAppliedCents)}
                    </td>
                    <td className="py-1 pr-2 text-right tabular-nums">
                      {formatMoney(withdrawal.repaymentRemainingCents)}
                    </td>
                    <td className="py-1">{withdrawal.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="mt-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide">
            Chronological Transactions
          </h2>
          {view.transactions.length === 0 ? (
            <p className="text-sm text-slate-600">None recorded.</p>
          ) : (
            <div className="space-y-2">
              {view.transactions.map((row) => (
                <div key={row.id} className="border-b border-slate-200 pb-2 text-xs">
                  <div className="flex justify-between gap-3 font-semibold">
                    <span>
                      {row.transactionCode} • {TYPE_LABELS[row.type]}
                    </span>
                    <span>{formatDisplayDate(row.date)}</span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5 text-slate-700">
                    {row.type === 'WITHDRAWAL' ? (
                      <>
                        <span>
                          Principal <Money cents={row.withdrawalPrincipalCents ?? 0} />
                        </span>
                        <span>
                          Extra <Money cents={row.extraRepaymentCents ?? 0} />
                        </span>
                        <span>
                          Required <Money cents={row.requiredRepaymentCents ?? 0} />
                        </span>
                      </>
                    ) : (
                      <span>
                        Amount <Money cents={row.amountCents} />
                      </span>
                    )}
                    {row.linkedWithdrawalCode ? (
                      <span>Linked {row.linkedWithdrawalCode}</span>
                    ) : null}
                    <span>
                      Base effect <Money cents={row.baseEffectCents} signed />
                    </span>
                    {row.status ? <span>Status {row.status}</span> : null}
                  </div>
                  <p className="mt-0.5 text-slate-600">{row.reason}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {view.notes.length > 0 ? (
          <section className="mt-6">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide">Notes Summary</h2>
            <ul className="space-y-1 text-xs">
              {view.notes.map((note) => (
                <li key={note.id} className="border-b border-slate-200 pb-1">
                  <span className="font-semibold">{note.authorRole}</span>{' '}
                  <span className="text-slate-600">
                    {formatDisplayDateTime(note.createdAt)}
                    {note.resolvedAt ? ' • resolved' : ' • open'}
                  </span>
                  <p className="text-slate-800">{note.body}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <footer className="mt-8 border-t border-slate-300 pt-3 text-[10px] text-slate-500">
          Built with YK Systems • This statement is a private record between two people and is not
          an accounting document.
        </footer>
      </div>
    </div>
  )
}
