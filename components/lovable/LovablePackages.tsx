/**
 * Packages Section - Bento Grid Layout
 * 
 * CONSTITUTION RULES:
 * - One featured package (larger tile)
 * - Each card includes: Destination, Duration, Emotional hook, Human reassurance
 * - No pricing overload
 * - No feature dumping
 */

import Link from 'next/link'
import { BRAND } from '@/lib/config'

interface Package {
  id: string
  title: string
  subtitle: string
  emotionalHook: string
  humanNote: string
  duration: string
  icon: string
  featured?: boolean
}

const packages: Package[] = [
  {
    id: 'family-reunion',
    title: 'Family Reunion Trip',
    subtitle: 'Diaspora visits home',
    emotionalHook: 'Reconnect with family, rediscover your roots, create lasting memories together.',
    humanNote: 'We coordinate arrivals across time zones so your whole family arrives together.',
    duration: '7-14 days',
    icon: '👨‍👩‍👧‍👦',
    featured: true,
  },
  {
    id: 'asmara-explorer',
    title: 'Asmara City Experience',
    subtitle: 'Culture & Heritage',
    emotionalHook: 'Walk through Art Deco streets, taste authentic cuisine, feel the heart of Eritrea.',
    humanNote: "Local guides show you hidden gems tourists never find.",
    duration: '3-5 days',
    icon: '🏛️',
  },
  {
    id: 'massawa-escape',
    title: 'Massawa Beach Escape',
    subtitle: 'Red Sea paradise',
    emotionalHook: 'Crystal clear waters, fresh seafood, and rich port city history.',
    humanNote: "Best visited November to March. We'll help you pick perfect dates.",
    duration: '3-4 days',
    icon: '🌊',
  },
  {
    id: 'addis-stopover',
    title: 'Addis Ababa Stopover',
    subtitle: 'Ethiopian capital',
    emotionalHook: 'Vibrant markets, world-class coffee, and the pulse of East Africa.',
    humanNote: 'Perfect for layovers - we arrange comfortable stays between flights.',
    duration: '2-3 days',
    icon: '🌃',
  },
  {
    id: 'business-travel',
    title: 'Business Travel Package',
    subtitle: 'Professional arrangements',
    emotionalHook: 'Focus on your work while we handle logistics, visas, and transfers.',
    humanNote: 'Fast visa processing and flexible rebooking for busy schedules.',
    duration: 'Flexible',
    icon: '💼',
  },
]

export default function LovablePackages() {
  const featuredPackage = packages.find(p => p.featured)
  const regularPackages = packages.filter(p => !p.featured)

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Travel Packages
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Curated experiences for diaspora families and adventurous travelers. Each package includes WhatsApp support.
          </p>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {/* Featured Package - Larger Tile */}
          {featuredPackage && (
            <Link
              href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi! I'm interested in the ${featuredPackage.title} package.`}
              className="group md:col-span-2 md:row-span-2 relative rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 md:p-8 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-emerald-300"
            >
              {/* Featured Badge */}
              <span className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </span>

              <div className="text-5xl md:text-6xl mb-4">{featuredPackage.icon}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                {featuredPackage.title}
              </h3>
              <p className="text-slate-500 text-sm mb-4">{featuredPackage.subtitle} • {featuredPackage.duration}</p>
              <p className="text-slate-700 text-lg mb-6">{featuredPackage.emotionalHook}</p>
              <p className="text-sm text-slate-500 italic border-l-2 border-emerald-300 pl-3">
                {featuredPackage.humanNote}
              </p>
              
              {/* CTA Indicator */}
              <div className="mt-6 text-emerald-600 font-semibold flex items-center gap-2">
                Plan this trip
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          )}

          {/* Regular Packages */}
          {regularPackages.map(pkg => (
            <Link
              key={pkg.id}
              href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi! I'm interested in the ${pkg.title} package.`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-3">{pkg.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                {pkg.title}
              </h3>
              <p className="text-slate-500 text-sm mb-3">{pkg.subtitle} • {pkg.duration}</p>
              <p className="text-slate-600 text-sm mb-4">{pkg.emotionalHook}</p>
              <p className="text-xs text-slate-400 italic">{pkg.humanNote}</p>
            </Link>
          ))}
        </div>

        {/* Bottom CTA - Simple, One Action */}
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Custom Trip? We&rsquo;ll Plan It For You
          </h3>
          <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
            Tell us your dates and destinations. Our team will create a personalized itinerary within 24 hours.
          </p>
          <a
            href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi! I'd like to plan a custom trip.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Chat with Our Team
          </a>
        </div>
      </div>
    </section>
  )
}
