'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateBookingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    fromCity: '',
    toCity: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    notes: '',
    tripType: 'one-way' as 'one-way' | 'round-trip',
    contactMethod: 'email' as 'whatsapp' | 'phone' | 'email',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare request body matching BookingRequest schema
      const requestBody = {
        tripType: formData.tripType,
        passengers: formData.passengers,
        passengerNames: [formData.fullName], // Use fullName as primary passenger
        phoneCountry: '+1', // Default, admin can adjust if needed
        fromCity: formData.fromCity,
        toCity: formData.toCity,
        departDate: formData.departDate,
        returnDate: formData.returnDate || undefined,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || undefined,
        notes: formData.notes || undefined,
        contactMethod: formData.contactMethod,
        sendEmail: false, // Admin creates, don't auto-send notifications
        sendSMS: false,
      }

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking')
      }

      if (data.ok && data.id) {
        // Success - redirect to bookings list
        router.push('/admin/bookings')
      } else {
        throw new Error('Booking creation failed - no ID returned')
      }
    } catch (error) {
      console.error('Failed to create booking:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create booking. Please try again.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Booking</h1>
        <Link
          href="/admin/bookings"
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Bookings
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passengers *
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.passengers}
              onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From City *
            </label>
            <input
              type="text"
              required
              value={formData.fromCity}
              onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To City *
            </label>
            <input
              type="text"
              required
              value={formData.toCity}
              onChange={(e) => setFormData({ ...formData, toCity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Date *
            </label>
            <input
              type="date"
              required
              value={formData.departDate}
              onChange={(e) => setFormData({ ...formData, departDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Return Date (Optional)
            </label>
            <input
              type="date"
              value={formData.returnDate}
              onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Type *
            </label>
            <select
              required
              value={formData.tripType}
              onChange={(e) => setFormData({ ...formData, tripType: e.target.value as 'one-way' | 'round-trip' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="one-way">One-Way</option>
              <option value="round-trip">Round-Trip</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Method *
            </label>
            <select
              required
              value={formData.contactMethod}
              onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value as 'whatsapp' | 'phone' | 'email' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional notes or special requests..."
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
          <Link
            href="/admin/bookings"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
