import { test } from './fixtures';

test('Add New Program Test', async ({ loginPage, programPage, passPage }) => {
    test.setTimeout(120000); // Increase timeout because of slowMo or complex flows

    await loginPage.navigateToLoginPage();
    await loginPage.login(
        'viveksystemadmin@gmail.com',
        'viveksystemadmin'
    );

    await programPage.navigateToAddProgram();
    await programPage.fillProgramDetails();
    await programPage.fillFeeDetails();
    await programPage.addTaxAndPublish();
    await passPage.navigateToAddPass();
});

