import { Page } from '@playwright/test';
import { selectCalendarDay, handleConflictDialog, navigateToOfferingsSection, uniqueName } from './helpers';
import testData from '../testData.json';

const D = testData.event;

export class EventPage {
    constructor(readonly page: Page) { }

    async navigateToAddEvent() {
        await navigateToOfferingsSection(this.page, 'Events');
        await this.page.getByRole('link', { name: 'Add Event' }).click();
    }

    async selectOrganization(organization: string = testData.organization) {
        await this.page.locator('#mui-component-select-organization').click();
        await this.page.getByRole('option', { name: organization }).click();
    }

    async fillEventName(namePrefix: string = D.namePrefix) {
        await this.page.getByRole('textbox', { name: 'Name' }).click();
        await this.page.getByRole('textbox', { name: 'Name' }).fill(uniqueName(namePrefix));
    }

    async selectConnectedResource(connectedResource: string = D.connectedResource) {
        await this.page.locator('#mui-component-select-connectedResource').click();
        await this.page.getByRole('option', { name: connectedResource }).click();
    }

    async fillAttendanceLimits(
        maxAttendance: string = D.maxAttendance,
        userTicketLimit: string = D.userTicketLimit,
        familyTicketLimit: string = D.familyTicketLimit
    ) {
        await this.page.locator('input[name="maxAttendance"]').fill(maxAttendance);
        await this.page.locator('input[name="userTicketLimit"]').fill(userTicketLimit);
        await this.page.locator('input[name="familyTicketLimit"]').fill(familyTicketLimit);
    }

    async selectEventDates(eventDateOffset: number = 7, regStartOffset: number = 0, regEndOffset: number = 3) {
        // Event date + duration
        await this.page.getByRole('button', { name: 'Choose date' }).first().click();
        await selectCalendarDay(this.page, eventDateOffset);
        await this.page.getByRole('option', { name: '1 hours', exact: true }).click();
        await this.page.getByRole('option', { name: 'PM' }).click();
        await this.page.getByRole('button', { name: 'Choose time' }).click();
        await this.page.getByRole('option', { name: '5 hours' }).click();
        await this.page.getByRole('option', { name: 'PM' }).click();
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);

        // Registration start date
        await this.page.getByRole('button', { name: 'Choose date' }).nth(1).click();
        await selectCalendarDay(this.page, regStartOffset);
        await this.page.getByRole('button', { name: 'OK' }).click();

        // Registration end date
        await this.page.getByRole('button', { name: 'Choose date', exact: true }).click();
        await selectCalendarDay(this.page, regEndOffset);
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async fillEventDetails(
        organization: string = testData.organization,
        namePrefix: string = D.namePrefix,
        connectedResource: string = D.connectedResource,
        maxAttendance: string = D.maxAttendance,
        userTicketLimit: string = D.userTicketLimit,
        familyTicketLimit: string = D.familyTicketLimit
    ) {
        await this.selectOrganization(organization);
        await this.fillEventName(namePrefix);
        await this.selectConnectedResource(connectedResource);
        await this.fillAttendanceLimits(maxAttendance, userTicketLimit, familyTicketLimit);

        const regStartOffset = Math.floor(Math.random() * 3);
        const regEndOffset = regStartOffset + 1 + Math.floor(Math.random() * 3);
        const eventDateOffset = regEndOffset + 1 + Math.floor(Math.random() * 4);

        await this.selectEventDates(eventDateOffset, regStartOffset, regEndOffset);
        await this.page.getByRole('button', { name: 'Next' }).click();
        await handleConflictDialog(this.page);
    }

    async fillTicketDetailsAndPublish(
        name: string = D.ticket.name,
        amount: string = D.ticket.amount,
        gla: string = D.ticket.gla,
        deferredRevenue: string = D.ticket.deferredRevenue,
        glaAccount: string = D.ticket.glaAccount,
        taxId: string = D.ticket.taxId,
        taxRate: string = D.ticket.taxRate
    ) {
        const ticketNameInput = this.page.getByRole('textbox', { name: 'Ticket Name' });
        await ticketNameInput.click();
        await ticketNameInput.fill(name);

        const amountInput = this.page.getByPlaceholder('Amount');
        await amountInput.click();
        await amountInput.fill(amount);

        await this.page.locator('#mui-component-select-GLA').click();
        await this.page.getByRole('option', { name: gla }).click();

        await this.page.locator('#mui-component-select-selectedDeferredRevenue').click();
        await this.page.getByRole('option', { name: deferredRevenue }).click();

        await this.page.locator('#mui-component-select-glaAccountId').click();
        await this.page.getByRole('option', { name: glaAccount }).click();

        await this.page.locator('#mui-component-select-taxId').click();
        await this.page.getByRole('option', { name: taxId }).click();

        await this.page.locator('input[name="taxRate"]').fill(taxRate);

        await this.page.getByRole('button', { name: 'Publish' }).click();
        await handleConflictDialog(this.page);
    }
}
