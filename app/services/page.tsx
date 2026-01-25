import Section from '../../components/Section'
import SectionHeader from '../../components/ui/SectionHeader'
import Card from '../../components/Card'
import { services } from '../../lib/data'
import { BRAND } from '../../lib/config'
import { Metadata } from 'next'
import { buttonClasses } from '@/components/ui/Button'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

export const metadata: Metadata = {
  title: 'Services — Flight Booking, Visa Assistance & Travel Support',
  description: 'Flight coordination, visa guidance, airport support, and human-led travel assistance for diaspora and local travelers.',
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
      <Section className="bg-slate-50">
        <div className="container max-w-3xl">
          <SectionHeader
            title="Our Services"
            subtitle="Comprehensive travel support designed for diaspora families and local travelers. From flight coordination to ground support, we handle every detail."
            align="left"
          />
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
          <SectionHeader
            title="Why Choose Us"
            align="left"
            className="mb-8"
          />
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-primary font-bold text-xl flex-shrink-0">✓</span>
              <div>
                <h4 className="font-semibold text-slate-900">Direct Agent Communication</h4>
                <p className="text-slate-700">Fast, human replies across time zones—no queues, no confusion.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-primary font-bold text-xl flex-shrink-0">✓</span>
              <div>
                <h4 className="font-semibold text-slate-900">Diaspora Expertise</h4>
                <p className="text-slate-700">Years of experience helping diaspora travelers navigate complex routes home.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-primary font-bold text-xl flex-shrink-0">✓</span>
              <div>
                <h4 className="font-semibold text-slate-900">Transparent Pricing</h4>
                <p className="text-slate-700">No hidden fees. Clear guidance on costs and options upfront.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-primary font-bold text-xl flex-shrink-0">✓</span>
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
          <SectionHeader
            title="Ready to plan your journey?"
            subtitle="Tell us your route and dates. We will respond within 1–2 hours with options and guidance."
          />
          <a
            href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`}
            className={buttonClasses({ variant: 'primary', size: 'lg' })}
          >
            Talk to an Agent
          </a>
          <p className="mt-3 text-sm text-slate-500">
            Available by WhatsApp, phone, or email.
          </p>
        </div>
      </Section>
    </div>
  )
}
