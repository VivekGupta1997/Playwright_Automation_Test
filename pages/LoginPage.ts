import { Page } from '@playwright/test';
import testData from '../testData.json';

export class LoginPage {
    constructor(readonly page: Page) { }

    async navigateToLoginPage() {
        await this.page.goto(testData.app.loginUrl);
    }

    async fillUsername(username: string) {
        await this.page.getByRole('textbox', { name: 'Email Address / Username' }).fill(username);
    }

    async fillPassword(password: string) {
        await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    }

    async clickSignIn() {
        await this.page.getByRole('button', { name: 'Sign in', exact: true }).click();
        await this.page.waitForURL((url) => !url.href.includes('/login'), { waitUntil: 'commit', timeout: 30000 });
    }

    async login(
        username: string = testData.credentials.admin.username,
        password: string = testData.credentials.admin.password
    ) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickSignIn();
    }
}
