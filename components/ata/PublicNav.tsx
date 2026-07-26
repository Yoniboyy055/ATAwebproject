'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PublicNav() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="relative z-40 border-b border-white/15 bg-[#0c3032] text-white" aria-label="Main navigation">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link href="/" className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0b44b]">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[#f0b44b] font-serif text-lg text-[#f0b44b]">A</span>
          <span><b className="block font-serif text-lg leading-none">Amanuel Travel Agency</b><small className="mt-1 block text-[9px] uppercase tracking-[.24em] text-white/65">Travel with human guidance</small></span>
        </Link>
        <button className="rounded-full border border-white/25 px-4 py-2 text-sm lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav">Menu</button>
        <div id="mobile-nav" className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-20 flex-col gap-4 border-b border-white/15 bg-[#0c3032] p-6 lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:p-0`}>
          <Link href="/tours/flagship-preview">Flagship tour</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/ata-review">ATA review</Link>
          <Link href="/tours/flagship-preview#request" className="rounded-full bg-[#f0b44b] px-5 py-3 font-bold text-[#102c2d]">Request a conversation</Link>
        </div>
      </div>
    </nav>
  )
}

