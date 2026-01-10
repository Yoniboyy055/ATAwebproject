import Link from 'next/link'

export default function DestinationsMap() {
  return (
    <section id="destinations" className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Top Destinations</h2>
          <p className="mt-2 text-slate-600">
            Eritrea & Ethiopia — expertly curated routes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Local Outbound */}
          <div className="p-8 rounded-xl border-2 border-blue-200 bg-blue-50">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="text-2xl font-bold text-slate-900">Local Outbound</h3>
            <p className="mt-2 text-slate-700">
              From Asmara/Addis → Canada, USA, Europe, Gulf
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>✈️ Best routing & low fares</li>
              <li>📋 Visa guidance for 50+ countries</li>
              <li>💼 Work permit support</li>
              <li>📞 Support across time zones</li>
            </ul>
            <Link
              href="/destinations"
              className="mt-4 inline-block text-blue-600 font-semibold hover:underline"
            >
              Explore → →
            </Link>
          </div>

          {/* Diaspora Returns */}
          <div className="p-8 rounded-xl border-2 border-emerald-200 bg-emerald-50">
            <div className="text-3xl mb-3">🏡</div>
            <h3 className="text-2xl font-bold text-slate-900">Diaspora Returns</h3>
            <p className="mt-2 text-slate-700">
              From Canada/USA/Europe → Eritrea/Ethiopia
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>✈️ Multi-city & stopovers</li>
              <li>🏨 Hotel + ground transport</li>
              <li>🎁 Custom family visit itineraries</li>
              <li>💬 Same-day WhatsApp responses</li>
            </ul>
            <Link
              href="/destinations"
              className="mt-4 inline-block text-emerald-600 font-semibold hover:underline"
            >
              Explore → →
            </Link>
          </div>
        </div>
        <div className="text-center">
          <Link
            href="/destinations"
            className="inline-flex items-center rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 font-semibold transition"
          >
            View All Destinations
          </Link>
        </div>
      </div>
    </section>
  )
}
