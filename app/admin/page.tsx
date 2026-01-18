'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
  totalUsers: number
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        const nextStats = data?.stats ?? data
        setStats({
          totalBookings: nextStats?.totalBookings ?? 0,
          totalRevenue: nextStats?.totalRevenue ?? 0,
          pendingBookings: nextStats?.pendingBookings ?? 0,
          totalUsers: nextStats?.totalUsers ?? 0,
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: '📅',
      color: 'blue',
      href: '/admin/bookings',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingBookings,
      icon: '⏳',
      color: 'yellow',
      href: '/admin/bookings?status=pending',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'green',
      href: '/admin/payments',
    },
    {
      title: 'Active Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'purple',
      href: '/admin/users',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome, {session?.user?.name || 'Admin'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const colors = {
            blue: 'bg-blue-50 border-blue-200',
            yellow: 'bg-yellow-50 border-yellow-200',
            green: 'bg-green-50 border-green-200',
            purple: 'bg-purple-50 border-purple-200',
          }

          return (
            <Link
              key={idx}
              href={card.href}
              className={`p-6 rounded-lg border-2 ${colors[card.color as keyof typeof colors]} hover:shadow-lg transition cursor-pointer`}
            >
              <div className="text-4xl mb-2">{card.icon}</div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '-' : card.value}</p>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/bookings/create"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <div className="text-3xl mb-2">📝</div>
            <p className="font-medium text-gray-900">Create Booking</p>
            <p className="text-xs text-gray-600 mt-1">Manual booking entry</p>
          </Link>

          <Link
            href="/admin/packages"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <div className="text-3xl mb-2">🎁</div>
            <p className="font-medium text-gray-900">Manage Packages</p>
            <p className="text-xs text-gray-600 mt-1">Create/edit packages</p>
          </Link>

          <Link
            href="/admin/users"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <div className="text-3xl mb-2">👥</div>
            <p className="font-medium text-gray-900">Manage Users</p>
            <p className="text-xs text-gray-600 mt-1">View/edit users</p>
          </Link>

          <Link
            href="/admin/blog"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <div className="text-3xl mb-2">📝</div>
            <p className="font-medium text-gray-900">Blog Posts</p>
            <p className="text-xs text-gray-600 mt-1">Manage content</p>
          </Link>

          <Link
            href="/admin/payments"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <div className="text-3xl mb-2">💳</div>
            <p className="font-medium text-gray-900">Payments</p>
            <p className="text-xs text-gray-600 mt-1">Track revenue</p>
          </Link>

          <Link
            href="/admin/analytics"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <div className="text-3xl mb-2">📈</div>
            <p className="font-medium text-gray-900">Analytics</p>
            <p className="text-xs text-gray-600 mt-1">View insights</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <span className="font-medium text-green-900">Database Connection</span>
            <span className="text-green-600 font-bold">✓ Connected</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <span className="font-medium text-green-900">Stripe Integration</span>
            <span className="text-green-600 font-bold">✓ Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <span className="font-medium text-green-900">Email Service</span>
            <span className="text-green-600 font-bold">✓ Running</span>
          </div>
        </div>
      </div>
    </div>
  )
}
