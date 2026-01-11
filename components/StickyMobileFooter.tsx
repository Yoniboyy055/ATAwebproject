'use client'

import { useState, useEffect } from 'react'
import { BRAND } from '@/lib/config'
import { analytics } from './GoogleAnalytics'
import { getABTestVariant, trackABTestConversion } from '@/lib/ab-testing'
import type { ABTestVariant } from '@/lib/ab-testing'

export default function StickyMobileFooter() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [variant, setVariant] = useState<ABTestVariant | null>(null)

  useEffect(() => {
    // Check localStorage for dismissal
    const isDismissedStored = localStorage.getItem('amanuel_mobile_footer_dismissed')
    if (isDismissedStored === 'true') {
      setIsDismissed(true)
    } else {
      setIsVisible(true)
    }

    // Get A/B test variant
    const testVariant = getABTestVariant('footer_cta')
    setVariant(testVariant)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('amanuel_mobile_footer_dismissed', 'true')

    // Track dismissal for A/B testing
    if (variant) {
      trackABTestConversion('footer_cta', variant, 'dismissed')
    }
  }

  const handleWhatsAppClick = () => {
    analytics.trackWhatsAppClick('sticky_mobile_footer')

    // Track CTA click for A/B testing
    if (variant) {
      trackABTestConversion('footer_cta', variant, 'click')
    }
  }

  if (!isVisible || isDismissed) {
    return null
  }

  // Variant A: Original copy
  const variantAContent = {
    title: 'Need Help Planning Your Trip?',
    subtitle: 'Chat with our experts now',
    ctaText: '💬 Chat',
  }

  // Variant B: Alternative copy (action-oriented)
  const variantBContent = {
    title: 'Get Expert Travel Help',
    subtitle: 'Instant guidance from local experts',
    ctaText: '🚀 Get Help Now',
  }

  const content = variant === 'footer-cta-v2' ? variantBContent : variantAContent

  if (!isVisible || isDismissed) {
    return null
  }

  return (
    <>
      {/* Mobile Sticky Footer - Hidden on md and up */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-30 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl animate-slide-in-up">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex-1">
            <p className="font-semibold text-sm">{content.title}</p>
            <p className="text-xs text-emerald-100">{content.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=Hi! I need help planning my trip. Can you assist?`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="bg-white text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-bold text-sm transition whitespace-nowrap"
            >
              {content.ctaText}
            </a>
            <button
              onClick={handleDismiss}
              className="text-emerald-200 hover:text-white transition p-2"
              aria-label="Dismiss"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content overlap on mobile */}
      <div className="h-20 md:h-0"></div>
    </>
  )
}
