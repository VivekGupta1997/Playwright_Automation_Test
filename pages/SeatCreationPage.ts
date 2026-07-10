import { Page } from '@playwright/test';
import {
    selectCalendarDay,
    handleConflictDialog,
    navigateToOfferingsSection,
    uniqueName,
} from './helpers';
import testData from '../testData.json';

const D = testData.seatBookingEvent;

/**
 * SeatCreationPage
 * Handles creating an event that has a seat-selection layout (tables, shape, etc.)
 * and publishing it with a ticket.
 */
export class SeatCreationPage {
    constructor(readonly page: Page) { }

    async navigateToAddEvent() {
        await navigateToOfferingsSection(this.page, 'Events');
        await this.page.getByRole('link', { name: 'Add Event' }).click();
    }

    async fillEventDetails(
        organization: string = testData.organization,
        namePrefix: string = D.namePrefix,
        connectedResource: string = D.connectedResource,
        maxAttendance: string = D.maxAttendance,
        userTicketLimit: string = D.userTicketLimit,
        familyTicketLimit: string = D.familyTicketLimit
    ) {
        // Organization
        await this.page.locator('#mui-component-select-organization').click();
        await this.page.getByRole('option', { name: organization }).click();

        // Event name (unique so repeated runs don't collide)
        const nameInput = this.page.getByRole('textbox', { name: 'Name' });
        await nameInput.click();
        await nameInput.fill(uniqueName(namePrefix));

        // Connected resource
        await this.page.locator('#mui-component-select-connectedResource').click();
        await this.page.getByRole('option', { name: connectedResource }).click();

        // Attendance limits
        await this.page.locator('input[name="maxAttendance"]').fill(maxAttendance);
        await this.page.locator('input[name="userTicketLimit"]').fill(userTicketLimit);
        await this.page.locator('input[name="familyTicketLimit"]').fill(familyTicketLimit);

        // Event date (offset 7 days) + duration
        await this.page.getByRole('button', { name: 'Choose date' }).first().click();
        await selectCalendarDay(this.page, 7);
        await this.page.getByRole('option', { name: '3 hours' }).click();
        await this.page.getByRole('option', { name: 'PM' }).click();
        await this.page.getByRole('button', { name: 'Choose time' }).click();
        await this.page.getByRole('option', { name: '5 hours' }).click();
        await this.page.getByRole('option', { name: 'PM' }).click();
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);

        // Registration start date
        await this.page.getByRole('button', { name: 'Choose date' }).nth(1).click();
        await selectCalendarDay(this.page, 1);
        await handleConflictDialog(this.page);
        await this.page.getByRole('button', { name: 'OK' }).click();

        // Registration end date
        await this.page.getByRole('button', { name: 'Choose date', exact: true }).click();
        await selectCalendarDay(this.page, 4);
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async enableSeatSelection() {
        await this.page.getByRole('checkbox', { name: 'Allow Seat Selection?' }).check();
    }

    async createLayout(
        layoutName: string = D.layout.name,
        seatingType: string = D.layout.seatingType,
        numberOfTables: string = D.layout.numberOfTables,
        seatsPerTable: string = D.layout.seatsPerTable,
        tableShape: string = D.layout.tableShape,
        tableToSelect: string = D.layout.tableToSelect
    ) {
        await this.page.getByRole('button', { name: 'Create New Layout' }).click();

        // Layout name
        const layoutInput = this.page.getByRole('textbox', { name: 'Layout Name' });
        await layoutInput.click();
        await layoutInput.fill(layoutName);
        await layoutInput.press('Tab');

        // Seating type (MUI combobox — open with Enter, pick option, confirm with Tab)
        await this.page.getByRole('combobox', { name: 'Seating Type' }).press('Enter');
        await this.page.getByRole('option', { name: seatingType }).press('Enter');
        await this.page.getByRole('combobox', { name: `Seating Type ${seatingType}` }).press('Tab');

        // Table/seat counts
        await this.page.getByRole('textbox', { name: 'Number of Tables' }).fill(numberOfTables);
        await this.page.getByRole('textbox', { name: 'Number of Tables' }).press('Tab');
        await this.page.getByRole('textbox', { name: 'Seats Per Table' }).fill(seatsPerTable);
        await this.page.getByRole('textbox', { name: 'Seats Per Table' }).press('Tab');

        // Table shape
        await this.page.getByRole('radio', { name: tableShape }).check();

        // Generate the layout
        await this.page.getByRole('button', { name: 'Add' }).click();

        // Select the specified table to confirm seat assignment
        await this.page.locator('span').filter({ hasText: tableToSelect }).click();
        await this.page.getByRole('button', { name: 'Seat Confirm' }).click();
    }

    async proceedToTicketStep() {
        await this.page.getByRole('button', { name: 'Next' }).click();
        await handleConflictDialog(this.page);
    }

    async fillTicketAndPublish(
        name: string = D.ticket.name,
        amount: string = D.ticket.amount,
        gla: string = D.ticket.gla,
        deferredRevenue: string = D.ticket.deferredRevenue,
        glaAccount: string = D.ticket.glaAccount,
        taxId: string = D.ticket.taxId,
        taxRate: string = D.ticket.taxRate
    ) {
        await this.page.getByRole('textbox', { name: 'Ticket Name' }).fill(name);
        await this.page.getByPlaceholder('Amount').fill(amount);

        // GLA
        await this.page.locator('#mui-component-select-GLA').click();
        await this.page.getByRole('option', { name: gla }).click();

        // Deferred Revenue
        await this.page.locator('#mui-component-select-selectedDeferredRevenue').click();
        await this.page.getByRole('option', { name: deferredRevenue }).click();

        // GLA Account
        await this.page.locator('#mui-component-select-glaAccountId').click();
        await this.page.getByRole('option', { name: glaAccount }).click();

        // Tax
        await this.page.locator('#mui-component-select-taxId').click();
        await this.page.getByRole('option', { name: taxId }).click();
        await this.page.locator('input[name="taxRate"]').fill(taxRate);

        await this.page.getByRole('button', { name: 'Publish' }).click();
    }
}
