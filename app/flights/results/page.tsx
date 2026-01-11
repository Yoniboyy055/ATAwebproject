'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { BRAND } from '@/lib/config'

interface FlightOption {
  id: number
  airline: string
  from: string
  to: string
  departDate: string
  returnDate?: string
  departTime: string
  arrivalTime: string
  duration: string
  cabin: string
  tripType: 'one-way' | 'round-trip'
  basePrice: number
  passengers: number
}

function FlightsResultsContent() {
  const searchParams = useSearchParams()

  const from = searchParams.get('from') || 'Asmara'
  const to = searchParams.get('to') || 'Toronto'
  const tripType = (searchParams.get('tripType') as 'one-way' | 'round-trip') || 'round-trip'
  const departDate = searchParams.get('departDate') || '2026-02-15'
  const returnDate = searchParams.get('returnDate') || '2026-02-28'
  const passengers = parseInt(searchParams.get('passengers') || '1')
  const cabin = searchParams.get('cabin') || 'economy'

  // Sample flight data
  const sampleFlights: FlightOption[] = [
    {
      id: 1,
      airline: 'Eritrean Airlines',
      from,
      to,
      departDate,
      returnDate,
      departTime: '09:00 AM',
      arrivalTime: '11:45 PM',
      duration: '14h 45m',
      cabin,
      tripType,
      basePrice: 850,
      passengers,
    },
    {
      id: 2,
      airline: 'Ethiopian Airlines',
      from,
      to,
      departDate,
      returnDate,
      departTime: '02:30 PM',
      arrivalTime: '06:15 AM (+1)',
      duration: '15h 45m',
      cabin,
      tripType,
      basePrice: 920,
      passengers,
    },
    {
      id: 3,
      airline: 'Emirates',
      from,
      to,
      departDate,
      returnDate,
      departTime: '11:00 AM',
      arrivalTime: '09:30 PM',
      duration: '14h 30m',
      cabin,
      tripType,
      basePrice: 1200,
      passengers,
    },
    {
      id: 4,
      airline: 'Turkish Airlines',
      from,
      to,
      departDate,
      returnDate,
      departTime: '06:45 AM',
      arrivalTime: '10:20 PM',
      duration: '15h 35m',
      cabin,
      tripType,
      basePrice: 890,
      passengers,
    },
    {
      id: 5,
      airline: 'Qatar Airways',
      from,
      to,
      departDate,
      returnDate,
      departTime: '01:15 PM',
      arrivalTime: '07:00 AM (+1)',
      duration: '15h 45m',
      cabin,
      tripType,
      basePrice: 1350,
      passengers,
    },
    {
      id: 6,
      airline: 'KLM Royal Dutch',
      from,
      to,
      departDate,
      returnDate,
      departTime: '03:00 PM',
      arrivalTime: '08:45 AM (+1)',
      duration: '16h 45m',
      cabin,
      tripType,
      basePrice: 950,
      passengers,
    },
    {
      id: 7,
      airline: 'Lufthansa',
      from,
      to,
      departDate,
      returnDate,
      departTime: '10:30 AM',
      arrivalTime: '09:00 PM',
      duration: '14h 30m',
      cabin,
      tripType,
      basePrice: 1100,
      passengers,
    },
    {
      id: 8,
      airline: 'Brussels Airlines',
      from,
      to,
      departDate,
      returnDate,
      departTime: '07:45 AM',
      arrivalTime: '11:15 PM',
      duration: '15h 30m',
      cabin,
      tripType,
      basePrice: 880,
      passengers,
    },
  ]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const generateWhatsAppMessage = (flight: FlightOption): string => {
    const message = `Hi! I'd like to book a ${tripType} flight with the following details:

🛫 **Flight Details**
- Airline: ${flight.airline}
- Route: ${flight.from} → ${flight.to}
- Departure: ${formatDate(flight.departDate)}
${flight.returnDate ? `- Return: ${formatDate(flight.returnDate)}\n` : ''}
- Passengers: ${passengers}
- Cabin Class: ${cabin}

💰 **Estimated Price** 
- Base: $${(flight.basePrice * passengers).toLocaleString()}

Please confirm availability and the best price for this option. Thank you!`

    return message
  }

  const sendToWhatsApp = (flight: FlightOption) => {
    const message = generateWhatsAppMessage(flight)
    const whatsappLink = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappLink, '_blank')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/flights"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm mb-4 inline-block"
          >
            ← Back to Search
          </Link>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              ✈️ Flight Results
            </h1>
            <p className="text-gray-600 mb-4">
              {from} → {to} • {formatDate(departDate)}
              {returnDate && ` to ${formatDate(returnDate)}`} • {passengers} passenger
              {passengers > 1 ? 's' : ''} • {cabin}
            </p>

            {/* Disclaimer */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>📢 Important:</strong> Prices change quickly and vary based on availability.
                Final availability and pricing will be confirmed on WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Flight Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {sampleFlights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition p-6"
            >
              {/* Airline Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{flight.airline}</h3>
                  <p className="text-xs text-gray-500">Direct flight option</p>
                </div>
                {flight.basePrice > 1200 && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>

              {/* Flight Times */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{flight.departTime}</p>
                    <p className="text-sm text-gray-600">{flight.from}</p>
                  </div>

                  <div className="flex-1 mx-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">{flight.duration}</p>
                    <div className="flex items-center justify-center">
                      <div className="h-1 w-12 bg-blue-300 rounded-full"></div>
                      <span className="mx-2 text-blue-600">✈️</span>
                      <div className="h-1 w-12 bg-blue-300 rounded-full"></div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{flight.arrivalTime}</p>
                    <p className="text-sm text-gray-600">{flight.to}</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900">
                    ${(flight.basePrice * passengers).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {passengers > 1 && `($${flight.basePrice}/person)`}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">Includes taxes & fees</p>
              </div>

              {/* Flight Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Passengers</p>
                  <p className="font-semibold text-gray-900">{passengers}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Cabin</p>
                  <p className="font-semibold text-gray-900 capitalize">{cabin}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Trip Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{tripType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                  <p className="font-semibold text-gray-900">{flight.duration}</p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => sendToWhatsApp(flight)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <span>💬</span>
                Request This Option on WhatsApp
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Get instant response on pricing & availability
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Book with Us?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-sm text-gray-600">Competitive rates on all major airlines</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">⏱️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Booking</h3>
              <p className="text-sm text-gray-600">Quote & book in minutes via WhatsApp</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-sm text-gray-600">Direct communication with trusted team</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">📞</div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Expert assistance anytime you need it</p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Not sure? Chat with our travel experts first
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition"
          >
            📧 Contact Us
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function FlightsResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin mb-4">✈️</div>
            <p className="text-gray-600">Loading flight results...</p>
          </div>
        </div>
      }
    >
      <FlightsResultsContent />
    </Suspense>
  )
}
