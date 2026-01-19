/**
 * Sentry error tracking integration guide
 * 
 * To use Sentry, first install: npm install @sentry/nextjs
 * 
 * Then initialize in your app layout:
 * 
 * import { initializeSentry } from '@/lib/sentry'
 * 
 * useEffect(() => {
 *   initializeSentry()
 * }, [])
 */

/**
 * Initialize Sentry error tracking
 * Add to your app layout or _app.tsx
 * 
 * Install with: npm install @sentry/nextjs
 */
export function initializeSentry() {
  try {
    // Dynamic import to avoid build-time errors if not installed
    // import * as Sentry from '@sentry/nextjs'
    // Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN })
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      console.log('Sentry is ready to initialize. Install @sentry/nextjs to enable.')
    }
  } catch (error) {
    console.log('Sentry not configured')
  }
}

/**
 * Capture exception with context
 * 
 * Usage: captureException(error, { context: 'booking' })
 */
export function captureException(error: Error, context?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'production') {
    try {
      // await Sentry.captureException(error, { contexts: { custom: context } })
      console.error('Error (production):', error.message, context)
    } catch {
      console.error('Error:', error.message)
    }
  } else {
    console.error('Error:', error, context)
  }
}

/**
 * Capture message
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (process.env.NODE_ENV === 'production') {
    try {
      // await Sentry.captureMessage(message, level)
      console.log(`[${level.toUpperCase()}] ${message}`)
    } catch {
      console.log(`[${level.toUpperCase()}] ${message}`)
    }
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`)
  }
}

/**
 * Set user context for error tracking
 */
export function setUserContext(userId: string, email?: string, username?: string) {
  try {
    // Sentry.setUser({ id: userId, email, username })
    console.log('User context set:', { userId, email, username })
  } catch {
    // Ignore
  }
}

/**
 * Clear user context
 */
export function clearUserContext() {
  try {
    // Sentry.setUser(null)
    console.log('User context cleared')
  } catch {
    // Ignore
  }
}

/**
 * Add breadcrumb for tracking
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _level: 'info' | 'warning' | 'error' = 'info'
) {
  try {
    // Sentry.addBreadcrumb({ category, message, level, data, timestamp: Date.now() / 1000 })
    console.log(`[${category}] ${message}`, data)
  } catch {
    // Ignore
  }
}
