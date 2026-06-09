import { test, expect } from '@playwright/test';
import { LoginPage, ProgramPage } from '../pages';

test('Add New Program Test', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes timeout

    const loginPage = new LoginPage(page);
    const programPage = new ProgramPage(page);

    // Login first
    await loginPage.navigateToLoginPage();
    await loginPage.login();

    // Add Program Flow using simple POM methods
    await programPage.navigateToAddProgram();
    await programPage.fillProgramDetails();
    await programPage.fillFeeDetails();
    await programPage.addTaxAndPublish();

    // Verify program was published successfully and redirected to the list
    await expect(page).toHaveURL(/.*\/programs/);
});
