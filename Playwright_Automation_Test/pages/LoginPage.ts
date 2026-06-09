import { Page, Locator } from '@playwright/test';
import { LoginCredentials, DEFAULT_CREDENTIALS, DEFAULT_LOGIN_URL } from '../tests/testData';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByRole('textbox', { name: 'Email Address / Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.signInButton = page.getByRole('button', { name: 'Sign in', exact: true });
    }

    async navigateToLoginPage(url: string = DEFAULT_LOGIN_URL) {
        await this.page.goto(url);
    }

    async login(credentials: LoginCredentials = {}) {
        const username = credentials.username ?? DEFAULT_CREDENTIALS.username;
        const password = credentials.password ?? DEFAULT_CREDENTIALS.password;

        if (!username || !password) {
            throw new Error('Username and password are required for login');
        }
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signInButton.click();

        // Wait for the login navigation to complete (wait until URL no longer contains '/login')
        await this.page.waitForURL((url) => !url.href.includes('/login'), { timeout: 15000 });
    }
}

