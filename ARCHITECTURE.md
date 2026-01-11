# System Architecture Overview

## Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       User Browser / Mobile                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Next.js    │
                    │   Frontend  │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼─────┐  ┌────────▼──────┐  ┌──────▼──────┐
    │ Auth API │  │ Booking API   │  │ Payment API │
    │/register │  │ /bookings     │  │ /payments   │
    └────┬─────┘  └────────┬──────┘  └──────┬──────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
                    ┌──────▼──────────┐
                    │   Prisma ORM    │
                    │  (Type-safe)    │
                    └──────┬──────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
      ┌─────▼────┐  ┌──────▼──────┐  ┌───▼────────┐
      │PostgreSQL│  │ Encryption  │  │ Validation │
      │Database  │  │ (bcryptjs)  │  │ (Zod)      │
      └──────────┘  └─────────────┘  └────────────┘

                    External Services
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
    ┌────▼──────────┐            ┌──────────▼────┐
    │ Stripe API    │            │ NextAuth OAuth│
    │(Payments)     │            │(Google)       │
    └───────────────┘            └────────────────┘
```

## Database Schema Relationship Diagram

```
                    ┌─────────┐
                    │  User   │
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        │                │                │
   ┌────▼────┐      ┌────▼──────┐    ┌───▼────┐
   │ Booking │      │   Quote   │    │ Review  │
   └────┬────┘      └────┬──────┘    └─────────┘
        │                │
        │                └────────┐
        │                         │
   ┌────▼────────┐          ┌────▼──────┐
   │   Payment   │          │ Package   │
   └─────────────┘          └───────────┘


   User → Account (OAuth)
   User → Session (JWT)
   User → SavedPackage (Favorites)
```

## Authentication Flow

```
┌──────────────┐
│   Start      │
└──────┬───────┘
       │
       ├─────────────────────────────────────┐
       │                                     │
       │ Choice: OAuth or Email/Password     │
       │                                     │
   ┌───▼──────────┐              ┌──────────▼─────┐
   │   Google     │              │ Email/Password │
   │   OAuth      │              │   Credentials  │
   └───┬──────────┘              └──────────┬─────┘
       │                                    │
       │ 1. Redirect to Google             │ 1. POST /api/auth/register
       │ 2. Get OAuth token               │ 2. Hash password (bcryptjs)
       │ 3. Find or create user           │ 3. Store in DB
       │                                    │
       └────────────┬─────────────────────┘
                    │
              ┌─────▼──────┐
              │Create Acc. │
              │(Prisma)    │
              └─────┬──────┘
                    │
              ┌─────▼──────┐
              │JWT Token   │
              │Valid 30d   │
              └─────┬──────┘
                    │
              ┌─────▼──────┐
              │Set Session │
              │in Cookie   │
              └─────┬──────┘
                    │
              ┌─────▼──────┐
              │  Success   │
              │ Logged In  │
              └────────────┘
```

## Payment Processing Flow

```
┌──────────────────────┐
│  User Clicks "Pay"   │
└──────────┬───────────┘
           │
      ┌────▼──────────────────────────┐
      │POST /api/payments/create      │
      │  - bookingId                  │
      │  - amount                     │
      │  - currency                   │
      └────┬───────────────────────────┘
           │
      ┌────▼──────────────┐
      │ Verify booking    │
      │ (belongs to user) │
      └────┬──────────────┘
           │
      ┌────▼──────────────────────┐
      │ Create Stripe PaymentInt  │
      │ (amount in cents)         │
      └────┬─────────────────────┘
           │
      ┌────▼──────────────────────┐
      │ Store Payment in DB       │
      │ (status: processing)      │
      └────┬─────────────────────┘
           │
      ┌────▼──────────────────────┐
      │ Return clientSecret       │
      │ to frontend               │
      └────┬─────────────────────┘
           │
      ┌────▼──────────────────────┐
      │ Frontend shows            │
      │ Stripe Payment Form       │
      │ (Elements/Card)           │
      └────┬─────────────────────┘
           │
      ┌────▼──────────────────────┐
      │ User enters card details  │
      │ Submits form              │
      └────┬─────────────────────┘
           │
      ┌────▼──────────────────────┐
      │ Stripe processes payment  │
      │ Sends webhook event       │
      └────┬─────────────────────┘
           │
      ┌────▼──────────────────────┐
      │POST /api/webhooks/stripe  │
      │ (with webhook signature)  │
      └────┬─────────────────────┘
           │
      ┌────▼──────────────────────┐
      │ Verify signature          │
      │ Process event             │
      │ Update payment status     │
      │ Update booking status     │
      └────┬─────────────────────┘
           │
      ┌────▼──────────────────────┐
      │ ✓ Payment Complete        │
      │ ✓ Booking Confirmed       │
      └────────────────────────────┘
