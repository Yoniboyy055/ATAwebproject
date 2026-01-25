import Image from 'next/image'
import { BRAND } from '@/lib/config'

export default function LovableHero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Hero Background */}
      <div className="relative h-[500px] md:h-[600px] w-full">
        <Image
          src="/images/hero.svg"
          alt="Tropical paradise beach"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay - stronger */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-900/30 to-black/50" />
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10">
        <div className="mb-4 sm:mb-6">
          <div className="inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-400/50 rounded-full mb-3">
            <p className="text-xs sm:text-sm font-semibold text-emerald-300 tracking-wide">✈️ Fast Flights • Visa Help • WhatsApp Support</p>
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight max-w-4xl">
          Travel Home or Explore the World
        </h1>
        
        <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl mb-6 sm:mb-10">
          Get your flights, visas, and travel arranged in minutes. Trusted by Eritrean diaspora and locals for 10+ years.
        </p>

        {/* Primary CTA */}
        <div className="flex w-full sm:w-auto">
          <a
            href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi! I need help planning my trip. Can you help me?`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform"
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
