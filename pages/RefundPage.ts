import { Page, Locator } from '@playwright/test';
import testData from '../testData.json';

export class RefundPage {
    constructor(readonly page: Page) { }

    private readonly REFUND_SVG_CSS_PATH = 'body > div:nth-child(2) > div:nth-child(2) > main:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr > td:nth-child(8) > span:nth-child(2) > button:nth-child(1) > svg:nth-child(1)';

    /**
     * Navigate to Users → User List from sidebar
     */
    async navigateToUserList() {
        await this.page.goto(testData.app.baseUrl);
        await this.page.waitForLoadState('networkidle').catch(() => { });

        const usersBtn = this.page.getByRole('button', { name: 'Users' })
            .or(this.page.getByRole('link', { name: 'Users' }))
            .first();
        await usersBtn.waitFor({ state: 'visible', timeout: 15000 });
        await usersBtn.click();

        const userListBtn = this.page.getByRole('button', { name: 'User List' })
            .or(this.page.getByRole('link', { name: 'User List' }))
            .or(this.page.getByText('User List'))
            .first();

        await userListBtn.waitFor({ state: 'visible', timeout: 15000 });
        await userListBtn.click();
    }

    /**
     * Filter user list by organization and close filter drawer overlay
     */
    async filterByOrganization(orgName: string = testData.organization) {
        // Open filter menu
        const filterBtn = this.page.getByRole('button').nth(2);
        if (await filterBtn.isVisible().catch(() => false)) {
            await filterBtn.click();
        }

        const orgCombobox = this.page.getByRole('combobox', { name: 'Organization(s)' })
            .or(this.page.locator('#mui-component-select-organization'))
            .first();

        await orgCombobox.waitFor({ state: 'visible', timeout: 10000 });
        await orgCombobox.click();
        await orgCombobox.fill(orgName.slice(0, 3)).catch(() => { });

        const option = this.page.getByRole('option', { name: orgName }).first();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();

        // Close filter drawer (recorded action: click first button and Escape)
        const closeBtn = this.page.getByRole('button').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click().catch(() => { });
        }
        await this.page.keyboard.press('Escape').catch(() => { });
        await this.page.waitForTimeout(1000);
    }

    /**
     * Open a user's profile from the user list table.
     */
    async openUserProfile(index: number = 1) {
        await this.page.keyboard.press('Escape').catch(() => { });

        const profileLink = this.page.getByRole('link', { name: 'View Profile' })
            .or(this.page.getByText('View Profile'));

        await profileLink.first().waitFor({ state: 'visible', timeout: 30000 });

        const targetCount = await profileLink.count();
        const targetIndex = index < targetCount ? index : 0;
        await profileLink.nth(targetIndex).click({ force: true });

        await this.page.waitForLoadState('networkidle').catch(() => { });
        await this.page.waitForTimeout(1000);
    }

    /**
     * Navigate to the Orders tab on the user profile page.
     */
    async goToOrdersTab() {
        const ordersTab = this.page.getByRole('button', { name: 'Orders' })
            .or(this.page.getByRole('tab', { name: 'Orders' }))
            .first();

        await ordersTab.waitFor({ state: 'visible', timeout: 20000 });
        await ordersTab.click();
        await this.page.waitForLoadState('networkidle').catch(() => { });
        await this.page.waitForTimeout(1500);
    }

    /**
     * Check if a specific dollar symbol ($) refund button is enabled or disabled.
     */
    async isRefundEnabled(btn: Locator): Promise<boolean> {
        const isDisabledAttr = await btn.getAttribute('disabled');
        const isAriaDisabled = await btn.getAttribute('aria-disabled');
        const className = (await btn.getAttribute('class')) || '';
        const isDisabledMethod = await btn.isDisabled().catch(() => false);

        return !(isDisabledMethod || isDisabledAttr !== null || isAriaDisabled === 'true' || className.includes('Mui-disabled'));
    }

    /**
     * Get locators for the refund ($) action buttons in the Orders table.
     */
    getRefundDollarButtons(): Locator {
        return this.page.locator('span[aria-label="Refund"] button')
            .or(this.page.locator('svg[data-testid="AttachMoneyIcon"]'))
            .or(this.page.locator('button.css-1yxmbwk'))
            .or(this.page.locator(this.REFUND_SVG_CSS_PATH))
            .or(this.page.locator('.MuiTableCell-root > span > .MuiButtonBase-root'))
            .or(this.page.locator('button:has(svg.css-vubbuv)'))
            .or(this.page.getByRole('button', { name: '$' }));
    }

    /**
     * Find and click an enabled refund ($) button in the Orders table.
     */
    async clickEnabledRefundButton(): Promise<boolean> {
        // Try span[aria-label="Refund"] button first
        const refundSpans = this.page.locator('span[aria-label="Refund"] button');
        const spanCount = await refundSpans.count();

        if (spanCount > 0) {
            for (let i = 0; i < spanCount; i++) {
                const btn = refundSpans.nth(i);
                if (await btn.isVisible().catch(() => false) && await this.isRefundEnabled(btn)) {
                    await btn.click();
                    await this.page.waitForTimeout(1000);
                    return true;
                }
            }
        }

        // Fallback to all combined locators
        const dollarButtons = this.getRefundDollarButtons();
        const count = await dollarButtons.count();
        for (let i = 0; i < count; i++) {
            const btn = dollarButtons.nth(i);
            if (await btn.isVisible().catch(() => false) && await this.isRefundEnabled(btn)) {
                await btn.click();
                await this.page.waitForTimeout(1000);
                return true;
            }
        }
        return false;
    }

    /**
     * Click the enabled Dollar symbol ($) button on the Orders table to initiate refund.
     */
    async viewReceiptAndInitiateRefund(): Promise<boolean> {
        return await this.clickEnabledRefundButton();
    }

    /**
     * Select a specific item for refund by checking its checkbox.
     */
    async selectItemForRefund(itemName: string = 'Eq Microphone Stand') {
        const row = this.page.getByRole('row', { name: new RegExp(itemName, 'i') });
        if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
            await row.getByRole('checkbox').check();
        } else {
            await this.page.getByRole('checkbox').first().check();
        }
    }

    /**
     * Complete the refund using cash payment.
     */
    async completeRefundWithCash() {
        const cashOption = this.page.getByRole('checkbox', { name: 'Cash Refund with cash $' })
            .or(this.page.getByRole('checkbox', { name: /Cash/i }))
            .first();

        if (await cashOption.isVisible({ timeout: 5000 }).catch(() => false)) {
            await cashOption.check().catch(() => cashOption.click().catch(() => { }));
            await this.page.waitForTimeout(500);
        }

        const completeBtn = this.page.getByRole('button', { name: 'Complete Refund' })
            .or(this.page.getByRole('button', { name: /Complete/i }))
            .first();

        await completeBtn.waitFor({ state: 'visible', timeout: 10000 });
        await completeBtn.click();
    }

    /**
     * Close modal and return to Dashboard.
     */
    async returnToDashboard() {
        const firstBtn = this.page.getByRole('button').first();
        if (await firstBtn.isVisible().catch(() => false)) {
            await firstBtn.click().catch(() => { });
        }

        const dashboardBtn = this.page.getByLabel('mailbox folders').getByRole('button', { name: 'Dashboard' })
            .or(this.page.getByRole('button', { name: 'Dashboard' }))
            .first();

        if (await dashboardBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await dashboardBtn.click();
        }
    }

    /**
     * Go back to User List and ensure filters are applied.
     */
    async goBackToUserList() {
        await this.page.goBack();
        await this.page.waitForLoadState('networkidle').catch(() => { });
        await this.page.waitForTimeout(1000);

        // Re-apply filter if list got cleared/reset
        const viewProfileLink = this.page.getByRole('link', { name: 'View Profile' }).first();
        if (!await viewProfileLink.isVisible().catch(() => false)) {
            await this.navigateToUserList();
            await this.filterByOrganization();
        }
    }

    /**
     * Search user profiles for an active refundable order.
     */
    async findAndOpenUserWithRefund(maxUsers: number = 10): Promise<boolean> {
        for (let i = 1; i <= maxUsers; i++) {
            console.log(`Checking user profile at index ${i}...`);

            const profileLinks = this.page.getByRole('link', { name: 'View Profile' });
            await profileLinks.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });

            if (i >= await profileLinks.count()) {
                break;
            }

            await profileLinks.nth(i).click({ force: true });
            await this.page.waitForLoadState('networkidle').catch(() => { });

            await this.goToOrdersTab();

            const isRefundInitiated = await this.clickEnabledRefundButton();
            if (isRefundInitiated) {
                return true;
            }

            await this.goBackToUserList();
        }
        return false;
    }
}
