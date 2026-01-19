import { z } from 'zod'

/**
 * Environment variables schema validation
 * Ensures all required env vars are present at runtime
 */
const EnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),

  // Builder.io
  NEXT_PUBLIC_BUILDER_API_KEY: z.string().min(1, 'Builder.io API key is required'),
  NEXT_PUBLIC_SITE_URL: z.string().url('NEXT_PUBLIC_SITE_URL must be a valid URL'),

  // Optional: OAuth providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Optional: Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY: z.string().optional(),

  // Optional: Communications
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.string().optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  WHATSAPP_PHONE_NUMBER: z.string().optional(),

  // Optional: Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),

  // Optional: Support
  NEXT_PUBLIC_CRISP_WEBSITE_ID: z.string().optional(),

  // Optional: A/B Testing
  NEXT_PUBLIC_AB_TEST_ENABLED: z.string().optional(),
  NEXT_PUBLIC_AB_TEST_VARIANTS: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof EnvSchema>

/**
 * Validates environment variables at startup
 * Throws error if required vars are missing
 */
export function validateEnv(): Env {
  try {
    const env = EnvSchema.parse(process.env)
    console.log('✓ Environment variables validated successfully')
    return env
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues
        .map((issue: z.ZodIssue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('\n')
      console.error('❌ Environment variable validation failed:\n', issues)
      throw new Error(`Invalid environment variables:\n${issues}`)
    }
    throw error
  }
}

// Validate on module load (only in production)
if (process.env.NODE_ENV === 'production') {
  validateEnv()
}

export const env = {
  database: {
    url: process.env.DATABASE_URL || '',
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET || '',
    url: process.env.NEXTAUTH_URL || '',
  },
  builder: {
    apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY || '',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  email: {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    user: process.env.EMAIL_SERVER_USER,
    password: process.env.EMAIL_SERVER_PASSWORD,
    from: process.env.EMAIL_FROM,
  },
  whatsapp: {
    phoneNumber: process.env.WHATSAPP_PHONE_NUMBER,
  },
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID,
    gtmId: process.env.NEXT_PUBLIC_GTM_ID,
  },
}
