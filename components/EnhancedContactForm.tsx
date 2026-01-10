'use client'

import { useState } from 'react'
import { useLang } from './LangProvider'
import { getTranslation } from '@/lib/lang'
import { BRAND } from '@/lib/config'

type RequestType = 'quickQuote' | 'fullTrip' | 'package' | 'visa' | 'other'
type TravelerType = 'local' | 'diaspora'

export default function EnhancedContactForm() {
  const { lang } = useLang()
  const [requestType, setRequestType] = useState<RequestType>('quickQuote')
  const [travelerType, setTravelerType] = useState<TravelerType>('local')
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    dates: '',
    passengers: '1',
    notes: ''
  })

  const getRequestTypeLabel = (type: RequestType): string => {
    const labelMap: Record<RequestType, string> = {
      quickQuote: getTranslation(lang, 'contactRequestQuickQuote'),
      fullTrip: getTranslation(lang, 'contactRequestFullTrip'),
      package: getTranslation(lang, 'contactRequestPackage'),
      visa: getTranslation(lang, 'contactRequestVisa'),
      other: getTranslation(lang, 'contactRequestOther')
    }
    return labelMap[type]
  }

  const buildWhatsAppMessage = (): string => {
    const typeLabel = getRequestTypeLabel(requestType)
    const travelerLabel = travelerType === 'local' 
      ? getTranslation(lang, 'contactTravelerLocal')
      : getTranslation(lang, 'contactTravelerDiaspora')

    const lines = [
      `${getTranslation(lang, 'contactFormRequestType')}: ${typeLabel}`,
      `${getTranslation(lang, 'contactTravelerTypeLabel')}: ${travelerLabel}`,
      formData.from ? `${getTranslation(lang, 'contactFormFrom')}: ${formData.from}` : '',
      formData.to ? `${getTranslation(lang, 'contactFormTo')}: ${formData.to}` : '',
      formData.dates ? `${getTranslation(lang, 'contactFormDates')}: ${formData.dates}` : '',
      formData.passengers ? `${getTranslation(lang, 'contactFormPassengers')}: ${formData.passengers}` : '',
      formData.notes ? `${getTranslation(lang, 'contactFormNotes')}: ${formData.notes}` : ''
    ]
    
    return lines.filter(line => line).join('\n')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = buildWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Request Type Selector */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          {getTranslation(lang, 'contactFormRequestType')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(['quickQuote', 'fullTrip', 'package', 'visa', 'other'] as RequestType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setRequestType(type)}
              className={`px-4 py-3 rounded-lg border text-sm font-medium transition ${
                requestType === type
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
              }`}
            >
              {getRequestTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      {/* Traveler Type Toggle */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          {getTranslation(lang, 'contactTravelerTypeLabel')}
        </label>
        <div className="flex gap-4">
          {(['local', 'diaspora'] as TravelerType[]).map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="travelerType"
                value={type}
                checked={travelerType === type}
                onChange={() => setTravelerType(type)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-slate-700">
                {type === 'local'
                  ? getTranslation(lang, 'contactTravelerLocal')
                  : getTranslation(lang, 'contactTravelerDiaspora')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Form Fields - Grid Layout */}
      <div className="space-y-4">
        {/* From */}
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-slate-700 mb-1">
            {getTranslation(lang, 'contactFormFrom')}
          </label>
          <input
            type="text"
            id="from"
            name="from"
            placeholder="e.g., Asmara"
            value={formData.from}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* To */}
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-slate-700 mb-1">
            {getTranslation(lang, 'contactFormTo')}
          </label>
          <input
            type="text"
            id="to"
            name="to"
            placeholder="e.g., Toronto"
            value={formData.to}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dates */}
        <div>
          <label htmlFor="dates" className="block text-sm font-medium text-slate-700 mb-1">
            {getTranslation(lang, 'contactFormDates')}
          </label>
          <input
            type="text"
            id="dates"
            name="dates"
            placeholder="e.g., Dec 15 - Jan 10"
            value={formData.dates}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Passengers */}
        <div>
          <label htmlFor="passengers" className="block text-sm font-medium text-slate-700 mb-1">
            {getTranslation(lang, 'contactFormPassengers')}
          </label>
          <input
            type="number"
            id="passengers"
            name="passengers"
            min="1"
            value={formData.passengers}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
            {getTranslation(lang, 'contactFormNotes')}
            <span className="text-xs text-slate-500 font-normal ml-1">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Special requests, visa questions, hotel preferences, etc."
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Message Preview */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-slate-700 mb-2">Message Preview (will be sent via WhatsApp):</p>
        <p className="text-sm text-slate-700 whitespace-pre-wrap break-words font-mono">
          {buildWhatsAppMessage()}
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition flex items-center justify-center gap-2"
      >
        <span>💬</span> {getTranslation(lang, 'contactFormSubmit')}
      </button>

      {/* Info text */}
      <p className="text-xs text-slate-600 text-center">
        {getTranslation(lang, 'contactFormInfo')}
      </p>
    </form>
  )
}
