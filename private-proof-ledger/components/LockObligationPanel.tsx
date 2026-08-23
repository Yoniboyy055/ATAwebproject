'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { formatMoney } from '../ledger/money'
import { DEFAULT_ORIGINAL_OBLIGATION_CENTS } from '../ledger/types'
import { Panel } from './primitives'

/**
 * First-run setup.
 *
 * The opening obligation for this ledger is fixed at CAD $36,000.00. It is
 * displayed, not editable — there is no money field to change, and the server
 * accepts only that one value regardless of what is posted.
 */
export default function LockObligationPanel() {
  const router = useRouter()
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!confirmed) return
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/api/proof-ledger/obligation/lock', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          originalObligationCents: DEFAULT_ORIGINAL_OBLIGATION_CENTS,
          confirm: true,
        }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(payload.error ?? 'The obligation could not be locked.')
        return
      }
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel
      id="setup"
      title="Confirm Original Obligation"
      subtitle="This must be locked before any transaction can be recorded."
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-2xl border border-amber-200/15 bg-[linear-gradient(135deg,rgba(245,158,11,0.13),rgba(8,9,11,0.78))] p-5">
          <p className="text-xs uppercase tracking-wide text-amber-100/70">Original Obligation</p>
          <p
            data-testid="fixed-obligation"
            className="mt-2 text-3xl font-semibold tabular-nums text-stone-50"
          >
            {formatMoney(DEFAULT_ORIGINAL_OBLIGATION_CENTS)}
          </p>
          <p className="mt-2 text-sm text-stone-400">
            This is the agreed opening obligation for this ledger.
          </p>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-stone-200">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-400"
          />
          <span>
            I confirm that {formatMoney(DEFAULT_ORIGINAL_OBLIGATION_CENTS)} is the correct
            opening obligation.
          </span>
        </label>

        {error ? (
          <p role="alert" className="text-sm text-rose-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy || !confirmed}
          className="rounded-lg bg-cyan-300 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-40"
        >
          {busy ? 'Locking…' : 'Lock Original Obligation'}
        </button>

        <p className="text-[11px] text-stone-600">
          Once locked, this figure cannot be edited. A later correction must be recorded as an
          adjustment so the change stays auditable.
        </p>
      </form>
    </Panel>
  )
}
