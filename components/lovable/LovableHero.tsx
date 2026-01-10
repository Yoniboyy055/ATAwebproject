import Image from 'next/image'
import Link from 'next/link'
import { BRAND } from '@/lib/config'

export default function LovableHero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Hero Background */}
      <div className="relative h-[600px] md:h-[700px] w-full">
        <Image
          src="/images/hero.svg"
          alt="Tropical paradise beach"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <div className="mb-6">
          <p className="text-sm md:text-base font-semibold text-emerald-300 mb-2 tracking-wide">✈️ 🌴 🧳 🌏</p>
          <p className="text-white/90 text-sm md:text-base">Over 50,000+ happy travelers</p>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight max-w-3xl">
          Discover Your Next Adventure
        </h1>
        
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8">
          Explore extraordinary destinations for diaspora & local travelers. From pristine beaches to vibrant cities, your dream vacation awaits.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={`https://wa.me/${BRAND.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition duration-300 shadow-lg"
          >
            WhatsApp: Book Now
          </a>
          <Link
            href="/packages"
            className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition duration-300 border border-white/40"
          >
            Explore Packages
          </Link>
        </div>
      </div>

      {/* Search Widget (simplified for Eritrea focus) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/50 to-transparent pt-12 pb-8">
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
