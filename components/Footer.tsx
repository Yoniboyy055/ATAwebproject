import { BRAND } from '../lib/config'

export default function Footer(){
  return (
    <footer className="border-t border-slate-100 mt-12 bg-white">
      <div className="container py-8 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <div className="font-semibold">{BRAND.name}</div>
          <div className="text-sm text-slate-600">{BRAND.location} — Serving Eritrea & Ethiopia routes</div>
        </div>
        <div className="text-sm text-slate-700">
          <div>Address placeholder</div>
          <div>Phone: <a href={`tel:${BRAND.phone}`} className="underline">{BRAND.phone}</a></div>
          <div>Email: <a href={`mailto:${BRAND.email}`} className="underline">{BRAND.email}</a></div>
          <div className="mt-2"><a href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`} className="inline-block bg-accent/90 text-white px-3 py-1 rounded-md">Chat on WhatsApp</a></div>
        </div>
      </div>
    </footer>
  )
}
