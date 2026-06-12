'use client'

import { useEffect, useState, useCallback } from 'react'

interface BookingRequest {
  id: string
  fullName: string
  phone: string
  email: string | null
  fromCity: string
  toCity: string
  departDate: string | null
  returnDate: string | null
  passengers: number
  tripType: string
  contactMethod: string
  notes: string | null
  status: 'new' | 'contacted' | 'closed'
  createdAt: string
}

const navy = '#0A1628'
const gold = '#C9A84C'

const STATUS_CONFIG = {
  new: { label: 'New', color: '#f59e0b', bg: '#fef3c7' },
  contacted: { label: 'Contacted', color: '#3b82f6', bg: '#eff6ff' },
  closed: { label: 'Closed', color: '#10b981', bg: '#d1fae5' },
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/bookings')
      if (res.ok) {
        const d = await res.json()
        setBookings(d.bookings || [])
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const setStatus = async (id: string, status: BookingRequest['status']) => {
    try {
      await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
  const counts = {
    all: bookings.length,
    new: bookings.filter(b => b.status === 'new').length,
    contacted: bookings.filter(b => b.status === 'contacted').length,
    closed: bookings.filter(b => b.status === 'closed').length,
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: navy, margin: '0 0 4px' }}>Booking Requests</h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Flight booking requests from your website</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['all', 'new', 'contacted', 'closed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 16px',
              borderRadius: 20,
              border: filter === f ? `2px solid ${gold}` : '2px solid #e2e8f0',
              background: filter === f ? `${gold}18` : '#fff',
              color: filter === f ? navy : '#64748b',
              fontWeight: filter === f ? 600 : 400,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span style={{ marginLeft: 6, opacity: 0.7 }}>({counts[f]})</span>
          </button>
        ))}
        <button
          onClick={load}
          style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 20, border: '2px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>No booking requests found</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                {['Name', 'Contact', 'Route', 'Trip Type', 'Date', 'Passengers', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(bk => {
                const sc = STATUS_CONFIG[bk.status]
                const isNew = bk.status === 'new'
                const isExpanded = expanded === bk.id
                return (
                  <>
                    <tr
                      key={bk.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: isNew ? '#fffbeb' : '#fff',
                        cursor: 'pointer',
                      }}
                      onClick={() => setExpanded(isExpanded ? null : bk.id)}
                    >
                      <td style={{ padding: '13px 16px', fontWeight: isNew ? 600 : 400, color: navy, fontSize: 14 }}>
                        {isNew && <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', marginRight: 8 }} />}
                        {bk.fullName}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>
                        <div>{bk.phone}</div>
                        {bk.email && <div style={{ color: '#94a3b8' }}>{bk.email}</div>}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>
                        {bk.fromCity} → {bk.toCity}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>
                        <span style={{ textTransform: 'capitalize' }}>{bk.tripType.replace('-', ' ')}</span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {bk.departDate
                          ? new Date(bk.departDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569', textAlign: 'center' }}>
                        {bk.passengers}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                          color: sc.color,
                          background: sc.bg,
                        }}>
                          {sc.label}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {bk.status === 'new' && (
                            <button
                              onClick={e => { e.stopPropagation(); setStatus(bk.id, 'contacted') }}
                              style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: `1px solid ${gold}`, background: 'transparent', color: gold, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                            >
                              Mark Contacted
                            </button>
                          )}
                          {bk.status === 'contacted' && (
                            <button
                              onClick={e => { e.stopPropagation(); setStatus(bk.id, 'closed') }}
                              style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #10b981', background: 'transparent', color: '#10b981', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                            >
                              Mark Closed
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${bk.id}-detail`} style={{ background: '#f8fafc' }}>
                        <td colSpan={8} style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 14 }}>
                            <div>
                              <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 2px' }}>Trip Type</p>
                              <p style={{ fontSize: 13, color: '#475569', margin: 0, textTransform: 'capitalize' }}>{bk.tripType.replace('-', ' ')}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 2px' }}>Depart</p>
                              <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>{bk.departDate ? new Date(bk.departDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</p>
                            </div>
                            {bk.returnDate && (
                              <div>
                                <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 2px' }}>Return</p>
                                <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>{new Date(bk.returnDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                              </div>
                            )}
                            <div>
                              <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 2px' }}>Passengers</p>
                              <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>{bk.passengers}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 2px' }}>Contact Method</p>
                              <p style={{ fontSize: 13, color: '#475569', margin: 0, textTransform: 'capitalize' }}>{bk.contactMethod}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 2px' }}>Submitted</p>
                              <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>{new Date(bk.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                          </div>
                          {bk.notes && (
                            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, marginBottom: 14 }}>
                              <strong style={{ color: navy }}>Notes:</strong> {bk.notes}
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <a
                              href={`tel:${bk.phone}`}
                              style={{ fontSize: 12, color: navy, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, border: `1px solid ${navy}` }}
                            >
                              📞 {bk.phone}
                            </a>
                            <a
                              href={`https://wa.me/${bk.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: 12, color: '#16a34a', textDecoration: 'none', padding: '5px 12px', borderRadius: 6, border: '1px solid #16a34a' }}
                            >
                              WhatsApp
                            </a>
                            {bk.email && (
                              <a
                                href={`mailto:${bk.email}?subject=Re: Flight booking ${bk.fromCity} to ${bk.toCity}`}
                                style={{ fontSize: 12, color: '#3b82f6', textDecoration: 'none', padding: '5px 12px', borderRadius: 6, border: '1px solid #3b82f6' }}
                              >
                                Email
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
