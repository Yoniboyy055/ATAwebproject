/**
 * Proof Ledger — HTTP handlers.
 *
 * The Next.js route files under `app/proof-ledger` and `app/api/proof-ledger`
 * are thin adapters that call straight into these functions. Every write is
 * authorised here, on the server, regardless of what the browser sends.
 */

import { NextRequest, NextResponse } from 'next/server'

import { analyzeEvidence, readAnthropicSettings } from '../ai/analyze'
import { AnalysisContext } from '../ai/prompt'
import {
  canResolveNotes,
  canViewEvidence,
  canWriteFinancialRecords,
  canWriteNotes,
} from '../auth/authenticate'
import { authenticatePassword } from '../auth/authenticate'
import { readAuthConfig } from '../auth/config'
import { clearLoginAttempts, registerLoginAttempt } from '../auth/rate-limit'
import { createSessionToken, LEDGER_SESSION_COOKIE, sessionCookieOptions } from '../auth/session'
import { LedgerDatabaseNotConfiguredError } from '../database/client'
import { LedgerConflictError, LedgerRepository } from '../database/repository'
import { LedgerRuleError, prepareRecord } from '../ledger/apply'
import { computeWithdrawalViews } from '../ledger/engine'
import { verifyChain } from '../ledger/hash-chain'
import { DEFAULT_ORIGINAL_OBLIGATION_CENTS, LedgerRole } from '../ledger/types'
import {
  applyRecordSchema,
  lockObligationSchema,
  loginSchema,
  noteSchema,
  resolveNoteSchema,
} from '../schemas/proposal'
import { isAiReadableMimeType, validateEvidence } from './evidence'
import { getLedgerSessionFromRequest } from './session'

const NO_STORE = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' }

function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: NO_STORE })
}

function unauthorized(): NextResponse {
  return json({ error: 'Authentication required.' }, 401)
}

function forbidden(message = 'Only the owner can change financial records.'): NextResponse {
  return json({ error: message }, 403)
}

/**
 * Turn a database outage into a clear 503 instead of an opaque 500.
 *
 * Nothing has been written when this fires, so it is always safe to say so.
 */
function isDatabaseUnavailable(error: unknown): boolean {
  if (error instanceof LedgerDatabaseNotConfiguredError) return true
  if (!error || typeof error !== 'object') return false
  const name = (error as { name?: string }).name ?? ''
  if (name === 'PrismaClientInitializationError' || name === 'PrismaClientRustPanicError') {
    return true
  }
  const code = (error as { errorCode?: string; code?: string }).errorCode ?? (error as { code?: string }).code
  return typeof code === 'string' && /^P1\d{3}$/.test(code)
}

async function guardDatabase(run: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await run()
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return json(
        { error: 'The ledger database is not reachable. No change has been made.' },
        503
      )
    }
    throw error
  }
}

function requireRole(request: NextRequest): LedgerRole | null {
  return getLedgerSessionFromRequest(request)?.role ?? null
}

function clientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

/* -------------------------------------------------------------- session -- */

export async function handleLogin(request: NextRequest): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) return json({ error: 'A password is required.' }, 400)

  const identifier = clientIdentifier(request)
  const throttle = registerLoginAttempt(identifier)
  if (throttle.limited) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { ...NO_STORE, 'retry-after': String(throttle.retryAfterSeconds) } }
    )
  }

  const config = readAuthConfig()
  const result = await authenticatePassword(parsed.data.password, config)

  if (!result.ok) {
    // The same message for both cases: never reveal which role a password
    // nearly matched, or whether the server is configured.
    return json({ error: 'That password was not recognised.' }, 401)
  }

  clearLoginAttempts(identifier)
  const token = createSessionToken(result.role, config.sessionSecret as string)
  const response = json({ role: result.role })
  response.cookies.set(LEDGER_SESSION_COOKIE, token, sessionCookieOptions(config.isProduction))
  return response
}

export async function handleLogout(): Promise<NextResponse> {
  const response = json({ ok: true })
  response.cookies.set(LEDGER_SESSION_COOKIE, '', {
    ...sessionCookieOptions(readAuthConfig().isProduction),
    maxAge: 0,
  })
  return response
}

