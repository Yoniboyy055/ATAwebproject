# Builder.io Verification Quick Start Guide

**⏱️ Time Required:** 30 minutes  
**🎯 Goal:** Prove Builder.io integration is live and working

---

## 🚀 STEP 1: Find Your Deployment URL (2 minutes)

### Option A: Check Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Find project: `ATAwebproject` or `at-awebproject`
3. Click on the project
4. Look for "Domains" section
5. Copy the production URL (e.g., `https://xyz.vercel.app`)

### Option B: Check GitHub Repository Settings
1. Go to: https://github.com/Yoniboyy055/ATAwebproject
2. Click "Settings" → "Pages" (if enabled)
3. Or check "Deployments" section

### Option C: Check CI/CD Workflow
```bash
cat .github/workflows/ci-cd.yml | grep "url:"
```

---

## 🏥 STEP 2: Test Health Endpoint (5 minutes)

### Run This Command:
```bash
curl -s https://YOUR-DEPLOYMENT-URL/api/health/builder | jq '.'
```

### Example:
```bash
curl -s https://at-awebproject-2lqg.vercel.app/api/health/builder | jq '.'
```

### Interpret Results:

#### ✅ SUCCESS Response (Status 200):
```json
{
  "ok": true,
  "hasKey": true,
  "hasSiteUrl": true,
  "env": "production",
  "timestamp": "2026-01-23T22:00:00.000Z"
}
```
**Meaning:** Builder.io is properly configured! ✅  
**Next:** Skip to Step 4 (Create Test Page)

---

#### ❌ FAILURE Response (Status 503):
```json
{
  "ok": false,
  "hasKey": false,
  "hasSiteUrl": true,
  "env": "production",
  "timestamp": "2026-01-23T22:00:00.000Z"
}
```
**Meaning:** Missing `NEXT_PUBLIC_BUILDER_API_KEY`  
**Next:** Go to Step 3

---

#### ❌ FAILURE Response (Status 503):
```json
{
  "ok": false,
  "hasKey": true,
  "hasSiteUrl": false,
  "env": "production",
  "timestamp": "2026-01-23T22:00:00.000Z"
}
```
**Meaning:** Missing `NEXT_PUBLIC_SITE_URL`  
**Next:** Go to Step 3

---

## 🔧 STEP 3: Fix Missing Environment Variables (10 minutes)

### 3.1 Get Your Builder.io API Key

1. **Login to Builder.io:**
   - URL: https://builder.io/login
   - Use your organization credentials

2. **Get API Key:**
   - Click your profile (top right)
   - Click "Account Settings"
   - Or go directly to: https://builder.io/account/organization
   - Look for "Public API Key"
   - Copy the key (starts with `bpk-`)

### 3.2 Add Variables to Vercel

1. **Go to Vercel Dashboard:**
   - URL: https://vercel.com/dashboard
   - Select your project

2. **Navigate to Environment Variables:**
   ```
   Settings → Environment Variables → Add New
   ```

3. **Add NEXT_PUBLIC_BUILDER_API_KEY:**
   - Name: `NEXT_PUBLIC_BUILDER_API_KEY`
   - Value: `bpk-xxxxxxxxxxxxxxxxxxxxx` (paste your key)
   - Environment: Select "Production", "Preview", and "Development"
   - Click "Save"

4. **Add NEXT_PUBLIC_SITE_URL:**
   - Name: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://amanueltravel.com` (or your actual domain)
   - Environment: Select "Production"
   - Click "Save"

5. **For Preview/Development:**
   - Add another `NEXT_PUBLIC_SITE_URL` variable
   - Value: Your Vercel preview URL
   - Environment: Select "Preview" and "Development"
   - Click "Save"

### 3.3 Redeploy

**Option A: Auto Redeploy (Recommended)**
```bash
git commit --allow-empty -m "Trigger redeploy for env vars"
git push origin main
```

**Option B: Manual Redeploy**
1. Go to Vercel Dashboard → Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete (~2-3 minutes)

### 3.4 Re-test Health Endpoint

Wait 3 minutes for deployment, then run:
```bash
curl -s https://YOUR-DEPLOYMENT-URL/api/health/builder | jq '.'
```

Should now show:
```json
{
  "ok": true,
  "hasKey": true,
  "hasSiteUrl": true,
  ...
}
```

---

## 🏗️ STEP 4: Verify Builder.io Models (5 minutes)

### 4.1 Check Models Exist

1. **Login to Builder.io:**
   - URL: https://builder.io/login

2. **Navigate to Models:**
   - Click "Data" (left sidebar)
   - Click "Models"

3. **Verify These Models Exist:**

   ✅ **Model: `page`**
   - Type: Data Model
   - Used for: Generic pages (catch-all route)

   ✅ **Model: `package`**
   - Type: Data Model
   - Used for: Travel packages

### 4.2 If Models Don't Exist, Create Them

#### Create "page" Model:
1. Click "New Model"
2. Name: `page`
3. Type: Data Model
4. Add fields:
   - `url` (Text) - Required
   - `title` (Text) - Required
   - `blocks` (Blocks) - Rich content
   - `metadata` (Object) - SEO data
5. Click "Create Model"

