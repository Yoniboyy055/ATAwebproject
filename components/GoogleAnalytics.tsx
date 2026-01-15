'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Google Analytics configuration
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXXX'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
    gtag: (...args: unknown[]) => void
  }
}

// Analytics helper function
export const analytics = {
  // Page view tracking (automatic with gtag.pageview)
  trackEvent: (eventName: string, params?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params)
    }
  },

  // Track conversions
  trackConversion: (conversionName: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        conversion_id: conversionName,
        conversion_value: value,
      })
    }
  },

  // Track WhatsApp clicks
  trackWhatsAppClick: (source: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        source: source, // hero, flights, booking, services, etc.
      })
    }
  },

  // Track button clicks
  trackButtonClick: (buttonName: string, context?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'button_click', {
        button_name: buttonName,
        context: context,
      })
    }
  },

  // Set user properties
  setUserProperties: (userType: 'local' | 'diaspora' | 'other') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_ID, {
        user_properties: {
          user_type: userType,
        },
      })
    }
  },

  // Track Stripe payments and conversions
  trackPayment: (amount: number, currency: string, bookingId: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: bookingId,
        value: amount,
        currency: currency,
        event_category: 'ecommerce',
      })
    }
  },

  // Track booking completion
  trackBookingComplete: (bookingId: string, amount: number, passengers: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'booking_complete', {
        booking_id: bookingId,
        value: amount,
        passengers: passengers,
        event_category: 'booking',
      })
    }
  },

  // Track form submission
  trackFormSubmission: (formName: string, fields: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_submit', {
        form_name: formName,
        form_fields: fields,
        event_category: 'engagement',
      })
    }
  },
}

export default function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize gtag if not already done
    if (typeof window !== 'undefined' && !window.gtag) {
      // Load GTM script first
      const gtmScript = document.createElement('script')
      gtmScript.async = true
      gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
      document.head.appendChild(gtmScript)

      // Load GA script
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      function gtag(...gtArgs: unknown[]) {
        window.dataLayer.push(gtArgs as unknown as Record<string, unknown>)
      }
      window.gtag = gtag
      gtag('js', new Date())
      gtag('config', GA_ID, {
        page_path: pathname,
      })

      // Initialize GTM data layer
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_ID, {
        page_path: pathname,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}
