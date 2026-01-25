"use client"
import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { BRAND } from '../lib/config'
import { buttonClasses } from '@/components/ui/Button'

export default function Navbar(){
  const [open,setOpen] = useState(false)
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="font-semibold text-lg text-primary">{BRAND.name}</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/destinations" className="hover:underline">Destinations</Link>
          <Link href="/packages" className="hover:underline">Packages</Link>
          <Link href="/content" className="hover:underline">Guides</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <a
            className={buttonClasses({ variant: 'primary', size: 'sm', className: 'ml-2' })}
            href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`}
          >
            Talk to an Agent
          </a>
          
          {/* Auth Links */}
          {status === 'authenticated' && session?.user ? (
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
              <Link href="/reviews" className="hover:underline">Reviews</Link>
              <Link href="/dashboard/wishlist" className="hover:underline">❤️ Wishlist</Link>
              <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/auth/signin" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Sign In
            </Link>
          )}
        </nav>
        <button onClick={()=>setOpen(!open)} aria-expanded={open} className="md:hidden p-2">
          <span className="sr-only">Open menu</span>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d={open?"M6 18L18 6M6 6l12 12":"M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-100">
          <div className="container py-4 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Explore</p>
            <Link href="/services" className="py-1">Services</Link>
            <Link href="/destinations" className="py-1">Destinations</Link>
            <Link href="/packages" className="py-1">Packages</Link>
            <Link href="/content" className="py-1">Guides</Link>
            <Link href="/about" className="py-1">About</Link>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mt-2">Plan</p>
            <Link href="/flights" className="py-1">Flights</Link>
            <Link href="/book" className="py-1">Book Trip</Link>
            <Link href="/search" className="py-1">Search</Link>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mt-2">Support</p>
            <Link href="/faq" className="py-1">FAQ</Link>
            <Link href="/contact" className="py-1">Contact</Link>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mt-2">Account</p>
            <Link href="/reviews" className="py-1">Reviews</Link>
            <Link href="/dashboard/wishlist" className="py-1">Wishlist</Link>
            {status === 'authenticated' && session?.user ? (
              <>
                <Link href="/dashboard" className="py-1">Dashboard</Link>
                <button
                  onClick={() => signOut()}
                  className="text-left text-slate-600 py-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="py-1">Sign In</Link>
            )}
            <a
              href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`}
              className={buttonClasses({ variant: 'primary', size: 'sm', className: 'w-max' })}
            >
              Talk to an Agent
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
