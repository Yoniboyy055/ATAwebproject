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
      className="rounded-2xl border border-stone-200/10 bg-zinc-950/70 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)] ring-1 ring-white/[0.03] sm:p-6 print:border-slate-300 print:bg-white print:shadow-none"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-stone-50 print:text-black">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-stone-400 print:text-slate-700">{subtitle}</p>
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
        className={`text-sm ${emphasis ? 'font-semibold text-stone-100 print:text-black' : 'text-stone-400 print:text-slate-700'}`}
      >
        {label}
        {hint ? (
          <span className="ml-1 block text-[11px] font-normal text-stone-500 sm:inline">
            {hint}
          </span>
        ) : null}
      </span>
      <span
        className={`shrink-0 text-sm ${emphasis ? 'font-semibold text-stone-50 print:text-black' : 'text-stone-200 print:text-black'}`}
      >
        <Money cents={cents} signed={signed} />
      </span>
    </div>
  )
}

const STATUS_STYLES: Record<WithdrawalStatus, string> = {
  OPEN: 'bg-amber-500/12 text-amber-200 ring-amber-300/25',
  PARTIAL: 'bg-cyan-500/12 text-cyan-200 ring-cyan-300/25',
  CLOSED: 'bg-emerald-500/12 text-emerald-200 ring-emerald-300/25',
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
  if (!evidenceId) return <span className="text-xs text-stone-500">No proof attached</span>
  return (
    <a
      href={`/api/proof-ledger/evidence/${evidenceId}`}
      target="_blank"
      rel="noreferrer noopener"
      className="text-xs font-medium text-cyan-300 underline underline-offset-2 print:hidden"
    >
      View Proof
    </a>
  )
}

export function EvidenceLinks({
  evidenceId,
  evidenceItems = [],
}: {
  evidenceId: string | null
  evidenceItems?: readonly { id: string; position: number }[]
}) {
  const items =
    evidenceItems.length > 0
      ? [...evidenceItems].sort((a, b) => a.position - b.position)
      : evidenceId
        ? [{ id: evidenceId, position: 0 }]
        : []

  if (items.length === 0) return <span className="text-xs text-stone-500">No proof attached</span>

  return (
    <span className="flex flex-wrap justify-end gap-2">
      {items.map((item, index) => (
        <a
          key={item.id}
          href={`/api/proof-ledger/evidence/${item.id}`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-xs font-medium text-cyan-300 underline underline-offset-2 print:hidden"
        >
          Proof {items.length === 1 ? '' : index + 1}
        </a>
      ))}
    </span>
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
