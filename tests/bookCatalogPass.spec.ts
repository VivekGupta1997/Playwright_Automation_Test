import { test, expect } from './fixtures';
import { catalogPage, LoginPage } from '../pages';
import testData from '../testData.json';

test('Book Pass from Catalog Test', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes timeout

    const loginPage = new LoginPage(page);
    const shopPage = new catalogPage(page);

    // Login using default admin credentials from testData
    await loginPage.navigateToLoginPage();
    await loginPage.login(); // defaults to admin credentials from testData.json

    // Navigate to catalog and filter by organization (org filter is part of navigation)
    await shopPage.navigateToCatalog(); // defaults to 'Etrak demo 3'

    // Filter catalog by offering type 'Pass'
    await shopPage.filterByOfferingType('Pass');

    // Select the specific pass 'Membership Recurring'
    await shopPage.selectOffering('Membership Recurring');

    // Search and select user (Test, Nancy)
    await shopPage.searchAndSelectUserAndAddToCart('test', 'Test, Nancy');

    // Checkout and complete order
    await shopPage.checkoutAndCompleteOrder();

    // Return to dashboard
    await shopPage.returnToDashboard();

    // Verify successful booking by checking if URL contains receipt or dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
});
