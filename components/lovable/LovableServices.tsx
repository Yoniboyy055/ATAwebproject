import Link from 'next/link'

const services = [
  {
    icon: '✈️',
    title: 'Flights',
    description: 'Fast flight bookings with instant WhatsApp quotes',
    link: '/flights',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: '🛂',
    title: 'Visa & Documents',
    description: 'Complete visa support & document assistance',
    link: '/services',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: '🏨',
    title: 'Hotels & Stays',
    description: 'Handpicked accommodations at the best prices',
    link: '/services',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: '🗺️',
    title: 'Tours & Activities',
    description: 'Guided tours and local experiences',
    link: '/packages',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: '🚗',
    title: 'Ground Transport',
    description: 'Airport pickups and local transfers',
    link: '/services',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: '🎫',
    title: 'Full Trip Planning',
    description: 'Complete itinerary from start to finish',
    link: '/book',
    color: 'from-green-500 to-emerald-500'
  },
]

export default function LovableServices() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need to Travel
          </h2>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            From flights and visas to hotels and guided tours, we handle every aspect of your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <Link
              key={idx}
              href={service.link}
              className="group relative p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition duration-300`} />
              
              <div className="relative z-10">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 mb-6 group-hover:text-slate-700 transition">{service.description}</p>
                <div className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition gap-2">
                  Learn more
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-6">Not sure where to start?</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition shadow-lg hover:shadow-xl"
          >
            Chat with Our Experts
          </Link>
        </div>
      </div>
    </section>
  )
}
