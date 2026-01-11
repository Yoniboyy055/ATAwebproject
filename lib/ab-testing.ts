/**
 * A/B Testing utilities for experimentation
 */

export type ABTestVariant = 'footer-cta-v1' | 'footer-cta-v2'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

interface ABTestConfig {
  variantA: ABTestVariant
  variantB: ABTestVariant
  splitPercentage: number // 0-100, percentage for variant A
}

const AB_TEST_CONFIG: Record<string, ABTestConfig> = {
  footer_cta: {
    variantA: 'footer-cta-v1', // Original: "Chat on WhatsApp"
    variantB: 'footer-cta-v2', // Variant: "Get Expert Help Now"
    splitPercentage: 50, // 50/50 split
  },
}

/**
 * Get assigned variant for a user (consistent across sessions via localStorage)
 */
export function getABTestVariant(testName: string): ABTestVariant | null {
  if (!process.env.NEXT_PUBLIC_AB_TEST_ENABLED || process.env.NEXT_PUBLIC_AB_TEST_ENABLED === 'false') {
    return null
  }

  if (typeof window === 'undefined') {
    return null
  }

  const storageKey = `amanuel_ab_test_${testName}`
  let variant = localStorage.getItem(storageKey) as ABTestVariant | null

  if (!variant) {
    const config = AB_TEST_CONFIG[testName]
    if (!config) return null

    // Randomly assign variant
    const isVariantA = Math.random() * 100 < config.splitPercentage
    variant = isVariantA ? config.variantA : config.variantB

    // Persist to localStorage
    localStorage.setItem(storageKey, variant)

    // Track assignment event
    trackABTestAssignment(testName, variant)
  }

  return variant
}

/**
 * Track A/B test assignment in analytics
 */
export function trackABTestAssignment(testName: string, variant: ABTestVariant) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ab_test_assignment', {
      test_name: testName,
      variant: variant,
      event_category: 'experiment',
    })
  }
}

/**
 * Track A/B test conversion (user interacted with variant)
 */
export function trackABTestConversion(testName: string, variant: ABTestVariant, action: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ab_test_conversion', {
      test_name: testName,
      variant: variant,
      action: action,
      event_category: 'experiment',
    })
  }
}

/**
 * Get all active A/B tests
 */
export function getActiveABTests(): string[] {
  if (!process.env.NEXT_PUBLIC_AB_TEST_ENABLED || process.env.NEXT_PUBLIC_AB_TEST_ENABLED === 'false') {
    return []
  }

  return Object.keys(AB_TEST_CONFIG)
}
