export type AuditEvent = {
  actorSubject:string; actorRole:string; action:string; entityType:string; entityId:string;
  previousValue:unknown; newValue:unknown; occurredAt:string; environment:'staging'|'test';
  requestId?:string; tourId?:string
}
export function createAuditEvent(input: Omit<AuditEvent,'occurredAt'>, now = new Date()): AuditEvent {
  if (!['staging','test'].includes(input.environment)) throw new Error('Production audit writes are disabled in WP-03')
  return {...input, occurredAt:now.toISOString()}
}
