import { test, expect } from '@playwright/test';
import { LoginPage, UserPage } from '../pages';

test('Add New User Test', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes timeout

    const loginPage = new LoginPage(page);
    const userPage = new UserPage(page);

    // Login first
    await loginPage.navigateToLoginPage();
    await loginPage.login();

    // Add User Flow using simple POM methods
    await userPage.navigateToUsersPage();
    await userPage.clickAddUsers();
    await userPage.selectOrganization();
    await userPage.fillUserDetails();
    await userPage.selectRole();
    await userPage.selectDOB();
    await userPage.saveUser();

    // Verify successful redirection back to users list
    await expect(page).toHaveURL(/.*\/users/);
});
