import Section from '../../components/Section'
import SectionHeading from '../../components/SectionHeading'
import { BRAND } from '../../lib/config'

export const metadata = {
  title: 'FAQ — Amanuel Travel',
  description: 'Common questions about flights, visas, diaspora travel, and how we work.'
}

export default function FAQ() {
  const faqs = [
    {
      q: 'How do I request a quote?',
      a: 'Send us a message on WhatsApp with your origin city, destination, travel dates, and number of passengers. We&apos;ll reply with options, pricing, and guidance.'
    },
    {
      q: 'What information do you need from me?',
      a: 'Traveling from (city), traveling to (city), when (dates), how many people, and any special requests (stopovers, specific airlines, etc.). The more detail, the better we can help.'
    },
    {
      q: 'Do you only book flights?',
      a: 'No. We plan and coordinate whole trips: flights, visa checklists, hotel suggestions, transport coordination, and WhatsApp support until your trip is locked. Think of us as your trip concierge, not just a flight booker.'
    },
    {
      q: 'Can you help with visa requirements?',
      a: 'Yes—we provide practical guidance, checklists, and timelines. However, we&apos;re not lawyers. Visa rules vary by nationality and destination. We help you prepare; official embassies make final decisions.'
    },
    {
      q: 'How fast do you respond on WhatsApp?',
      a: 'We aim for replies within 1-2 hours during business hours, across most time zones. We work hard to keep communication fast and clear.'
    },
    {
      q: 'Can you plan stopovers or multi-city routes?',
      a: 'Absolutely. Complex routing is one of our strengths, especially for diaspora travelers. Tell us your needs, and we&apos;ll explore options.'
    },
    {
      q: 'Can you help with family or group travel?',
      a: 'Yes. Groups, families, multi-passenger bookings—we handle it all. In fact, we have a dedicated package for families: Family/Group Trip Builder.'
    },
    {
      q: 'Can you help diaspora travelers returning home?',
      a: 'Yes—that&apos;s a core focus. Whether you&apos;re flying from Canada, US, or Europe back to Eritrea or Ethiopia, we specialize in diaspora journeys and the unique coordination they need.'
    },
    {
      q: 'How do changes and cancellations work?',
      a: 'Airline rules vary by fare type and airline. We explain what&apos;s possible before you book. Changes and refunds depend on your ticket rules. We handle coordination via WhatsApp and guide you through the process.'
    },
    {
      q: 'Do you charge service fees?',
      a: 'Fees, if any, depend on the service and are disclosed upfront on WhatsApp. There are no hidden charges.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'Payment depends on the booking method and the airlines/partners involved. We confirm payment details and options during your quote conversation.'
    },
    {
      q: 'Can you help with baggage rules and seat selection?',
      a: 'We provide guidance on baggage rules and seat options based on airline policy. However, airline websites and check-in agents have final authority. We help clarify, but recommend confirming directly with your airline.'
    },
    {
      q: 'What if I don&apos;t see my question here?',
      a: 'WhatsApp us anytime. We love questions, and we&apos;ll answer honestly even if the answer is &ldquo;I don&apos;t know&rdquo; or &ldquo;You&apos;ll need to ask the airline.&rdquo;'
    }
  ]

  return (
    <div>
      {/* Header */}
      <Section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <SectionHeading>Frequently Asked Questions</SectionHeading>
          <p className="text-lg text-slate-700 max-w-2xl">
            Got questions? We&apos;ve got answers. If something&apos;s not here, WhatsApp us anytime.
          </p>
        </div>
      </Section>

      {/* FAQs */}
      <Section>
        <div className="container max-w-3xl">
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-slate-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-slate-50">
        <div className="container max-w-2xl text-center">
          <h3 className="text-2xl font-semibold mb-4">Still Have Questions&quest;</h3>
          <p className="text-slate-700 mb-6">
            Don&apos;t see your answer&quest; Reach out on WhatsApp—we&apos;re here to help.
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
