# Quick Reference: API Endpoints

## Authentication

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe",
  "phone": "+1234567890" (optional)
}

Response: 201 Created
{
  "message": "User registered successfully",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

### Sign In (NextAuth)
Use NextAuth's built-in login at `/auth/signin`

## Bookings

### Create Booking
```
POST /api/bookings
Authorization: Bearer session-token
Content-Type: application/json

{
  "packageId": "package-id",
  "departureDate": "2026-02-15T00:00:00Z",
  "returnDate": "2026-02-25T00:00:00Z",
  "passengers": 2,
  "destination": "Asmara",
  "phoneNumber": "+1234567890",
  "notes": "Family trip"
}

Response: 201 Created
{
  "message": "Booking created successfully",
  "booking": {
    "id": "booking-id",
    "userId": "user-id",
    "packageId": "package-id",
    "status": "pending",
    "departureDate": "2026-02-15T00:00:00Z",
    "passengers": 2,
    "createdAt": "2026-01-10T00:00:00Z"
  }
}
```

### Get User's Bookings
```
GET /api/bookings
Authorization: Bearer session-token

Response: 200 OK
{
  "bookings": [
    {
      "id": "booking-id",
      "status": "pending",
      "destinatio": "Asmara",
      "payment": {
        "status": "pending",
        "amount": 599.99
      }
    }
  ]
}
```

## Payments

### Create Payment Intent
```
POST /api/payments/create
Authorization: Bearer session-token
Content-Type: application/json

{
  "bookingId": "booking-id",
  "amount": 599.99,
  "currency": "USD"
}

Response: 200 OK
{
  "clientSecret": "pi_xxx_secret_yyy",
  "paymentId": "payment-id",
  "amount": 599.99,
  "currency": "USD"
}
```

**Next Step**: Use `clientSecret` with Stripe.js to show payment form

## Quotes

### Create Quote Request
```
POST /api/quotes
Authorization: Bearer session-token
Content-Type: application/json

{
  "type": "flight",
  "description": "Looking for affordable flights from NYC to Asmara",
  "requirements": "Departure March 1st, return March 10th",
  "phoneNumber": "+1234567890",
  "packageId": "package-id" (optional)
}

Response: 201 Created
{
  "message": "Quote request created successfully",
  "quote": {
    "id": "quote-id",
    "status": "pending",
    "type": "flight"
  }
}
```

### Get User's Quotes
```
GET /api/quotes
Authorization: Bearer session-token

Response: 200 OK
{
  "quotes": [
    {
      "id": "quote-id",
      "type": "flight",
      "status": "pending",
      "quote": null
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "minimum": 8,
      "type": "string",
      "path": ["password"]
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Booking not found"
}
```

### 500 Server Error
```json
{
  "error": "Failed to create booking"
}
```

## Frontend Integration Examples

### React Hook for Booking
```typescript
async function createBooking(bookingData) {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }
  
  return response.json()
}
```

### React Hook for Payment
```typescript
import { loadStripe } from '@stripe/stripe-js'

async function handlePayment(bookingId, amount) {
  const stripe = await loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  )
  
  // Create payment intent
  const paymentRes = await fetch('/api/payments/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId, amount })
  })
  
  const { clientSecret } = await paymentRes.json()
  
  // Show Stripe elements form with clientSecret
  // Handle payment confirmation
}
```

## Database Query Examples

```typescript
import { prisma } from '@/lib/prisma'

// Get user with all bookings
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: { bookings: true, payments: true }
})

// Get pending bookings
const pendingBookings = await prisma.booking.findMany({
  where: { status: 'pending' },
  include: { user: true, package: true }
})

// Update booking status
await prisma.booking.update({
  where: { id: bookingId },
  data: { status: 'confirmed' }
})

// Get payment status
const payment = await prisma.payment.findUnique({
  where: { bookingId },
  include: { booking: true }
})
```

## Testing With cURL

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","name":"Test User"}'

# Create booking (need to login first to get token)
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"packageId":"pkg-id","departureDate":"2026-02-15T00:00:00Z","passengers":1}'
```

## Database Management

```bash
# View database GUI
npm run db:studio

# Open Prisma Studio in browser
npx prisma studio

# Reset database (careful!)
npm run db:reset

# See schema
cat prisma/schema.prisma
```

## Common Status Values

### Booking Status
- `pending` - Created, awaiting payment/confirmation
- `confirmed` - Payment received or confirmed by admin
- `completed` - Trip finished
- `cancelled` - Cancelled by user or admin

### Payment Status
- `pending` - Payment not yet started
- `processing` - Payment in progress
- `completed` - Payment successful
- `failed` - Payment failed

### Quote Status
- `pending` - Awaiting admin response
- `responded` - Admin sent quote
- `accepted` - Customer accepted quote
- `rejected` - Quote rejected

---

**Pro Tip**: Use Prisma Studio to view and edit data in real-time
```bash
npx prisma studio
```
