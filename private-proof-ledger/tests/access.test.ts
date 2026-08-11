/**
 * @jest-environment node
 *
 * Proof Ledger — access model.
 *
 * Two roles, one password field, and server-side enforcement of every write.
 */

import { NextRequest } from 'next/server'

import { hashLedgerPassword } from '../auth/passwords'
import { resetLoginThrottle } from '../auth/rate-limit'
import { LEDGER_SESSION_COOKIE, createSessionToken, verifySessionToken } from '../auth/session'
import { MemoryLedgerRepository } from '../database/memory-repository'
import {
  handleApplyRecord,
  handleCreateNote,
  handleGetEvidence,
  handleLockObligation,
  handleLogin,
  handleResolveNote,
} from '../server/handlers'
import { applyRecord, CAD, makeLedger } from './helpers'

const SESSION_SECRET = 'test-session-secret-value-that-is-long-enough'
const OWNER_PASSWORD = 'owner-password-2026'
const VIEWER_PASSWORD = 'viewer-password-2026'

function request(
  path: string,
  init: { method?: string; body?: unknown; role?: 'OWNER' | 'VIEWER' } = {}
): NextRequest {
  const nextRequest = new NextRequest(`http://ledger.test${path}`, {
    method: init.method ?? 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.7' },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })
  if (init.role) {
    nextRequest.cookies.set(
      LEDGER_SESSION_COOKIE,
      createSessionToken(init.role, SESSION_SECRET)
    )
  }
  return nextRequest
}

beforeAll(async () => {
  process.env.LEDGER_SESSION_SECRET = SESSION_SECRET
  process.env.LEDGER_OWNER_PASSWORD_HASH = await hashLedgerPassword(OWNER_PASSWORD)
  process.env.LEDGER_VIEWER_PASSWORD_HASH = await hashLedgerPassword(VIEWER_PASSWORD)
})

beforeEach(() => {
  resetLoginThrottle()
})

describe('password-only login', () => {
  it('maps the owner password to OWNER', async () => {
    const response = await handleLogin(request('/api/proof-ledger/session', { body: { password: OWNER_PASSWORD } }))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ role: 'OWNER' })

    const cookie = response.cookies.get(LEDGER_SESSION_COOKIE)
    expect(cookie?.httpOnly).toBe(true)
    expect(cookie?.sameSite).toBe('strict')
    expect(verifySessionToken(cookie?.value, SESSION_SECRET)?.role).toBe('OWNER')
  })

  it('maps the viewer password to VIEWER', async () => {
    const response = await handleLogin(
      request('/api/proof-ledger/session', { body: { password: VIEWER_PASSWORD } })
    )
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ role: 'VIEWER' })
  })

  it('rejects an invalid password without revealing anything', async () => {
    const response = await handleLogin(
      request('/api/proof-ledger/session', { body: { password: 'not-the-password' } })
    )
    expect(response.status).toBe(401)
    const payload = await response.json()
    expect(payload.error).toBe('That password was not recognised.')
    expect(response.cookies.get(LEDGER_SESSION_COOKIE)).toBeUndefined()
  })

  it('throttles repeated failed attempts', async () => {
    let last = await handleLogin(request('/api/proof-ledger/session', { body: { password: 'x' } }))
    for (let attempt = 0; attempt < 12; attempt += 1) {
      last = await handleLogin(request('/api/proof-ledger/session', { body: { password: 'x' } }))
    }
    expect(last.status).toBe(429)
  })

  it('rejects a forged session token', () => {
    const token = createSessionToken('VIEWER', SESSION_SECRET)
    const forged = token.replace(/^VIEWER/, 'OWNER')
    expect(verifySessionToken(forged, SESSION_SECRET)).toBeNull()
  })

  it('rejects an expired session token', () => {
    const token = createSessionToken('OWNER', SESSION_SECRET, Date.now(), 1000)
    expect(verifySessionToken(token, SESSION_SECRET, Date.now() + 2000)).toBeNull()
  })
})

