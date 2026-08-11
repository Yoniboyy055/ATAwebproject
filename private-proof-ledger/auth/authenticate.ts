/**
 * Proof Ledger — password to role resolution.
 *
 * There are exactly two roles and no user records. A password either matches
 * the OWNER hash, the VIEWER hash, or nothing at all.
 */

import { LedgerRole } from '../ledger/types'
import { LedgerAuthConfig } from './config'
import { verifyLedgerPassword } from './passwords'

export type AuthenticationResult =
  | { ok: true; role: LedgerRole }
  | { ok: false; reason: 'INVALID_PASSWORD' | 'NOT_CONFIGURED' }

export async function authenticatePassword(
  password: string,
  config: LedgerAuthConfig
): Promise<AuthenticationResult> {
  if (!config.sessionSecret || config.sessionSecret.length < 32) {
    return { ok: false, reason: 'NOT_CONFIGURED' }
  }
  if (!config.ownerPasswordHash && !config.viewerPasswordHash) {
    return { ok: false, reason: 'NOT_CONFIGURED' }
  }

  // Both comparisons always run so a matching viewer password does not take a
  // measurably different amount of time than a matching owner password.
  const [ownerMatch, viewerMatch] = await Promise.all([
    verifyLedgerPassword(password, config.ownerPasswordHash),
    verifyLedgerPassword(password, config.viewerPasswordHash),
  ])

  if (ownerMatch) return { ok: true, role: 'OWNER' }
  if (viewerMatch) return { ok: true, role: 'VIEWER' }
  return { ok: false, reason: 'INVALID_PASSWORD' }
}

/** Server-side authorisation gate for every consequential write. */
export function canWriteFinancialRecords(role: LedgerRole | null | undefined): boolean {
  return role === 'OWNER'
}

export function canWriteNotes(role: LedgerRole | null | undefined): boolean {
  return role === 'OWNER' || role === 'VIEWER'
}

export function canResolveNotes(role: LedgerRole | null | undefined): boolean {
  return role === 'OWNER'
}

export function canViewEvidence(role: LedgerRole | null | undefined): boolean {
  return role === 'OWNER' || role === 'VIEWER'
}
