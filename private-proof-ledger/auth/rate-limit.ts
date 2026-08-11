/**
 * Proof Ledger — password attempt throttling.
 *
 * Deliberately lightweight: an in-process fixed window, sized for a two-person
 * private ledger. It slows down guessing without adding infrastructure.
 */

interface Attempt {
  count: number
  resetAt: number
}

const attempts = new Map<string, Attempt>()

export const LOGIN_WINDOW_MS = 15 * 60 * 1000
export const LOGIN_MAX_ATTEMPTS = 8

export interface ThrottleResult {
  limited: boolean
  remaining: number
  retryAfterSeconds: number
}

export function registerLoginAttempt(
  identifier: string,
  now: number = Date.now()
): ThrottleResult {
  for (const [key, value] of attempts) {
    if (value.resetAt <= now) attempts.delete(key)
  }

  const existing = attempts.get(identifier)
  if (!existing || existing.resetAt <= now) {
    attempts.set(identifier, { count: 1, resetAt: now + LOGIN_WINDOW_MS })
    return { limited: false, remaining: LOGIN_MAX_ATTEMPTS - 1, retryAfterSeconds: 0 }
  }

  existing.count += 1
  const limited = existing.count > LOGIN_MAX_ATTEMPTS
  return {
    limited,
    remaining: Math.max(0, LOGIN_MAX_ATTEMPTS - existing.count),
    retryAfterSeconds: limited ? Math.ceil((existing.resetAt - now) / 1000) : 0,
  }
}

export function clearLoginAttempts(identifier: string): void {
  attempts.delete(identifier)
}

/** Test-only helper so throttle state cannot leak between specs. */
export function resetLoginThrottle(): void {
  attempts.clear()
}
