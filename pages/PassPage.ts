import { Page } from '@playwright/test';
import { selectDropdown, navigateToOfferingsSection, uniqueName } from './helpers';
import testData from '../testData.json';

const D = testData.pass;

export class PassPage {
    constructor(readonly page: Page) { }

    async navigateToAddPass() {
        await navigateToOfferingsSection(this.page, 'Passes');
        await this.page.getByRole('link', { name: 'Add Pass' }).click();
    }

    async navigateToPasses() {
        await navigateToOfferingsSection(this.page, 'Passes');
    }

    async selectOrganization(organization: string = testData.organization) {
        await this.page.locator('#mui-component-select-organization').click();
        await this.page.getByRole('option', { name: organization }).click();
    }

    async fillPassName(namePrefix: string = D.namePrefix) {
        await this.page.getByRole('textbox', { name: 'Name' }).click();
        await this.page.getByRole('textbox', { name: 'Name' }).fill(uniqueName(namePrefix));
    }

    async selectPassType(passType: string = D.passType) {
        await this.page.locator('#mui-component-select-passType').click();
        await this.page.getByRole('option', { name: passType }).click();
    }

    async selectPassLevel(passLevel: string = D.passLevel) {
        await this.page.locator('#mui-component-select-familyIndividual').click();
        await this.page.getByRole('option', { name: passLevel }).click();
    }

    async fillNumberPunches(numberPunches: string = D.numberPunches) {
        await this.page.locator('input[name="numberPunches"]').click();
        await this.page.locator('input[name="numberPunches"]').fill(numberPunches);
    }

    async fillPassDetails(
        organization: string = testData.organization,
        namePrefix: string = D.namePrefix,
        passType: string = D.passType,
        passLevel: string = D.passLevel,
        numberPunches: string = D.numberPunches
    ) {
        await this.selectOrganization(organization);
        await this.fillPassName(namePrefix);
        await this.selectPassType(passType);
        await this.selectPassLevel(passLevel);
        await this.fillNumberPunches(numberPunches);
        await this.page.getByRole('button', { name: 'Next' }).click();
    }

    async fillFeeDetailsAndPublish(
        feeName: string = D.fee.name,
        amount: string = D.fee.amount,
        gla: string = D.fee.gla,
        deferredRevenue: string = D.fee.deferredRevenue
    ) {
        await this.page.getByPlaceholder('Name').click();
        await this.page.getByPlaceholder('Name').fill(feeName);

        await this.page.getByPlaceholder('Amount').click();
        await this.page.getByPlaceholder('Amount').fill(amount);

        await selectDropdown(this.page, '#mui-component-select-GLA', gla);
        await selectDropdown(this.page, '#mui-component-select-selectedDeferredRevenue', deferredRevenue);

        await this.page.getByRole('button', { name: 'Publish' }).click();
    }
}
