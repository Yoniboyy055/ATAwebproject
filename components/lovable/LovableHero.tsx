import Image from 'next/image'
import Link from 'next/link'
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
        <div className="mb-4 sm:mb-6 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-400/50 rounded-full mb-3">
            <p className="text-xs sm:text-sm font-semibold text-emerald-300 tracking-wide">✈️ Fast Flights • Visa Help • WhatsApp Support</p>
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight max-w-4xl animate-fade-in-delay-1">
          Travel Home or Explore the World
        </h1>
        
        <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl mb-6 sm:mb-10 animate-fade-in-delay-2">
          Get your flights, visas, and travel arranged in minutes. Trusted by Eritrean diaspora and locals for 10+ years.
        </p>

        {/* CTA Buttons - Two Clear Paths */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto animate-fade-in-delay-3">
          {/* Diaspora CTA */}
          <a
            href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi! I'm diaspora looking to visit home soon. Can you help me plan my trip?`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform"
          >
            💬 Chat on WhatsApp (Diaspora)
          </a>
          
          {/* Local CTA */}
          <a
            href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi! I'm looking to book a flight. What are the available options?`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-4 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform"
          >
            ✈️ Book Flight (Local)
          </a>

          {/* Explore Alternative */}
          <Link
            href="/flights"
            className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-4 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold rounded-lg transition duration-200 border border-white/40 transform"
          >
            🔍 Browse Options
          </Link>
        </div>
      </div>

      {/* Search Widget (simplified for Eritrea focus) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-8 hidden md:block">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">From</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option>Asmara</option>
                  <option>Addis Ababa</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">To</label>
                <input
                  type="text"
                  placeholder="Search destination"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Depart</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
