/**
 * Proof Ledger — browser tests.
 *
 * The specs in the first group need only a running server with the ledger
 * environment configured. The specs in the second group also need a
 * provisioned ledger database and are skipped unless PROOF_LEDGER_E2E_DB=1.
 *
 * Credentials come from the environment. Use fictional test values only:
 *
 *   PROOF_LEDGER_OWNER_PASSWORD=… PROOF_LEDGER_VIEWER_PASSWORD=… \
 *   PROOF_LEDGER_BASE_URL=http://127.0.0.1:3111 npx playwright test
 */

import { expect, test } from '@playwright/test'

const OWNER_PASSWORD = process.env.PROOF_LEDGER_OWNER_PASSWORD ?? ''
const VIEWER_PASSWORD = process.env.PROOF_LEDGER_VIEWER_PASSWORD ?? ''
const DB_READY = process.env.PROOF_LEDGER_E2E_DB === '1'

async function signIn(page: import('@playwright/test').Page, password: string) {
  await page.goto('/proof-ledger')
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Continue' }).click()
}

test.describe('entry and exposure', () => {
  test('shows a password-only login with no username or email field', async ({ page }) => {
    await page.goto('/proof-ledger')

    await expect(page.getByRole('heading', { name: 'Proof Ledger' })).toBeVisible()
    await expect(page.getByText('Private Financial Record')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible()

    await expect(page.locator('input[type="email"]')).toHaveCount(0)
    await expect(page.locator('input[name="username"]')).toHaveCount(0)
    await expect(page.getByRole('link', { name: /register|sign up/i })).toHaveCount(0)
  })

  test('is marked noindex, nofollow', async ({ page }) => {
    await page.goto('/proof-ledger')
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots).toContain('noindex')
    expect(robots).toContain('nofollow')
  })

  test('shows no ATA navigation or footer', async ({ page }) => {
    await page.goto('/proof-ledger')
    await expect(page.getByRole('link', { name: /destinations|packages|flights/i })).toHaveCount(0)
    await expect(page.getByText('Amanuel Travel')).toHaveCount(0)
  })

  test('is not linked from the ATA home page and is excluded from robots.txt', async ({
    page,
    request,
  }) => {
    await page.goto('/')
    await expect(page.locator('a[href*="proof-ledger"]')).toHaveCount(0)

    const robots = await request.get('/robots.txt')
    expect((await robots.text()).toLowerCase()).toContain('disallow: /proof-ledger')
  })

  test('rejects an unauthenticated financial write and evidence read', async ({ request }) => {
    const write = await request.post('/api/proof-ledger/transactions', {
      data: {
        type: 'BASE_DEPOSIT',
        date: '2026-08-11',
        amountCents: 50000,
        reason: 'unauthenticated',
        evidenceId: 'none',
      },
    })
    expect(write.status()).toBe(401)

    const evidence = await request.get('/api/proof-ledger/evidence/anything')
    expect(evidence.status()).toBe(401)
  })

  test('rejects an incorrect password', async ({ page }) => {
    await signIn(page, 'definitely-not-the-password')
    await expect(page.getByText('That password was not recognised.')).toBeVisible()
    await expect(page.getByText('signed in as')).toHaveCount(0)
  })
})

test.describe('signed in', () => {
  test.skip(!DB_READY, 'needs a provisioned ledger database (PROOF_LEDGER_E2E_DB=1)')
  test.skip(!OWNER_PASSWORD || !VIEWER_PASSWORD, 'needs test passwords in the environment')

  test('owner sees the summary, withdrawal breakdown and totals block', async ({ page }) => {
    await signIn(page, OWNER_PASSWORD)

    await expect(page.getByText('signed in as OWNER')).toBeVisible()
    await expect(page.getByText('Total Currently Outstanding')).toBeVisible()
    await expect(page.getByText('Original Obligation')).toBeVisible()

    await expect(page.getByText('Withdrawal Totals')).toBeVisible()
    await expect(page.getByText('Total Principal Withdrawn')).toBeVisible()
    await expect(page.getByText('Total Extra Repayment Added').first()).toBeVisible()
    await expect(page.getByText('Total Required Repayment')).toBeVisible()
    await expect(page.getByText('Withdrawal Repayment Remaining')).toBeVisible()
  })

  test('owner can open the add-record flow', async ({ page }) => {
    await signIn(page, OWNER_PASSWORD)
    await expect(page.getByText('Tell Proof Ledger what happened…')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Analyze Record' })).toBeVisible()
  })

  test('withdrawal cards keep principal, extra and required separate', async ({ page }) => {
    await signIn(page, OWNER_PASSWORD)
    const withdrawals = page.locator('#withdrawals')
    await expect(withdrawals.getByText('Amount Withdrawn').first()).toBeVisible()
    await expect(withdrawals.getByText('Extra Repayment Added').first()).toBeVisible()
    await expect(withdrawals.getByText('Required Repayment').first()).toBeVisible()
  })

  test('viewer can read and comment but cannot record a transaction', async ({ page }) => {
    await signIn(page, VIEWER_PASSWORD)

    await expect(page.getByText('signed in as VIEWER')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Analyze Record' })).toHaveCount(0)
    await expect(page.getByText('Total Currently Outstanding')).toBeVisible()

    await page.getByLabel('Note').fill('Please confirm the extra repayment on the last withdrawal.')
    await page.getByRole('button', { name: 'Add Note' }).click()
    await expect(
      page.getByText('Please confirm the extra repayment on the last withdrawal.')
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Mark resolved' })).toHaveCount(0)
  })

  test('owner can resolve a note', async ({ page }) => {
    await signIn(page, OWNER_PASSWORD)
    const resolve = page.getByRole('button', { name: 'Mark resolved' }).first()
    if ((await resolve.count()) > 0) {
      await resolve.click()
      await expect(page.getByText('Resolved').first()).toBeVisible()
    }
  })

  test('statement renders with separate withdrawal totals', async ({ page }) => {
    await signIn(page, OWNER_PASSWORD)
    await page.getByRole('link', { name: 'Print / Save Statement' }).click()
    await expect(page.getByRole('heading', { name: 'Proof Ledger' })).toBeVisible()
    await expect(page.getByText('Withdrawal Totals (historical)')).toBeVisible()
    await expect(page.getByText('Total Extra Repayment Added')).toBeVisible()
  })

  test('evidence is only served to an authenticated session', async ({ page, request }) => {
    await signIn(page, VIEWER_PASSWORD)
    const link = page.getByRole('link', { name: 'View Proof' }).first()
    if ((await link.count()) === 0) test.skip(true, 'no evidence recorded yet')

    const href = await link.getAttribute('href')
    expect(href).toBeTruthy()

    const authorised = await page.request.get(href as string)
    expect(authorised.status()).toBe(200)

    const anonymous = await request.get(href as string, { headers: { cookie: '' } })
    expect([401, 403]).toContain(anonymous.status())
  })

  test('mobile layout stacks into cards without horizontal scroll', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile project only')

    await signIn(page, OWNER_PASSWORD)
    await expect(page.getByText('Withdrawal Totals')).toBeVisible()

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })
})
