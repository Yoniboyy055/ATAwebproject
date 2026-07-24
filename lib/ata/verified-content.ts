import { z } from 'zod'
export const ContentReviewState = z.enum(['SUBMITTED','UNDER_REVIEW','VERIFIED','APPROVED','REJECTED','EXPIRED','SUPERSEDED','PUBLICATION_BLOCKED'])
export const PublicationState = z.enum(['PRIVATE','APPROVED_FOR_PUBLICATION','PUBLISHED','WITHDRAWN'])
export const VerifiedContentItem = z.object({
  id:z.string().min(1), category:z.string().min(1), submittedValue:z.string().min(1),
  source:z.string().min(1), sourceType:z.string().min(1), submittedBy:z.string().min(1),
  submittedAt:z.string().datetime(), reviewState:ContentReviewState,
  verificationNotes:z.string().nullable(), verifiedBy:z.string().nullable(), verifiedAt:z.string().datetime().nullable(),
  approvedBy:z.string().nullable(), approvedAt:z.string().datetime().nullable(),
  publicationState:PublicationState, reviewAt:z.string().datetime().nullable(),
  evidenceFileId:z.string().nullable(), version:z.number().int().positive(), replacementId:z.string().nullable(),
})
export type VerifiedContent = z.infer<typeof VerifiedContentItem>
export function mayPublish(item: VerifiedContent) {
  return item.reviewState === 'VERIFIED' && item.publicationState === 'APPROVED_FOR_PUBLICATION'
}
