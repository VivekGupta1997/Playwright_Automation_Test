import { test, expect } from '@playwright/test';
import { LoginPage, SessionPage } from '../pages';

test('Add New Session Test', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes timeout

    const loginPage = new LoginPage(page);
    const sessionPage = new SessionPage(page);

    // Login first
    await loginPage.navigateToLoginPage();
    await loginPage.login();

    // Add Session Flow using simple POM methods
    await sessionPage.navigateToAddSession();
    await sessionPage.fillSessionDetails();
    await sessionPage.fillScheduleDetails();
    await sessionPage.fillFeeDetailsAndPublish();

    // Click on Session List View and verify we are redirected back to the sessions list
    await page.getByRole('link', { name: 'Session List View' }).click();
    await expect(page).toHaveURL(/.*\/sessions/);
});
