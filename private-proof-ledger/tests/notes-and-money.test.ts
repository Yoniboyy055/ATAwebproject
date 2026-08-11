/**
 * @jest-environment node
 *
 * Proof Ledger — notes, money handling and the read model.
 */

import { formatCents, formatMoney, formatSignedMoney, parseAmountToCents } from '../ledger/money'
import { loadLedgerView } from '../server/view'
import { applyRecord, CAD, makeLedger, summaryOf } from './helpers'

describe('money', () => {
  it('stores CAD amounts as integer cents', () => {
    expect(parseAmountToCents('36,000.00')).toBe(3_600_000)
    expect(parseAmountToCents('$500')).toBe(50_000)
    expect(parseAmountToCents('CAD $120.50')).toBe(12_050)
    expect(parseAmountToCents('0.01')).toBe(1)
  })

  it('rejects amounts it cannot represent exactly', () => {
    expect(parseAmountToCents('12.345')).toBeNull()
    expect(parseAmountToCents('abc')).toBeNull()
    expect(parseAmountToCents('')).toBeNull()
  })

  it('formats without floating point drift', () => {
    expect(formatCents(3_600_000)).toBe('36,000.00')
    expect(formatMoney(3_562_000)).toBe('CAD $35,620.00')
    expect(formatMoney(0)).toBe('CAD $0.00')
    expect(formatMoney(-7_000)).toBe('-CAD $70.00')
    expect(formatSignedMoney(50_000)).toBe('+CAD $500.00')
    expect(formatSignedMoney(-10_000)).toBe('-CAD $100.00')
  })

  it('survives a long chain of cent-level operations exactly', () => {
    let total = 0
    for (let index = 0; index < 1000; index += 1) total += 1
    expect(total).toBe(1000)
    expect(formatMoney(total)).toBe('CAD $10.00')
  })
})

describe('notes', () => {
  // Test 13
  it('never change a financial value', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })

    const before = await summaryOf(ledger)

    await ledger.createNote({
      transactionId: withdrawal.id,
      authorRole: 'VIEWER',
      body: 'Please confirm why TX-002 has CAD $20 extra added.',
    })
    const reply = await ledger.createNote({
      transactionId: withdrawal.id,
      authorRole: 'OWNER',
      body: 'Confirmed. The $20 additional repayment was agreed for this withdrawal.',
    })
    await ledger.resolveNote(reply.id)

    const after = await summaryOf(ledger)
    expect(after).toEqual(before)
    expect(await ledger.listNotes()).toHaveLength(2)
  })

  it('are append-only — resolving keeps the body intact', async () => {
    const ledger = await makeLedger()
    const note = await ledger.createNote({
      transactionId: null,
      authorRole: 'VIEWER',
      body: 'original text',
    })
    const resolved = await ledger.resolveNote(note.id)
    expect(resolved?.body).toBe('original text')
    expect(resolved?.createdAt).toBe(note.createdAt)
    expect(resolved?.resolvedAt).not.toBeNull()
  })
})

describe('read model', () => {
  it('exposes a base remaining timeline and an unresolved note count', async () => {
    const ledger = await makeLedger()
    await applyRecord(ledger, { type: 'BASE_DEPOSIT', amountCents: CAD(500) })
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    await applyRecord(ledger, {
      type: 'WITHDRAWAL_REPAYMENT',
      amountCents: CAD(50),
      linkedTransactionCode: withdrawal.transactionCode,
    })
    await ledger.createNote({ transactionId: null, authorRole: 'VIEWER', body: 'question' })

    const view = await loadLedgerView(ledger, 'VIEWER', '2026-08-11T09:24:00.000Z')

    expect(view.role).toBe('VIEWER')
    expect(view.obligationLocked).toBe(true)
    expect(view.transactions).toHaveLength(3)
    expect(view.transactions[0].baseRemainingAfterCents).toBe(CAD(35500))
    expect(view.transactions[1].baseRemainingAfterCents).toBe(CAD(35500))
    expect(view.transactions[2].linkedWithdrawalCode).toBe(withdrawal.transactionCode)
    expect(view.transactions[1].status).toBe('PARTIAL')
    expect(view.reconciliation.lastTransactionCode).toBe('TX-003')
    expect(view.reconciliation.openWithdrawalCount).toBe(1)
    expect(view.reconciliation.unresolvedNoteCount).toBe(1)
    expect(view.integrity.ok).toBe(true)
    expect(view.summary.totalCurrentlyOutstandingCents).toBe(CAD(35570))
  })
})
