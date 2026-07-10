import { Page } from '@playwright/test';

/**
 * Selects a dropdown option using the MUI select element.
 * @param page - Playwright page instance
 * @param selectorOrLocator - CSS selector string or Locator
 * @param option - Option text to select
 * @param exact - Whether to match the option text exactly
 */
export async function selectDropdown(page: Page, selectorOrLocator: string | any, option: string, exact = false) {
    const locator = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator) : selectorOrLocator;
    await locator.click();
    await page.getByRole('option', { name: option, exact }).click();
}

/**
 * Clicks a calendar gridcell at the given offset from the first available day.
 * Automatically advances to next month if there are not enough cells.
 * @param page - Playwright page instance
 * @param offset - Index of the target calendar day (0-based)
 */
export async function selectCalendarDay(page: Page, offset: number) {
    await page.waitForSelector('[role="gridcell"]', { state: 'visible' });
    await page.waitForTimeout(300);

    let cells = page.getByRole('gridcell', { disabled: false }).filter({ hasText: /^\d+$/ });

    if (await cells.count() <= offset) {
        const nextMonthBtn = page.getByRole('button', { name: /next month/i });
        if (await nextMonthBtn.count() > 0) {
            await nextMonthBtn.click();
            await page.waitForTimeout(500);
        }
        cells = page.getByRole('gridcell', { disabled: false }).filter({ hasText: /^\d+$/ });
    }

    await cells.nth(offset).click();
}

/**
 * Dismisses the "Double Book Resources?" conflict dialog if it appears.
 * Safe to call even if the dialog is not present.
 * @param page - Playwright page instance
 */
export async function handleConflictDialog(page: Page) {
    const btn = page.getByRole('button', { name: 'Double Book Resources?' });
    await btn.waitFor({ state: 'visible', timeout: 5000 })
        .then(() => btn.click())
        .catch(() => {});
}

/**
 * Navigates to the sidebar Offerings section and clicks the specified link.
 * @param page - Playwright page instance
 * @param linkName - The name of the link/button to click (e.g. 'Programs', 'Events')
 */
export async function navigateToOfferingsSection(page: Page, linkName: string) {
    const link = page.getByRole('link', { name: linkName, exact: true })
        .or(page.getByRole('button', { name: linkName }))
        .first();

    if (!await link.isVisible()) {
        const offerings = page.getByRole('button', { name: 'Offerings' });
        if (await offerings.isVisible()) await offerings.click();
    }

    await link.click();
}

/**
 * Generates a unique name by appending the current timestamp.
 * @param prefix - The name prefix
 * @returns A string like "My Resource 1718000000000"
 */
export function uniqueName(prefix: string): string {
    return `${prefix} ${Date.now()}`;
}
