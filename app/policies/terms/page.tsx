import SectionHeading from '../../../components/SectionHeading'
import Link from 'next/link'
import { BRAND } from '../../../lib/config'

export const metadata = {
  title: 'Terms of Service — Amanuel Travel',
  description: 'Terms and conditions for using Amanuel Travel services.'
}

export default function TermsOfService() {
  return (
    <div>
      {/* Header */}
      <section className="section bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <SectionHeading>Terms of Service</SectionHeading>
          <p className="text-slate-700 max-w-2xl">
            How we work together — scope, limitations, and what to expect.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container max-w-3xl space-y-8">

          <div>
            <h3 className="text-xl font-semibold mb-3">1. What We Do</h3>
            <p className="text-slate-700">
              Amanuel Travel provides travel guidance, flight routing, visa checklists, and booking coordination services. We are <strong>not</strong> a licensed airline, visa agency, or government authority. We act as an intermediary to help you plan and book travel.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">2. What We Don&apos;t Do</h3>
            <p className="text-slate-700">
              We do not:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Provide legal advice on visa requirements</li>
              <li>Guarantee visa approval</li>
              <li>Control airline schedules, pricing, or policies</li>
              <li>Guarantee flight availability or booking</li>
              <li>Provide immigration advice</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">3. Accuracy & Limitations</h3>
            <p className="text-slate-700 mb-3">
              We provide information based on current airline schedules and visa regulations. However:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Airline fares, schedules, and rules change constantly</li>
              <li>Visa requirements are set by embassies, not by us</li>
              <li>We recommend confirming all details directly with airlines and embassies</li>
              <li>Information is provided in good faith but without guarantee</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">4. Your Responsibilities</h3>
            <p className="text-slate-700">
              When using our service, you agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Provide accurate travel information (names, dates, passport details)</li>
              <li>Check your own passport validity and visa eligibility</li>
              <li>Confirm all details (schedules, fares, baggage rules) before booking</li>
              <li>Contact airlines directly for changes or cancellations</li>
              <li>Comply with immigration and airline regulations</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">5. Third-Party Services</h3>
            <p className="text-slate-700">
              When you book through us, you enter into a contract with the airline or booking partner, not directly with Amanuel Travel. Airlines and partners control:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Flight availability and pricing</li>
              <li>Cancellation and change policies</li>
              <li>Refund eligibility</li>
              <li>Baggage, seating, and special requests</li>
            </ul>
            <p className="text-slate-700 mt-3">
              We help coordinate but do not guarantee their services.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">6. Service Fees</h3>
            <p className="text-slate-700">
              Any service fees will be disclosed to you upfront on WhatsApp before you proceed. We do not charge hidden fees.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">7. Limitation of Liability</h3>
            <p className="text-slate-700">
              We are not liable for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Flight cancellations, delays, or schedule changes</li>
              <li>Visa denials or delays</li>
              <li>Missed connections due to airline error</li>
              <li>Baggage loss or damage</li>
              <li>Indirect losses (hotel rebooking, missed events, etc.)</li>
            </ul>
            <p className="text-slate-700 mt-3">
              These are controlled by airlines, embassies, and circumstances beyond our control.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">8. Changes to Terms</h3>
            <p className="text-slate-700">
              We may update these terms at any time. Changes take effect immediately upon posting. Your continued use of our service means acceptance of updated terms.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">9. Governing Law</h3>
            <p className="text-slate-700">
              These terms are governed by the laws of Eritrea and Ethiopia, where we operate. Any disputes will be resolved through good-faith discussion, mediation, or arbitration.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">10. Contact Us</h3>
            <p className="text-slate-700 mb-2">
              Questions? Email or WhatsApp us:
            </p>
            <p className="text-slate-700">
              <strong>Email:</strong> <a href={`mailto:${BRAND.email}`} className="text-accent/90 hover:underline">{BRAND.email}</a>
            </p>
            <p className="text-slate-700 mt-2">
              <strong>WhatsApp:</strong> <a href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`} className="text-accent/90 hover:underline">Chat now</a>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <p className="text-sm text-slate-600">
              <strong>Last updated:</strong> January 2026
            </p>
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="section bg-slate-50">
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
      </section>
    </div>
  )
}
