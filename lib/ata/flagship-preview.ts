import type { TourDomain } from './domain'

function hidden(): TourDomain['title'] {
  return {
  value: null,
  public: false,
  evidence: [],
  }
}

export const flagshipPreview: TourDomain = {
  id: 'working-candidate-asmara-massawa',
  slug: 'asmara-massawa-signature-working-candidate',
  workingTitle: 'Asmara–Massawa Signature Tour',
  publicationState: 'DRAFT',
  title: hidden(),
  summary: hidden(),
  duration: hidden(),
  priceDisplay: hidden(),
  availabilityNote: hidden(),
  itinerary: [],
  inclusions: [],
  exclusions: [],
  sourceIds: ['SRC-UI-003', 'SRC-UI-004', 'SRC-UI-005'],
  updatedAt: '2026-07-23T00:00:00.000Z',
}
