import Section from '../../components/Section'
import SectionHeading from '../../components/SectionHeading'
import EnhancedContactForm from '../../components/EnhancedContactForm'
import { BRAND } from '../../lib/config'
import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

export const metadata: Metadata = {
  title: 'Contact Us — Get Travel Help Now',
  description: 'Get in touch via WhatsApp, phone or email for travel bookings and visa help. We respond within 1-2 hours.',
  keywords: ['contact', 'travel support', 'customer service', 'WhatsApp'],
  openGraph: {
    title: 'Contact Amanuel Travel Agency',
    description: 'Reach us via WhatsApp, phone, or email for immediate travel assistance',
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
      <Section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-3xl">
          <SectionHeading>Contact Us</SectionHeading>
          <p className="text-lg text-slate-700">
            We prioritize WhatsApp for fast replies across all time zones. Tell us what you need, and we&apos;ll respond within 1-2 hours.
          </p>
        </div>
      </Section>

      {/* Contact Info */}
      <Section>
        <div className="container max-w-3xl">
          <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
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
              <div><span className="font-semibold">Office Phone:</span> <a href={`tel:${BRAND.phoneOffice}`} className="text-blue-600 hover:underline">{BRAND.phoneOffice}</a></div>
              <div><span className="font-semibold">Mobile:</span> <a href={`tel:${BRAND.phoneMobile}`} className="text-blue-600 hover:underline">{BRAND.phoneMobile}</a></div>
              <div><span className="font-semibold">Email:</span> <a href={`mailto:${BRAND.email}`} className="text-blue-600 hover:underline">{BRAND.email}</a></div>
              <div className="pt-2"><a href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium text-sm transition">💬 Chat on WhatsApp</a></div>
            </div>
          </div>

          {/* Enhanced Form */}
          <EnhancedContactForm />
        </div>
      </Section>
    </div>
  )
}
