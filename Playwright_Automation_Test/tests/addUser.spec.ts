import { test } from './fixtures';

test('Add New User Test', async ({ loginPage, userPage, programPage }) => {
    test.setTimeout(120000); // Increase timeout because of slowMo: 1000

    await loginPage.navigateToLoginPage();
    await loginPage.login(
        'viveksystemadmin@gmail.com',
        'viveksystemadmin'
    );

    // Add User Flow
    await userPage.navigateToUsersPage();
    await userPage.clickAddUsers();
    await userPage.selectOrganization();
    await userPage.fillUserDetails();
    await userPage.selectRole();
    await userPage.selectDOB();
    await userPage.saveUser();

    // Add Program Flow
    await programPage.navigateToAddProgram();
    await programPage.fillProgramDetails();
    await programPage.fillFeeDetails();
    await programPage.addTaxAndPublish();
});
