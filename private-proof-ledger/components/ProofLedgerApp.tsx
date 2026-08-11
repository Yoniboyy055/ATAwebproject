'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { LedgerView } from '../server/view'
import HistoryPanel from './HistoryPanel'
import LockObligationPanel from './LockObligationPanel'
import NewTransactionPanel from './NewTransactionPanel'
import NotesPanel from './NotesPanel'
import ReconciliationBar from './ReconciliationBar'
import SummaryPanel from './SummaryPanel'
import WithdrawalsPanel from './WithdrawalsPanel'

const SECTIONS = [
  { id: 'summary', label: 'Summary' },
  { id: 'withdrawals', label: 'Withdrawals' },
  { id: 'history', label: 'History' },
  { id: 'notes', label: 'Notes' },
] as const

export default function ProofLedgerApp({ view }: { view: LedgerView }) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const isOwner = view.role === 'OWNER'

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
    <div className="min-h-screen bg-slate-950 text-slate-100 print:bg-white print:text-black">
      <header className="border-b border-slate-800 px-4 py-4 sm:px-6 print:border-slate-300">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Proof Ledger</h1>
            <p className="text-xs text-slate-500">
              Private Financial Record • signed in as {view.role}
            </p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <a
              href="/proof-ledger/statement"
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200"
            >
              Print / Save Statement
            </a>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-400"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Desktop navigation rail; collapses to a scrolling chip row on mobile. */}
      <nav className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 px-4 py-2 backdrop-blur sm:px-6 print:hidden">
        <ul className="mx-auto flex max-w-5xl gap-2 overflow-x-auto">
          {(isOwner ? [{ id: 'new', label: 'New Transaction' }, ...SECTIONS] : SECTIONS).map(
            (section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-block whitespace-nowrap rounded-full border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300"
                >
                  {section.label}
                </a>
              </li>
            )
          )}
        </ul>
      </nav>

      <main className="mx-auto max-w-5xl space-y-4 px-4 py-5 sm:px-6">
        <ReconciliationBar reconciliation={view.reconciliation} integrity={view.integrity} />

        {isOwner && !view.obligationLocked ? (
          <LockObligationPanel proposedObligationCents={view.proposedObligationCents} />
        ) : null}

        {!isOwner && !view.obligationLocked ? (
          <p className="rounded-xl border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
            The owner has not yet locked the original obligation.
          </p>
        ) : null}

        <SummaryPanel summary={view.summary} />

        {isOwner && view.obligationLocked ? <NewTransactionPanel /> : null}

        <WithdrawalsPanel
          withdrawals={view.withdrawals}
          totals={view.summary.withdrawalTotals}
        />

        <HistoryPanel transactions={view.transactions} />

        <NotesPanel notes={view.notes} transactions={view.transactions} role={view.role} />

        {!isOwner ? (
          <p className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-xs text-slate-500">
            You have view access. You can read every figure, open the proof behind each record and
            take part in the discussion, but you cannot create or change a financial record.
          </p>
        ) : null}

        <footer className="pb-10 pt-4 text-center text-[11px] text-slate-600">
          Built with YK Systems
        </footer>
      </main>
    </div>
  )
}
