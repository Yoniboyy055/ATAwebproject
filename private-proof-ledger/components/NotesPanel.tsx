'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { LedgerNoteRecord, LedgerRole } from '../ledger/types'
import { TransactionRow } from '../server/view'
import { formatDisplayDateTime, Panel } from './primitives'

/**
 * Notes are append-only discussion. Both roles may write and reply; only the
 * owner may mark a discussion resolved. Nothing here changes a money value.
 */
export default function NotesPanel({
  notes,
  transactions,
  role,
}: {
  notes: LedgerNoteRecord[]
  transactions: TransactionRow[]
  role: LedgerRole
}) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const codeById = new Map(transactions.map((tx) => [tx.id, tx.transactionCode]))

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!body.trim()) return
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/api/proof-ledger/notes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ body, transactionId: transactionId || null }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(payload.error ?? 'The note could not be saved.')
        return
      }
      setBody('')
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  async function resolve(noteId: string) {
    setBusy(true)
    try {
      await fetch('/api/proof-ledger/notes/resolve', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ noteId }),
      })
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel
      id="notes"
      title="Notes & Discussion"
      subtitle={`${notes.filter((note) => !note.resolvedAt).length} unresolved`}
    >
      <form onSubmit={submit} className="mb-5 space-y-2 print:hidden">
        <label htmlFor="note-transaction" className="block text-xs text-slate-400">
          Attach to transaction (optional)
        </label>
        <select
          id="note-transaction"
          value={transactionId}
          onChange={(event) => setTransactionId(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
        >
          <option value="">General ledger note</option>
          {[...transactions].reverse().map((tx) => (
            <option key={tx.id} value={tx.id}>
              {tx.transactionCode} — {tx.reason.slice(0, 40)}
            </option>
          ))}
        </select>

        <textarea
          aria-label="Note"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={3}
          maxLength={4000}
          placeholder="Ask a question or record an agreement…"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
        />

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          disabled={busy || !body.trim()}
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-40"
        >
          Add Note
        </button>
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-slate-500">No notes yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 print:border-slate-300 print:bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-300 print:text-black">
                  {note.authorRole}
                  {note.transactionId ? ` • ${codeById.get(note.transactionId) ?? 'TX'}` : ''}
                </span>
                <span>{formatDisplayDateTime(note.createdAt)}</span>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-slate-200 print:text-black">
                {note.body}
              </p>
              <div className="mt-2 flex items-center gap-3">
                {note.resolvedAt ? (
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400">
                    Resolved
                  </span>
                ) : role === 'OWNER' ? (
                  <button
                    type="button"
                    onClick={() => resolve(note.id)}
                    disabled={busy}
                    className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 underline print:hidden"
                  >
                    Mark resolved
                  </button>
                ) : (
                  <span className="text-[11px] uppercase tracking-wide text-slate-600">Open</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-[11px] text-slate-600">
        Notes are append-only and never affect any money calculation.
      </p>
    </Panel>
  )
}
