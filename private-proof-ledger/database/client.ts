/**
 * Proof Ledger — database client.
 *
 * A dedicated Prisma client generated from `schema.prisma` in this folder and
 * pointed at `LEDGER_DATABASE_URL`. It is a completely separate client from
 * the ATA business client: separate schema, separate connection, no shared
 * models and no cross-database joins.
 */

import { PrismaClient } from '.prisma/proof-ledger-client'

declare global {
  // eslint-disable-next-line no-var
  var __proofLedgerPrisma: PrismaClient | undefined
}

let client: PrismaClient | undefined

export class LedgerDatabaseNotConfiguredError extends Error {
  constructor() {
    super('LEDGER_DATABASE_URL is not configured')
    this.name = 'LedgerDatabaseNotConfiguredError'
  }
}

export function isLedgerDatabaseConfigured(): boolean {
  return Boolean(process.env.LEDGER_DATABASE_URL)
}

/**
 * Lazily construct the client so importing this module during a build — when
 * no database URL is present — does not throw.
 */
export function getLedgerPrisma(): PrismaClient {
  if (!process.env.LEDGER_DATABASE_URL) {
    throw new LedgerDatabaseNotConfiguredError()
  }
  if (process.env.NODE_ENV !== 'production') {
    if (!globalThis.__proofLedgerPrisma) {
      globalThis.__proofLedgerPrisma = new PrismaClient({
        datasources: { db: { url: process.env.LEDGER_DATABASE_URL } },
      })
    }
    return globalThis.__proofLedgerPrisma
  }
  if (!client) {
    client = new PrismaClient({
      datasources: { db: { url: process.env.LEDGER_DATABASE_URL } },
    })
  }
  return client
}
