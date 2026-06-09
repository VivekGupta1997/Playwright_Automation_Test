import { Page } from '@playwright/test';

export class EventPage {
    constructor(readonly page: Page) {}

    async navigateToAddEvent() {
        if (await this.page.getByRole('button', { name: 'Offerings' }).isVisible()) {
            await this.page.getByRole('button', { name: 'Offerings' }).click();
        }
        await this.page.getByRole('link', { name: 'Events', exact: true }).or(this.page.getByRole('button', { name: 'Events' })).first().click();
        await this.page.getByRole('link', { name: 'Add Event' }).click();
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

    async fillEventName(namePrefix: string = 'Event game') {
        await this.page.getByRole('textbox', { name: 'Name' }).click();
        await this.page.getByRole('textbox', { name: 'Name' }).fill(`${namePrefix} ${Date.now()}`);
    }

    async selectConnectedResource(connectedResource: string = 'Avant') {
        await this.page.locator('#mui-component-select-connectedResource').click();
        await this.page.getByRole('option', { name: connectedResource }).click();
    }

    async fillAttendanceLimits(maxAttendance: string = '20', userTicketLimit: string = '4', familyTicketLimit: string = '6') {
        await this.page.locator('input[name="maxAttendance"]').fill(maxAttendance);
        await this.page.locator('input[name="userTicketLimit"]').fill(userTicketLimit);
        await this.page.locator('input[name="familyTicketLimit"]').fill(familyTicketLimit);
    }

    async selectEventDates(eventDateOffset: number = 7, regStartOffset: number = 0, regEndOffset: number = 3) {
        // 1. Choose Event Date and duration
        await this.page.getByRole('button', { name: 'Choose date' }).first().click();
        await this.selectValidCalendarDay(eventDateOffset);
        await this.page.getByRole('option', { name: '1 hours', exact: true }).click();
        await this.page.getByRole('option', { name: 'PM' }).click();
        await this.page.getByRole('button', { name: 'Choose time' }).click();
        await this.page.getByRole('option', { name: '5 hours' }).click();
        await this.page.getByRole('option', { name: 'PM' }).click();
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);

        // 2. Choose Registration Start Date
        await this.page.getByRole('button', { name: 'Choose date' }).nth(1).click();
        await this.selectValidCalendarDay(regStartOffset);
        await this.page.getByRole('button', { name: 'OK' }).click();

        // 3. Choose Registration End Date
        await this.page.getByRole('button', { name: 'Choose date', exact: true }).click();
        await this.selectValidCalendarDay(regEndOffset);
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async clickNext() {
        await this.page.getByRole('button', { name: 'Next' }).click();
    }

    async handleConflictDialog() {
        const doubleBookBtn = this.page.getByRole('button', { name: 'Double Book Resources?' });
        try {
            await doubleBookBtn.waitFor({ state: 'visible', timeout: 5000 });
            await doubleBookBtn.click();
        } catch (e) {
            // No conflict dialog
        }
    }

    async fillEventDetails(
        organization: string = 'Etrak demo 3',
        namePrefix: string = 'Event game',
        connectedResource: string = 'Avant',
        maxAttendance: string = '20',
        userTicketLimit: string = '4',
        familyTicketLimit: string = '6'
    ) {
        await this.selectOrganization(organization);
        await this.fillEventName(namePrefix);
        await this.selectConnectedResource(connectedResource);
        await this.fillAttendanceLimits(maxAttendance, userTicketLimit, familyTicketLimit);

        // Date selection: Registration Start < Registration End < Event Date
        const regStartOffset = Math.floor(Math.random() * 3);
        const regEndOffset = regStartOffset + 1 + Math.floor(Math.random() * 3);
        const eventDateOffset = regEndOffset + 1 + Math.floor(Math.random() * 4);

        await this.selectEventDates(eventDateOffset, regStartOffset, regEndOffset);
        await this.clickNext();
        await this.handleConflictDialog();
    }

    async fillTicketDetailsAndPublish(
        name: string = 'fee',
        amount: string = '020',
        gla: string = 'Gla test',
        deferredRevenue: string = 'Deferred Revenue Test KMO',
        glaAccount: string = 'County Tax',
        taxId: string = 'Standard Tax',
        taxRate: string = '0.5'
    ) {
        // Ticket Details
        await this.page.getByRole('textbox', { name: 'Ticket Name' }).fill(name);
        await this.page.getByPlaceholder('Amount').fill(amount);

        // Select GLA
        await this.page.locator('#mui-component-select-GLA').click();
        await this.page.getByRole('option', { name: gla }).click();

        // Select Deferred Revenue
        await this.page.locator('#mui-component-select-selectedDeferredRevenue').click();
        await this.page.getByRole('option', { name: deferredRevenue }).click();

        // Select GLA Account (Tax)
        await this.page.locator('#mui-component-select-glaAccountId').click();
        await this.page.getByRole('option', { name: glaAccount }).click();

        // Select Tax ID
        await this.page.locator('#mui-component-select-taxId').click();
        await this.page.getByRole('option', { name: taxId }).click();

        // Fill Tax Rate
        await this.page.locator('input[name="taxRate"]').fill(taxRate);

        // Publish and return
        await this.page.getByRole('button', { name: 'Publish' }).click();
        await this.page.getByRole('link', { name: 'Event List View' }).click();
    }
}
