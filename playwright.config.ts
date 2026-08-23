import { defineConfig, devices } from '@playwright/test'

/**
 * Browser test configuration.
 *
 * Proof Ledger specs live in private-proof-ledger/tests/e2e. Specs that need a
 * provisioned ledger database skip themselves unless PROOF_LEDGER_E2E_DB=1, so
 * the suite is still useful on a machine without one.
 */
export default defineConfig({
  testDir: './private-proof-ledger/tests/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: process.env.PROOF_LEDGER_BASE_URL ?? 'http://127.0.0.1:3111',
    trace: 'off',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
    },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
})
