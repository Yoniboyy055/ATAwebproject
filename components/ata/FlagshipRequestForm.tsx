'use client'

import { FormEvent, useState } from 'react'

const requestTypes = [
  ['INFORMATION', 'Ask a question'],
  ['CONSULTATION', 'Request a consultation'],
  ['QUOTE', 'Request a quote'],
  ['BOOKING_REQUEST', 'Request to book'],
  ['PROVISIONAL_RESERVATION', 'Request a provisional reservation'],
] as const

type Receipt = {
  requestId: string
  message: string
}

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
          consentVersion: 'wp02-test-v1',
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
        className="rounded-3xl border border-emerald-300 bg-emerald-50 p-6 text-emerald-950"
        role="status"
        tabIndex={-1}
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em]">
          Test request received
        </p>
        <p className="mt-3 text-lg font-semibold">{receipt.message}</p>
        <p className="mt-3 break-all font-mono text-xs">{receipt.requestId}</p>
      </div>
    )
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <div>
        <label htmlFor="type">What would you like ATA to review?</label>
        <select id="type" name="type" required className="w-full rounded-xl border-slate-300">
          {requestTypes.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" name="fullName" required className="w-full rounded-xl border-slate-300" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="w-full rounded-xl border-slate-300" />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" required className="w-full rounded-xl border-slate-300" />
        </div>
        <div>
          <label htmlFor="preferredContact">Preferred contact</label>
          <select id="preferredContact" name="preferredContact" className="w-full rounded-xl border-slate-300">
            <option value="EMAIL">Email</option>
            <option value="PHONE">Phone</option>
            <option value="WHATSAPP">WhatsApp</option>
          </select>
        </div>
        <div>
          <label htmlFor="travelerCount">Travelers, if known</label>
          <input id="travelerCount" name="travelerCount" type="number" min="1" max="30" className="w-full rounded-xl border-slate-300" />
        </div>
        <div>
          <label htmlFor="preferredDate">Preferred date, if known</label>
          <input id="preferredDate" name="preferredDate" type="date" className="w-full rounded-xl border-slate-300" />
        </div>
      </div>

      <div>
        <label htmlFor="message">What should ATA know?</label>
        <textarea id="message" name="message" rows={4} maxLength={2000} className="w-full rounded-xl border-slate-300" />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-3 text-sm font-normal text-slate-700">
        <input name="consentAccepted" type="checkbox" required className="mt-1 h-4 w-4" />
        <span>
          I agree that this information may be used to review and respond to this
          test request. Nothing submitted here confirms a booking, reservation,
          seat, price, or payment.
        </span>
      </label>

      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-800" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#0b3b3c] px-6 py-4 font-bold text-white hover:bg-[#062a2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c75b39] disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? 'Sending test request…' : 'Send test request'}
      </button>
    </form>
  )
}

