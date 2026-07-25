import type { RequestStatus } from './workflow'

export const INTERNAL_REQUEST_STATUSES: readonly RequestStatus[] = [
  'DRAFT',
  'QUALIFIED',
  'ARCHIVED',
]

const warning =
  'This is not a confirmed booking, reservation, seat, price, or payment.'

export const CUSTOMER_STATUS_COPY: Record<RequestStatus, string | null> = {
  DRAFT: null,
  SUBMITTED: `Your request has been received. ${warning} A person at ATA will review it and reply on your chosen channel.`,
  UNDER_REVIEW: `ATA is reviewing your request. ${warning} A person at ATA will contact you.`,
  MORE_INFORMATION_REQUIRED: `ATA needs more information to continue. ${warning} Please reply on your chosen channel.`,
  QUALIFIED: null,
  QUOTE_PREPARATION: `ATA is preparing your personal quote. ${warning}`,
  QUOTE_SENT: `ATA has sent your personal quote. ${warning} Review it and reply directly to ATA.`,
  CUSTOMER_RESPONSE_PENDING: `ATA is waiting for your reply. ${warning}`,
  ACCEPTED_IN_PRINCIPLE: `You and ATA have agreed in principle. ${warning} ATA will confirm final details with you directly.`,
  PAYMENT_PENDING: `ATA will arrange any payment details with you directly. No payment is taken through this website. ${warning}`,
  MANUALLY_CONFIRMED:
    'ATA has confirmed your booking personally. Your confirmation details come directly from ATA.',
  DECLINED: `ATA was unable to proceed with your request. ${warning} You may send a new request or contact ATA directly.`,
  CANCELLED: `Your request was cancelled. ${warning}`,
  CLOSED: `Your request is closed. ${warning} You may submit a new request at any time.`,
  ARCHIVED: null,
}

export const PROHIBITED_PUBLIC_PHRASES = [
  'book now',
  'secure your spot',
  'pay now',
  'guaranteed seat',
  'booking confirmed',
  'reservation confirmed',
] as const

export const FLAGSHIP_PREVIEW_COPY = {
  eyebrow: 'Non-production copy review',
  title: 'One journey. Confirmed personally.',
  summary:
    'Explore the shape of ATA’s flagship journey without invented prices, dates, availability, or itinerary promises.',
  requestIntro:
    'Tell us a little about your trip. A person at ATA replies — nothing is booked or charged by this form.',
  pricePlaceholder: 'Price on request',
  priceDetail:
    'Every group is different. Send a quote request and ATA can prepare a personal quote. No payment is taken through this website.',
  datePlaceholder: 'Travel dates are confirmed personally by ATA',
  dateDetail:
    'Share your preferred travel window and ATA can confirm what is possible.',
  ledger:
    'Some details are still being verified with ATA. We show only what is approved; when something is missing, that is a control, not an error.',
} as const

export function hasEditorialMarker(value: string) {
  return /\[(?:ACR|ODR|RR|VSR|PNP)\]|\bM-\d{2}\b|SRC-|TODO|not for publication/i.test(value)
}
