import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('user can login', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);

  await page.fill('[name="email"]', 'test@test.test');
  await page.fill('[name="password"]', 'Test111!');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(`${BASE_URL}/`);
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeTruthy();
})

test('user sees validation errors when submitting empty form', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);

  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/login') && resp.status() === 422),
    page.click('button[type="submit"]'),
  ]);

  const errorTestIds = ['email-error', 'password-error'];
  for (const testId of errorTestIds) {
    const errorLocator = page.locator(`[data-testid="${testId}"]`);
    await expect(errorLocator).toBeVisible({ timeout: 5000 });
  }
})