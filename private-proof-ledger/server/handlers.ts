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
import { readAuthConfig } from '../auth/config'
import {
  authenticatePassword,
  canChangePasswords,
  canControlViewerAccess,
  canResolveNotes,
  canViewEvidence,
  canWriteFinancialRecords,
  canWriteNotes,
  changePassword,
  ensureCredentialsSeeded,
  isViewerAccessEnabled,
  MIN_PASSWORD_LENGTH,
  setViewerAccessEnabled,
} from '../auth/credentials'
import {
  PROPOSAL_TTL_MS,
  resolveProposalSecret,
  signProposal,
  verifyProposal,
} from '../auth/proposal-token'
import { clearLoginAttempts, registerLoginAttempt } from '../auth/rate-limit'
import {
  createSessionToken,
  LEDGER_SESSION_COOKIE,
  sessionCookieOptions,
} from '../auth/session'
import { LedgerDatabaseNotConfiguredError } from '../database/client'
import { LedgerConflictError, LedgerRepository } from '../database/repository'
import { LedgerRuleError, prepareRecord } from '../ledger/apply'
import { computeWithdrawalViews } from '../ledger/engine'
import { headHash, sha256Hex, verifyLedgerIntegrity } from '../ledger/hash-chain'
import {
  DEFAULT_ORIGINAL_OBLIGATION_CENTS,
  LedgerRole,
} from '../ledger/types'
import {
  applyRecordSchema,
  changePasswordSchema,
  lockObligationSchema,
  loginSchema,
  noteSchema,
  resolveNoteSchema,
  viewerAccessSchema,
} from '../schemas/proposal'
import { EVIDENCE_PENDING_TTL_MS, isAiReadableMimeType, validateEvidence } from './evidence'
import { normalizeEvidenceForAi } from './image-normalize'
import { getLedgerSessionFromRequest } from './session'

const NO_STORE = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' }

type AiReadableImage = { data: Buffer; mimeType: string; byteSize: number }

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
  const code =
    (error as { errorCode?: string }).errorCode ?? (error as { code?: string }).code
  return typeof code === 'string' && /^P1\d{3}$/.test(code)
}

async function guardDatabase(run: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await run()
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      // Class and Prisma code only: initialization messages can embed the
      // datasource URL, so the message itself is never logged.
      const name = (error as { name?: string })?.name ?? 'UnknownError'
      const code = (error as { errorCode?: string })?.errorCode ?? 'none'
      console.error(`[proof-ledger] database unavailable: ${name} code=${code}`)
      return json(
        { error: 'The ledger database is not reachable. No change has been made.' },
        503
      )
    }
    throw error
  }
}

async function requireRole(
  request: NextRequest,
  repository: LedgerRepository
): Promise<LedgerRole | null> {
  const session = await getLedgerSessionFromRequest(request, repository)
  return session?.role ?? null
}

function clientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

async function readJson(request: NextRequest): Promise<unknown | undefined> {
  try {
    return await request.json()
  } catch {
    return undefined
  }
}

/* -------------------------------------------------------------- session -- */

async function handleLoginImpl(
  request: NextRequest,
  repository: LedgerRepository
): Promise<NextResponse> {
  const body = await readJson(request)
  if (body === undefined) return json({ error: 'Invalid request.' }, 400)

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
  const result = await authenticatePassword(parsed.data.password, repository, config)

  if (!result.ok) {
    if (result.reason === 'VIEWER_ACCESS_DISABLED') {
      return json({ error: 'Viewer access is currently disabled by the owner.' }, 403)
    }
    // The same message for both remaining cases: never reveal which role a
    // password nearly matched, or whether the server is configured.
    return json({ error: 'That password was not recognised.' }, 401)
  }

  clearLoginAttempts(identifier)
  const token = createSessionToken(
    result.role,
    result.credentialVersion,
    config.sessionSecret as string
  )
  const response = json({ role: result.role })
  response.cookies.set(
    LEDGER_SESSION_COOKIE,
    token,
    sessionCookieOptions(config.isProduction, result.role)
  )
  return response
}

export async function handleLogout(): Promise<NextResponse> {
  const response = json({ ok: true })
  response.cookies.set(LEDGER_SESSION_COOKIE, '', {
    ...sessionCookieOptions(readAuthConfig().isProduction, 'OWNER'),
    maxAge: 0,
  })
  return response
}

