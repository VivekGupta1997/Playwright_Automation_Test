import { Page } from '@playwright/test';
import testData from '../testData.json';

const D = testData.seatBookingEvent;

/**
 * SeatBookingPage
 * Handles finding a seat-selection event in the catalog and booking seats for a user.
 *
 * Flow:
 *   1. navigateToFullCatalog  — Offerings → Full Catalog, filter by org
 *   2. openEventOffering      — Go directly to the event offering page by ID
 *   3. fillQuantity           — Set ticket quantity via the spinbutton
 *   4. checkoutWithCash       — Cart → Checkout → Cash → Complete Order
 */
export class SeatBookingPage {
    constructor(readonly page: Page) { }

    /**
     * Navigates to the full catalog and applies the organization filter.
     */
    async navigateToFullCatalog(
        orgSearchText: string = D.booking.orgSearchText
    ) {
        await this.page.getByRole('button', { name: 'Offerings' }).click();
        await this.page.getByRole('button', { name: 'Full Catalog' }).click();

        // Open the org selector, dismiss the initial dropdown, then type to filter
        await this.page.getByLabel('', { exact: true }).click();
        await this.page.locator('.MuiBackdrop-root.MuiBackdrop-invisible').click();
        await this.page.getByRole('combobox', { name: 'Organization(s)' }).fill(orgSearchText);
    }

    /**
     * Navigates directly to the event offering page by its ID stored in testData.json.
     * Update seatBookingEvent.booking.eventOfferingId in testData.json to point to a different event.
     */
    async openEventOffering(
        eventOfferingId: string = D.booking.eventOfferingId
    ) {
        await this.page.goto(
            `${testData.app.baseUrl}/shop/offering-details/events/${eventOfferingId}`
        );
    }

    /**
     * Fills the ticket quantity on the event offering page.
     */
    async fillQuantity(quantity: string = D.booking.quantity) {
        await this.page.getByRole('spinbutton').fill(quantity);
    }

    /**
     * Completes cash checkout from the cart.
     */
    async checkoutWithCash() {
        await this.page.getByRole('button', { name: 'cart' }).click();
        await this.page.getByRole('button', { name: 'Check Out' }).click();
        await this.page.getByRole('checkbox', { name: 'Cash Checkout using cash. $' }).check();
        await this.page.getByRole('button', { name: 'Complete Order' }).click();
    }
}
