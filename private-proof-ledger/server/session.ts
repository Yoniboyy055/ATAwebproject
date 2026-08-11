/**
 * Proof Ledger — request-scoped session resolution.
 *
 * Every role decision in the application funnels through here, on the server.
 * The browser is never trusted to declare its own role, and a token whose
 * credential version is behind the database is rejected — that is how a
 * password change signs other devices out.
 */

import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

import { readAuthConfig } from '../auth/config'
import { LEDGER_SESSION_COOKIE, LedgerSession, verifySessionToken } from '../auth/session'
import { LedgerRepository } from '../database/repository'
import { isViewerAccessEnabled } from '../auth/credentials'

function verifyRaw(token: string | undefined): LedgerSession | null {
  return verifySessionToken(token, readAuthConfig().sessionSecret)
}

/**
 * Full check: signature, expiry, current credential version, and — for a
 * viewer — whether the owner still allows viewer access.
 */
export async function resolveSession(
  token: string | undefined,
  repository: LedgerRepository
): Promise<LedgerSession | null> {
  const session = verifyRaw(token)
  if (!session) return null

  const credential = await repository.getCredential(session.role)
  if (!credential) return null
  if (credential.credentialVersion !== session.credentialVersion) return null

  if (session.role === 'VIEWER' && !(await isViewerAccessEnabled(repository))) {
    return null
  }

  return session
}

export function readSessionCookie(request: NextRequest): string | undefined {
  return request.cookies.get(LEDGER_SESSION_COOKIE)?.value
}

/** For server components using the request cookie store. */
export async function getLedgerSession(
  repository: LedgerRepository
): Promise<LedgerSession | null> {
  return resolveSession(cookies().get(LEDGER_SESSION_COOKIE)?.value, repository)
}

export async function getLedgerSessionFromRequest(
  request: NextRequest,
  repository: LedgerRepository
): Promise<LedgerSession | null> {
  return resolveSession(readSessionCookie(request), repository)
}
