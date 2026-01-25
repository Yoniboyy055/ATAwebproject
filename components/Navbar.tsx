"use client"

/**
 * Navbar - Trust-First Navigation
 * 
 * CONSTITUTION RULES:
 * - Max 4 nav items (core pages only)
 * - Agency name/logo always visible
 * - Visible contact path (WhatsApp CTA)
 * - Mobile-friendly
 * - No looping animations
 * - No hidden critical links
 */

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { BRAND } from '../lib/config'

// Core navigation - 4 items max per constitution
const NAV_ITEMS = [
  { href: '/packages', label: 'Packages' },
  { href: '/flights', label: 'Flights' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-200/50 shadow-soft">
      <div className="container flex items-center justify-between py-3 md:py-4">
        {/* Logo/Brand - Always Visible */}
        <Link 
          href="/" 
          className="font-bold text-lg md:text-xl text-slate-900 hover:text-emerald-600 transition-colors"
        >
          {BRAND.name}
        </Link>

        {/* Desktop Navigation - 4 Core Items */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          {/* Primary CTA - WhatsApp */}
          <a
            href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi! I'd like to plan a trip.`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Chat on WhatsApp
          </a>

          {/* Auth - Secondary */}
          {status === 'authenticated' && session?.user ? (
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
              <Link 
                href="/dashboard" 
                className="text-sm text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              href="/auth/signin" 
              className="text-sm text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setOpen(!open)} 
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="md:hidden p-2 -mr-2 text-slate-700 hover:text-slate-900 transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="container py-4 space-y-1">
            {/* Core Navigation */}
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-base font-medium text-slate-700 hover:text-emerald-600 transition-colors border-b border-slate-100"
              >
                {item.label}
              </Link>
            ))}

            {/* Secondary Links */}
            <div className="pt-3 pb-2 space-y-1 border-t border-slate-200 mt-3">
              <Link 
                href="/services" 
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-slate-600"
              >
                All Services
              </Link>
              <Link 
                href="/destinations" 
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-slate-600"
              >
                Destinations
              </Link>
              <Link 
                href="/faq" 
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-slate-600"
              >
                FAQ
              </Link>
            </div>

            {/* Auth */}
            {status === 'authenticated' && session?.user ? (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <Link 
                  href="/dashboard" 
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm font-medium text-emerald-600"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="block py-2 text-sm text-slate-500"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-slate-600 mt-3"
              >
                Sign In
              </Link>
            )}

            {/* Primary CTA */}
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi! I'd like to plan a trip.`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-center bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Chat on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
