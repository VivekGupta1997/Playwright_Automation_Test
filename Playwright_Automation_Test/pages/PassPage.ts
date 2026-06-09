import { Page } from '@playwright/test';

export class PassPage {
    constructor(readonly page: Page) {}

    async navigateToAddPass() {
        if (await this.page.getByRole('button', { name: 'Offerings' }).isVisible()) {
            await this.page.getByRole('button', { name: 'Offerings' }).click();
        }
        await this.page.getByRole('link', { name: 'Passes', exact: true }).click();
        await this.page.getByRole('link', { name: 'Add Pass' }).click();
    }

    async selectOrganization(organization: string = 'Etrak demo 3') {
        await this.page.locator('#mui-component-select-organization').click();
        await this.page.getByRole('option', { name: organization }).click();
    }

    async fillPassName(namePrefix: string = 'New Pass') {
        await this.page.getByRole('textbox', { name: 'Name' }).click();
        const timestamp = new Date().getTime();
        await this.page.getByRole('textbox', { name: 'Name' }).fill(`${namePrefix} ${timestamp}`);
    }

    async selectPassType(passType: string = 'Punch Pass') {
        await this.page.locator('#mui-component-select-passType').click();
        await this.page.getByRole('option', { name: passType }).click();
    }

    async fillNumberPunches(numberPunches: string = '10') {
        await this.page.locator('input[name="numberPunches"]').click();
        await this.page.locator('input[name="numberPunches"]').fill(numberPunches);
    }

    async clickNext() {
        await this.page.getByRole('button', { name: 'Next' }).click();
    }

    async fillFeeName(feeName: string = 'fee') {
        await this.page.getByRole('textbox', { name: 'Fee Name' }).click();
        await this.page.getByRole('textbox', { name: 'Fee Name' }).fill(feeName);
    }

    async fillAmount(amount: string = '050') {
        await this.page.getByPlaceholder('Amount').click();
        await this.page.getByPlaceholder('Amount').fill(amount);
    }

    async selectGLA(gla: string = 'Gla test') {
        await this.page.locator('#mui-component-select-GLA').click();
        await this.page.getByRole('option', { name: gla }).click();
    }

    async selectDeferredRevenue(deferredRevenue: string = 'Deferred Revenue Test KMO') {
        await this.page.locator('#mui-component-select-selectedDeferredRevenue').click();
        await this.page.getByRole('option', { name: deferredRevenue }).click();
    }

    async clickPublish() {
        await this.page.getByRole('button', { name: 'Publish' }).click();
    }

    async fillPassDetails(
        organization: string = 'Etrak demo 3',
        namePrefix: string = 'New Pass',
        passType: string = 'Punch Pass',
        numberPunches: string = '10'
    ) {
        await this.selectOrganization(organization);
        await this.fillPassName(namePrefix);
        await this.selectPassType(passType);
        await this.fillNumberPunches(numberPunches);
        await this.clickNext();
    }

    async fillFeeDetailsAndPublish(
        feeName: string = 'fee',
        amount: string = '050',
        gla: string = 'Gla test',
        deferredRevenue: string = 'Deferred Revenue Test KMO'
    ) {
        await this.fillFeeName(feeName);
        await this.fillAmount(amount);
        await this.selectGLA(gla);
        await this.selectDeferredRevenue(deferredRevenue);
        await this.clickPublish();
    }
}
