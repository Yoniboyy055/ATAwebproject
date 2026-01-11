import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const CreateBookingSchema = z.object({
  packageId: z.string().min(1),
  departureDate: z.string().datetime(),
  returnDate: z.string().datetime().optional(),
  passengers: z.number().int().min(1).default(1),
  destination: z.string().optional(),
  phoneNumber: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = CreateBookingSchema.parse(body)

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify package exists
    const pkg = await prisma.package.findUnique({
      where: { id: data.packageId },
    })

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        packageId: data.packageId,
        departureDate: new Date(data.departureDate),
        returnDate: data.returnDate ? new Date(data.returnDate) : undefined,
        passengers: data.passengers,
        destination: data.destination,
        phoneNumber: data.phoneNumber || user.phone || undefined,
        notes: data.notes,
        status: 'pending',
      },
      include: {
        package: true,
      },
    })

    return NextResponse.json(
      {
        message: 'Booking created successfully',
        booking,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's bookings
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        package: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
