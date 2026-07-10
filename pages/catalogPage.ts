import { Page } from '@playwright/test';

export class catalogPage {
    constructor(readonly page: Page) { }

    async navigateToCatalog() {
        await this.page.goto('https://www.etrak-recsoftware.com/');
        await this.page.getByRole('button', { name: 'Full Catalog' }).click();
    }

    async filterCatalogByOrganization(orgName: string = 'Etrak demo 3') {
        await this.page.getByRole('button').nth(2).click();
        await this.page.getByRole('combobox', { name: 'Organization(s)' }).click();
        await this.page.getByRole('combobox', { name: 'Organization(s)' }).fill(orgName.slice(0, 2));
        await this.page.getByRole('option', { name: orgName }).click();
        await this.page.getByText(`Organization *${orgName} OfferingsPurchase Gift CertificateShow Upcoming`).click();
    }

    async navigateToOfferings() {
        await this.page.goto('https://www.etrak-recsoftware.com/shop/offerings');
    }

    async filterByOfferingType(typeName: string = 'Pass') {
        await this.page.getByRole('button', { name: 'Filter' }).click();
        await this.page.getByRole('checkbox', { name: typeName }).check();
        await this.page.locator('.MuiBackdrop-root').click();
    }

    async selectOffering(offeringName: string = 'months membership') {
        await this.page.getByRole('img', { name: offeringName }).click();
        await this.page.getByRole('button', { name: 'directions' }).click();
    }

    async selectUserAndAddToCart(userName: string = 'carry, alex') {
        await this.page.getByRole('combobox', { name: 'Select User' }).click();
        await this.page.getByRole('paragraph').filter({ hasText: userName }).click();
        await this.page.getByRole('button', { name: 'Add to Cart - $' }).click();
    }

    async checkoutAndCompleteOrder() {
        await this.page.getByRole('button', { name: 'cart', exact: true }).click();
        await this.page.getByRole('button', { name: 'Check Out' }).click();
        await this.page.getByRole('checkbox', { name: 'Cash Checkout using cash. $' }).check();
        await this.page.getByRole('button', { name: 'Complete Order' }).click();
    }
}
