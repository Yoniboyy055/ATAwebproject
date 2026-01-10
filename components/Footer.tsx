import { BRAND } from '../lib/config'
import Link from 'next/link'

export default function Footer(){
  return (
    <footer className="border-t border-slate-100 mt-12 bg-white">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="font-semibold mb-2">{BRAND.name}</div>
            <div className="text-sm text-slate-600">{BRAND.location} — Serving Eritrea & Ethiopia routes</div>
          </div>

          {/* Contact */}
          <div>
            <div className="font-semibold mb-3 text-sm">Contact</div>
            <div className="text-sm text-slate-700 space-y-2">
              <div>Phone: <a href={`tel:${BRAND.phone}`} className="text-accent/90 hover:underline">{BRAND.phone}</a></div>
              <div>Email: <a href={`mailto:${BRAND.email}`} className="text-accent/90 hover:underline">{BRAND.email}</a></div>
              <div><a href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`} className="inline-block bg-accent/90 text-white px-3 py-1 rounded text-xs font-semibold mt-2">Chat on WhatsApp</a></div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <div className="font-semibold mb-3 text-sm">Explore</div>
            <div className="text-sm text-slate-700 space-y-2">
              <div><Link href="/services" className="text-accent/90 hover:underline">Services</Link></div>
              <div><Link href="/destinations" className="text-accent/90 hover:underline">Destinations</Link></div>
              <div><Link href="/about" className="text-accent/90 hover:underline">About</Link></div>
              <div><Link href="/faq" className="text-accent/90 hover:underline">FAQ</Link></div>
            </div>
          </div>

          {/* Policies */}
          <div>
            <div className="font-semibold mb-3 text-sm">Policies</div>
            <div className="text-sm text-slate-700 space-y-2">
              <div><Link href="/policies" className="text-accent/90 hover:underline">Overview</Link></div>
              <div><Link href="/policies/privacy" className="text-accent/90 hover:underline">Privacy</Link></div>
              <div><Link href="/policies/terms" className="text-accent/90 hover:underline">Terms</Link></div>
              <div><Link href="/policies/refunds" className="text-accent/90 hover:underline">Changes & Refunds</Link></div>
              <div><Link href="/copyright" className="text-accent/90 hover:underline">Copyright</Link></div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-100 pt-6 text-center text-xs text-slate-600">
          <p>© 2025–2026 {BRAND.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