describe('unauthenticated access', () => {
  it('rejects an unauthenticated financial write', async () => {
    const ledger = await makeLedger()
    const response = await handleApplyRecord(
      request('/api/proof-ledger/transactions', {
        body: { type: 'BASE_DEPOSIT', date: '2026-08-11', amountCents: 50000, reason: 'x', evidenceId: 'ev' },
      }),
      ledger
    )
    expect(response.status).toBe(401)
    expect(await ledger.listTransactions()).toHaveLength(0)
  })

  it('rejects unauthenticated evidence access', async () => {
    const ledger = await makeLedger()
    const evidence = await ledger.createEvidence({
      data: Buffer.from('proof'),
      mimeType: 'image/png',
      byteSize: 5,
      sha256: 'abc',
    })
    const response = await handleGetEvidence(
      request(`/api/proof-ledger/evidence/${evidence.id}`, { method: 'GET' }),
      ledger,
      evidence.id
    )
    expect(response.status).toBe(401)
  })
})

describe('viewer restrictions', () => {
  let ledger: MemoryLedgerRepository
  let withdrawalCode: string

  beforeEach(async () => {
    ledger = await makeLedger()
    const withdrawal = await applyRecord(ledger, {
      type: 'WITHDRAWAL',
      amountCents: CAD(100),
      requiredRepaymentCents: CAD(120),
    })
    withdrawalCode = withdrawal.transactionCode
  })

  // Test 12
  it('rejects a direct financial POST from a viewer and changes nothing', async () => {
    const before = await ledger.listTransactions()

    const response = await handleApplyRecord(
      request('/api/proof-ledger/transactions', {
        role: 'VIEWER',
        body: {
          type: 'BASE_DEPOSIT',
          date: '2026-08-11',
          amountCents: CAD(500),
          reason: 'viewer attempt',
          evidenceId: 'ev-test',
        },
      }),
      ledger
    )

    expect(response.status).toBe(403)
    expect(await ledger.listTransactions()).toEqual(before)
  })

  it('rejects a viewer trying to change withdrawal principal or extra repayment', async () => {
    const before = await ledger.listTransactions()

    const response = await handleApplyRecord(
      request('/api/proof-ledger/transactions', {
        role: 'VIEWER',
        body: {
          type: 'WITHDRAWAL',
          date: '2026-08-11',
          amountCents: CAD(1),
          requiredRepaymentCents: CAD(9999),
          reason: 'rewrite the numbers',
          evidenceId: 'ev-test',
        },
      }),
      ledger
    )

    expect(response.status).toBe(403)
    const after = await ledger.listTransactions()
    expect(after).toEqual(before)
    expect(after[0].withdrawalPrincipalCents).toBe(CAD(100))
    expect(after[0].extraRepaymentCents).toBe(CAD(20))
    expect(after[0].requiredRepaymentCents).toBe(CAD(120))
  })

  it('rejects a viewer trying to close a withdrawal with a repayment', async () => {
    const response = await handleApplyRecord(
      request('/api/proof-ledger/transactions', {
        role: 'VIEWER',
        body: {
          type: 'WITHDRAWAL_REPAYMENT',
          date: '2026-08-11',
          amountCents: CAD(120),
          linkedTransactionCode: withdrawalCode,
          reason: 'viewer closes it',
          evidenceId: 'ev-test',
        },
      }),
      ledger
    )
    expect(response.status).toBe(403)
    expect(await ledger.listTransactions()).toHaveLength(1)
  })

  it('rejects a viewer changing the opening obligation', async () => {
    const response = await handleLockObligation(
      request('/api/proof-ledger/obligation/lock', {
        role: 'VIEWER',
        body: { originalObligationCents: CAD(1), confirm: true },
      }),
      ledger
    )
    expect(response.status).toBe(403)
    expect((await ledger.getConfig())?.originalObligationCents).toBe(CAD(36000))
  })

  it('lets a viewer write a note', async () => {
    const response = await handleCreateNote(
      request('/api/proof-ledger/notes', {
        role: 'VIEWER',
        body: { body: 'Please confirm why TX-001 has CAD $20 extra added.' },
      }),
      ledger
    )
    expect(response.status).toBe(201)
    const notes = await ledger.listNotes()
    expect(notes).toHaveLength(1)
    expect(notes[0].authorRole).toBe('VIEWER')
  })

  it('does not let a viewer resolve a note', async () => {
    const note = await ledger.createNote({
      transactionId: null,
      authorRole: 'VIEWER',
      body: 'question',
    })
    const response = await handleResolveNote(
      request('/api/proof-ledger/notes/resolve', { role: 'VIEWER', body: { noteId: note.id } }),
      ledger
    )
    expect(response.status).toBe(403)
    expect((await ledger.listNotes())[0].resolvedAt).toBeNull()
  })

  it('lets a viewer view evidence', async () => {
    const evidence = await ledger.createEvidence({
      data: Buffer.from('proof-bytes'),
      mimeType: 'image/png',
      byteSize: 11,
      sha256: 'abc',
    })
    const response = await handleGetEvidence(
      request(`/api/proof-ledger/evidence/${evidence.id}`, { method: 'GET', role: 'VIEWER' }),
      ledger,
      evidence.id
    )
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('image/png')
    expect(response.headers.get('x-robots-tag')).toContain('noindex')
  })
})

