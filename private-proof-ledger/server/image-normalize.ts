/**
 * Proof Ledger — AI image normalization.
 *
 * The original upload remains the evidence of record. This module creates a
 * smaller, metadata-free JPEG copy only for the AI vision request.
 */

import sharp from 'sharp'

export interface AiImage {
  data: Buffer
  mimeType: 'image/jpeg'
  byteSize: number
}

export async function normalizeEvidenceForAi(data: Buffer): Promise<AiImage> {
  const normalized = await sharp(data, { failOn: 'none' })
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 82,
      mozjpeg: true,
    })
    .toBuffer()

  return {
    data: normalized,
    mimeType: 'image/jpeg',
    byteSize: normalized.byteLength,
  }
}
