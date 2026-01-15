# Builder.io Integration - Code Examples & Patterns

## Table of Contents
1. Fetching Data
2. Rendering Blocks
3. Creating New Blocks
4. Error Handling
5. Image Handling
6. SEO Metadata
7. Testing

---

## 1. Fetching Data

### Fetch a Page

```typescript
// In a Server Component (route)
import { fetchPageByPath } from "@/lib/builder";

const result = await fetchPageByPath("/about");

if (!result.success) {
  // Handle error
  return <div>{result.error}</div>;
}

const page = result.data; // BuilderPageEntry
```

### Fetch All Packages

```typescript
import { fetchPackages } from "@/lib/builder";

const result = await fetchPackages({
  limit: 10,
  featured: true,
  tag: "Luxury",
});

if (result.success) {
  const packages = result.data; // SafePackage[]
  packages.forEach(pkg => {
    console.log(pkg.title, pkg.price);
  });
}
```

### Fetch Single Package

```typescript
import { fetchPackageBySlug } from "@/lib/builder";

const result = await fetchPackageBySlug("egypt-adventure");

if (result.success) {
  const pkg = result.data; // BuilderPackageEntry
  const data = pkg.data; // PackageData
  console.log(data.title, data.price, data.body); // body = blocks
}
```

### Get All Package Slugs

```typescript
import { fetchPackageSlugs } from "@/lib/builder";

const slugs = await fetchPackageSlugs(); // string[]
// Use in generateStaticParams()
```

---

## 2. Rendering Blocks

### In Route Component

```typescript
import { renderBlocks } from "@/components/builder/registry";

export default async function Page() {
  const result = await fetchPageByPath("/");
  
  if (!result.success) return <div>{result.error}</div>;
  
  const blocks = result.data.data?.blocks || [];
  
  return (
    <main>
      {renderBlocks(blocks)}
    </main>
  );
}
```

### Single Block

```typescript
import { renderBlock } from "@/components/builder/registry";

const block = {
  component: {
    name: "Hero",
    options: {
      title: "Welcome",
      subtitle: "To Amanuel Travel",
    }
  }
};

return <div>{renderBlock(block)}</div>;
```

### Filtered Blocks

```typescript
import { filterApprovedBlocks } from "@/lib/builder";

const blocks = page.data?.blocks || [];
const safeBlocks = filterApprovedBlocks(blocks);

return <div>{renderBlocks(safeBlocks)}</div>;
```

---

## 3. Creating New Blocks

### Complete Example: TestimonialBlock

```typescript
// components/builder/blocks/Testimonial.tsx
import { z } from "zod";
import { ReactNode } from "react";

// 1. Define prop schema
const TestimonialBlockPropsSchema = z.object({
  quote: z.string().optional().default("Great service!"),
  author: z.string().optional().default("Anonymous"),
  role: z.string().optional(),
  image: z.string().optional(),
  rating: z.number().min(1).max(5).optional().default(5),
  layout: z.enum(["left", "center", "right"]).optional().default("center"),
});

export type TestimonialBlockProps = z.infer<typeof TestimonialBlockPropsSchema>;

// 2. Component with validation
export function TestimonialBlock(props: any): ReactNode {
  // Validate props
  let validProps: TestimonialBlockProps;
  try {
    validProps = TestimonialBlockPropsSchema.parse(props);
  } catch (error) {
    return (
      <div className="bg-red-50 p-4 text-red-700">
        Testimonial block validation failed
      </div>
    );
  }

  // 3. Render safely
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[validProps.layout];

  return (
    <section className={`py-12 px-4 bg-gray-50 ${alignClass}`}>
      <div className="max-w-2xl mx-auto">
        {/* Stars */}
        <div className="mb-4">
          {"⭐".repeat(validProps.rating)}
        </div>

        {/* Quote */}
        <blockquote className="text-2xl font-semibold text-gray-900 mb-6">
          "{validProps.quote}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center justify-center gap-4">
          {validProps.image && (
            <img
              src={validProps.image}
              alt={validProps.author}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold text-gray-900">
              {validProps.author}
            </p>
            {validProps.role && (
              <p className="text-sm text-gray-600">{validProps.role}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Register in lib/config.ts

```typescript
export const APPROVED_BLOCKS = [
  // ... existing blocks
  "Testimonial",
] as const;