/* ----------------------------------------------------------- obligation -- */

async function handleLockObligationImpl(
  request: NextRequest,
  repository: LedgerRepository
): Promise<NextResponse> {
  const role = requireRole(request)
  if (!role) return unauthorized()
  if (!canWriteFinancialRecords(role)) return forbidden()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  const parsed = lockObligationSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: 'Confirm the original obligation before locking it.' }, 400)
  }
  if (parsed.data.originalObligationCents <= 0) {
    return json({ error: 'The original obligation must be greater than zero.' }, 400)
  }

  try {
    const config = await repository.lockConfig(parsed.data.originalObligationCents)
    return json({ config })
  } catch (error) {
    if (error instanceof LedgerConflictError) return json({ error: error.message }, 409)
    throw error
  }
}

/* -------------------------------------------------------------- analyse -- */

async function buildAnalysisContext(repository: LedgerRepository): Promise<AnalysisContext> {
  const transactions = await repository.listTransactions()
  const open = computeWithdrawalViews(transactions).filter((view) => view.status !== 'CLOSED')
  return {
    todayIso: new Date().toISOString().slice(0, 10),
    openWithdrawals: open.map((view) => ({
      transactionCode: view.transactionCode,
      date: view.date,
      principalCents: view.principalCents,
      extraRepaymentCents: view.extraRepaymentCents,
      requiredRepaymentCents: view.requiredRepaymentCents,
      repaymentRemainingCents: view.repaymentRemainingCents,
    })),
  }
}

/**
 * Analyse a screenshot plus an instruction and return the record that WOULD be
 * applied. Nothing is written unless the analysis produces a confident,
 * conflict-free proposal that also survives the deterministic ledger rules.
 */
async function handleAnalyzeImpl(
  request: NextRequest,
  repository: LedgerRepository
): Promise<NextResponse> {
  const role = requireRole(request)
  if (!role) return unauthorized()
  if (!canWriteFinancialRecords(role)) return forbidden()

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return json({ error: 'A screenshot and an explanation are required.' }, 400)
  }

  const instruction = String(form.get('instruction') ?? '').trim()
  if (!instruction) {
    return json({ error: 'Tell Proof Ledger what happened before analysing.' }, 400)
  }
  if (instruction.length > 4000) {
    return json({ error: 'That explanation is too long.' }, 400)
  }

  const file = form.get('evidence')
  if (!(file instanceof File)) {
    return json({ error: 'A screenshot is required for every record.' }, 400)
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const validation = validateEvidence(buffer, file.type)
  if (!validation.ok) return json({ error: validation.message }, 400)

  if (!isAiReadableMimeType(validation.mimeType)) {
    return json(
      { error: 'Please upload a PNG, JPEG or WebP screenshot so it can be read.' },
      400
    )
  }

  const settings = readAnthropicSettings()
  if ('error' in settings) return json({ error: settings.error }, 503)

  const config = await repository.getConfig()
  if (!config?.lockedAt) {
    return json({ error: 'Lock the original obligation before recording transactions.' }, 409)
  }

  const outcome = await analyzeEvidence(
    {
      imageBase64: buffer.toString('base64'),
      mimeType: validation.mimeType,
      instruction,
      context: await buildAnalysisContext(repository),
    },
    settings
  )

  // Any outcome other than a clean proposal stops here. No evidence row, no
  // transaction, no change of any kind.
  if (outcome.status === 'ERROR') return json({ status: 'ERROR', error: outcome.message }, 502)
  if (outcome.status === 'CONFLICT') {
    return json(
      {
        status: 'CONFLICT',
        message: outcome.message,
        conflict: outcome.conflict,
        observations: outcome.observations,
      },
      200
    )
  }
  if (outcome.status === 'AMBIGUOUS') {
    return json(
      { status: 'AMBIGUOUS', message: outcome.message, observations: outcome.observations },
      200
    )
  }

  const transactions = await repository.listTransactions()
  let preview
  try {
    preview = prepareRecord(config, transactions, {
      type: outcome.proposal.type,
      date: outcome.proposal.date,
      amountCents: outcome.proposal.amountCents,
      reason: outcome.proposal.reason,
      originalInstruction: instruction,
      requiredRepaymentCents: outcome.proposal.requiredRepaymentCents ?? null,
      linkedTransactionCode: outcome.proposal.linkedTransactionCode ?? null,
      baseEffectCents: outcome.proposal.baseEffectCents ?? null,
      correctsTransactionCode: outcome.proposal.correctsTransactionCode ?? null,
      // Placeholder: the real evidence id is attached below, after the
      // proposal has proven itself valid.
      evidenceId: 'pending',
    })
  } catch (error) {
    if (error instanceof LedgerRuleError) {
      return json({ status: 'REJECTED', error: error.message, code: error.code }, 200)
    }
    throw error
  }

  // Only now — with a valid, confident, rule-passing proposal — is the
  // screenshot persisted so the owner can confirm it.
  const evidence = await repository.createEvidence({
    data: validation.data,
    mimeType: validation.mimeType,
    byteSize: validation.byteSize,
    sha256: validation.sha256,
  })

  return json({
    status: 'PROPOSAL',
    evidence: { id: evidence.id, mimeType: evidence.mimeType, byteSize: evidence.byteSize },
    observations: outcome.proposal.observations,
    proposal: {
      type: outcome.proposal.type,
      date: outcome.proposal.date,
      amountCents: outcome.proposal.amountCents,
      reason: outcome.proposal.reason,
      requiredRepaymentCents: outcome.proposal.requiredRepaymentCents ?? null,
      linkedTransactionCode: outcome.proposal.linkedTransactionCode ?? null,
      baseEffectCents: outcome.proposal.baseEffectCents ?? null,
      correctsTransactionCode: outcome.proposal.correctsTransactionCode ?? null,
      originalInstruction: instruction,
    },
    preview: {
      transactionCode: preview.record.transactionCode,
      withdrawalPrincipalCents: preview.record.withdrawalPrincipalCents,
      extraRepaymentCents: preview.record.extraRepaymentCents,
      requiredRepaymentCents: preview.record.requiredRepaymentCents,
      baseEffectCents: preview.record.baseEffectCents,
      linkedWithdrawalCode: preview.linkedWithdrawalCode,
      summaryBefore: preview.summaryBefore,
      summaryAfter: preview.summaryAfter,
      affectedWithdrawalBefore: preview.affectedWithdrawalBefore,
      affectedWithdrawalAfter: preview.affectedWithdrawalAfter,
    },
  })
}

