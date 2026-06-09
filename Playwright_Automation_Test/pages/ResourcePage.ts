import { Page } from '@playwright/test';

export class ResourcePage {
    constructor(readonly page: Page) {}

    async navigateToAddResource() {
        if (await this.page.getByRole('button', { name: 'Offerings' }).isVisible()) {
            await this.page.getByRole('button', { name: 'Offerings' }).click();
        }
        await this.page.getByRole('link', { name: 'Resources', exact: true }).or(this.page.getByRole('button', { name: 'Resources' })).first().click();
        await this.page.getByRole('link', { name: 'Add Resource' }).click();
    }

    async selectOrganization(organization: string = 'Etrak demo 3') {
        await this.page.locator('#mui-component-select-organization').click();
        await this.page.getByRole('option', { name: organization }).click();
    }

    async fillResourceName(namePrefix: string = 'resource a') {
        await this.page.getByRole('textbox', { name: 'Name' }).click();
        const timestamp = Date.now();
        await this.page.getByRole('textbox', { name: 'Name' }).fill(`${namePrefix} ${timestamp}`);
    }

    async selectConnectedResource(connectedResource: string = 'hotel landmark') {
        await this.page.locator('#mui-component-select-connectedResource').click();
        await this.page.getByRole('option', { name: connectedResource }).click();
    }

    async clickNext() {
        await this.page.getByRole('button', { name: 'Next' }).click();
    }

    async fillResourceDetails(
        organization: string = 'Etrak demo 3',
        namePrefix: string = 'resource a',
        connectedResource: string = 'hotel landmark'
    ) {
        await this.selectOrganization(organization);
        await this.fillResourceName(namePrefix);
        await this.selectConnectedResource(connectedResource);
        await this.clickNext();
        await this.clickNext();
    }

    async fillFeeDetailsAndPublish(
        fee1: { name: string; amount: string; gla: string; deferredRevenue: string } = {
            name: 'Fee',
            amount: '020',
            gla: 'lost',
            deferredRevenue: 'Deferred Revenue Test KMO',
        },
        fee2: { name: string; frequency: string; amount: string; deferredRevenue: string } = {
            name: 'fee 2',
            frequency: 'Hourly',
            amount: '050',
            deferredRevenue: 'Deferred Revenue Test KMO',
        }
    ) {
        // 1. First Fee
        await this.page.getByRole('textbox', { name: 'Fee Name' }).click();
        await this.page.getByRole('textbox', { name: 'Fee Name' }).fill(fee1.name);

        await this.page.getByPlaceholder('Amount').click();
        await this.page.getByPlaceholder('Amount').fill(fee1.amount);

        await this.page.locator('#mui-component-select-GLA').click();
        await this.page.getByRole('option', { name: fee1.gla }).click();

        await this.page.locator('#mui-component-select-selectedDeferredRevenue').click();
        await this.page.getByRole('option', { name: fee1.deferredRevenue }).click();

        // 2. Add Second Fee
        await this.page.getByRole('button', { name: 'Add Another Fee' }).click();

        await this.page.getByRole('textbox', { name: 'Fee Name' }).last().click();
        await this.page.getByRole('textbox', { name: 'Fee Name' }).last().fill(fee2.name);

        await this.page.getByRole('combobox', { name: 'Once' }).click();
        await this.page.getByRole('option', { name: fee2.frequency }).click();

        await this.page.getByPlaceholder('Amount').last().click();
        await this.page.getByPlaceholder('Amount').last().fill(fee2.amount);

        await this.page.locator('#mui-component-select-selectedDeferredRevenue').last().click();
        await this.page.getByRole('option', { name: fee2.deferredRevenue }).click();

        // 3. Publish and list view
        await this.page.getByRole('button', { name: 'Publish' }).click();
        await this.page.getByRole('link', { name: 'Resource List View' }).click();
    }
}
