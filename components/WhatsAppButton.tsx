import { BRAND } from '../lib/config'

export default function WhatsAppButton({phone, label='Chat on WhatsApp'}:{phone?:string, label?:string}){
  const href = `https://wa.me/${encodeURIComponent(phone || BRAND.whatsapp)}`
  return (
    <a href={href} className="inline-flex items-center gap-2 rounded-md bg-accent/90 text-white px-3 py-2" rel="noopener noreferrer">
      {label}
    </a>
  )
}
