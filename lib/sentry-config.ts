/**
 * Sentry configuration for Next.js
 * Production error tracking and monitoring
 */

import * as Sentry from '@sentry/nextjs'

export function initSentry() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log('[Sentry] DSN not configured, skipping initialization')
    return
  }

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    debug: process.env.NODE_ENV !== 'production',

    // Capture breadcrumbs for debugging
    maxBreadcrumbs: 50,
    attachStacktrace: true,

    // Source maps for error stack traces
    release: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      'chrome-extension://',
      'moz-extension://',
      // Random plugins/extensions
      'google_ad_module',
      'comscore',
      // Facebook errors
      'fb_xd_fragment',
      // ISP optimization client
      'bmi_SafeAddOnload',
      'EBCallBackMessageReceived',
      // See http://toolbar.avast.com/errors.txt
      'avast_submit',
    ],

    // Request filtering
    beforeSend(event) {
      // Filter out errors in development
      if (process.env.NODE_ENV === 'development') {
        return null
      }

      // Don't send if event has no exception
      if (!event.exception) {
        return event
      }

      return event
    },
  })
}

/**
 * Capture exception with context
 */
export function captureError(
  error: Error,
  context?: Record<string, unknown>,
  level: 'fatal' | 'error' | 'warning' | 'info' = 'error'
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.error(`[${level}]`, error.message, context)
    return
  }

  Sentry.captureException(error, {
    level,
    contexts: { custom: context },
  })
}

/**
 * Capture message
 */
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info'
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log(`[${level}] ${message}`)
    return
  }

  Sentry.captureMessage(message, level)
}

/**
 * Set user context
 */
export function setUser(userId: string, email?: string, username?: string) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return

  Sentry.setUser({
    id: userId,
    email,
    username,
  })
}

/**
 * Clear user context
 */
export function clearUser() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return
  Sentry.setUser(null)
}

/**
 * Add breadcrumb for action tracking
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info'
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return

  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level,
  })
}
