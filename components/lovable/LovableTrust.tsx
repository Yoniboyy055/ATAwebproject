const partners = [
  { name: 'Eritrean Airlines', logo: '✈️' },
  { name: 'Marriott Hotels', logo: '🏨' },
  { name: 'Lufthansa', logo: '✈️' },
  { name: 'Hilton Hotels', logo: '🏛️' },
  { name: 'Qatar Airways', logo: '✈️' },
  { name: 'Four Seasons', logo: '⭐' },
]

export default function LovableTrust() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Trusted by Thousands
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            We partner with global leaders in travel and hospitality
          </p>
        </div>

        {/* Two Column Layout: Local Outbound & Diaspora Returns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Local Outbound Travelers */}
          <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Local Travelers
            </h3>
            <p className="text-slate-700 mb-6">
              Eritrean residents exploring the world. We arrange flights, visas, and accommodations to Canada, USA, Europe, and the Middle East.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">✓</span>
                <span>Visa assistance & documentation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">✓</span>
                <span>International flight bookings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">✓</span>
                <span>Hotel & accommodation packages</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">✓</span>
                <span>Travel insurance options</span>
              </li>
            </ul>
          </div>

          {/* Diaspora Returns */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8">
            <div className="text-4xl mb-4">🏡</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Diaspora Returns
            </h3>
            <p className="text-slate-700 mb-6">
              Eritreans abroad reconnecting with home. We organize visits to Eritrea and Ethiopia with immersive cultural experiences.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold mt-1">✓</span>
                <span>Family reunion arrangements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold mt-1">✓</span>
                <span>Cultural immersion tours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold mt-1">✓</span>
                <span>Business travel packages</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold mt-1">✓</span>
                <span>Return flight & visa support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="pt-12 border-t border-slate-200">
          <p className="text-center text-slate-600 font-semibold mb-8">
            Trusted by Global Leaders
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners.map(partner => (
              <div
                key={partner.name}
                className="flex items-center justify-center p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{partner.logo}</span>
                  <span className="text-xs text-slate-600 text-center">{partner.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-6 mt-16 pt-12 border-t border-slate-200">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
              50K+
            </div>
            <p className="text-slate-600">Happy Travelers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
              25+
            </div>
            <p className="text-slate-600">Years Experience</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
              100%
            </div>
            <p className="text-slate-600">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  )
}
