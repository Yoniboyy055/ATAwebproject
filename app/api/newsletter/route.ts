import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Newsletter {
  email: string;
  subscribedAt: string;
}

const newsletterFile = path.join(process.cwd(), 'data', 'newsletter.json');

async function readNewsletterList(): Promise<Newsletter[]> {
  try {
    const data = await fs.readFile(newsletterFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeNewsletterList(subscribers: Newsletter[]) {
  await fs.mkdir(path.dirname(newsletterFile), { recursive: true });
  await fs.writeFile(newsletterFile, JSON.stringify(subscribers, null, 2));
}

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

    const subscribers = await readNewsletterList();
    
    // Check if already subscribed
    if (subscribers.some((sub) => sub.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 400 }
      );
    }

    // Add new subscriber
    subscribers.push({
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
    });

    await writeNewsletterList(subscribers);

    return NextResponse.json(
      { 
        message: 'Successfully subscribed!',
        totalSubscribers: subscribers.length 
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
    const subscribers = await readNewsletterList();
    return NextResponse.json(
      { totalSubscribers: subscribers.length },
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
