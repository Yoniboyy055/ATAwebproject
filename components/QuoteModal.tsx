"use client"
import { useQuote } from './QuoteProvider'
import { BRAND } from '../lib/config'

export default function QuoteModal() {
  const { isOpen, closeQuote, draft, updateDraft } = useQuote()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateDraft({ [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!draft.name || !draft.phone || !draft.fromCity || !draft.toCity) {
      alert('Please fill in all required fields')
      return
    }

    // Build WhatsApp message
    const lines = [
      `📋 *Quote Request from ${draft.name}*`,
      ``,
      `*Contact:* ${draft.phone}`,
      `*From:* ${draft.fromCity}`,
      `*To:* ${draft.toCity}`,
    ]

    if (draft.tripType) lines.push(`*Trip Type:* ${draft.tripType}`)
    if (draft.service) lines.push(`*Service:* ${draft.service}`)
    if (draft.travelDate) lines.push(`*Travel Date:* ${draft.travelDate}`)
    if (draft.passengers) lines.push(`*Passengers:* ${draft.passengers}`)
    if (draft.notes) lines.push(`*Notes:* ${draft.notes}`)
    if (draft.source) lines.push(`*Source:* ${draft.source}`)

    const message = lines.join('\n')
    const waUrl = `https://wa.me/${encodeURIComponent(BRAND.whatsapp)}?text=${encodeURIComponent(message)}`
    
    window.open(waUrl, '_blank')
    closeQuote()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Request a Quote</h2>
            <button
              onClick={closeQuote}
              className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Required Fields */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={draft.name || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                WhatsApp Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={draft.phone || ''}
                onChange={handleChange}
                placeholder="+123456789"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Traveling From *
              </label>
              <input
                type="text"
                name="fromCity"
                value={draft.fromCity || ''}
                onChange={handleChange}
                placeholder="e.g., Asmara"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Traveling To *
              </label>
              <input
                type="text"
                name="toCity"
                value={draft.toCity || ''}
                onChange={handleChange}
                placeholder="e.g., Toronto"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Optional Fields */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Trip Type
              </label>
              <select
                name="tripType"
                value={draft.tripType || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select type...</option>
                <option value="Local outbound">Local outbound</option>
                <option value="Diaspora inbound">Diaspora inbound</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Service
              </label>
              <select
                name="service"
                value={draft.service || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select service...</option>
                <option value="Flights">Flights</option>
                <option value="Tours">Tours</option>
                <option value="Visa Assistance">Visa Assistance</option>
                <option value="Travel Support">Travel Support</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Travel Date
              </label>
              <input
                type="date"
                name="travelDate"
                value={draft.travelDate || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Passengers
              </label>
              <input
                type="number"
                name="passengers"
                value={draft.passengers || ''}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={draft.notes || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeQuote}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-accent/90 text-white rounded-md hover:bg-accent transition font-medium"
              >
                Send on WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
