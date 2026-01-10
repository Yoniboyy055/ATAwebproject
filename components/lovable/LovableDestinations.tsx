import Link from 'next/link'

const destinations = [
  { name: 'Asmara', country: 'Eritrea', icon: '🏛️', description: 'History, culture & local food', rating: '4.9', startingPrice: '$699' },
  { name: 'Massawa', country: 'Eritrea', icon: '🌊', description: 'Beaches, history & diving', rating: '4.8', startingPrice: '$599' },
  { name: 'Addis Ababa', country: 'Ethiopia', icon: '🌃', description: 'Culture, food & markets', rating: '4.7', startingPrice: '$549' },
  { name: 'Keren', country: 'Eritrea', icon: '🏜️', description: 'Heritage & mountain views', rating: '5.0', startingPrice: '$379' },
  { name: 'Lalibela', country: 'Ethiopia', icon: '⛪', description: 'UNESCO heritage sites', rating: '4.9', startingPrice: '$899' },
  { name: 'Gondar', country: 'Ethiopia', icon: '👑', description: 'Ancient castles & culture', rating: '4.8', startingPrice: '$799' },
]

export default function LovableDestinations() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Popular Destinations
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Explore our most sought-after destinations and find inspiration for your next journey.
          </p>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map(dest => (
            <Link
              key={`${dest.name}-${dest.country}`}
              href={`/destinations?search=${dest.name}`}
              className="group rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-400 hover:shadow-xl transition duration-300 bg-white"
            >
              {/* Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white overflow-hidden">
                <div className="text-6xl">{dest.icon}</div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition">
                  {dest.name}
                </h3>
                <p className="text-sm text-slate-600 mb-3">{dest.country}</p>
                <p className="text-sm text-slate-700 mb-4">{dest.description}</p>

                {/* Rating & Price */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-sm font-semibold text-slate-900">
                    ⭐ {dest.rating}
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    From {dest.startingPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-bold transition shadow-lg hover:shadow-xl"
          >
            Explore All Destinations →
          </Link>
        </div>
      </div>
    </section>
  )
}
