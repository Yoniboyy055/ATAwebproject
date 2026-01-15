# Builder.io Integration - Implementation Summary

## ✅ Completed Implementation

A production-grade Builder.io integration for Amanuel Travel has been implemented. The system allows your non-technical owner to visually edit website pages and travel packages in Builder.io while Next.js 14 handles rendering, performance, and SEO.

---

## 📁 Files Created & Modified

### Configuration
- **lib/config.ts** - Extended with Builder config, revalidation times, approved blocks list
- **lib/builder.schemas.ts** - NEW: TypeScript types and Zod validation schemas
- **lib/builder.ts** - NEW: Fetch utilities with validation and caching
- **.env.example** - Extended with Builder.io variables

### Components
- **components/builder/BlockErrorBoundary.tsx** - NEW: Error fallback for failed blocks
- **components/builder/ImageHelper.tsx** - NEW: Safe image rendering with next/image
- **components/builder/registry.ts** - NEW: Block registry and renderer

### Blocks
All created with Zod validation and safe prop handling:
- **components/builder/blocks/Hero.tsx** - Full-width hero section
- **components/builder/blocks/TrustBar.tsx** - Stats display
- **components/builder/blocks/PromoBanner.tsx** - Promotional banner
- **components/builder/blocks/PackagesGrid.tsx** - Package cards grid ⭐
- **components/builder/blocks/FeaturedPackagesCarousel.tsx** - Featured packages
- **components/builder/blocks/PackageHighlights.tsx** - Features list
- **components/builder/blocks/ItineraryTimeline.tsx** - Day-by-day timeline
- **components/builder/blocks/Gallery.tsx** - Image gallery
- **components/builder/blocks/PricingBox.tsx** - Pricing tier
- **components/builder/blocks/ImportantInfo.tsx** - Info/warning boxes
- **components/builder/blocks/FAQ.tsx** - Collapsible Q&A
- **components/builder/blocks/CTAContact.tsx** - Call-to-action

### Routes
- **app/[...page]/page.tsx** - NEW: Catch-all route for any Builder page
- **app/packages/[slug]/page.tsx** - NEW: Premium coded package detail template
- **app/api/revalidate/route.ts** - NEW: Webhook endpoint for ISR

### Documentation
- **BUILDER_IO_SETUP.md** - NEW: Complete setup and usage guide

---

## 🎯 Key Features

### 1. Type Safety & Validation
✅ Full TypeScript support
✅ Zod validation on all Builder API responses
✅ Safe fallbacks for invalid data
✅ Dev-mode debug info, hidden in production

### 2. Performance
✅ ISR (Incremental Static Regeneration) with configurable revalidation times
✅ React `cache()` for deduplication
✅ Optimized image handling with `next/image`
✅ On-demand revalidation via webhooks

### 3. Security
✅ Whitelist-only approved blocks (12 blocks)
✅ Zod prop validation for each block
✅ No raw HTML/CSS injection allowed
✅ Safe image URL normalization
✅ Environment variable protection

### 4. SEO
✅ Dynamic metadata from Builder data
✅ Open Graph images from package images
✅ JSON-LD structured data support
✅ Canonical URLs

### 5. Developer Experience
✅ Clear error messages with fallbacks
✅ Easy block registration
✅ Simple schema extension (copy/paste pattern)
✅ Well-documented code

---

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy template
cp .env.example .env.local

# Add your Builder.io API key
NEXT_PUBLIC_BUILDER_API_KEY=your_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Builder.io Setup
1. Create account at builder.io
2. Get public API key from Account → API Keys
3. Create Data Models:
   - `page` (for website pages)
   - `package` (for travel packages)
4. Register approved blocks in Builder UI

### 3. Test Locally
```bash
npm run dev
# Visit http://localhost:3000/your-page-path
# Visit http://localhost:3000/packages/your-package-slug
```

---

## 📊 Data Model Examples

### Page Model (for /about, /contact, /services, etc.)
```
- title: string
- metadata.title: string
- metadata.description: string
- blocks: Blocks field (approved blocks only)
```

### Package Model (for /packages/[slug])
```
- title: string (required)
- slug: string (required, unique)
- price: number
- currency: string (default: "USD")
- excerpt: rich text
- featured: boolean
- tags: array
- images: array (can have multiple)
- body: Blocks field (content sections)
```

---

## 🔗 Architecture Overview

```
Builder.io (Visual CMS)
    ↓
Builder Content API (fetch validated data)
    ↓
lib/builder.ts (Zod validation + caching)
    ↓
Next.js Routes (App Router)
    ├── app/[...page]/page.tsx (any Builder page)
    ├── app/packages/[slug]/page.tsx (premium template)
    └── app/api/revalidate/route.ts (webhook)
    ↓
components/builder/registry.ts (render blocks safely)
    ↓
Approved Blocks (12 components)
    ↓
HTML + next/image + CSS
```

