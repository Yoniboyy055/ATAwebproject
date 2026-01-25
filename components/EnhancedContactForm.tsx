'use client'

import { useState } from 'react'
import { useLang } from './LangProvider'
import { getTranslation } from '@/lib/lang'
import { BRAND } from '@/lib/config'
import Button, { buttonClasses } from '@/components/ui/Button'
import Input from '@/components/ui/Input'

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
              className={buttonClasses({
                variant: requestType === type ? 'primary' : 'secondary',
                size: 'sm',
                className: requestType === type ? 'bg-slate-900 hover:bg-slate-900' : ''
              })}
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
                className="h-4 w-4 text-primary"
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
        <Input
          type="text"
          id="from"
          name="from"
          label={getTranslation(lang, 'contactFormFrom')}
          placeholder="e.g., Asmara"
          value={formData.from}
          onChange={handleInputChange}
        />

        {/* To */}
        <Input
          type="text"
          id="to"
          name="to"
          label={getTranslation(lang, 'contactFormTo')}
          placeholder="e.g., Toronto"
          value={formData.to}
          onChange={handleInputChange}
        />

        {/* Dates */}
        <Input
          type="text"
          id="dates"
          name="dates"
          label={getTranslation(lang, 'contactFormDates')}
          placeholder="e.g., Dec 15 - Jan 10"
          value={formData.dates}
          onChange={handleInputChange}
        />

        {/* Passengers */}
        <Input
          type="number"
          id="passengers"
          name="passengers"
          label={getTranslation(lang, 'contactFormPassengers')}
          min="1"
          value={formData.passengers}
          onChange={handleInputChange}
        />

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
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Message Preview */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="mb-2 text-xs font-semibold text-slate-700">
          Message preview (shared with your agent):
        </p>
        <p className="text-sm text-slate-700 whitespace-pre-wrap break-words font-mono">
          {buildWhatsAppMessage()}
        </p>
      </div>

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full">
        {getTranslation(lang, 'contactFormSubmit')}
      </Button>

      {/* Info text */}
      <p className="text-xs text-slate-600 text-center">
        {getTranslation(lang, 'contactFormInfo')}
      </p>
    </form>
  )
}