describe('owner permissions', () => {
  it('lets the owner apply a record and resolve a note', async () => {
    const ledger = await makeLedger()
    await ledger.createEvidence({
      data: Buffer.from('proof'),
      mimeType: 'image/png',
      byteSize: 5,
      sha256: 'abc',
    })
    const evidenceId = 'ev-0002'

    const applied = await handleApplyRecord(
      request('/api/proof-ledger/transactions', {
        role: 'OWNER',
        body: {
          type: 'BASE_DEPOSIT',
          date: '2026-08-11',
          amountCents: CAD(500),
          reason: 'Deposit toward the original balance',
          evidenceId,
        },
      }),
      ledger
    )
    expect(applied.status).toBe(201)
    expect(await ledger.listTransactions()).toHaveLength(1)

    const note = await ledger.createNote({
      transactionId: null,
      authorRole: 'VIEWER',
      body: 'question',
    })
    const resolved = await handleResolveNote(
      request('/api/proof-ledger/notes/resolve', { role: 'OWNER', body: { noteId: note.id } }),
      ledger
    )
    expect(resolved.status).toBe(200)
    expect((await ledger.listNotes())[0].resolvedAt).not.toBeNull()
  })

  it('refuses to apply a record whose evidence does not exist', async () => {
    const ledger = await makeLedger()
    const response = await handleApplyRecord(
      request('/api/proof-ledger/transactions', {
        role: 'OWNER',
        body: {
          type: 'BASE_DEPOSIT',
          date: '2026-08-11',
          amountCents: CAD(500),
          reason: 'no proof',
          evidenceId: 'ev-missing',
        },
      }),
      ledger
    )
    expect(response.status).toBe(400)
    expect(await ledger.listTransactions()).toHaveLength(0)
  })

  it('refuses to lock the obligation twice', async () => {
    const ledger = await makeLedger()
    const response = await handleLockObligation(
      request('/api/proof-ledger/obligation/lock', {
        role: 'OWNER',
        body: { originalObligationCents: CAD(1000), confirm: true },
      }),
      ledger
    )
    expect(response.status).toBe(409)
    expect((await ledger.getConfig())?.originalObligationCents).toBe(CAD(36000))
  })
})

describe('database outage', () => {
  it('answers 503 with a clear message instead of an opaque failure', async () => {
    const unreachable = async () => {
      const error = new Error("Can't reach database server")
      error.name = 'PrismaClientInitializationError'
      throw error
    }
    const failing = {
      getConfig: unreachable,
      listTransactions: unreachable,
      appendTransaction: unreachable,
    } as unknown as MemoryLedgerRepository

    const response = await handleApplyRecord(
      request('/api/proof-ledger/transactions', {
        role: 'OWNER',
        body: {
          type: 'BASE_DEPOSIT',
          date: '2026-08-11',
          amountCents: CAD(500),
          reason: 'deposit',
          evidenceId: 'ev-1',
        },
      }),
      failing
    )

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: 'The ledger database is not reachable. No change has been made.',
    })
  })
})
