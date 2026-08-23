/**
 * Proof Ledger — server-side configuration.
 *
 * Secrets are read from the environment at call time and never bundled into
 * client code. This module is only ever imported from server code — route
 * handlers and server components — never from a `'use client'` module.
 */

export interface LedgerAuthConfig {
  ownerPasswordHash: string | undefined
  viewerPasswordHash: string | undefined
  sessionSecret: string | undefined
  isProduction: boolean
}

export function readAuthConfig(env: NodeJS.ProcessEnv = process.env): LedgerAuthConfig {
  return {
    ownerPasswordHash: env.LEDGER_OWNER_PASSWORD_HASH,
    viewerPasswordHash: env.LEDGER_VIEWER_PASSWORD_HASH,
    sessionSecret: env.LEDGER_SESSION_SECRET,
    isProduction: env.NODE_ENV === 'production',
  }
}

export function isLedgerConfigured(config: LedgerAuthConfig = readAuthConfig()): boolean {
  return Boolean(
    config.sessionSecret &&
      config.sessionSecret.length >= 32 &&
      (config.ownerPasswordHash || config.viewerPasswordHash)
  )
}
