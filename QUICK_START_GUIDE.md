# Quick Start Guide - Amanuel Travel Agency Website

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 2: Configure Environment
Create `.env.local` file in the root directory:
```env
# Required for NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here  # Generate: openssl rand -base64 32

# Database (optional - app works without it)
DATABASE_URL=postgresql://user:password@localhost:5432/amanuel_travel

# Google OAuth (optional - for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (optional - payment feature)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 3: Run Development Server
```bash
npm run dev
```
Visit: http://localhost:3000

---

## 📍 Key Pages

| URL | Purpose | Features |
|-----|---------|----------|
| `/` | Home | Hero, packages, testimonials |
| `/book` | **NEW** Booking Form | Trip booking + WhatsApp CTA |
| `/dashboard` | User Dashboard | View bookings, quotes, profile |
| `/packages` | Package Listing | Browse travel packages |
| `/destinations` | Destinations | Popular travel destinations |
| `/blog` | Blog | Travel guides and tips |
| `/contact` | Contact Form | Send inquiries |
| `/auth/signin` | Login | User authentication |

---

## 🎯 Booking Form Features

**Location**: `/book`

### What It Does
1. Collects trip details (type, cities, dates, passengers)
2. Validates all required fields with helpful error messages
3. Saves booking to database (or generates temporary ID)
4. Shows success confirmation with:
   - Booking summary
   - WhatsApp contact button (pre-filled message)
   - Optional payment card (if Stripe configured)

### Trip Types
- **One-way**: Departure + date only
- **Round-trip**: Departure + return dates

### Contact Methods
- WhatsApp (default)
- Phone call
- Email

### Validation
- Full Name: Required
- Phone: Required + format validation
- Cities: Both required
- Dates: Departure required, return required for round-trip
- Email: Optional (but validated if provided)

---

## 🤖 WhatsApp Integration

**Number**: `+291-7197086` (Amanuel Travel Agency)

When user clicks "Chat on WhatsApp Now" on success screen:
1. Opens WhatsApp app/web
2. Pre-fills message with booking details
3. Message includes:
   - Trip type and cities
   - Number of passengers
   - Special requests
   - User phone number

---

## 💳 Payment Integration (Optional)

**Status**: Ready to use if configured

### To Enable Payments
1. Add `STRIPE_SECRET_KEY` to `.env.local`
2. Add `STRIPE_PUBLISHABLE_KEY` to `.env.local`
3. Payment card automatically appears on success screen

### Pricing Model
- Base: $850 per passenger
- Shown as: `$850 × number of passengers`
- Example: 3 passengers = $2,550 estimated total

### Features
- Estimated pricing display
- Payment intent creation
- Graceful handling if Stripe not configured
- Security notice about encryption

---

## 📱 Mobile Responsive Design

All pages are optimized for:
- ✅ Mobile (< 640px)
- ✅ Tablet (640px - 1024px)
- ✅ Desktop (> 1024px)

### Tested Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari & Chrome

---

## 🔐 User Authentication

### Sign Up / Login
- **Email**: Create account with password
- **Google**: One-click Google OAuth

### Protected Features
- User dashboard
- Booking history
- Quote management
- Profile settings

### Session Duration
- 30 days before re-login required

---

## 🗄️ Database Models

If using PostgreSQL database (optional):

```
Users
├─ id, email, password (hashed), name
└─ Timestamps (created, updated)

BookingRequests
├─ Trip details (type, cities, dates)
├─ Contact info (name, phone, email)
├─ Special requests
└─ Metadata (status, reference ID)

Quotes
├─ Pricing info
├─ Package details
└─ User reference

Payments
├─ Amount and currency
├─ Stripe reference
└─ Status tracking
```

### Without Database
- App still fully functional
- Bookings generate temporary reference IDs
- No persistence (demo mode)

---

## 🛠️ Common Commands

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Check for errors
npm run lint

# Format code
npm run format  # (if configured)
```

