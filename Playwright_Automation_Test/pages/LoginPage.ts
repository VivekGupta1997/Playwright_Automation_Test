import { Page } from '@playwright/test';

export class LoginPage {
    constructor(readonly page: Page) {}

    async navigateToLoginPage() {
        await this.page.goto('https://yellow-plant-07ff7231e.5.azurestaticapps.net/');
    }

    async fillUsername(username: string) {
        await this.page.getByRole('textbox', { name: 'Email Address / Username' }).fill(username);
    }

    async fillPassword(password: string) {
        await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    }

    async clickSignIn() {
        await this.page.getByRole('button', { name: 'Sign in', exact: true }).click();
        // Wait for the login redirection to complete
        await this.page.waitForURL((url) => !url.href.includes('/login'), { timeout: 15000 });
    }

    async login(username: string = 'viveksystemadmin@gmail.com', password: string = 'viveksystemadmin') {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickSignIn();
    }
}
