import { Page } from '@playwright/test';

export class SessionPage {
    constructor(readonly page: Page) {}

    async navigateToAddSession() {
        if (await this.page.getByRole('button', { name: 'Offerings' }).isVisible()) {
            await this.page.getByRole('button', { name: 'Offerings' }).click();
        }
        await this.page.getByRole('link', { name: 'Sessions', exact: true }).click();
        await this.page.getByRole('link', { name: 'Add Session' }).click();
    }

    async selectOrganization(organization: string = 'Etrak demo 3') {
        await this.page.locator('#mui-component-select-organization').click();
        await this.page.getByRole('option', { name: organization }).click();
    }

    async fillSessionName(name: string = 'event 2') {
        await this.page.getByRole('textbox', { name: 'Name' }).click();
        const timestamp = new Date().getTime();
        await this.page.getByRole('textbox', { name: 'Name' }).fill(`${name} ${timestamp}`);
    }

    async fillMaxAttendance(maxAttendance: string = '10') {
        await this.page.locator('input[name="maxAttendance"]').click();
        await this.page.locator('input[name="maxAttendance"]').fill(maxAttendance);
    }

    async clickNext() {
        await this.page.getByRole('button', { name: 'Next' }).click();
    }

    async fillSessionDetails(
        organization: string = 'Etrak demo 3',
        name: string = 'event 2',
        maxAttendance: string = '10'
    ) {
        await this.selectOrganization(organization);
        await this.fillSessionName(name);
        await this.fillMaxAttendance(maxAttendance);
        await this.clickNext();
    }

    private async selectValidCalendarDay(offset: number) {
        await this.page.waitForSelector('[role="gridcell"]', { state: 'visible' });
        await this.page.waitForTimeout(300);
        let cells = this.page.getByRole('gridcell', { disabled: false }).filter({ hasText: /^\d+$/ });
        
        if (await cells.count() <= offset) {
            const nextMonthBtn = this.page.getByRole('button', { name: /next month/i });
            if (await nextMonthBtn.count() > 0) {
                await nextMonthBtn.click();
                await this.page.waitForTimeout(500);
            }
            cells = this.page.getByRole('gridcell', { disabled: false }).filter({ hasText: /^\d+$/ });
        }
        await cells.nth(offset).click();
    }

    async fillScheduleDetails(offset: number = 3, startHour: number = 1, endHour: number = 5) {
        await this.page.getByRole('button', { name: 'Choose date' }).click();
        await this.selectValidCalendarDay(offset);
        await this.page.getByRole('option', { name: `${startHour} hours`, exact: true }).click();
        await this.page.getByRole('option', { name: 'PM' }).click();
        
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
        
        await this.page.getByRole('button', { name: /Choose time/i }).click();
        await this.page.getByRole('option', { name: `${endHour} hours` }).click();
        
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
        
        await this.page.getByRole('button', { name: 'You must click here to' }).click();
        await this.page.waitForTimeout(500);
        
        await this.clickNext();
    }

    async fillFeeDetailsAndPublish(
        feeName: string = 'Fee',
        amount: string = '020',
        gla: string = 'Gla test',
        deferredRevenue: string = 'Deferred Revenue Test KMO',
        taxRate: string = '0.5'
    ) {
        // Fee Name
        await this.page.getByRole('textbox', { name: 'Fee Name' }).fill(feeName);
        
        // Amount
        await this.page.getByPlaceholder('Amount').fill(amount);
        
        // GLA
        await this.page.locator('#mui-component-select-GLA').click();
        await this.page.getByRole('option', { name: gla }).click();
        
        // Deferred Revenue
        await this.page.locator('#mui-component-select-selectedDeferredRevenue').click();
        await this.page.getByRole('option', { name: deferredRevenue }).click();
        
        // Liability Account Selection
        const liabilityDropdown = this.page.locator('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-6 > .css-1n8fa5z > .MuiFormControl-root > .MuiInputBase-root').first();
        await liabilityDropdown.click();
        await this.page.getByRole('option', { name: 'None' }).first().click();
        
        // GLA Account Selection
        await this.page.locator('#mui-component-select-glaAccountId').click();
        await this.page.getByRole('option', { name: 'Sales Tax Liability' }).click();
        
        // Tax Dropdown Selection
        const taxDropdown = this.page.locator('.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-2 > div:nth-child(2) > .css-1n8fa5z > .MuiFormControl-root > .MuiInputBase-root');
        await taxDropdown.click();
        await this.page.getByRole('option', { name: 'Standard Tax' }).click();
        
        // Tax Rate
        await this.page.locator('input[name="taxRate"]').fill(taxRate);
        
        // Publish
        await this.page.getByRole('button', { name: 'Publish' }).click();
    }
}
