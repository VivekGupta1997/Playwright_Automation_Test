import { test, expect } from './fixtures';

test('Login Test', async ({ page, loginPage }) => {
    test.setTimeout(60000); // Set timeout to 60 seconds

    // Navigate to the login page
    await loginPage.navigateToLoginPage();
    
    // Perform login action
    await loginPage.login(
        'viveksystemadmin@gmail.com',
        'viveksystemadmin'
    );

    // Verify successful login
    // The login method already waits for the URL to change, so we can assert that we are no longer on the login page
    await expect(page).not.toHaveURL(/.*\/login/);
});
