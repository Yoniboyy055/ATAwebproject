import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBookingConfirmation } from '@/lib/email'
import { sendBookingSMS } from '@/lib/sms'
import { generateBookingPDF } from '@/lib/pdf'

interface BookingRequestBody {
  tripType: 'one-way' | 'round-trip'
  passengers: number
  passengerNames: string[]
  phoneCountry: string
  fromCity: string
  toCity: string
  departDate: string
  returnDate?: string
  fullName: string
  phone: string
  email?: string
  notes?: string
  contactMethod: 'whatsapp' | 'phone' | 'email'
  promoCode?: string
  sendSMS?: boolean
  sendEmail?: boolean
}

interface BookingResponse {
  ok: boolean
  id?: string
  message?: string
  error?: string
  pdfUrl?: string
  emailSent?: boolean
  smsSent?: boolean
}

function generateBookingReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `AMT-${timestamp}-${random}`
}

function calculateTotal(passengers: number, promoCode?: string): { base: number; discount: number; total: number } {
  const base = passengers * 850
  const discount = promoCode === 'SAVE10' ? base * 0.1 : 0
  return { base, discount, total: base - discount }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingRequestBody

    // Basic validation
    if (
      !body.fullName ||
      !body.phone ||
      !body.fromCity ||
      !body.toCity ||
      !body.departDate
    ) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (body.tripType === 'round-trip' && !body.returnDate) {
      return NextResponse.json(
        { ok: false, error: 'Return date is required for round-trip bookings' },
        { status: 400 }
      )
    }

    // Generate booking reference
    const bookingReference = generateBookingReference()
    const pricing = calculateTotal(body.passengers, body.promoCode)
    const bookingDate = new Date().toISOString()

    // Try to save to database
    let bookingId = ''
    try {
      const bookingRequest = await prisma.bookingRequest.create({
        data: {
          tripType: body.tripType,
          passengers: body.passengers,
          fromCity: body.fromCity,
          toCity: body.toCity,
          departDate: body.departDate ? new Date(body.departDate) : null,
          returnDate: body.returnDate ? new Date(body.returnDate) : null,
          fullName: body.fullName,
          phone: body.phone,
          email: body.email || null,
          notes: body.notes || null,
          contactMethod: body.contactMethod,
          status: 'new',
        },
      })
      bookingId = bookingRequest.id
    } catch (dbError) {
      // Log error but don't fail - database might not be configured
      console.warn('Database error (proceeding without DB):', dbError)
      // Generate a pseudo-ID for the response
      bookingId = bookingReference
    }

    let pdfUrl: string | undefined
    let emailSent = false
    let smsSent = false

    // Generate PDF receipt
    try {
      pdfUrl = generateBookingPDF({
        bookingReference,
        customerName: body.fullName,
        customerEmail: body.email || 'noemail@provided.com',
        customerPhone: `${body.phoneCountry}${body.phone}`,
        tripType: body.tripType,
        fromCity: body.fromCity,
        toCity: body.toCity,
        passengers: body.passengers,
        passengerNames: body.passengerNames,
        departDate: body.departDate,
        returnDate: body.returnDate,
        basePrice: pricing.base,
        discount: pricing.discount,
        total: pricing.total,
        promoCode: body.promoCode,
        bookingDate,
      })
    } catch (pdfError) {
      console.warn('PDF generation failed:', pdfError)
    }

    // Send email confirmation if enabled
    if (body.sendEmail && body.email) {
      try {
        await sendBookingConfirmation({
          customerName: body.fullName,
          customerEmail: body.email,
          bookingReference,
          tripType: body.tripType,
          fromCity: body.fromCity,
          toCity: body.toCity,
          passengers: body.passengers,
          passengerNames: body.passengerNames,
          departDate: body.departDate,
          returnDate: body.returnDate,
          total: pricing.total,
          promoCode: body.promoCode,
        })
        emailSent = true
      } catch (emailError) {
        console.warn('Email sending failed:', emailError)
      }
    }

    // Send SMS if enabled
    if (body.sendSMS && body.phone) {
      try {
        await sendBookingSMS({
          phoneNumber: body.phone,
          phoneCountry: body.phoneCountry,
          customerName: body.fullName,
          bookingReference,
          fromCity: body.fromCity,
          toCity: body.toCity,
          departDate: body.departDate,
          total: pricing.total,
        })
        smsSent = true
      } catch (smsError) {
        console.warn('SMS sending failed:', smsError)
      }
    }

    // Log the booking request
    console.log('Booking request received:', {
      id: bookingId,
      reference: bookingReference,
      fullName: body.fullName,
      fromCity: body.fromCity,
      toCity: body.toCity,
      contactMethod: body.contactMethod,
      emailSent,
      smsSent,
    })

    const response: BookingResponse = {
      ok: true,
      id: bookingId,
      message: 'Booking request submitted successfully',
      pdfUrl,
      emailSent,
      smsSent,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to process booking request',
      },
      { status: 500 }
    )
  }
}
