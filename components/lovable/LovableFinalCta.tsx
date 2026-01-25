/**
 * Final CTA Section
 * 
 * CONSTITUTION RULES:
 * - One clear next action
 * - Booking path always clear
 * - UI feels calm, trustworthy, human
 */

import { BRAND } from '@/lib/config'

export default function LovableFinalCta() {
  return (
    <section className="py-16 md:py-24 bg-emerald-600">
      <div className="container max-w-3xl mx-auto px-4 text-center">
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Plan Your Trip?
        </h2>

        {/* Description */}
        <p className="text-lg text-emerald-100 mb-8 max-w-xl mx-auto">
          Message us on WhatsApp with your destination and dates. 
          We&rsquo;ll respond within hours with options tailored to you.
        </p>

        {/* Single Primary CTA */}
        <a
          href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi! I'm ready to plan my trip. Can you help?`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg"
        >
          Start Planning on WhatsApp
        </a>

        {/* Alternative Contact */}
        <p className="mt-8 text-emerald-200 text-sm">
          Prefer email? <a href={`mailto:${BRAND.email}`} className="underline hover:text-white">{BRAND.email}</a>
        </p>
      </div>
    </section>
  )
}