```

## Component Hierarchy

```
App Structure
│
├── Authentication Layer (NextAuth + Prisma)
│   ├── Email/Password (bcryptjs hashing)
│   ├── Google OAuth (via @auth/prisma-adapter)
│   └── JWT Sessions (30-day expiration)
│
├── Business Logic Layer (API Routes)
│   ├── Auth Routes
│   │   └── POST /api/auth/register
│   │
│   ├── Booking Routes
│   │   ├── POST /api/bookings (create)
│   │   └── GET /api/bookings (list)
│   │
│   ├── Quote Routes
│   │   ├── POST /api/quotes (create)
│   │   └── GET /api/quotes (list)
│   │
│   └── Payment Routes
│       ├── POST /api/payments/create
│       └── POST /api/webhooks/stripe
│
├── Data Layer (Prisma ORM)
│   ├── Models (12 total)
│   │   ├── User (authentication)
│   │   ├── Booking (business logic)
│   │   ├── Payment (payments)
│   │   └── ... (others)
│   │
│   ├── Validators (Zod)
│   │   ├── Input validation
│   │   └── Type safety
│   │
│   └── Database (PostgreSQL)
│       └── Persistent storage
│
└── External Services
    ├── Stripe API (payments)
    ├── Google OAuth (authentication)
    └── PostgreSQL Database (data)
```

## Deployment Architecture (Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│                    Development Environment                   │
│                                                              │
│  Local PostgreSQL  ←→  npm run dev  ←→  localhost:3000     │
│  (Database)            (Next.js App)      (Browser)       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    (Deploy to Vercel)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                    │
│                                                              │
│  Vercel PostgreSQL ←→ Vercel Deployment ←→ User Browser   │
│  (Cloud DB)           (Serverless Functions)               │
│                                                              │
│  + Stripe (Cloud)                                          │
│  + Google OAuth (Cloud)                                    │
│  + Edge caching (CDN)                                      │
│  + Automatic HTTPS                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## API Layer Details

```
Request → NextAuth Middleware → Route Handler → Database Query

┌────────────────────────────────────────────┐
│         Request → Route Handler             │
├────────────────────────────────────────────┤
│ 1. Receive request (POST, GET, etc)        │
│ 2. Get session (if protected endpoint)     │
│ 3. Validate input (Zod schema)             │
│ 4. Query database (Prisma)                 │
│ 5. Handle errors                           │
│ 6. Return response (JSON)                  │
└────────────────────────────────────────────┘

Example: POST /api/bookings
├── getServerSession() → Verify user logged in
├── body = await request.json() → Get payload
├── validate with CreateBookingSchema → Check types
├── prisma.booking.create() → Store in DB
├── Include relations → Get related data
└── NextResponse.json() → Return to client
```

## Security Layers

```
Request
  │
  ├→ HTTPS/TLS (automatic on Vercel)
  │
  ├→ NextAuth Middleware
  │   └─ Verify JWT token
  │   └─ Check session expiry
  │
  ├→ Route Handler
  │   └─ Check user authentication
  │   └─ Verify user ownership
  │
  ├→ Input Validation (Zod)
  │   └─ Type checking
  │   └─ Range validation
  │   └─ Format validation
  │
  ├→ Database (Prisma)
  │   └─ Prepared statements (SQL injection prevention)
  │   └─ Access control via queries
  │
  └─ External Services
      ├─ Stripe signature verification (webhooks)
      └─ Google OAuth verification (tokens)
```

## Data Flow Example: Creating a Booking

```
User Browser
    │
    ├─ POST /api/bookings
    │  {packageId, departureDate, passengers}
    │
    ▼
Next.js API Route
    │
    ├─ getServerSession() 
    │  → {user: {email, id}}
    │
    ├─ await request.json()
    │  → {packageId, departureDate, passengers}
    │
    ├─ CreateBookingSchema.parse()
    │  → Validate data, throw if invalid
    │
    ├─ prisma.user.findUnique()
    │  → Get full user from DB by email
    │
    ├─ prisma.package.findUnique()
    │  → Verify package exists
    │
    ├─ prisma.booking.create()
    │  → Insert booking into DB
    │     {
    │       userId: user.id,
    │       packageId,
    │       departureDate,
    │       passengers,
    │       status: 'pending'
    │     }
    │
    ▼
Response (201 Created)
    {
      "message": "Booking created successfully",
      "booking": {
        "id": "clx1234...",
        "userId": "user123",
        "packageId": "pkg456",
        "status": "pending",
        "createdAt": "2026-01-10T12:00:00Z"
      }
    }
    │
    ▼
User Browser
    ├─ Display confirmation message
    ├─ Show booking details
    └─ Offer payment option
```

## Performance Characteristics

```
Operation              Typical Time    Cached?
─────────────────────────────────────────────
User Registration      100-200ms       No
User Login            50-100ms        No (JWT verified server-side)
Create Booking        100-150ms       No
Get User Bookings     50-100ms        Yes (5 min)
Create Payment        200-500ms       No (Stripe API call)
Process Webhook       50-100ms        No

Database Query Times (Indexed):
  - User by email:    ~5ms
  - Booking by ID:    ~5ms
  - User's bookings:  ~10ms

API Response Times (Network + DB):
  - Simple queries:   50-100ms
  - Complex queries:  100-200ms
  - External APIs:    200-500ms+
```

---

This architecture provides:
✅ Scalability (Vercel + Cloud DB)
✅ Security (Multiple layers)
✅ Performance (Indexed queries)
✅ Type Safety (TypeScript + Zod + Prisma)
✅ Maintainability (Clean separation of concerns)
