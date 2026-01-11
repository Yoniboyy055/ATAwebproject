'use client'

import { useState } from 'react'
import { BRAND } from '@/lib/config'

export default function QuotesPage() {
  const [quotes, setQuotes] = useState([
    {
      id: 1,
      destination: 'Custom Eritrea Tour',
      submitted: 'Jan 5, 2024',
      status: 'responded',
      price: 'TBD',
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    destination: '',
    travelers: '1',
    dates: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newQuote = {
      id: quotes.length + 1,
      destination: formData.destination,
      submitted: new Date().toLocaleDateString(),
      status: 'pending',
      price: 'TBD',
    }
    setQuotes([newQuote, ...quotes])
    setFormData({ destination: '', travelers: '1', dates: '', message: '' })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Quote Requests</h1>
          <p className="text-slate-600">Get custom pricing for your perfect itinerary</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Quote Request'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Request a Custom Quote</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Destination / Trip Details
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g., Asmara & Massawa 5-day tour"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Number of Travelers
                </label>
                <select
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3-5">3-5 People</option>
                  <option value="6-10">6-10 People</option>
                  <option value="10+">10+ People (Group)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Preferred Dates
                </label>
                <input
                  type="text"
                  value={formData.dates}
                  onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                  placeholder="e.g., March 2024"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Additional Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us more about what you're looking for..."
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                Submit Quote Request
              </button>
              <a
                href={`${BRAND.whatsappLink}?text=Hi, I'd like a custom quote for a travel package`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-center"
              >
                Chat via WhatsApp
              </a>
            </div>
          </form>
        </div>
      )}

      {quotes.length > 0 ? (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div key={quote.id} className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{quote.destination}</h3>
                  <p className="text-sm text-slate-600">Submitted: {quote.submitted}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    quote.status === 'responded'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {quote.status === 'responded' ? 'Response Received' : 'Pending'}
                </span>
              </div>

              <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">Estimated Price:</p>
                <p className="text-2xl font-bold text-emerald-600">{quote.price}</p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium transition-colors">
                  View Details
                </button>
                <a
                  href={`${BRAND.whatsappLink}?text=Hi, I'd like to discuss my quote for ${quote.destination}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors text-center"
                >
                  Chat
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No quote requests yet</h3>
          <p className="text-slate-600 mb-6">
            Submit a quote request to get custom pricing for your ideal itinerary.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            Request a Quote
          </button>
        </div>
      )}
    </div>
  )
}
