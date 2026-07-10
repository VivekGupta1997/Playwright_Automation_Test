import { test, expect } from '@playwright/test';
import { catalogPage, LoginPage } from '../pages';

test('Purchase Pass Test', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes timeout

    const loginPage = new LoginPage(page);
    const shopPage = new catalogPage(page);

    // Login first
    await loginPage.navigateToLoginPage();
    await loginPage.login();

    // Navigate to catalog and filter by organization
    await shopPage.navigateToCatalog();
    await shopPage.filterCatalogByOrganization('Etrak demo 3');

    // Navigate to offerings and filter by offering type "Pass"
    await shopPage.navigateToOfferings();
    await shopPage.filterByOfferingType('Pass');

    // Select the pass offering
    await shopPage.selectOffering('months membership');

    // Select user and add to cart
    await shopPage.selectUserAndAddToCart('carry, alex');

    // Checkout and complete order
    await shopPage.checkoutAndCompleteOrder();

    // Verify order completion by checking if URL contains receipt or checkout success indication
    await expect(page).toHaveURL(/.*\/receipt/);
});
