import { Page, Locator } from '@playwright/test';

export class UserPage {
    readonly page: Page;
    readonly usersButton: Locator;
    readonly addUsersButton: Locator;
    readonly organizationDropdown: Locator;
    readonly etrakDemo3Option: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly address1Input: Locator;
    readonly cityInput: Locator;
    readonly stateDropdown: Locator;
    readonly arizonaOption: Locator;
    readonly zipCodeInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly roleCheckbox: Locator;
    readonly rentalRoleOption: Locator;
    readonly dobInput: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usersButton = page.getByRole('button', { name: 'Users' });
        this.addUsersButton = page.getByRole('button', { name: 'Add Users' });
        this.organizationDropdown = page.getByLabel('', { exact: true }).first();
        this.etrakDemo3Option = page.getByRole('option', { name: 'Etrak demo 3' });
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.emailInput = page.locator('input[name="email"]');
        this.address1Input = page.locator('input[name="address1"]');
        this.cityInput = page.locator('input[name="city"]');
        this.stateDropdown = page.locator('#state');
        this.arizonaOption = page.getByRole('option', { name: 'Arizona', exact: true });
        this.zipCodeInput = page.locator('input[name="zipCode"]');
        this.phoneNumberInput = page.locator('input[name="phoneNumber"]');
        this.roleCheckbox = page.locator('#demo-multiple-checkbox').nth(1);
        this.rentalRoleOption = page.getByRole('option', { name: /rental/i });
        this.dobInput = page.locator('.MuiInputBase-root', { has: page.getByRole('button', { name: 'Choose date' }) }).locator('input');
        this.saveButton = page.getByRole('button', { name: 'Save' });
    }

    async navigateToUsersPage() {
        await this.page.goto('https://yellow-plant-07ff7231e.5.azurestaticapps.net/');
        await this.usersButton.click();
    }

    async clickAddUsers() {
        await this.addUsersButton.click();
    }

    async selectOrganization() {
        await this.organizationDropdown.click();
        await this.etrakDemo3Option.click();
        await this.page.keyboard.press('Escape');
    }

    async fillUserDetails() {
        await this.firstNameInput.fill('ranger');
        await this.lastNameInput.fill('new');
        await this.emailInput.fill('ranger1254@gmail.com');
        await this.address1Input.fill('Indore');
        await this.cityInput.fill('Indore');
        await this.stateDropdown.click();
        await this.arizonaOption.click();
        await this.zipCodeInput.fill('452015');
        await this.phoneNumberInput.fill('(999)999-99999');
    }

    async selectRole() {
        await this.roleCheckbox.click();
        await this.rentalRoleOption.click();
        await this.page.keyboard.press('Escape');
    }

    async selectDOB() {
        // Direct format filling is much more reliable than navigating the MUI calendar popups
        await this.dobInput.fill('04/15/1994');
    }

    async saveUser() {
        await this.saveButton.click();
    }
}
