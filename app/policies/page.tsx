import Link from 'next/link'
import { BRAND } from '@/lib/config'
import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

export const metadata: Metadata = {
  title: 'Policies — Amanuel Travel',
  description: 'Privacy, Terms, Changes & Refunds, and Copyright information.',
  openGraph: {
    title: 'Policies - Amanuel Travel',
    description: 'Transparency is trust. Learn about our policies for privacy, terms, and refunds.',
    url: `${baseUrl}/policies`,
    type: 'website',
  }
}

export default function Policies() {
  const policyLinks = [
    { href: '/policies/privacy', title: 'Privacy Policy', desc: 'How we handle your data and protect your privacy.' },
    { href: '/policies/terms', title: 'Terms of Service', desc: 'How we work together — scope, limitations, and what to expect.' },
    { href: '/policies/refunds', title: 'Changes & Refunds', desc: 'How airline changes, cancellations, and refunds work.' },
    { href: '/copyright', title: 'Copyright & Attribution', desc: 'Site content ownership and usage rights.' }
  ]

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12 md:py-20">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Policies &amp; Legal</h1>
          <p className="text-lg md:text-xl text-emerald-50 max-w-2xl mx-auto">
            Transparency is trust. Here&rsquo;s everything you need to know about how we handle your data, our service scope, and how changes and refunds work.
          </p>
        </div>
      </section>

      {/* Policy Cards */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {policyLinks.map((policy, idx) => (
              <Link
                key={idx}
                href={policy.href}
                className="block p-8 border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-lg transition bg-white"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition">
                  {policy.title}
                </h3>
                <p className="text-slate-600 text-base mb-4">{policy.desc}</p>
                <div className="text-emerald-600 font-semibold text-sm flex items-center gap-1">
                  Read Policy <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
            In Brief
          </h2>
          <div className="space-y-6">
            <div className="rounded-xl bg-white border border-slate-200 p-6">
              <div className="flex gap-4">
                <div className="text-2xl">🔒</div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Privacy &amp; Data Protection</h4>
                  <p className="text-slate-700">
                    We collect only what&rsquo;s necessary (name, phone, travel dates, notes). We don&rsquo;t sell your data. We keep records secure and delete on request.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 p-6">
              <div className="flex gap-4">
                <div className="text-2xl">⚖️</div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Service Scope &amp; Limitations</h4>
                  <p className="text-slate-700">
                    We provide travel guidance and booking coordination. We&rsquo;re not lawyers or official agencies. Final authority belongs to airlines, embassies, and immigration authorities.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 p-6">
              <div className="flex gap-4">
                <div className="text-2xl">✈️</div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Airline Rules &amp; Policies</h4>
                  <p className="text-slate-700">
                    Schedules, fares, baggage rules, and cancellation policies change often. We help you understand them, but airlines have final say.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 p-6">
              <div className="flex gap-4">
                <div className="text-2xl">💰</div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Changes &amp; Refunds</h4>
                  <p className="text-slate-700">
                    Depend on your ticket type and airline policy. We help coordinate changes; refunds follow airline rules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Questions About Our Policies?
          </h2>
          <p className="text-lg text-slate-700 mb-8 max-w-2xl mx-auto">
            Feel free to ask us on WhatsApp. We&rsquo;re happy to clarify anything.
          </p>
          <a
            href={`https://wa.me/${BRAND.whatsappNumber}?text=I have a question about your policies.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold transition shadow-lg"
          >
            💬 WhatsApp Us
          </a>
        </div>
      </section>
    </main>
  )
}
