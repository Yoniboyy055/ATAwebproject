import Section from '../../components/Section'
import SectionHeader from '../../components/ui/SectionHeader'
import EnhancedContactForm from '../../components/EnhancedContactForm'
import { BRAND } from '../../lib/config'
import { Metadata } from 'next'
import { buttonClasses } from '@/components/ui/Button'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

export const metadata: Metadata = {
  title: 'Contact Us — Get Travel Help Now',
  description: 'Get in touch by phone, email, or WhatsApp for travel bookings and visa help. We respond within 1-2 hours.',
  keywords: ['contact', 'travel support', 'customer service'],
  openGraph: {
    title: 'Contact Amanuel Travel Agency',
    description: 'Reach us by phone, email, or WhatsApp for immediate travel assistance',
    url: `${baseUrl}/contact`,
    type: 'website',
    images: [
      {
        url: '/images/hero-1200.webp',
        width: 1200,
        height: 630,
        alt: 'Contact Amanuel Travel',
      }
    ]
  }
}

export default function Contact(){
  return (
    <div>
      {/* Header */}
      <Section className="bg-slate-50">
        <div className="container max-w-3xl">
          <SectionHeader
            title="Contact Us"
            subtitle="Tell us what you need and we will respond within 1–2 hours."
            align="left"
          />
        </div>
      </Section>

      {/* Contact Info */}
      <Section>
        <div className="container max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft-sm mb-8">
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3 text-lg">Our Office</h3>
              <div className="text-sm text-slate-700 space-y-1">
                <div>{BRAND.addressLine2}</div>
                <div>{BRAND.name}</div>
                <div>{BRAND.addressLine1}</div>
                <div>{BRAND.city}</div>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-6 space-y-2 text-sm">
              <div><span className="font-semibold">Office Phone:</span> <a href={`tel:${BRAND.phoneOffice}`} className="text-primary hover:underline">{BRAND.phoneOffice}</a></div>
              <div><span className="font-semibold">Mobile:</span> <a href={`tel:${BRAND.phoneMobile}`} className="text-primary hover:underline">{BRAND.phoneMobile}</a></div>
              <div><span className="font-semibold">Email:</span> <a href={`mailto:${BRAND.email}`} className="text-primary hover:underline">{BRAND.email}</a></div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`}
                  className={buttonClasses({ variant: 'primary', size: 'sm' })}
                >
                  Talk to an Agent
                </a>
              </div>
            </div>
          </div>

          {/* Enhanced Form */}
          <EnhancedContactForm />
        </div>
      </Section>
    </div>
  )
}
