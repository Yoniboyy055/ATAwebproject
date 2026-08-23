import { createHash } from 'crypto'

import { canonicalJson } from '../utils/canonical-json'

export interface EvidenceAttachment {
  evidenceId: string
  evidenceSha256: string
}

function sha256Hex(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex')
}

export function aggregateEvidenceSha256(
  attachments: readonly EvidenceAttachment[]
): string {
  if (attachments.length === 1) return attachments[0].evidenceSha256
  return sha256Hex(
    canonicalJson(
      attachments.map((item, index) => ({
        position: index,
        evidenceId: item.evidenceId,
        evidenceSha256: item.evidenceSha256,
      }))
    )
  )
}
