import { test, expect } from './fixtures';
import { catalogPage, LoginPage } from '../pages';

test('Book Program from Catalog Test', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes timeout

    const loginPage = new LoginPage(page);
    const shopPage = new catalogPage(page);

    // Login using default admin credentials from testData
    await loginPage.navigateToLoginPage();
    await loginPage.login();

    // Navigate to catalog and filter by organization
    await shopPage.navigateToCatalog();

    // Filter catalog by offering type 'Program'
    await shopPage.filterByOfferingType('Program');

    // Select the specific program 'New Program'
    await shopPage.selectOffering('New Program');

    // Search user, select "More, Steven", pick $60.00 pricing, and add to cart
    await shopPage.searchAndSelectUserWithPricingAndAddToCart(
        'test',
        'More, Steven',
        '$60.00'
    );

    // Checkout and complete order with cash
    await shopPage.checkoutAndCompleteOrder();

    // Return to dashboard
    await shopPage.returnToDashboard();

    // Verify navigation back to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
});
