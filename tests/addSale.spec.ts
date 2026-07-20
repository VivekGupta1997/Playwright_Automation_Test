import { test, expect } from './fixtures';

test('Add New Sale Item Test', async ({ loginPage, salePage }) => {
    test.setTimeout(240000);

    await loginPage.navigateToLoginPage();
    await loginPage.login();

    await salePage.navigateToAddSale();
    await salePage.fillSaleDetails();
    await salePage.fillFeeDetailsAndPublish();
    await salePage.navigateToSaleListView();

    await expect(salePage.page).toHaveURL(/.*\/sales/);
});
