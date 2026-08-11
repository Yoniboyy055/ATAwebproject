'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * Password-only entry. No username, no email, no registration, no account of
 * any kind — a single field that decides between OWNER and VIEWER server side.
 */
export default function LoginScreen({ configured }: { configured: boolean }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/api/proof-ledger/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(payload.error ?? 'That password was not recognised.')
        return
      }
      setPassword('')
      router.refresh()
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-slate-100">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Proof Ledger</h1>
        <p className="mt-1 text-sm text-slate-400">Private Financial Record</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label htmlFor="ledger-password" className="block text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            id="ledger-password"
            name="password"
            type="password"
            autoComplete="current-password"
            inputMode="text"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100 outline-none focus:border-emerald-500"
            placeholder="••••••••••••"
            required
          />

          {error ? (
            <p role="alert" className="rounded-lg bg-rose-950/60 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          {!configured ? (
            <p className="rounded-lg bg-amber-950/50 px-3 py-2 text-sm text-amber-200">
              This ledger has not been configured yet. Set the server password hashes and session
              secret before signing in.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy || password.length === 0}
            className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-base font-semibold text-slate-950 disabled:opacity-50"
          >
            {busy ? 'Checking…' : 'Continue'}
          </button>
        </form>

        <p className="mt-10 text-xs text-slate-600">Built with YK Systems</p>
      </div>
    </main>
  )
}