export type ApprovedBlockType = (typeof APPROVED_BLOCKS)[number];
```

### Register in components/builder/registry.ts

```typescript
const blockComponents: Partial<Record<ApprovedBlockType, React.ComponentType<any>>> = {
  // ... existing blocks
  Testimonial: dynamic(
    () => import("./blocks/Testimonial").then((mod) => mod.TestimonialBlock),
    { ssr: true, loading: () => <BlockErrorFallback /> }
  ),
};
```

---

## 4. Error Handling

### Check Validation Result

```typescript
import { validatePackageEntry } from "@/lib/builder.schemas";

const result = validatePackageEntry(someData);

if (result.success) {
  console.log("Valid package:", result.data);
} else {
  console.error("Validation failed:", result.error);
  if (process.env.NODE_ENV === "development") {
    console.debug("Raw data:", result.raw);
  }
}
```

### Safe Block Rendering with Fallback

```typescript
import { SafeBlockRenderer, BlockErrorFallback } from "@/components/builder/BlockErrorBoundary";

<SafeBlockRenderer blockName="Hero">
  <HeroBlock {...options} />
</SafeBlockRenderer>
```

### Custom Error Boundary

```typescript
'use client';

import { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class BlockErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Block error</div>;
    }
    return this.props.children;
  }
}
```

---

## 5. Image Handling

### Normalize Builder Image

```typescript
import { normalizeImageUrl, BuilderImage } from "@/components/builder/ImageHelper";

// From string
const url = normalizeImageUrl("https://builder.io/image.jpg"); // "https://..."
const invalid = normalizeImageUrl("invalid"); // null

// From object
const url2 = normalizeImageUrl({
  src: "https://example.com/image.jpg"
}); // "https://..."

// Render with next/image
<BuilderImage
  src="https://example.com/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>
```

### Gallery from Images Array

```typescript
import { getFirstValidImage } from "@/components/builder/ImageHelper";

const firstImage = getFirstValidImage(package.images); // string | null

// Display gallery
<div className="grid grid-cols-3 gap-4">
  {package.images?.map((img, idx) => (
    <BuilderImage
      key={idx}
      src={img.src || img}
      alt={`Image ${idx + 1}`}
      width={400}
      height={300}
    />
  ))}
</div>
```

---

## 6. SEO Metadata

### Dynamic Metadata for Pages

```typescript
import { Metadata } from "next";
import { fetchPageByPath } from "@/lib/builder";

export async function generateMetadata({
  params,
}: {
  params: { page: string[] };
}): Promise<Metadata> {
  const path = "/" + params.page.join("/");
  const result = await fetchPageByPath(path);

  if (!result.success) {
    return { title: "Not Found" };
  }

  const page = result.data;
  const meta = page.data?.metadata;

  return {
    title: meta?.title || "Amanuel Travel",
    description: meta?.description,
    keywords: meta?.keywords,
  };
}
```

### Dynamic Metadata for Packages

```typescript
import { Metadata } from "next";
import { fetchPackageBySlug } from "@/lib/builder";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await fetchPackageBySlug(params.slug);

  if (!result.success) {
    return { title: "Package Not Found" };
  }

  const pkg = result.data.data;
  const image = getFirstValidImage(pkg.images);

  return {
    title: `${pkg.title} | Amanuel Travel`,
    description: pkg.excerpt,
    keywords: pkg.tags?.join(", "),
    openGraph: {
      title: pkg.title,
      description: pkg.excerpt,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: pkg.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: pkg.title,
      description: pkg.excerpt,
      images: image ? [image] : [],
    },
  };
}
```

### Structured Data (JSON-LD)

```typescript
function PackageStructuredData({
  package: pkg,
}: {
  package: SafePackage;
}) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "TouristAttraction",
    name: pkg.title,
    description: pkg.excerpt,
    offers: {
      "@type": "Offer",
      priceCurrency: pkg.currency,
      price: pkg.price,
    },
    image: getFirstValidImage(pkg.images),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## 7. Testing

### Unit Test: Block Validation

