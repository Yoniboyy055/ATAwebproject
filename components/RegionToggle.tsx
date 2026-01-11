'use client'

import { useState } from 'react'
import { useUserPreferences } from '@/lib/hooks'

export default function RegionToggle() {
  const { userType, switchUserType, isLoaded } = useUserPreferences()
  const [isOpen, setIsOpen] = useState(false)

  if (!isLoaded) return null

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition duration-300 active:scale-95"
        title="Toggle between Local and Diaspora mode"
      >
        <span className="text-2xl sm:text-3xl">
          {userType === 'diaspora' ? '🌍' : userType === 'local' ? '🏠' : '🔄'}
        </span>
      </button>

      {/* Menu Popover */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-56 animate-fade-in-up">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-4 block">Choose your travel mode</p>

          {/* Local Option */}
          <button
            onClick={() => {
              switchUserType('local')
              setIsOpen(false)
            }}
            className={`w-full p-4 rounded-lg mb-3 transition duration-200 text-left flex items-start gap-3 ${
              userType === 'local'
                ? 'bg-emerald-50 border-2 border-emerald-500'
                : 'bg-slate-50 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            <span className="text-2xl mt-1">🏠</span>
            <div>
              <p className="font-semibold text-slate-900">Local Traveler</p>
              <p className="text-xs text-slate-600 mt-1">Local within Eritrea, looking to travel</p>
            </div>
          </button>

          {/* Diaspora Option */}
          <button
            onClick={() => {
              switchUserType('diaspora')
              setIsOpen(false)
            }}
            className={`w-full p-4 rounded-lg transition duration-200 text-left flex items-start gap-3 ${
              userType === 'diaspora'
                ? 'bg-emerald-50 border-2 border-emerald-500'
                : 'bg-slate-50 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            <span className="text-2xl mt-1">🌍</span>
            <div>
              <p className="font-semibold text-slate-900">Diaspora</p>
              <p className="text-xs text-slate-600 mt-1">Based abroad, visiting home</p>
            </div>
          </button>

          <p className="text-xs text-slate-500 mt-4 text-center">
            We&rsquo;ll personalize your experience
          </p>
        </div>
      )}
    </div>
  )
}
