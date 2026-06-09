import { test, expect } from '@playwright/test';
import { LoginPage, PassPage } from '../pages';

test('Add New Pass Test', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes timeout

    const loginPage = new LoginPage(page);
    const passPage = new PassPage(page);

    // Login first
    await loginPage.navigateToLoginPage();
    await loginPage.login();

    // Add Pass Flow using simple POM methods
    await passPage.navigateToAddPass();
    await passPage.fillPassDetails();
    await passPage.fillFeeDetailsAndPublish();

    // Verify pass was published successfully and redirected to the list
    await expect(page).toHaveURL(/.*\/passes/);
});
