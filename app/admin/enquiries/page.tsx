'use client'

import { useEffect, useState, useCallback } from 'react'

interface Enquiry {
  id: string
  name: string
  phone: string
  email: string
  service: string
  details: string | null
  status: 'new' | 'read' | 'replied'
  createdAt: string
}

const navy = '#0A1628'
const gold = '#C9A84C'

const STATUS_CONFIG = {
  new: { label: 'New', color: '#f59e0b', bg: '#fef3c7' },
  read: { label: 'Read', color: '#3b82f6', bg: '#eff6ff' },
  replied: { label: 'Replied', color: '#10b981', bg: '#d1fae5' },
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/enquiries')
      if (res.ok) {
        const d = await res.json()
        setEnquiries(d.enquiries || [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const setStatus = async (id: string, status: Enquiry['status']) => {
    await fetch('/api/admin/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e))
  }

  const filtered = filter === 'all' ? enquiries : enquiries.filter(e => e.status === filter)
  const counts = {
    all: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    read: enquiries.filter(e => e.status === 'read').length,
    replied: enquiries.filter(e => e.status === 'replied').length,
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: navy, margin: '0 0 4px' }}>Enquiries</h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Contact form submissions from your website</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['all', 'new', 'read', 'replied'] as const).map(f => (
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
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
            No enquiries yet
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                {['Name', 'Contact', 'Service', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(enq => {
                const sc = STATUS_CONFIG[enq.status]
                const isNew = enq.status === 'new'
                return (
                  <>
                    <tr
                      key={enq.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: isNew ? '#fffbeb' : '#fff',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setExpanded(expanded === enq.id ? null : enq.id)
                        if (enq.status === 'new') setStatus(enq.id, 'read')
                      }}
                    >
                      <td style={{ padding: '13px 16px', fontWeight: isNew ? 600 : 400, color: navy, fontSize: 14 }}>
                        {isNew && <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', marginRight: 8 }} />}
                        {enq.name}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>
                        <div>{enq.email}</div>
                        <div style={{ color: '#94a3b8' }}>{enq.phone}</div>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>{enq.service}</td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {new Date(enq.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                          {enq.status !== 'replied' && (
                            <button
                              onClick={e => { e.stopPropagation(); setStatus(enq.id, 'replied') }}
                              style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: `1px solid ${gold}`, background: 'transparent', color: gold, cursor: 'pointer', fontFamily: 'inherit' }}
                            >
                              Mark Replied
                            </button>
                          )}
                          <a
                            href={`mailto:${enq.email}?subject=Re: ${enq.service} enquiry`}
                            onClick={e => e.stopPropagation()}
                            style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0', background: 'transparent', color: '#475569', cursor: 'pointer', textDecoration: 'none' }}
                          >
                            Reply
                          </a>
                        </div>
                      </td>
                    </tr>
                    {expanded === enq.id && (
                      <tr key={`${enq.id}-detail`} style={{ background: '#f8fafc' }}>
                        <td colSpan={6} style={{ padding: '14px 20px' }}>
                          <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                            <strong style={{ color: navy }}>Travel Details:</strong>{' '}
                            {enq.details || <em style={{ color: '#94a3b8' }}>No details provided</em>}
                          </div>
                          <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                            <a href={`tel:${enq.phone}`} style={{ fontSize: 12, color: navy, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, border: `1px solid ${navy}` }}>
                              📞 {enq.phone}
                            </a>
                            <a href={`https://wa.me/${enq.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener" style={{ fontSize: 12, color: '#16a34a', textDecoration: 'none', padding: '5px 12px', borderRadius: 6, border: '1px solid #16a34a' }}>
                              WhatsApp
                            </a>
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
