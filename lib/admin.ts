/**
 * Admin and role management utilities
 */

export type UserRole = 'admin' | 'staff' | 'user'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  lastLogin: Date | null
}

// Admin email list (can be extended to database)
const ADMIN_EMAILS = [
  'admin@amanueltravel.com',
  'staff@amanueltravel.com',
]

/**
 * Check if user has admin role
 */
export function isAdmin(email?: string | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

/**
 * Check if user has specific permission
 */
export function hasPermission(email: string | undefined | null): boolean {
  if (!email || !isAdmin(email)) return false
  return true // All admins have all permissions for now
}

/**
 * Get list of all admin emails
 */
export function getAdminEmails(): string[] {
  return ADMIN_EMAILS
}

/**
 * Add admin email (for future database integration)
 */
export function addAdminEmail(email: string): void {
  if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
    ADMIN_EMAILS.push(email.toLowerCase())
  }
}

/**
 * Remove admin email
 */
export function removeAdminEmail(email: string): void {
  const index = ADMIN_EMAILS.findIndex((e) => e.toLowerCase() === email.toLowerCase())
  if (index > -1) {
    ADMIN_EMAILS.splice(index, 1)
  }
}
