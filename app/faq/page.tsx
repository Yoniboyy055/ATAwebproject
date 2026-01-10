import { BRAND } from '@/lib/config'
import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

export const metadata: Metadata = {
  title: 'FAQ — Flights, Visas & Travel Help',
  description: 'Common questions about flights, visas, diaspora travel, and how we work.',
  keywords: ['FAQ', 'frequently asked questions', 'travel help', 'flight booking'],
  openGraph: {
    title: 'Frequently Asked Questions',
    description: 'Get answers to common questions about travel booking, visas, and our services',
    url: `${baseUrl}/faq`,
    type: 'website',
  }
}

export default function FAQ() {
  const faqs = [
    {
      q: 'How do I request a quote?',
      a: 'Send us a message on WhatsApp with your origin city, destination, travel dates, and number of passengers. We\'ll reply with options, pricing, and guidance.'
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
      a: 'Yes—we provide practical guidance, checklists, and timelines. However, we\'re not lawyers. Visa rules vary by nationality and destination. We help you prepare; official embassies make final decisions.'
    },
    {
      q: 'How fast do you respond on WhatsApp?',
      a: 'We aim for replies within 1-2 hours during business hours, across most time zones. We work hard to keep communication fast and clear.'
    },
    {
      q: 'Can you plan stopovers or multi-city routes?',
      a: 'Absolutely. Complex routing is one of our strengths, especially for diaspora travelers. Tell us your needs, and we\'ll explore options.'
    },
    {
      q: 'Can you help with family or group travel?',
      a: 'Yes. Groups, families, multi-passenger bookings—we handle it all. In fact, we have a dedicated package for families: Family/Group Trip Builder.'
    },
    {
      q: 'Can you help diaspora travelers returning home?',
      a: 'Yes—that\'s a core focus. Whether you\'re flying from Canada, US, or Europe back to Eritrea or Ethiopia, we specialize in diaspora journeys and the unique coordination they need.'
    },
    {
      q: 'How do changes and cancellations work?',
      a: 'Airline rules vary by fare type and airline. We explain what\'s possible before you book. Changes and refunds depend on your ticket rules. We handle coordination via WhatsApp and guide you through the process.'
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
      q: 'What if I don\'t see my question here?',
      a: 'WhatsApp us anytime. We love questions, and we\'ll answer honestly even if the answer is "I don\'t know" or "You\'ll need to ask the airline."'
    }
  ]

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12 md:py-20">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl text-emerald-50 max-w-2xl mx-auto">
            Get answers to common questions about travel booking, visas, and our services
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-lg border border-slate-200 hover:border-emerald-300 transition cursor-pointer"
              >
                <summary className="p-5 md:p-6 font-semibold text-slate-900 flex items-center justify-between hover:bg-slate-50 transition">
                  <span>{faq.q}</span>
                  <span className="text-2xl text-emerald-600 group-open:rotate-180 transition">
                    +
                  </span>
                </summary>
                <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 text-slate-700 border-t border-slate-200">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-emerald-50">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Still Have Questions?
          </h2>
          <p className="text-lg text-slate-700 mb-8 max-w-2xl mx-auto">
            Don&rsquo;t see your answer? Reach out on WhatsApp&mdash;we&rsquo;re here to help.
          </p>
          <a
            href={`https://wa.me/${BRAND.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold transition shadow-lg"
          >
            💬 WhatsApp Us
          </a>
        </div>
      </section>
    </main>
  )
}
