import { Page } from '@playwright/test';
import { selectDropdown, selectCalendarDay, handleConflictDialog, navigateToOfferingsSection, uniqueName } from './helpers';
import testData from '../testData.json';

const D = testData.program;

export class ProgramPage {
    constructor(readonly page: Page) {}

    // ─── Navigation ──────────────────────────────────────────────────────────

    async navigateToAddProgram() {
        await navigateToOfferingsSection(this.page, 'Programs');
        await this.page.getByRole('link', { name: 'Add Program' }).click();
    }

    // ─── Step 1: Program Details ──────────────────────────────────────────────

    async selectOrganization(organization: string = testData.organization) {
        await this.page.locator('#mui-component-select-organization').click();
        await this.page.getByRole('option', { name: organization }).click();
    }

    async fillProgramName(namePrefix: string = D.namePrefix) {
        await this.page.getByRole('textbox', { name: 'Name' }).click();
        await this.page.getByRole('textbox', { name: 'Name' }).fill(uniqueName(namePrefix));
    }

    async selectConnectedResource(connectedResource: string = D.connectedResource) {
        await this.page.locator('#mui-component-select-connectedResource').click();
        await this.page.getByRole('option', { name: connectedResource }).click();
    }

    async selectProgramDates(progStartOffset: number = 7, randomStartHour: number = 9, randomEndHour: number = 11, regStartOffset: number = 0, regEndOffset: number = 3) {
        // Program start date
        await this.page.getByRole('button', { name: 'Choose date' }).first().click();
        await selectCalendarDay(this.page, progStartOffset);
        await this.page.getByRole('option', { name: `${randomStartHour} hours`, exact: true }).click();
        await this.page.getByRole('option', { name: 'PM' }).click();
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);

