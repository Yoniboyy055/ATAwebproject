'use client'

import { LedgerSummary } from '../ledger/types'
import { Money, Panel, Row } from './primitives'

/**
 * The five headline figures plus one deliberately secondary statistic.
 *
 * Total Extra Repayment Added is shown small and labelled historical, because
 * it is already inside the outstanding withdrawal repayments — showing it as a
 * headline would read as money owed twice.
 */
export default function SummaryPanel({ summary }: { summary: LedgerSummary }) {
  return (
    <Panel
      id="summary"
      title="Summary"
      subtitle={`Currency: ${summary.currency}`}
      action={
        summary.obligationLocked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-100 ring-1 ring-emerald-300/25">
            Obligation locked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-100 ring-1 ring-amber-300/25">
            Not locked
          </span>
        )
      }
    >
      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-cyan-200/15 bg-[linear-gradient(135deg,rgba(20,184,166,0.14),rgba(8,9,11,0.82))] p-5 shadow-inner print:border-slate-300 print:bg-white">
          <p className="text-xs uppercase tracking-wide text-cyan-100/70">Total Currently Outstanding</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-stone-50 sm:text-4xl print:text-black">
            <Money cents={summary.totalCurrentlyOutstandingCents} />
          </p>
          <p className="mt-2 text-xs text-stone-400">
            Base Remaining + Open Withdrawal Repayment
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200/15 bg-[linear-gradient(135deg,rgba(245,158,11,0.13),rgba(8,9,11,0.78))] p-5 print:border-slate-300 print:bg-white">
          <p className="text-xs uppercase tracking-wide text-amber-100/70">Original Obligation</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-stone-50 sm:text-3xl print:text-black">
            <Money cents={summary.originalObligationCents} />
          </p>
          <p className="mt-2 text-xs text-stone-400">
            {summary.obligationLocked
              ? 'Locked. Changes require an auditable adjustment.'
              : 'Awaiting owner confirmation'}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 print:border-slate-300 print:bg-white">
        <div className="divide-y divide-white/10 print:divide-slate-300">
        <Row label="Base Deposited" cents={summary.baseDepositedCents} />
        <Row label="Base Remaining" cents={summary.baseRemainingCents} emphasis />
        {summary.baseAdjustmentCents !== 0 ? (
          <Row label="Base Adjustments" cents={summary.baseAdjustmentCents} signed />
        ) : null}
        <Row
          label="Open Withdrawal Repayment"
          cents={summary.openWithdrawalRepaymentCents}
          emphasis
        />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-900/45 px-4 py-3 print:border-slate-300">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[11px] uppercase tracking-wide text-stone-500">
            Total Extra Repayment Added
          </span>
          <span className="text-sm tabular-nums text-stone-300 print:text-black">
            <Money cents={summary.totalExtraRepaymentAddedCents} />
          </span>
        </div>
        <p className="mt-1 text-[11px] text-stone-600">
          Historical and informational. Already included inside required withdrawal repayments —
          not added again to Total Currently Outstanding.
        </p>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-[11px] text-stone-500">
          <span>Base progress</span>
          <span className="tabular-nums">{summary.progressPercent.toFixed(1)}%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-cyan-300"
            style={{ width: `${Math.min(100, summary.progressPercent)}%` }}
          />
        </div>
      </div>
    </Panel>
  )
}
