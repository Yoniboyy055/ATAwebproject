import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

// Make Stripe optional - return 400 if not configured
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    })
  : null

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Return error if Stripe not configured
    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 400 }
      )
    }

    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle payment intent events
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        const metadata = paymentIntent.metadata as Record<string, string> & { bookingId?: string }
        const bookingId = metadata?.bookingId

        if (bookingId) {
          await prisma.payment.updateMany({
            where: { stripePaymentId: paymentIntent.id },
            data: {
              status: 'completed',
            },
          })

          // Update booking status
          await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'confirmed' },
          })

          // Payment succeeded for booking
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await prisma.payment.updateMany({
          where: { stripePaymentId: paymentIntent.id },
          data: {
            status: 'failed',
          },
        })

        // Payment failed for payment intent
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string

        if (paymentIntentId) {
          await prisma.payment.updateMany({
            where: { stripePaymentId: paymentIntentId },
            data: {
              status: 'failed', // or a separate 'refunded' status if you want
            },
          })

          // Payment refunded for payment intent
        }
        break
      }

      default:
        // Unhandled event type
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
