export const RequestStatuses = [
  'DRAFT','SUBMITTED','UNDER_REVIEW','MORE_INFORMATION_REQUIRED','QUALIFIED',
  'QUOTE_PREPARATION','QUOTE_SENT','CUSTOMER_RESPONSE_PENDING',
  'ACCEPTED_IN_PRINCIPLE','PAYMENT_PENDING','MANUALLY_CONFIRMED',
  'DECLINED','CANCELLED','CLOSED','ARCHIVED',
] as const
export type RequestStatus = typeof RequestStatuses[number]
const transitions: Record<RequestStatus, readonly RequestStatus[]> = {
  DRAFT:['SUBMITTED','CANCELLED'], SUBMITTED:['UNDER_REVIEW','DECLINED','CANCELLED'],
  UNDER_REVIEW:['MORE_INFORMATION_REQUIRED','QUALIFIED','DECLINED','CANCELLED'],
  MORE_INFORMATION_REQUIRED:['UNDER_REVIEW','CANCELLED'], QUALIFIED:['QUOTE_PREPARATION','DECLINED'],
  QUOTE_PREPARATION:['QUOTE_SENT','DECLINED'], QUOTE_SENT:['CUSTOMER_RESPONSE_PENDING','ACCEPTED_IN_PRINCIPLE','DECLINED'],
  CUSTOMER_RESPONSE_PENDING:['ACCEPTED_IN_PRINCIPLE','DECLINED','CANCELLED'],
  ACCEPTED_IN_PRINCIPLE:['PAYMENT_PENDING','MANUALLY_CONFIRMED','CANCELLED'],
  PAYMENT_PENDING:['MANUALLY_CONFIRMED','CANCELLED'], MANUALLY_CONFIRMED:['CANCELLED','CLOSED'],
  DECLINED:['CLOSED','ARCHIVED'], CANCELLED:['CLOSED','ARCHIVED'], CLOSED:['ARCHIVED'], ARCHIVED:[],
}
export function canTransition(from: RequestStatus, to: RequestStatus) { return transitions[from].includes(to) }
export function transitionRequest(from: RequestStatus, to: RequestStatus, authorizedToConfirm = false) {
  if (!canTransition(from, to)) throw new Error(`Invalid request transition: ${from} -> ${to}`)
  if (to === 'MANUALLY_CONFIRMED' && !authorizedToConfirm) throw new Error('Manual confirmation authority required')
  return to
}
export function customerStatusMessage(status: RequestStatus) {
  return status === 'MANUALLY_CONFIRMED'
    ? 'Your booking was manually confirmed by an authorized ATA representative.'
    : 'Your request is being reviewed. It is not a confirmed booking, reservation, seat, price, or payment.'
}
