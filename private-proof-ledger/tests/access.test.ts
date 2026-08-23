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
import {
  LEDGER_SESSION_COOKIE,
  OWNER_SESSION_TTL_MS,
  VIEWER_SESSION_TTL_MS,
  createSessionToken,
  verifySessionToken,
} from '../auth/session'
import { MemoryLedgerRepository } from '../database/memory-repository'
import {
  handleApplyRecord,
  handleCreateNote,
  handleGetEvidence,
  handleLockObligation,
  handleLogin,
  handleResolveNote,
} from '../server/handlers'
import { DEFAULT_ORIGINAL_OBLIGATION_CENTS } from '../ledger/types'
import { addEvidence, applyRecord, CAD, makeLedger } from './helpers'

const SESSION_SECRET = 'test-session-secret-value-that-is-long-enough'
const OWNER_PASSWORD = 'owner-password-2026'
const VIEWER_PASSWORD = 'viewer-password-2026'

function request(
  path: string,
  init: {
    method?: string
    body?: unknown
    role?: 'OWNER' | 'VIEWER'
    credentialVersion?: number
  } = {}
): NextRequest {
  const nextRequest = new NextRequest(`http://ledger.test${path}`, {
    method: init.method ?? 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.7' },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })
  if (init.role) {
    nextRequest.cookies.set(
      LEDGER_SESSION_COOKIE,
      createSessionToken(init.role, init.credentialVersion ?? 1, SESSION_SECRET)
    )
  }
  return nextRequest
}

/** A ledger whose credential rows have been seeded from the bootstrap hashes. */
async function makeAuthenticatedLedger(): Promise<MemoryLedgerRepository> {
  const ledger = await makeLedger()
  await ledger.seedCredential('OWNER', process.env.LEDGER_OWNER_PASSWORD_HASH as string)
  await ledger.seedCredential('VIEWER', process.env.LEDGER_VIEWER_PASSWORD_HASH as string)
  return ledger
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
    const ledger = await makeAuthenticatedLedger()
    const response = await handleLogin(
      request('/api/proof-ledger/session', { body: { password: OWNER_PASSWORD } }),
      ledger
    )
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ role: 'OWNER' })

    const cookie = response.cookies.get(LEDGER_SESSION_COOKIE)
    expect(cookie?.httpOnly).toBe(true)
    expect(cookie?.sameSite).toBe('strict')
    expect(verifySessionToken(cookie?.value, SESSION_SECRET)?.role).toBe('OWNER')
  })

  it('maps the viewer password to VIEWER', async () => {
    const ledger = await makeAuthenticatedLedger()
    const response = await handleLogin(
      request('/api/proof-ledger/session', { body: { password: VIEWER_PASSWORD } }),
      ledger
    )
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ role: 'VIEWER' })
  })

  it('seeds credentials from the bootstrap hashes on first login', async () => {
    const ledger = await makeLedger()
    expect(await ledger.getCredential('OWNER')).toBeNull()

    const response = await handleLogin(
      request('/api/proof-ledger/session', { body: { password: OWNER_PASSWORD } }),
      ledger
    )
    expect(response.status).toBe(200)
    expect((await ledger.getCredential('OWNER'))?.credentialVersion).toBe(1)
  })

  it('rejects an invalid password without revealing anything', async () => {
    const ledger = await makeAuthenticatedLedger()
    const response = await handleLogin(
      request('/api/proof-ledger/session', { body: { password: 'not-the-password' } }),
      ledger
    )
    expect(response.status).toBe(401)
    const payload = await response.json()
    expect(payload.error).toBe('That password was not recognised.')
    expect(response.cookies.get(LEDGER_SESSION_COOKIE)).toBeUndefined()
  })

  it('throttles repeated failed attempts', async () => {
    const ledger = await makeAuthenticatedLedger()
    let last = await handleLogin(
      request('/api/proof-ledger/session', { body: { password: 'x' } }),
      ledger
    )
    for (let attempt = 0; attempt < 12; attempt += 1) {
      last = await handleLogin(
        request('/api/proof-ledger/session', { body: { password: 'x' } }),
        ledger
      )
    }
    expect(last.status).toBe(429)
  })

  it('rejects a forged session token', () => {
    const token = createSessionToken('VIEWER', 1, SESSION_SECRET)
    const forged = token.replace(/^VIEWER/, 'OWNER')
    expect(verifySessionToken(forged, SESSION_SECRET)).toBeNull()
  })

  it('rejects an expired session token', () => {
    const token = createSessionToken('OWNER', 1, SESSION_SECRET, Date.now(), 1000)
    expect(verifySessionToken(token, SESSION_SECRET, Date.now() + 2000)).toBeNull()
  })

  it('gives the owner 12 hours and the viewer 30 days', () => {
    expect(OWNER_SESSION_TTL_MS).toBe(12 * 60 * 60 * 1000)
    expect(VIEWER_SESSION_TTL_MS).toBe(30 * 24 * 60 * 60 * 1000)

    const now = Date.now()
    const owner = verifySessionToken(
      createSessionToken('OWNER', 1, SESSION_SECRET, now),
      SESSION_SECRET,
      now
    )
    const viewer = verifySessionToken(
      createSessionToken('VIEWER', 1, SESSION_SECRET, now),
      SESSION_SECRET,
      now
    )
    expect(owner?.expiresAt).toBe(now + OWNER_SESSION_TTL_MS)
    expect(viewer?.expiresAt).toBe(now + VIEWER_SESSION_TTL_MS)
  })
})

