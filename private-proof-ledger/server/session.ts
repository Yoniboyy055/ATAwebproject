/**
 * Proof Ledger — request-scoped session access.
 *
 * Every role decision in the application funnels through here, on the server.
 * The browser is never trusted to declare its own role.
 */

import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

import { readAuthConfig } from '../auth/config'
import { LEDGER_SESSION_COOKIE, LedgerSession, verifySessionToken } from '../auth/session'

/** For server components and route handlers using the request cookie store. */
export function getLedgerSession(): LedgerSession | null {
  const token = cookies().get(LEDGER_SESSION_COOKIE)?.value
  return verifySessionToken(token, readAuthConfig().sessionSecret)
}

/** For route handlers that already hold the request object. */
export function getLedgerSessionFromRequest(request: NextRequest): LedgerSession | null {
  const token = request.cookies.get(LEDGER_SESSION_COOKIE)?.value
  return verifySessionToken(token, readAuthConfig().sessionSecret)
}