/* ----------------------------------------------------------- obligation -- */

async function handleLockObligationImpl(
  request: NextRequest,
  repository: LedgerRepository
): Promise<NextResponse> {
  const role = await requireRole(request, repository)
  if (!role) return unauthorized()
  if (!canWriteFinancialRecords(role)) return forbidden()

  const body = await readJson(request)
  if (body === undefined) return json({ error: 'Invalid request.' }, 400)

  // The opening obligation for this ledger is fixed at CAD $36,000.00. The
  // schema accepts that single value and nothing else — the browser cannot
  // propose a different one.
  const parsed = lockObligationSchema.safeParse(body)
  if (!parsed.success) {
    return json(
      {
        error: 'The opening obligation for this ledger is fixed at CAD $36,000.00.',
        expectedCents: DEFAULT_ORIGINAL_OBLIGATION_CENTS,
      },
      400
    )
  }

  try {
    const config = await repository.lockConfig(DEFAULT_ORIGINAL_OBLIGATION_CENTS)
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

function analysisServiceErrorMessage(providerStatus?: number): string {
  if (providerStatus === 400) {
    return (
      'This proof image could not be read by the analysis service. Try a smaller ' +
      'JPG, PNG or WebP screenshot. Nothing has been recorded.'
    )
  }
  return 'The analysis service could not complete this request. Nothing has been recorded.'
}

function logAnalysisServiceError(
  providerStatus: number | undefined,
  validation: { mimeType: string; byteSize: number },
  aiImage?: { mimeType: string; byteSize: number }
): void {
  const status = providerStatus ?? 'none'
  const aiDetail = aiImage ? ` aiMime=${aiImage.mimeType} aiBytes=${aiImage.byteSize}` : ''
  console.error(
    `[proof-ledger] analysis service rejected proof: status=${status} mime=${validation.mimeType} bytes=${validation.byteSize}${aiDetail}`
  )
}

/**
 * Analyse a screenshot plus an instruction and return the record that WOULD be
 * applied, together with a server-signed token binding that exact proposal.
 *
 * Nothing is written unless the analysis produces a confident, conflict-free
 * proposal that also survives the deterministic ledger rules.
 */
async function handleAnalyzeImpl(
  request: NextRequest,
  repository: LedgerRepository
): Promise<NextResponse> {
  const role = await requireRole(request, repository)
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

  let aiImage: AiReadableImage
  try {
    aiImage = await normalizeEvidenceForAi(validation.data)
  } catch {
    if (!isAiReadableMimeType(validation.mimeType)) {
      return json(
        { error: 'Please upload a JPG, PNG or WebP screenshot so it can be read.' },
        400
      )
    }
    aiImage = {
      data: validation.data,
      mimeType: validation.mimeType,
      byteSize: validation.byteSize,
    }
  }

  if (!isAiReadableMimeType(aiImage.mimeType)) {
    return json(
      { error: 'Please upload a JPG, PNG or WebP screenshot so it can be read.' },
      400
    )
  }

  const proposalSecret = resolveProposalSecret()
  if (!proposalSecret) {
    return json({ error: 'The ledger signing secret is not configured on the server.' }, 503)
  }

  const settings = readAnthropicSettings()
  if ('error' in settings) return json({ error: settings.error }, 503)

  const config = await repository.getConfig()
  if (!config?.lockedAt) {
    return json({ error: 'Lock the original obligation before recording transactions.' }, 409)
  }

  // Opportunistic cleanup of screenshots from analyses that were never
  // applied. Applied evidence is never touched.
  await repository.purgeExpiredPendingEvidence()

  const outcome = await analyzeEvidence(
    {
      imageBase64: aiImage.data.toString('base64'),
      mimeType: aiImage.mimeType,
      instruction,
      context: await buildAnalysisContext(repository),
    },
    settings
  )

  // Any outcome other than a clean proposal stops here. No evidence row, no
  // transaction, no change of any kind.
  if (outcome.status === 'ERROR') {
    logAnalysisServiceError(outcome.providerStatus, validation, aiImage)
    return json(
      { status: 'ERROR', error: analysisServiceErrorMessage(outcome.providerStatus) },
      502
    )
  }
  if (outcome.status === 'CONFLICT') {
    return json({
      status: 'CONFLICT',
      message: outcome.message,
      conflict: outcome.conflict,
      observations: outcome.observations,
    })
  }
  if (outcome.status === 'AMBIGUOUS') {
    return json({
      status: 'AMBIGUOUS',
      message: outcome.message,
      observations: outcome.observations,
    })
  }

  const transactions = await repository.listTransactions()
  const proposal = outcome.proposal

  // Dry run against the real history before anything is stored.
  let preview
  try {
    preview = prepareRecord(config, transactions, {
      type: proposal.type,
      date: proposal.date,
      amountCents: proposal.amountCents,
      reason: proposal.reason,
      originalInstruction: instruction,
      requiredRepaymentCents: proposal.requiredRepaymentCents ?? null,
      linkedTransactionCode: proposal.linkedTransactionCode ?? null,
      adjustmentScope: proposal.adjustmentScope ?? null,
      adjustmentEffectCents: proposal.adjustmentEffectCents ?? null,
      correctsTransactionCode: proposal.correctsTransactionCode ?? null,
      evidenceId: 'pending',
      evidenceSha256: validation.sha256,
    })
  } catch (error) {
    if (error instanceof LedgerRuleError) {
      return json({ status: 'REJECTED', error: error.message, code: error.code })
    }
    throw error
  }

  // Only now — with a valid, confident, rule-passing proposal — is the
  // screenshot persisted, as PENDING, so the owner can confirm it.
  const evidence = await repository.createEvidence({
    data: validation.data,
    mimeType: validation.mimeType,
    byteSize: validation.byteSize,
    sha256: validation.sha256,
    expiresAt: new Date(Date.now() + EVIDENCE_PENDING_TTL_MS),
  })

  // The signature covers every transaction fact plus the evidence hash, the
  // instruction hash and the current chain head. "Apply Record" sends only
  // this token, so nothing can be substituted afterwards.
  const proposalToken = signProposal(
    {
      type: proposal.type,
      date: proposal.date,
      amountCents: proposal.amountCents,
      reason: proposal.reason,
      requiredRepaymentCents: proposal.requiredRepaymentCents ?? null,
      linkedTransactionCode: proposal.linkedTransactionCode ?? null,
      adjustmentScope: proposal.adjustmentScope ?? null,
      adjustmentEffectCents: proposal.adjustmentEffectCents ?? null,
      correctsTransactionCode: proposal.correctsTransactionCode ?? null,
      evidenceId: evidence.id,
      evidenceSha256: validation.sha256,
      originalInstruction: instruction,
      instructionSha256: preview.record.instructionSha256 as string,
      ledgerHeadHash: headHash(transactions),
    },
    proposalSecret
  )

  return json({
    status: 'PROPOSAL',
    proposalToken,
    expiresInSeconds: Math.floor(PROPOSAL_TTL_MS / 1000),
    evidence: { id: evidence.id, mimeType: evidence.mimeType, byteSize: evidence.byteSize },
    observations: proposal.observations,
    // Display only. None of this is trusted on the way back in.
    proposal: {
      type: proposal.type,
      date: proposal.date,
      amountCents: proposal.amountCents,
      reason: preview.record.reason,
    },
    preview: {
      transactionCode: preview.record.transactionCode,
      withdrawalPrincipalCents: preview.record.withdrawalPrincipalCents,
      extraRepaymentCents: preview.record.extraRepaymentCents,
      requiredRepaymentCents: preview.record.requiredRepaymentCents,
      baseEffectCents: preview.record.baseEffectCents,
      adjustmentScope: preview.record.adjustmentScope,
      adjustmentEffectCents: preview.record.adjustmentEffectCents,
      linkedWithdrawalCode: preview.linkedWithdrawalCode,
      correctsTransactionCode: preview.correctsTransactionCode,
      summaryBefore: preview.summaryBefore,
      summaryAfter: preview.summaryAfter,
      affectedWithdrawalBefore: preview.affectedWithdrawalBefore,
      affectedWithdrawalAfter: preview.affectedWithdrawalAfter,
    },
  })
}

/* --------------------------------------------------------- apply record -- */

/**
 * Apply the exact proposal the server signed.
 *
 * The request carries no transaction facts of its own — only the token and an
 * explicit confirmation — so there is nothing for a modified browser request
 * to alter.
 */
async function handleApplyRecordImpl(
  request: NextRequest,
  repository: LedgerRepository
): Promise<NextResponse> {
  const role = await requireRole(request, repository)
  if (!role) return unauthorized()
  if (!canWriteFinancialRecords(role)) return forbidden()

  const body = await readJson(request)
  if (body === undefined) return json({ error: 'Invalid request.' }, 400)

  const parsed = applyRecordSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: 'Confirm the analysed proposal before applying it.' }, 400)
  }

  const proposalSecret = resolveProposalSecret()
  if (!proposalSecret) {
    return json({ error: 'The ledger signing secret is not configured on the server.' }, 503)
  }

  const verification = verifyProposal(parsed.data.proposalToken, proposalSecret)
  if (!verification.ok) {
    const message =
      verification.reason === 'EXPIRED'
        ? 'That proposal has expired. Re-run the analysis.'
        : 'That proposal could not be verified. Re-run the analysis.'
    return json({ error: message, code: verification.reason }, 400)
  }
  const signed = verification.payload

  const config = await repository.getConfig()
  if (!config?.lockedAt) {
    return json({ error: 'Lock the original obligation before recording transactions.' }, 409)
  }

  const transactions = await repository.listTransactions()

  // The chain must not have moved since the proposal was issued. This also
  // makes a replayed token fail after the first successful apply.
  if ((signed.ledgerHeadHash ?? null) !== headHash(transactions)) {
    return json(
      {
        error: 'The ledger changed after this proposal was analysed. Re-run the analysis.',
        code: 'CHAIN_MOVED',
      },
      409
    )
  }

  // The screenshot must still exist and still be the same bytes. The stored
  // hash column is not trusted here — the bytes themselves are re-hashed, so
  // a direct database swap of the image is caught before anything is written.
  const evidence = await repository.getEvidence(signed.evidenceId)
  if (!evidence) {
    return json({ error: 'The attached evidence could not be found. Re-run the analysis.' }, 400)
  }
  if (sha256Hex(evidence.data) !== signed.evidenceSha256) {
    return json(
      { error: 'The attached evidence changed after analysis.', code: 'EVIDENCE_HASH_MISMATCH' },
      400
    )
  }

  // Rebuild the record deterministically from the signed proposal alone.
  let preview
  try {
    preview = prepareRecord(config, transactions, {
      type: signed.type,
      date: signed.date,
      amountCents: signed.amountCents,
      reason: signed.reason,
      originalInstruction: signed.originalInstruction,
      requiredRepaymentCents: signed.requiredRepaymentCents,
      linkedTransactionCode: signed.linkedTransactionCode,
      adjustmentScope: signed.adjustmentScope,
      adjustmentEffectCents: signed.adjustmentEffectCents,
      correctsTransactionCode: signed.correctsTransactionCode,
      evidenceId: evidence.id,
      evidenceSha256: signed.evidenceSha256,
    })
  } catch (error) {
    if (error instanceof LedgerRuleError) {
      return json({ error: error.message, code: error.code }, 400)
    }
    throw error
  }

  // Defence in depth: the instruction that was hashed at analysis time must be
  // the one now being written, and the record hash must already cover it.
  if (preview.record.instructionSha256 !== signed.instructionSha256) {
    return json(
      { error: 'The instruction changed after analysis.', code: 'INSTRUCTION_HASH_MISMATCH' },
      400
    )
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
  const role = await requireRole(request, repository)
  if (!role) return unauthorized()
  if (!canWriteNotes(role)) return forbidden('You cannot write notes.')

  const body = await readJson(request)
  if (body === undefined) return json({ error: 'Invalid request.' }, 400)

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
  const role = await requireRole(request, repository)
  if (!role) return unauthorized()
  if (!canResolveNotes(role)) return forbidden('Only the owner can resolve a discussion.')

  const body = await readJson(request)
  if (body === undefined) return json({ error: 'Invalid request.' }, 400)

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
  const role = await requireRole(request, repository)
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
  const role = await requireRole(request, repository)
  if (!role) return unauthorized()

  const transactions = await repository.listTransactions()
  const result = await verifyLedgerIntegrity(transactions, (id) => repository.getEvidence(id))
  return json(result)
}

