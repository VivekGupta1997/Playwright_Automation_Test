import { Page, Locator, expect } from '@playwright/test';
import testData from '../testData.json';

export class LoginPage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly keepMeSignedInCheckbox: Locator;
    readonly emailHelperText: Locator;
    readonly passwordHelperText: Locator;
    readonly generalErrorMessage: Locator;

    constructor(readonly page: Page) {
        this.usernameInput = this.page.getByRole('textbox', { name: 'Email Address / Username' });
        this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
        this.signInButton = this.page.getByRole('button', { name: 'Sign in', exact: true });
        this.keepMeSignedInCheckbox = this.page.locator('input[name="checked"]');
        this.emailHelperText = this.page.locator('#standard-weight-helper-text-email-login');
        this.passwordHelperText = this.page.locator('#standard-weight-helper-text-password-login');
        this.generalErrorMessage = this.page.locator('.MuiFormHelperText-root.Mui-error').filter({ hasText: 'Invalid username or password.' });
    }

    async navigateToLoginPage(url: string = testData.app.loginUrl) {
        await this.page.goto(url);
    }

    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clearUsername() {
        await this.usernameInput.clear();
    }

    async clearPassword() {
        await this.passwordInput.clear();
    }

    async clickSignInButton() {
        await this.signInButton.click();
    }

    async waitForSuccessfulLogin(timeout: number = 30000) {
        await this.page.waitForURL((url) => !url.href.includes('/login'), { waitUntil: 'commit', timeout });
    }

    /**
     * Submit login form without waiting for URL redirect.
     * Suitable for testing invalid credentials and validation states.
     */
    async submitLogin(username?: string, password?: string) {
        if (username !== undefined) {
            await this.fillUsername(username);
        }
        if (password !== undefined) {
            await this.fillPassword(password);
        }
        await this.clickSignInButton();
    }

    /**
     * Submit and wait for redirect (backward compatible with existing test suite).
     */
    async clickSignIn() {
        await this.clickSignInButton();
        await this.waitForSuccessfulLogin();
    }

    /**
     * Perform full login flow with redirect verification.
     */
    async login(
        username: string = testData.credentials.admin.username,
        password: string = testData.credentials.admin.password
    ) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickSignIn();
    }

    // Validation Assertion Helpers
    async expectEmailError(expectedText: string) {
        await expect(this.emailHelperText).toBeVisible();
        await expect(this.emailHelperText).toHaveText(expectedText);
    }

    async expectPasswordError(expectedText: string) {
        await expect(this.passwordHelperText).toBeVisible();
        await expect(this.passwordHelperText).toHaveText(expectedText);
    }

    async expectInvalidCredentialsError(expectedText: string = testData.validationMessages.invalidCredentials) {
        await expect(this.generalErrorMessage).toBeVisible();
        await expect(this.generalErrorMessage).toHaveText(expectedText);
    }

    async expectOnLoginPage() {
        await expect(this.page).toHaveURL(/.*\/login/);
    }
}
