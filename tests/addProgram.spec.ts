import { test, expect } from './fixtures';

test('Add New Program Test', async ({ loginPage, programPage }) => {
    test.setTimeout(240000);

    await loginPage.navigateToLoginPage();
    await loginPage.login();

    await programPage.navigateToAddProgram();
    await programPage.fillProgramDetails();
    await programPage.fillFeeDetails();
    await programPage.addTaxAndPublish();

    await expect(programPage.page).toHaveURL(/.*\/programs/);
});
