"use client"
import { useState } from 'react'
import { BRAND } from '../lib/config'

type Props = {
  className?: string
}

export default function QuoteForm({ className }: Props){
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const f = new FormData(e.currentTarget)
    const name = f.get('name')?.toString() || ''
    const phone = f.get('phone')?.toString() || ''
    const fromCity = f.get('from')?.toString() || ''
    const toCity = f.get('to')?.toString() || ''
    const message = f.get('message')?.toString() || ''
    const text = encodeURIComponent(`Hello, I'm ${name}. From: ${fromCity}. To: ${toCity}. Phone: ${phone}. Message: ${message}`)
    try {
      window.open(`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}?text=${text}`, '_blank')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      <input name="name" placeholder="Full name" className="input" />
      <input name="phone" placeholder="WhatsApp / Phone" className="input" />
      <input name="from" placeholder="From city" className="input" />
      <input name="to" placeholder="To city" className="input" />
      <textarea name="message" placeholder="Message (optional)" className="textarea md:col-span-2" />
      <div className="md:col-span-2 flex gap-2">
        <button className="rounded-md bg-primary text-white px-4 py-2" disabled={loading}>{loading ? 'Opening…' : 'Send via WhatsApp'}</button>
        <a href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`} className="inline-flex items-center rounded-md border border-slate-200 px-3 py-2">Or start a chat</a>
      </div>
    </form>
  )
}
