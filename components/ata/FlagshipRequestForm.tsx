'use client'

import { FormEvent, useState } from 'react'
import { FLAGSHIP_PREVIEW_COPY } from '@/lib/ata/content-contract'

const requestTypes = [
  ['INFORMATION', 'Ask a question'],
  ['CONSULTATION', 'Request a consultation'],
  ['QUOTE', 'Request a quote'],
  ['BOOKING_REQUEST', 'Request to book'],
] as const

type Receipt = {
  requestId: string
  message: string
}

const field =
  'w-full border border-ata-hairline bg-white px-4 py-3.5 text-[15px] font-light text-ata-ink transition-colors focus:border-ata-brass focus:outline-none'
const fieldLabel =
  'mb-2.5 block text-[10px] font-medium uppercase tracking-eyebrow text-ata-ink-muted'

export default function FlagshipRequestForm() {
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setReceipt(null)
    setPending(true)

    const form = new FormData(event.currentTarget)
    const travelerCount = form.get('travelerCount')
    const preferredDate = form.get('preferredDate')

    try {
      const response = await fetch('/api/ata/requests', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: form.get('type'),
          tourId: 'working-candidate-asmara-massawa',
          fullName: form.get('fullName'),
          email: form.get('email'),
          phone: form.get('phone'),
          travelerCount: travelerCount ? Number(travelerCount) : null,
          preferredDate: preferredDate || null,
          preferredContact: form.get('preferredContact'),
          message: form.get('message') || null,
          consentAccepted: form.get('consentAccepted') === 'on',
          consentVersion: 'wp03c-preview-v1',
          website: form.get('website') || '',
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'The test request could not be accepted.')
      }
      setReceipt(result)
      event.currentTarget.reset()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'The test request could not be accepted.'
      )
    } finally {
      setPending(false)
    }
  }

  if (receipt) {
    return (
      <div
        className="border-l-2 border-ata-brass bg-ata-canvas px-7 py-8"
        role="status"
        tabIndex={-1}
      >
        <p className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass">
          Request received
        </p>
        <p className="mt-4 font-serif text-[24px] font-light leading-snug text-ata-ink">
          {receipt.message}
        </p>
        <p className="mt-5 break-all text-[13px] font-light text-ata-ink-soft">
          Your reference: <span className="font-mono">{receipt.requestId}</span>
        </p>
      </div>
    )
  }

  return (
    <form className="space-y-7" onSubmit={submit}>
      <p className="text-[16px] font-light leading-8 text-ata-ink-soft">
        {FLAGSHIP_PREVIEW_COPY.requestIntro}
      </p>
      <div>
        <label htmlFor="type" className={fieldLabel}>How can we help?</label>
        <select id="type" name="type" required className={field}>
          {requestTypes.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={fieldLabel}>Full name</label>
          <input id="fullName" name="fullName" required className={field} />
        </div>
        <div>
          <label htmlFor="email" className={fieldLabel}>Email</label>
          <input id="email" name="email" type="email" required className={field} />
        </div>
        <div>
          <label htmlFor="phone" className={fieldLabel}>Phone</label>
          <input id="phone" name="phone" type="tel" required className={field} />
        </div>
        <div>
          <label htmlFor="preferredContact" className={fieldLabel}>Preferred contact</label>
          <select id="preferredContact" name="preferredContact" className={field}>
            <option value="EMAIL">Email</option>
            <option value="PHONE">Phone</option>
            <option value="WHATSAPP">WhatsApp</option>
          </select>
        </div>
        <div>
          <label htmlFor="travelerCount" className={fieldLabel}>Travellers, if known</label>
          <input id="travelerCount" name="travelerCount" type="number" min="1" max="30" className={field} />
        </div>
        <div>
          <label htmlFor="preferredDate" className={fieldLabel}>Preferred date, if known</label>
          <input id="preferredDate" name="preferredDate" type="date" className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={fieldLabel}>Tell us about your trip</label>
        <textarea id="message" name="message" rows={5} maxLength={2000} className={field} />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-3.5 border-t border-ata-hairline pt-7 text-[14px] font-light leading-7 text-ata-ink-soft">
        <input name="consentAccepted" type="checkbox" required className="mt-1.5 h-4 w-4 shrink-0" />
        <span>
          I agree that ATA may use these details to respond to my request. This
          is not a confirmed booking, reservation, seat, price, or payment.
        </span>
      </label>

      {error && (
        <p
          className="border-l-2 border-rose-500 bg-rose-50 px-4 py-3 text-[14px] font-normal text-rose-900"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ata-ink px-6 py-[18px] text-[11px] font-medium uppercase tracking-eyebrow text-white transition-colors hover:bg-ata-brass focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ata-brass disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send to ATA'}
      </button>
    </form>
  )
}

