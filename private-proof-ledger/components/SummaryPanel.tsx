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
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300 ring-1 ring-slate-700">
            Obligation locked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-200 ring-1 ring-amber-800/60">
            Not locked
          </span>
        )
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 print:border-slate-300 print:bg-white">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Currently Outstanding</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-50 print:text-black">
            <Money cents={summary.totalCurrentlyOutstandingCents} />
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Base Remaining + Open Withdrawal Repayment
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 print:border-slate-300 print:bg-white">
          <p className="text-xs uppercase tracking-wide text-slate-500">Original Obligation</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-50 print:text-black">
            <Money cents={summary.originalObligationCents} />
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {summary.obligationLocked
              ? 'Locked — changes require an auditable adjustment'
              : 'Awaiting owner confirmation'}
          </p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-slate-800 print:divide-slate-300">
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

      <div className="mt-4 rounded-lg border border-slate-800/70 bg-slate-950/30 px-3 py-2 print:border-slate-300">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[11px] uppercase tracking-wide text-slate-500">
            Total Extra Repayment Added
          </span>
          <span className="text-sm tabular-nums text-slate-300 print:text-black">
            <Money cents={summary.totalExtraRepaymentAddedCents} />
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-600">
          Historical and informational. Already included inside required withdrawal repayments —
          not added again to Total Currently Outstanding.
        </p>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>Base progress</span>
          <span className="tabular-nums">{summary.progressPercent.toFixed(1)}%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${Math.min(100, summary.progressPercent)}%` }}
          />
        </div>
      </div>
    </Panel>
  )
}
