# Builder.io Integration Guide

Complete setup and usage guide for Amanuel Travel's Builder.io "Wix-mode" system.

## Overview

- **Owner edits pages + packages visually in Builder.io** (like Wix/Shopify)
- **Next.js 14 renders** the content with a premium, coded template layout
- **NO custom editors** (no Craft.js, react-contenteditable)
- **Packages stored ONLY in Builder** (not Prisma)
- **Only approved blocks** can be rendered (safety-first)

---

## Architecture

### What Builder.io Controls
- ✅ Website pages (Home, About, Contact, Services, Packages listing)
- ✅ Packages as a Data Model (title, slug, price, currency, images, excerpt, body blocks)
- ✅ Blocks field content (drag & drop sections inside packages)

### What Next.js Controls
- ✅ Routing and performance (ISR, caching)
- ✅ Package detail page layout (`/packages/[slug]`)
- ✅ Safe rendering of Builder blocks
- ✅ Image optimization
- ✅ SEO metadata generation

---

## Setup Instructions

### 1. Create Builder.io Account & API Key

1. Go to [builder.io](https://builder.io)
2. Create a free account or log in
3. Create a new organization/project (or use existing)
4. Go to **Account → API Keys** → Copy your **Public API Key**
5. Create a new file: `.env.local` (never commit this!)

### 2. Configure Environment Variables

Copy the template from `.env.example`:

```bash
# .env.local
NEXT_PUBLIC_BUILDER_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BUILDER_WEBHOOK_SECRET=your_webhook_secret_here
```

**Important:**
- `NEXT_PUBLIC_BUILDER_API_KEY` is intentionally public (used in browser)
- Never store secret API keys in public variables
- The webhook secret is optional but recommended for security

### 3. Create Data Models in Builder.io

#### Page Model
1. In Builder.io, go to **Settings → Data Models**
2. Create new model: `page`
3. Add fields:
   - `title` (Text)
   - `metadata.title` (Text)
   - `metadata.description` (Text)
   - `metadata.keywords` (Text)
   - `blocks` (Blocks field) → Enable **approved blocks only**

#### Package Model
1. Create new model: `package`
2. Add fields:
   - `title` (Text) - *required*
   - `slug` (Text) - *required, unique*
   - `price` (Number)
   - `currency` (Text) - default "USD"
   - `excerpt` (Rich Text) - short description
   - `featured` (Boolean) - for featured packages
   - `tags` (Tags field) - e.g., "Luxury", "Family", "Adventure"
   - `images` (Image field, multiple)
   - `description` (Rich Text)
   - `body` (Blocks field) → Only approved blocks

### 4. Register Approved Blocks

In Builder.io Content Editor:
1. Click **Components** → **Register Component**
2. Choose the blocks you want your owner to use:
   - Hero
   - TrustBar
   - PromoBanner
   - PackagesGrid
   - FeaturedPackagesCarousel
   - PackageHighlights
   - ItineraryTimeline
   - Gallery
   - PricingBox
   - ImportantInfo
   - FAQ
   - CTAContact

**Do NOT allow:**
- Custom HTML/CSS
- Raw embed blocks
- Custom code blocks
- Any unapproved components

---

## File Structure

```
lib/
├── config.ts                    # Configuration, revalidate times, approved blocks
├── builder.ts                   # Fetch utilities with validation
└── builder.schemas.ts           # TypeScript types & Zod validation

components/builder/
├── BlockErrorBoundary.tsx       # Error fallback for blocks
├── ImageHelper.tsx              # Image optimization helpers
├── registry.ts                  # Block registry & renderer
└── blocks/
    ├── Hero.tsx                 # Full-width hero section
    ├── TrustBar.tsx            # Stats/indicators
    ├── PromoBanner.tsx         # Promotional message
    ├── PackagesGrid.tsx        # Package cards grid
    ├── FeaturedPackagesCarousel.tsx
    ├── PackageHighlights.tsx   # Key features list
    ├── ItineraryTimeline.tsx   # Trip day-by-day
    ├── Gallery.tsx             # Image gallery
    ├── PricingBox.tsx          # Pricing tier
    ├── ImportantInfo.tsx       # Info/warning boxes
    ├── FAQ.tsx                 # Collapsible Q&A
    └── CTAContact.tsx          # Call-to-action

app/
├── [...]page/
│   └── page.tsx                # Catch-all route for any Builder page
├── packages/
│   └── [slug]/
│       └── page.tsx            # Package detail page (premium template)
└── api/
    └── revalidate/
        └── route.ts            # Webhook endpoint for ISR invalidation
```

---

## How It Works

### 1. Generic Pages (Home, About, Contact, etc.)

**URL:** `https://yoursite.com/about`

1. Next.js catch-all route: `app/[...page]/page.tsx`
2. Fetches page from Builder by URL path
3. Renders blocks from Builder's `blocks` field
4. Dynamic SEO metadata

**Builder Setup:**
- Create a page in Builder.io
- Set URL to `/about`
- Drag & drop approved blocks
- Save & publish

### 2. Packages

#### List Page
**URL:** `https://yoursite.com/packages`

- Can be a Builder page (via catch-all route)
- OR a static Next.js page that displays all packages
- Uses `PackagesGrid` block to list packages

#### Detail Page
**URL:** `https://yoursite.com/packages/egypt-adventure`

1. Next.js dynamic route: `app/packages/[slug]/page.tsx`
2. Fetches package from Builder by slug
3. Renders premium coded template:
   - Featured image
   - Title, price, tags
   - Excerpt
   - Builder blocks from `package.body`
   - Image gallery
   - Final CTA section

**Builder Setup:**
- Create a package in Data Model
- Set `slug` to `egypt-adventure`
- Add price, images, excerpt
- Optional: Add content blocks to `body` field

---

## Caching & Revalidation

### ISR Settings (Incremental Static Regeneration)

```typescript
// lib/config.ts
export const BUILDER_CONFIG = {
  revalidate: {
    pages: 300,              // 5 minutes
    packagesList: 3600,      // 1 hour
    packageDetail: 3600,     // 1 hour
    homepage: 300,           // 5 minutes
  }
};
```

**Benefits:**
- Pages are pre-cached and served fast
- Automatically regenerated on schedule
- No manual cache clearing needed

### On-Demand Revalidation (Webhooks)

When owner updates content in Builder.io:

1. Set up webhook in Builder.io → **Settings → Webhooks**
2. Configure:
   - **URL:** `https://yoursite.com/api/revalidate`
   - **Events:** Content published/unpublished
   - **Secret:** (set in `.env.local` as `BUILDER_WEBHOOK_SECRET`)

3. When published, Builder sends webhook
4. Your API route invalidates cache tags:
   - `builder` for pages
   - `builder-packages` for package lists
   - `builder-package-{slug}` for specific packages

---

## Block Customization

### Creating a New Block

1. Create file in `components/builder/blocks/MyBlock.tsx`:

```typescript
import { z } from "zod";
import { ReactNode } from "react";

const MyBlockPropsSchema = z.object({
  title: z.string().optional(),
  layout: z.enum(["grid", "list"]).optional().default("grid"),
});

export type MyBlockProps = z.infer<typeof MyBlockPropsSchema>;

export function MyBlockBlock(props: any): ReactNode {
  // Validate with Zod
  let validProps: MyBlockProps;
  try {
    validProps = MyBlockPropsSchema.parse(props);
  } catch (error) {
    return <div className="bg-red-50 p-4 text-red-700">Validation failed</div>;
  }

  // Render safely
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold">{validProps.title}</h2>
      </div>
    </section>
  );
}
```

2. Register in `components/builder/registry.ts`:

```typescript
const blockComponents: Partial<Record<ApprovedBlockType, React.ComponentType<any>>> = {
  MyBlock: dynamic(
    () => import("./blocks/MyBlock").then((mod) => mod.MyBlockBlock),
    { ssr: true, loading: () => <BlockErrorFallback /> }
  ),
};
```

3. Add to approved list in `lib/config.ts`:

```typescript
export const APPROVED_BLOCKS = [
  // ... existing blocks
  "MyBlock",
] as const;
```

4. Register in Builder.io UI (or via API)

---

## Security & Best Practices

### ✅ Do's

- ✅ Validate all Builder responses with Zod
- ✅ Whitelist only approved block types
- ✅ Use `next/image` for all images
- ✅ Set revalidation times in config (not hardcoded)
- ✅ Use React `cache()` for deduplication
- ✅ Show debug info only in dev mode
- ✅ Keep component props simple (text, toggles, enums)

### ❌ Don'ts

- ❌ Don't allow raw HTML/CSS injection
- ❌ Don't store packages in Prisma (Builder is source of truth)
- ❌ Don't use dangerouslySetInnerHTML
- ❌ Don't expose styling chaos (unlimited font sizes, margins)
- ❌ Don't allow custom code blocks in Builder
- ❌ Don't commit `.env.local` to git

---

## Testing

### 1. Local Development

```bash
# Install dependencies
npm install

# Set up .env.local with your Builder API key
NEXT_PUBLIC_BUILDER_API_KEY=bm_xxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Start dev server
npm run dev

# Visit http://localhost:3000/your-page-path
```

### 2. Test a Package Page

1. Create a package in Builder.io Data Model with slug `test-package`
2. Visit `http://localhost:3000/packages/test-package`
3. Should render the premium template

### 3. Test Block Rendering

1. Create a Builder page at `/test`
2. Add different blocks, test rendering
3. Check console for validation errors (dev mode)

---

## Troubleshooting

### "Page not found" errors

**Problem:** Builder page not rendering
**Solution:**
1. Check `.env.local` has `NEXT_PUBLIC_BUILDER_API_KEY`
2. Verify page URL matches in Builder.io
3. Check page is published in Builder
4. Look at dev console for validation errors

### "API key not configured"

**Problem:** `NEXT_PUBLIC_BUILDER_API_KEY` is empty
**Solution:**
1. Go to builder.io Account → API Keys
2. Copy public key
3. Add to `.env.local`
4. Restart dev server

### Block not rendering

**Problem:** Block shows error fallback
**Solution:**
1. Check block name matches `registry.ts`
2. Verify block is in `APPROVED_BLOCKS` list
3. Check props match Zod schema
4. Look for validation errors in dev console

### Images not showing

**Problem:** Images broken or missing
**Solution:**
1. Ensure images are uploaded to Builder.io
2. Check `normalizeBuilderImage()` returns valid URL
3. Verify image starts with `http://` or `https://`
4. Check image `alt` text is set

---

## Next Steps

1. **Create Builder.io account** and get API key
2. **Set up .env.local** with your key
3. **Create Data Models** for pages and packages
4. **Create a test page** and visit it locally
5. **Create a test package** and verify detail page
6. **Configure webhooks** for on-demand revalidation
7. **Deploy to production** (Vercel recommended)

---

## Support & Resources

- [Builder.io Docs](https://www.builder.io/c/docs)
- [Next.js ISR Docs](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Builder.io API Reference](https://www.builder.io/c/docs/content-api)
- [Zod Validation](https://zod.dev)

---

## File Checklist

Before deploying:

- [ ] `.env.local` created with API key
- [ ] Builder.io project created with data models
- [ ] Approved blocks registered in Builder
- [ ] Test page created and rendering
- [ ] Test package created and rendering
- [ ] Webhook configured (optional but recommended)
- [ ] All blocks have Zod validation
- [ ] SEO metadata generation working
- [ ] Images optimized with next/image
- [ ] Error boundaries in place
