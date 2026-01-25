/**
 * Services & How It Works Section
 * 
 * CONSTITUTION RULES (STEP 8):
 * - Explicitly show: Choose trip → Talk to agent → Confirm booking
 * - Simple, calm, obvious
 */

import Link from 'next/link'
import { BRAND } from '@/lib/config'

const services = [
  {
    icon: '✈️',
    title: 'Flight Booking',
    description: 'Best routes to Eritrea, Ethiopia, and beyond',
    link: '/flights',
  },
  {
    icon: '🛂',
    title: 'Visa Assistance',
    description: 'Document guidance for your destination',
    link: '/services',
  },
  {
    icon: '🏨',
    title: 'Accommodation',
    description: 'Trusted hotels and family stays',
    link: '/services',
  },
  {
    icon: '🚗',
    title: 'Ground Transport',
    description: 'Airport pickups and local transfers',
    link: '/services',
  },
]

const howItWorks = [
  {
    step: '1',
    title: 'Tell Us Your Trip',
    description: 'Share your destination, dates, and travel needs via WhatsApp.',
  },
  {
    step: '2',
    title: 'Get Expert Guidance',
    description: 'Our team responds within hours with options and recommendations.',
  },
  {
    step: '3',
    title: 'Confirm & Travel',
    description: 'Once you approve, we handle all the details. You just pack and go.',
  },
]

export default function LovableServices() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        {/* How It Works - Step 8 Clarity */}
        <div className="mb-20">
          <header className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              How It Works
            </h2>
            <p className="text-slate-600 text-lg">
              Planning your trip is simple. Here&rsquo;s how we help.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {howItWorks.map((item, idx) => (
              <div key={idx} className="relative text-center">
                {/* Step Number */}
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">
                  {item.description}
                </p>

                {/* Connector Line (hidden on mobile and last item) */}
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-0.5 bg-emerald-200" />
                )}
              </div>
            ))}
          </div>

          {/* Single CTA */}
          <div className="text-center mt-10">
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi! I'd like to start planning my trip.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
            >
              Start Planning
            </a>
          </div>
        </div>

        {/* Services Grid */}
        <div>
          <header className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              What We Offer
            </h2>
            <p className="text-slate-600 text-lg">
              Comprehensive travel support from booking to landing.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, idx) => (
              <Link
                key={idx}
                href={service.link}
                className="group p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