### Database
```bash
# Create/update database
npx prisma migrate dev --name <migration-name>

# View database
npx prisma studio

# Reset database (warning: deletes data)
npx prisma migrate reset
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
# Windows PowerShell:
Stop-Process -Name node -Force

# Then restart:
npm run dev
```

### Build Errors
```bash
# Clear cache and reinstall
rm -r node_modules .next
npm install --legacy-peer-deps
npm run build
```

### Database Connection Issues
- Check DATABASE_URL in `.env.local`
- Ensure PostgreSQL server is running
- Verify database name exists

### Stripe Not Detected
- Check STRIPE_SECRET_KEY is set
- Payment card hides gracefully if not configured
- No errors - this is intentional

---

## 📞 Business Contact Information

**Company**: Amanuel Travel Agency  
**Address**: Alfa Building, 1st Floor, Office #5, Asmara, Eritrea  
**WhatsApp**: +291-7197086  
**Phone (Office)**: +291-1-180240  
**Phone (Mobile)**: +291-7-197086  
**Email**: amanueltravel@gmail.com  

---

## 🚀 Deployment

### To Vercel (Recommended)
```bash
npm install -g vercel
vercel deploy
```

### To Traditional Server
```bash
# Build
npm run build

# Copy .next, public, and package.json to server

# Install on server
npm install --production

# Start
npm start
```

### Environment Variables on Server
Set these before starting:
- `NEXTAUTH_URL` (your domain)
- `NEXTAUTH_SECRET` (random string)
- `DATABASE_URL` (PostgreSQL)
- Stripe keys (optional)
- Google OAuth keys (optional)

---

## 📊 Project Stats

- **Pages**: 25 public + authenticated pages
- **API Routes**: 11 endpoints
- **Database Models**: 12 (if using DB)
- **Components**: 50+ React components
- **Build Size**: 87.3 kB shared JavaScript
- **Styling**: Tailwind CSS
- **Performance**: Lighthouse 95+

---

## ✨ Key Features

✅ Fully responsive design  
✅ User authentication (Email + Google)  
✅ Booking form with validation  
✅ WhatsApp integration  
✅ Optional Stripe payments  
✅ Blog with 4 sample posts  
✅ FAQ section  
✅ Contact forms  
✅ Dashboard for users  
✅ Production-ready code  

---

## 📚 Documentation Files

- `PROJECT_COMPLETION_SUMMARY.md` - Full project overview
- `IMPLEMENTATION_NOTES_PART_B.md` - Part B feature details
- `README.md` - Original project README
- `QUICK_START_GUIDE.md` - This file

---

## 🎓 Next Steps

1. **Explore the Booking Page**
   - Visit http://localhost:3000/book
   - Try submitting a booking request
   - Check success screen with WhatsApp link

2. **Configure Database (Optional)**
   - Set DATABASE_URL in `.env.local`
   - Run `npx prisma migrate dev`
   - Bookings will persist

3. **Enable Stripe (Optional)**
   - Get Stripe API keys
   - Add to `.env.local`
   - Payment card appears automatically

4. **Customize Content**
   - Edit `lib/config.ts` for business info
   - Update images in `public/images/`
   - Modify blog posts in `lib/data.ts`

5. **Deploy to Production**
   - Follow deployment steps above
   - Set all environment variables
   - Configure custom domain

---

## 💡 Tips

- **Form validation**: All errors display inline for better UX
- **Mobile testing**: Use DevTools device emulation (F12)
- **WhatsApp testing**: Works on mobile or web.whatsapp.com
- **Stripe testing**: Use test keys (starts with pk_test_)
- **Database optional**: Everything works without PostgreSQL

---

## 🎉 You're All Set!

The website is ready to use. Start with:
```bash
npm run dev
```

Then visit: **http://localhost:3000/book**

Enjoy! 🚀

