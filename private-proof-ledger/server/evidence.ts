/**
 * Proof Ledger — evidence intake rules.
 *
 * Screenshots are the proof behind every financial record. They are accepted
 * only as images, only up to a fixed size, are fingerprinted with SHA-256 and
 * are stored in the private ledger database — never in git and never behind a
 * public URL.
 */

import { createHash } from 'crypto'

export const ALLOWED_EVIDENCE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/heic',
  'image/heif',
] as const

export const MAX_EVIDENCE_BYTES = 8 * 1024 * 1024

export type EvidenceRejection =
  | { ok: false; code: 'MISSING'; message: string }
  | { ok: false; code: 'UNSUPPORTED_TYPE'; message: string }
  | { ok: false; code: 'TOO_LARGE'; message: string }
  | { ok: false; code: 'EMPTY'; message: string }

export type EvidenceValidation =
  | { ok: true; data: Buffer; mimeType: string; byteSize: number; sha256: string }
  | EvidenceRejection

export function sha256Hex(data: Buffer): string {
  return createHash('sha256').update(data).digest('hex')
}

export function validateEvidence(
  data: Buffer | null | undefined,
  rawMimeType: string | null | undefined
): EvidenceValidation {
  if (!data) {
    return { ok: false, code: 'MISSING', message: 'A screenshot is required for every record.' }
  }
  if (data.byteLength === 0) {
    return { ok: false, code: 'EMPTY', message: 'The uploaded file is empty.' }
  }
  if (data.byteLength > MAX_EVIDENCE_BYTES) {
    return {
      ok: false,
      code: 'TOO_LARGE',
      message: `Screenshots must be ${Math.floor(MAX_EVIDENCE_BYTES / (1024 * 1024))} MB or smaller.`,
    }
  }

  const mimeType = (rawMimeType ?? '').split(';')[0].trim().toLowerCase()
  if (!(ALLOWED_EVIDENCE_MIME_TYPES as readonly string[]).includes(mimeType)) {
    return {
      ok: false,
      code: 'UNSUPPORTED_TYPE',
      message: 'Only PNG, JPEG, WebP or HEIC images are accepted as evidence.',
    }
  }

  return {
    ok: true,
    data,
    mimeType,
    byteSize: data.byteLength,
    sha256: sha256Hex(data),
  }
}

/** Media types the Anthropic vision API accepts directly. */
const AI_READABLE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export function isAiReadableMimeType(mimeType: string): boolean {
  return AI_READABLE_MIME_TYPES.includes(mimeType)
}