/* --------------------------------------------------------- apply record -- */

async function handleApplyRecordImpl(
  request: NextRequest,
  repository: LedgerRepository
): Promise<NextResponse> {
  const role = requireRole(request)
  if (!role) return unauthorized()
  if (!canWriteFinancialRecords(role)) return forbidden()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  const parsed = applyRecordSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.issues[0]?.message ?? 'Invalid record.' }, 400)
  }

  const config = await repository.getConfig()
  if (!config?.lockedAt) {
    return json({ error: 'Lock the original obligation before recording transactions.' }, 409)
  }

  const evidence = await repository.getEvidenceMeta(parsed.data.evidenceId)
  if (!evidence) {
    return json({ error: 'The attached evidence could not be found. Re-run the analysis.' }, 400)
  }

  const transactions = await repository.listTransactions()

  // Recomputed server side from the stored history — the values the browser
  // posted are inputs, never results.
  let preview
  try {
    preview = prepareRecord(config, transactions, {
      type: parsed.data.type,
      date: parsed.data.date,
      amountCents: parsed.data.amountCents,
      reason: parsed.data.reason,
      originalInstruction: parsed.data.originalInstruction ?? null,
      requiredRepaymentCents: parsed.data.requiredRepaymentCents ?? null,
      linkedTransactionCode: parsed.data.linkedTransactionCode ?? null,
      baseEffectCents: parsed.data.baseEffectCents ?? null,
      correctsTransactionCode: parsed.data.correctsTransactionCode ?? null,
      evidenceId: evidence.id,
    })
  } catch (error) {
    if (error instanceof LedgerRuleError) {
      return json({ error: error.message, code: error.code }, 400)
    }
    throw error
  }

  try {
    const applied = await repository.appendTransaction(preview.record)
    return json({ transaction: applied, summary: preview.summaryAfter }, 201)
  } catch (error) {
    if (error instanceof LedgerConflictError) return json({ error: error.message }, 409)
    throw error
  }
}

