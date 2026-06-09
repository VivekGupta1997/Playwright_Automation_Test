import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages';

test('Login Test', async ({ page }) => {
    test.setTimeout(60000); // Set timeout to 60 seconds

    const loginPage = new LoginPage(page);

    // Navigate to the login page
    await loginPage.navigateToLoginPage();
    
    // Perform login action using defaults
    await loginPage.login();

    // Verify successful login
    await expect(page).not.toHaveURL(/.*\/login/);
});

