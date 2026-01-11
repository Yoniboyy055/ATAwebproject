'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UserData {
  id: string
  email: string
  name: string
  createdAt: string
  bookings: Record<string, unknown>[]
  savedPackages: Record<string, unknown>[]
  quotes: Record<string, unknown>[]
  reviews: Record<string, unknown>[]
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.email) {
      // Load user data
      const usersData = JSON.parse(localStorage.getItem('amanuel_users') || '[]') as Record<string, unknown>[]
      const email = session.user.email
      const user = usersData.find((u) => u.email === email) as UserData | undefined
      if (user) {
        setUserData(user)
      }
      setIsLoading(false)
    }
  }, [session])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!session?.user?.email) {
    return <div>Error: User not found</div>
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {session.user.name}! 👋
        </h1>
        <p className="text-slate-600">
          Manage your bookings, saved packages, and travel plans all in one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Bookings"
          value={userData?.bookings?.length || 0}
          icon="✈️"
          color="emerald"
        />
        <StatCard
          label="Saved Packages"
          value={userData?.savedPackages?.length || 0}
          icon="❤️"
          color="rose"
        />
        <StatCard
          label="Quote Requests"
          value={userData?.quotes?.length || 0}
          icon="💬"
          color="blue"
        />
        <StatCard
          label="Reviews Left"
          value={userData?.reviews?.length || 0}
          icon="⭐"
          color="amber"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton
            href="/"
            label="Browse Packages"
            icon="🌍"
            description="Explore all available travel packages"
          />
          <ActionButton
            href="/dashboard/quotes"
            label="Get a Quote"
            icon="📝"
            description="Request a custom travel quote"
          />
          <ActionButton
            href="/dashboard/bookings"
            label="View Bookings"
            icon="📅"
            description="Check your booking history"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Bookings</h2>
          {userData?.bookings && userData.bookings.length > 0 ? (
            <div className="space-y-3">
              {userData.bookings.slice(0, 3).map((booking: Record<string, unknown>, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{booking.destination as string}</p>
                    <p className="text-sm text-slate-600">{booking.dates as string}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(booking.status as string)}`}>
                    {booking.status as string}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-6">No bookings yet. Start exploring packages!</p>
          )}
          {userData?.bookings && userData.bookings.length > 0 && (
            <Link href="/dashboard/bookings" className="block mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
              View all bookings →
            </Link>
          )}
        </div>

        {/* Saved Packages */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Saved Packages</h2>
          {userData?.savedPackages && userData.savedPackages.length > 0 ? (
            <div className="space-y-3">
              {userData.savedPackages.slice(0, 3).map((pkg: Record<string, unknown>, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{pkg.title as string}</p>
                    <p className="text-sm text-slate-600">${pkg.price as string}</p>
                  </div>
                  <span className="text-lg">❤️</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-6">No saved packages yet. Find your favorites!</p>
          )}
          {userData?.savedPackages && userData.savedPackages.length > 0 && (
            <Link href="/dashboard/saved-packages" className="block mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
              View all saved →
            </Link>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Ready for Your Next Adventure?</h2>
        <p className="mb-6 text-emerald-100">
          Browse our curated packages or contact our team for a custom itinerary.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-white text-emerald-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Browse Packages
          </Link>
          <button className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-emerald-800 transition-colors">
            Schedule Consultation
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number
  icon: string
  color: string
}) {
  const colorClasses = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    rose: 'bg-rose-50 border-rose-200 text-rose-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
  }

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm opacity-75">{label}</p>
    </div>
  )
}

function ActionButton({
  href,
  label,
  icon,
  description,
}: {
  href: string
  label: string
  icon: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="p-4 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 transition-colors text-center"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-semibold text-slate-900 mb-1">{label}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </Link>
  )
}

function getStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-slate-100 text-slate-700',
  }
  return colors[status] || colors.pending
}
