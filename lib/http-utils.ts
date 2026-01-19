import { NextRequest, NextResponse } from 'next/server'

/**
 * HTTP Cache control utilities
 * Use these for API response caching
 */
export const cacheControl = {
  // No cache - for sensitive data
  noCache: 'no-cache, no-store, must-revalidate',

  // Short cache - 5 minutes
  short: 'public, max-age=300, s-maxage=300',

  // Medium cache - 1 hour
  medium: 'public, max-age=3600, s-maxage=3600',

  // Long cache - 24 hours
  long: 'public, max-age=86400, s-maxage=86400',

  // Immutable - for assets
  immutable: 'public, max-age=31536000, immutable',

  // Revalidate on demand
  revalidate: 'public, s-maxage=60, revalidate=30',
}

/**
 * Set cache headers on response
 */
export function withCache(response: NextResponse, cacheType: string): NextResponse {
  response.headers.set('Cache-Control', cacheType)
  return response
}

/**
 * CORS configuration
 */
export const corsConfig = {
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_SITE_URL,
  ].filter(Boolean),

  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key',
  ],

  exposedHeaders: ['X-Total-Count', 'X-Page-Number', 'X-RateLimit-Remaining'],

  credentials: true,
  maxAge: 86400, // 24 hours
}

/**
 * CORS middleware for API routes
 */
export function corsMiddleware(request: NextRequest, origin: string | null) {
  const response = new NextResponse()

  // Check if origin is allowed
  const isAllowed =
    corsConfig.allowedOrigins.includes(origin || '') ||
    process.env.NODE_ENV === 'development'

  if (isAllowed && origin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set(
      'Access-Control-Allow-Methods',
      corsConfig.allowedMethods.join(', ')
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      corsConfig.allowedHeaders.join(', ')
    )
    response.headers.set(
      'Access-Control-Expose-Headers',
      corsConfig.exposedHeaders.join(', ')
    )
    response.headers.set('Access-Control-Max-Age', corsConfig.maxAge.toString())
  }

  return response
}

/**
 * Handle CORS preflight requests
 */
export function handleCorsPreFlight(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin')
    const response = corsMiddleware(request, origin)
    return new NextResponse(null, { headers: response.headers, status: 204 })
  }
  return null
}

/**
 * Security headers configuration
 */
export const securityHeaders = {
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',

  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Enable HSTS (Strict-Transport-Security)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.builder.io https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: http://localhost:3000",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https: http://localhost:3000",
    "media-src 'self' https:",
    "frame-src 'self' https://www.youtube.com https://www.google.com",
  ].join('; '),

  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=(self)',
  ].join(', '),
}

/**
 * Apply security headers to response
 */
export function withSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

/**
 * Combined middleware for API responses
 */
export function apiResponseHeaders(
  response: NextResponse,
  options: {
    cache?: string
    security?: boolean
  } = {}
) {
  const { cache = cacheControl.noCache, security = true } = options

  // Add cache headers
  response.headers.set('Cache-Control', cache)

  // Add security headers
  if (security) {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
  }

  return response
}
