import { test, expect } from './fixtures';

test('Add New Pass Test', async ({ loginPage, passPage }) => {
    test.setTimeout(240000);

    await loginPage.navigateToLoginPage();
    await loginPage.login();

    await passPage.navigateToAddPass();
    await passPage.fillPassDetails();
    await passPage.fillFeeDetailsAndPublish();

    await expect(passPage.page).toHaveURL(/.*\/passes/);
});
