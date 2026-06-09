import { test, expect } from './fixtures';
import { DEFAULT_USER_DATA } from './testData';

test('Add New User Test', async ({ userPage }) => {
    test.setTimeout(90000); // 90 seconds timeout for standard flow

    // Add User Flow
    await userPage.navigateToUsersPage();
    await userPage.clickAddUsers();
    await userPage.selectOrganization(DEFAULT_USER_DATA.organization);
    await userPage.fillUserDetails(DEFAULT_USER_DATA);
    await userPage.selectRole(DEFAULT_USER_DATA.role);
    await userPage.selectDOB(DEFAULT_USER_DATA.dob);
    await userPage.saveUser();

    // Verify successful redirection back to users list
    await expect(userPage.page).toHaveURL(/.*\/users/);
});

