export const AtaAdminRole = {
  ATA_OWNER: 'ATA_OWNER',
  ATA_ADMINISTRATOR: 'ATA_ADMINISTRATOR',
  ATA_CONTENT_MANAGER: 'ATA_CONTENT_MANAGER',
  ATA_OPERATIONS_MANAGER: 'ATA_OPERATIONS_MANAGER',
  YK_TECHNICAL_ADMINISTRATOR: 'YK_TECHNICAL_ADMINISTRATOR',
  READ_ONLY_AUDITOR: 'READ_ONLY_AUDITOR',
} as const

export type AtaAdminRole = (typeof AtaAdminRole)[keyof typeof AtaAdminRole]

export type AtaPermission =
  | 'audit:read' | 'content:read' | 'content:edit' | 'content:approve'
  | 'request:read' | 'request:manage' | 'request:confirm'
  | 'access:manage' | 'technical:manage'

const permissions: Record<AtaAdminRole, readonly AtaPermission[]> = {
  ATA_OWNER: ['audit:read','content:read','content:edit','content:approve','request:read','request:manage','request:confirm','access:manage'],
  ATA_ADMINISTRATOR: ['audit:read','content:read','content:edit','content:approve','request:read','request:manage','request:confirm','access:manage'],
  ATA_CONTENT_MANAGER: ['content:read','content:edit'],
  ATA_OPERATIONS_MANAGER: ['audit:read','content:read','request:read','request:manage'],
  YK_TECHNICAL_ADMINISTRATOR: ['audit:read','content:read','request:read','technical:manage'],
  READ_ONLY_AUDITOR: ['audit:read','content:read','request:read'],
}

export type IdentityContext = {
  subject: string
  email: string
  role: AtaAdminRole
  provider: string
}

export function can(
  identity: IdentityContext | null,
  permission: AtaPermission
) {
  if (!identity?.subject || !identity.email || !identity.provider) return false
  return permissions[identity.role]?.includes(permission) ?? false
}

export function canPublishTour(identity: IdentityContext | null) {
  return can(identity, 'content:approve')
}

export function canManageRequests(identity: IdentityContext | null) {
  return can(identity, 'request:manage')
}

export function canManuallyConfirm(identity: IdentityContext | null) {
  return can(identity, 'request:confirm')
}

export function identityFromTrustedSession(
  session: { subject?: string; email?: string; provider?: string; assignedRole?: string } | null
): IdentityContext | null {
  if (!session?.subject || !session.email || !session.provider) return null
  if (!(session.assignedRole && session.assignedRole in permissions)) return null
  return { subject: session.subject, email: session.email, provider: session.provider, role: session.assignedRole as AtaAdminRole }
}

