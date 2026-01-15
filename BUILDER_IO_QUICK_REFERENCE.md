# Builder.io Integration - Quick Reference

## 🚀 5-Minute Setup

```bash
# 1. Add API key to .env.local
NEXT_PUBLIC_BUILDER_API_KEY=your_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 2. Create Data Models in Builder.io
# - page (for /about, /contact, etc.)
# - package (for /packages/[slug])

# 3. Start dev server
npm run dev

# 4. Create test page/package in Builder.io
# 5. Visit http://localhost:3000/test
```

---

## 📁 File Map

| File | Purpose |
|------|---------|
| `lib/config.ts` | Settings, approved blocks |
| `lib/builder.ts` | Fetch data from Builder |
| `lib/builder.schemas.ts` | Types & validation |
| `components/builder/registry.ts` | Render blocks |
| `components/builder/blocks/*` | 12 approved blocks |
| `app/[...page]/page.tsx` | Any Builder page |
| `app/packages/[slug]/page.tsx` | Package detail (premium) |
| `app/api/revalidate/route.ts` | Webhook for cache |

---

## 🔧 Common Tasks

### Display all packages
```tsx
import { PackagesGridBlock } from "@/components/builder/blocks/PackagesGrid";

<PackagesGridBlock 
  title="Our Packages"
  layout="3-col"
  featured={false}
/>
```

### Get single package
```tsx
import { fetchPackageBySlug } from "@/lib/builder";

const result = await fetchPackageBySlug("egypt-tour");
if (result.success) {
  const pkg = result.data.data;
  console.log(pkg.title, pkg.price);
}
```

### Render page blocks
```tsx
import { fetchPageByPath, renderBlocks } from "@/lib/builder";

const result = await fetchPageByPath("/about");
return <main>{renderBlocks(result.data.data?.blocks)}</main>;
```

### Add image safely
```tsx
import { BuilderImage } from "@/components/builder/ImageHelper";

<BuilderImage 
  src={pkg.images[0]}
  alt="Package"
  width={800}
  height={600}
/>
```

---

## ✅ Approved Blocks (12)

- ✓ Hero
- ✓ TrustBar
- ✓ PromoBanner
- ✓ PackagesGrid
- ✓ FeaturedPackagesCarousel
- ✓ PackageHighlights
- ✓ ItineraryTimeline
- ✓ Gallery
- ✓ PricingBox
- ✓ ImportantInfo
- ✓ FAQ
- ✓ CTAContact

❌ No custom code, raw HTML, or unapproved blocks

---

## 🔄 Data Flow

```
Builder.io Editor
      ↓
Builder Content API
      ↓
lib/builder.ts (fetch + Zod validate)
      ↓
Routes (renderBlocks)
      ↓
Block Registry (only approved)
      ↓
HTML + next/image
```

---

## 📊 Package Model

```json
{
  "title": "Egypt Adventure",
  "slug": "egypt-adventure",
  "price": 1299,
  "currency": "USD",
  "excerpt": "Explore pyramids and Nile",
  "featured": true,
  "tags": ["Luxury", "Adventure"],
  "images": [
    { "src": "https://..." },
    { "src": "https://..." }
  ],
  "body": [
    {
      "component": {
        "name": "Hero",
        "options": { "title": "Day 1: Cairo" }
      }
    }
  ]
}
```

---

## 📝 Page Model

```json
{
  "title": "About Us",
  "metadata": {
    "title": "About Amanuel Travel",
    "description": "We are...",
    "keywords": "travel, agency"
  },
  "blocks": [
    {
      "component": {
        "name": "Hero",
        "options": { "title": "Welcome" }
      }
    }
  ]
}
```

---

## 🎨 Create New Block

**File:** `components/builder/blocks/NewBlock.tsx`

```typescript
import { z } from "zod";

const Schema = z.object({
  title: z.string().optional(),
});

export function NewBlockBlock(props: any) {
  const validProps = Schema.parse(props);
  return <div>{validProps.title}</div>;
}
```

**Register:** Add to `lib/config.ts` + `components/builder/registry.ts`

---

## 🐛 Debug Mode

**Dev mode only:**
- Shows block validation errors
- Shows API response data
- Shows "Debug info" details

**Production:**
- Hides errors from users
- Shows generic fallback
- Errors logged to console

---

## ⚙️ Cache Settings

| Content | Revalidate | Cache Tag |
|---------|------------|-----------|
| Pages | 5 min | `builder` |
| Package list | 1 hour | `builder-packages` |
| Package detail | 1 hour | `builder-package-{slug}` |

**Manual invalidation:** POST to `/api/revalidate` (via webhook)

---

## 🔒 Security Checklist

- ✓ Only 12 approved blocks allowed
- ✓ Props validated with Zod
- ✓ Images through next/image
- ✓ No raw HTML allowed
- ✓ Error fallbacks for invalid data
- ✓ Public API key only (safe to expose)
- ✓ `.env.local` never committed

---

## 📱 URLs

| Path | Route | Type |
|------|-------|------|
| `/` | catch-all | Builder page |
| `/about` | catch-all | Builder page |
| `/packages` | catch-all | Builder page |
| `/packages/egypt-tour` | dynamic | Code template |
| `/api/revalidate` | API | Webhook |

---

## 🚨 Common Errors

| Error | Fix |
|-------|-----|
| "API key not set" | Add to `.env.local`, restart server |
| "Page not found" | Check page URL matches in Builder |
| "Block validation failed" | Check props match Zod schema |
| "Image broken" | Verify image URL, upload to Builder |
| "Cache not updating" | Check webhook endpoint, inspect tags |

---

## 📚 Docs

- **Setup:** `BUILDER_IO_SETUP.md`
- **Implementation:** `BUILDER_IO_IMPLEMENTATION_SUMMARY.md`
- **File Tree:** `BUILDER_IO_FILE_TREE.md`
- **Code Examples:** `BUILDER_IO_CODE_EXAMPLES.md`
- **This:** `BUILDER_IO_QUICK_REFERENCE.md`

---

## 🎯 Next Steps

1. ✅ Create Builder.io account
2. ✅ Get public API key
3. ✅ Add to `.env.local`
4. ✅ Create `page` data model
5. ✅ Create `package` data model
6. ✅ Register approved blocks
7. ✅ Create test page
8. ✅ Create test package
9. ✅ Test locally
10. ✅ Deploy to production

---

## 💡 Tips

- **Block props:** Keep them simple (text, toggles, enums)
- **Images:** Always validate URLs first
- **Caching:** Longer times = fewer API calls
- **Testing:** Create test pages/packages first
- **Errors:** Check dev console for validation errors
- **SEO:** Metadata auto-generated from Builder data
- **Mobile:** All blocks should be responsive

---

## 🔗 Resources

- [Builder.io](https://builder.io)
- [Next.js ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Zod](https://zod.dev)
- [next/image](https://nextjs.org/docs/basic-features/image-optimization)

---

**Last Updated:** January 15, 2026
**Status:** ✅ Production Ready
