import { RequestStatuses, type RequestStatus } from './workflow'

export const PREVIEW_PROVENANCE =
  'WP-04V deterministic demonstration data. Not sourced from Supabase or legacy package records.'

export type PreviewTour = {
  id: string
  title: string
  status: 'Draft' | 'Under review'
  priceStatus: 'Not provided' | 'Draft'
  dateStatus: 'Not published' | 'Draft'
  readiness: number
}

export type PreviewRequest = {
  id: string
  guest: string
  status: RequestStatus
  owner: string
  updated: string
}

export interface AtaPreviewRepository {
  getTours(): readonly PreviewTour[]
  getRequests(): readonly PreviewRequest[]
  getWorkflow(): readonly RequestStatus[]
  getSummary(): Record<string, number>
}

const tours: readonly PreviewTour[] = [
  { id: 'tour-preview-01', title: 'Highlands to Red Sea — working tour', status: 'Draft', priceStatus: 'Not provided', dateStatus: 'Not published', readiness: 46 },
  { id: 'tour-preview-02', title: 'ATA custom journey — demonstration', status: 'Under review', priceStatus: 'Draft', dateStatus: 'Draft', readiness: 61 },
]

const requests: readonly PreviewRequest[] = [
  { id: 'ATA-DEMO-1042', guest: 'Demonstration traveller', status: 'UNDER_REVIEW', owner: 'ATA Operations Manager', updated: 'Today, 10:20' },
  { id: 'ATA-DEMO-1041', guest: 'Example family request', status: 'QUOTE_PREPARATION', owner: 'ATA Administrator', updated: 'Yesterday, 15:05' },
  { id: 'ATA-DEMO-1040', guest: 'Preview group enquiry', status: 'CUSTOMER_RESPONSE_PENDING', owner: 'ATA Owner', updated: 'Yesterday, 09:40' },
]

export function createAtaPreviewRepository(): AtaPreviewRepository {
  return {
    getTours: () => tours,
    getRequests: () => requests,
    getWorkflow: () => RequestStatuses,
    getSummary: () => ({
      draftTours: 2,
      missingPrices: 1,
      unpublishedDates: 2,
      awaitingEvidence: 5,
      awaitingApproval: 3,
      approvedUnreleased: 2,
      customerRequests: 3,
      quotesInPreparation: 1,
      awaitingCustomer: 1,
      manuallyConfirmed: 0,
    }),
  }
}

