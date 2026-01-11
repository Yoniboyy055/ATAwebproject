"use client"
import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { BRAND } from '../lib/config'

export default function Navbar(){
  const [open,setOpen] = useState(false)
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="font-semibold text-lg text-primary">{BRAND.name}</Link>
        <nav className="hidden md:flex gap-6 items-center text-sm">
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/destinations" className="hover:underline">Destinations</Link>
          <Link href="/packages" className="hover:underline">Packages</Link>
          <Link href="/flights" className="hover:underline font-semibold text-blue-600">✈️ Flights</Link>
          <Link href="/content" className="hover:underline">Resources</Link>
          <Link href="/book" className="hover:underline font-semibold text-blue-600">Book</Link>
          <Link href="/search" className="hover:underline font-semibold text-emerald-600">Search</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/faq" className="hover:underline">FAQ</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <a className="ml-2 inline-flex items-center rounded-md bg-accent/90 text-white px-3 py-1 text-sm" href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`}>WhatsApp</a>
          
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
            <Link href="/auth/signin" className="ml-2 inline-flex items-center rounded-md bg-emerald-600 text-white px-3 py-1 text-sm hover:bg-emerald-700">
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
            <Link href="/services">Services</Link>
            <Link href="/destinations">Destinations</Link>
            <Link href="/packages">Packages</Link>
            <Link href="/flights" className="font-semibold text-blue-600">✈️ Flights</Link>
            <Link href="/content">Resources</Link>
            <Link href="/book" className="font-semibold text-blue-600">📅 Book Trip</Link>
            <Link href="/search" className="font-semibold text-emerald-600">🔍 Advanced Search</Link>
            <Link href="/about">About</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/reviews">Reviews</Link>
            <Link href="/dashboard/wishlist" className="font-semibold text-red-600">❤️ Wishlist</Link>
            {status === 'authenticated' && session?.user ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <button
                  onClick={() => signOut()}
                  className="text-left text-slate-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/signin">Sign In</Link>
            )}
            <a href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`} className="inline-flex items-center rounded-md bg-accent/90 text-white px-3 py-1 text-sm w-max">Chat on WhatsApp</a>
          </div>
        </div>
      )}
    </header>
  )
}
