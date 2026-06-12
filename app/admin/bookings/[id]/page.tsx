'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

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

export default function BookingDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [booking, setBooking] = useState<BookingRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/bookings')
        if (res.ok) {
          const d = await res.json()
          const found = (d.bookings || []).find((b: BookingRequest) => b.id === id)
          if (found) {
            setBooking(found)
          } else {
            setNotFound(true)
          }
        }
      } catch (err) {
        console.error('Failed to fetch booking:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Loading…</div>
    )
  }

  if (notFound || !booking) {
    return (
      <div>
        <Link href="/admin/bookings" style={{ color: gold, textDecoration: 'none', fontSize: 14 }}>
          ← Back to Bookings
        </Link>
        <div style={{ marginTop: 32, padding: 48, textAlign: 'center', color: '#94a3b8', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          Booking not found.
        </div>
      </div>
    )
  }

  const sc = STATUS_CONFIG[booking.status]

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 4px', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontSize: 14, color: '#475569', margin: 0 }}>{value}</p>
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/bookings" style={{ color: gold, textDecoration: 'none', fontSize: 14 }}>
          ← Back to Bookings
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: navy, margin: '0 0 4px' }}>{booking.fullName}</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Booking Request Detail</p>
        </div>
        <span style={{
          display: 'inline-block',
          padding: '5px 14px',
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 600,
          color: sc.color,
          background: sc.bg,
        }}>
          {sc.label}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Contact Info */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: navy, margin: '0 0 20px', paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            Contact Information
          </h2>
          <Field label="Full Name" value={booking.fullName} />
          <Field label="Phone" value={booking.phone} />
          {booking.email && <Field label="Email" value={booking.email} />}
          <Field label="Preferred Contact" value={booking.contactMethod} />
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <a href={`tel:${booking.phone}`} style={{ fontSize: 12, color: navy, textDecoration: 'none', padding: '6px 14px', borderRadius: 6, border: `1px solid ${navy}` }}>
              Call
            </a>
            <a href={`https://wa.me/${booking.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#16a34a', textDecoration: 'none', padding: '6px 14px', borderRadius: 6, border: '1px solid #16a34a' }}>
              WhatsApp
            </a>
            {booking.email && (
              <a href={`mailto:${booking.email}`} style={{ fontSize: 12, color: '#3b82f6', textDecoration: 'none', padding: '6px 14px', borderRadius: 6, border: '1px solid #3b82f6' }}>
                Email
              </a>
            )}
          </div>
        </div>

        {/* Trip Info */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: navy, margin: '0 0 20px', paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            Trip Details
          </h2>
          <Field label="Route" value={`${booking.fromCity} → ${booking.toCity}`} />
          <Field label="Trip Type" value={booking.tripType.replace(/-/g, ' ')} />
          <Field label="Passengers" value={String(booking.passengers)} />
          <Field
            label="Departure Date"
            value={booking.departDate ? new Date(booking.departDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
          />
          {booking.returnDate && (
            <Field
              label="Return Date"
              value={new Date(booking.returnDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            />
          )}
        </div>

        {/* Notes */}
        {booking.notes && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, gridColumn: '1 / -1' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: navy, margin: '0 0 12px', paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
              Notes
            </h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, margin: 0 }}>{booking.notes}</p>
          </div>
        )}

        {/* Meta */}
        <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, gridColumn: '1 / -1' }}>
          <Field
            label="Submitted"
            value={new Date(booking.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions)}
          />
          <Field label="Booking ID" value={booking.id} />
        </div>
      </div>
    </div>
  )
}
