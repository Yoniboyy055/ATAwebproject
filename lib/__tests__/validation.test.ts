/**
 * Validation schemas tests
 */
import { BookingRequestSchema, CreateReviewSchema, SearchSchema } from '../validation'

describe('Validation Schemas', () => {
  describe('BookingRequestSchema', () => {
    it('should validate correct booking request', () => {
      const validData = {
        tripType: 'one-way' as const,
        passengers: 2,
        passengerNames: ['John Doe', 'Jane Smith'],
        phoneCountry: '+1',
        fromCity: 'New York',
        toCity: 'London',
        departDate: new Date().toISOString(),
        fullName: 'John Doe',
        phone: '+1234567890',
        email: 'user@example.com',
        contactMethod: 'email' as const,
      }

      const result = BookingRequestSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject booking with invalid email', () => {
      const invalidData = {
        tripType: 'one-way' as const,
        passengers: 2,
        passengerNames: ['John Doe'],
        phoneCountry: '+1',
        fromCity: 'New York',
        toCity: 'London',
        departDate: new Date().toISOString(),
        fullName: 'John Doe',
        phone: '+1234567890',
        email: 'not-an-email',
        contactMethod: 'email' as const,
      }

      const result = BookingRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject booking with negative travelers', () => {
      const invalidData = {
        tripType: 'one-way' as const,
        passengers: -1,
        passengerNames: ['John Doe'],
        phoneCountry: '+1',
        fromCity: 'New York',
        toCity: 'London',
        departDate: new Date().toISOString(),
        fullName: 'John Doe',
        phone: '+1234567890',
        email: 'user@example.com',
        contactMethod: 'email' as const,
      }

      const result = BookingRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('CreateReviewSchema', () => {
    it('should validate correct review', () => {
      const validData = {
        packageId: '550e8400-e29b-41d4-a716-446655440000',
        rating: 5,
        title: 'Amazing trip',
        comment: 'This was an incredible travel experience!',
        visitorName: 'Jane Doe',
        visitorEmail: 'reviewer@example.com',
      }

      const result = CreateReviewSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject review with invalid rating', () => {
      const invalidData = {
        packageId: '550e8400-e29b-41d4-a716-446655440000',
        rating: 10,
        title: 'Amazing trip',
        comment: 'This was an incredible travel experience!',
        visitorName: 'Jane Doe',
        visitorEmail: 'reviewer@example.com',
      }

      const result = CreateReviewSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('SearchSchema', () => {
    it('should validate search query', () => {
      const validData = {
        query: 'Eritrea',
        page: 1,
        limit: 10,
      }

      const result = SearchSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should use default values', () => {
      const minimalData = {
        query: 'Eritrea',
      }

      const result = SearchSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(20)
      }
    })
  })
})
