import Link from 'next/link'

const faqs = [
  {
    id: 1,
    question: 'Do I need a visa to travel to Eritrea?',
    answer: 'Visa requirements depend on your nationality. We provide visa assistance and can guide you through the application process. Contact us for specific requirements.',
  },
  {
    id: 2,
    question: 'What payment methods do you accept?',
    answer: 'We accept bank transfers, credit cards, and digital payment methods. Payment plans are available for packages over a certain amount.',
  },
  {
    id: 3,
    question: 'Can you arrange group tours?',
    answer: 'Yes! We specialize in group tours for families, diaspora communities, and organizations. Contact us for custom group packages.',
  },
  {
    id: 4,
    question: 'What is your cancellation policy?',
    answer: 'Cancellations made 30+ days before travel receive a full refund. Our detailed policy is available on our Policies page.',
  },
]

export default function LovableFaqPreview() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Quick answers to common questions. See our full FAQ page for more details.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map(faq => (
            <details
              key={faq.id}
              className="group rounded-lg border border-slate-200 hover:border-emerald-300 transition cursor-pointer"
            >
              <summary className="p-5 md:p-6 font-semibold text-slate-900 flex items-center justify-between hover:bg-slate-50 transition">
                <span>{faq.question}</span>
                <span className="text-2xl text-emerald-600 group-open:rotate-180 transition">
                  +
                </span>
              </summary>
              <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 text-slate-700 border-t border-slate-200">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        {/* CTA to Full FAQ */}
        <div className="text-center mt-12">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold transition shadow-lg hover:shadow-xl"
          >
            View All FAQs →
          </Link>
        </div>
      </div>
    </section>
  )
}
