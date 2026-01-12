import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Only instantiate Prisma if DATABASE_URL is set
// This prevents build-time errors on Vercel when DB isn't configured yet
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    console.warn(
      '[Prisma] DATABASE_URL not set. Database features will not work until environment variable is configured.'
    )
    // Return a dummy client for build time - won't actually be used
    return null as any
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}
