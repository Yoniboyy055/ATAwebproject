import Section from '../../components/Section'
import SectionHeading from '../../components/SectionHeading'
import QuoteForm from '../../components/QuoteForm'
import { BRAND } from '../../lib/config'

export const metadata = {
  title: 'Contact — Amanuel Travel',
  description: 'Get in touch via WhatsApp, phone or email for travel bookings and visa help.'
}

export default function Contact(){
  return (
    <div>
      <Section>
        <div className="container">
          <h1 className="text-2xl font-semibold">Contact</h1>
          <SectionHeading>Contact Us</SectionHeading>
          <div className="space-y-3">
            <p className="text-slate-700 max-w-xl">We prioritize WhatsApp for fast replies. Provide a few details and we’ll get back to you promptly.</p>
            <div className="text-sm text-slate-700">Business: <strong>Asmara, Eritrea</strong> — Serving Eritrea & Ethiopia routes worldwide</div>
            <div className="mt-2">
              <a href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`} className="inline-flex items-center rounded-md bg-accent/90 text-white px-4 py-2">Chat on WhatsApp</a>
            </div>
          </div>

          {/* Client-side form for contact */}
          <div className="mt-6 max-w-xl">
            <QuoteForm className="grid grid-cols-1 md:grid-cols-2 gap-3" />
          </div>
        </div>
      </Section>
    </div>
  )
}
