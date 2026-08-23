/**
 * Proof Ledger — money handling.
 *
 * Every monetary value in this project is an integer number of cents.
 * Floating point arithmetic is never used for financial calculations.
 */

import { LEDGER_CURRENCY } from './types'

/** Largest value we accept, guarding against overflow of exact integers. */
export const MAX_CENTS = 1_000_000_000_00

export class MoneyError extends Error {}

export function assertCents(value: unknown, label = 'amount'): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new MoneyError(`${label} must be a finite number of cents`)
  }
  if (!Number.isInteger(value)) {
    throw new MoneyError(`${label} must be an integer number of cents`)
  }
  if (Math.abs(value) > MAX_CENTS) {
    throw new MoneyError(`${label} is out of the supported range`)
  }
  return value
}

export function assertNonNegativeCents(value: unknown, label = 'amount'): number {
  const cents = assertCents(value, label)
  if (cents < 0) {
    throw new MoneyError(`${label} must not be negative`)
  }
  return cents
}

/**
 * Parse a human string such as `"36,000.00"`, `"$500"` or `"120.5"` into cents.
 * Returns `null` when the input is not a well-formed amount.
 */
export function parseAmountToCents(input: string): number | null {
  const cleaned = input.trim().replace(/^CAD\s*/i, '').replace(/\$/g, '').replace(/,/g, '').replace(/\s/g, '')
  if (!/^-?\d+(\.\d{1,2})?$/.test(cleaned)) return null
  const negative = cleaned.startsWith('-')
  const digits = negative ? cleaned.slice(1) : cleaned
  const [whole, fraction = ''] = digits.split('.')
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  if (!Number.isSafeInteger(cents) || cents > MAX_CENTS) return null
  return negative ? -cents : cents
}

/** `3600000` → `"36,000.00"`. Deterministic, locale independent. */
export function formatCents(cents: number): string {
  assertCents(cents)
  const negative = cents < 0
  const absolute = Math.abs(cents)
  const whole = Math.floor(absolute / 100).toString()
  const fraction = (absolute % 100).toString().padStart(2, '0')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${negative ? '-' : ''}${grouped}.${fraction}`
}

/** `3600000` → `"CAD $36,000.00"`. */
export function formatMoney(cents: number): string {
  const negative = cents < 0
  return `${negative ? '-' : ''}${LEDGER_CURRENCY} $${formatCents(Math.abs(cents))}`
}

/** Signed presentation used in the transaction history, e.g. `+CAD $500.00`. */
export function formatSignedMoney(cents: number): string {
  if (cents === 0) return formatMoney(0)
  return `${cents > 0 ? '+' : '-'}${LEDGER_CURRENCY} $${formatCents(Math.abs(cents))}`
}
