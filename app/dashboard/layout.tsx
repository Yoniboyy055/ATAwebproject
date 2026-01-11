'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BRAND } from '@/lib/config'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/bookings', label: 'My Bookings', icon: '✈️' },
    { href: '/dashboard/saved-packages', label: 'Saved Packages', icon: '❤️' },
    { href: '/dashboard/quotes', label: 'Quote Requests', icon: '💬' },
    { href: '/dashboard/profile', label: 'Profile Settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-emerald-600">🌍</div>
              <span className="text-xl font-bold text-slate-900">Amanuel Travel</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* User Menu */}
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-sm text-slate-600">{session.user.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isMobileOpen ? 'block' : 'hidden'
          } lg:block w-full lg:w-64 bg-white border-r border-slate-200 p-6 space-y-6`}
        >
          {/* User Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
            <div className="text-4xl mb-2">👤</div>
            <h3 className="font-semibold text-slate-900 text-sm">{session.user.name}</h3>
            <p className="text-xs text-slate-600">{session.user.email}</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition-colors font-medium text-sm"
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Sign Out */}
          <div className="lg:hidden pt-6 border-t border-slate-200">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* WhatsApp Support */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-auto">
            <p className="text-xs font-medium text-slate-900 mb-2">Need Help?</p>
            <a
              href={`${BRAND.whatsappLink}?text=Hi, I have a question about my booking`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              💬 WhatsApp Support
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
