import { expect, test } from '@playwright/test';

test('briefing flow blocks production release without rollback evidence', async ({ page }) => {
  const bffBaseUrl = process.env.COBOLD_API_BASE_URL;
  const appPath = bffBaseUrl ? `/?bffBaseUrl=${encodeURIComponent(bffBaseUrl)}` : '/';

  await page.goto(appPath);

  await expect(page.getByRole('heading', { name: /review readiness matrix/i })).toBeVisible();
  await expect(page.locator('[data-test="system-status"]')).toHaveText('UP');
  await expect(page.locator('[data-test="service-status-bff-nestjs"]')).toContainText('UP');
  await expect(page.locator('[data-test="service-status-be-java"]')).toContainText('UP');

  await page.locator('[data-test="change-title-input"]').fill('Production release without rollback');
  await page.locator('[data-test="change-description-input"]').fill(
    'Deploy a production payment retry fix with test and browser evidence but no rollback path.',
  );
  await page.locator('[data-test="surface-backend"]').check();
  await page.locator('[data-test="surface-bff"]').check();
  await page.locator('[data-test="surface-frontend"]').check();
  await page.locator('[data-test="surface-contract"]').check();
  await page.locator('[data-test="surface-testing"]').check();
  await page.locator('[data-test="evidence-backend-test"]').check();
  await page.locator('[data-test="evidence-bruno-smoke"]').check();
  await page.locator('[data-test="evidence-dps-testautomation"]').check();
  await page.locator('[data-test="evidence-browser-screenshot"]').check();
  await page.locator('[data-test="evidence-hld"]').check();
  await page.locator('[data-test="evidence-lld"]').check();
  await expect(page.locator('[data-test="evidence-rollback"]')).not.toBeChecked();
  await page.locator('[data-test="risk-production"]').check();
  await expect(page.locator('[data-test="evidence-rollback"]')).not.toBeChecked();
  await page.locator('[data-test="request-briefing-button"]').click();

  await expect(page.locator('[data-test="briefing-signal"]')).toHaveText('shield-wall');
  await expect(page.locator('[data-test="missing-evidence"]')).toContainText('rollback');
  await expect(page.locator('[data-test="briefing-stop-condition"]')).toContainText('production');
  await expect(page.locator('[data-test="briefing-stop-condition"]')).toContainText('rollback');
  await expect(page.locator('[data-test="matrix-row-backend"]')).toContainText('covered');
  await expect(page.locator('[data-test="matrix-row-bff"]')).toContainText('covered');
  await expect(page.locator('[data-test="matrix-row-frontend"]')).toContainText('covered');
  await expect(page.locator('[data-test="matrix-row-contract"]')).toContainText('covered');
  await expect(page.locator('[data-test="matrix-row-testing"]')).toContainText('covered');
});
