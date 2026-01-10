import Link from 'next/link'
import { BRAND } from '@/lib/config'

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Travel?
          </h2>
          <p className="mt-4 text-lg text-emerald-50">
            Get a personalized quote in under 2 hours. No hassle, just fast & friendly WhatsApp support.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              className="inline-flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-emerald-600 px-8 py-4 font-bold transition"
            >
              💬 WhatsApp Us Now
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white hover:bg-emerald-800 text-white px-8 py-4 font-bold transition"
            >
              📧 Contact Form
            </Link>
          </div>
          <p className="mt-6 text-sm text-emerald-100">
            📞 {BRAND.phoneMobile} | ✉️ {BRAND.email}
          </p>
        </div>
      </div>
    </section>
  )
}
