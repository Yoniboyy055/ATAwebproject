'use client'

import { useState } from 'react'

export default function BookingsPage() {
  const [bookings] = useState([
    {
      id: 1,
      destination: 'Massawa Red Sea Escape',
      dates: 'Mar 15-22, 2024',
      status: 'confirmed',
      price: 1200,
      nights: 7,
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Bookings</h1>
        <p className="text-slate-600">Manage and track all your travel reservations</p>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{booking.destination}</h3>
                  <p className="text-slate-600">{booking.dates}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-200">
                <div>
                  <p className="text-sm text-slate-600">Duration</p>
                  <p className="text-lg font-semibold text-slate-900">{booking.nights} nights</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Price</p>
                  <p className="text-lg font-semibold text-slate-900">${booking.price}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Per Night</p>
                  <p className="text-lg font-semibold text-slate-900">${Math.round(booking.price / booking.nights)}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium transition-colors">
                  View Details
                </button>
                <button className="flex-1 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-medium transition-colors">
                  Download Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="text-6xl mb-4">✈️</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No bookings yet</h3>
          <p className="text-slate-600 mb-6">
            Start your adventure by booking one of our featured packages.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            Browse Packages
          </a>
        </div>
      )}
    </div>
  )
}
