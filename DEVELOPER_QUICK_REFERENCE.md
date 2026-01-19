# Developer Quick Reference

## Essential Commands

### Development
```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Create production build
npm run lint             # Check code style
npm run type-check       # TypeScript strict checking
npm run test             # Run Jest tests
npm run test:watch       # Watch mode for tests
npm run test:coverage    # Coverage report
npm run analyze          # Bundle size analysis
```

### Database
```bash
npm run db:health        # Check connectivity & latency
npm run db:backup        # Create backup
npm run db:restore       # Restore from backup
npx prisma studio       # Open Prisma Studio GUI
npx prisma migrate dev  # Create new migration
```

---

## File Locations

### Utility Files (lib/)
```
lib/env.ts              # Environment validation (read this first!)
lib/validation.ts       # Zod schemas for API inputs
lib/error-handling.ts   # Error response formatting
lib/rate-limit.ts       # Request rate limiting
lib/http-utils.ts       # Cache/CORS/security headers
lib/hooks.ts            # Custom React hooks
```

### API Routes (app/api/)
```
app/api/health/         # Health check endpoint
app/api/webhooks/       # Stripe, Builder.io webhooks
app/api/auth/          # Authentication endpoints
```

### Documentation (root)
```
FINAL_VERIFICATION_REPORT.md      # ⭐ Start here for verification
IMPROVEMENTS_IMPLEMENTATION.md    # Implementation details
DATABASE_BACKUPS_STRATEGY.md      # Disaster recovery
API_REFERENCE.md                  # API documentation
ARCHITECTURE.md                   # System architecture
```

---

## Environment Setup

### .env.local Required
```env
DATABASE_URL=postgresql://user:password@localhost:5432/amannuel_travel
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl rand -base64 32
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Optional Environment Variables
```env
NEXT_PUBLIC_SENTRY_DSN=        # Sentry error tracking
STRIPE_SECRET_KEY=              # Stripe payment processing
RESEND_API_KEY=                 # Email service
```

---

## Key Features

### Security
- ✅ Input validation with Zod schemas
- ✅ Rate limiting (booking: 5/min, auth: 10/15min)
- ✅ Secure headers (CSP, HSTS, X-Frame-Options)
- ✅ CORS with origin validation
- ✅ Sensitive data masking

### Performance
- ✅ Cache control headers (no-cache, 5min, 1hr, 24hr)
- ✅ Database query optimization
- ✅ Image optimization (AVIF/WebP)
- ✅ Bundle size analysis

### Testing
- ✅ Jest with 50% coverage threshold
- ✅ TypeScript strict mode
- ✅ GitHub Actions CI/CD pipeline

### Monitoring
- ✅ Health check endpoint: `/api/health`
- ✅ Sentry integration (optional)
- ✅ Database connectivity checks

---

## Common Tasks

### Add a New API Endpoint
```typescript
// 1. Create validation schema in lib/validation.ts
export const MyRequestSchema = z.object({
  field: z.string().min(1),
})

// 2. Create API route in app/api/my-endpoint/route.ts
import { prisma } from '@/lib/prisma'
import { ApiErrorHandler } from '@/lib/error-handling'
import { MyRequestSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const parsed = MyRequestSchema.parse(data)  // Validates input
    
    // Your logic here
    const result = await prisma.myModel.create({ data: parsed })
    
    return NextResponse.json(result)
  } catch (error) {
    return ApiErrorHandler.handle(error, request)
  }
}
```

### Add a New React Hook
```typescript
// Add to lib/hooks.ts
export function useMyHook(dependency: string) {
  const [state, setState] = useState(null)
  
  useEffect(() => {
    // Hook logic
  }, [dependency])
  
  return state
}
```

### Add a Test
```typescript
// Create file: app/api/my-endpoint/__tests__/route.test.ts
import { POST } from '../route'

describe('POST /api/my-endpoint', () => {
  it('should handle valid input', async () => {
    // Test implementation
  })
})

// Run: npm run test
```

---

## Error Handling Pattern

### API Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Using ApiErrorHandler
```typescript
import { ApiErrorHandler } from '@/lib/error-handling'

try {
  // Your logic
} catch (error) {
  // Automatically handles:
  // - ZodError → 400 with validation details
  // - NotFoundError → 404
  // - UnauthorizedError → 401
  // - RateLimitError → 429
  // - Other errors → 500 with masking
  return ApiErrorHandler.handle(error, request)
}
```

---

## Rate Limiting

### Pre-configured Limits
```typescript
// lib/rate-limit.ts has defaults for:
- Booking endpoints: 5 requests/minute
- Auth endpoints: 10 requests/15 minutes
- Webhook endpoints: 100 requests/minute
- Search endpoints: 20 requests/minute
```

### Using Rate Limiter
```typescript
import { rateLimiters } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  
  const result = rateLimiters.booking.check(ip)
  if (!result.success) {
    return result.response  // Returns 429 Too Many Requests
  }
  
  // Proceed with request
}
```

---

## Health Check

### Endpoint: `/api/health`
```bash
curl http://localhost:3000/api/health

# Response:
{
  "status": "ok",
  "timestamp": "2025-01-01T12:00:00Z",
  "database": {
    "connected": true,
    "latency": 2.5
  },
  "uptime": 3600
}
```

---

## GitHub Actions CI/CD

### Pipeline Stages
1. **Install** - Dependencies
2. **Lint** - ESLint validation
3. **Build** - Next.js production build
4. **Test** - Jest tests with PostgreSQL
5. **Security** - npm audit + Snyk scan
6. **Deploy Staging** - On PR merge
7. **Deploy Production** - On version tag

### View Logs
```bash
# In VS Code or GitHub Actions tab
# Check .github/workflows/ci-cd.yml
```

---

## Debugging

### Enable Debug Logging
```bash
DEBUG=* npm run dev
```

### Check TypeScript Errors
```bash
npm run type-check
```

### Check Code Style Issues
```bash
npm run lint
```

### Database Connectivity
```bash
npm run db:health
```

### Bundle Size
```bash
npm run analyze
```

---

## Troubleshooting

### Build Fails
```bash
npm run lint     # Check for ESLint errors
npm run type-check  # Check for TypeScript errors
npm run build    # Try building again
```

### Dev Server Won't Start
```bash
# Check .env.local has DATABASE_URL and NEXTAUTH_SECRET
# Try: npm install
# Then: npm run dev
```

### Database Connection Error
```bash
# Verify DATABASE_URL in .env.local
# Check PostgreSQL is running
# Run: npm run db:health
```

### Tests Failing
```bash
# Check Jest configuration
npm run test     # Run tests with full output
npm run test:watch  # Debug specific test
```

---

## Useful Links

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Zod Validation**: https://zod.dev
- **Jest Testing**: https://jestjs.io
- **NextAuth**: https://next-auth.js.org

---

## Version Info

```
Next.js: 14.2.35
React: 18.x
TypeScript: 5.x
Node: 18+ (recommended)
PostgreSQL: 12+
```

---

**Last Updated**: 2025  
**Status**: Production Ready ✅  