---

## ⚙️ Configuration

All settings in **lib/config.ts**:

```typescript
// Revalidation times (ISR)
revalidate: {
  pages: 300,           // 5 minutes
  packagesList: 3600,   // 1 hour
  packageDetail: 3600,  // 1 hour
}

// Approved block types
APPROVED_BLOCKS = [
  "Hero",
  "TrustBar",
  "PromoBanner",
  "PackagesGrid",
  "FeaturedPackagesCarousel",
  "PackageHighlights",
  "ItineraryTimeline",
  "Gallery",
  "PricingBox",
  "ImportantInfo",
  "FAQ",
  "CTAContact",
]
```

---

## 🔒 Security Notes

### What's Allowed
✅ Approved blocks only (see list above)
✅ Text, images, toggles
✅ Safe enums (layout options)
✅ Links and CTAs

### What's NOT Allowed
❌ Raw HTML/CSS injection
❌ Custom code blocks
❌ Unvalidated props
❌ Unapproved components

---

## 📖 Adding a New Block

1. Create component in `components/builder/blocks/MyBlock.tsx` with Zod validation
2. Add to `blockComponents` in `components/builder/registry.ts`
3. Add to `APPROVED_BLOCKS` in `lib/config.ts`
4. Register in Builder.io UI

**All blocks must:**
- Use Zod for prop validation
- Return error fallback on validation failure
- Avoid inline styling chaos
- Use Tailwind classes

---

## 🎨 Sample Block Architecture

Every block follows this pattern:

```typescript
// 1. Define prop schema with Zod
const BlockPropsSchema = z.object({
  title: z.string().optional(),
  color: z.enum(["red", "blue"]).optional(),
});

// 2. Validate props
try {
  validProps = BlockPropsSchema.parse(props);
} catch {
  return <div>Validation failed</div>;
}

// 3. Render safely
return <div>{validProps.title}</div>;
```

---

## 🧪 Testing Checklist

- [ ] Builder page renders at `/custom-path`
- [ ] Package detail page renders at `/packages/my-package`
- [ ] Images display correctly (next/image)
- [ ] Block errors show fallback (not white screen)
- [ ] SEO metadata in page HTML
- [ ] Open Graph image works
- [ ] Mobile responsive
- [ ] Dev mode shows debug info
- [ ] Production mode hides debug info
- [ ] Webhook revalidation works

---

## 📝 Next Steps

1. **Create Builder.io account** (free tier available)
2. **Get public API key** and add to `.env.local`
3. **Create Data Models** (page, package)
4. **Register 2-3 blocks** in Builder UI
5. **Create test page/package** and verify rendering
6. **Deploy to Vercel** (recommended for Next.js)
7. **Configure webhooks** for automatic cache invalidation
8. **Train owner** on how to use Builder.io

---

## 🚦 Production Deployment

### Environment Variables
```
NEXT_PUBLIC_BUILDER_API_KEY=your_production_key
NEXT_PUBLIC_SITE_URL=https://amanueltravel.com
BUILDER_WEBHOOK_SECRET=your_secret_for_validation
```

### Vercel Setup
1. Connect GitHub repo
2. Add env vars in Vercel dashboard
3. Deploy
4. Configure Builder webhooks to production URL

### Performance
- ISR pages served instantly
- Updated every 5 minutes - 1 hour (configurable)
- On-demand revalidation via webhook immediately

---

## 🆘 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "API key not set" | Check `.env.local`, restart dev server |
| Page not found | Verify page URL in Builder.io matches route |
| Block validation error | Check props in Builder match Zod schema |
| Images not showing | Verify URL starts with `http://` or `https://` |
| Cache not updating | Check webhook endpoint, inspect revalidate tags |

---

## 📚 Resources

- **Builder.io Docs:** https://www.builder.io/c/docs
- **Next.js ISR:** https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
- **Zod Validation:** https://zod.dev
- **Setup Guide:** See `BUILDER_IO_SETUP.md` in this directory

---

## 🎯 Summary

This implementation provides:

✅ **Non-technical editor**: Owner uses visual Builder.io UI, no coding
✅ **Type-safe**: Full TypeScript + Zod validation
✅ **Fast**: ISR caching, image optimization
✅ **Secure**: Whitelist-only blocks, validated props
✅ **SEO-ready**: Dynamic metadata, OG images
✅ **Developer-friendly**: Clear patterns, easy to extend

Your owner can now manage:
- Website pages (home, about, contact, services)
- Travel packages (pricing, images, itineraries, highlights)
- Content blocks (hero, trust bar, galleries, FAQs, etc.)

All without touching code! 🎉
