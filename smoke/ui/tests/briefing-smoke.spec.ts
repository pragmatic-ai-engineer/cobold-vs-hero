import { expect, test } from '@playwright/test';

test('briefing flow renders a sparring signal', async ({ page }) => {
  const bffBaseUrl = process.env.COBOLD_API_BASE_URL;
  const appPath = bffBaseUrl ? `/?bffBaseUrl=${encodeURIComponent(bffBaseUrl)}` : '/';

  await page.goto(appPath);

  await expect(page.getByRole('heading', { name: /turn a risky idea/i })).toBeVisible();
  await expect(page.locator('[data-test="system-status"]')).toHaveText('UP');
  await expect(page.locator('[data-test="service-status-bff-nestjs"]')).toContainText('UP');
  await expect(page.locator('[data-test="service-status-be-java"]')).toContainText('UP');

  await page.locator('[data-test="cobold-concern-input"]').fill(
    'customer status mapping is inconsistent between API and UI',
  );
  await page.locator('[data-test="hero-move-input"]').fill(
    'add a mapper adapter and review targeted tests',
  );
  await page.locator('[data-test="system-mood-input"]').fill('tired');
  await page.locator('[data-test="target-environment-select"]').selectOption('dev');
  await page.locator('[data-test="implementation-complexity-select"]').selectOption('low');
  await page.locator('[data-test="team-experience-select"]').selectOption('senior');
  await page.locator('[data-test="request-briefing-button"]').click();

  await expect(page.locator('[data-test="briefing-signal"]')).toHaveText('sparring');
  await expect(page.locator('[data-test="evidence-prompts"]')).toContainText(
    'acceptance criterion',
  );
});
