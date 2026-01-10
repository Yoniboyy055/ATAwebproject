import { BRAND } from '@/lib/config'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16 md:py-24 grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{BRAND.name}</h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Your trusted travel partner connecting diaspora families with home. Premium travel arrangements for Eritrea, Ethiopia, and beyond.
            </p>
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              💬 WhatsApp
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-white">Explore</h4>
            <ul className="space-y-3 text-slate-300">
              <li><Link href="/services" className="hover:text-emerald-400 transition">Services</Link></li>
              <li><Link href="/destinations" className="hover:text-emerald-400 transition">Destinations</Link></li>
              <li><Link href="/packages" className="hover:text-emerald-400 transition">Packages</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition">About Us</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-bold mb-6 text-white">Learn More</h4>
            <ul className="space-y-3 text-slate-300">
              <li><Link href="/faq" className="hover:text-emerald-400 transition">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition">Contact Us</Link></li>
              <li><Link href="/policies" className="hover:text-emerald-400 transition">Policies</Link></li>
              <li><Link href="/copyright" className="hover:text-emerald-400 transition">Copyright</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-6 text-white">Contact</h4>
            <div className="space-y-4 text-slate-300">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Office Phone</p>
                <a href={`tel:${BRAND.phoneOffice}`} className="font-semibold hover:text-emerald-400 transition">
                  {BRAND.phoneOffice}
                </a>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Mobile</p>
                <a href={`tel:${BRAND.phoneMobile}`} className="font-semibold hover:text-emerald-400 transition">
                  {BRAND.phoneMobile}
                </a>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Email</p>
                <a href={`mailto:${BRAND.email}`} className="font-semibold hover:text-emerald-400 transition text-sm">
                  {BRAND.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700"></div>

        {/* Bottom Footer */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
          <div>
            <p>📍 {BRAND.addressLine1}, {BRAND.city}</p>
            <p>Managing Director — {BRAND.addressLine2}</p>
          </div>
          <p>© 2025 {BRAND.name}. All rights reserved.</p>
          <p>Prices vary by season and availability. WhatsApp for live quotes.</p>
        </div>
      </div>
    </footer>
  )
}
