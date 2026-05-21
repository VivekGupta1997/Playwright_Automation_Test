import { Page, Locator } from '@playwright/test';

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

    async navigateToLoginPage() {
        await this.page.goto('https://yellow-plant-07ff7231e.5.azurestaticapps.net/login');
    }

    async login(username: string, password: string) {
        if (!username || !password) {
            throw new Error('Username and password are required');
        }
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signInButton.click();

        // Wait for the login navigation to complete (wait until URL no longer contains '/login')
        await this.page.waitForURL((url) => !url.href.includes('/login'), { timeout: 15000 });
    }
}
