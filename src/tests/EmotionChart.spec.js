import { test, expect } from '@playwright/test';

test.describe('EmotionChart Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('authToken', 'fake-jwt-token-for-test');
    });

    await page.route('**/emotions', async (route, request) => {
      if (request.headers()['authorization'] !== 'Bearer fake-jwt-token-for-test') {
        return route.fulfill({ status: 401, json: { success: false, message: 'Unauthorized' } });
      }
      await route.fulfill({
        json: [
          { id: 17, name: 'Happy', media: [{ file_path: 'happy.svg' }] },
          { id: 18, name: 'Fine', media: [{ file_path: 'fine.svg' }] },
          { id: 19, name: 'Ok', media: [{ file_path: 'ok.svg' }] },
          { id: 20, name: 'Sad', media: [{ file_path: 'sad.svg' }] },
          { id: 21, name: 'Angry', media: [{ file_path: 'angry.svg' }] }
        ]
      });
    });

    await page.route('**/emotion-logs', async (route) => {
      await route.fulfill({
        json: { data: [], last_page: 1 }
      });
    });

    await page.route('**/emotion-logs', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 201, json: { success: true } })
      }
    });

    await page.goto('/');
  });

  test('loads emotions and displays buttons', async ({ page }) => {
    await expect(page.locator('[data-testid="17"]')).toBeVisible();
    await expect(page.locator('[data-testid="18"]')).toBeVisible();
    await expect(page.locator('[data-testid="19"]')).toBeVisible();
    await expect(page.locator('[data-testid="20"]')).toBeVisible();
    await expect(page.locator('[data-testid="21"]')).toBeVisible();
  });

  test('creates emotion log on click', async ({ page }) => {
    let created = false;

    await page.route('**/emotion-logs', async (route) => {
      if (route.request().method() === 'POST') {
        created = true;
        await route.fulfill({ status: 201, json: { success: true } });
      }
    });

    await page.click('[data-testid="17"]');
    expect(created).toBeTruthy();
  });

  test('opens modal and filters logs', async ({ page }) => {
    await page.click('[data-testid="open-modal"]');
    await page.click('text=За последние 7 дней');
    await expect(page.locator('[data-testid="pill"]').first()).toBeVisible();
  });

  test('navigates to all emotion logs page', async ({ page }) => {
    await page.click('[data-testid="open-modal"]');
    await page.click('text=Открыть все записи');
    await expect(page).toHaveURL(/emotion-logs/);
  });
});