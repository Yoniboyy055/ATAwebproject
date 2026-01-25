export default function LovableTrust() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Two Column Layout: Local Outbound & Diaspora Returns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      </div>
    </section>
  )
}
