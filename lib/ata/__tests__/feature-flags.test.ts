import { getAtaFeatureFlags } from '../feature-flags'

describe('ATA feature flags', () => {
  it('defaults every restricted capability to disabled', () => {
    expect(getAtaFeatureFlags({})).toEqual({
      flagshipPreview: false,
      testRequestService: false,
      livePayments: false,
      productionNotifications: false,
      customerAccounts: false,
      publicReviews: false,
      legacySharedPasswordAdmin: false,
    })
  })

  it('allows preview and requests only in explicit non-production test mode', () => {
    const flags = getAtaFeatureFlags({
      ATA_INTEGRATION_MODE: 'test',
      ATA_FLAGSHIP_PREVIEW_ENABLED: 'true',
      ATA_TEST_REQUESTS_ENABLED: 'true',
      VERCEL_ENV: 'preview',
    })

    expect(flags.flagshipPreview).toBe(true)
    expect(flags.testRequestService).toBe(true)
    expect(flags.livePayments).toBe(false)
    expect(flags.productionNotifications).toBe(false)
  })

  it('forces all test capabilities off in Vercel production', () => {
    const flags = getAtaFeatureFlags({
      ATA_INTEGRATION_MODE: 'test',
      ATA_FLAGSHIP_PREVIEW_ENABLED: 'true',
      ATA_TEST_REQUESTS_ENABLED: 'true',
      ATA_CUSTOMER_ACCOUNTS_ENABLED: 'true',
      ATA_LEGACY_ADMIN_ENABLED: 'true',
      VERCEL_ENV: 'production',
    })

    expect(flags.flagshipPreview).toBe(false)
    expect(flags.testRequestService).toBe(false)
    expect(flags.customerAccounts).toBe(false)
    expect(flags.legacySharedPasswordAdmin).toBe(false)
  })
})

