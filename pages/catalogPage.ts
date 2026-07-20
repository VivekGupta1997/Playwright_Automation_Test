import { Page } from '@playwright/test';

export class catalogPage {
    constructor(readonly page: Page) { }

    async navigateToCatalog(orgName: string = 'Etrak demo 3') {
        // Step 1: Go to homepage
        await this.page.goto('https://www.etrak-recsoftware.com/');

        // Step 2: Filter by organization on homepage (must happen BEFORE Full Catalog)
        await this.page.getByRole('button').nth(2).click();
        await this.page.getByRole('combobox', { name: 'Organization(s)' }).click();
        await this.page.getByRole('combobox', { name: 'Organization(s)' }).fill(orgName.slice(0, 4));
        await this.page.getByRole('option', { name: orgName }).click();

        // Step 3: Click Full Catalog to enter the catalog page
        await this.page.getByRole('button', { name: 'Full Catalog' }).click();
    }

    async navigateToOfferings() {
        await this.page.goto('https://www.etrak-recsoftware.com/shop/offerings');
    }

    async filterByOfferingType(typeName: string = 'Pass') {
        // Open filter panel
        await this.page.getByRole('button', { name: 'Filter' }).click();

        // Use getByLabel to target the checkbox precisely within the filter panel
        // (avoids accidentally clicking a catalog item with the same name)
        await this.page.getByLabel(typeName).check();

        // Click the Filter button again to toggle/close the panel safely
        // (Escape navigates away; backdrop click crashes; this is the safest close)
        await this.page.getByRole('button', { name: 'Filter' }).click();

        // Wait for filter to apply before proceeding
        await this.page.waitForTimeout(800);
    }

    async selectOffering(offeringName: string = 'Membership Recurring') {
        const imgLocator = this.page.getByRole('img', { name: offeringName });
        const linkLocator = this.page.getByRole('link', { name: offeringName });

        if (await imgLocator.isVisible().catch(() => false)) {
            await imgLocator.click();
        } else {
            await linkLocator.click();
        }
        await this.page.getByRole('button', { name: 'directions' }).click();
    }

    async searchAndSelectUserAndAddToCart(lastName: string, fullName: string) {
        await this.page.getByRole('textbox', { name: 'Search for user by last name' }).click();
        await this.page.getByRole('textbox', { name: 'Search for user by last name' }).fill(lastName);
        await this.page.getByRole('textbox', { name: 'Search for user by last name' }).press('Enter');
        await this.page.getByRole('combobox', { name: 'Select User' }).click();
        await this.page.getByText(fullName).click();
        await this.page.getByRole('button', { name: 'Add to Cart - $' }).click();
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

    async returnToDashboard() {
        await this.page.getByRole('button').first().click();
        await this.page.getByLabel('mailbox folders').getByRole('button', { name: 'Dashboard' }).click();
    }
}
