import {
  AtaAdminRole,
  canManageRequests,
  canPublishTour,
  type IdentityContext,
} from '../authorization'

function identity(role: IdentityContext['role']): IdentityContext {
  return {
    subject: 'provider-user-123',
    email: 'owner@example.test',
    provider: 'google',
    role,
  }
}

describe('ATA identity-backed authorization', () => {
  it('rejects anonymous and viewer publication attempts', () => {
    expect(canPublishTour(null)).toBe(false)
    expect(canPublishTour(identity(AtaAdminRole.READ_ONLY_AUDITOR))).toBe(false)
  })

  it('allows only approver-level identities to publish', () => {
    expect(canPublishTour(identity(AtaAdminRole.ATA_CONTENT_MANAGER))).toBe(false)
    expect(canPublishTour(identity(AtaAdminRole.ATA_ADMINISTRATOR))).toBe(true)
    expect(canPublishTour(identity(AtaAdminRole.ATA_OWNER))).toBe(true)
  })

  it('allows editors to manage requests without granting publication', () => {
    const editor = identity(AtaAdminRole.ATA_OPERATIONS_MANAGER)
    expect(canManageRequests(editor)).toBe(true)
    expect(canPublishTour(editor)).toBe(false)
  })
})

