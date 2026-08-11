'use client'

import { WithdrawalTotals, WithdrawalView } from '../ledger/types'
import { EvidenceLink, formatDisplayDate, Panel, Row, StatusBadge } from './primitives'

/**
 * Every withdrawal shows principal, extra repayment added and required
 * repayment as three separate rows. They are never collapsed into a single
 * unexplained figure.
 */
function WithdrawalCard({ view }: { view: WithdrawalView }) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 print:border-slate-300 print:bg-white">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-100 print:text-black">
            {view.transactionCode}
          </p>
          <p className="text-xs text-slate-500">
            WITHDRAWAL • {formatDisplayDate(view.date)}
          </p>
        </div>
        <StatusBadge status={view.status} />
      </header>

      <div className="mt-3 divide-y divide-slate-800/80 print:divide-slate-300">
        {view.hasAdjustments ? (
          <>
            {/* Corrections never rewrite the original record, so both the
                original and the effective figures stay visible. */}
            <Row label="Original Principal" cents={view.originalPrincipalCents} />
            <Row
              label="Principal Adjustments"
              cents={view.principalAdjustmentCents}
              signed
            />
            <Row label="Effective Principal" cents={view.principalCents} emphasis />
            <Row label="Original Extra" cents={view.originalExtraRepaymentCents} />
            <Row label="Extra Adjustments" cents={view.extraAdjustmentCents} signed />
            <Row label="Effective Extra" cents={view.extraRepaymentCents} emphasis />
            <Row label="Effective Required" cents={view.requiredRepaymentCents} emphasis />
          </>
        ) : (
          <>
            <Row label="Amount Withdrawn" cents={view.principalCents} />
            <Row label="Extra Repayment Added" cents={view.extraRepaymentCents} />
            <Row label="Required Repayment" cents={view.requiredRepaymentCents} emphasis />
          </>
        )}
        <Row label="Repayment Paid" cents={view.repaymentAppliedCents} />
        <Row label="Repayment Remaining" cents={view.repaymentRemainingCents} emphasis />
        <Row label="Effect on Base" cents={view.baseEffectCents} />
        {view.overpaidCents > 0 ? <Row label="Overpaid" cents={view.overpaidCents} /> : null}
      </div>

      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span className="max-w-[70%] truncate print:text-slate-700">Reason: {view.reason}</span>
        <EvidenceLink evidenceId={view.evidenceId} />
      </footer>
    </article>
  )
}

export function WithdrawalTotalsBlock({ totals }: { totals: WithdrawalTotals }) {
  return (
    <div className="rounded-lg border-2 border-slate-700 bg-slate-950/70 p-4 print:border-slate-500 print:bg-white">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 print:text-black">
        Withdrawal Totals
      </p>
      <div className="mt-3 divide-y divide-slate-800 print:divide-slate-300">
        <Row
          label="Total Principal Withdrawn"
          cents={totals.totalPrincipalWithdrawnCents}
          hint="historical"
        />
        <Row
          label="Total Extra Repayment Added"
          cents={totals.totalExtraRepaymentAddedCents}
          emphasis
          hint="historical — includes closed withdrawals"
        />
        <Row
          label="Total Required Repayment"
          cents={totals.totalRequiredRepaymentCents}
          hint="historical"
        />
        <Row label="Total Repayment Paid" cents={totals.totalRepaymentPaidCents} />
        <Row
          label="Withdrawal Repayment Remaining"
          cents={totals.withdrawalRepaymentRemainingCents}
          emphasis
          hint="current"
        />
        {totals.totalOverpaidCents > 0 ? (
          <Row label="Total Overpaid" cents={totals.totalOverpaidCents} />
        ) : null}
      </div>
    </div>
  )
}

export default function WithdrawalsPanel({
  withdrawals,
  totals,
}: {
  withdrawals: WithdrawalView[]
  totals: WithdrawalTotals
}) {
  const newestFirst = [...withdrawals].reverse()

  return (
    <Panel
      id="withdrawals"
      title="Withdrawals"
      subtitle={`${totals.withdrawalCount} recorded • ${totals.openWithdrawalCount} still open`}
    >
      {newestFirst.length === 0 ? (
        <p className="text-sm text-slate-500">No withdrawals recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {newestFirst.map((view) => (
            <WithdrawalCard key={view.id} view={view} />
          ))}
        </div>
      )}

      <div className="mt-5">
        <WithdrawalTotalsBlock totals={totals} />
      </div>

      <p className="mt-3 text-[11px] text-slate-600">
        Total Extra Repayment Added is a historical figure. A withdrawal that has been fully repaid
        still counts toward it, but contributes nothing to the current outstanding balance.
      </p>
    </Panel>
  )
}
