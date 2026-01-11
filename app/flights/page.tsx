'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FlightsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    tripType: 'round-trip' as 'one-way' | 'round-trip',
    departDate: '',
    returnDate: '',
    passengers: 1,
    cabin: 'economy' as 'economy' | 'business',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'passengers' ? parseInt(value) : value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.from.trim()) newErrors.from = 'Departure city required'
    if (!formData.to.trim()) newErrors.to = 'Destination city required'
    if (!formData.departDate) newErrors.departDate = 'Departure date required'
    if (formData.tripType === 'round-trip' && !formData.returnDate) {
      newErrors.returnDate = 'Return date required for round-trip'
    }
    if (formData.passengers < 1) newErrors.passengers = 'At least 1 passenger required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Build query string
    const params = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      tripType: formData.tripType,
      departDate: formData.departDate,
      passengers: formData.passengers.toString(),
      cabin: formData.cabin,
      ...(formData.returnDate && { returnDate: formData.returnDate }),
    })

    router.push(`/flights/results?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            ✈️ Search Flights
          </h1>
          <p className="text-xl text-gray-600">
            Find the best route — confirm final price on WhatsApp
          </p>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8">
          <p className="text-sm text-blue-900">
            <strong>📢 Note:</strong> Prices change quickly. Final availability and pricing confirmed on WhatsApp.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 space-y-8"
        >
          {/* Trip Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">Trip Type</label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="one-way"
                  checked={formData.tripType === 'one-way'}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">One-way</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="round-trip"
                  checked={formData.tripType === 'round-trip'}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Round-trip</span>
              </label>
            </div>
          </div>

          {/* Cities Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* From City */}
            <div>
              <label htmlFor="from" className="block text-sm font-semibold text-gray-900 mb-2">
                From City
              </label>
              <input
                type="text"
                id="from"
                name="from"
                value={formData.from}
                onChange={handleChange}
                placeholder="e.g., Asmara, Toronto"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition ${
                  errors.from
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.from && <p className="mt-1 text-sm text-red-600">{errors.from}</p>}
            </div>

            {/* To City */}
            <div>
              <label htmlFor="to" className="block text-sm font-semibold text-gray-900 mb-2">
                To City
              </label>
              <input
                type="text"
                id="to"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="e.g., Toronto, London"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition ${
                  errors.to
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.to && <p className="mt-1 text-sm text-red-600">{errors.to}</p>}
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Departure Date */}
            <div>
              <label htmlFor="departDate" className="block text-sm font-semibold text-gray-900 mb-2">
                Departure Date
              </label>
              <input
                type="date"
                id="departDate"
                name="departDate"
                value={formData.departDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition ${
                  errors.departDate
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.departDate && <p className="mt-1 text-sm text-red-600">{errors.departDate}</p>}
            </div>

            {/* Return Date (only if round-trip) */}
            {formData.tripType === 'round-trip' && (
              <div>
                <label htmlFor="returnDate" className="block text-sm font-semibold text-gray-900 mb-2">
                  Return Date
                </label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition ${
                    errors.returnDate
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.returnDate && <p className="mt-1 text-sm text-red-600">{errors.returnDate}</p>}
              </div>
            )}
          </div>

          {/* Passengers & Cabin Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Passengers */}
            <div>
              <label htmlFor="passengers" className="block text-sm font-semibold text-gray-900 mb-2">
                Passengers
              </label>
              <select
                id="passengers"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition ${
                  errors.passengers
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
              {errors.passengers && <p className="mt-1 text-sm text-red-600">{errors.passengers}</p>}
            </div>

            {/* Cabin Class */}
            <div>
              <label htmlFor="cabin" className="block text-sm font-semibold text-gray-900 mb-2">
                Cabin Class
              </label>
              <select
                id="cabin"
                name="cabin"
                value={formData.cabin}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition shadow-md"
            >
              🔍 Search Flights
            </button>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Info Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-900 mb-2">WhatsApp Quotes</h3>
            <p className="text-sm text-gray-600">
              Get instant quotes directly on WhatsApp with no hidden fees.
            </p>
          </div>

          {/* Info Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="text-3xl mb-3">✈️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Routes</h3>
            <p className="text-sm text-gray-600">
              We find optimal routes with minimal stops at competitive prices.
            </p>
          </div>

          {/* Info Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
            <p className="text-sm text-gray-600">
              Our travel experts guide you through every step of your journey.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