```typescript
// components/builder/blocks/__tests__/Hero.test.tsx
import { HeroBlock, HeroBlockPropsSchema } from "../Hero";

describe("HeroBlock", () => {
  it("renders with valid props", () => {
    const props = {
      title: "Welcome",
      subtitle: "To Amanuel Travel",
    };

    const schema = HeroBlockPropsSchema.parse(props);
    expect(schema.title).toBe("Welcome");
  });

  it("rejects invalid props", () => {
    const props = {
      title: 123, // Should be string
    };

    expect(() => {
      HeroBlockPropsSchema.parse(props);
    }).toThrow();
  });

  it("provides defaults", () => {
    const schema = HeroBlockPropsSchema.parse({});
    expect(schema.title).toBe("Welcome to Amanuel Travel");
  });
});
```

### Integration Test: Fetch and Render

```typescript
// __tests__/integration.test.ts
import { fetchPageByPath } from "@/lib/builder";

describe("Builder Integration", () => {
  it("fetches and validates page", async () => {
    const result = await fetchPageByPath("/test");
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.data?.blocks).toBeDefined();
    }
  });

  it("handles missing pages", async () => {
    const result = await fetchPageByPath("/nonexistent");
    
    expect(result.success).toBe(false);
    expect(result.error).toContain("not found");
  });
});
```

### E2E Test: Package Page

```typescript
// e2e/packages.spec.ts
import { test, expect } from "@playwright/test";

test("package detail page renders", async ({ page }) => {
  await page.goto("/packages/test-package");
  
  // Check hero image
  const image = page.locator("img[alt*=test-package]").first();
  await expect(image).toBeVisible();
  
  // Check title
  const title = page.locator("h1");
  await expect(title).toContainText("Test Package");
  
  // Check price
  const price = page.locator("text=USD");
  await expect(price).toBeVisible();
  
  // Check CTA button
  const cta = page.locator("a:has-text('Inquire')");
  await expect(cta).toBeVisible();
});
```

---

## Complete Page Example

### /packages/[slug]/page.tsx (Simplified)

```typescript
import { fetchPackageBySlug } from "@/lib/builder";
import { renderBlocks } from "@/components/builder/registry";
import { BuilderImage } from "@/components/builder/ImageHelper";
import { Metadata } from "next";

export default async function PackagePage({
  params,
}: {
  params: { slug: string };
}) {
  // Fetch
  const result = await fetchPackageBySlug(params.slug);
  
  if (!result.success) {
    return <div>{result.error}</div>;
  }

  const pkg = result.data.data;

  return (
    <main>
      {/* Hero */}
      {pkg.images?.[0] && (
        <div className="h-96 bg-gray-100">
          <BuilderImage
            src={pkg.images[0]}
            alt={pkg.title}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}

      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">{pkg.title}</h1>
        <div className="text-3xl font-bold text-blue-600">
          {pkg.currency} {pkg.price}
        </div>
        {pkg.excerpt && (
          <p className="text-lg text-gray-700 mt-6">{pkg.excerpt}</p>
        )}
      </section>

      {/* Blocks */}
      {pkg.body && renderBlocks(pkg.body)}

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
        <a
          href="/contact"
          className="bg-white text-blue-600 px-8 py-3 rounded font-bold"
        >
          Contact Us
        </a>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await fetchPackageBySlug(params.slug);
  
  if (!result.success) {
    return { title: "Not Found" };
  }

  const pkg = result.data.data;

  return {
    title: pkg.title,
    description: pkg.excerpt,
  };
}
```

---

## Common Patterns

### Loading State

```typescript
export function BlockSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-96 bg-gray-200 rounded"></div>
    </div>
  );
}

// In dynamic block
const BlockComponent = dynamic(
  () => import("./blocks/MyBlock").then(m => m.MyBlock),
  { loading: () => <BlockSkeleton /> }
);
```

### Conditional Rendering

```typescript
function PackageCard({ pkg }: { pkg: SafePackage }) {
  return (
    <div>
      {pkg.featured && <span className="badge">Featured</span>}
      {pkg.images?.length > 0 && (
        <BuilderImage src={pkg.images[0]} alt={pkg.title} />
      )}
      {pkg.tags && (
        <div className="tags">
          {pkg.tags.map(tag => <span key={tag}>{tag}</span>)}
        </div>
      )}
    </div>
  );
}
```

### Reusable Block Wrapper

```typescript
function BlockWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-12 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </section>
  );
}
```

---

These patterns cover the most common use cases. Refer to the main documentation files for more details!
