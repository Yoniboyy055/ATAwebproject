"use client"
import Link from 'next/link'
import { useState } from 'react'
import { BRAND } from '../lib/config'

export default function Navbar(){
  const [open,setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="font-semibold text-lg text-primary">{BRAND.name}</Link>
        <nav className="hidden md:flex gap-6 items-center text-sm">
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/destinations" className="hover:underline">Destinations</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <a className="ml-2 inline-flex items-center rounded-md bg-accent/90 text-white px-3 py-1 text-sm" href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`}>WhatsApp</a>
        </nav>
        <button onClick={()=>setOpen(!open)} aria-expanded={open} className="md:hidden p-2">
          <span className="sr-only">Open menu</span>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d={open?"M6 18L18 6M6 6l12 12":"M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-100">
          <div className="container py-4 flex flex-col gap-3">
            <Link href="/services">Services</Link>
            <Link href="/destinations">Destinations</Link>
            <Link href="/contact">Contact</Link>
            <a href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`} className="inline-flex items-center rounded-md bg-accent/90 text-white px-3 py-1 text-sm w-max">Chat on WhatsApp</a>
          </div>
        </div>
      )}
    </header>
  )
}
