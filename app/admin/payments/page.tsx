'use client'

import { useState, useEffect, useCallback } from 'react'

interface Payment {
  id: string
  bookingId: string
  guestName: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  createdAt: string
}

const navy = '#0A1628'
const gold = '#C9A84C'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7' },
  completed: { label: 'Completed', color: '#10b981', bg: '#d1fae5' },
  failed: { label: 'Failed', color: '#ef4444', bg: '#fee2e2' },
  refunded: { label: 'Refunded', color: '#64748b', bg: '#f1f5f9' },
}

export default function PaymentsAdminPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [apiTotal, setApiTotal] = useState<number | null>(null)
  const [apiCompleted, setApiCompleted] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const url = filter === 'all' ? '/api/admin/payments' : `/api/admin/payments?status=${filter}`
      const res = await fetch(url)
      if (res.ok) {
        const d = await res.json()
        setPayments(d.payments || [])
        if (d.total !== undefined) setApiTotal(d.total)
        if (d.completed !== undefined) setApiCompleted(d.completed)
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { load() }, [load])

  const completedRevenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0)
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const avgTransaction = payments.length > 0 ? (completedRevenue + pendingAmount) / payments.length : 0

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: navy, margin: '0 0 4px' }}>Payments & Revenue</h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Payment records and transaction history</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Completed Revenue', value: `$${completedRevenue.toLocaleString()}`, color: '#10b981' },
          { label: 'Pending Amount', value: `$${pendingAmount.toLocaleString()}`, color: '#f59e0b' },
          { label: 'Total Transactions', value: apiTotal ?? payments.length, color: '#3b82f6' },
          { label: 'Avg Transaction', value: `$${avgTransaction.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#7c3aed' },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '18px 20px' }}>
            <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: card.color, margin: 0 }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'completed', 'pending', 'failed', 'refunded'].map(f => (
          <button
            key={f}
            onClick={() => { setLoading(true); setFilter(f) }}
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
        ) : payments.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>No payments found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                {['Payment ID', 'Guest', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => {
                const sc = STATUS_CONFIG[payment.status] || { label: payment.status, color: '#64748b', bg: '#f1f5f9' }
                return (
                  <tr key={payment.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontFamily: 'monospace', color: '#475569' }}>
                      {payment.id.substring(0, 8)}…
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 14 }}>
                      <div style={{ fontWeight: 600, color: navy }}>{payment.guestName}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{payment.bookingId.substring(0, 8)}…</div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 700, color: navy }}>
                      ${payment.amount.toFixed(2)} <span style={{ fontSize: 12, fontWeight: 400, color: '#94a3b8' }}>{payment.currency}</span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>{payment.paymentMethod}</td>
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
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {new Date(payment.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
