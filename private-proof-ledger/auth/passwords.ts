/**
 * Proof Ledger — password hashing.
 *
 * Password-only access with no username, email or registration. Only the hash
 * ever reaches the server configuration; plaintext credentials are never
 * stored in this repository or in the database.
 *
 * Encoding: `scrypt$<N>$<r>$<p>$<saltBase64>$<hashBase64>`
 */

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(scryptCallback) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number }
) => Promise<Buffer>

const DEFAULT_N = 16384
const DEFAULT_R = 8
const DEFAULT_P = 1
const KEY_LENGTH = 64
const MAX_MEM = 96 * 1024 * 1024

export async function hashLedgerPassword(password: string): Promise<string> {
  if (!password || password.length < 12) {
    throw new Error('Proof Ledger passwords must be at least 12 characters')
  }
  const salt = randomBytes(16)
  const derived = await scrypt(password, salt, KEY_LENGTH, {
    N: DEFAULT_N,
    r: DEFAULT_R,
    p: DEFAULT_P,
    maxmem: MAX_MEM,
  })
  return [
    'scrypt',
    DEFAULT_N,
    DEFAULT_R,
    DEFAULT_P,
    salt.toString('base64'),
    derived.toString('base64'),
  ].join('$')
}

/** Constant-time verification. Returns false for any malformed stored hash. */
export async function verifyLedgerPassword(
  password: string,
  storedHash: string | undefined | null
): Promise<boolean> {
  if (!storedHash) return false
  const parts = storedHash.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false

  const N = Number(parts[1])
  const r = Number(parts[2])
  const p = Number(parts[3])
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false
  if (N < 1024 || N > 1 << 20 || r < 1 || r > 32 || p < 1 || p > 16) return false

  let salt: Buffer
  let expected: Buffer
  try {
    salt = Buffer.from(parts[4], 'base64')
    expected = Buffer.from(parts[5], 'base64')
  } catch {
    return false
  }
  if (salt.length === 0 || expected.length === 0) return false

  try {
    const derived = await scrypt(password, salt, expected.length, { N, r, p, maxmem: MAX_MEM })
    return derived.length === expected.length && timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}
