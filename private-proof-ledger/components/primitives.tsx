'use client'

import { ReactNode } from 'react'

import { formatMoney, formatSignedMoney } from '../ledger/money'
import { WithdrawalStatus } from '../ledger/types'

export function Money({ cents, signed = false }: { cents: number; signed?: boolean }) {
  return (
    <span className="tabular-nums">{signed ? formatSignedMoney(cents) : formatMoney(cents)}</span>
  )
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  id,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  id?: string
}) {
  return (
    <section
      id={id}
      className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 print:border-slate-300 print:bg-white"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100 print:text-black">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-slate-400 print:text-slate-700">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

/** A labelled money row — the workhorse of every breakdown in this ledger. */
export function Row({
  label,
  cents,
  emphasis = false,
  signed = false,
  hint,
}: {
  label: string
  cents: number
  emphasis?: boolean
  signed?: boolean
  hint?: string
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span
        className={`text-sm ${emphasis ? 'font-semibold text-slate-100 print:text-black' : 'text-slate-400 print:text-slate-700'}`}
      >
        {label}
        {hint ? (
          <span className="ml-1 block text-[11px] font-normal text-slate-500 sm:inline">
            {hint}
          </span>
        ) : null}
      </span>
      <span
        className={`shrink-0 text-sm ${emphasis ? 'font-semibold text-slate-50 print:text-black' : 'text-slate-200 print:text-black'}`}
      >
        <Money cents={cents} signed={signed} />
      </span>
    </div>
  )
}

const STATUS_STYLES: Record<WithdrawalStatus, string> = {
  OPEN: 'bg-amber-950/60 text-amber-200 ring-amber-800/60',
  PARTIAL: 'bg-sky-950/60 text-sky-200 ring-sky-800/60',
  CLOSED: 'bg-emerald-950/60 text-emerald-200 ring-emerald-800/60',
}

export function StatusBadge({ status }: { status: WithdrawalStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ${STATUS_STYLES[status]} print:bg-white print:text-black print:ring-slate-400`}
    >
      {status}
    </span>
  )
}

export function EvidenceLink({ evidenceId }: { evidenceId: string | null }) {
  if (!evidenceId) return <span className="text-xs text-slate-500">No proof attached</span>
  return (
    <a
      href={`/api/proof-ledger/evidence/${evidenceId}`}
      target="_blank"
      rel="noreferrer noopener"
      className="text-xs font-medium text-emerald-400 underline underline-offset-2 print:hidden"
    >
      View Proof
    </a>
  )
}

export function formatDisplayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  if (!year || !month || !day) return isoDate
  return `${months[month - 1]} ${day}, ${year}`
}

export function formatDisplayDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return `${formatDisplayDate(date.toISOString().slice(0, 10))} • ${date
    .toISOString()
    .slice(11, 16)} UTC`
}

export const TYPE_LABELS: Record<string, string> = {
  BASE_DEPOSIT: 'BASE DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  WITHDRAWAL_REPAYMENT: 'WITHDRAWAL REPAYMENT',
  ADJUSTMENT: 'ADJUSTMENT',
}
