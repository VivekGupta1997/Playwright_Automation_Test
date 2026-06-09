import { test, expect } from './fixtures';
import { DEFAULT_USER_DATA, DEFAULT_PROGRAM_DATA, DEFAULT_PASS_DATA } from './testData';

test.describe('End-to-End User Offerings Management Flow', () => {
    
    test('Should successfully perform consecutive admin tasks: add user, add program, and add pass', async ({ userPage, programPage, passPage }) => {
        test.setTimeout(300000); // 5-minute timeout for complete sequential flow

        // 1. Add User Flow
        await userPage.navigateToUsersPage();
        await userPage.clickAddUsers();
        await userPage.selectOrganization(DEFAULT_USER_DATA.organization);
        await userPage.fillUserDetails(DEFAULT_USER_DATA);
        await userPage.selectRole(DEFAULT_USER_DATA.role);
        await userPage.selectDOB(DEFAULT_USER_DATA.dob);
        await userPage.saveUser();
        await expect(userPage.page).toHaveURL(/.*\/users/);

        // 2. Add Program Flow
        await programPage.navigateToAddProgram();
        await programPage.fillProgramDetails(DEFAULT_PROGRAM_DATA);
        await programPage.fillFeeDetails(DEFAULT_PROGRAM_DATA.fee);
        await programPage.addTaxAndPublish(DEFAULT_PROGRAM_DATA.tax);
        await expect(programPage.page).toHaveURL(/.*\/programs/);

        // 3. Add Pass Flow
        await passPage.navigateToAddPass();
        await passPage.fillPassDetails(DEFAULT_PASS_DATA);
        await passPage.fillFeeDetailsAndPublish(DEFAULT_PASS_DATA.fee);
        await expect(passPage.page).toHaveURL(/.*\/passes/);
    });
});
