import { Page, Locator } from '@playwright/test';
import { UserData, DEFAULT_USER_DATA, DEFAULT_LOGIN_URL } from '../tests/testData';

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
        await this.page.goto(DEFAULT_LOGIN_URL);
        await this.usersButton.click();
    }

    async clickAddUsers() {
        await this.addUsersButton.click();
    }

    async selectOrganization(orgName?: string) {
        const targetOrg = orgName ?? DEFAULT_USER_DATA.organization;
        await this.organizationDropdown.click();
        if (targetOrg === 'Etrak demo 3') {
            await this.etrakDemo3Option.click();
        } else {
            await this.page.getByRole('option', { name: targetOrg }).click();
        }
        await this.page.keyboard.press('Escape');
    }

    async fillUserDetails(data: UserData = {}) {
        const firstName = data.firstName ?? DEFAULT_USER_DATA.firstName;
        const lastName = data.lastName ?? DEFAULT_USER_DATA.lastName;
        const email = data.email ?? DEFAULT_USER_DATA.email;
        const address1 = data.address1 ?? DEFAULT_USER_DATA.address1;
        const city = data.city ?? DEFAULT_USER_DATA.city;
        const state = data.state ?? DEFAULT_USER_DATA.state;
        const zipCode = data.zipCode ?? DEFAULT_USER_DATA.zipCode;
        const phoneNumber = data.phoneNumber ?? DEFAULT_USER_DATA.phoneNumber;

        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.address1Input.fill(address1);
        await this.cityInput.fill(city);
        await this.stateDropdown.click();
        
        if (state === 'Arizona') {
            await this.arizonaOption.click();
        } else {
            await this.page.getByRole('option', { name: state, exact: true }).click();
        }
        
        await this.zipCodeInput.fill(zipCode);
        await this.phoneNumberInput.fill(phoneNumber);
    }

    async selectRole(roleName?: string) {
        const targetRole = roleName ?? DEFAULT_USER_DATA.role;
        await this.roleCheckbox.click();
        if (targetRole.toLowerCase() === 'rental') {
            await this.rentalRoleOption.click();
        } else {
            await this.page.getByRole('option', { name: new RegExp(targetRole, 'i') }).click();
        }
        await this.page.keyboard.press('Escape');
    }

    async selectDOB(dob?: string) {
        const targetDob = dob ?? DEFAULT_USER_DATA.dob;
        await this.dobInput.fill(targetDob);
    }

    async saveUser() {
        await this.saveButton.click();
    }
}

