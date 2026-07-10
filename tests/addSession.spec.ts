import { test, expect } from './fixtures';

test('Add New Session Test', async ({ loginPage, sessionPage }) => {
    test.setTimeout(240000);

    await loginPage.navigateToLoginPage();
    await loginPage.login();

    await sessionPage.navigateToAddSession();
    await sessionPage.fillSessionDetails();
    await sessionPage.fillScheduleDetails();
    await sessionPage.fillFeeDetailsAndPublish();

    await expect(sessionPage.page).toHaveURL(/.*\/sessions/);
});
