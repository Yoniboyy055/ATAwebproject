import Link from 'next/link'

const deals = [
  {
    id: 'asmara-city',
    title: 'Asmara City Break',
    duration: '3–5 days',
    price: 'From $600',
    icon: '🏛️',
    description: 'History, culture & local food'
  },
  {
    id: 'massawa-escape',
    title: 'Massawa Red Sea Escape',
    duration: '3–4 days',
    price: 'From $550',
    icon: '🌊',
    description: 'Beaches, history & diving'
  },
  {
    id: 'keren-heritage',
    title: 'Keren Heritage Tour',
    duration: '2–3 days',
    price: 'From $400',
    icon: '🏜️',
    description: 'War museum & mountain views'
  },
  {
    id: 'addis-stopover',
    title: 'Addis Ababa Stopover',
    duration: '2–3 days',
    price: 'From $450',
    icon: '🌃',
    description: 'Culture, food & markets'
  },
  {
    id: 'lalibela-gondar',
    title: 'Lalibela + Gondar Route',
    duration: '5–7 days',
    price: 'From $1200',
    icon: '⛪',
    description: 'UNESCO heritage sites'
  },
  {
    id: 'family-visit',
    title: 'Custom Family Visit',
    duration: 'Flexible',
    price: 'WhatsApp quote',
    icon: '👨‍👩‍👧‍👦',
    description: 'Diaspora-friendly itinerary'
  }
]

export default function FeaturedDeals() {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Popular Packages</h2>
          <p className="mt-2 text-slate-600">
            Ready-made itineraries tailored for diaspora & local travelers
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {deals.map(deal => (
            <div
              key={deal.id}
              className="p-6 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition bg-slate-50"
            >
              <div className="text-5xl mb-3">{deal.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900">{deal.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{deal.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-500">{deal.duration}</div>
                  <div className="text-lg font-bold text-emerald-600">{deal.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-slate-600 mb-4">
            💬 Prices vary by season and availability. <strong>WhatsApp us for live pricing &amp; custom packages.</strong>
          </p>
          <Link
            href="/packages"
            className="inline-flex items-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 font-semibold transition"
          >
            View All Packages
          </Link>
        </div>
      </div>
    </section>
  )
}
