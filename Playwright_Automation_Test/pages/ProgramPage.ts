import { Page } from '@playwright/test';

export class ProgramPage {
    constructor(readonly page: Page) {}

    async navigateToAddProgram() {
        if (await this.page.getByRole('button', { name: 'Offerings' }).isVisible()) {
            await this.page.getByRole('button', { name: 'Offerings' }).click();
        }
        await this.page.getByRole('link', { name: 'Programs', exact: true }).click();
        await this.page.getByRole('link', { name: 'Add Program' }).click();
    }

    private async selectValidCalendarDay(offset: number) {
        await this.page.waitForSelector('[role="gridcell"]', { state: 'visible' });
        await this.page.waitForTimeout(300); // Wait for open animation

        let cells = this.page.getByRole('gridcell', { disabled: false }).filter({ hasText: /^\d+$/ });

        if (await cells.count() <= offset) {
            const nextMonthBtn = this.page.getByRole('button', { name: /next month/i });
            if (await nextMonthBtn.count() > 0) {
                await nextMonthBtn.click();
                await this.page.waitForTimeout(500); // Wait for transition animation
            }
            cells = this.page.getByRole('gridcell', { disabled: false }).filter({ hasText: /^\d+$/ });
        }

        await cells.nth(offset).click();
    }

    async selectOrganization(organization: string = 'Etrak demo 3') {
        await this.page.locator('#mui-component-select-organization').click();
        await this.page.getByRole('option', { name: organization }).click();
    }

    async fillProgramName(namePrefix: string = 'Etrak demo') {
        await this.page.getByRole('textbox', { name: 'Name' }).click();
        const timestamp = new Date().getTime();
        await this.page.getByRole('textbox', { name: 'Name' }).fill(`${namePrefix} ${timestamp}`);
    }

    async selectConnectedResource(connectedResource: string = 'AM test') {
        await this.page.locator('#mui-component-select-connectedResource').click();
        await this.page.getByRole('option', { name: connectedResource }).click();
    }

    async selectProgramDates(progStartOffset: number = 7, randomStartHour: number = 9, randomEndHour: number = 11, regStartOffset: number = 0, regEndOffset: number = 3) {
        // Choose program date
        await this.page.getByRole('button', { name: 'Choose date' }).first().click();
        await this.selectValidCalendarDay(progStartOffset);

        // Start Hour & PM Option
        await this.page.getByRole('option', { name: `${randomStartHour} hours`, exact: true }).click();
        await this.page.getByRole('option', { name: 'PM' }).click();

        // Close popup
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);

        // Choose program end time
        await this.page.getByRole('button', { name: 'Choose time' }).click();
        await this.page.getByRole('option', { name: `${randomEndHour} hours`, exact: true }).click();
        await this.page.getByRole('option', { name: 'PM' }).click();

