import { test } from './fixtures';

test('Add New Pass Test', async ({ loginPage, passPage }) => {
    test.setTimeout(120000); // Increase timeout for complex flows

    await loginPage.navigateToLoginPage();
    await loginPage.login(
        'viveksystemadmin@gmail.com',
        'viveksystemadmin'
    );

    
    await passPage.navigateToAddPass();
    await passPage.fillPassDetails();
    await passPage.fillFeeDetailsAndPublish();
});
