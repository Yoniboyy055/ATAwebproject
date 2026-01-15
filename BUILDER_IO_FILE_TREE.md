# Builder.io Integration - Complete File Tree

Generated: January 15, 2026

## New Files Created

```
project-root/
├── .env.example                           (extended with Builder.io vars)
├── BUILDER_IO_SETUP.md                    ⭐ Complete setup guide
├── BUILDER_IO_IMPLEMENTATION_SUMMARY.md   ⭐ Overview & checklist
│
├── lib/
│   ├── config.ts                          (extended with Builder config)
│   ├── builder.schemas.ts                 ⭐ TypeScript types & Zod
│   └── builder.ts                         ⭐ Fetch utilities
│
├── app/
│   ├── [...page]/
│   │   └── page.tsx                       ⭐ Catch-all route
│   ├── packages/
│   │   └── [slug]/
│   │       └── page.tsx                   ⭐ Package detail route
│   └── api/
│       └── revalidate/
│           └── route.ts                   ⭐ Webhook endpoint
│
└── components/
    └── builder/
        ├── BlockErrorBoundary.tsx         ⭐ Error fallback
        ├── ImageHelper.tsx                ⭐ Image helpers
        ├── registry.ts                    ⭐ Block registry
        └── blocks/
            ├── Hero.tsx                   ⭐ Block component
            ├── TrustBar.tsx               ⭐ Block component
            ├── PromoBanner.tsx            ⭐ Block component
            ├── PackagesGrid.tsx           ⭐ Block component (fetches from Builder)
            ├── FeaturedPackagesCarousel.tsx ⭐ Block component
            ├── PackageHighlights.tsx      ⭐ Block component
            ├── ItineraryTimeline.tsx      ⭐ Block component
            ├── Gallery.tsx                ⭐ Block component
            ├── PricingBox.tsx             ⭐ Block component
            ├── ImportantInfo.tsx          ⭐ Block component
            ├── FAQ.tsx                    ⭐ Block component
            └── CTAContact.tsx             ⭐ Block component
```

## File Purposes

### Core Utilities

#### lib/config.ts
- **Purpose:** Centralized configuration
- **Contains:**
  - Builder API settings
  - Data model names
  - ISR revalidation times (5min-1hr)
  - Approved blocks whitelist (12 blocks)
  - Feature flags
- **Lines:** Extended existing file

#### lib/builder.schemas.ts
- **Purpose:** Type safety and validation
- **Contains:**
  - TypeScript interfaces for Builder data
  - Zod schemas for validation
  - Validation functions with error handling
  - Type exports for use throughout app
- **Key Types:**
  - `BuilderPageEntry` - Page from Builder
  - `BuilderPackageEntry` - Package from Builder
  - `SafePackage` - Validated package data
  - `ValidationResult<T>` - Success/error result type

#### lib/builder.ts
- **Purpose:** Fetch and cache data from Builder.io
- **Contains:**
  - `fetchPageByPath(path)` - Get any page by URL
  - `fetchPackages(filters)` - Get packages with filters
  - `fetchPackageBySlug(slug)` - Get single package
  - `fetchPackageSlugs()` - Get all package slugs for static generation
  - Helper functions (image normalization, block filtering)
  - Full Zod validation on all responses
- **Caching:** Uses React `cache()` and ISR revalidation

### Components

#### components/builder/BlockErrorBoundary.tsx
- **Purpose:** Error handling and fallbacks
- **Contains:**
  - `BlockErrorFallback` - Shows when block fails to render
  - Debug info in dev mode (hidden in production)
  - Generic placeholder message for users
- **Usage:** Wraps all block renderings

#### components/builder/ImageHelper.tsx
- **Purpose:** Safe image handling
- **Contains:**
  - `normalizeImageUrl()` - Validates image URLs
  - `BuilderImage` - next/image wrapper
  - `getFirstValidImage()` - Get first working image from array
- **Benefits:** Prevents broken images, optimizes with next/image

#### components/builder/registry.ts
- **Purpose:** Block registration and rendering
- **Contains:**
  - `blockComponents` - Maps block names to components
  - `renderBlock()` - Safely render single block
  - `renderBlocks()` - Render array of blocks
  - `isBlockApproved()` - Check if block is allowed
