'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { LedgerRole } from '../ledger/types'
import { formatDisplayDateTime, Panel } from './primitives'
import {
  Appearance,
  Density,
  LedgerPreferences,
  ResolvedNotes,
  usePreferences,
} from './preferences'

interface SettingsStatus {
  role: LedgerRole
  sessionExpiresAt: string
  viewerAccessEnabled: boolean
  ownerPasswordUpdatedAt: string | null
  viewerPasswordUpdatedAt: string | null
  databaseConnected: boolean
  aiConfigured: boolean
  integrityOk: boolean
  integrityCheckedRecords: number
  integrityEvidenceChecked: number
  minPasswordLength: number
}

function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (next: T) => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={`rounded px-3 py-1 text-xs font-medium ${
              value === option.value
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-400'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function PasswordForm({
  targetRole,
  minLength,
  onDone,
}: {
  targetRole: LedgerRole
  minLength: number
  onDone: () => void
}) {
  const [currentOwnerPassword, setCurrentOwnerPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage({ kind: 'error', text: 'The two new passwords do not match.' })
      return
    }
    setBusy(true)
    setMessage(null)
    try {
      const response = await fetch('/api/proof-ledger/settings/password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ targetRole, currentOwnerPassword, newPassword }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        setMessage({ kind: 'error', text: payload.error ?? 'The password could not be changed.' })
        return
      }
      setCurrentOwnerPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setMessage({
        kind: 'ok',
        text:
          targetRole === 'OWNER'
            ? 'Owner password changed. Other owner devices have been signed out.'
            : 'Viewer password changed. Existing viewer sessions have been signed out.',
      })
      onDone()
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-2 space-y-2">
      <input
        type="password"
        autoComplete="current-password"
        placeholder="Current owner password"
        aria-label={`Current owner password for ${targetRole.toLowerCase()} change`}
        value={currentOwnerPassword}
        onChange={(event) => setCurrentOwnerPassword(event.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
        required
      />
      <input
        type="password"
        autoComplete="new-password"
        placeholder={`New ${targetRole.toLowerCase()} password`}
        aria-label={`New ${targetRole.toLowerCase()} password`}
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        minLength={minLength}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
        required
      />
      <input
        type="password"
        autoComplete="new-password"
        placeholder="Confirm new password"
        aria-label={`Confirm new ${targetRole.toLowerCase()} password`}
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        minLength={minLength}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
        required
      />
      {message ? (
        <p
          className={`text-sm ${message.kind === 'ok' ? 'text-emerald-300' : 'text-rose-300'}`}
          role="alert"
        >
          {message.text}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900 disabled:opacity-40"
      >
        {busy ? 'Saving…' : `Change ${targetRole === 'OWNER' ? 'Owner' : 'Viewer'} Password`}
      </button>
      <p className="text-[11px] text-slate-600">
        Minimum {minLength} characters. Authorised with the current owner password.
      </p>
    </form>
  )
}

/**
 * Settings.
 *
 * Deliberately small: per-device display preferences for both roles, session
 * information, and — for the owner only — password rotation and the viewer
 * access switch. Every owner-only action is enforced on the server too.
 */
export default function SettingsPanel({ role }: { role: LedgerRole }) {
  const router = useRouter()
  const [preferences, updatePreferences] = usePreferences()
  const [status, setStatus] = useState<SettingsStatus | null>(null)
  const [openForm, setOpenForm] = useState<LedgerRole | null>(null)
  const [busy, setBusy] = useState(false)

  const isOwner = role === 'OWNER'

  async function loadStatus() {
    const response = await fetch('/api/proof-ledger/settings')
    if (!response.ok) return
    setStatus((await response.json()) as SettingsStatus)
  }

  useEffect(() => {
    void loadStatus()
  }, [])

  async function signOut() {
    setBusy(true)
    try {
      await fetch('/api/proof-ledger/session', { method: 'DELETE' })
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  async function toggleViewerAccess(enabled: boolean) {
    setBusy(true)
    try {
      await fetch('/api/proof-ledger/settings/viewer-access', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ enabled }),
      })
      await loadStatus()
    } finally {
      setBusy(false)
    }
  }

  const set = <K extends keyof LedgerPreferences>(key: K, value: LedgerPreferences[K]) =>
    updatePreferences({ [key]: value } as Partial<LedgerPreferences>)

  return (
    <Panel id="settings" title="Settings" subtitle="Display preferences, session and access.">
      <section className="border-b border-slate-800 pb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Personal Preferences
        </h3>
        <div className="mt-1 divide-y divide-slate-800/70">
          <Choice<Appearance>
            label="Appearance"
            value={preferences.appearance}
            onChange={(value) => set('appearance', value)}
            options={[
              { value: 'system', label: 'System' },
              { value: 'dark', label: 'Dark' },
              { value: 'light', label: 'Light' },
            ]}
          />
          <Choice<Density>
            label="Transaction density"
            value={preferences.density}
            onChange={(value) => set('density', value)}
            options={[
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact', label: 'Compact' },
            ]}
          />
          <Choice<ResolvedNotes>
            label="Resolved notes"
            value={preferences.resolvedNotes}
            onChange={(value) => set('resolvedNotes', value)}
            options={[
              { value: 'show', label: 'Show' },
              { value: 'hide', label: 'Hide' },
            ]}
          />
        </div>
        <p className="mt-2 text-[11px] text-slate-600">
          Stored on this device only. These never affect any financial value.
        </p>
      </section>

      <section className="border-b border-slate-800 py-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Session</h3>
        <div className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Role</span>
            <span className="font-semibold text-slate-100">{role}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Session expires</span>
            <span className="text-slate-200">
              {status ? formatDisplayDateTime(status.sessionExpiresAt) : '—'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            {isOwner
              ? 'Owner sessions last 12 hours.'
              : 'Viewer sessions last 30 days.'}
          </p>
        </div>
        <button
          type="button"
          onClick={signOut}
          disabled={busy}
          className="mt-3 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200"
        >
          Sign Out
        </button>
      </section>

      <section className="border-b border-slate-800 py-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Access &amp; Security
        </h3>

        {isOwner ? (
          <div className="mt-2 space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-200">Owner Password</p>
                  <p className="text-[11px] text-slate-500">
                    Last changed{' '}
                    {status?.ownerPasswordUpdatedAt
                      ? formatDisplayDateTime(status.ownerPasswordUpdatedAt)
                      : '—'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenForm(openForm === 'OWNER' ? null : 'OWNER')}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200"
                >
                  Change Owner Password
                </button>
              </div>
              {openForm === 'OWNER' ? (
                <PasswordForm
                  targetRole="OWNER"
                  minLength={status?.minPasswordLength ?? 12}
                  onDone={loadStatus}
                />
              ) : null}
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-200">Viewer Password</p>
                  <p className="text-[11px] text-slate-500">
                    Last changed{' '}
                    {status?.viewerPasswordUpdatedAt
                      ? formatDisplayDateTime(status.viewerPasswordUpdatedAt)
                      : '—'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenForm(openForm === 'VIEWER' ? null : 'VIEWER')}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200"
                >
                  Change Viewer Password
                </button>
              </div>
              {openForm === 'VIEWER' ? (
                <PasswordForm
                  targetRole="VIEWER"
                  minLength={status?.minPasswordLength ?? 12}
                  onDone={loadStatus}
                />
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-slate-200">Viewer Access</p>
                <p className="text-[11px] text-slate-500">
                  {status?.viewerAccessEnabled === false ? 'Disabled' : 'Enabled'}
                </p>
              </div>
              <button
                type="button"
                disabled={busy || !status}
                onClick={() => toggleViewerAccess(!(status?.viewerAccessEnabled ?? true))}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 disabled:opacity-40"
              >
                {status?.viewerAccessEnabled === false
                  ? 'Enable Viewer Access'
                  : 'Disable Viewer Access'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 space-y-2 text-sm">
            <p className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-slate-300">
              Password changes are controlled by the ledger owner.
            </p>
            <div className="flex justify-between gap-3">
              <span className="text-slate-400">Viewer Access</span>
              <span className="text-slate-200">
                {status?.viewerAccessEnabled === false ? 'Disabled' : 'Enabled'}
              </span>
            </div>
          </div>
        )}
      </section>

      <section className="pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Ledger Status
        </h3>
        <div className="mt-2 space-y-1 text-sm">
          {isOwner ? (
            <>
              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Database</span>
                <span className="text-slate-200">
                  {status?.databaseConnected ? 'Connected' : '—'}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-400">AI Interpreter</span>
                <span className="text-slate-200">
                  {status?.aiConfigured ? 'Configured' : 'Not configured'}
                </span>
              </div>
            </>
          ) : null}
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Integrity</span>
            <span className={status?.integrityOk === false ? 'text-rose-300' : 'text-slate-200'}>
              {status
                ? status.integrityOk
                  ? `Verified (${status.integrityCheckedRecords} records, ${status.integrityEvidenceChecked} screenshots)`
                  : 'FAILED'
                : '—'}
            </span>
          </div>
        </div>
      </section>
    </Panel>
  )
}
