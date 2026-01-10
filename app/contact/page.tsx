import Section from '../../components/Section'
import SectionHeading from '../../components/SectionHeading'
import EnhancedContactForm from '../../components/EnhancedContactForm'
import { BRAND } from '../../lib/config'

export const metadata = {
  title: 'Contact — Amanuel Travel',
  description: 'Get in touch via WhatsApp, phone or email for travel bookings and visa help.'
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
            <h3 className="font-semibold text-slate-900 mb-4">Quick Contact Info</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div><span className="font-semibold">Phone:</span> {BRAND.phone}</div>
              <div><span className="font-semibold">Email:</span> {BRAND.email}</div>
              <div><span className="font-semibold">WhatsApp:</span> {BRAND.whatsapp}</div>
              <div><span className="font-semibold">Based:</span> {BRAND.location}</div>
            </div>
          </div>

          {/* Enhanced Form */}
          <EnhancedContactForm />
        </div>
      </Section>
    </div>
  )
}
