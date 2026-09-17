import { Page } from '@playwright/test';
import testData from '../testData.json';

const D = testData.seatBookingEvent;

export interface UserOption {
    lastName: string;
    fullName: string;
}

/**
 * SeatBookingPage
 * Page Object model for seat booking flows in Etrak.
 * Handles finding seat events, dynamic user selection based on seat availability,
 * ticket limit checking, seat selection, and cash checkout.
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

        await this.page.getByLabel('', { exact: true }).click();
        await this.page.locator('.MuiBackdrop-root.MuiBackdrop-invisible').click();
        await this.page.getByRole('combobox', { name: 'Organization(s)' }).fill(orgSearchText);
    }

    /**
     * Navigates directly to the event offering page by its ID stored in testData.json.
     */
    async openEventOffering(
        eventOfferingId: string = D.booking.eventOfferingId
    ) {
        await this.page.goto(
            `${testData.app.baseUrl}/shop/offering-details/events/${eventOfferingId}`
        );
    }

    /**
     * Finds and opens the seat selection event page starting from the homepage.
     */
    async selectSeatEvent(
        orgName: string = testData.organization,
        eventName: string = 'Etrak demo 3 Event with seat'
    ) {
        await this.page.goto(testData.app.baseUrl);
        await this.page.getByRole('button', { name: 'Offerings' }).click();
        await this.page.getByRole('button').nth(2).click();
        await this.page.getByRole('combobox', { name: 'Organization(s)' }).click();
        await this.page.getByRole('combobox', { name: 'Organization(s)' }).fill(orgName.slice(0, 3));
        await this.page.getByRole('option', { name: orgName }).click();
        await this.page.getByRole('button', { name: 'Events' }).click();
        await this.page.getByText(eventName).click();
        await this.page.getByRole('link', { name: 'Add Event' }).click();
    }

    /**
     * Checks if a ticket limit error banner or seat unavailable message is present.
     * Example: "2 tickets will put More, Steven || - 0 over the ticket limit. They have 0 tickets left."
     */
    async isTicketLimitExceeded(): Promise<boolean> {
        const errorAlert = this.page.locator('.MuiAlert-root, [role="alert"]').filter({
            hasText: /over the ticket limit|tickets left|ticket limit|no seats available/i
        });
        const textError = this.page.getByText(/over the ticket limit|0 tickets left|exceeded ticket limit/i);

        return (await errorAlert.isVisible().catch(() => false)) ||
               (await textError.isVisible().catch(() => false));
    }

    /**
     * Searches for a user by last name and selects them from the dropdown.
     */
    async selectUser(
        lastName: string = 'test',
        fullName: string = 'More, Steven'
    ) {
        const searchInput = this.page.getByRole('textbox', { name: 'Search for user by last name' });
        await searchInput.click();
        await searchInput.clear().catch(() => {});
        await searchInput.fill(lastName);
        await searchInput.press('Enter');
        await this.page.waitForTimeout(600);

        const selectUserDropdown = this.page.getByRole('combobox', { name: 'Select User' });
        await selectUserDropdown.click();
        await this.page.waitForTimeout(600);

        // Build flexible regex to match name (e.g. "More, Steven" or "new, ranger")
        const nameParts = fullName.split(/[\s,]+/).filter(Boolean);
        const namePattern = nameParts.length > 0 ? nameParts.join('.*') : fullName;
        const flexRegex = new RegExp(namePattern, 'i');

        const optionLocator = this.page.getByRole('option')
            .or(this.page.getByRole('paragraph'))
            .or(this.page.locator('.MuiAutocomplete-option, .MuiMenuItem-root'))
            .filter({ hasText: flexRegex });

        if (await optionLocator.first().isVisible().catch(() => false)) {
            await optionLocator.first().click();
        } else {
            const fallbackLocator = this.page.getByText(new RegExp(nameParts[0] || fullName, 'i')).first();
            await fallbackLocator.click();
        }
    }

    /**
     * Fills the ticket quantity on the event offering page.
     */
    async fillQuantity(quantity: string = D.booking.quantity) {
        const spinbutton = this.page.getByRole('spinbutton');
        await spinbutton.click();
        await spinbutton.fill(quantity);
    }

    /**
     * Selects a user who has available seats / tickets remaining (> 0).
     * Automatically inspects dropdown options and selects the first user with seats available.
     * If the preferred user has 0 tickets left or exceeds limit, selects an alternative user who has seats.
     */
    async selectUserWithAvailableSeats(
        preferredLastName: string = 'test',
        preferredFullName: string = 'More, Steven',
        fallbackUsers: UserOption[] = [
            { lastName: 'new', fullName: 'new, ranger' },
            { lastName: 'carry', fullName: 'carry, alex' }
        ],
        quantity: string = D.booking.quantity
    ) {
        const searchNames = [
            { lastName: preferredLastName, fullName: preferredFullName },
            ...fallbackUsers
        ];

        for (const userCandidate of searchNames) {
            console.log(`Searching for user with last name: "${userCandidate.lastName}"...`);

            const searchInput = this.page.getByRole('textbox', { name: 'Search for user by last name' });
            await searchInput.click();
            await searchInput.clear().catch(() => {});
            await searchInput.fill(userCandidate.lastName);
            await searchInput.press('Enter');
            await this.page.waitForTimeout(800);

            const dropdown = this.page.getByRole('combobox', { name: 'Select User' });
            await dropdown.click();
            await this.page.waitForTimeout(600);

            // Fetch all options in the dropdown list
            const options = this.page.locator('.MuiAutocomplete-option, .MuiMenuItem-root, [role="option"]')
                .or(this.page.getByRole('paragraph').filter({ hasText: /\|\||-/ }));

            const optionCount = await options.count().catch(() => 0);

            if (optionCount > 0) {
                // Find an option that does NOT contain "|| - 0" or "0 tickets"
                let validOptionIndex = -1;
                for (let i = 0; i < optionCount; i++) {
                    const optionText = await options.nth(i).innerText().catch(() => '');
                    console.log(`Dropdown option [${i}]: "${optionText}"`);
                    if (!optionText.includes('|| - 0') && !optionText.includes('0 tickets left')) {
                        validOptionIndex = i;
                        break;
                    }
                }

                if (validOptionIndex !== -1) {
                    const chosenText = await options.nth(validOptionIndex).innerText();
                    console.log(`Selecting user with available seats: "${chosenText}"`);
                    await options.nth(validOptionIndex).click();

                    await this.fillQuantity(quantity);
                    await this.page.waitForTimeout(500);

                    if (!(await this.isTicketLimitExceeded())) {
                        console.log(`Successfully selected user: "${chosenText}"`);
                        return;
                    }
                }
            }

            // Fallback: click first option and test if valid
            if (optionCount > 0) {
                await options.first().click();
                await this.fillQuantity(quantity);
                await this.page.waitForTimeout(500);

                if (!(await this.isTicketLimitExceeded())) {
                    console.log(`Successfully selected user from search "${userCandidate.lastName}"`);
                    return;
                }
            } else {
                await this.page.keyboard.press('Escape').catch(() => {});
            }

            console.warn(`No user with available seats found for search "${userCandidate.lastName}". Trying next fallback...`);
        }

        throw new Error(`Could not find any user with available seats/tickets for booking.`);
    }

    /**
     * Clicks select seats button, selects the specified number of seats, and adds to cart.
     */
    async selectSeatsAndAddToCart(seatCount: number = 2) {
        await this.page.getByRole('button', { name: 'Select Seats' }).click();
        for (let i = 0; i < seatCount; i++) {
            await this.page.getByRole('button').nth(1).click();
        }
        await this.page.getByRole('button', { name: 'Add to Cart - $' }).click();
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
