/**
 * Proof Ledger — stateless signed sessions.
 *
 * A session is an HMAC-SHA256 signed token carrying only the role and an
 * expiry. It is delivered in an HttpOnly cookie, marked Secure in production
 * and SameSite=Strict so it never rides along on a cross-site request.
 */

import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

import { LedgerRole } from '../ledger/types'

export const LEDGER_SESSION_COOKIE = 'proof-ledger-session'
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000

export interface LedgerSession {
  role: LedgerRole
  expiresAt: number
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createSessionToken(
  role: LedgerRole,
  secret: string,
  now: number = Date.now(),
  ttlMs: number = SESSION_TTL_MS
): string {
  if (!secret || secret.length < 32) {
    throw new Error('LEDGER_SESSION_SECRET must be at least 32 characters')
  }
  const expiresAt = now + ttlMs
  const nonce = randomBytes(12).toString('base64url')
  const payload = `${role}.${expiresAt}.${nonce}`
  return `${payload}.${sign(payload, secret)}`
}

export function verifySessionToken(
  token: string | undefined | null,
  secret: string | undefined | null,
  now: number = Date.now()
): LedgerSession | null {
  if (!token || !secret) return null
  const parts = token.split('.')
  if (parts.length !== 4) return null

  const [role, expiresRaw, nonce, signature] = parts
  if (role !== 'OWNER' && role !== 'VIEWER') return null
  if (!/^\d+$/.test(expiresRaw) || !nonce) return null

  const expected = sign(`${role}.${expiresRaw}.${nonce}`, secret)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  const expiresAt = Number(expiresRaw)
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return null

  return { role, expiresAt }
}

export function sessionCookieOptions(isProduction: boolean) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  }
}
