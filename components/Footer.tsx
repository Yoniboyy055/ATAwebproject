import { BRAND } from '@/lib/config'
import Link from 'next/link'
import NewsletterSignup from './NewsletterSignup'
import { buttonClasses } from '@/components/ui/Button'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-slate-800 text-white">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-slate-300">
                Get exclusive travel tips, visa updates, and special offers delivered to your inbox.
              </p>
            </div>
            <NewsletterSignup />
          </div>
        </div>
      </div>

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
              className={buttonClasses({
                variant: 'primary',
                size: 'sm',
                className: 'bg-white text-slate-900 hover:bg-white/90'
              })}
            >
              Talk to an Agent
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-white">Explore</h4>
            <ul className="space-y-3 text-slate-300">
              <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/destinations" className="hover:text-white transition">Destinations</Link></li>
              <li><Link href="/packages" className="hover:text-white transition">Packages</Link></li>
              <li><Link href="/flights" className="hover:text-white transition">Flights</Link></li>
              <li><Link href="/content" className="hover:text-white transition">Resources</Link></li>
              <li><Link href="/book" className="hover:text-white transition">Book Trip</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-bold mb-6 text-white">Learn More</h4>
            <ul className="space-y-3 text-slate-300">
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/policies" className="hover:text-white transition">Policies</Link></li>
              <li><Link href="/copyright" className="hover:text-white transition">Copyright</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-6 text-white">Contact</h4>
            <div className="space-y-4 text-slate-300">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Office Phone</p>
                <a href={`tel:${BRAND.phoneOffice}`} className="font-semibold hover:text-white transition">
                  {BRAND.phoneOffice}
                </a>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Mobile</p>
                <a href={`tel:${BRAND.phoneMobile}`} className="font-semibold hover:text-white transition">
                  {BRAND.phoneMobile}
                </a>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Email</p>
                <a href={`mailto:${BRAND.email}`} className="font-semibold hover:text-white transition text-sm">
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
            <p>{BRAND.addressLine1}, {BRAND.city}</p>
            <p>Managing Director — {BRAND.addressLine2}</p>
          </div>
          <p>© 2025 {BRAND.name}. All rights reserved.</p>
          <p>Prices vary by season and availability. Contact us for live quotes.</p>
        </div>
      </div>
    </footer>
  )
}
