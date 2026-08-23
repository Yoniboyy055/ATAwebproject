/**
 * Proof Ledger — validation boundary.
 *
 * Everything crossing into the deterministic engine (AI output, owner form
 * input, HTTP bodies) is validated here first. Nothing untrusted reaches the
 * ledger without passing one of these schemas.
 */

import { z } from 'zod'

import { MAX_CENTS } from '../ledger/money'
import {
  ADJUSTMENT_SCOPES,
  DEFAULT_ORIGINAL_OBLIGATION_CENTS,
  TRANSACTION_TYPES,
} from '../ledger/types'

const centsSchema = z
  .number()
  .int('amounts must be integer cents')
  .min(-MAX_CENTS)
  .max(MAX_CENTS)

const nonNegativeCentsSchema = z
  .number()
  .int('amounts must be integer cents')
  .min(0)
  .max(MAX_CENTS)

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be ISO YYYY-MM-DD')
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), {
    message: 'date is not a real calendar date',
  })

const transactionCodeSchema = z
  .string()
  .regex(/^TX-\d{3,}$/, 'linked transaction must look like TX-001')

export const conflictSchema = z.object({
  field: z.string().min(1).max(120),
  screenshotValue: z.string().max(200),
  instructionValue: z.string().max(200),
  detail: z.string().max(600),
})

/**
 * The structured proposal the AI interpreter is allowed to return.
 *
 * Note what is absent: no balances, no totals, no status. AI proposes facts
 * about one transaction; the engine computes every consequence.
 */
export const aiProposalSchema = z.object({
  type: z.enum(TRANSACTION_TYPES),
  date: isoDateSchema,
  amountCents: nonNegativeCentsSchema,
  reason: z.string().min(1, 'a reason is required').max(500),
  /**
   * Only meaningful for WITHDRAWAL. When the owner explicitly stated a larger
   * repayment, the difference becomes Extra Repayment Added.
   */
  requiredRepaymentCents: nonNegativeCentsSchema.nullish(),
  /** Only meaningful for WITHDRAWAL_REPAYMENT. */
  linkedTransactionCode: transactionCodeSchema.nullish(),
  /** Only meaningful for ADJUSTMENT — what the correction applies to. */
  adjustmentScope: z.enum(ADJUSTMENT_SCOPES).nullish(),
  /** Only meaningful for ADJUSTMENT — signed correction in cents. */
  adjustmentEffectCents: centsSchema.nullish(),
  /** Only meaningful for ADJUSTMENT — the record being corrected. */
  correctsTransactionCode: transactionCodeSchema.nullish(),
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  /** Non-null when the screenshot and the instruction materially disagree. */
  conflict: conflictSchema.nullish(),
  observations: z.string().max(1200).default(''),
})

export type AiProposal = z.infer<typeof aiProposalSchema>

/**
 * What the owner finally confirms. Re-validated server side; the client is
 * never trusted to have preserved the analysed values.
 */
/**
 * What "Apply Record" sends.
 *
 * Deliberately minimal: the signed proposal token carries every transaction
 * fact, so the browser has nothing left to substitute.
 */
export const applyRecordSchema = z.object({
  proposalToken: z.string().min(1).max(16000),
  confirm: z.literal(true),
})

export type ApplyRecordInput = z.infer<typeof applyRecordSchema>

/**
 * The opening obligation for this ledger is fixed. The server accepts exactly
 * one value and nothing else, whatever the browser sends.
 */
export const lockObligationSchema = z.object({
  originalObligationCents: z.literal(DEFAULT_ORIGINAL_OBLIGATION_CENTS),
  confirm: z.literal(true),
})

export const changePasswordSchema = z.object({
  targetRole: z.enum(['OWNER', 'VIEWER']),
  currentOwnerPassword: z.string().min(1).max(512),
  newPassword: z.string().min(1).max(512),
})

export const viewerAccessSchema = z.object({
  enabled: z.boolean(),
})

export const noteSchema = z.object({
  transactionId: z.string().min(1).max(64).nullish(),
  body: z.string().min(1, 'a note cannot be empty').max(4000),
})

export const resolveNoteSchema = z.object({
  noteId: z.string().min(1).max(64),
})

export const loginSchema = z.object({
  password: z.string().min(1, 'password is required').max(512),
})
