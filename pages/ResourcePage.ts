import { Page } from '@playwright/test';
import { navigateToOfferingsSection, uniqueName } from './helpers';
import testData from '../testData.json';

const D = testData.resource;

export class ResourcePage {
    constructor(readonly page: Page) { }

    async navigateToAddResource() {
        await navigateToOfferingsSection(this.page, 'Resources');
        await this.page.getByRole('link', { name: 'Add Resource' }).click();
    }

    async selectOrganization(organization: string = testData.organization) {
        await this.page.locator('#mui-component-select-organization').click();
        await this.page.getByRole('option', { name: organization }).click();
    }

    async fillResourceName(namePrefix: string = D.namePrefix) {
        await this.page.getByRole('textbox', { name: 'Name' }).click();
        await this.page.getByRole('textbox', { name: 'Name' }).fill(uniqueName(namePrefix));
    }

    async selectConnectedResource(connectedResource: string = D.connectedResource) {
        await this.page.locator('#mui-component-select-connectedResource').click();
        await this.page.getByRole('option', { name: connectedResource }).click();
    }

    async fillResourceDetails(
        organization: string = testData.organization,
        namePrefix: string = D.namePrefix,
        connectedResource: string = D.connectedResource
    ) {
        await this.selectOrganization(organization);
        await this.fillResourceName(namePrefix);
        await this.selectConnectedResource(connectedResource);
        await this.page.getByRole('button', { name: 'Next' }).click();
        await this.page.getByRole('button', { name: 'Next' }).click();
    }

    async fillFeeDetailsAndPublish(
        fee1: { name: string; amount: string; gla: string; deferredRevenue: string } = D.fee1,
        fee2: { name: string; frequency: string; amount: string; deferredRevenue: string } = D.fee2
    ) {
        // First fee
        await this.page.getByRole('textbox', { name: 'Fee Name' }).click();
        await this.page.getByRole('textbox', { name: 'Fee Name' }).fill(fee1.name);

        await this.page.getByPlaceholder('Amount').click();
        await this.page.getByPlaceholder('Amount').fill(fee1.amount);

        await this.page.locator('#mui-component-select-GLA').click();
        await this.page.getByRole('option', { name: fee1.gla }).click();

        await this.page.locator('#mui-component-select-selectedDeferredRevenue').click();
        await this.page.getByRole('option', { name: fee1.deferredRevenue }).click();

        // Add second fee
        await this.page.getByRole('button', { name: 'Add Another Fee' }).click();

        await this.page.getByRole('textbox', { name: 'Fee Name' }).last().click();
        await this.page.getByRole('textbox', { name: 'Fee Name' }).last().fill(fee2.name);

        await this.page.getByRole('combobox', { name: 'Once' }).click();
        await this.page.getByRole('option', { name: fee2.frequency }).click();

        await this.page.getByPlaceholder('Amount').last().click();
        await this.page.getByPlaceholder('Amount').last().fill(fee2.amount);

        await this.page.locator('#mui-component-select-selectedDeferredRevenue').last().click();
        await this.page.getByRole('option', { name: fee2.deferredRevenue }).click();

        // Publish
        await this.page.getByRole('button', { name: 'Publish' }).click();
        await this.page.getByRole('link', { name: 'Resource List View' }).click();
    }
}
