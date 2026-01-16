# Amanuel Travel Codebase Instructions for AI Agents

## Architecture Overview

**Tech Stack**: Next.js 14 (TypeScript, Tailwind) + Prisma ORM + PostgreSQL + NextAuth  
**Key Pattern**: API routes use `NextRequest`/`NextResponse`, pages use Server/Client components  
**Build**: `npm run build` runs `prisma generate && next build` (Prisma schema required before build)

### Core Components
- **Auth**: NextAuth with Google OAuth + email/password (bcryptjs hashing) - see [lib/auth.ts](lib/auth.ts)
- **Database**: Prisma ORM with PostgreSQL, models in [prisma/schema.prisma](prisma/schema.prisma) (~25 models)
- **API Layer**: Routes in `app/api/**` use `export const dynamic = 'force-dynamic'` and `runtime = 'nodejs'` 
- **Builder.io CMS**: Dynamic pages via catch-all `app/[...page]/page.tsx`, validated with Zod schemas, ISR cached (5 min pages, 1 hour packages)
- **Payments**: Stripe integration with webhook signature verification - [app/api/webhooks/stripe/route.ts](app/api/webhooks/stripe/route.ts)
- **Communication**: Resend (email), Twilio (SMS), WhatsApp integration

## Critical Patterns

### 1. API Route Structure (ALWAYS follow this)
```typescript
export const dynamic = 'force-dynamic'  // Required for all API routes
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()  // Auth check
    if (!session) return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    
    const data = await request.json()
    // Validate with Zod schema, then query Prisma
    return NextResponse.json({...})
  } catch (error) {
    // Handle z.ZodError separately for 400, others for 500
    return NextResponse.json({error: '...'}, {status: 500})
  }
}
```

### 2. Database Access Pattern
- **Always use Prisma**: `import { prisma } from '@/lib/prisma'`
- **Prisma initialization**: Handles null gracefully if `DATABASE_URL` missing (build-time safety)
- **Common queries**: `findUnique()`, `findMany()`, `create()`, `update()`, `delete()`
- **Include relations**: Add `include: {relatedModel: true}` to fetch nested data

### 3. Validation (Zod + Type Safety)
Every API input validated with Zod schemas (`lib/builder.schemas.ts` for Builder blocks):
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})
const parsed = schema.parse(body)  // Throws ZodError on invalid
```

### 4. Builder.io Dynamic Pages
- Pages fetched via catch-all route `app/[...page]/page.tsx` 
- Validates blocks with Zod (`validatePageEntry`, `validatePackageEntry`)
- **Only 12 approved blocks** allowed (security whitelist in `lib/builder.ts`)
- ISR revalidation: webhook POST to `/api/revalidate` with secret verification
- Cache tags: `"builder"` for pages, `"builder-packages"` for packages

### 5. Authentication Flow
- **Session strategy**: JWT (30-day max age)
- **Protected routes**: Check `const session = await getServerSession()` in API routes
- **Admin routes**: Check admin email in [lib/admin.ts](lib/admin.ts) → `isAdmin(email)`
- **Client-side**: Use `useSession()` hook from `next-auth/react`

## Key Files Reference

| File | Purpose |
|------|---------|
| [lib/auth.ts](lib/auth.ts) | NextAuth config + providers |
| [lib/prisma.ts](lib/prisma.ts) | Prisma client singleton |
| [lib/builder.ts](lib/builder.ts) | Builder.io API + validation |
| [prisma/schema.prisma](prisma/schema.prisma) | Database schema |
| [app/api/](app/api/) | All API endpoints |
| [components/builder/](components/builder/) | Builder.io block components |

## Developer Workflows

### Local Development
```bash
npm install              # Install deps + prisma generate
npm run dev             # Start Next.js on :3000
```

### Database Changes
```bash
npx prisma migrate dev --name <change_name>  # Create + apply migration
npm run db:push         # Push schema without migration (dev only)
npm run db:seed         # Seed test data from prisma/seed.ts
```

### Building
```bash
npm run build           # Runs: prisma generate && next build
npm run lint            # ESLint check
```

### Image Optimization (custom script)
```bash
npm run images:optimize       # Optimize images in-place
npm run images:optimize:dry   # Preview without changes
```

## Common Gotchas

1. **Build failures**: Ensure `prisma generate` runs first (auto via postinstall), DATABASE_URL set if doing migrations
2. **API routes are always dynamic**: Can't be static cached, use `export const dynamic = 'force-dynamic'`
3. **NextAuth session**: Only available server-side via `getServerSession()`, client gets partial data
4. **Image optimization**: Builder.io images must start with `http://`/`https://` (see [next.config.js](next.config.js) remotePatterns)
5. **Stripe webhooks**: Verify signature with STRIPE_WEBHOOK_SECRET (not API key), check `/api/webhooks/stripe`
6. **Cache invalidation**: Modify cache tags in ISR `next: {revalidate, tags}` options, or POST to `/api/revalidate`

## When to Check Documentation

- **Builder.io errors**: See [BUILDER_IO_QUICK_REFERENCE.md](BUILDER_IO_QUICK_REFERENCE.md) error table
- **Payment issues**: [DATABASE_SETUP.md](DATABASE_SETUP.md) payment flow section  
- **Database schema**: [prisma/schema.prisma](prisma/schema.prisma) + [ARCHITECTURE.md](ARCHITECTURE.md)
- **API endpoint specs**: [API_REFERENCE.md](API_REFERENCE.md)
- **Full architecture flow**: [ARCHITECTURE.md](ARCHITECTURE.md) request/auth/data flow diagrams
