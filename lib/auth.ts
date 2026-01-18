import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import { comparePasswords } from './password'

// Extend NextAuth types to include id
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

const hasDatabase = !!process.env.DATABASE_URL && !!prisma
const hasGoogleCredentials =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET

const providers: NextAuthOptions['providers'] = []

if (hasGoogleCredentials) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    })
  )
} else {
  console.warn('[Auth] Google OAuth not configured; Google sign-in disabled.')
}

providers.push(
  CredentialsProvider({
    name: 'Email & Password',
    credentials: {
      email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Email and password required')
      }

      if (!hasDatabase) {
        throw new Error('Database is not configured')
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      })

      if (!user || !user.password) {
        throw new Error('Invalid email or password')
      }

      const isPasswordValid = await comparePasswords(credentials.password, user.password)

      if (!isPasswordValid) {
        throw new Error('Invalid email or password')
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    },
  })
)

export const authOptions: NextAuthOptions = {
  adapter: hasDatabase ? PrismaAdapter(prisma) : undefined,
  providers,
  callbacks: {
    async signIn() {
      // Allow sign in
      return true
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ''
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
}
