'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Menu, Plane, X } from 'lucide-react'

export default function PublicNav() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="relative z-40 border-b border-[#d9e1e8] bg-white text-[#09233f]" aria-label="Main navigation">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0b44b]">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#092d50] text-[#d8a63f] shadow-sm"><Plane size={20}/></span>
          <span><b className="block font-serif text-xl leading-none">Amanuel Travel</b><small className="mt-1 block text-[9px] font-bold uppercase tracking-[.22em] text-[#607286]">Agency · Canada</small></span>
        </Link>
        <button className="grid h-11 w-11 place-items-center rounded-xl border border-[#ced8e1] lg:hidden" onClick={() => setOpen(!open)} aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="mobile-nav">{open?<X/>:<Menu/>}</button>
        <div id="mobile-nav" className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-[76px] flex-col gap-1 border-b border-[#d9e1e8] bg-white p-5 shadow-xl lg:static lg:flex lg:flex-row lg:items-center lg:gap-7 lg:border-0 lg:p-0 lg:shadow-none`}>
          <Link href="/" className="py-3 text-sm font-semibold">Home</Link>
          <Link href="/tours/flagship-preview" className="flex items-center gap-1 py-3 text-sm font-semibold">Flagship journey <ChevronDown size={14}/></Link>
          <Link href="/#destinations" className="py-3 text-sm font-semibold">Destinations</Link>
          <Link href="/#how-it-works" className="py-3 text-sm font-semibold">How ATA works</Link>
          <Link href="/ata-review" className="py-3 text-sm font-semibold">Review preview</Link>
          <Link href="/tours/flagship-preview#request" className="mt-2 rounded-lg bg-[#c58d22] px-5 py-3 text-center text-sm font-bold text-white shadow-sm hover:bg-[#a87418] lg:mt-0">Plan with ATA</Link>
        </div>
      </div>
    </nav>
  )
}
