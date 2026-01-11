# Quick Setup: Communication Services

Get email, SMS, and PDF receipts working in 5 minutes.

## Step 1: Email Confirmation (Resend)

### 1a. Get Resend API Key
1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Navigate to API Keys section
4. Create new API key, copy it

### 1b. Add to Environment
Edit `.env.local`:
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=noreply@amannualtravel.com
```

### 1c. Test
- Fill out booking form
- Enable "📧 Send confirmation email"
- Submit and check inbox (or spam folder)

**Result**: Beautiful HTML email with booking details ✅

---

## Step 2: SMS Notifications (Twilio)

### 2a. Get Twilio Credentials
1. Go to [twilio.com](https://www.twilio.com)
2. Sign up for free trial ($15 credit)
3. Go to Console → Account SID & Auth Token
4. Get a Twilio phone number (Project → Phone Numbers)

### 2b. Add to Environment
Edit `.env.local`:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### 2c. Test
- Fill out booking form
- Enable "📱 Send SMS confirmation"
- Submit and check phone for SMS

**Result**: Instant SMS with booking reference and total ✅

---

## Step 3: PDF Receipts

### Already Enabled! ✨

No configuration needed. PDFs generate automatically and users can download them.

**Features**:
- Professional formatted receipt
- All booking details
- Pricing breakdown
- Download directly from success screen
- Works offline

---

## Step 4: Database Persistence (Optional)

### 4a. Setup PostgreSQL

Option 1: Local PostgreSQL
```bash
# macOS
brew install postgresql
brew services start postgresql
createdb amannual_travel

# Windows: Download from postgresql.org
# Linux: apt-get install postgresql postgresql-contrib
```

Option 2: Cloud PostgreSQL
- Render: [render.com](https://render.com) - free tier available
- Railway: [railway.app](https://railway.app)
- Supabase: [supabase.com](https://supabase.com)

### 4b. Connect to App
Edit `.env.local`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/amannual_travel
```

### 4c. Initialize Database
```bash
cd c:\Users\yonib\Downloads\Codex_files
npx prisma migrate deploy
```

**Result**: All bookings saved to database ✅

---

## Complete Environment File

After all steps, your `.env.local` should look like:

```bash
# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=noreply@amannualtravel.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/amannual_travel

# Next Auth (existing)
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

---

## Feature Checklist

After setup, verify each feature works:

### Email
- [ ] Resend account created
- [ ] API key added to `.env.local`
- [ ] Test booking with email enabled
- [ ] Email received in inbox

### SMS
- [ ] Twilio account created
- [ ] Twilio phone number assigned
- [ ] Credentials added to `.env.local`
- [ ] Test booking with SMS enabled
- [ ] SMS received on phone

### PDF
- [ ] Test booking submitted
- [ ] Success screen shows "Download Receipt PDF"
- [ ] Click download button
- [ ] PDF opens/saves successfully

### Database
- [ ] PostgreSQL running
- [ ] DATABASE_URL set in `.env.local`
- [ ] Run `npx prisma migrate deploy`
- [ ] Check database for saved bookings

### Copy to Clipboard
- [ ] Booking reference shows in blue box
- [ ] Click "📋 Copy" button
- [ ] Alert confirms "copied to clipboard"

---

## Testing Without Configuration

**Good news!** Everything works even without these services:

- ✅ Bookings still process successfully
- ✅ Users see success confirmation
- ✅ PDF receipts still generate
- ✅ Copy to clipboard still works
- ✅ Demo mode logs to console

This allows you to:
1. Test functionality without paid services
2. Deploy MVP without external dependencies
3. Add services later as you scale

---

## Pricing (Rough Estimates)

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Resend** | 100 emails/day | $20/month+ |
| **Twilio** | $15 credit | Pay-as-you-go (~$0.01/SMS) |
| **Render** | Free tier | $7/month+ |
| **Supabase** | Free tier | $25/month+ |

**Total for MVP**: Free (with credits)  
**Total for production**: ~$50-100/month

---

## Troubleshooting

### Emails not sending
```bash
# Check if key is valid
echo $RESEND_API_KEY

# Restart dev server
npm run dev

# Check browser console for errors
# Check Resend dashboard for bounces
```

### SMS not working
```bash
# Verify Twilio account is funded
# Check phone number format: +1 (country)(area)(number)
# Check Twilio console for delivery errors
# Verify number is in supported country
```

### PDF not downloading
```bash
# Check browser console (F12)
# Try different browser
# Check ad blocker settings
# Enable JavaScript if disabled
```

### Bookings not saving
```bash
# Verify DATABASE_URL is correct
npx prisma db push  # Sync schema

# Check if PostgreSQL is running
psql -U postgres -d amannual_travel

# View all tables
\dt
```

---

## Next Steps

### Start Small
1. Add email confirmation first (easiest)
2. Add SMS when comfortable with services
3. Add database when ready for persistence

### Scale Up
- Create dashboard to view bookings
- Add admin notifications for new bookings
- Set up automated reminders
- Generate invoices
- Analytics and reporting

### Advanced Features
- Two-way SMS (reply to messages)
- WhatsApp Business API
- Slack notifications for staff
- Webhook integration with external systems

---

## Support Resources

- **Resend**: https://resend.com/docs
- **Twilio**: https://www.twilio.com/docs
- **Prisma**: https://www.prisma.io/docs
- **Next.js**: https://nextjs.org/docs

## Get Help

If services aren't working:

1. **Check logs**: `npm run dev` terminal output
2. **Browser console**: F12 → Console tab
3. **Service dashboards**: Check Resend, Twilio, PostgreSQL logs
4. **Environment variables**: Verify `.env.local` file
5. **Restart dev server**: `npm run dev`

---

**Status**: All features deployed and ready to use! 🎉

Start with email, SMS optional, database nice-to-have. All gracefully degrade if not configured.
