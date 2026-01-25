/**
 * Trust & Human Signals Section
 * 
 * CONSTITUTION RULES (STEP 9):
 * - Within first 1-2 sections show:
 *   - Who runs ATA
 *   - Who it serves (diaspora, families, etc.)
 *   - Why it exists
 *   - Real contact method
 * - Tone must be human, not corporate
 */

import { BRAND } from '@/lib/config'

export default function LovableTrust() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Who We Are - Human Story */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            A Travel Agency Built for Home
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            We started Amanuel Travel because we understand the journey home. For over 25 years, 
            we&rsquo;ve helped Eritrean and Ethiopian families stay connected — whether you&rsquo;re flying 
            home for a reunion, sending a loved one abroad, or planning your first visit back.
          </p>
          <p className="text-slate-600 mt-4">
            Based in Asmara, we provide personal WhatsApp support that works across time zones.
          </p>
        </div>

        {/* Who We Serve - Two Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Diaspora Families */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="text-4xl mb-4">🏡</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Diaspora Families
            </h3>
            <p className="text-slate-700 mb-4">
              Living in Canada, USA, Europe, or the Gulf? We help you visit home 
              without the stress. Family reunions, cultural trips, or business visits — we&rsquo;ve got you.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Multi-city routing for complex trips
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Coordinate arrivals across time zones
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Visa guidance for return visits
              </li>
            </ul>
          </div>

          {/* Local Travelers */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Local Travelers
            </h3>
            <p className="text-slate-700 mb-4">
              Based in Eritrea or Ethiopia and ready to explore? We arrange 
              flights, visas, and accommodations to destinations worldwide.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Best routing and competitive prices
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Visa documentation support
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Hotel and ground transport
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Stats - Simple, Honest */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                25+
              </div>
              <p className="text-slate-600 text-sm">Years in Business</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                50K+
              </div>
              <p className="text-slate-600 text-sm">Trips Arranged</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                &lt;2hr
              </div>
              <p className="text-slate-600 text-sm">WhatsApp Response</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                Real
              </div>
              <p className="text-slate-600 text-sm">People, Not Bots</p>
            </div>
          </div>
        </div>

        {/* Contact Info - Real, Visible */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-3">Have questions? Reach us directly.</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a 
              href={`tel:${BRAND.phoneOffice}`}
              className="text-slate-700 hover:text-emerald-600 transition-colors"
            >
              Office: {BRAND.phoneOffice}
            </a>
            <span className="text-slate-300">•</span>
            <a 
              href={`mailto:${BRAND.email}`}
              className="text-slate-700 hover:text-emerald-600 transition-colors"
            >
              {BRAND.email}
            </a>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700">{BRAND.city}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
