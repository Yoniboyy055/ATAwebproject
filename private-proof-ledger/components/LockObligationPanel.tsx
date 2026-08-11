'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { formatMoney, parseAmountToCents } from '../ledger/money'
import { Panel } from './primitives'

/**
 * First-run setup. The owner confirms the opening obligation and locks it.
 * After locking, the figure can only be changed by an auditable ADJUSTMENT.
 */
export default function LockObligationPanel({
  proposedObligationCents,
}: {
  proposedObligationCents: number
}) {
  const router = useRouter()
  const [amount, setAmount] = useState(
    (proposedObligationCents / 100).toFixed(2)
  )
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const cents = parseAmountToCents(amount)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (cents === null || cents <= 0) {
      setError('Enter a valid amount.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/api/proof-ledger/obligation/lock', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ originalObligationCents: cents, confirm: true }),
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
      <form onSubmit={submit} className="space-y-3">
        <label htmlFor="obligation" className="block text-xs text-slate-400">
          Original Obligation (CAD)
        </label>
        <input
          id="obligation"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-lg tabular-nums text-slate-100"
        />
        <p className="text-sm text-slate-400">
          Will be locked as{' '}
          <strong className="text-slate-100">
            {cents === null ? '—' : formatMoney(cents)}
          </strong>
        </p>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          disabled={busy || cents === null || cents <= 0}
          className="rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-40"
        >
          {busy ? 'Locking…' : 'Lock Original Obligation'}
        </button>

        <p className="text-[11px] text-slate-600">
          Once locked, this figure cannot be casually edited. A later correction must be recorded as
          an adjustment so the change stays auditable.
        </p>
      </form>
    </Panel>
  )
}
