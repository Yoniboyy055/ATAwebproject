/** Human-facing transaction codes. The database primary key stays separate. */

export function formatTransactionCode(sequence: number): string {
  if (!Number.isInteger(sequence) || sequence < 1) {
    throw new Error('transaction sequence must be a positive integer')
  }
  return `TX-${sequence.toString().padStart(3, '0')}`
}

export function parseTransactionCode(code: string): number | null {
  const match = /^TX-(\d{3,})$/.exec(code.trim().toUpperCase())
  if (!match) return null
  const sequence = Number(match[1])
  return Number.isInteger(sequence) && sequence >= 1 ? sequence : null
}