        // Close popup
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);

        // Registration Start Date
        await this.page.getByRole('button', { name: 'Choose date' }).nth(1).click();
        await this.selectValidCalendarDay(regStartOffset);
        await this.page.getByRole('button', { name: 'OK' }).click();

        // Registration End Date
        await this.page.getByRole('button', { name: 'Choose date' }).nth(2).click();
        await this.selectValidCalendarDay(regEndOffset);
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async fillMaxAttendance(maxAttendance: string = '10') {
        await this.page.locator('input[name="maxAttendance"]').click();
        await this.page.locator('input[name="maxAttendance"]').fill(maxAttendance);
    }

    async clickNext() {
        await this.page.getByRole('button', { name: 'Next' }).click();
    }

    async fillProgramDetails(
        organization: string = 'Etrak demo 3',
        namePrefix: string = 'Etrak demo',
        connectedResource: string = 'AM test',
        maxAttendance: string = '10'
    ) {
        await this.selectOrganization(organization);
        await this.fillProgramName(namePrefix);
        await this.selectConnectedResource(connectedResource);

        // Date selection offsets
        const regStartOffset = Math.floor(Math.random() * 3);
        const regEndOffset = regStartOffset + 1 + Math.floor(Math.random() * 3);
        const progStartOffset = regEndOffset + 1 + Math.floor(Math.random() * 4);
        const randomStartHour = Math.floor(Math.random() * 11) + 1;
        let randomEndHour = randomStartHour + 1 + Math.floor(Math.random() * 2);
        if (randomEndHour > 12) randomEndHour = 12;

        await this.selectProgramDates(progStartOffset, randomStartHour, randomEndHour, regStartOffset, regEndOffset);
        await this.fillMaxAttendance(maxAttendance);
        await this.clickNext();
    }

    async fillFeeDetails(
        feeName: string = 'fee',
        amount: string = '020',
        gla: string = 'Gla test',
        deferredRevenue: string = 'Deferred Revenue Test KMO',
        glaAccount: string = 'SALES TAX',
        liability: string = '- Liability'
    ) {
        await this.page.getByRole('textbox', { name: 'Fee Name' }).fill(feeName);
        await this.page.getByPlaceholder('Amount').fill(amount);

        // GLA
        await this.page.locator('#mui-component-select-GLA').click();
        await this.page.getByRole('option', { name: gla }).click();

        // Deferred Revenue
        await this.page.locator('#mui-component-select-selectedDeferredRevenue').click();
        await this.page.getByRole('option', { name: deferredRevenue }).click();

        // GLA Account
        await this.page.locator('#mui-component-select-glaAccountId').click();
        await this.page.getByRole('option', { name: glaAccount, exact: true }).click();

        // Liability Dropdown
        let liabilityDropdown = this.page.getByLabel('', { exact: true });
        if (await liabilityDropdown.count() !== 1) {
            liabilityDropdown = this.page.locator('.MuiSelect-select').last();
        }
        await liabilityDropdown.click();
        await this.page.getByRole('option', { name: liability }).click();

        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);

        await this.clickNext();
        await this.page.waitForTimeout(1000);
    }

    async addTaxAndPublish(
        addonName: string = 'adding add on',
        price: string = '20',
        maxNumAvailable: string = '010',
        gla: string = 'Gla test',
        glaAccount: string = ''
    ) {
        let addonNameInput = this.page.getByRole('textbox', { name: /Name/i }).last();
        if (await addonNameInput.count() === 0) {
            addonNameInput = this.page.getByRole('textbox').last();
        }

        if (!(await addonNameInput.isVisible())) {
            const addAddonBtn = this.page.getByRole('button', { name: /Add Add-on|Add Tax/i }).first();
            if (await addAddonBtn.isVisible()) {
                await addAddonBtn.click();
                await this.page.waitForTimeout(500);
            }
        }

        await addonNameInput.fill(addonName);
        
        // GLA Selection
        const addonGlaLabel = this.page.locator('label').filter({ hasText: /^GLA\s*\**$/i }).last();
        await addonGlaLabel.locator('xpath=..').locator('.MuiSelect-select').click();
        await this.page.waitForTimeout(300);
        await this.page.getByRole('option', { name: new RegExp(gla, 'i') }).first().click();
        
        // GLA Account Selection
        const addonGlaAccountLabel = this.page.locator('label').filter({ hasText: /^(Tax\s+)?GLA Account\s*\**$/i }).last();
        await addonGlaAccountLabel.locator('xpath=..').locator('.MuiSelect-select').click();
        await this.page.waitForTimeout(300);
        
        if (glaAccount) {
            await this.page.getByRole('option', { name: new RegExp(glaAccount, 'i') }).first().click();
        } else {
            await this.page.getByRole('option').last().click();
        }
        
        // Price & Max Number
        const priceInput = this.page.locator('label:has-text("Price (USD)")').locator('xpath=..').locator('input');
        await priceInput.fill(price);
        await this.page.locator('input[name="maxNumAvailable"]').fill(maxNumAvailable);
        
        await this.page.getByRole('button', { name: 'Publish' }).click();
    }
}