#### Create "package" Model:
1. Click "New Model"
2. Name: `package`
3. Type: Data Model
4. Add fields:
   - `slug` (Text) - Required
   - `title` (Text) - Required
   - `price` (Number) - Required
   - `currency` (Text) - Required
   - `excerpt` (Text) - Required
   - `images` (List) - Required
   - `body` (Blocks) - Rich content
   - `tags` (List of Text)
   - `featured` (Boolean)
5. Click "Create Model"

---

## 🧪 STEP 5: Create Test Page (10 minutes)

### 5.1 Create the Page

1. **Navigate to Content:**
   - Builder.io Dashboard
   - Click "Content" (left sidebar)
   - Click "Page" (model)

2. **Create New Entry:**
   - Click "+ New Entry" or "+ New Page"

3. **Set Basic Info:**
   - URL: `/test`
   - Title: `Builder Test`

4. **Add Content:**
   - Drag a "Hero" block (or "Text" block)
   - Add text: "Builder.io integration verified ✅"
   - Optional: Add styling, images

5. **Publish:**
   - Click "Publish" button (top right)
   - Confirm publication
   - Wait 5-30 seconds for cache

### 5.2 Verify Live Rendering

1. **Visit Test Page:**
   ```
   https://YOUR-DEPLOYMENT-URL/test
   ```

2. **Expected Result:**
   - Page loads successfully
   - Shows "Builder Test" in browser title
   - Shows your content ("Builder.io integration verified")

3. **Capture Proof:**
   - Take screenshot of the page
   - Or copy HTML snippet:
     ```bash
     curl -s https://YOUR-DEPLOYMENT-URL/test | grep -i "Builder Test"
     ```

---

## 📦 PROOF PACK (Required Evidence)

### A) Health Endpoint Response
```bash
curl -s https://YOUR-DEPLOYMENT-URL/api/health/builder | jq '.' > health-response.json
```
**Save this JSON file as evidence.**

### B) File Paths
Already verified in codebase:
- ✅ `app/[...page]/page.tsx` - Catch-all route
- ✅ `app/packages/[slug]/page.tsx` - Package detail
- ✅ `lib/builder.ts` - Builder API utilities
- ✅ `lib/env.ts` - Environment validation
- ✅ `app/api/health/builder/route.ts` - Health endpoint

### C) Test Page Evidence
1. **Screenshot:** Browser showing `/test` page
2. **URL:** `https://YOUR-DEPLOYMENT-URL/test`
3. **HTML Snippet:**
   ```bash
   curl -s https://YOUR-DEPLOYMENT-URL/test | head -50
   ```
   Look for: `<title>Builder Test</title>`

### D) Builder.io Dashboard Evidence
**Screenshot showing:**
- Models list (page + package)
- Test page entry in Content section
- Preview URL setting

---

## 🎯 Final Checklist

- [ ] Found deployment URL
- [ ] Health endpoint returns `ok: true`
- [ ] Builder.io API key is set in Vercel
- [ ] Site URL is set in Vercel
- [ ] Models exist in Builder.io (page + package)
- [ ] Preview URL is set in Builder.io
- [ ] Test page created at `/test`
- [ ] Test page renders live
- [ ] Captured all proof (JSON, screenshots, URLs)

---

## 🆘 Troubleshooting

### Issue: "Could not resolve host"
- **Cause:** URL is incorrect or deployment doesn't exist
- **Fix:** Double-check URL in Vercel Dashboard

### Issue: Health endpoint returns 503
- **Cause:** Missing environment variables
- **Fix:** Follow Step 3 to add variables

### Issue: Test page shows "Page Not Found"
- **Cause:** Page not published or cache not cleared
- **Fix:** 
  1. Re-publish in Builder.io
  2. Wait 5 minutes
  3. Try again
  4. Or clear cache: `https://YOUR-DEPLOYMENT-URL/api/revalidate?tag=builder&secret=YOUR_SECRET`

### Issue: Blocks not rendering
- **Cause:** Block type not in approved list
- **Fix:** Use only these blocks:
  - Hero, TrustBar, PromoBanner, PackagesGrid
  - FeaturedPackagesCarousel, PackageHighlights
  - ItineraryTimeline, Gallery, PricingBox
  - ImportantInfo, FAQ, CTAContact

### Issue: Images not loading
- **Cause:** Image URL doesn't start with http/https
- **Fix:** In Builder.io, use full URLs for images

---

## 📚 Additional Resources

- Full Report: `BUILDER_IO_FORENSIC_VERIFICATION.md`
- Builder.io Setup: `BUILDER_IO_SETUP.md`
- Quick Reference: `BUILDER_IO_QUICK_REFERENCE.md`
- API Reference: `API_REFERENCE.md`

---

## ✅ Success Criteria

You have successfully verified the integration when:

1. ✅ Health endpoint returns:
   ```json
   {"ok": true, "hasKey": true, "hasSiteUrl": true}
   ```

2. ✅ Test page at `/test` renders with your content

3. ✅ Browser title shows "Builder Test"

4. ✅ HTML source contains your test content

**Congratulations! Builder.io integration is verified and working.** 🎉

---

**Questions?**
Review the detailed forensic report: `BUILDER_IO_FORENSIC_VERIFICATION.md`
