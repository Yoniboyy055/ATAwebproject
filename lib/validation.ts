import { z } from 'zod'

/**
 * Comprehensive Zod schemas for API request validation
 * Use these schemas across all API routes for consistent validation
 */

// Booking schemas
export const BookingRequestSchema = z.object({
  tripType: z.enum(['one-way', 'round-trip']),
  passengers: z.number().int().min(1).max(9),
  passengerNames: z.array(z.string().min(1)).min(1),
  phoneCountry: z.string().min(1),
  fromCity: z.string().min(1),
  toCity: z.string().min(1),
  departDate: z.string().datetime(),
  returnDate: z.string().datetime().optional(),
  fullName: z.string().min(2).max(100),
  phone: z.string().min(10).max(20),
  email: z.string().email().optional(),
  notes: z.string().max(1000).optional(),
  contactMethod: z.enum(['whatsapp', 'phone', 'email']),
  promoCode: z.string().max(50).optional(),
  sendSMS: z.boolean().optional().default(true),
  sendEmail: z.boolean().optional().default(true),
})

export type BookingRequest = z.infer<typeof BookingRequestSchema>

// Review schemas
export const CreateReviewSchema = z.object({
  packageId: z.string().uuid().optional(),
  destinationId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(100),
  comment: z.string().min(10).max(2000),
  visitorName: z.string().min(2).max(100),
  visitorEmail: z.string().email(),
  verifiedPurchase: z.boolean().optional(),
})

export type CreateReview = z.infer<typeof CreateReviewSchema>

// Search schemas
export const SearchSchema = z.object({
  query: z.string().min(2).max(200),
  category: z.enum(['packages', 'destinations', 'flights']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['relevance', 'popularity', 'price']).optional(),
})

export type SearchRequest = z.infer<typeof SearchSchema>

// Quote request schemas
export const QuoteRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  destinationIds: z.array(z.string().uuid()).min(1),
  passengers: z.number().int().min(1).max(9),
  budget: z.number().positive().optional(),
  datePreference: z.string().optional(),
  additionalNotes: z.string().max(2000).optional(),
})

export type QuoteRequest = z.infer<typeof QuoteRequestSchema>

// Contact form schemas
export const ContactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20).optional(),
  subject: z.string().min(3).max(100),
  message: z.string().min(10).max(5000),
  subscribeNewsletter: z.boolean().optional(),
})

export type ContactForm = z.infer<typeof ContactFormSchema>

// Newsletter signup schema
export const NewsletterSignupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100).optional(),
  interests: z.array(z.string()).optional(),
})

export type NewsletterSignup = z.infer<typeof NewsletterSignupSchema>

// Flight search schemas
export const FlightSearchSchema = z.object({
  from: z.string().length(3), // IATA code
  to: z.string().length(3),
  departDate: z.string().date(),
  returnDate: z.string().date().optional(),
  passengers: z.number().int().min(1).max(9),
  tripType: z.enum(['one-way', 'round-trip']),
  cabin: z.enum(['economy', 'premium-economy', 'business', 'first']).optional(),
})

export type FlightSearch = z.infer<typeof FlightSearchSchema>

// Payment schemas
export const PaymentIntentSchema = z.object({
  bookingId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type PaymentIntent = z.infer<typeof PaymentIntentSchema>

// Wishlist schemas
export const WishlistActionSchema = z.object({
  packageId: z.string().uuid(),
  action: z.enum(['add', 'remove']),
})

export type WishlistAction = z.infer<typeof WishlistActionSchema>

// Pagination schema (reusable)
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
})

export type Pagination = z.infer<typeof PaginationSchema>

/**
 * Safe validation helper
 * Returns parsed data or null if validation fails
 */
export function safeValidate<T>(schema: z.ZodType<T>, data: unknown): T | null {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues)
    }
    return null
  }
}

/**
 * Validation error response helper
 */
export function getValidationError(error: unknown) {
  if (error instanceof z.ZodError) {
    return {
      error: 'Validation failed',
      details: error.issues.map((issue: z.ZodIssue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    }
  }
  return { error: 'Invalid input' }
}
