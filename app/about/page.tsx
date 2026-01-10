import Section from '../../components/Section'
import SectionHeading from '../../components/SectionHeading'
import Card from '../../components/Card'
import { BRAND } from '../../lib/config'
import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

export const metadata: Metadata = {
  title: 'About Amanuel Travel — Diaspora & Local Travel Support',
  description: 'Learn about Amanuel Travel: WhatsApp-first service for diaspora travelers and local outbound journeys from Eritrea.',
  keywords: ['about', 'travel agency', 'diaspora', 'Eritrea', 'travel support'],
  openGraph: {
    title: 'About Amanuel Travel Agency',
    description: 'Your trusted WhatsApp-first travel partner for diaspora and local travel from Eritrea',
    url: `${baseUrl}/about`,
    type: 'website',
    images: [
      {
        url: '/images/hero-1200.webp',
        width: 1200,
        height: 630,
        alt: 'About Amanuel Travel',
      }
    ]
  }
}

export default function About() {
  return (
    <div>
      {/* Hero/Header */}
      <Section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <SectionHeading>About Amanuel Travel</SectionHeading>
          <p className="text-lg text-slate-700 max-w-2xl">
            We&apos;re a WhatsApp-first travel agency built for diaspora families and local travelers from Eritrea. No waiting on hold. No confusion. Just fast, human answers on the channel you already use.
          </p>
        </div>
      </Section>

      {/* Our Story */}
      <Section>
        <div className="container">
          <h3 className="text-2xl font-semibold mb-6">Our Story</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <Card title="Why We Started" description="We saw families struggle with diaspora travel. Airlines, visa rules, stopovers, baggage—too much complexity on too many platforms. We decided to simplify it." />
            <Card title="What We Do" description="We guide diaspora travelers (Canada, US, Europe → Eritrea/Ethiopia) and local travelers (Eritrea → abroad) through flight routing, visa requirements, and trip coordination—all on WhatsApp." />
            <Card title="Our Promise" description="Fast replies, clear answers, no hidden fees, and genuine local expertise. We work with trusted partners and deliver honest guidance about airline rules, visa requirements, and practical logistics." />
            <Card title="Who We Serve" description="Diaspora families planning homecomings. Local travelers heading abroad for work or study. Groups and multi-city routes. Anyone who values speed, clarity, and transparency." />
          </div>
        </div>
      </Section>

      {/* Trust */}
      <Section className="bg-slate-50">
        <div className="container">
          <h3 className="text-2xl font-semibold mb-6">Why People Choose Us</h3>
          <ul className="space-y-3 text-slate-700 max-w-2xl">
            <li className="flex gap-2">
              <span className="text-accent/90 font-bold">✓</span>
              <span><strong>WhatsApp-first:</strong> No waiting for emails or portal logins—real answers in minutes.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent/90 font-bold">✓</span>
              <span><strong>Diaspora expertise:</strong> We specialize in the complex routes, stopovers, and multi-city plans that overseas travelers need.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent/90 font-bold">✓</span>
              <span><strong>Honest about limits:</strong> We tell you what airline rules are, what visa guidance we can offer, and what requires official channels.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent/90 font-bold">✓</span>
              <span><strong>No hidden fees:</strong> We disclose service costs upfront on WhatsApp—no surprises at checkout.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent/90 font-bold">✓</span>
              <span><strong>Local partners:</strong> We work with trusted contacts in Eritrea and Ethiopia for ground support and coordination.</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="container max-w-2xl text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to Plan Your Journey?</h3>
          <p className="text-slate-700 mb-6">
            Have a question about us? Want to chat before requesting a quote? We&apos;re here on WhatsApp.
          </p>
          <a
            href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}?text=Hi, I have a question about Amanuel Travel.`}
            className="inline-block bg-accent/90 text-white px-6 py-3 rounded-md font-semibold hover:bg-accent transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      </Section>
    </div>
  )
}
