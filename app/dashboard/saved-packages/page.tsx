'use client'

import { useState } from 'react'

export default function SavedPackagesPage() {
  const [savedPackages] = useState([
    {
      id: 1,
      title: 'Asmara City Break',
      image: '/dest-400-asmara.jpg',
      price: 899,
      rating: 4.8,
      duration: '3 nights',
    },
    {
      id: 2,
      title: 'Massawa Red Sea',
      image: '/dest-400-massawa.jpg',
      price: 1299,
      rating: 4.9,
      duration: '5 nights',
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Saved Packages</h1>
        <p className="text-slate-600">Your favorite travel packages saved for easy booking</p>
      </div>

      {savedPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-600 transition-colors">
              <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 relative flex items-center justify-center">
                <span className="text-4xl">🌍</span>
                <button className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-slate-100">
                  <span className="text-lg">❤️</span>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 mb-2">{pkg.title}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-emerald-600">${pkg.price}</span>
                  <span className="text-sm text-slate-600">⭐ {pkg.rating}</span>
                </div>
                <p className="text-sm text-slate-600 mb-4">{pkg.duration}</p>
                <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No saved packages</h3>
          <p className="text-slate-600 mb-6">
            Start saving packages to quickly access your favorites.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            Explore Packages
          </a>
        </div>
      )}
    </div>
  )
}
