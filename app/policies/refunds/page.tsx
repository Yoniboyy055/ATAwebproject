import SectionHeading from '../../../components/SectionHeading'
import Link from 'next/link'
import { BRAND } from '../../../lib/config'

export const metadata = {
  title: 'Changes & Refunds — Amanuel Travel',
  description: 'How airline changes, cancellations, and refunds work with Amanuel Travel.'
}

export default function ChangesRefunds() {
  return (
    <div>
      {/* Header */}
      <section className="section bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <SectionHeading>Changes & Refunds</SectionHeading>
          <p className="text-slate-700 max-w-2xl">
            How airline changes, cancellations, and refunds work.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container max-w-3xl space-y-8">

          <div>
            <h3 className="text-xl font-semibold mb-3">1. Airline Policy Controls Refunds</h3>
            <p className="text-slate-700">
              Refund eligibility depends on your <strong>fare type</strong> and <strong>airline policy</strong>. We do not determine refunds—the airline does.
            </p>
            <p className="text-slate-700 mt-3">
              When we provide a quote, we will tell you:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Whether the fare is refundable or non-refundable</li>
              <li>What conditions apply (e.g., cancellation deadline)</li>
              <li>Any change fees</li>
              <li>How refunds are processed</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">2. Common Fare Types</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-900">Non-Refundable (Budget) Fares</p>
                <p className="text-slate-700 text-sm">
                  You cannot get a refund. You can usually change the flight for a fee (if rules allow). If you don&apos;t use the ticket, it&apos;s forfeited.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Refundable Fares</p>
                <p className="text-slate-700 text-sm">
                  You can cancel and receive a refund to your original payment method. Timing and conditions vary by airline.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Partially Refundable Fares</p>
                <p className="text-slate-700 text-sm">
                  You get back part of your payment (minus service fees, taxes may be retained). Terms vary significantly.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">3. How to Request a Change or Cancellation</h3>
            <ol className="list-decimal pl-5 space-y-2 text-slate-700">
              <li><strong>Message us on WhatsApp</strong> with your booking details</li>
              <li>We will <strong>contact the airline</strong> to check what&apos;s possible</li>
              <li>We will <strong>explain your options</strong> and any fees involved</li>
              <li>You <strong>approve the change</strong> (or decline if fees are too high)</li>
              <li>We <strong>process the request</strong> and confirm with the airline</li>
              <li><strong>Refunds</strong> are issued directly by the airline to your original payment method (may take 5–14 days)</li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">4. Change Fees</h3>
            <p className="text-slate-700">
              Airlines often charge fees to change flights (even if the fare is refundable). Fees depend on:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Airline policy</li>
              <li>How far in advance you request the change</li>
              <li>Availability of alternative flights</li>
              <li>Fare type</li>
            </ul>
            <p className="text-slate-700 mt-3">
              We explain any fees before you proceed.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">5. Cancellation Deadlines</h3>
            <p className="text-slate-700">
              Most airlines allow refunds only if you cancel <strong>before the flight departs</strong>. If you miss your flight, the airline can deny a refund.
            </p>
            <p className="text-slate-700 mt-3">
              We recommend canceling as soon as you know you can&apos;t travel.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">6. Airline-Initiated Cancellations</h3>
            <p className="text-slate-700">
              If <strong>the airline</strong> cancels your flight, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Rebook on another flight at no cost</li>
              <li>Receive a refund (in most cases)</li>
              <li>Claim compensation (varies by route and regulation)</li>
            </ul>
            <p className="text-slate-700 mt-3">
              We will help you pursue these options.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">7. Our Service Fees (If Any)</h3>
            <p className="text-slate-700">
              If we charge a service fee for your booking, that fee is <strong>non-refundable</strong>. However, you may be eligible for an airline refund on the airfare itself (depending on fare type).
            </p>
            <p className="text-slate-700 mt-3">
              We will disclose service fees upfront before you book.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">8. Timeline for Refunds</h3>
            <p className="text-slate-700">
              Once the airline approves your refund:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Credit card refunds: 5–14 business days</li>
              <li>Bank transfer refunds: 7–21 business days (depending on your bank)</li>
              <li>Travel vouchers: issued immediately (if you accept)</li>
            </ul>
            <p className="text-slate-700 mt-3">
              We cannot speed up bank processing times.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">9. Disputes or Issues</h3>
            <p className="text-slate-700">
              If you disagree with an airline&apos;s refund decision or have a problem:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-slate-700">
              <li>WhatsApp us with details and your booking reference</li>
              <li>We will review the airline&apos;s decision and advise you</li>
              <li>We will advocate on your behalf if the airline made an error</li>
              <li>If escalation is needed, we will guide you through next steps</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <p className="text-sm font-semibold text-slate-900 mb-2">⚠ Important Disclaimer</p>
            <p className="text-sm text-slate-700">
              Airline policies change frequently. Refund and change terms are ultimately determined by airlines and regulations, not by us. Always confirm your fare rules at booking.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">10. Contact Us</h3>
            <p className="text-slate-700 mb-2">
              Need help with a change or refund? Reach out anytime:
            </p>
            <p className="text-slate-700">
              <strong>WhatsApp:</strong> <a href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`} className="text-accent/90 hover:underline">Chat now</a>
            </p>
            <p className="text-slate-700 mt-2">
              <strong>Email:</strong> <a href={`mailto:${BRAND.email}`} className="text-accent/90 hover:underline">{BRAND.email}</a>
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
