# Database + Payment + Authentication Setup Guide

## 🚀 Quick Start

This guide walks you through setting up PostgreSQL, Prisma ORM, Stripe payments, and enhanced NextAuth authentication.

## Prerequisites

- Node.js 18+ (already installed)
- PostgreSQL 14+ (local or cloud)
- Stripe account (for payments)

## Step 1: Setup PostgreSQL Database

### Option A: Local PostgreSQL (Windows)

1. Download and install PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and remember your password for the `postgres` user
3. Open pgAdmin (comes with PostgreSQL)
4. Create a new database:
   ```sql
   CREATE DATABASE amanuel_travel;
   ```

### Option B: Cloud PostgreSQL (Recommended for Production)

Use one of these services:
- **Vercel PostgreSQL** (built for Next.js): https://vercel.com/storage/postgres
- **Supabase** (PostgreSQL + extras): https://supabase.com
- **Railway** (easy deployment): https://railway.app
- **Neon** (serverless): https://neon.tech

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your values:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/amanuel_travel"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Get Stripe Keys:
1. Sign up at https://stripe.com
2. Go to Developers → API Keys
3. Copy Publishable Key and Secret Key
4. For webhooks, go to Webhooks and create endpoint for:
   - `http://localhost:3000/api/webhooks/stripe` (dev)
   - Copy the Signing Secret

## Step 3: Initialize Database Schema

```bash
# Push schema to database
npm run db:push

# Or create migrations (for production)
npx prisma migrate dev --name init
```

## Step 4: Seed Sample Data (Optional)

```bash
npm run db:seed
```

This creates:
- 4 sample packages
- 2 demo users (email: `demo@example.com`, password: `DemoPassword123`)
- Sample bookings and quotes

## Step 5: Test the Setup

### 1. Start the development server:
```bash
npm run dev
```

### 2. Test API endpoints:

**Register new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe",
    "phone": "+1234567890"
  }'
```

**Create a booking:**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "packageId": "package-id",
    "departureDate": "2026-02-15T00:00:00Z",
    "returnDate": "2026-02-25T00:00:00Z",
    "passengers": 2,
    "destination": "Asmara"
  }'
```

**Create a payment:**
```bash
curl -X POST http://localhost:3000/api/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "bookingId": "booking-id",
    "amount": 599.99,
    "currency": "USD"
  }'
```

## File Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── register/route.ts          ← User registration
│   │   └── [...nextauth]/route.ts     ← NextAuth handler
│   ├── bookings/route.ts              ← Booking CRUD
│   ├── quotes/route.ts                ← Quote request CRUD
│   ├── payments/
│   │   └── create/route.ts            ← Payment initialization
│   └── webhooks/
│       └── stripe/route.ts            ← Stripe webhook handler
lib/
├── prisma.ts                          ← Prisma client singleton
├── auth.ts                            ← NextAuth configuration
├── password.ts                        ← Password hashing utilities
prisma/
├── schema.prisma                      ← Database schema
└── seed.ts                            ← Database seeding
```

## Database Schema Overview

### Core Tables:
- **users** - User accounts with email/password and OAuth support
- **accounts** - OAuth provider links
- **sessions** - Session management
- **packages** - Travel packages offered
- **bookings** - Customer bookings
- **quotes** - Price quote requests
- **payments** - Stripe payment records
- **reviews** - Customer testimonials
- **newsletters** - Email subscribers

## Authentication Flow

### Email/Password Login:
1. User registers via `/api/auth/register`
2. Password is hashed with bcryptjs (10 rounds)
3. Session created via NextAuth JWT strategy
4. Token valid for 30 days

### Google OAuth:
1. User clicks "Sign in with Google"
2. Redirected to Google consent screen
3. Account linked via Prisma adapter
4. User auto-created if first time

## Payment Flow

### Creating a Payment:
1. User creates booking
2. Click "Pay Now" → POST `/api/payments/create`
3. Receive Stripe `clientSecret`
4. Show Stripe payment form to user
5. User enters card details
6. Stripe processes payment

### Webhook Handling:
1. Stripe sends event to `/api/webhooks/stripe`
2. Webhook handler verifies signature
3. On success: booking status → "confirmed"
4. On failure: payment status → "failed"

## Common Issues & Solutions

### "Adapter Error" on Auth Pages
**Solution**: Ensure DATABASE_URL is set and database is running

### "Payment Intent not found"
**Solution**: Check STRIPE_SECRET_KEY is correct and matches Publishable Key

### "Webhook Signature Invalid"
**Solution**: Ensure STRIPE_WEBHOOK_SECRET matches Stripe dashboard

### Database Connection Error
**Solution**: 
```bash
# Verify connection
psql DATABASE_URL
```

## Next Steps

1. **Add Admin Dashboard**: Create `/app/admin` routes for managing bookings and quotes
2. **Email Notifications**: Integrate SendGrid or Mailgun for transactional emails
3. **SMS Support**: Use Twilio for SMS alerts
4. **Rate Limiting**: Add tRPC or API rate limiting
5. **Tests**: Add unit and integration tests with Jest
6. **Production Deployment**: Deploy to Vercel with PostgreSQL

## Useful Commands

```bash
# View database GUI
npx prisma studio

# Create new migration
npx prisma migrate dev --name add_feature

# Reset database (CAREFUL - deletes all data)
npm run db:reset

# Generate Prisma client (after schema changes)
npm run prisma:generate

# Check migration status
npx prisma migrate status
```

## Security Best Practices

✅ **Done:**
- Password hashing with bcryptjs
- Secure session tokens
- NEXTAUTH_SECRET configured
- Stripe webhook signature verification

✅ **To Do:**
- Rate limiting on APIs
- CORS configuration
- Input validation (using zod)
- SQL injection prevention (Prisma handles this)
- CSRF protection for forms

## Support

- Prisma docs: https://www.prisma.io/docs/
- NextAuth docs: https://next-auth.js.org/
- Stripe docs: https://stripe.com/docs
- Next.js API routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

**Status**: ✅ Backend infrastructure ready for production
**Last Updated**: January 2026
