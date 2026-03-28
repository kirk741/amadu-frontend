import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('user can register with all data', async ({ page }) => {
  await page.goto(`${BASE_URL}/register`);

  const randomEmail = `test${Date.now()}@test.test`;

  await page.fill('[name="name"]', 'Test User');
  await page.fill('[name="email"]', randomEmail);
  await page.fill('[name="password"]', 'Test111!');
  await page.fill('[name="password_confirmation"]', 'Test111!');
  await page.fill('[name="bio"]', 'Тестовый пользователь');
  const filePath = 'src/tests/fixtures/avatar.jpg';
  await page.setInputFiles('[name="avatar"]', filePath);

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(`${BASE_URL}/`);
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeTruthy();
})

test('user sees validation errors when submitting empty form', async ({ page }) => {
  await page.goto(`${BASE_URL}/register`);

  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/auth/register') && resp.status() === 422),
    page.click('button[type="submit"]'),
  ]);

  const errorTestIds = ['name-error', 'email-error', 'password-error'];

  for (const testId of errorTestIds) {
    const errorLocator = page.locator(`[data-testid="${testId}"]`);
    await expect(errorLocator).toBeVisible({ timeout: 5000 });
  }
});