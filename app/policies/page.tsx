import Section from '../../components/Section'
import SectionHeading from '../../components/SectionHeading'
import Link from 'next/link'
import { BRAND } from '../../lib/config'

export const metadata = {
  title: 'Policies — Amanuel Travel',
  description: 'Privacy, Terms, Changes & Refunds, and Copyright information.'
}

export default function Policies() {
  const policyLinks = [
    { href: '/policies/privacy', title: 'Privacy Policy', desc: 'How we handle your data and protect your privacy.' },
    { href: '/policies/terms', title: 'Terms of Service', desc: 'How we work together — scope, limitations, and what to expect.' },
    { href: '/policies/refunds', title: 'Changes & Refunds', desc: 'How airline changes, cancellations, and refunds work.' },
    { href: '/copyright', title: 'Copyright & Attribution', desc: 'Site content ownership and usage rights.' }
  ]

  return (
    <div>
      {/* Header */}
      <Section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <SectionHeading>Policies</SectionHeading>
          <p className="text-lg text-slate-700 max-w-2xl">
            Transparency is trust. Here&apos;s everything you need to know about how we handle your data, our service scope, and how changes and refunds work.
          </p>
        </div>
      </Section>

      {/* Policy Cards */}
      <Section>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {policyLinks.map((policy, idx) => (
              <Link
                key={idx}
                href={policy.href}
                className="block p-6 border border-slate-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{policy.title}</h3>
                <p className="text-slate-600 text-sm">{policy.desc}</p>
                <div className="mt-4 text-accent/90 font-semibold text-sm">Read Policy →</div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* Summary */}
      <Section className="bg-slate-50">
        <div className="container max-w-3xl">
          <h3 className="text-2xl font-semibold mb-4">In Brief</h3>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-2">
              <span className="text-accent/90 font-bold">•</span>
              <span><strong>Privacy:</strong> We collect only what&apos;s necessary (name, phone, travel dates, notes). We don&apos;t sell your data. We keep records secure and delete on request.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent/90 font-bold">•</span>
              <span><strong>Service scope:</strong> We provide travel guidance and booking coordination. We&apos;re not lawyers or official agencies. Final authority belongs to airlines, embassies, and immigration authorities.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent/90 font-bold">•</span>
              <span><strong>Airline rules:</strong> Schedules, fares, baggage rules, and cancellation policies change often. We help you understand them, but airlines have final say.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent/90 font-bold">•</span>
              <span><strong>Changes & refunds:</strong> Depend on your ticket type and airline policy. We help coordinate changes; refunds follow airline rules.</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="container max-w-2xl text-center">
          <h3 className="text-2xl font-semibold mb-4">Questions About Our Policies?</h3>
          <p className="text-slate-700 mb-6">
            Feel free to ask us on WhatsApp. We&apos;re happy to clarify anything.
          </p>
          <a
            href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}?text=I have a question about your policies.`}
            className="inline-block bg-accent/90 text-white px-6 py-3 rounded-md font-semibold hover:bg-accent transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      </Section>
    </div>
  )
}
