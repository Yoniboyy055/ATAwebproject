/**
 * Proof Ledger — stateless signed sessions.
 *
 * A session is an HMAC-SHA256 signed token carrying the role, the credential
 * version it was issued against, and an expiry. It is delivered in an HttpOnly
 * cookie, marked Secure in production and SameSite=Strict so it never rides
 * along on a cross-site request.
 *
 * Embedding the credential version is what makes a password change actually
 * log other devices out: the version check happens against the database on
 * every request.
 */

import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

import { LedgerRole } from '../ledger/types'

export const LEDGER_SESSION_COOKIE = 'proof-ledger-session'

/** The owner performs consequential financial writes, so keep it short. */
export const OWNER_SESSION_TTL_MS = 12 * 60 * 60 * 1000

/** The viewer only reads and comments, so keep re-entry low friction. */
export const VIEWER_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000

export function sessionTtlForRole(role: LedgerRole): number {
  return role === 'OWNER' ? OWNER_SESSION_TTL_MS : VIEWER_SESSION_TTL_MS
}

export interface LedgerSession {
  role: LedgerRole
  credentialVersion: number
  expiresAt: number
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createSessionToken(
  role: LedgerRole,
  credentialVersion: number,
  secret: string,
  now: number = Date.now(),
  ttlMs: number = sessionTtlForRole(role)
): string {
  if (!secret || secret.length < 32) {
    throw new Error('LEDGER_SESSION_SECRET must be at least 32 characters')
  }
  const expiresAt = now + ttlMs
  const nonce = randomBytes(12).toString('base64url')
  const payload = `${role}.${credentialVersion}.${expiresAt}.${nonce}`
  return `${payload}.${sign(payload, secret)}`
}

/**
 * Signature and expiry only. The credential-version check needs the database
 * and lives in `resolveSession`.
 */
export function verifySessionToken(
  token: string | undefined | null,
  secret: string | undefined | null,
  now: number = Date.now()
): LedgerSession | null {
  if (!token || !secret) return null
  const parts = token.split('.')
  if (parts.length !== 5) return null

  const [role, versionRaw, expiresRaw, nonce, signature] = parts
  if (role !== 'OWNER' && role !== 'VIEWER') return null
  if (!/^\d+$/.test(versionRaw) || !/^\d+$/.test(expiresRaw) || !nonce) return null

  const expected = sign(`${role}.${versionRaw}.${expiresRaw}.${nonce}`, secret)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  const expiresAt = Number(expiresRaw)
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return null

  return { role, credentialVersion: Number(versionRaw), expiresAt }
}

export function sessionCookieOptions(isProduction: boolean, role: LedgerRole) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: Math.floor(sessionTtlForRole(role) / 1000),
  }
}