- **Key:** Only approved blocks can be rendered

### Blocks (All in components/builder/blocks/)

Each block:
- Has Zod prop schema
- Validates props on render
- Returns error fallback if invalid
- Uses Tailwind CSS (no inline styles)
- Fully typed with TypeScript

**Block List:**
1. **Hero.tsx** - Full-width hero with image/title/CTA
2. **TrustBar.tsx** - Stats/indicators grid
3. **PromoBanner.tsx** - Promotional message with CTA
4. **PackagesGrid.tsx** ⭐ - Fetches packages from Builder, displays in grid
5. **FeaturedPackagesCarousel.tsx** - Featured packages carousel
6. **PackageHighlights.tsx** - Feature list (grid or list layout)
7. **ItineraryTimeline.tsx** - Day-by-day timeline
8. **Gallery.tsx** - Image gallery with columns
9. **PricingBox.tsx** - Pricing tier card
10. **ImportantInfo.tsx** - Info/warning/success/error box
11. **FAQ.tsx** - Collapsible Q&A section
12. **CTAContact.tsx** - Call-to-action section with split/center layout

### Routes

#### app/[...page]/page.tsx
- **Purpose:** Render ANY page from Builder by URL
- **Type:** Catch-all dynamic route
- **Logic:**
  1. Extract path from URL segments
  2. Fetch page from Builder API
  3. Validate with Zod
  4. Render blocks using registry
  5. Generate dynamic SEO metadata
- **Usage:** `http://localhost:3000/about` → renders Builder page with slug="/about"

#### app/packages/[slug]/page.tsx
- **Purpose:** Premium coded template for packages
- **Type:** Dynamic route for `/packages/[slug]`
- **Features:**
  - Hero image (first image from package)
  - Title, price, currency, tags
  - Excerpt with emphasis styling
  - Builder blocks from `package.body` field
  - Image gallery (all package images)
  - Final CTA section
  - Dynamic SEO metadata
  - Open Graph images
  - `generateStaticParams()` for ISR
- **Rendering:** Uses premium template + Builder blocks inside

#### app/api/revalidate/route.ts
- **Purpose:** Handle Builder webhooks for cache invalidation
- **Triggered:** When content published/unpublished in Builder
- **Actions:**
  - Validates webhook secret (optional)
  - Invalidates cache tags for affected content
  - Returns success/error response
- **Tags:**
  - `builder` - All pages
  - `builder-packages` - Package list
  - `builder-package-{slug}` - Specific package

### Documentation

#### BUILDER_IO_SETUP.md
- Complete setup instructions
- Environment variables guide
- Data model schemas
- Block registration steps
- How each feature works
- Troubleshooting guide
- Testing checklist
- Deployment instructions

#### BUILDER_IO_IMPLEMENTATION_SUMMARY.md
- High-level overview
- File checklist
- Key features list
- Quick start guide
- Architecture diagram
- Configuration reference
- Common issues & solutions

---

## How Components Connect

```
Builder.io (CMS)
    ↓ (API)
lib/builder.ts (fetch + validate)
    ↓ (Zod + TypeScript)
lib/builder.schemas.ts (types)
    ↓
Routes
├── app/[...page]/page.tsx
│   └── renderBlocks() from registry
│       └── components/builder/blocks/*
└── app/packages/[slug]/page.tsx
    ├── Title, Price, Images
    ├── renderBlocks() from registry
    │   └── components/builder/blocks/*
    └── Final CTA section

Block Rendering Flow:
renderBlocks(blocks[])
    └── renderBlock(block)
        ├── Check if approved
        ├── Get component from registry
        └── Wrap with SafeBlockRenderer
            ├── Render component
            └── Or show BlockErrorFallback
```

---

## Key Design Decisions

### 1. Zod Validation Everywhere
- Every API response validated before use
- Runtime type checking (not just TypeScript)
- Clear error messages for debugging

### 2. Whitelist-Only Blocks
- Only 12 approved blocks can render
- Any unknown block shows fallback
- Owner can't add unapproved blocks

