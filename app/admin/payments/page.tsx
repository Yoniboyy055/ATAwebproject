'use client'

import { useState, useEffect, useCallback } from 'react'

interface Payment {
  id: string
  bookingId: string
  guestName: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  createdAt: string
}

export default function PaymentsAdminPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  const fetchPayments = useCallback(async () => {
    try {
      const url = filter === 'all' ? '/api/admin/payments' : `/api/admin/payments?status=${filter}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  }

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Payments & Revenue</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">Completed Revenue</p>
          <p className="text-3xl font-bold text-green-900">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">Pending Amount</p>
          <p className="text-3xl font-bold text-yellow-900">${totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">Total Transactions</p>
          <p className="text-3xl font-bold text-blue-900">{payments.length}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-700">Avg Transaction</p>
          <p className="text-3xl font-bold text-purple-900">
            ${payments.length > 0 ? ((totalRevenue + totalPending) / payments.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'completed', 'pending', 'failed', 'refunded'].map((status) => (
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

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No payments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Payment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-mono text-gray-900">
                      {payment.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <div className="font-medium text-gray-900">{payment.guestName}</div>
                      <div className="text-xs text-gray-600">{payment.bookingId.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-gray-900">
                      ${payment.amount.toFixed(2)} {payment.currency}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{payment.paymentMethod}</td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          statusColors[payment.status as keyof typeof statusColors]
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-sm space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                      {payment.status === 'completed' && (
                        <button className="text-red-600 hover:text-red-800 font-medium">Refund</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
