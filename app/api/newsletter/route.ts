import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function isValidEmail(email: string): Promise<boolean> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!(await isValidEmail(email))) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (existing && existing.subscribed) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 400 }
      );
    }

    // Upsert subscriber (create or update if exists)
    await prisma.newsletter.upsert({
      where: { email: email.toLowerCase() },
      update: { subscribed: true },
      create: {
        email: email.toLowerCase(),
        subscribed: true,
      },
    });

    // Get total count
    const totalSubscribers = await prisma.newsletter.count({
      where: { subscribed: true },
    });

    return NextResponse.json(
      { 
        message: 'Successfully subscribed!',
        totalSubscribers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const totalSubscribers = await prisma.newsletter.count({
      where: { subscribed: true },
    });
    return NextResponse.json(
      { totalSubscribers },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error reading newsletter list:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve data' },
      { status: 500 }
    );
  }
}
