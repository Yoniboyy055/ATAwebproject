import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Make Stripe optional - return 400 if not configured
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    })
  : null

const CreatePaymentSchema = z.object({
  bookingId: z.string().min(1),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
})

export async function POST(request: NextRequest) {
  try {
    // Return error if Stripe not configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing not configured' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { bookingId, amount, currency } = CreatePaymentSchema.parse(body)

    // Verify booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.user.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { bookingId },
    })

    if (existingPayment && existingPayment.status === 'completed') {
      return NextResponse.json(
        { error: 'Payment already completed for this booking' },
        { status: 400 }
      )
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        bookingId,
        userId: booking.userId,
        email: session.user.email,
      },
    })

    // Create or update payment record
    const payment = await prisma.payment.upsert({
      where: { bookingId },
      update: {
        stripePaymentId: paymentIntent.id,
        amount,
        currency,
        status: 'processing',
      },
      create: {
        bookingId,
        userId: booking.userId,
        stripePaymentId: paymentIntent.id,
        amount,
        currency,
        status: 'processing',
      },
    })

    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id,
        amount,
        currency,
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
