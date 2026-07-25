import {
  CustomerRequestInputSchema,
  CustomerRequestReceiptSchema,
  type CustomerRequestInput,
  type CustomerRequestReceipt,
} from './domain'
import { getAtaFeatureFlags } from './feature-flags'
import type { AtaEnvironment } from './feature-flags'

export async function submitTestRequest(
  input: CustomerRequestInput,
  env: AtaEnvironment = process.env
): Promise<CustomerRequestReceipt> {
  const flags = getAtaFeatureFlags(env)
  if (!flags.testRequestService) {
    throw new Error('ATA test request service is disabled')
  }

  const parsed = CustomerRequestInputSchema.parse(input)
  if (parsed.website) {
    throw new Error('Request rejected')
  }

  return CustomerRequestReceiptSchema.parse({
    requestId: `ATA-TEST-${crypto.randomUUID()}`,
    status: 'SUBMITTED',
    testOnly: true,
    message:
      'Your request has been received. This is not a confirmed booking, reservation, seat, price, or payment. A person at ATA will review it and reply on your chosen channel.',
  })
}
