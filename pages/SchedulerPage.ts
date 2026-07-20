import { Page } from '@playwright/test';

export class SchedulerPage {
    constructor(readonly page: Page) { }

    async navigateToScheduler(orgName: string = 'Etrak demo 3') {
        // Go to homepage
        await this.page.goto('https://www.etrak-recsoftware.com/');

        // Filter by organization
        await this.page.getByRole('button').nth(2).click();
        await this.page.getByRole('combobox', { name: 'Organization(s)' }).click();
        await this.page.getByRole('combobox', { name: 'Organization(s)' }).fill(orgName.slice(0, 4));
        await this.page.getByRole('option', { name: orgName }).click();

        // Navigate to Offerings → View Scheduler
        await this.page.getByRole('button', { name: 'Offerings' }).click();
        await this.page.getByRole('button', { name: 'View Scheduler' }).click();
    }

    async selectTimeSlot(startRowIndex: number = 20) {
        // Thursday is the 5th column of the 7-day week (Sun, Mon, Tue, Wed, Thu, Fri, Sat)
        // We will click Thursday at startRowIndex (default 20 = 9:30 AM) which is empty
        const modalTextbox = this.page.getByRole('textbox', { description: '0/500 Characters allowed', exact: true });
        
        for (let offset = 0; offset < 10; offset++) {
            const rowIndex = startRowIndex + offset;
            const slot = this.page.locator(`tr:nth-child(${rowIndex}) > .fc-timegrid-slot.fc-timegrid-slot-lane`);
            
            if (await slot.isVisible().catch(() => false)) {
                const box = await slot.boundingBox();
                if (box) {
                    // Click Thursday (4.5 / 7 horizontal position)
                    const x = box.width * (4.5 / 7);
                    const y = box.height / 2;
                    await slot.click({ position: { x, y } });
                } else {
                    await slot.click();
                }
                
                try {
                    // If the modal text box is visible, we successfully opened the booking dialog
                    await modalTextbox.waitFor({ state: 'visible', timeout: 3000 });
                    return;
                } catch (e) {
                    // Close any view dialog if we accidentally clicked a booked spot
                    await this.page.keyboard.press('Escape');
                    await this.page.waitForTimeout(500);
                }
            }
        }
        throw new Error("Could not find an empty time slot on Thursday to open the booking modal.");
    }

    async fillBookingDetails(description: string = 'test', notes: string = 'test notes') {
        // Fill in the description field (0/500 characters)
        await this.page.getByRole('textbox', { description: '0/500 Characters allowed', exact: true }).click();
        await this.page.getByRole('textbox', { description: '0/500 Characters allowed', exact: true }).fill(description);

        // Fill in the notes field (0/2000 characters)
        await this.page.getByRole('textbox', { description: '0/2000 Characters allowed', exact: true }).click();
        await this.page.getByRole('textbox', { description: '0/2000 Characters allowed', exact: true }).fill(notes);
    }

    async selectUser(searchText: string = 'test', userName: string = 'Test, Nancy') {
        await this.page.locator('#user-select').click();
        await this.page.locator('#user-select').fill(searchText);
        await this.page.getByText(userName).click();
    }

    async selectResource(optionIndex: number = 5) {
        // Open resource dropdown and select a checkbox option
        await this.page.locator('#checkboxes-tags-demo').click();
        await this.page.locator(`#checkboxes-tags-demo-option-${optionIndex} > .MuiButtonBase-root > .PrivateSwitchBase-input`).check();
        await this.page.getByText('CancelApply').click();
        await this.page.getByRole('button', { name: 'Apply' }).click();
    }

    async addToCartAndCheckout() {
        await this.page.getByRole('button', { name: 'Add to Cart - Total Amount $' }).click();
        await this.page.getByRole('button', { name: 'Check Out' }).click();
        await this.page.getByRole('checkbox', { name: 'Cash Checkout using cash. $' }).check();
        await this.page.getByRole('button', { name: 'Complete Order' }).click();
    }

    async returnToDashboard() {
        await this.page.getByLabel('mailbox folders').getByRole('button', { name: 'Dashboard' }).click();
    }
}
