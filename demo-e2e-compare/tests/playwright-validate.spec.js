import { test, expect } from '@playwright/test';

test('validasi form login - input kosong', async ({ page }) => {

    try {
            await page.goto('http://localhost:4200');
            await page.click('button');

            await expect(page.locator('.error-message')).toHaveText(/Email is required/i);
            await expect(page.locator('.error-message')).toHaveText(/Password is required/i);
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await browser.close();
    }

});
