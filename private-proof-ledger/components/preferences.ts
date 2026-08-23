'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Local interface preferences.
 *
 * These are harmless per-device display choices, so they live in the browser
 * rather than the ledger database. Nothing here can affect a financial value.
 */

export type Appearance = 'system' | 'dark' | 'light'
export type Density = 'comfortable' | 'compact'
export type ResolvedNotes = 'show' | 'hide'

export interface LedgerPreferences {
  appearance: Appearance
  density: Density
  resolvedNotes: ResolvedNotes
}

export const DEFAULT_PREFERENCES: LedgerPreferences = {
  appearance: 'system',
  density: 'comfortable',
  resolvedNotes: 'show',
}

const STORAGE_KEY = 'proof-ledger:preferences'
const CHANGE_EVENT = 'proof-ledger:preferences-changed'

function read(): LedgerPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFERENCES
    const parsed = JSON.parse(raw) as Partial<LedgerPreferences>
    return {
      appearance:
        parsed.appearance === 'dark' || parsed.appearance === 'light'
          ? parsed.appearance
          : 'system',
      density: parsed.density === 'compact' ? 'compact' : 'comfortable',
      resolvedNotes: parsed.resolvedNotes === 'hide' ? 'hide' : 'show',
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function usePreferences(): [LedgerPreferences, (patch: Partial<LedgerPreferences>) => void] {
  const [preferences, setPreferences] = useState<LedgerPreferences>(DEFAULT_PREFERENCES)

  useEffect(() => {
    setPreferences(read())
    const onChange = () => setPreferences(read())
    window.addEventListener(CHANGE_EVENT, onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  const update = useCallback((patch: Partial<LedgerPreferences>) => {
    const next = { ...read(), ...patch }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // A browser with storage disabled simply keeps the defaults.
    }
    setPreferences(next)
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  return [preferences, update]
}

/** Resolve `system` against the device setting for the actual applied theme. */
export function resolveAppearance(appearance: Appearance): 'dark' | 'light' {
  if (appearance !== 'system') return appearance
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}
