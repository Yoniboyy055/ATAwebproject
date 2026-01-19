import { NextRequest, NextResponse } from 'next/server'
import { ZodError, ZodIssue } from 'zod'

/**
 * Standardized error response format
 */
export interface ApiError {
  ok: false
  error: string
  details?: Record<string, unknown>
  timestamp?: string
  requestId?: string
}

export interface ApiSuccess<T> {
  ok: true
  data: T
  timestamp?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

/**
 * API error types
 */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  INVALID_INPUT = 'INVALID_INPUT',
}

/**
 * Custom error class for API errors
 */
export class ApiErrorException extends Error {
  constructor(
    public code: ErrorCode,
    public statusCode: number,
    public message: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiErrorException'
  }
}

/**
 * Error handler utility
 */
export class ApiErrorHandler {
  /**
   * Create standardized error response
   */
  static error(
    statusCode: number,
    message: string,
    details?: Record<string, unknown>
  ): NextResponse<ApiError> {
    const response: ApiError = {
      ok: false,
      error: message,
      timestamp: new Date().toISOString(),
    }

    if (details) {
      response.details = details
    }

    return NextResponse.json(response, { status: statusCode })
  }

  /**
   * Handle validation errors
   */
  static validationError(error: ZodError): NextResponse<ApiError> {
    const details = error.issues.reduce(
      (acc: Record<string, unknown>, issue: ZodIssue) => ({
        ...acc,
        [issue.path.join('.')]: issue.message,
      }),
      {}
    )

    return this.error(400, 'Validation failed', details)
  }

  /**
   * Handle not found errors
   */
  static notFound(resource: string): NextResponse<ApiError> {
    return this.error(404, `${resource} not found`)
  }

  /**
   * Handle unauthorized errors
   */
  static unauthorized(message = 'Unauthorized'): NextResponse<ApiError> {
    return this.error(401, message)
  }

  /**
   * Handle forbidden errors
   */
  static forbidden(message = 'Forbidden'): NextResponse<ApiError> {
    return this.error(403, message)
  }

  /**
   * Handle rate limit errors
   */
  static rateLimited(retryAfter = 60): NextResponse<ApiError> {
    const response = this.error(429, 'Too many requests')
    response.headers.set('Retry-After', retryAfter.toString())
    return response
  }

  /**
   * Handle internal server errors
   */
  static internalError(
    error: unknown,
    message = 'Internal server error'
  ): NextResponse<ApiError> {
    if (process.env.NODE_ENV === 'development') {
      const errorDetails =
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : { error: String(error) }

      return this.error(500, message, errorDetails)
    }

    return this.error(500, message)
  }

  /**
   * Handle custom API errors
   */
  static handleApiError(error: ApiErrorException): NextResponse<ApiError> {
    return this.error(error.statusCode, error.message, error.details)
  }
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, statusCode = 200): NextResponse<ApiSuccess<T>> {
  const response: ApiSuccess<T> = {
    ok: true,
    data,
    timestamp: new Date().toISOString(),
  }
  return NextResponse.json(response, { status: statusCode })
}

/**
 * Async route handler wrapper with error handling
 */
export async function apiRoute(
  handler: (request: NextRequest) => Promise<NextResponse>,
  request: NextRequest
): Promise<NextResponse> {
  try {
    return await handler(request)
  } catch (error) {
    if (error instanceof ZodError) {
      return ApiErrorHandler.validationError(error) as NextResponse
    }

    if (error instanceof ApiErrorException) {
      return ApiErrorHandler.handleApiError(error) as NextResponse
    }

    return ApiErrorHandler.internalError(error) as NextResponse
  }
}

/**
 * Sensitive data masking utility
 */
export class DataMasking {
  static maskEmail(email: string): string {
    const [name, domain] = email.split('@')
    const maskedName = name.substring(0, 2) + '*'.repeat(name.length - 2)
    return `${maskedName}@${domain}`
  }

  static maskPhone(phone: string): string {
    return phone.substring(0, 3) + '*'.repeat(phone.length - 6) + phone.substring(phone.length - 3)
  }

  static maskCardNumber(card: string): string {
    const digits = card.replace(/\D/g, '')
    return '*'.repeat(12) + digits.substring(12)
  }

  static maskSensitiveObject<T extends Record<string, unknown>>(
    obj: T,
    sensitiveFields: string[]
  ): Partial<T> {
    const masked = { ...obj }
    sensitiveFields.forEach((field) => {
      if (field in masked) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        masked[field as keyof T] = '[REDACTED]' as any
      }
    })
    return masked
  }
}
