/**
 * Proof Ledger — runtime credential authority.
 *
 * Passwords live in the private ledger database, not in the environment. The
 * bootstrap environment hashes seed the rows exactly once, on first run; after
 * that the database wins, so a password changed in Settings survives every
 * redeploy.
 *
 * Every credential carries a version. Session tokens embed the version they
 * were issued against, so rotating a password invalidates old devices.
 */

import { LedgerRepository } from '../database/repository'
import { LedgerRole } from '../ledger/types'
import { LedgerAuthConfig } from './config'
import { hashLedgerPassword, verifyLedgerPassword } from './passwords'

export const MIN_PASSWORD_LENGTH = 12
export const VIEWER_ACCESS_SETTING = 'viewerAccessEnabled'

export type AuthenticationResult =
  | { ok: true; role: LedgerRole; credentialVersion: number }
  | {
      ok: false
      reason: 'INVALID_PASSWORD' | 'NOT_CONFIGURED' | 'VIEWER_ACCESS_DISABLED'
    }

/**
 * Seed the credential rows from the bootstrap hashes the first time only.
 *
 * A row that already exists is never overwritten — that is what makes an
 * in-app password change durable across deployments.
 */
export async function ensureCredentialsSeeded(
  repository: LedgerRepository,
  config: LedgerAuthConfig
): Promise<void> {
  const seeds: Array<[LedgerRole, string | undefined]> = [
    ['OWNER', config.ownerPasswordHash],
    ['VIEWER', config.viewerPasswordHash],
  ]
  for (const [role, hash] of seeds) {
    if (!hash) continue
    const existing = await repository.getCredential(role)
    if (existing) continue
    await repository.seedCredential(role, hash)
  }
}

export async function isViewerAccessEnabled(repository: LedgerRepository): Promise<boolean> {
  const value = await repository.getSetting(VIEWER_ACCESS_SETTING)
  // Enabled by default; only an explicit "false" turns viewer access off.
  return value !== 'false'
}

export async function setViewerAccessEnabled(
  repository: LedgerRepository,
  enabled: boolean
): Promise<void> {
  await repository.setSetting(VIEWER_ACCESS_SETTING, enabled ? 'true' : 'false')
  if (!enabled) {
    // Existing viewer sessions carry the old credential version, so bumping it
    // logs every viewer device out immediately.
    await repository.bumpCredentialVersion('VIEWER')
  }
}

export async function authenticatePassword(
  password: string,
  repository: LedgerRepository,
  config: LedgerAuthConfig
): Promise<AuthenticationResult> {
  if (!config.sessionSecret || config.sessionSecret.length < 32) {
    return { ok: false, reason: 'NOT_CONFIGURED' }
  }

  await ensureCredentialsSeeded(repository, config)

  const [owner, viewer] = await Promise.all([
    repository.getCredential('OWNER'),
    repository.getCredential('VIEWER'),
  ])

  if (!owner && !viewer) return { ok: false, reason: 'NOT_CONFIGURED' }

  // Both comparisons always run so a matching viewer password does not take a
  // measurably different amount of time than a matching owner password.
  const [ownerMatch, viewerMatch] = await Promise.all([
    verifyLedgerPassword(password, owner?.passwordHash),
    verifyLedgerPassword(password, viewer?.passwordHash),
  ])

  if (ownerMatch && owner) {
    return { ok: true, role: 'OWNER', credentialVersion: owner.credentialVersion }
  }
  if (viewerMatch && viewer) {
    if (!(await isViewerAccessEnabled(repository))) {
      return { ok: false, reason: 'VIEWER_ACCESS_DISABLED' }
    }
    return { ok: true, role: 'VIEWER', credentialVersion: viewer.credentialVersion }
  }
  return { ok: false, reason: 'INVALID_PASSWORD' }
}

export type PasswordChangeResult =
  | { ok: true; role: LedgerRole; credentialVersion: number }
  | {
      ok: false
      reason: 'WRONG_CURRENT_PASSWORD' | 'TOO_SHORT' | 'SAME_PASSWORD' | 'NOT_CONFIGURED'
    }

/**
 * Rotate a password.
 *
 * The owner's current password authorises both changes: their own, and the
 * viewer's — the owner never needs to know the old viewer password.
 */
export async function changePassword(
  repository: LedgerRepository,
  input: {
    targetRole: LedgerRole
    currentOwnerPassword: string
    newPassword: string
  }
): Promise<PasswordChangeResult> {
  const owner = await repository.getCredential('OWNER')
  if (!owner) return { ok: false, reason: 'NOT_CONFIGURED' }

  const authorised = await verifyLedgerPassword(input.currentOwnerPassword, owner.passwordHash)
  if (!authorised) return { ok: false, reason: 'WRONG_CURRENT_PASSWORD' }

  if (input.newPassword.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, reason: 'TOO_SHORT' }
  }

  const target = await repository.getCredential(input.targetRole)
  if (target && (await verifyLedgerPassword(input.newPassword, target.passwordHash))) {
    return { ok: false, reason: 'SAME_PASSWORD' }
  }

  const passwordHash = await hashLedgerPassword(input.newPassword)
  const updated = await repository.setCredential(input.targetRole, passwordHash)
  return { ok: true, role: input.targetRole, credentialVersion: updated.credentialVersion }
}

/* ---------------------------------------------------------- authorisation -- */

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

/** Only the owner may rotate any password, including the viewer's. */
export function canChangePasswords(role: LedgerRole | null | undefined): boolean {
  return role === 'OWNER'
}

export function canControlViewerAccess(role: LedgerRole | null | undefined): boolean {
  return role === 'OWNER'
}
