'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/tours/flagship-preview', label: 'The journey' },
  { href: '/#destinations', label: 'Destinations' },
  { href: '/#how-it-works', label: 'How we work' },
]

/**
 * `overlay` floats the nav over a full-bleed hero; `solid` sits on a light page.
 * Owner and review routes are intentionally absent — they are reached by direct
 * link only, never from a customer-facing surface.
 */
export default function PublicNav({
  variant = 'solid',
}: {
  variant?: 'overlay' | 'solid'
}) {
  const [open, setOpen] = useState(false)
  const overlay = variant === 'overlay'

  return (
    <nav
      aria-label="Main navigation"
      className={`${
        overlay
          ? 'absolute inset-x-0 top-0 z-40 border-white/15 text-white'
          : 'relative z-40 border-ata-hairline bg-white text-ata-ink'
      } border-b`}
    >
      <div className="mx-auto flex min-h-[88px] max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <Link
          href="/"
          className="group focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-8 focus-visible:outline-current"
        >
          <span className="block font-serif text-[26px] font-normal leading-none tracking-[-0.01em]">
            Amanuel Travel
          </span>
          <span
            className={`mt-1.5 block text-[9px] font-medium uppercase tracking-eyebrow ${
              overlay ? 'text-white/55' : 'text-ata-ink-muted'
            }`}
          >
            Agency · Canada
          </span>
        </Link>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className={`grid h-11 w-11 place-items-center border lg:hidden ${
            overlay ? 'border-white/25' : 'border-ata-hairline'
          }`}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div
          id="mobile-nav"
          className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-[88px] flex-col gap-1 border-b border-ata-hairline bg-white p-6 text-ata-ink shadow-xl lg:static lg:flex lg:flex-row lg:items-center lg:gap-10 lg:border-0 lg:bg-transparent lg:p-0 lg:text-inherit lg:shadow-none`}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 text-[11px] font-medium uppercase tracking-eyebrow transition-opacity hover:opacity-60 lg:py-0"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/tours/flagship-preview#request"
            onClick={() => setOpen(false)}
            className={`mt-3 border px-7 py-3.5 text-center text-[11px] font-medium uppercase tracking-eyebrow transition-colors lg:mt-0 ${
              overlay
                ? 'border-white/35 hover:bg-white hover:text-ata-ink'
                : 'border-ata-ink hover:bg-ata-ink hover:text-white'
            }`}
          >
            Start planning
          </Link>
        </div>
      </div>
    </nav>
  )
}