### 3. ISR for Performance
- Pages cached and pre-rendered
- Revalidated on schedule (5min-1hr)
- On-demand revalidation via webhooks

### 4. Premium Package Template
- Coded layout (not from Builder blocks)
- Consistent design for package detail
- Builder blocks used for flexible content sections
- Guaranteed performance and structure

### 5. Safe Image Handling
- All images through next/image
- Validates URLs before rendering
- Automatic optimization

### 6. Developer-Friendly Blocks
- Easy copy/paste pattern for new blocks
- Zod validation built-in
- Error boundaries automatic
- Tailwind classes (no style chaos)

---

## Data Flow Example

### Page Render: /about

```
1. User visits /about
2. Next.js matches catch-all route: app/[...page]/page.tsx
3. params.page = ["about"]
4. Construct path = "/about"
5. Call fetchPageByPath("/about")
   ├── Builder API: GET /content/page?url=/about
   ├── Response: { data: { title, blocks, metadata } }
   └── Validate with BuilderPageEntrySchema (Zod)
6. renderBlocks(page.data.blocks)
   ├── For each block: renderBlock(block)
   ├── Check if approved
   ├── Get component from registry
   ├── Validate props with Zod
   └── Render with error fallback
7. Generate metadata
   ├── title from page.data.metadata.title
   ├── description from page.data.metadata.description
8. Return HTML
```

### Package Render: /packages/egypt-adventure

```
1. User visits /packages/egypt-adventure
2. Next.js matches route: app/packages/[slug]/page.tsx
3. params.slug = "egypt-adventure"
4. Call fetchPackageBySlug("egypt-adventure")
   ├── Builder API: GET /content?model=package&query.data.slug=egypt-adventure
   ├── Response: { results: [{ data: { title, price, images, body } }] }
   └── Validate with BuilderPackageEntrySchema (Zod)
5. Render premium template:
   ├── Hero image (first from images[])
   ├── Title, Price, Tags
   ├── Excerpt
   ├── renderBlocks(package.data.body) for content sections
   ├── Image gallery
   ├── Final CTA
6. Generate metadata
   ├── title + description from package
   ├── og:image from first package image
   ├── keywords from tags
7. Return HTML
```

---

## Environment Variables

```dotenv
# Required for Builder.io integration
NEXT_PUBLIC_BUILDER_API_KEY=your_public_api_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Optional but recommended
BUILDER_WEBHOOK_SECRET=your_webhook_secret_for_validation
```

---

## Testing the Implementation

### 1. Create test page in Builder
- Name: "Test Page"
- URL: `/test`
- Add Hero block with title "Welcome"
- Publish

### 2. Visit in browser
- http://localhost:3000/test
- Should render hero block

### 3. Create test package in Builder
- title: "Test Package"
- slug: "test-package"
- price: 999
- currency: "USD"
- Add image
- Add FAQ block to body
- Publish

### 4. Visit in browser
- http://localhost:3000/packages/test-package
- Should render premium template with FAQ block

---

## Production Checklist

- [ ] All env vars set on hosting platform
- [ ] Builder.io API key is public (safe)
- [ ] Data models created in Builder
- [ ] Blocks registered in Builder UI
- [ ] Webhook configured (optional but recommended)
- [ ] Test page renders
- [ ] Test package renders with blocks
- [ ] SEO metadata appears in HTML
- [ ] Images load correctly
- [ ] Mobile responsive
- [ ] Dark mode tested (if applicable)
- [ ] Error fallbacks work
- [ ] Cache invalidation works

---

## Summary

This implementation provides a complete, production-ready Builder.io integration that:

✅ Allows non-technical owner to edit pages and packages visually
✅ Keeps code type-safe with TypeScript + Zod
✅ Maintains high performance with ISR caching
✅ Ensures security with whitelist-only blocks
✅ Provides excellent SEO with dynamic metadata
✅ Has clear error handling and debugging tools
✅ Is easy to extend with new blocks
✅ Follows Next.js 14 best practices

The owner can now manage all content through Builder.io while you maintain a clean, safe, and performant Next.js application. 🎉