describe('fixed opening obligation', () => {
  it('accepts exactly CAD $36,000.00 and nothing else', async () => {
    const ledger = new MemoryLedgerRepository()
    await ledger.seedCredential('OWNER', process.env.LEDGER_OWNER_PASSWORD_HASH as string)

    const wrong = await handleLockObligation(
      request('/api/proof-ledger/obligation/lock', {
        role: 'OWNER',
        body: { originalObligationCents: CAD(10000), confirm: true },
      }),
      ledger
    )
    expect(wrong.status).toBe(400)
    expect((await ledger.getConfig())?.lockedAt ?? null).toBeNull()

    const right = await handleLockObligation(
      request('/api/proof-ledger/obligation/lock', {
        role: 'OWNER',
        body: { originalObligationCents: DEFAULT_ORIGINAL_OBLIGATION_CENTS, confirm: true },
      }),
      ledger
    )
    expect(right.status).toBe(200)
    const config = await ledger.getConfig()
    expect(config?.originalObligationCents).toBe(CAD(36000))
    expect(config?.lockedAt).not.toBeNull()
  })
})

describe('unauthenticated access', () => {
  it('rejects an unauthenticated financial write', async () => {
    const ledger = await makeAuthenticatedLedger()
    const response = await handleApplyRecord(
      request('/api/proof-ledger/transactions', {
        body: { proposalToken: 'anything', confirm: true },
      }),
      ledger
    )
    expect(response.status).toBe(401)
    expect(await ledger.listTransactions()).toHaveLength(0)
  })

  it('rejects unauthenticated evidence access', async () => {
    const ledger = await makeAuthenticatedLedger()
    const { evidenceId } = await addEvidence(ledger)
    const response = await handleGetEvidence(
      request(`/api/proof-ledger/evidence/${evidenceId}`, { method: 'GET' }),
      ledger,
      evidenceId
    )
    expect(response.status).toBe(401)
  })
})

describe('viewer restrictions', () => {
  let ledger: MemoryLedgerRepository
  let withdrawalCode: string

  beforeEach(async () => {
    ledger = await makeAuthenticatedLedger()
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
        body: { proposalToken: 'forged', confirm: true },
      }),
      ledger
    )

    expect(response.status).toBe(403)
    expect(await ledger.listTransactions()).toEqual(before)
  })

  it('leaves withdrawal principal and extra repayment untouched', async () => {
    const after = await ledger.listTransactions()
    expect(after[0].withdrawalPrincipalCents).toBe(CAD(100))
    expect(after[0].extraRepaymentCents).toBe(CAD(20))
    expect(after[0].requiredRepaymentCents).toBe(CAD(120))
    expect(withdrawalCode).toBe('TX-001')
  })

  it('rejects a viewer changing the opening obligation', async () => {
    const response = await handleLockObligation(
      request('/api/proof-ledger/obligation/lock', {
        role: 'VIEWER',
        body: { originalObligationCents: DEFAULT_ORIGINAL_OBLIGATION_CENTS, confirm: true },
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
    const { evidenceId } = await addEvidence(ledger, Buffer.from('viewer-visible-proof'))
    const response = await handleGetEvidence(
      request(`/api/proof-ledger/evidence/${evidenceId}`, { method: 'GET', role: 'VIEWER' }),
      ledger,
      evidenceId
    )
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('image/png')
    expect(response.headers.get('x-robots-tag')).toContain('noindex')
  })
})

describe('owner permissions', () => {
  it('lets the owner resolve a note', async () => {
    const ledger = await makeAuthenticatedLedger()
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

  it('refuses to lock the obligation twice', async () => {
    const ledger = await makeAuthenticatedLedger()
    const response = await handleLockObligation(
      request('/api/proof-ledger/obligation/lock', {
        role: 'OWNER',
        body: { originalObligationCents: DEFAULT_ORIGINAL_OBLIGATION_CENTS, confirm: true },
      }),
      ledger
    )
    expect(response.status).toBe(409)
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
      getCredential: unreachable,
      getConfig: unreachable,
      listTransactions: unreachable,
      appendTransaction: unreachable,
    } as unknown as MemoryLedgerRepository

    const response = await handleApplyRecord(
      request('/api/proof-ledger/transactions', {
        role: 'OWNER',
        body: { proposalToken: 'token', confirm: true },
      }),
      failing
    )

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: 'The ledger database is not reachable. No change has been made.',
    })
  })
})
