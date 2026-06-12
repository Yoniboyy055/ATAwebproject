'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '◈' },
  { href: '/admin/enquiries', label: 'Enquiries', icon: '✉' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📋' },
  { href: '/admin/packages', label: 'Packages', icon: '🗂' },
  { href: '/admin/users', label: 'Users', icon: '👤' },
  { href: '/admin/payments', label: 'Payments', icon: '💳' },
  { href: '/admin/blog', label: 'Blog', icon: '✏' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
]

const navy = '#0A1628'
const navyLight = '#1a2f52'
const gold = '#C9A84C'
const goldLight = '#E2C97E'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Login page renders full-screen without sidebar
  if (pathname === '/admin/login') return <>{children}</>

  const signOut = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: navy,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
      }}>
        {/* Brand */}
        <div style={{ padding: '24px 20px', borderBottom: `1px solid ${navyLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}>✈</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Amanuel Travel</div>
              <div style={{ color: gold, fontSize: 11, letterSpacing: '0.06em' }}>OWNER PORTAL</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {NAV.map(item => {
            const active = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 8,
                  marginBottom: 2,
                  color: active ? gold : 'rgba(255,255,255,0.7)',
                  background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s',
                  borderLeft: active ? `3px solid ${gold}` : '3px solid transparent',
                }}
              >
                <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Sign out */}
        <div style={{ padding: 10, borderTop: `1px solid ${navyLight}` }}>
          <button
            onClick={signOut}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              color: 'rgba(255,255,255,0.6)',
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.background = 'rgba(255,255,255,0.08)'
              el.style.color = '#fff'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.background = 'transparent'
              el.style.color = 'rgba(255,255,255,0.6)'
            }}
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <header style={{
          background: '#fff',
          padding: '0 28px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>
            {NAV.find(n => n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href))?.label || 'Admin'}
          </span>
          <Link href="/" style={{ fontSize: 13, color: navy, textDecoration: 'none', fontWeight: 500 }}>
            ← View Site
          </Link>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 28 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