        // Program end time
        await this.page.getByRole('button', { name: 'Choose time' }).click();
        await this.page.getByRole('option', { name: `${randomEndHour} hours`, exact: true }).click();
        await this.page.getByRole('option', { name: 'PM' }).click();
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);

        // Registration dates
        await this.page.getByRole('button', { name: 'Choose date' }).nth(1).click();
        await selectCalendarDay(this.page, regStartOffset);
        await this.page.getByRole('button', { name: 'OK' }).click();

        await this.page.getByRole('button', { name: 'Choose date' }).nth(2).click();
        await selectCalendarDay(this.page, regEndOffset);
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async fillMaxAttendance(maxAttendance: string = D.maxAttendance) {
        await this.page.locator('input[name="maxAttendance"]').click();
        await this.page.locator('input[name="maxAttendance"]').fill(maxAttendance);
    }

    async fillProgramDetails(
        organization: string = testData.organization,
        namePrefix: string = D.namePrefix,
        connectedResource: string = D.connectedResource,
        maxAttendance: string = D.maxAttendance
    ) {
        await this.selectOrganization(organization);
        await this.fillProgramName(namePrefix);
        await this.selectConnectedResource(connectedResource);

        const regStartOffset = Math.floor(Math.random() * 3);
        const regEndOffset = regStartOffset + 1 + Math.floor(Math.random() * 3);
        const progStartOffset = regEndOffset + 1 + Math.floor(Math.random() * 4);
        const randomStartHour = Math.floor(Math.random() * 11) + 1;
        let randomEndHour = randomStartHour + 1 + Math.floor(Math.random() * 2);
        if (randomEndHour > 12) randomEndHour = 12;

        await this.selectProgramDates(progStartOffset, randomStartHour, randomEndHour, regStartOffset, regEndOffset);
        await this.fillMaxAttendance(maxAttendance);
        await this.page.getByRole('button', { name: 'Next' }).click();
        await handleConflictDialog(this.page);
    }

    // ─── Step 2: Fee Details ──────────────────────────────────────────────────

    async fillFeeDetails(
        feeName: string = D.fee.name,
        amount: string = D.fee.amount,
        gla: string = D.fee.gla,
        deferredRevenue: string | null = D.fee.deferredRevenue,
        glaAccount: string = D.fee.glaAccount,
        taxId: string = D.fee.taxId,
        taxRate: string = D.fee.taxRate,
        clickAddMoreTax: boolean = D.fee.clickAddMoreTax
    ) {
        const feeNameInput = this.page.getByRole('textbox', { name: 'Fee Name' });
        await feeNameInput.click();
        await feeNameInput.fill(feeName);

        const amountInput = this.page.getByPlaceholder('Amount');
        await amountInput.click();
        await amountInput.fill(amount);

        await selectDropdown(this.page, '#mui-component-select-GLA', gla);

        if (deferredRevenue) {
            await selectDropdown(this.page, '#mui-component-select-selectedDeferredRevenue', deferredRevenue);
        }

        await selectDropdown(this.page, '#mui-component-select-glaAccountId', glaAccount, true);
        await selectDropdown(this.page, '#mui-component-select-taxId', taxId);

        const taxRateInput = this.page.locator('input[name="taxRate"]');
        await taxRateInput.click();
        await taxRateInput.fill(taxRate);
        await this.page.waitForTimeout(500);

        if (clickAddMoreTax) {
            await this.page.getByRole('button', { name: 'Add More Tax' }).click();
            await this.page.waitForTimeout(500);
        }

        await this.page.getByRole('button', { name: 'Next' }).click();
        await this.page.waitForTimeout(1000);
    }

    // ─── Step 3: Add-ons & Publish ────────────────────────────────────────────

    async addTaxAndPublish(
        addonName: string = D.addon.name,
        price: string = D.addon.price,
        maxNumAvailable: string = D.addon.maxNumAvailable,
        gla: string = D.addon.gla,
        glaAccount: string = D.addon.glaAccount,
        taxId: string = D.addon.taxId,
        taxRate: string = D.addon.taxRate,
        setupTax: boolean = D.addon.setupTax
    ) {
        await this.page.getByRole('button', { name: 'Publish' }).waitFor({ state: 'visible', timeout: 20000 });

        const addonNameInput = this.page.getByRole('textbox', { name: 'Fee Name' })
            .or(this.page.getByRole('textbox', { name: /Name/i }).last())
            .or(this.page.getByRole('textbox').first());

        if (!(await addonNameInput.isVisible())) {
            const addAddonBtn = this.page.getByRole('button', { name: /Add Add-on|Add Tax/i }).first();
            if (await addAddonBtn.isVisible()) {
                await addAddonBtn.click();
                await this.page.waitForTimeout(500);
            }
        }

        await addonNameInput.click();
        await addonNameInput.fill(addonName);

        await selectDropdown(this.page, this.page.locator('#mui-component-select-GLA').filter({ visible: true }).first(), gla);

        const priceInput = this.page.locator('input[name="price"]').or(this.page.getByPlaceholder('Amount'));
        await priceInput.click();
        await priceInput.fill(price);

        const maxNumInput = this.page.locator('input[name="maxNumAvailable"]');
        await maxNumInput.click();
        await maxNumInput.fill(maxNumAvailable);

        if (setupTax) {
            await selectDropdown(this.page, this.page.locator('#mui-component-select-glaAccountId').filter({ visible: true }).first(), glaAccount, true);
            await selectDropdown(this.page, this.page.locator('#mui-component-select-glaAccountId').filter({ visible: true }).last(), glaAccount, true);
            await this.page.waitForTimeout(500);
            await selectDropdown(this.page, this.page.locator('#mui-component-select-taxId').filter({ visible: true }).last(), taxId);

            const taxRateInput = this.page.locator('input[name="taxRate"]').filter({ visible: true }).last();
            await taxRateInput.click();
            await taxRateInput.fill(taxRate);
            await this.page.getByRole('button', { name: 'Add Tax' }).click();
            await this.page.waitForTimeout(500);
        }

        await this.page.getByRole('button', { name: 'Publish' }).click();
        await handleConflictDialog(this.page);
    }
}
