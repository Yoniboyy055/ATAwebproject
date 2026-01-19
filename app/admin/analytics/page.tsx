'use client'

import { useState, useEffect, useCallback } from 'react'

interface AnalyticsData {
  totalEvents: number
  uniqueUsers: number
  topPages: Array<{
    page: string
    views: number
    avgTimeOnPage: number
  }>
  conversions: {
    bookings: number
    newsletterSignups: number
    chatEngagements: number
  }
  abtestResults: Array<{
    testName: string
    variantA: {
      name: string
      conversions: number
      visitors: number
    }
    variantB: {
      name: string
      conversions: number
      visitors: number
    }
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      } else {
        console.error('Analytics API error:', response.status)
        setData(null)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const conversionRate = data
    ? ((data.conversions.bookings / data.uniqueUsers) * 100).toFixed(2)
    : '0'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
        <select
          aria-label="Date range"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading analytics...</div>
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">Total Events</p>
              <p className="text-3xl font-bold text-blue-900">{data.totalEvents.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-700">Unique Visitors</p>
              <p className="text-3xl font-bold text-purple-900">{data.uniqueUsers.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">Booking Conversions</p>
              <p className="text-3xl font-bold text-green-900">{data.conversions.bookings}</p>
              <p className="text-xs text-green-600 mt-1">{conversionRate}% conversion rate</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-700">Newsletter Signups</p>
              <p className="text-3xl font-bold text-orange-900">{data.conversions.newsletterSignups}</p>
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Top Pages</h2>
            <div className="space-y-3">
              {data.topPages.map((page, idx) => (
                <div key={idx} className="flex items-center justify-between pb-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{page.page}</p>
                    <p className="text-sm text-gray-600">{page.avgTimeOnPage.toFixed(1)}s avg time</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{page.views}</p>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* A/B Test Results */}
          {data.abtestResults.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">A/B Test Results</h2>
              <div className="space-y-6">
                {data.abtestResults.map((test, idx) => {
                  const variantARate = (test.variantA.conversions / test.variantA.visitors) * 100
                  const variantBRate = (test.variantB.conversions / test.variantB.visitors) * 100
                  const winner = variantARate > variantBRate ? 'A' : variantBRate > variantARate ? 'B' : 'Tie'

                  return (
                    <div key={idx} className="border-b last:border-b-0 pb-6 last:pb-0">
                      <h3 className="font-bold text-gray-900 mb-4">{test.testName}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-medium text-gray-900 mb-2">{test.variantA.name}</p>
                          <p className="text-2xl font-bold text-blue-600 mb-1">
                            {variantARate.toFixed(1)}%
                          </p>
                          <p className="text-sm text-gray-600">
                            {test.variantA.conversions} conversions / {test.variantA.visitors} visitors
                          </p>
                          {winner === 'A' && (
                            <p className="text-xs font-bold text-green-600 mt-2">✓ Winner</p>
                          )}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-medium text-gray-900 mb-2">{test.variantB.name}</p>
                          <p className="text-2xl font-bold text-purple-600 mb-1">
                            {variantBRate.toFixed(1)}%
                          </p>
                          <p className="text-sm text-gray-600">
                            {test.variantB.conversions} conversions / {test.variantB.visitors} visitors
                          </p>
                          {winner === 'B' && (
                            <p className="text-xs font-bold text-green-600 mt-2">✓ Winner</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Chat Engagement */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Channel Engagement</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Chat Engagements</p>
                <p className="text-3xl font-bold text-gray-900">{data.conversions.chatEngagements}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">WhatsApp Clicks</p>
                <p className="text-3xl font-bold text-gray-900">-</p>
                <p className="text-xs text-gray-500 mt-1">Track via GTM</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Form Completions</p>
                <p className="text-3xl font-bold text-gray-900">-</p>
                <p className="text-xs text-gray-500 mt-1">Track via GTM</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">Failed to load analytics</div>
      )}
    </div>
  )
}
