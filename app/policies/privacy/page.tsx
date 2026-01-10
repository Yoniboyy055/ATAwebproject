import Section from '../../../components/Section'
import SectionHeading from '../../../components/SectionHeading'
import Link from 'next/link'
import { BRAND } from '../../../lib/config'

export const metadata = {
  title: 'Privacy Policy — Amanuel Travel',
  description: 'How Amanuel Travel collects, uses, and protects your personal information.'
}

export default function PrivacyPolicy() {
  return (
    <div>
      {/* Header */}
      <Section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <SectionHeading>Privacy Policy</SectionHeading>
          <p className="text-slate-700 max-w-2xl">
            How we handle your data and protect your privacy.
          </p>
        </div>
      </Section>

      {/* Content */}
      <Section>
        <div className="container max-w-3xl space-y-8">
          
          <div>
            <h3 className="text-xl font-semibold mb-3">1. Information We Collect</h3>
            <p className="text-slate-700 mb-3">
              When you use our quote form or contact us on WhatsApp, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Full name</li>
              <li>WhatsApp phone number</li>
              <li>Origin and destination cities</li>
              <li>Travel dates and number of passengers</li>
              <li>Special notes or requests</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">2. How We Use Your Information</h3>
            <p className="text-slate-700">
              We use your information solely to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Respond to your quote request with travel options</li>
              <li>Provide guidance on visas, flights, and travel logistics</li>
              <li>Communicate with you about your booking or journey</li>
              <li>Follow up if you haven&apos;t completed your travel plans</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">3. Data Retention</h3>
            <p className="text-slate-700">
              We keep your information for as long as needed to serve you. You can request deletion at any time by messaging us on WhatsApp.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">4. Data Sharing</h3>
            <p className="text-slate-700">
              We do not sell or share your personal data with third parties for marketing. We may share your information with:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Airlines and booking partners (if you proceed with a booking)</li>
              <li>Visa service providers (for visa guidance, if applicable)</li>
              <li>Local ground partners in Eritrea/Ethiopia (for trip coordination, with your knowledge)</li>
            </ul>
            <p className="text-slate-700 mt-3">
              These partners are bound by confidentiality and only receive information needed for your specific journey.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">5. Security</h3>
            <p className="text-slate-700">
              We take reasonable steps to protect your data:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>WhatsApp messages are encrypted end-to-end</li>
              <li>Form data is stored securely</li>
              <li>We don&apos;t store payment information (airlines handle that)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">6. Your Rights</h3>
            <p className="text-slate-700">
              You have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Access your information</li>
              <li>Request correction or deletion</li>
              <li>Opt out of non-essential communications</li>
            </ul>
            <p className="text-slate-700 mt-3">
              Contact us on WhatsApp to exercise any of these rights.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">7. Contact Us</h3>
            <p className="text-slate-700 mb-2">
              Questions about this privacy policy? Email us:
            </p>
            <p className="text-slate-700">
              <strong>Email:</strong> <a href={`mailto:${BRAND.email}`} className="text-accent/90 hover:underline">{BRAND.email}</a>
            </p>
            <p className="text-slate-700 mt-2">
              Or message us on WhatsApp: <a href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`} className="text-accent/90 hover:underline">Chat now</a>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <p className="text-sm text-slate-600">
              <strong>Last updated:</strong> January 2026
            </p>
          </div>

        </div>
      </Section>

      {/* Footer CTA */}
      <Section className="bg-slate-50">
        <div className="container max-w-2xl text-center">
          <p className="text-slate-700 mb-6">
            <Link href="/policies" className="text-accent/90 hover:underline font-semibold">← Back to Policies</Link>
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
