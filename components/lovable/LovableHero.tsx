/**
 * Hero Section - 5-Second Rule
 * 
 * CONSTITUTION RULES:
 * - Must clearly communicate: Real travel agency, human-led service
 * - ONE primary CTA only
 * - CTA must be explicit (not "Explore" or "Get Started")
 * - One trust signal visible
 * - No abstract slogans, no blurred text
 */

import Image from 'next/image'
import Link from 'next/link'
import { BRAND } from '@/lib/config'

export default function LovableHero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Hero Background */}
      <div className="relative h-[480px] md:h-[560px] w-full">
        <Image
          src="/images/hero.svg"
          alt="Travel destinations - Asmara, Addis Ababa"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay - ensures text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-900/70" />
      </div>

      {/* Hero Content - Clear, Readable, No Glass Effects */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10">
        {/* Trust Signal - One visible signal */}
        <div className="mb-6">
          <p className="text-sm font-medium text-white/90">
            Trusted by 50,000+ travelers since 2000
          </p>
        </div>
        
        {/* Main Headline - Clear communication */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight max-w-4xl">
          Flights & Travel to Eritrea and Ethiopia
        </h1>
        
        {/* Subheadline - What we do, who we serve */}
        <p className="text-white/95 text-lg md:text-xl max-w-2xl mb-8">
          Human-led travel agency helping diaspora families visit home and locals explore the world. WhatsApp support included.
        </p>

        {/* ONE Primary CTA - Explicit action */}
        <a
          href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi! I'd like to plan my trip to Eritrea/Ethiopia. Can you help?`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-xl transition-colors shadow-lg"
        >
          Plan My Trip
        </a>

        {/* Secondary Link - Not competing, just informational */}
        <Link
          href="/packages"
          className="mt-4 text-white/80 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
        >
          Or browse our travel packages
        </Link>
      </div>

      {/* Bottom Trust Bar - Quick reassurance */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur-sm py-4">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-white/90 text-sm">
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Fast Flight Booking
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Visa Assistance
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              WhatsApp Support
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              25+ Years Experience
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
