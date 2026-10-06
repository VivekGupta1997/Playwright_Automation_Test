import { test, expect } from './fixtures';
import testData from '../testData.json';

test.describe('Login & Authentication Tests', () => {

    test.beforeEach(async ({ loginPage }) => {
        // Navigate to the login page before each test
        await loginPage.navigateToLoginPage();
    });

    test.describe('Valid Login', () => {
        test('should successfully log in with valid credentials', async ({ page, loginPage }) => {
            test.setTimeout(60000);

            // Log in with default admin credentials
            await loginPage.login(
                testData.credentials.admin.username,
                testData.credentials.admin.password
            );

            // Verify successful login by asserting URL redirected away from /login
            await expect(page).not.toHaveURL(/.*\/login/);
        });
    });

    test.describe('Invalid Credentials', () => {
        test('should show error message when logging in with incorrect password', async ({ loginPage }) => {
            test.setTimeout(60000);

            // Submit login with valid username but wrong password
            await loginPage.submitLogin(
                testData.credentials.invalid.wrongPassword.username,
                testData.credentials.invalid.wrongPassword.password
            );

            // Verify user remains on login page and error message is displayed
            await loginPage.expectOnLoginPage();
            await loginPage.expectInvalidCredentialsError(testData.validationMessages.invalidCredentials);
        });

        test('should show error message when logging in with non-existent user', async ({ loginPage }) => {
            test.setTimeout(60000);

            // Submit login with a non-existent account
            await loginPage.submitLogin(
                testData.credentials.invalid.nonExistentUser.username,
                testData.credentials.invalid.nonExistentUser.password
            );

            // Verify user remains on login page and error message is displayed
            await loginPage.expectOnLoginPage();
            await loginPage.expectInvalidCredentialsError(testData.validationMessages.invalidCredentials);
        });
    });

    test.describe('Form Validations', () => {
        test('should show validation errors when submitting empty form', async ({ loginPage }) => {
            test.setTimeout(60000);

            // Click Sign in without entering credentials
            await loginPage.clickSignInButton();

            // Verify both field validation errors appear
            await loginPage.expectEmailError(testData.validationMessages.emailRequired);
            await loginPage.expectPasswordError(testData.validationMessages.passwordRequired);
            await loginPage.expectOnLoginPage();
        });

        test('should show validation error when password is empty', async ({ loginPage }) => {
            test.setTimeout(60000);

            // Fill only username
            await loginPage.fillUsername(testData.credentials.admin.username);
            await loginPage.clickSignInButton();

            // Verify password required validation appears
            await loginPage.expectPasswordError(testData.validationMessages.passwordRequired);
            await loginPage.expectOnLoginPage();
        });

        test('should show validation error when email is empty', async ({ loginPage }) => {
            test.setTimeout(60000);

            // Fill only password
            await loginPage.fillPassword(testData.credentials.admin.password);
            await loginPage.clickSignInButton();

            // Verify email required validation appears
            await loginPage.expectEmailError(testData.validationMessages.emailRequired);
            await loginPage.expectOnLoginPage();
        });

        test('should show validation error for invalid email format', async ({ loginPage }) => {
            test.setTimeout(60000);

            // Submit invalid email format
            await loginPage.submitLogin(
                testData.credentials.invalid.invalidEmailFormat.username,
                testData.credentials.invalid.invalidEmailFormat.password
            );

            // Verify email format validation error appears
            await loginPage.expectEmailError(testData.validationMessages.invalidEmail);
            await loginPage.expectOnLoginPage();
        });
    });
});
