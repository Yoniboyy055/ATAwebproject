'use client'

import { useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  email: string
  name: string | null
  phone: string | null
  createdAt: string
  _count: { bookings: number }
}

const navy = '#0A1628'
const gold = '#C9A84C'

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)
  const [activeThisMonth, setActiveThisMonth] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const d = await res.json()
        setUsers(d.users || [])
        setTotal(d.total ?? (d.users || []).length)
        setActiveThisMonth(d.activeThisMonth ?? 0)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalBookings = users.reduce((sum, u) => sum + (u._count?.bookings ?? 0), 0)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: navy, margin: '0 0 4px' }}>Users</h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Registered user accounts</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Users', value: total, color: '#3b82f6' },
          { label: 'Active This Month', value: activeThisMonth, color: gold },
          { label: 'Total Bookings', value: totalBookings, color: '#10b981' },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '18px 20px' }}>
            <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: card.color, margin: 0 }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="search"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 14,
            fontFamily: 'inherit',
            color: navy,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
            {search ? 'No users match your search.' : 'No users yet.'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                {['Name', 'Email', 'Phone', 'Bookings', 'Joined'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 600, color: navy }}>
                    {user.name || <span style={{ color: '#94a3b8', fontWeight: 400, fontStyle: 'italic' }}>No name</span>}
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>{user.email}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#94a3b8' }}>
                    {user.phone || '—'}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#3b82f6',
                      background: '#eff6ff',
                    }}>
                      {user._count?.bookings ?? 0}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <p style={{ marginTop: 12, fontSize: 13, color: '#94a3b8' }}>
          Showing {filtered.length} of {users.length} user{users.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
