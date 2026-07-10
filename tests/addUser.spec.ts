import { test, expect } from './fixtures';
import testData from '../testData.json';

test('Add New User Test', async ({ loginPage, userPage }) => {
    test.setTimeout(180000);

    await loginPage.navigateToLoginPage();
    await loginPage.login();

    await userPage.navigateToUsersPage();
    await userPage.clickAddUsers();
    await userPage.selectOrganization();
    await userPage.fillUserDetails();
    await userPage.selectRole();
    await userPage.selectDOB();
    await userPage.saveUser();

    await expect(userPage.page).toHaveURL(/.*\/users/);
});

test('Add Family Member Test', async ({ loginPage, userPage }) => {
    test.setTimeout(180000);

    await loginPage.navigateToLoginPage();
    await loginPage.login();

    await userPage.navigateToUsersPage();
    await userPage.filterByOrganization();
    await userPage.viewUserProfile(1);
    await userPage.addFamilyMember(testData.user.familyMember);

    await expect(userPage.page.getByText('Family User Added')).toBeVisible();
});
