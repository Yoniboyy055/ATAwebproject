import Section from '../../components/Section'
import SectionHeading from '../../components/SectionHeading'
import Card from '../../components/Card'
import { services } from '../../lib/data'
import { BRAND } from '../../lib/config'
import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

export const metadata: Metadata = {
  title: 'Services — Flight Booking, Visa Assistance & Travel Support',
  description: 'Flight coordination, visa guidance, airport support, and WhatsApp-first travel assistance for diaspora and local travelers.',
  keywords: ['travel services', 'flight booking', 'visa assistance', 'travel support'],
  openGraph: {
    title: 'Our Travel Services',
    description: 'Complete travel solutions for Africa routes — flights, visas, packages & support',
    url: `${baseUrl}/services`,
    type: 'website',
    images: [
      {
        url: '/images/hero-1200.webp',
        width: 1200,
        height: 630,
        alt: 'Amanuel Travel Services',
      }
    ]
  }
}

export default function ServicesPage(){
  return (
    <div>
      {/* Header */}
      <Section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-3xl">
          <SectionHeading>Our Services</SectionHeading>
          <p className="text-lg text-slate-700">
            Comprehensive travel support designed for diaspora families and local travelers. From flight coordination to ground support, we handle every detail.
          </p>
        </div>
      </Section>

      {/* Services Grid */}
      <Section>
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map(s=> <Card key={s.title} title={s.title} description={s.desc} />)}
          </div>
        </div>
      </Section>

      {/* Benefits */}
      <Section className="bg-slate-50">
        <div className="container max-w-3xl">
          <SectionHeading>Why Choose Us</SectionHeading>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-emerald-600 font-bold text-xl flex-shrink-0">✓</span>
              <div>
                <h4 className="font-semibold text-slate-900">WhatsApp-First Communication</h4>
                <p className="text-slate-700">Fast, human replies across time zones—no phone queues, no confusion.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-emerald-600 font-bold text-xl flex-shrink-0">✓</span>
              <div>
                <h4 className="font-semibold text-slate-900">Diaspora Expertise</h4>
                <p className="text-slate-700">Years of experience helping diaspora travelers navigate complex routes home.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-emerald-600 font-bold text-xl flex-shrink-0">✓</span>
              <div>
                <h4 className="font-semibold text-slate-900">Transparent Pricing</h4>
                <p className="text-slate-700">No hidden fees. Clear guidance on costs and options upfront.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-emerald-600 font-bold text-xl flex-shrink-0">✓</span>
              <div>
                <h4 className="font-semibold text-slate-900">Local & Global Partners</h4>
                <p className="text-slate-700">Trusted relationships with airlines, visa specialists, and ground services.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="container max-w-2xl text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to Plan Your Journey?</h3>
          <p className="text-slate-700 mb-6">
            Tell us your route and dates on WhatsApp. We&apos;ll respond within 1-2 hours with options and guidance.
          </p>
          <a
            href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`}
            className="inline-block bg-accent/90 text-white px-6 py-3 rounded-md font-semibold hover:bg-accent transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      </Section>
    </div>
  )
}
