'use client'

import { useState, useEffect, useCallback } from 'react'

interface AnalyticsData {
  totalEnquiries: number
  newEnquiries: number
  totalBookingRequests: number
  totalUsers: number
  newsletterSignups: number
  revenue: number
  recentEnquiries: Array<{
    id: string
    name: string
    service: string
    status: string
    createdAt: string
  }>
}

const navy = '#0A1628'
const gold = '#C9A84C'

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/admin/analytics')
      if (res.ok) {
        const d = await res.json()
        setData(d)
      } else {
        setError(true)
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
    new: { color: '#f59e0b', bg: '#fef3c7' },
    read: { color: '#3b82f6', bg: '#eff6ff' },
    replied: { color: '#10b981', bg: '#d1fae5' },
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: navy, margin: '0 0 4px' }}>Analytics</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Real database counts and recent activity</p>
        </div>
        <button
          onClick={load}
          style={{ padding: '7px 16px', borderRadius: 20, border: '2px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Loading…</div>
      ) : error || !data ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          Failed to load analytics.{' '}
          <button onClick={load} style={{ color: gold, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
            Try again
          </button>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total Enquiries', value: data.totalEnquiries, color: '#3b82f6' },
              { label: 'New Enquiries', value: data.newEnquiries, color: '#f59e0b' },
              { label: 'Booking Requests', value: data.totalBookingRequests, color: gold },
              { label: 'Total Users', value: data.totalUsers, color: '#7c3aed' },
              { label: 'Newsletter Signups', value: data.newsletterSignups, color: '#10b981' },
              { label: 'Revenue (USD)', value: `$${(data.revenue || 0).toLocaleString()}`, color: navy },
            ].map(card => (
              <div key={card.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '20px 24px' }}>
                <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.label}
                </p>
                <p style={{ fontSize: 34, fontWeight: 700, color: card.color, margin: 0 }}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Enquiries */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: navy, margin: 0 }}>Recent Enquiries</h2>
            </div>
            {!data.recentEnquiries || data.recentEnquiries.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>No recent enquiries.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    {['Name', 'Service', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.recentEnquiries.map(enq => {
                    const sc = STATUS_COLORS[enq.status] || { color: '#64748b', bg: '#f1f5f9' }
                    return (
                      <tr key={enq.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: navy }}>{enq.name}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{enq.service}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 600,
                            color: sc.color,
                            background: sc.bg,
                          }}>
                            {enq.status.charAt(0).toUpperCase() + enq.status.slice(1)}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          {new Date(enq.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Note */}
          <div style={{ marginTop: 20, padding: '14px 18px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              <strong style={{ color: navy }}>Note:</strong> Real-time event tracking (page views, sessions) requires Google Analytics or similar integration.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