/* ------------------------------------------------------------- settings -- */

async function handleChangePasswordImpl(
  request: NextRequest,
  repository: LedgerRepository
): Promise<NextResponse> {
  const role = await requireRole(request, repository)
  if (!role) return unauthorized()
  // Enforced on the server, not merely hidden in the viewer's interface.
  if (!canChangePasswords(role)) {
    return forbidden('Password changes are controlled by the ledger owner.')
  }

  const body = await readJson(request)
  if (body === undefined) return json({ error: 'Invalid request.' }, 400)

  const parsed = changePasswordSchema.safeParse(body)
  if (!parsed.success) return json({ error: 'Invalid password change request.' }, 400)

  const identifier = clientIdentifier(request)
  const throttle = registerLoginAttempt(identifier)
  if (throttle.limited) {
    return json({ error: 'Too many attempts. Try again later.' }, 429)
  }

  const result = await changePassword(repository, parsed.data)
  if (!result.ok) {
    if (result.reason === 'TOO_SHORT') {
      return json(
        { error: `A password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
        400
      )
    }
    if (result.reason === 'SAME_PASSWORD') {
      return json({ error: 'That is already the current password.' }, 400)
    }
    if (result.reason === 'NOT_CONFIGURED') {
      return json({ error: 'No owner credential is configured yet.' }, 503)
    }
    return json({ error: 'The current owner password is not correct.' }, 403)
  }

  clearLoginAttempts(identifier)
  const response = json({ ok: true, role: result.role })

  if (result.role === 'OWNER') {
    // Every other owner device is now signed out. Re-issue this one against
    // the new credential version so the person changing it stays logged in.
    const config = readAuthConfig()
    const token = createSessionToken(
      'OWNER',
      result.credentialVersion,
      config.sessionSecret as string
    )
    response.cookies.set(
      LEDGER_SESSION_COOKIE,
      token,
      sessionCookieOptions(config.isProduction, 'OWNER')
    )
  }

  return response
}

async function handleViewerAccessImpl(
  request: NextRequest,
  repository: LedgerRepository
): Promise<NextResponse> {
  const role = await requireRole(request, repository)
  if (!role) return unauthorized()
  if (!canControlViewerAccess(role)) {
    return forbidden('Viewer access is managed by the ledger owner.')
  }

  const body = await readJson(request)
  if (body === undefined) return json({ error: 'Invalid request.' }, 400)

  const parsed = viewerAccessSchema.safeParse(body)
  if (!parsed.success) return json({ error: 'Invalid request.' }, 400)

  await setViewerAccessEnabled(repository, parsed.data.enabled)
  return json({ viewerAccessEnabled: parsed.data.enabled })
}

/** Non-sensitive status for the Settings screen. Never returns a secret. */
async function handleSettingsStatusImpl(
  request: NextRequest,
  repository: LedgerRepository
): Promise<NextResponse> {
  const session = await getLedgerSessionFromRequest(request, repository)
  if (!session) return unauthorized()

  const authConfig = readAuthConfig()
  await ensureCredentialsSeeded(repository, authConfig)

  const [owner, viewer, viewerAccessEnabled, transactions] = await Promise.all([
    repository.getCredential('OWNER'),
    repository.getCredential('VIEWER'),
    isViewerAccessEnabled(repository),
    repository.listTransactions(),
  ])

  const integrity = await verifyLedgerIntegrity(transactions, (id) =>
    repository.getEvidence(id)
  )

  return json({
    role: session.role,
    sessionExpiresAt: new Date(session.expiresAt).toISOString(),
    viewerAccessEnabled,
    ownerPasswordUpdatedAt: owner?.updatedAt ?? null,
    viewerPasswordUpdatedAt: session.role === 'OWNER' ? viewer?.updatedAt ?? null : null,
    databaseConnected: true,
    aiConfigured: !('error' in readAnthropicSettings()),
    integrityOk: integrity.ok,
    integrityCheckedRecords: integrity.checkedRecords,
    integrityEvidenceChecked: integrity.evidenceChecked,
    minPasswordLength: MIN_PASSWORD_LENGTH,
  })
}

/* ---------------------------------------------------- guarded exports -- */

export function handleLogin(request: NextRequest, repository: LedgerRepository) {
  return guardDatabase(() => handleLoginImpl(request, repository))
}

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

export function handleChangePassword(request: NextRequest, repository: LedgerRepository) {
  return guardDatabase(() => handleChangePasswordImpl(request, repository))
}

export function handleViewerAccess(request: NextRequest, repository: LedgerRepository) {
  return guardDatabase(() => handleViewerAccessImpl(request, repository))
}

export function handleSettingsStatus(request: NextRequest, repository: LedgerRepository) {
  return guardDatabase(() => handleSettingsStatusImpl(request, repository))
}
