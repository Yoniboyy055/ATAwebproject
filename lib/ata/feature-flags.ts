export type AtaFeatureFlags = {
  flagshipPreview: boolean
  testRequestService: boolean
  livePayments: false
  productionNotifications: false
  customerAccounts: boolean
  publicReviews: boolean
  legacySharedPasswordAdmin: boolean
  stagingAdmin: boolean
  stagingPersistence: boolean
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
  const wp04vPreview =
    env.VERCEL_ENV === 'preview' &&
    env.VERCEL_GIT_COMMIT_REF ===
      'codex/ata-wp04v-visible-experience-preview'
  return {
    flagshipPreview:
      wp04vPreview || (testMode && enabled(env.ATA_FLAGSHIP_PREVIEW_ENABLED)),
    testRequestService:
      wp04vPreview || (testMode && enabled(env.ATA_TEST_REQUESTS_ENABLED)),
    livePayments: false,
    productionNotifications: false,
    customerAccounts: testMode && enabled(env.ATA_CUSTOMER_ACCOUNTS_ENABLED),
    publicReviews: false,
    legacySharedPasswordAdmin:
      testMode && enabled(env.ATA_LEGACY_ADMIN_ENABLED),
    stagingAdmin:
      wp04vPreview || (testMode && enabled(env.ATA_STAGING_ADMIN_ENABLED)),
    stagingPersistence:
      testMode && enabled(env.ATA_STAGING_PERSISTENCE_ENABLED),
  }
}
