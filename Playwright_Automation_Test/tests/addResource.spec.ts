import { test, expect } from '@playwright/test';
import { LoginPage, ResourcePage } from '../pages';

test('Add New Resource Test', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes timeout

    const loginPage = new LoginPage(page);
    const resourcePage = new ResourcePage(page);

    // Login first
    await loginPage.navigateToLoginPage();
    await loginPage.login();

    // Add Resource Flow using simple POM methods
    await resourcePage.navigateToAddResource();
    await resourcePage.fillResourceDetails();
    await resourcePage.fillFeeDetailsAndPublish();

    // Verify redirection to Resource List View
    await expect(page).toHaveURL(/.*\/resources/);
});
