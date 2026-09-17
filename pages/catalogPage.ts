import { Page } from '@playwright/test';

export class catalogPage {
    constructor(readonly page: Page) { }

    async navigateToCatalog(orgName: string = 'Etrak demo 3') {
        // Direct navigation to the offerings catalog page
        await this.page.goto('https://www.etrak-recsoftware.com/shop/offerings');
        await this.page.waitForLoadState('domcontentloaded');

        // Select organization on shop page if not selected
        const orgField = this.page.getByRole('combobox', { name: /Organization/i }).or(this.page.locator('#mui-component-select-organization')).or(this.page.locator('input[name="organization"]')).first();
        if (await orgField.isVisible({ timeout: 5000 }).catch(() => false)) {
            await orgField.click();
            const option = this.page.getByRole('option', { name: orgName });
            if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
                await option.click();
            } else {
                await this.page.keyboard.type(orgName.slice(0, 4));
                await this.page.getByRole('option', { name: orgName }).first().click();
            }
        }
        await this.page.waitForTimeout(1000);
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
        const searchInput = this.page.getByPlaceholder('Search Product');
        if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await searchInput.fill(offeringName);
            await searchInput.press('Enter');
            await this.page.waitForTimeout(800);
        }

        const item = this.page.getByText(offeringName, { exact: false }).first();
        await item.click();

        const directionsBtn = this.page.getByRole('button', { name: 'directions' });
        if (await directionsBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await directionsBtn.click();
        }
    }

    async searchAndSelectUserAndAddToCart(lastName: string, fullName: string) {
        await this.page.getByRole('textbox', { name: 'Search for user by last name' }).click();
        await this.page.getByRole('textbox', { name: 'Search for user by last name' }).fill(lastName);
        await this.page.getByRole('textbox', { name: 'Search for user by last name' }).press('Enter');
        await this.page.getByRole('combobox', { name: 'Select User' }).click();
        await this.page.getByText(fullName).click();
        await this.page.getByRole('button', { name: 'Add to Cart - $' }).click();
    }

    async searchAndSelectUserWithPricingAndAddToCart(
        lastName: string,
        fullName: string,
        pricingLabel: string = '$60.00'
    ) {
        await this.page.getByRole('textbox', { name: 'Search for user by last name' }).click();
        await this.page.getByRole('textbox', { name: 'Search for user by last name' }).fill(lastName);
        await this.page.getByRole('textbox', { name: 'Search for user by last name' }).press('Enter');
        await this.page.getByRole('combobox', { name: 'Select User' }).click();
        await this.page.getByRole('paragraph').filter({ hasText: fullName }).click();

        // Select pricing option (programs may have multiple fee tiers)
        await this.page.getByRole('button', { name: pricingLabel }).click();

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
