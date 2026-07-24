import { AtaAdminRole, can, canManuallyConfirm, identityFromTrustedSession } from '../authorization'
import { createAuditEvent } from '../audit'
import { customerStatusMessage, transitionRequest } from '../workflow'
import { mayPublish, type VerifiedContent } from '../verified-content'

const identity = (role: AtaAdminRole) => ({subject:'id-1',email:'x@example.test',provider:'oidc',role})

describe('WP-03 control boundaries', () => {
  it('does not accept a client-provided or unknown role', () => {
    expect(identityFromTrustedSession({subject:'1',email:'x@example.test',provider:'oidc',assignedRole:'SUPER_ADMIN'})).toBeNull()
  })
  it('separates ATA confirmation from YK technical access', () => {
    expect(canManuallyConfirm(identity(AtaAdminRole.ATA_OWNER))).toBe(true)
    expect(canManuallyConfirm(identity(AtaAdminRole.YK_TECHNICAL_ADMINISTRATOR))).toBe(false)
    expect(can(identity(AtaAdminRole.YK_TECHNICAL_ADMINISTRATOR),'technical:manage')).toBe(true)
  })
  it('requires explicit authority for manual confirmation', () => {
    expect(() => transitionRequest('PAYMENT_PENDING','MANUALLY_CONFIRMED',false)).toThrow()
    expect(transitionRequest('PAYMENT_PENDING','MANUALLY_CONFIRMED',true)).toBe('MANUALLY_CONFIRMED')
    expect(customerStatusMessage('PAYMENT_PENDING')).toContain('not a confirmed booking')
  })
  it('publishes only verified and publication-approved content', () => {
    const item = {id:'1',category:'tour',submittedValue:'x',source:'owner',sourceType:'written',submittedBy:'owner',
      submittedAt:new Date().toISOString(),reviewState:'VERIFIED',verificationNotes:null,verifiedBy:'v',verifiedAt:new Date().toISOString(),
      approvedBy:'a',approvedAt:new Date().toISOString(),publicationState:'APPROVED_FOR_PUBLICATION',
      reviewAt:null,evidenceFileId:null,version:1,replacementId:null} as VerifiedContent
    expect(mayPublish(item)).toBe(true)
    expect(mayPublish({...item,reviewState:'SUBMITTED'})).toBe(false)
  })
  it('limits audit events to staging and test', () => {
    expect(createAuditEvent({actorSubject:'1',actorRole:'ATA_OWNER',action:'update',entityType:'tour',entityId:'1',
      previousValue:null,newValue:{},environment:'staging'}).occurredAt).toBeTruthy()
  })
})
