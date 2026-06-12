'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalBookings: number
  pendingBookings: number
  totalEnquiries: number
  newEnquiries: number
  totalUsers: number
  totalRevenue: number
}

const navy = '#0A1628'
const gold = '#C9A84C'

interface StatCard {
  key: keyof Stats
  sub?: keyof Stats
  subLabel?: string
  label: string
  icon: string
  href: string
  accent: string
  prefix?: string
}

const CARDS: StatCard[] = [
  { key: 'totalEnquiries', sub: 'newEnquiries', subLabel: 'new', label: 'Enquiries', icon: '✉', href: '/admin/enquiries', accent: '#0ea5e9' },
  { key: 'totalBookings', sub: 'pendingBookings', subLabel: 'pending', label: 'Bookings', icon: '📋', href: '/admin/bookings', accent: gold },
  { key: 'totalRevenue', label: 'Revenue', icon: '💳', href: '/admin/payments', accent: '#10b981', prefix: '$' },
  { key: 'totalUsers', label: 'Users', icon: '👤', href: '/admin/users', accent: '#8b5cf6' },
]

const QUICK = [
  { href: '/admin/enquiries', icon: '✉', label: 'View Enquiries', desc: 'Contact form inbox' },
  { href: '/admin/bookings', icon: '📋', label: 'Bookings', desc: 'Manage booking requests' },
  { href: '/admin/packages', icon: '🗂', label: 'Packages', desc: 'Create & edit packages' },
  { href: '/admin/blog', icon: '✏', label: 'Blog', desc: 'Manage content' },
  { href: '/admin/users', icon: '👤', label: 'Users', desc: 'View all users' },
  { href: '/admin/analytics', icon: '📈', label: 'Analytics', desc: 'Site insights' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalBookings: 0, pendingBookings: 0, totalEnquiries: 0, newEnquiries: 0, totalUsers: 0, totalRevenue: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setStats(d))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: navy, margin: '0 0 4px' }}>Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16, marginBottom: 28 }}>
        {CARDS.map(card => {
          const val = stats[card.key]
          const sub = card.sub ? stats[card.sub] : null
          return (
            <Link key={card.key} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: '20px 22px',
                border: '1px solid #e2e8f0',
                transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; el.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.boxShadow = 'none'; el.style.transform = 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 22 }}>{card.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: card.accent, background: `${card.accent}18`, padding: '3px 8px', borderRadius: 20 }}>
                    {card.label}
                  </span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: navy, lineHeight: 1 }}>
                  {loading ? '—' : ('prefix' in card ? `$${val.toLocaleString()}` : val)}
                </div>
                {sub !== null && !loading && (
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
                    <span style={{ color: sub > 0 ? '#f59e0b' : '#10b981', fontWeight: 600 }}>{sub}</span> {card.subLabel}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick actions */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '22px 24px', marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: navy, margin: '0 0 16px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
          {QUICK.map(q => (
            <Link key={q.href} href={q.href} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '16px',
                border: '2px dashed #e2e8f0',
                borderRadius: 10,
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = gold; el.style.background = '#fdf8ed' }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = '#e2e8f0'; el.style.background = 'transparent' }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{q.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: navy }}>{q.label}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{q.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Status */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '22px 24px' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: navy, margin: '0 0 16px' }}>System Status</h2>
        {[
          { label: 'Owner Portal', status: 'Active' },
          { label: 'Database', status: 'Connected' },
          { label: 'Public Site', status: 'Online' },
        ].map(row => (
          <div key={row.label} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 8,
            marginBottom: 8,
          }}>
            <span style={{ fontWeight: 500, color: '#14532d', fontSize: 14 }}>{row.label}</span>
            <span style={{ color: '#16a34a', fontWeight: 600, fontSize: 13 }}>✓ {row.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
