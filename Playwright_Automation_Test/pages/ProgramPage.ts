import { Page, Locator } from '@playwright/test';
import { ProgramData, FeeData, TaxData, DEFAULT_PROGRAM_DATA } from '../tests/testData';

export class ProgramPage {
    readonly page: Page;

    // Navigation Locators
    readonly offeringsButton: Locator;
    readonly programsButton: Locator;
    readonly addProgramLink: Locator;

    // Program Details Locators
    readonly organizationDropdown: Locator;
    readonly etrakDemo3Option: Locator;
    readonly nameInput: Locator;
    readonly connectedResourceDropdown: Locator;
    readonly amTestOption: Locator;
    readonly chooseDateButtons: Locator;
    readonly twoHoursOption: Locator;
    readonly pmOption: Locator;
    readonly chooseTimeButton: Locator;
    readonly fiveHoursOption: Locator;
    readonly okButton: Locator;
    readonly maxAttendanceInput: Locator;
    readonly nextButton: Locator;

    // Fee Details Locators
    readonly feeNameInput: Locator;
    readonly amountInput: Locator;
    readonly glaDropdown: Locator;
    readonly glaTestOption: Locator;
    readonly deferredRevenueDropdown: Locator;
    readonly deferredRevenueOption: Locator;
    readonly glaAccountDropdown: Locator;
    readonly salesTaxOption: Locator;
    readonly emptyLabel: Locator;
    readonly liabilityOption: Locator;

    // Tax and Publish Locators
    readonly genericTextbox: Locator;
    readonly countyTaxOption: Locator;
    readonly taxIdDropdown: Locator;
    readonly standardTaxOption: Locator;
    readonly taxRateInput: Locator;
    readonly addTaxButton: Locator;
    readonly publishButton: Locator;
    readonly filterEmptyButton: Locator;
    readonly yesButton: Locator;
    readonly priceInput: Locator;
    readonly maxNumAvailableInput: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation
        this.offeringsButton = page.getByRole('button', { name: 'Offerings' });
        this.programsButton = page.getByRole('button', { name: 'Programs' });
        this.addProgramLink = page.getByRole('link', { name: 'Add Program' });

        // Program Details
        this.organizationDropdown = page.locator('#mui-component-select-organization');
        this.etrakDemo3Option = page.getByRole('option', { name: 'Etrak demo 3' });
        this.nameInput = page.getByRole('textbox', { name: 'Name' });
        this.connectedResourceDropdown = page.locator('#mui-component-select-connectedResource');
        this.amTestOption = page.getByRole('option', { name: 'AM test' });
        this.chooseDateButtons = page.getByRole('button', { name: 'Choose date' });
        this.twoHoursOption = page.getByRole('option', { name: '2 hours', exact: true });
        this.pmOption = page.getByRole('option', { name: 'PM' });
        this.chooseTimeButton = page.getByRole('button', { name: 'Choose time' });
        this.fiveHoursOption = page.getByRole('option', { name: '5 hours' });
        this.okButton = page.getByRole('button', { name: 'OK' });
        this.maxAttendanceInput = page.locator('input[name="maxAttendance"]');
        this.nextButton = page.getByRole('button', { name: 'Next' });

        // Fee Details
        this.feeNameInput = page.getByRole('textbox', { name: 'Fee Name' });
        this.amountInput = page.getByPlaceholder('Amount');
        this.glaDropdown = page.locator('#mui-component-select-GLA');
        this.glaTestOption = page.getByRole('option', { name: 'Gla test' });
        this.deferredRevenueDropdown = page.locator('#mui-component-select-selectedDeferredRevenue');
        this.deferredRevenueOption = page.getByRole('option', { name: 'Deferred Revenue Test KMO' });
        this.glaAccountDropdown = page.locator('#mui-component-select-glaAccountId');
        this.salesTaxOption = page.getByRole('option', { name: 'SALES TAX', exact: true });
        this.emptyLabel = page.getByLabel('', { exact: true });
        this.liabilityOption = page.getByRole('option', { name: '- Liability' });

