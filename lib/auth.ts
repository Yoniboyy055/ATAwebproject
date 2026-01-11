import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// Simple file-based user storage (for demo)
const usersFilePath = join(process.cwd(), 'data', 'users.json')

function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }
}

function getUsers() {
  ensureDataDir()
  try {
    if (existsSync(usersFilePath)) {
      return JSON.parse(readFileSync(usersFilePath, 'utf-8')) as UserRecord[]
    }
  } catch (error) {
    console.error('Error reading users file:', error)
  }
  return [] as UserRecord[]
}

function saveUsers(users: Record<string, unknown>[]) {
  ensureDataDir()
  writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
}

interface UserRecord {
  id: string
  email: string
  name: string
  image: string | null
  createdAt: string
  bookings: Record<string, unknown>[]
  savedPackages: Record<string, unknown>[]
  quotes: Record<string, unknown>[]
  reviews: Record<string, unknown>[]
}

function findOrCreateUser(email: string, name?: string, image?: string): UserRecord {
  const users = getUsers() as UserRecord[]
  const existingUser = users.find((u) => u.email === email)

  if (existingUser) {
    return existingUser
  }

  const newUser: UserRecord = {
    id: Date.now().toString(),
    email,
    name: name || email.split('@')[0],
    image: image || null,
    createdAt: new Date().toISOString(),
    bookings: [],
    savedPackages: [],
    quotes: [],
    reviews: [],
  }

  users.push(newUser)
  saveUsers(users)
  return newUser
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@amanueltravel.com',
    }),
    CredentialsProvider({
      name: 'Quick Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error('Email required')
        }
        // For demo: accept any email, create user on login
        const user = findOrCreateUser(credentials.email, undefined)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        const userData = findOrCreateUser(user.email, user.name || undefined, user.image || undefined)
        user.id = userData.id
      }
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
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
}
