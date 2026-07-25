import { submitTestRequest } from '../test-request-service'

const input = {
  type: 'BOOKING_REQUEST' as const,
  tourId: 'working-candidate-asmara-massawa',
  fullName: 'Test Traveler',
  email: 'traveler@example.test',
  phone: '+1 555 010 0200',
  travelerCount: 2,
  preferredDate: null,
  preferredContact: 'EMAIL' as const,
  message: null,
  consentAccepted: true as const,
  consentVersion: 'wp03c-preview-v1' as const,
  website: '',
}

describe('ATA test request service', () => {
  it('is disabled by default', async () => {
    await expect(submitTestRequest(input, {})).rejects.toThrow('disabled')
  })

  it('returns a test-only SUBMITTED receipt without confirmation language', async () => {
    const receipt = await submitTestRequest(input, {
      ATA_INTEGRATION_MODE: 'test',
      ATA_TEST_REQUESTS_ENABLED: 'true',
      VERCEL_ENV: 'preview',
    })

    expect(receipt.status).toBe('SUBMITTED')
    expect(receipt.testOnly).toBe(true)
    expect(receipt.message).toContain('not a confirmed booking')
    expect(receipt.message).toContain('not')
    expect(receipt.message).not.toMatch(/booking confirmed|reservation confirmed/i)
  })
})

