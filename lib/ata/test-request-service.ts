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
    status: 'NEW',
    testOnly: true,
    message:
      'Your request was received for test review. It is not a confirmed booking, reservation, price, seat, or payment.',
  })
}
