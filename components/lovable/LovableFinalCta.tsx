import Link from 'next/link'
import { BRAND } from '@/lib/config'

export default function LovableFinalCta() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-emerald-600 to-emerald-700">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Plan Your Journey?
          </h2>

          {/* Description */}
          <p className="text-lg text-emerald-50 mb-8">
            Let our travel experts help you create unforgettable memories. Whether you&rsquo;re exploring new destinations or returning home, we&rsquo;re here to make it seamless.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-lg font-bold transition shadow-lg hover:shadow-xl"
            >
              💬 WhatsApp: Book Now
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 rounded-lg font-bold transition"
            >
              📧 Send Email
            </Link>
          </div>

          {/* Contact Info */}
          <div className="bg-emerald-500 rounded-xl p-6 md:p-8 text-white">
            <p className="text-sm font-semibold mb-4 opacity-90">Get in Touch</p>
            <div className="space-y-3">
              <div>
                <p className="text-sm opacity-90">📱 Phone</p>
                <p className="font-bold text-lg">{BRAND.phoneOffice}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">✉️ Email</p>
                <p className="font-bold text-lg">{BRAND.email}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">📍 Location</p>
                <p className="font-bold">{BRAND.addressLine1}</p>
                <p className="text-sm">{BRAND.city}</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/packages" className="text-white hover:text-emerald-100 transition font-semibold text-sm">
              View Packages
            </Link>
            <span className="text-white opacity-50">•</span>
            <Link href="/destinations" className="text-white hover:text-emerald-100 transition font-semibold text-sm">
              Destinations
            </Link>
            <span className="text-white opacity-50">•</span>
            <Link href="/about" className="text-white hover:text-emerald-100 transition font-semibold text-sm">
              About Us
            </Link>
            <span className="text-white opacity-50">•</span>
            <Link href="/faq" className="text-white hover:text-emerald-100 transition font-semibold text-sm">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
