'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Booking {
  id: string
  fullName: string
  email: string
  phone: string
  fromCity: string
  toCity: string
  departDate: string
  returnDate: string | null
  passengers: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  totalAmount: number
  createdAt: string
}

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  const fetchBookings = useCallback(async () => {
    try {
      const url = filter === 'all' ? '/api/bookings' : `/api/bookings?status=${filter}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
        <Link
          href="/admin/bookings/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          + New Booking
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => {
              setLoading(true)
              setFilter(status)
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-mono text-gray-900">
                      {booking.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <div className="font-medium text-gray-900">{booking.fullName}</div>
                      <div className="text-xs text-gray-600">{booking.email}</div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {booking.fromCity} → {booking.toCity}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      <div>{new Date(booking.departDate).toLocaleDateString()}</div>
                      {booking.returnDate && (
                        <div className="text-xs text-gray-600">
                          → {new Date(booking.returnDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-gray-900">
                      ${booking.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          statusColors[booking.status as keyof typeof statusColors]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm space-x-2">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </Link>
                      <button className="text-gray-600 hover:text-gray-800 font-medium">⋯</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Bookings</p>
          <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {bookings.filter((b) => b.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            ${bookings.reduce((sum, b) => sum + b.totalAmount, 0).toFixed(0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Avg Transaction</p>
          <p className="text-2xl font-bold text-blue-600">
            ${(bookings.reduce((sum, b) => sum + b.totalAmount, 0) / (bookings.length || 1)).toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  )
}
