import {
  CustomerRequestInputSchema,
  TourDomainSchema,
  publicVerifiedValue,
} from '../domain'
import { flagshipPreview } from '../flagship-preview'

describe('ATA tour and request domain', () => {
  it('keeps every unverified flagship commercial field hidden', () => {
    const tour = TourDomainSchema.parse(flagshipPreview)

    expect(tour.publicationState).toBe('DRAFT')
    expect(publicVerifiedValue(tour.title)).toBeNull()
    expect(publicVerifiedValue(tour.duration)).toBeNull()
    expect(publicVerifiedValue(tour.priceDisplay)).toBeNull()
    expect(publicVerifiedValue(tour.availabilityNote)).toBeNull()
    expect(tour.itinerary).toHaveLength(0)
  })

  it('requires publication approval before exposing a value', () => {
    expect(
      publicVerifiedValue({
        value: 'Five days',
        public: true,
        evidence: [
          {
            sourceId: 'SRC-TEST',
            sourceUrl: null,
            status: 'OWNER_PROVIDED',
            checkedAt: null,
            checkedBy: null,
            note: null,
          },
        ],
      })
    ).toBeNull()
  })

  it('accepts the five request types without confirmation semantics', () => {
    const common = {
      tourId: 'working-candidate-asmara-massawa',
      fullName: 'Test Traveler',
      email: 'traveler@example.test',
      phone: '+1 555 010 0200',
      travelerCount: 2,
      preferredDate: null,
      preferredContact: 'EMAIL',
      message: null,
      consentAccepted: true,
      consentVersion: 'wp03c-preview-v1',
      website: '',
    }

    for (const type of [
      'INFORMATION',
      'CONSULTATION',
      'QUOTE',
      'BOOKING_REQUEST',
      'PROVISIONAL_RESERVATION',
    ]) {
      expect(
        CustomerRequestInputSchema.parse({ ...common, type }).type
      ).toBe(type)
    }
  })
})

