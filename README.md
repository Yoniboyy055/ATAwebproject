# Amanuel Travel Agency Platform

**Modern travel booking platform built with Next.js 14, TypeScript, Tailwind CSS, and Prisma ORM.**

> Phase 6 Complete: Admin Dashboard, User Features, Analytics, and Full Backend Integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API keys and database URL

# 3. Setup database
npx prisma migrate dev
npx prisma db push

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Key Features

### For Users
- ✅ **Package Browsing** - Search & filter travel packages
- ✅ **Booking System** - Multi-step booking with validation
- ✅ **User Dashboard** - Booking history, profile management
- ✅ **Wishlist** - Save & share favorite packages
- ✅ **Reviews** - Rate packages and read traveler reviews
- ✅ **Flights Search** - Quick airline search integration
- ✅ **Mobile Optimized** - Responsive design, 48px touch targets

### For Business
- ✅ **Admin Dashboard** - Complete management interface
- ✅ **Booking Management** - Filter, track, and manage bookings
- ✅ **Payment Tracking** - Revenue analytics with refund capability
- ✅ **Package CRUD** - Create/edit/delete travel packages
- ✅ **Blog Management** - Publish articles and content
- ✅ **User Management** - Search users, track activity
- ✅ **Analytics** - GTM/GA integration, conversion tracking, A/B tests
- ✅ **Email Automation** - Confirmation, reminders, follow-ups

### Integration & Communication
- ✅ **Payment Processing** - Stripe integration with webhooks
- ✅ **Email** - Resend for transactional emails & newsletters
- ✅ **SMS** - Twilio for SMS notifications
- ✅ **WhatsApp** - Direct messaging integration
- ✅ **Google Analytics** - Complete event tracking
- ✅ **PDF Receipts** - Auto-generated booking receipts

## 📁 Project Structure

```
app/
├── admin/              # Admin dashboard & management
├── api/                # API endpoints & webhooks
├── auth/               # Authentication pages
├── dashboard/          # User dashboard
├── blog/               # Blog pages
├── [other pages]/      # Public pages
components/
├── admin/              # Admin-specific components
├── home/               # Home page sections
lib/
├── auth.ts             # NextAuth configuration
├── admin.ts            # Admin role utilities
├── analytics.ts        # Event tracking
├── ab-testing.ts       # A/B testing framework
├── email.ts            # Email templates
├── pdf.ts              # PDF generation
prisma/
├── schema.prisma       # Database schema (12 models)
```

## 🔧 Configuration

### Environment Variables

**Database:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/amanuel_travel
```

**Authentication:**
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

**Payments & APIs:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

**Communication:**
```
RESEND_API_KEY=re_xxxxx
TWILIO_ACCOUNT_SID=AC_xxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Analytics:**
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
```

See `.env.example` for complete list.

## 📦 Build & Deployment

### Local Build
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
```bash
vercel deploy
```

## 🧪 Quality Assurance

```bash
# Build verification
npm run build

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## 📊 Database

**12 Prisma Models:**
- User, Session, VerificationToken (Auth)
- Package, Destination (Travel)
- Booking, Quote (Reservations)
- Review, Review_Like (Community)
- Payment, Webhook_Event (Transactions)
- Newsletter_Subscriber (Marketing)

## 🔐 Security

- NextAuth.js authentication
- Role-based access control
- Protected API routes
- Environment variables for secrets
- HTTPS for production

## 📈 Analytics & Tracking

- Event tracking (clicks, forms, bookings)
- Google Analytics & GTM integration
- A/B testing framework
- Conversion tracking
- Payment analytics

## 📚 Documentation

- **[START_HERE.md](START_HERE.md)** - Getting started guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[API_REFERENCE.md](API_REFERENCE.md)** - API documentation
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Database setup
- **[PHASE_6_COMPLETION.md](PHASE_6_COMPLETION.md)** - Latest features

## 🎯 Development Status

| Component | Status |
|-----------|--------|
| Backend & API | ✅ Complete |
| Frontend UI | ✅ Complete |
| Admin Dashboard | ✅ Complete |
| Analytics | ✅ Complete |
| Payments | ✅ Complete |
| Email System | ✅ Complete |

---

**Version:** 2.0.0 | **Status:** Production Ready ✅  
**Last Updated:** January 11, 2026
// generate-sizes.js
const sharp = require('sharp')
const sizes = [400, 800]
const src = 'public/images/source/asmara.jpg'
sizes.forEach(s => {
  sharp(src).resize(s).toFile(`public/images/asmara-${s}.webp`)
  sharp(src).resize(s).toFile(`public/images/asmara-${s}.avif`)
})
```

For low-bandwidth users, generate 400px (grid) and 800px (large) variants and use `next/image` with `sizes` so the browser requests the smallest needed asset.

- Add a blurred tiny placeholder (or use `sharp` to generate a very small base64 blurDataURL) and pass it to `Image`'s `blurDataURL` prop. You can use the included script `npm run images:optimize` to generate AVIF/WebP sizes and `public/images/blur.json` (the project will read `blur.json` automatically for `next/image` placeholders where available).
- For a dry run that only prints which images would be produced, run `npm run images:optimize:dry`.
- The project now enforces image variant checks during build and in CI: `check:variants` ensures every image base has `-400` and `-800` AVIF/WEBP variants and will fail the build/CI if they are missing. Run `npm run images:optimize` after adding better raster sources to generate those variants.
- Deploy to Vercel for optimized delivery (AVIF/WebP handled by Next image optimization).

## Deploy to Vercel (quick)

1. Push the repository to GitHub.
2. Sign in to Vercel and "New Project" -> import the GitHub repo.
3. Set Environment Variables in Vercel dashboard (e.g. `WHATSAPP` if you wire it into `lib/config.ts`).
4. Deploy — Vercel will build and serve the App Router automatically.

Note: Vercel provides image optimization and edge caching which helps low-bandwidth users.

## Performance notes

- Uses system fonts for minimal network cost.
- Uses `next/image` everywhere and lazy-loads below-the-fold images.
- Small client-side JS: only small interactions and IntersectionObserver for subtle entry animations.

## File highlights

- `app/` - App Router pages
- `components/` - Reusable minimal components: `Navbar`, `Footer`, `Card`, `Button`, etc.
- `public/images/` - lightweight svg placeholders to be replaced with real media

