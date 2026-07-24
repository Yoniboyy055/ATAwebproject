export type AtaFeatureFlags = {
  flagshipPreview: boolean
  testRequestService: boolean
  livePayments: false
  productionNotifications: false
  customerAccounts: boolean
  publicReviews: boolean
  legacySharedPasswordAdmin: boolean
}

export type AtaEnvironment = Record<string, string | undefined>

function enabled(value: string | undefined) {
  return value === 'true'
}

export function getAtaFeatureFlags(
  env: AtaEnvironment = process.env
): AtaFeatureFlags {
  const testMode =
    env.ATA_INTEGRATION_MODE === 'test' && env.VERCEL_ENV !== 'production'

  return {
    flagshipPreview: testMode && enabled(env.ATA_FLAGSHIP_PREVIEW_ENABLED),
    testRequestService: testMode && enabled(env.ATA_TEST_REQUESTS_ENABLED),
    livePayments: false,
    productionNotifications: false,
    customerAccounts: testMode && enabled(env.ATA_CUSTOMER_ACCOUNTS_ENABLED),
    publicReviews: false,
    legacySharedPasswordAdmin:
      testMode && enabled(env.ATA_LEGACY_ADMIN_ENABLED),
  }
}