        // Tax and Publish
        this.genericTextbox = page.getByRole('textbox');
        this.countyTaxOption = page.getByRole('option', { name: 'County Tax' });
        this.taxIdDropdown = page.locator('#mui-component-select-taxId');
        this.standardTaxOption = page.getByRole('option', { name: 'Standard Tax' });
        this.taxRateInput = page.locator('input[name="taxRate"]');
        this.addTaxButton = page.getByRole('button', { name: 'Add Tax' });
        this.publishButton = page.getByRole('button', { name: 'Publish' });
        this.filterEmptyButton = page.getByRole('button').filter({ hasText: /^$/ }).nth(3);
        this.yesButton = page.getByRole('button', { name: 'Yes' });
        this.priceInput = page.locator('input[name="price"]');
        this.maxNumAvailableInput = page.locator('input[name="maxNumAvailable"]');
    }

    async navigateToAddProgram() {
        await this.offeringsButton.click();
        await this.programsButton.click();
        await this.addProgramLink.click();
    }

    /**
     * Helper to select a guaranteed valid, future-proof day from the open calendar.
     * @param offset 0 = first available day, 1 = second available day, etc.
     */
    private async selectValidCalendarDay(offset: number) {
        // Wait for calendar grid to settle
        await this.page.waitForSelector('[role="gridcell"]', { state: 'visible' });
        await this.page.waitForTimeout(300); // Wait for open animation

        let cells = this.page.getByRole('gridcell', { disabled: false }).filter({ hasText: /^\d+$/ });
        let count = await cells.count();

        // If there aren't enough valid days left in this month, switch to the next month
        if (count <= offset) {
            const nextMonthBtn = this.page.getByRole('button', { name: /next month/i });
            if (await nextMonthBtn.count() > 0) {
                await nextMonthBtn.click();
                await this.page.waitForTimeout(500); // Wait for transition animation
            }
            cells = this.page.getByRole('gridcell', { disabled: false }).filter({ hasText: /^\d+$/ });
        }

        await cells.nth(offset).click();
    }

    async fillProgramDetails(data: ProgramData = {}) {
        const namePrefix = data.namePrefix ?? DEFAULT_PROGRAM_DATA.namePrefix;
        const organization = data.organization ?? DEFAULT_PROGRAM_DATA.organization;
        const connectedResource = data.connectedResource ?? DEFAULT_PROGRAM_DATA.connectedResource;
        const maxAttendance = data.maxAttendance ?? DEFAULT_PROGRAM_DATA.maxAttendance;

        await this.nameInput.click();
        const timestamp = new Date().getTime();
        await this.nameInput.fill(`${namePrefix} ${timestamp}`);

        await this.organizationDropdown.click();
        if (organization === 'Etrak demo 3') {
            await this.etrakDemo3Option.click();
        } else {
            await this.page.getByRole('option', { name: organization }).click();
        }

        await this.connectedResourceDropdown.click();
        if (connectedResource === 'AM test') {
            await this.amTestOption.click();
        } else {
            await this.page.getByRole('option', { name: connectedResource }).click();
        }

        // Generate random valid offsets to ensure strict chronological order
        // Reg Start < Reg End < Program Start
        const regStartOffset = Math.floor(Math.random() * 3); // 0, 1, or 2
        const regEndOffset = regStartOffset + 1 + Math.floor(Math.random() * 3);
        const progStartOffset = regEndOffset + 1 + Math.floor(Math.random() * 4);

        await this.chooseDateButtons.first().click();
        await this.selectValidCalendarDay(progStartOffset);

        // Select a random start hour (1 to 11)
        const randomStartHour = Math.floor(Math.random() * 11) + 1;
        await this.page.getByRole('option', { name: `${randomStartHour} hours`, exact: true }).click();
        await this.pmOption.click();

        // Force close popup to prevent backdrop click consumption or index shifting
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);

        await this.chooseTimeButton.click();

        // Select a random end hour (Start Hour + 1, up to 12)
        let randomEndHour = randomStartHour + 1 + Math.floor(Math.random() * 2);
        if (randomEndHour > 12) randomEndHour = 12;
        await this.page.getByRole('option', { name: `${randomEndHour} hours`, exact: true }).click();
        await this.pmOption.click();

        // Force close popup
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);

        await this.chooseDateButtons.nth(1).click();
        await this.selectValidCalendarDay(regStartOffset);
        await this.okButton.click();

        await this.chooseDateButtons.nth(2).click();
        await this.selectValidCalendarDay(regEndOffset);
        await this.okButton.click();

        await this.maxAttendanceInput.click();
        await this.maxAttendanceInput.fill(maxAttendance);
        await this.nextButton.click();
    }

    async fillFeeDetails(fee: FeeData = {}) {
        const defaultFee = DEFAULT_PROGRAM_DATA.fee;
        const feeName = fee.name ?? defaultFee.name;
        const amount = fee.amount ?? defaultFee.amount;
        const gla = fee.gla ?? defaultFee.gla;
        const deferredRevenue = fee.deferredRevenue ?? defaultFee.deferredRevenue;
        const glaAccount = fee.glaAccount ?? defaultFee.glaAccount;
        const liability = fee.liability ?? defaultFee.liability;

        await this.feeNameInput.click();
        await this.feeNameInput.fill(feeName);
        await this.amountInput.click();
        await this.amountInput.fill(amount);
        await this.glaDropdown.click();
        
        if (gla === 'Gla test') {
            await this.glaTestOption.click();
        } else {
            await this.page.getByRole('option', { name: gla }).click();
        }

        await this.deferredRevenueDropdown.click();
        if (deferredRevenue === 'Deferred Revenue Test KMO') {
            await this.deferredRevenueOption.click();
        } else {
            await this.page.getByRole('option', { name: deferredRevenue }).click();
        }

        await this.glaAccountDropdown.click();
        if (glaAccount === 'SALES TAX') {
            await this.salesTaxOption.click();
        } else {
            await this.page.getByRole('option', { name: glaAccount, exact: true }).click();
        }

        // Use a robust locator to find the next combobox instead of the brittle empty label
        let liabilityDropdown = this.page.getByLabel('', { exact: true });
        if (await liabilityDropdown.count() === 0) {
            liabilityDropdown = this.page.locator('.MuiSelect-select').last();
        }
        await liabilityDropdown.click();
        
        if (liability === '- Liability') {
            await this.liabilityOption.click();
        } else {
            await this.page.getByRole('option', { name: liability }).click();
        }

        // Force close any lingering dropdown popups before clicking next
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);

        await this.nextButton.click();
        // Wait for the next page to fully render
        await this.page.waitForTimeout(1000);
    }

    async addTaxAndPublish(tax: TaxData = {}) {
        const defaultTax = DEFAULT_PROGRAM_DATA.tax;
        const addonName = tax.addonName ?? defaultTax.addonName;
        const price = tax.price ?? defaultTax.price;
        const maxNumAvailable = tax.maxNumAvailable ?? defaultTax.maxNumAvailable;
        const gla = tax.gla ?? defaultTax.gla;
        const glaAccount = tax.glaAccount ?? defaultTax.glaAccount;

        // Dynamically find the Add-on / Tax name textbox. 
        // Use a fallback to find any visible textbox if it's not strictly labelled.
        let addonNameInput = this.page.getByRole('textbox', { name: /Name/i }).last();
        if (await addonNameInput.count() === 0) {
            addonNameInput = this.page.getByRole('textbox').last();
        }

        // If the form is hidden behind an 'Add Add-on' button, click it first
        if (!(await addonNameInput.isVisible())) {
            const addAddonBtn = this.page.getByRole('button', { name: /Add Add-on|Add Tax/i }).first();
            if (await addAddonBtn.isVisible()) {
                await addAddonBtn.click();
                await this.page.waitForTimeout(500);
            }
        }

        await addonNameInput.click();
        await addonNameInput.fill(addonName);
        
        // Dynamically find the GLA dropdown relative to its label
        const addonGlaLabel = this.page.locator('label').filter({ hasText: /^GLA\s*\**$/i }).last();
        await addonGlaLabel.locator('xpath=..').locator('.MuiSelect-select').click();
        
        // Wait for dropdown to open and gracefully select an option
        await this.page.waitForTimeout(300);
        if (gla === 'Gla test') {
            await this.glaTestOption.first().click();
        } else {
            const opt = this.page.getByRole('option', { name: new RegExp(gla, 'i') });
            if (await opt.count() > 0) {
                await opt.first().click();
            } else {
                // Fallback: Just pick the first available option
                await this.page.getByRole('option').nth(1).click();
            }
        }
        
        // Dynamically find the GLA Account dropdown
        const addonGlaAccountLabel = this.page.locator('label').filter({ hasText: /^GLA Account\s*\**$/i }).last();
        await addonGlaAccountLabel.locator('xpath=..').locator('.MuiSelect-select').click();
        await this.page.waitForTimeout(300);
        
        // Gracefully pick an account option
        if (glaAccount) {
            const opt = this.page.getByRole('option', { name: new RegExp(glaAccount, 'i') });
            if (await opt.count() > 0) {
                await opt.first().click();
            } else {
                await this.page.getByRole('option').last().click();
            }
        } else {
            const accountOption = this.page.getByRole('option');
            if (await accountOption.count() > 0) {
                await accountOption.last().click();
            } else {
                await this.page.keyboard.press('Escape'); // Close if empty
            }
        }
        
        await this.priceInput.click();
        await this.priceInput.fill(price);
        await this.maxNumAvailableInput.click();
        await this.maxNumAvailableInput.fill(maxNumAvailable);
        await this.publishButton.click();
    }
}

