import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// This is a dynamic route - don't try to prerender it
export const dynamic = 'force-dynamic'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
