'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import { isAdmin } from '@/lib/admin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && session?.user?.email && !isAdmin(session.user.email)) {
      router.push('/dashboard')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return null
  }

  const adminMenuItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { href: '/admin/packages', label: 'Packages', icon: '🎁' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/payments', label: 'Payments', icon: '💳' },
    { href: '/admin/blog', label: 'Blog Posts', icon: '📝' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white shadow-lg">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold">Amanuel Admin</h1>
          <p className="text-sm text-slate-400 mt-1">{session.user.email}</p>
        </div>

        <nav className="mt-6 space-y-1 px-3">
          {adminMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900">
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition text-red-400"
          >
            <span>🚪</span>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Back to Site →
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
