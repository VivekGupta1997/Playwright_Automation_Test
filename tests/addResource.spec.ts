import { test, expect } from './fixtures';

test('Add New Resource Test', async ({ loginPage, resourcePage }) => {
    test.setTimeout(240000);

    await loginPage.navigateToLoginPage();
    await loginPage.login();

    await resourcePage.navigateToAddResource();
    await resourcePage.fillResourceDetails();
    await resourcePage.fillFeeDetailsAndPublish();

    await expect(resourcePage.page).toHaveURL(/.*\/resources/);
});
