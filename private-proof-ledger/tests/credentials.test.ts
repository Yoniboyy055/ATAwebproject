/**
 * @jest-environment node
 *
 * Proof Ledger — credential storage, rotation, session invalidation and the
 * owner-only viewer access switch.
 */

import { NextRequest } from 'next/server'

import {
  changePassword,
  ensureCredentialsSeeded,
  isViewerAccessEnabled,
  setViewerAccessEnabled,
} from '../auth/credentials'
import { authenticatePassword } from '../auth/credentials'
import { hashLedgerPassword, verifyLedgerPassword } from '../auth/passwords'
import { resetLoginThrottle } from '../auth/rate-limit'
import { LEDGER_SESSION_COOKIE, createSessionToken } from '../auth/session'
import { MemoryLedgerRepository } from '../database/memory-repository'
import {
  handleChangePassword,
  handleCreateNote,
  handleLogin,
  handleSettingsStatus,
  handleViewerAccess,
} from '../server/handlers'
import { resolveSession } from '../server/session'
import { makeLedger } from './helpers'

const SESSION_SECRET = 'test-session-secret-value-that-is-long-enough'
const OWNER_PASSWORD = 'owner-password-2026'
const VIEWER_PASSWORD = 'viewer-password-2026'
const NEW_VIEWER_PASSWORD = 'viewer-password-rotated-2026'
const NEW_OWNER_PASSWORD = 'owner-password-rotated-2026'

function authConfig() {
  return {
    ownerPasswordHash: process.env.LEDGER_OWNER_PASSWORD_HASH,
    viewerPasswordHash: process.env.LEDGER_VIEWER_PASSWORD_HASH,
    sessionSecret: SESSION_SECRET,
    isProduction: false,
  }
}

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
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '198.51.100.4' },
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

