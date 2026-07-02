import { expect, test } from '@playwright/test';

test('briefing flow renders a sparring readiness matrix', async ({ page }) => {
  const bffBaseUrl = process.env.COBOLD_API_BASE_URL;
  const appPath = bffBaseUrl ? `/?bffBaseUrl=${encodeURIComponent(bffBaseUrl)}` : '/';

  await page.goto(appPath);

  await expect(page.getByRole('heading', { name: /review readiness matrix/i })).toBeVisible();
  await expect(page.locator('[data-test="system-status"]')).toHaveText('UP');
  await expect(page.locator('[data-test="service-status-bff-nestjs"]')).toContainText('UP');
  await expect(page.locator('[data-test="service-status-be-java"]')).toContainText('UP');

  await page.locator('[data-test="change-title-input"]').fill('Status panel mapping');
  await page.locator('[data-test="change-description-input"]').fill(
    'Add one backend field, one BFF mapper, and one Angular status panel.',
  );
  await page.locator('[data-test="request-briefing-button"]').click();

  await expect(page.locator('[data-test="briefing-signal"]')).toHaveText('sparring');
  await expect(page.locator('[data-test="missing-evidence"]')).toContainText('bruno-smoke');
  await expect(page.locator('[data-test="missing-evidence"]')).toContainText('browser-screenshot');
  await expect(page.locator('[data-test="review-matrix"]')).toContainText('frontend');
});
