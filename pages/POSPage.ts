import { Page } from '@playwright/test';
import testData from '../testData.json';

export class POSPage {
    constructor(readonly page: Page) { }

    async navigateToPOS() {
        await this.page.getByRole('link', { name: 'Point of Sale' }).or(this.page.getByRole('button', { name: 'Point of Sale' })).first().click();
    }


    async selectOrganization(orgName: string = testData.organization) {
        await this.page.getByLabel('', { exact: true }).click();
        await this.page.getByRole('option', { name: orgName }).click();
        await this.page.getByRole('button', { name: 'directions' }).click();
    }

    async searchAndSelectUser(lastName: string = 'test', fullNameSnippet: string = ', fam') {
        await this.page.getByRole('textbox', { name: 'Search for user by last name' }).click();
        await this.page.getByRole('textbox', { name: 'Search for user by last name' }).fill(lastName);
        await this.page.getByRole('textbox', { name: 'Search for user by last name' }).press('Enter');
        await this.page.getByRole('combobox', { name: 'Select User' }).click();
        await this.page.getByText(fullNameSnippet).or(this.page.getByText('Test, TestUser')).first().click();
    }

    async addFirstFeeToCart() {
        await this.page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-colorPrimary.css-h6l4cr').first().click();
        await this.page.getByRole('button', { name: /-\s*\$/ }).first().click();
    }

    async checkoutAndCompleteOrderWithPayLater() {
        await this.page.getByRole('button', { name: 'cart' }).click();
        await this.page.getByRole('button', { name: 'Check Out' }).click();
        await this.page.getByRole('button', { name: 'Complete Order' }).waitFor({ state: 'visible' });
        const payLaterCheckbox = this.page.getByRole('checkbox', { name: 'Pay Later Allow user to pay' });
        if (await payLaterCheckbox.isVisible()) {
            await payLaterCheckbox.check();
        }
        await this.page.getByRole('button', { name: 'Complete Order' }).click();
    }

    async returnToDashboard() {
        const dashboardBtn = this.page.getByRole('button', { name: 'Dashboard' }).or(this.page.getByLabel('mailbox folders').getByRole('button', { name: 'Dashboard' })).first();
        if (!await dashboardBtn.isVisible()) {
            await this.page.getByRole('button').first().click();
        }
        await dashboardBtn.click();
    }
}
