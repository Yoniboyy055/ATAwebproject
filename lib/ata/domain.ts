import { z } from 'zod'

export const TourPublicationStateSchema = z.enum([
  'DRAFT',
  'IN_REVIEW',
  'APPROVED',
  'PUBLISHED',
  'SUSPENDED',
  'ARCHIVED',
])

export const EvidenceStatusSchema = z.enum([
  'UNVERIFIED',
  'OWNER_PROVIDED',
  'DOCUMENT_VERIFIED',
  'APPROVED_FOR_PUBLICATION',
  'REJECTED',
])

export const EvidenceRefSchema = z.object({
  sourceId: z.string().min(1),
  sourceUrl: z.string().url().nullable(),
  status: EvidenceStatusSchema,
  checkedAt: z.string().datetime().nullable(),
  checkedBy: z.string().nullable(),
  note: z.string().max(1000).nullable(),
})

export const VerifiedTextSchema = z.object({
  value: z.string().nullable(),
  public: z.boolean().default(false),
  evidence: z.array(EvidenceRefSchema).default([]),
})

export const TourDaySchema = z.object({
  dayNumber: z.number().int().positive(),
  title: VerifiedTextSchema,
  summary: VerifiedTextSchema,
})

export const TourDomainSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  workingTitle: z.string().min(1),
  publicationState: TourPublicationStateSchema,
  title: VerifiedTextSchema,
  summary: VerifiedTextSchema,
  duration: VerifiedTextSchema,
  priceDisplay: VerifiedTextSchema,
  availabilityNote: VerifiedTextSchema,
  itinerary: z.array(TourDaySchema).default([]),
  inclusions: z.array(VerifiedTextSchema).default([]),
  exclusions: z.array(VerifiedTextSchema).default([]),
  sourceIds: z.array(z.string()).default([]),
  updatedAt: z.string().datetime(),
})

export const RequestTypeSchema = z.enum([
  'INFORMATION',
  'CONSULTATION',
  'QUOTE',
  'BOOKING_REQUEST',
  'PROVISIONAL_RESERVATION',
])

export const RequestStatusSchema = z.enum([
  'NEW',
  'CONTACTED',
  'AWAITING_CUSTOMER',
  'PROVISIONAL',
  'CONFIRMED_OUTSIDE_SYSTEM',
  'CLOSED',
  'CANCELLED',
])

export const CustomerRequestInputSchema = z.object({
  type: RequestTypeSchema,
  tourId: z.string().min(1).nullable(),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(40),
  travelerCount: z.number().int().min(1).max(30).nullable(),
  preferredDate: z.string().date().nullable(),
  preferredContact: z.enum(['EMAIL', 'PHONE', 'WHATSAPP']),
  message: z.string().trim().max(2000).nullable(),
  consentAccepted: z.literal(true),
  consentVersion: z.literal('wp03c-preview-v1'),
  website: z.string().max(0).optional(),
})

export const CustomerRequestReceiptSchema = z.object({
  requestId: z.string().min(1),
  status: z.literal('SUBMITTED'),
  testOnly: z.literal(true),
  message: z.literal(
    'Your request has been received. This is not a confirmed booking, reservation, seat, price, or payment. A person at ATA will review it and reply on your chosen channel.'
  ),
})

export type TourDomain = z.infer<typeof TourDomainSchema>
export type CustomerRequestInput = z.infer<typeof CustomerRequestInputSchema>
export type CustomerRequestReceipt = z.infer<typeof CustomerRequestReceiptSchema>

export function publicVerifiedValue(field: z.infer<typeof VerifiedTextSchema>) {
  if (!field.public || field.value === null) return null
  const approved = field.evidence.some(
    (item) => item.status === 'APPROVED_FOR_PUBLICATION'
  )
  return approved ? field.value : null
}