/* ---------------------------------------------------------------- notes -- */

async function handleCreateNoteImpl(
  request: NextRequest,
  repository: LedgerRepository
): Promise<NextResponse> {
  const role = requireRole(request)
  if (!role) return unauthorized()
  if (!canWriteNotes(role)) return forbidden('You cannot write notes.')

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  const parsed = noteSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.issues[0]?.message ?? 'Invalid note.' }, 400)
  }

  if (parsed.data.transactionId) {
    const transactions = await repository.listTransactions()
    if (!transactions.some((tx) => tx.id === parsed.data.transactionId)) {
      return json({ error: 'That transaction does not exist.' }, 400)
    }
  }

  // Notes are append-only commentary. They never touch a financial value.
  const note = await repository.createNote({
    transactionId: parsed.data.transactionId ?? null,
    authorRole: role,
    body: parsed.data.body.trim(),
  })
  return json({ note }, 201)
}

async function handleResolveNoteImpl(
  request: NextRequest,
  repository: LedgerRepository
): Promise<NextResponse> {
  const role = requireRole(request)
  if (!role) return unauthorized()
  if (!canResolveNotes(role)) return forbidden('Only the owner can resolve a discussion.')

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  const parsed = resolveNoteSchema.safeParse(body)
  if (!parsed.success) return json({ error: 'A note id is required.' }, 400)

  const note = await repository.resolveNote(parsed.data.noteId)
  if (!note) return json({ error: 'That note does not exist.' }, 404)
  return json({ note })
}

/* ------------------------------------------------------------- evidence -- */

async function handleGetEvidenceImpl(
  request: NextRequest,
  repository: LedgerRepository,
  evidenceId: string
): Promise<NextResponse> {
  const role = requireRole(request)
  if (!role) return unauthorized()
  if (!canViewEvidence(role)) return forbidden('You cannot view evidence.')

  const evidence = await repository.getEvidence(evidenceId)
  if (!evidence) return json({ error: 'Evidence not found.' }, 404)

  return new NextResponse(new Uint8Array(evidence.data), {
    status: 200,
    headers: {
      'content-type': evidence.mimeType,
      'content-length': String(evidence.byteSize),
      'content-disposition': `inline; filename="${evidence.id}"`,
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  })
}

/* ------------------------------------------------------------ integrity -- */

async function handleIntegrityCheckImpl(
  request: NextRequest,
  repository: LedgerRepository
): Promise<NextResponse> {
  const role = requireRole(request)
  if (!role) return unauthorized()

  const transactions = await repository.listTransactions()
  return json(verifyChain(transactions))
}


/* ---------------------------------------------------- guarded exports -- */

export function handleLockObligation(request: NextRequest, repository: LedgerRepository) {
  return guardDatabase(() => handleLockObligationImpl(request, repository))
}

export function handleAnalyze(request: NextRequest, repository: LedgerRepository) {
  return guardDatabase(() => handleAnalyzeImpl(request, repository))
}

export function handleApplyRecord(request: NextRequest, repository: LedgerRepository) {
  return guardDatabase(() => handleApplyRecordImpl(request, repository))
}

export function handleCreateNote(request: NextRequest, repository: LedgerRepository) {
  return guardDatabase(() => handleCreateNoteImpl(request, repository))
}

export function handleResolveNote(request: NextRequest, repository: LedgerRepository) {
  return guardDatabase(() => handleResolveNoteImpl(request, repository))
}

export function handleGetEvidence(
  request: NextRequest,
  repository: LedgerRepository,
  evidenceId: string
) {
  return guardDatabase(() => handleGetEvidenceImpl(request, repository, evidenceId))
}

export function handleIntegrityCheck(request: NextRequest, repository: LedgerRepository) {
  return guardDatabase(() => handleIntegrityCheckImpl(request, repository))
}

/* -------------------------------------------------------------- helpers -- */

export const DEFAULT_OBLIGATION_CENTS = DEFAULT_ORIGINAL_OBLIGATION_CENTS
