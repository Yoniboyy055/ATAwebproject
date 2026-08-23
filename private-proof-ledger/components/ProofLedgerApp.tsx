'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { LedgerView } from '../server/view'
import HistoryPanel from './HistoryPanel'
import LockObligationPanel from './LockObligationPanel'
import NewTransactionPanel from './NewTransactionPanel'
import NotesPanel from './NotesPanel'
import ReconciliationBar from './ReconciliationBar'
import SettingsPanel from './SettingsPanel'
import SummaryPanel from './SummaryPanel'
import WithdrawalsPanel from './WithdrawalsPanel'
import { resolveAppearance, usePreferences } from './preferences'

const SECTIONS = [
  { id: 'summary', label: 'Dashboard' },
  { id: 'withdrawals', label: 'Withdrawals' },
  { id: 'history', label: 'Transactions' },
  { id: 'notes', label: 'Notes' },
  { id: 'settings', label: 'Settings' },
] as const

export default function ProofLedgerApp({ view }: { view: LedgerView }) {
  const router = useRouter()
  const [preferences] = usePreferences()
  const [signingOut, setSigningOut] = useState(false)
  const isOwner = view.role === 'OWNER'

  // Local display preferences are applied on the ledger root only.
  useEffect(() => {
    const root = document.querySelector('.proof-ledger-root')
    if (!(root instanceof HTMLElement)) return
    root.dataset.appearance = resolveAppearance(preferences.appearance)
    root.dataset.density = preferences.density
  }, [preferences.appearance, preferences.density])

  async function signOut() {
    setSigningOut(true)
    try {
      await fetch('/api/proof-ledger/session', { method: 'DELETE' })
      router.refresh()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#08090b] text-stone-100 print:bg-white print:text-black">
      <header className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#11100d_0%,#090b10_48%,#101312_100%)] px-4 py-5 sm:px-6 print:border-slate-300 print:bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-100">
                Private Ledger
              </span>
              <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-100">
                {view.role}
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-50 sm:text-3xl">
              Proof Ledger Dashboard
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-stone-400">
              Financial evidence, signed history and obligation tracking in one private record.
            </p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <a
              href="/proof-ledger/statement"
              className="rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-stone-100 shadow-sm"
            >
              Print / Save Statement
            </a>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-stone-400"
            >
              Sign out
            </button>
          </div>
        </div>
        <div className="mx-auto mt-5 flex max-w-6xl items-center justify-between border-t border-white/10 pt-3 text-[11px] uppercase tracking-wide text-stone-500">
          <span>Integrity-first record</span>
          <span className="text-stone-300">Built with YK Systems</span>
        </div>
      </header>

      {/* Desktop navigation rail; collapses to a scrolling chip row on mobile. */}
      <nav className="sticky top-0 z-10 border-b border-white/10 bg-[#08090b]/90 px-4 py-2 backdrop-blur sm:px-6 print:hidden">
        <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto">
          {(isOwner
            ? [{ id: 'new', label: 'New Transaction' } as const, ...SECTIONS]
            : SECTIONS
          ).map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="inline-block whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-stone-300"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6">
        <ReconciliationBar reconciliation={view.reconciliation} integrity={view.integrity} />

        {isOwner && !view.obligationLocked ? <LockObligationPanel /> : null}

        {!isOwner && !view.obligationLocked ? (
          <p className="rounded-xl border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
            The owner has not yet locked the original obligation.
          </p>
        ) : null}

        <SummaryPanel summary={view.summary} />

        {isOwner && view.obligationLocked ? <NewTransactionPanel /> : null}

        <WithdrawalsPanel withdrawals={view.withdrawals} totals={view.summary.withdrawalTotals} />

        <HistoryPanel transactions={view.transactions} />

        <NotesPanel
          notes={view.notes}
          transactions={view.transactions}
          role={view.role}
          showResolved={preferences.resolvedNotes === 'show'}
        />

        <SettingsPanel role={view.role} />

        {!isOwner ? (
          <p className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-xs text-slate-500">
            You have view access. You can read every figure, open the proof behind each record and
            take part in the discussion, but you cannot create or change a financial record.
          </p>
        ) : null}

        <footer className="pb-10 pt-4 text-center text-[11px] uppercase tracking-wide text-stone-600">
          Built with YK Systems
        </footer>
      </main>
    </div>
  )
}
