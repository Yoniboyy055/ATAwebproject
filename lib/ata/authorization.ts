export const AtaAdminRole = {
  VIEWER: 'VIEWER',
  EDITOR: 'EDITOR',
  APPROVER: 'APPROVER',
  ADMIN: 'ADMIN',
} as const

export type AtaAdminRole = (typeof AtaAdminRole)[keyof typeof AtaAdminRole]

const roleRank: Record<AtaAdminRole, number> = {
  VIEWER: 1,
  EDITOR: 2,
  APPROVER: 3,
  ADMIN: 4,
}

export type IdentityContext = {
  subject: string
  email: string
  role: AtaAdminRole
  provider: string
}

export function can(
  identity: IdentityContext | null,
  requiredRole: AtaAdminRole
) {
  if (!identity?.subject || !identity.email || !identity.provider) return false
  return roleRank[identity.role] >= roleRank[requiredRole]
}

export function canPublishTour(identity: IdentityContext | null) {
  return can(identity, AtaAdminRole.APPROVER)
}

export function canManageRequests(identity: IdentityContext | null) {
  return can(identity, AtaAdminRole.EDITOR)
}