async function seeded(): Promise<MemoryLedgerRepository> {
  const ledger = await makeLedger()
  await ensureCredentialsSeeded(ledger, authConfig())
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

describe('credential storage', () => {
  it('seeds both roles from the bootstrap hashes exactly once', async () => {
    const ledger = await seeded()
    expect((await ledger.getCredential('OWNER'))?.credentialVersion).toBe(1)
    expect((await ledger.getCredential('VIEWER'))?.credentialVersion).toBe(1)
  })

  it('does not overwrite a changed password on a later redeploy', async () => {
    const ledger = await seeded()

    const changed = await changePassword(ledger, {
      targetRole: 'OWNER',
      currentOwnerPassword: OWNER_PASSWORD,
      newPassword: NEW_OWNER_PASSWORD,
    })
    expect(changed.ok).toBe(true)

    // A redeploy runs the bootstrap seed again with the ORIGINAL env hashes.
    await ensureCredentialsSeeded(ledger, authConfig())

    const stored = await ledger.getCredential('OWNER')
    expect(await verifyLedgerPassword(NEW_OWNER_PASSWORD, stored?.passwordHash)).toBe(true)
    expect(await verifyLedgerPassword(OWNER_PASSWORD, stored?.passwordHash)).toBe(false)
  })

  it('never stores a plaintext password', async () => {
    const ledger = await seeded()
    const stored = await ledger.getCredential('OWNER')
    expect(stored?.passwordHash).toMatch(/^scrypt\$/)
    expect(stored?.passwordHash).not.toContain(OWNER_PASSWORD)
  })
})

describe('password rotation', () => {
  it('rotates the owner password and bumps its version', async () => {
    const ledger = await seeded()
    const result = await changePassword(ledger, {
      targetRole: 'OWNER',
      currentOwnerPassword: OWNER_PASSWORD,
      newPassword: NEW_OWNER_PASSWORD,
    })

    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error('unreachable')
    expect(result.credentialVersion).toBe(2)

    const after = await authenticatePassword(NEW_OWNER_PASSWORD, ledger, authConfig())
    expect(after).toMatchObject({ ok: true, role: 'OWNER' })
    await expect(authenticatePassword(OWNER_PASSWORD, ledger, authConfig())).resolves.toMatchObject(
      { ok: false }
    )
  })

  it('lets the owner rotate the viewer password without the old one', async () => {
    const ledger = await seeded()
    const result = await changePassword(ledger, {
      targetRole: 'VIEWER',
      currentOwnerPassword: OWNER_PASSWORD,
      newPassword: NEW_VIEWER_PASSWORD,
    })

    expect(result).toMatchObject({ ok: true, role: 'VIEWER', credentialVersion: 2 })
    await expect(
      authenticatePassword(NEW_VIEWER_PASSWORD, ledger, authConfig())
    ).resolves.toMatchObject({ ok: true, role: 'VIEWER' })
    await expect(
      authenticatePassword(VIEWER_PASSWORD, ledger, authConfig())
    ).resolves.toMatchObject({ ok: false })
  })

  it('requires the correct current owner password', async () => {
    const ledger = await seeded()
    const result = await changePassword(ledger, {
      targetRole: 'VIEWER',
      currentOwnerPassword: 'wrong-owner-password',
      newPassword: NEW_VIEWER_PASSWORD,
    })
    expect(result).toEqual({ ok: false, reason: 'WRONG_CURRENT_PASSWORD' })
  })

  it('enforces a minimum length', async () => {
    const ledger = await seeded()
    const result = await changePassword(ledger, {
      targetRole: 'OWNER',
      currentOwnerPassword: OWNER_PASSWORD,
      newPassword: 'short',
    })
    expect(result).toEqual({ ok: false, reason: 'TOO_SHORT' })
  })

  it('rejects a viewer attempting any password change over HTTP', async () => {
    const ledger = await seeded()
    const response = await handleChangePassword(
      request('/api/proof-ledger/settings/password', {
        role: 'VIEWER',
        body: {
          targetRole: 'VIEWER',
          currentOwnerPassword: OWNER_PASSWORD,
          newPassword: NEW_VIEWER_PASSWORD,
        },
      }),
      ledger
    )

    expect(response.status).toBe(403)
    await expect(response.json()).resolves.toEqual({
      error: 'Password changes are controlled by the ledger owner.',
    })
    // Unchanged.
    expect((await ledger.getCredential('VIEWER'))?.credentialVersion).toBe(1)
  })

  it('keeps the owner signed in after rotating their own password', async () => {
    const ledger = await seeded()
    const response = await handleChangePassword(
      request('/api/proof-ledger/settings/password', {
        role: 'OWNER',
        body: {
          targetRole: 'OWNER',
          currentOwnerPassword: OWNER_PASSWORD,
          newPassword: NEW_OWNER_PASSWORD,
        },
      }),
      ledger
    )
    expect(response.status).toBe(200)

    const cookie = response.cookies.get(LEDGER_SESSION_COOKIE)
    expect(cookie?.value).toBeTruthy()
    await expect(resolveSession(cookie?.value, ledger)).resolves.toMatchObject({
      role: 'OWNER',
      credentialVersion: 2,
    })
  })
})

describe('session invalidation', () => {
  it('rejects a session issued against a stale owner credential version', async () => {
    const ledger = await seeded()
    const stale = createSessionToken('OWNER', 1, SESSION_SECRET)

    await changePassword(ledger, {
      targetRole: 'OWNER',
      currentOwnerPassword: OWNER_PASSWORD,
      newPassword: NEW_OWNER_PASSWORD,
    })

    await expect(resolveSession(stale, ledger)).resolves.toBeNull()
  })

  it('rejects a stale viewer session after the owner rotates the viewer password', async () => {
    const ledger = await seeded()
    const stale = createSessionToken('VIEWER', 1, SESSION_SECRET)
    await expect(resolveSession(stale, ledger)).resolves.not.toBeNull()

    await changePassword(ledger, {
      targetRole: 'VIEWER',
      currentOwnerPassword: OWNER_PASSWORD,
      newPassword: NEW_VIEWER_PASSWORD,
    })

    await expect(resolveSession(stale, ledger)).resolves.toBeNull()
  })

  it('locks a stale viewer out of writing notes', async () => {
    const ledger = await seeded()
    await changePassword(ledger, {
      targetRole: 'VIEWER',
      currentOwnerPassword: OWNER_PASSWORD,
      newPassword: NEW_VIEWER_PASSWORD,
    })

    const response = await handleCreateNote(
      request('/api/proof-ledger/notes', {
        role: 'VIEWER',
        credentialVersion: 1,
        body: { body: 'stale device' },
      }),
      ledger
    )
    expect(response.status).toBe(401)
    expect(await ledger.listNotes()).toHaveLength(0)
  })
})

describe('viewer access switch', () => {
  it('is enabled by default', async () => {
    const ledger = await seeded()
    expect(await isViewerAccessEnabled(ledger)).toBe(true)
  })

  it('blocks viewer login when the owner disables it', async () => {
    const ledger = await seeded()
    await setViewerAccessEnabled(ledger, false)

    const result = await authenticatePassword(VIEWER_PASSWORD, ledger, authConfig())
    expect(result).toEqual({ ok: false, reason: 'VIEWER_ACCESS_DISABLED' })

    const response = await handleLogin(
      request('/api/proof-ledger/session', { body: { password: VIEWER_PASSWORD } }),
      ledger
    )
    expect(response.status).toBe(403)
  })

  it('invalidates existing viewer sessions and leaves the owner working', async () => {
    const ledger = await seeded()
    const viewerSession = createSessionToken('VIEWER', 1, SESSION_SECRET)
    const ownerSession = createSessionToken('OWNER', 1, SESSION_SECRET)

    await setViewerAccessEnabled(ledger, false)

    await expect(resolveSession(viewerSession, ledger)).resolves.toBeNull()
    await expect(resolveSession(ownerSession, ledger)).resolves.toMatchObject({ role: 'OWNER' })

    const owner = await authenticatePassword(OWNER_PASSWORD, ledger, authConfig())
    expect(owner).toMatchObject({ ok: true, role: 'OWNER' })
  })

  it('lets the owner re-enable it', async () => {
    const ledger = await seeded()
    await setViewerAccessEnabled(ledger, false)
    await setViewerAccessEnabled(ledger, true)
    expect(await isViewerAccessEnabled(ledger)).toBe(true)
    await expect(
      authenticatePassword(VIEWER_PASSWORD, ledger, authConfig())
    ).resolves.toMatchObject({ ok: true, role: 'VIEWER' })
  })

  it('rejects a viewer trying to change the switch', async () => {
    const ledger = await seeded()
    const response = await handleViewerAccess(
      request('/api/proof-ledger/settings/viewer-access', {
        role: 'VIEWER',
        body: { enabled: false },
      }),
      ledger
    )
    expect(response.status).toBe(403)
    expect(await isViewerAccessEnabled(ledger)).toBe(true)
  })
})

describe('settings status', () => {
  it('never exposes a hash, secret or the viewer password date to a viewer', async () => {
    const ledger = await seeded()
    const response = await handleSettingsStatus(
      request('/api/proof-ledger/settings', { method: 'GET', role: 'VIEWER' }),
      ledger
    )
    expect(response.status).toBe(200)

    const payload = await response.json()
    const serialised = JSON.stringify(payload)
    expect(payload.role).toBe('VIEWER')
    expect(payload.viewerPasswordUpdatedAt).toBeNull()
    expect(serialised).not.toContain('scrypt$')
    expect(serialised).not.toContain(SESSION_SECRET)
    expect(serialised).not.toContain('postgres')
  })

  it('reports password dates and the viewer switch to the owner', async () => {
    const ledger = await seeded()
    const response = await handleSettingsStatus(
      request('/api/proof-ledger/settings', { method: 'GET', role: 'OWNER' }),
      ledger
    )
    const payload = await response.json()
    expect(payload.role).toBe('OWNER')
    expect(payload.ownerPasswordUpdatedAt).toBeTruthy()
    expect(payload.viewerPasswordUpdatedAt).toBeTruthy()
    expect(payload.viewerAccessEnabled).toBe(true)
    expect(payload.integrityOk).toBe(true)
  })
})
