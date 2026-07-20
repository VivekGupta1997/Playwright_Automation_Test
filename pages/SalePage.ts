import { Page } from '@playwright/test';
import { selectDropdown, navigateToOfferingsSection, uniqueName } from './helpers';
import testData from '../testData.json';

const D = testData.sale;

export class SalePage {
    constructor(readonly page: Page) { }

    async navigateToAddSale() {
        await navigateToOfferingsSection(this.page, 'Sales');
        await this.page.getByRole('link', { name: 'Add Sale' }).click();
    }

    async selectOrganization(organization: string = testData.organization) {
        await this.page.getByRole('button').nth(2).click();
        await this.page.getByRole('combobox', { name: 'Organization(s)' }).click();
        await this.page.getByRole('option', { name: organization }).click();
    }

    async fillSaleName(namePrefix: string = D.namePrefix) {
        await this.page.getByRole('textbox', { name: 'Name' }).click();
        await this.page.getByRole('textbox', { name: 'Name' }).fill(uniqueName(namePrefix));
    }

    async selectConnectedOfferings(offerings: string[] = D.connectedOfferings) {
        await this.page.locator('#demo-multiple-checkbox').click();
        for (const offering of offerings) {
            await this.page.getByRole('option', { name: offering, exact: offering === 'test' }).click();
        }
        await this.page.locator('.MuiBackdrop-root').click();
    }

    async fillStartingQuantity(quantity: string = D.startingQuantity) {
        await this.page.locator('input[name="startingQuantity"]').fill(quantity);
    }

    async fillSaleDetails(
        organization: string = testData.organization,
        namePrefix: string = D.namePrefix,
        offerings: string[] = D.connectedOfferings,
        quantity: string = D.startingQuantity
    ) {
        await this.selectOrganization(organization);
        await this.fillSaleName(namePrefix);
        await this.selectConnectedOfferings(offerings);
        await this.fillStartingQuantity(quantity);
    }

    async fillFeeDetailsAndPublish(
        feeName: string = D.fee.name,
        amount: string = D.fee.amount,
        gla: string = D.fee.gla,
        glaAccount: string = D.fee.glaAccount,
        taxId: string = D.fee.taxId,
        taxRate: string = D.fee.taxRate,
        clickAddMoreTax: boolean = D.fee.clickAddMoreTax
    ) {
        await this.page.getByRole('textbox', { name: 'Fee Name' }).fill(feeName);
        await this.page.getByPlaceholder('Amount').fill(amount);

        await selectDropdown(this.page, '#mui-component-select-GLA', gla);
        await selectDropdown(this.page, '#mui-component-select-glaAccountId', glaAccount);

        // Tax selection
        await this.page.getByLabel('', { exact: true }).click();
        await this.page.getByRole('option', { name: taxId }).click();

        await this.page.locator('input[name="taxRate"]').dblclick();
        await this.page.locator('input[name="taxRate"]').fill(taxRate);

        if (clickAddMoreTax) {
            await this.page.getByRole('button', { name: 'Add More Tax' }).click();
        }

        await this.page.getByRole('button', { name: 'Publish' }).click();
    }

    async navigateToSaleListView() {
        await this.page.getByRole('link', { name: 'Sale Item List View' }).click();
    }
}
