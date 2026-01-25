import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import { buttonClasses } from '@/components/ui/Button'

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
    <section className="bg-white py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Answers before you commit"
          subtitle="Quick guidance on visas, payments, and group travel."
          className="mb-12"
        />

        {/* FAQ Items */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map(faq => (
            <details
              key={faq.id}
              className="group rounded-lg border border-slate-200 transition hover:border-slate-300"
            >
              <summary className="p-5 md:p-6 font-semibold text-slate-900 flex items-center justify-between hover:bg-slate-50 transition">
                <span>{faq.question}</span>
                <span className="text-2xl text-slate-500 group-open:rotate-180 transition">
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
            className={buttonClasses({ variant: 'secondary', size: 'lg' })}
          >
            View All FAQs
          </Link>
        </div>
      </div>
    </section>
  )
}
