'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/Button'
import { analytics } from '@/components/GoogleAnalytics'

interface BookingFormData {
  tripType: 'one-way' | 'round-trip'
  passengers: number
  passengerNames: string[]
  fromCity: string
  toCity: string
  departDate: string
  returnDate: string
  fullName: string
  phone: string
  phoneCountry: string
  email: string
  emailVerified: boolean
  notes: string
  contactMethod: 'whatsapp' | 'phone' | 'email'
  promoCode: string
  sendEmail: boolean
  sendSMS: boolean
}

interface SubmitResponse {
  ok: boolean
  id?: string
  error?: string
  pdfUrl?: string
  emailSent?: boolean
  smsSent?: boolean
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>({
    tripType: 'round-trip',
    passengers: 1,
    passengerNames: [''],
    fromCity: '',
    toCity: '',
    departDate: '',
    returnDate: '',
    fullName: '',
    phone: '',
    phoneCountry: '+1',
    email: '',
    emailVerified: false,
    notes: '',
    contactMethod: 'whatsapp',
    promoCode: '',
    sendEmail: false,
    sendSMS: false,
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [submittedId, setSubmittedId] = useState('')
  const [bookingReference, setBookingReference] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [smsSent, setSmsSent] = useState(false)
  const [stripeAvailable, setStripeAvailable] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)

  const whatsappNumber = '2917197086'
  const totalSteps = 4

  const countryCodes = [
    { code: '+1', name: 'USA/Canada' },
    { code: '+44', name: 'UK' },
    { code: '+91', name: 'India' },
    { code: '+234', name: 'Nigeria' },
    { code: '+291', name: 'Eritrea' },
    { code: '+212', name: 'Morocco' },
    { code: '+254', name: 'Kenya' },
    { code: '+27', name: 'South Africa' },
    { code: '+33', name: 'France' },
    { code: '+49', name: 'Germany' },
  ]

  useEffect(() => {
    fetch('/api/payments/create', { method: 'HEAD' })
      .then(() => setStripeAvailable(true))
      .catch(() => setStripeAvailable(false))
  }, [])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      passengerNames: Array(prev.passengers)
        .fill('')
        .map((_, i) => prev.passengerNames[i] || ''),
    }))
  }, [formData.passengers])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'passengers' ? parseInt(value) || 1 : value,
    }))
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handlePassengerNameChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      passengerNames: prev.passengerNames.map((name, i) => (i === index ? value : name)),
    }))
  }

  const handleEmailVerification = async () => {
    if (!formData.email) {
      setValidationErrors((prev) => ({
        ...prev,
        email: 'Please enter email first',
      }))
      return
    }
    setEmailVerificationSent(true)
    setFormData((prev) => ({ ...prev, emailVerified: true }))
    alert(`Verification email would be sent to ${formData.email}`)
  }

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.fromCity.trim()) errors.fromCity = 'Departure city required'
      if (!formData.toCity.trim()) errors.toCity = 'Arrival city required'
      if (!formData.departDate) errors.departDate = 'Departure date required'
      if (formData.tripType === 'round-trip' && !formData.returnDate) {
        errors.returnDate = 'Return date required'
      }
    } else if (step === 2) {
      for (let i = 0; i < formData.passengerNames.length; i++) {
        if (!formData.passengerNames[i].trim()) {
          errors[`passenger_${i}`] = `Passenger ${i + 1} name required`
        }
      }
    } else if (step === 3) {
      if (!formData.fullName.trim()) errors.fullName = 'Full name required'
      if (!formData.phone.trim()) errors.phone = 'Phone number required'
      else if (!/^[\d\s-()]{7,}$/.test(formData.phone)) {
        errors.phone = 'Invalid phone format'
      }
    } else if (step === 4) {
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateStep(currentStep)) return

    setLoading(true)

    try {
      const submitData = {
        tripType: formData.tripType,
        passengers: formData.passengers,
        passengerNames: formData.passengerNames,
        phoneCountry: formData.phoneCountry,
        fromCity: formData.fromCity,
        toCity: formData.toCity,
        departDate: formData.departDate,
        returnDate: formData.returnDate,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
        contactMethod: formData.contactMethod,
        promoCode: formData.promoCode,
        sendEmail: formData.sendEmail && formData.email,
        sendSMS: formData.sendSMS,
      }

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      const data: SubmitResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking')
      }

      if (data.ok && data.id) {
        setSuccess(true)
        setSubmittedId(data.id)
        setBookingReference(
          submitData.passengerNames[0] && submitData.fullName
            ? `AMT-${Date.now().toString(36).toUpperCase()}`
            : data.id
        )
        setPdfUrl(data.pdfUrl || '')
        setEmailSent(data.emailSent || false)
        setSmsSent(data.smsSent || false)

        // Track booking completion
        analytics.trackBookingComplete(
          data.id,
          formData.passengers * 850,
          formData.passengers
        )

        // Track form submission
        analytics.trackFormSubmission('booking_form', 12)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createWhatsAppMessage = () => {
    const passengersText = formData.passengerNames.filter((n) => n.trim()).join(', ')
    const summary = `Hello! I would like to book a ${formData.tripType === 'round-trip' ? 'round-trip' : 'one-way'} flight from ${formData.fromCity} to ${formData.toCity} for ${formData.passengers} passenger${formData.passengers > 1 ? 's' : ''} (${passengersText}). ${formData.notes ? `Special requests: ${formData.notes}` : ''} Please contact me at ${formData.phoneCountry}${formData.phone}.`
    const encoded = encodeURIComponent(summary)
    return `https://wa.me/${whatsappNumber}?text=${encoded}`
  }

  const calculateTotal = () => {
    const basePrice = formData.passengers * 850
    const discount = formData.promoCode === 'SAVE10' ? basePrice * 0.1 : 0
    return basePrice - discount
  }

  if (success) {
    const total = calculateTotal()
    const basePrice = formData.passengers * 850

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 mb-2 text-center">
              Thank you for your booking request, <span className="font-semibold">{formData.fullName}</span>.
            </p>
            <p className="text-sm text-gray-500 mb-6 text-center">
              We&apos;ll review your details and contact you via <span className="font-medium">{formData.contactMethod}</span>.
            </p>

            <div className="bg-slate-50 rounded-lg p-4 sm:p-6 mb-6 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-gray-700">Trip Type:</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {formData.tripType === 'round-trip' ? 'Round-trip' : 'One-way'}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-700">Route:</span>
                <span className="font-semibold text-gray-900">
                  {formData.fromCity} → {formData.toCity}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-700">Passengers:</span>
                <span className="font-semibold text-gray-900">{formData.passengers}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-700">Traveler Names:</span>
                <span className="font-semibold text-gray-900 text-right">
                  {formData.passengerNames.filter((n) => n.trim()).join(', ')}
                </span>
              </div>
              <div className="flex justify-between items-start border-t border-gray-200 pt-3">
                <span className="text-gray-700">Departure:</span>
                <span className="font-semibold text-gray-900">
                  {new Date(formData.departDate).toLocaleDateString()}
                </span>
              </div>
              {formData.returnDate && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-700">Return:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(formData.returnDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Booking Reference with Copy Button */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Your Booking Reference:</p>
              <div className="flex items-center justify-between gap-3">
                <code className="flex-1 text-lg font-mono font-bold text-blue-600 break-all">
                  {bookingReference || submittedId}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(bookingReference || submittedId)
                    alert('Booking reference copied to clipboard!')
                  }}
                  className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition text-sm whitespace-nowrap"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Communication Status */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {emailSent && (
                <div className="bg-green-50 rounded-lg p-3 flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold text-green-900">Email Sent</p>
                    <p className="text-xs text-green-700">{formData.email}</p>
                  </div>
                </div>
              )}
              {smsSent && (
                <div className="bg-green-50 rounded-lg p-3 flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold text-green-900">SMS Sent</p>
                    <p className="text-xs text-green-700">{formData.phoneCountry}{formData.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Download PDF Receipt */}
            {pdfUrl && (
              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 mb-3">📄 Receipt available</p>
                <a
                  href={pdfUrl}
                  download={`booking-receipt-${bookingReference || submittedId}.pdf`}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition text-center text-sm block"
                >
                  Download Receipt PDF
                </a>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <a
                href={createWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition text-center text-sm sm:text-base"
              >
                💬 Chat on WhatsApp Now
              </a>
              <Link href="/" className="block">
                <Button variant="ghost" className="w-full text-sm sm:text-base">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>

          {stripeAvailable && (
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 border-2 border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Secure Payment Option</h3>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Base price ({formData.passengers} × $850)</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                {formData.promoCode === 'SAVE10' && (
                  <div className="flex justify-between text-sm text-green-600 border-t border-blue-200 pt-2">
                    <span>Promo discount (10%)</span>
                    <span>-${(basePrice * 0.1).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-blue-200 pt-2">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                You can secure your booking with a deposit payment using a credit or debit card.
              </p>

              <button
                onClick={async () => {
                  setPaymentLoading(true)
                  try {
                    // Track payment initiation
                    analytics.trackEvent('payment_initiated', {
                      booking_id: submittedId,
                      amount: total,
                      currency: 'USD',
                    })

                    const response = await fetch('/api/payments/create', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        bookingId: submittedId,
                        amount: Math.round(total * 100),
                        currency: 'USD',
                      }),
                    })

                    const data = await response.json()
                    if (data.clientSecret) {
                      // Track successful payment creation
                      analytics.trackPayment(total, 'USD', submittedId)
                      alert('Payment processing would redirect to Stripe in production')
                    } else {
                      throw new Error(data.error || 'Failed to create payment')
                    }
                  } catch (err) {
                    // Track payment error
                    analytics.trackEvent('payment_error', {
                      error: err instanceof Error ? err.message : 'Unknown error',
                    })
                    alert(err instanceof Error ? err.message : 'Payment error')
                  } finally {
                    setPaymentLoading(false)
                  }
                }}
                disabled={paymentLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition text-sm sm:text-base"
              >
                {paymentLoading ? 'Processing...' : '💳 Proceed to Payment'}
              </button>
            </div>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Book Your Trip</h1>
            <span className="text-sm font-semibold text-blue-600">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          <div className="flex justify-between mt-4 text-xs sm:text-sm">
            {[
              { num: 1, label: 'Trip' },
              { num: 2, label: 'Travelers' },
              { num: 3, label: 'Contact' },
              { num: 4, label: 'Review' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step.num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.num}
                </div>
                <span className="text-gray-600 mt-1">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Trip Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="tripType"
                      value="one-way"
                      checked={formData.tripType === 'one-way'}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">One-way Flight</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="tripType"
                      value="round-trip"
                      checked={formData.tripType === 'round-trip'}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">Round-trip</span>
                  </label>
                </div>

                <div>
                  <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Passengers (1-9)
                  </label>
                  <select
                    id="passengers"
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} passenger{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fromCity" className="block text-sm font-medium text-gray-700 mb-1">
                      Departure City *
                    </label>
                    <input
                      type="text"
                      id="fromCity"
                      name="fromCity"
                      value={formData.fromCity}
                      onChange={handleChange}
                      placeholder="e.g., New York"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                        validationErrors.fromCity
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {validationErrors.fromCity && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.fromCity}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="toCity" className="block text-sm font-medium text-gray-700 mb-1">
                      Arrival City *
                    </label>
                    <input
                      type="text"
                      id="toCity"
                      name="toCity"
                      value={formData.toCity}
                      onChange={handleChange}
                      placeholder="e.g., Asmara"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                        validationErrors.toCity
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {validationErrors.toCity && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.toCity}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="departDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Date *
                    </label>
                    <input
                      type="date"
                      id="departDate"
                      name="departDate"
                      value={formData.departDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                        validationErrors.departDate
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {validationErrors.departDate && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.departDate}</p>
                    )}
                  </div>
                  {formData.tripType === 'round-trip' && (
                    <div>
                      <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Return Date *
                      </label>
                      <input
                        type="date"
                        id="returnDate"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                          validationErrors.returnDate
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {validationErrors.returnDate && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.returnDate}</p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Traveler Details</h2>
                <p className="text-gray-600 mb-6">
                  Please enter the full names of all travelers.
                </p>

                <div className="space-y-4">
                  {Array.from({ length: formData.passengers }).map((_, index) => (
                    <div key={index}>
                      <label
                        htmlFor={`passenger_${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Traveler {index + 1} Name *
                      </label>
                      <input
                        type="text"
                        id={`passenger_${index}`}
                        value={formData.passengerNames[index] || ''}
                        onChange={(e) => handlePassengerNameChange(index, e.target.value)}
                        placeholder={`Full name of traveler ${index + 1}`}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                          validationErrors[`passenger_${index}`]
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {validationErrors[`passenger_${index}`] && (
                        <p className="mt-1 text-sm text-red-600">
                          {validationErrors[`passenger_${index}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                        validationErrors.fullName
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {validationErrors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="phoneCountry"
                        value={formData.phoneCountry}
                        onChange={handleChange}
                        className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                          validationErrors.phone
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                        validationErrors.email
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {formData.email && !emailVerificationSent && (
                      <button
                        type="button"
                        onClick={handleEmailVerification}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition text-sm"
                      >
                        Verify
                      </button>
                    )}
                    {emailVerificationSent && (
                      <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        ✓ Verified
                      </div>
                    )}
                  </div>
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Contact Method
                  </label>
                  <div className="space-y-2">
                    {['whatsapp', 'phone', 'email'].map((method) => (
                      <label key={method} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="contactMethod"
                          value={method}
                          checked={formData.contactMethod === method}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3 text-gray-700 capitalize">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests or Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special requirements?"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Review & Apply Promo</h2>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <input
                    type="text"
                    id="promoCode"
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleChange}
                    placeholder="Enter promo code (e.g., SAVE10)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.promoCode === 'SAVE10' ? '✓ Valid code applied (10% off)' : 'Tip: Try SAVE10 for 10% discount'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6">
                  <h3 className="font-semibold text-gray-900">Booking Summary</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Trip:</strong> {formData.tripType} from {formData.fromCity} to {formData.toCity}
                    </p>
                    <p>
                      <strong>Travelers:</strong> {formData.passengerNames.filter((n) => n.trim()).join(', ')}
                    </p>
                    <p>
                      <strong>Dates:</strong> {new Date(formData.departDate).toLocaleDateString()}
                      {formData.returnDate && ` - ${new Date(formData.returnDate).toLocaleDateString()}`}
                    </p>
                    <p>
                      <strong>Contact:</strong> {formData.phoneCountry}
                      {formData.phone} ({formData.contactMethod})
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base price ({formData.passengers} × $850)</span>
                      <span>${(formData.passengers * 850).toFixed(2)}</span>
                    </div>
                    {formData.promoCode === 'SAVE10' && (
                      <div className="flex justify-between text-sm text-green-600 border-t border-blue-200 pt-2">
                        <span>Promo discount (10%)</span>
                        <span>-${((formData.passengers * 850 * 0.1).toFixed(2))}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold border-t border-blue-200 pt-2">
                      <span>Estimated Total</span>
                      <span className="text-lg text-blue-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-6">
                  By submitting, you agree to our terms and conditions. You&apos;ll be contacted shortly to confirm your booking.
                </p>

                {/* Communication Preferences */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Communication Preferences
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer hover:bg-white/50 p-2 rounded">
                      <input
                        type="checkbox"
                        name="sendEmail"
                        checked={formData.sendEmail}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sendEmail: e.target.checked }))}
                        disabled={!formData.email}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        📧 Send confirmation email {!formData.email && <span className="text-xs text-gray-500">(add email above)</span>}
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer hover:bg-white/50 p-2 rounded">
                      <input
                        type="checkbox"
                        name="sendSMS"
                        checked={formData.sendSMS}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sendSMS: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        📱 Send SMS confirmation
                      </span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>✈️ Complete Booking</>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
