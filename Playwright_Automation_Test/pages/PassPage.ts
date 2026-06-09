import { Page, Locator } from '@playwright/test';
import { PassData, FeeData, DEFAULT_PASS_DATA } from '../tests/testData';

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

    async fillPassDetails(data: PassData = {}) {
        const namePrefix = data.namePrefix ?? DEFAULT_PASS_DATA.namePrefix;
        const organization = data.organization ?? DEFAULT_PASS_DATA.organization;
        const passType = data.passType ?? DEFAULT_PASS_DATA.passType;
        const numberPunches = data.numberPunches ?? DEFAULT_PASS_DATA.numberPunches;

        await this.organizationDropdown.click();
        if (organization === 'Etrak demo 3') {
            await this.etrakDemo3Option.click();
        } else {
            await this.page.getByRole('option', { name: organization }).click();
        }

        await this.nameInput.click();
        const timestamp = new Date().getTime();
        await this.nameInput.fill(`${namePrefix} ${timestamp}`);

        await this.passTypeDropdown.click();
        if (passType === 'Punch Pass') {
            await this.punchPassOption.click();
        } else {
            await this.page.getByRole('option', { name: passType }).click();
        }

        await this.numberPunchesInput.click();
        await this.numberPunchesInput.fill(numberPunches);

        await this.nextButton.click();
    }

    async fillFeeDetailsAndPublish(fee: FeeData = {}) {
        const defaultFee = DEFAULT_PASS_DATA.fee;
        const feeName = fee.name ?? defaultFee.name;
        const amount = fee.amount ?? defaultFee.amount;
        const gla = fee.gla ?? defaultFee.gla;
        const deferredRevenue = fee.deferredRevenue ?? defaultFee.deferredRevenue;

        await this.feeNameInput.click();
        await this.feeNameInput.fill(feeName);

        await this.amountInput.click();
        await this.amountInput.fill(amount);

        await this.glaDropdown.click();
        if (gla === 'Gla test') {
            await this.glaTestOption.click();
        } else {
            await this.page.getByRole('option', { name: gla }).click();
        }

        await this.deferredRevenueDropdown.click();
        if (deferredRevenue === 'Deferred Revenue Test KMO') {
            await this.deferredRevenueOption.click();
        } else {
            await this.page.getByRole('option', { name: deferredRevenue }).click();
        }

        await this.publishButton.click();
    }
}

