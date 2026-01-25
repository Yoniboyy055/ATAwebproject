"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { BRAND } from '../lib/config'

export default function Navbar(){
  const [open,setOpen] = useState(false)
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-white/90 backdrop-blur-md py-4'}`}>
      <div className="container flex items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl tracking-tight text-slate-900">
          {BRAND.name}
        </Link>
        
        {/* Desktop Nav - Max 4 items */}
        <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-700">
          <Link href="/flights" className="hover:text-emerald-600 transition">Flights</Link>
          <Link href="/packages" className="hover:text-emerald-600 transition">Packages</Link>
          <Link href="/destinations" className="hover:text-emerald-600 transition">Destinations</Link>
          <Link href="/services" className="hover:text-emerald-600 transition">Services</Link>
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-emerald-600">
              Dashboard
            </Link>
          ) : (
             <Link href="/auth/signin" className="text-sm font-medium text-slate-700 hover:text-emerald-600">
              Sign In
            </Link>
          )}
          
          <a 
            href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors shadow-sm"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={()=>setOpen(!open)} className="md:hidden p-2 text-slate-900" aria-label="Toggle menu">
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl p-4 flex flex-col gap-4 animate-fade-in-up">
          <Link href="/flights" className="text-lg font-medium text-slate-900 py-2" onClick={()=>setOpen(false)}>Flights</Link>
          <Link href="/packages" className="text-lg font-medium text-slate-900 py-2" onClick={()=>setOpen(false)}>Packages</Link>
          <Link href="/destinations" className="text-lg font-medium text-slate-900 py-2" onClick={()=>setOpen(false)}>Destinations</Link>
          <Link href="/services" className="text-lg font-medium text-slate-900 py-2" onClick={()=>setOpen(false)}>Services</Link>
          <hr className="border-slate-100" />
          <Link href="/contact" className="text-lg font-medium text-slate-900 py-2" onClick={()=>setOpen(false)}>Contact Us</Link>
          {session ? (
             <Link href="/dashboard" className="text-lg font-medium text-slate-900 py-2" onClick={()=>setOpen(false)}>Dashboard</Link>
          ) : (
             <Link href="/auth/signin" className="text-lg font-medium text-slate-900 py-2" onClick={()=>setOpen(false)}>Sign In</Link>
          )}
          <a 
            href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}`}
            className="bg-emerald-600 text-white text-center font-bold py-3 rounded-lg"
          >
            Chat on WhatsApp
          </a>
        </div>
      )}
    </header>
  )
}
