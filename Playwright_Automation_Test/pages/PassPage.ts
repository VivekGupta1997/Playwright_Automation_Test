import { Page, Locator } from '@playwright/test';

export class PassPage {
    readonly page: Page;

    // Navigation Locators
    readonly offeringsButton: Locator;
    readonly passesButton: Locator;
    readonly addPassLink: Locator;

    // Pass Details Locators
    readonly organizationDropdown: Locator;
    readonly etrakDemo3Option: Locator;
    readonly nameInput: Locator;
    readonly passTypeDropdown: Locator;
    readonly punchPassOption: Locator;
    readonly numberPunchesInput: Locator;
    readonly nextButton: Locator;

    // Fee Details Locators
    readonly feeNameInput: Locator;
    readonly amountInput: Locator;
    readonly glaDropdown: Locator;
    readonly glaTestOption: Locator;
    readonly deferredRevenueDropdown: Locator;
    readonly deferredRevenueOption: Locator;
    readonly publishButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation
        this.offeringsButton = page.getByRole('button', { name: 'Offerings' });
        this.passesButton = page.getByRole('button', { name: 'Passes' });
        this.addPassLink = page.getByRole('link', { name: 'Add Pass' });

        // Pass Details
        this.organizationDropdown = page.locator('#mui-component-select-organization');
        this.etrakDemo3Option = page.getByRole('option', { name: 'Etrak demo 3' });
        this.nameInput = page.getByRole('textbox', { name: 'Name' });
        this.passTypeDropdown = page.locator('#mui-component-select-passType');
        this.punchPassOption = page.getByRole('option', { name: 'Punch Pass' });
        this.numberPunchesInput = page.locator('input[name="numberPunches"]');
        this.nextButton = page.getByRole('button', { name: 'Next' });

        // Fee Details
        this.feeNameInput = page.getByRole('textbox', { name: 'Fee Name' });
        this.amountInput = page.getByPlaceholder('Amount');
        this.glaDropdown = page.locator('#mui-component-select-GLA');
        this.glaTestOption = page.getByRole('option', { name: 'Gla test' });
        this.deferredRevenueDropdown = page.locator('#mui-component-select-selectedDeferredRevenue');
        this.deferredRevenueOption = page.getByRole('option', { name: 'Deferred Revenue Test KMO' });
        this.publishButton = page.getByRole('button', { name: 'Publish' });
    }

    async navigateToAddPass() {
        await this.offeringsButton.click();
        await this.passesButton.click();
        await this.addPassLink.click();
    }

    async fillPassDetails() {
        await this.organizationDropdown.click();
        await this.etrakDemo3Option.click();

        await this.nameInput.click();
        // Use timestamp to avoid conflicts with existing pass names
        const timestamp = new Date().getTime();
        await this.nameInput.fill(`New Pass ${timestamp}`);

        await this.passTypeDropdown.click();
        await this.punchPassOption.click();

        await this.numberPunchesInput.click();
        await this.numberPunchesInput.fill('10');

        await this.nextButton.click();
    }

    async fillFeeDetailsAndPublish() {
        await this.feeNameInput.click();
        await this.feeNameInput.fill('fee');

        await this.amountInput.click();
        await this.amountInput.fill('050');

        await this.glaDropdown.click();
        await this.glaTestOption.click();

        await this.deferredRevenueDropdown.click();
        await this.deferredRevenueOption.click();

        await this.publishButton.click();
    }
}
