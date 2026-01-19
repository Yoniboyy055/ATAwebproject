import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

/**
 * Simple in-memory rate limiter
 * In production, use Redis for distributed rate limiting
 */
export class RateLimiter {
  constructor(
    private windowMs: number = 60000, // 1 minute
    private maxRequests: number = 100
  ) {}

  private getKey(identifier: string): string {
    return `rate-limit:${identifier}`
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, data] of Object.entries(store)) {
      if (data.resetTime < now) {
        delete store[key]
      }
    }
  }

  isLimited(identifier: string): boolean {
    this.cleanup()
    const key = this.getKey(identifier)
    const now = Date.now()

    if (!store[key]) {
      store[key] = { count: 1, resetTime: now + this.windowMs }
      return false
    }

    const record = store[key]
    if (now > record.resetTime) {
      record.count = 1
      record.resetTime = now + this.windowMs
      return false
    }

    record.count++
    return record.count > this.maxRequests
  }

  getRemainingRequests(identifier: string): number {
    const key = this.getKey(identifier)
    const record = store[key]
    if (!record) return this.maxRequests
    return Math.max(0, this.maxRequests - record.count)
  }
}

/**
 * Rate limiting middleware for Next.js API routes
 * Usage:
 *   const limiter = new RateLimiter(60000, 10) // 10 requests per minute
 *   if (limiter.isLimited(clientId)) {
 *     return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
 *   }
 */
export function createRateLimitMiddleware(windowMs: number = 60000, maxRequests: number = 100) {
  const limiter = new RateLimiter(windowMs, maxRequests)

  return (request: NextRequest) => {
    // Get client identifier (IP address or user ID)
    const clientId =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'anonymous'

    if (limiter.isLimited(clientId)) {
      const remaining = limiter.getRemainingRequests(clientId)
      return NextResponse.json(
        { error: 'Too many requests', remaining },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
          },
        }
      )
    }

    return null // Continue processing
  }
}

/**
 * Predefined rate limiters for common scenarios
 */
export const rateLimiters = {
  // Booking endpoint: 5 requests per minute
  booking: new RateLimiter(60000, 5),

  // Payment webhook: 100 requests per minute (higher for webhooks)
  webhook: new RateLimiter(60000, 100),

  // Search endpoint: 30 requests per minute
  search: new RateLimiter(60000, 30),

  // Auth endpoints: 10 requests per 15 minutes
  auth: new RateLimiter(900000, 10),

  // General API: 100 requests per minute
  api: new RateLimiter(60000, 100),
}
