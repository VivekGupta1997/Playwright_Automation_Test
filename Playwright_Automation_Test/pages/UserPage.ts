import { Page } from '@playwright/test';

export const DEFAULT_USER_DATA = {
    organization: 'Etrak demo 3',
    firstName: 'ranger',
    lastName: 'new',
    email: 'ranger1254@gmail.com',
    address1: 'Indore',
    city: 'Indore',
    state: 'Arizona',
    zipCode: '452015',
    phoneNumber: '(999)999-9999',
    role: 'rental',
    dob: '04/15/1994',
};

export class UserPage {
    constructor(readonly page: Page) {}

    async navigateToUsersPage() {
        const link = this.page.getByRole('link', { name: 'Users', exact: true });
        if (await link.isVisible()) {
            await link.click();
        } else {
            await this.page.goto('https://yellow-plant-07ff7231e.5.azurestaticapps.net/');
            await link.click();
        }
    }

    async clickAddUsers() {
        await this.page.getByRole('link', { name: 'Add Users' }).or(this.page.getByRole('button', { name: 'Add Users' })).first().click();
    }

    async selectOrganization(orgName: string = DEFAULT_USER_DATA.organization) {
        await this.page.locator('.MuiSelect-select').first().click();
        await this.page.getByRole('option', { name: orgName }).click();
        await this.page.keyboard.press('Escape');
    }

    async fillUserDetails(data: Partial<typeof DEFAULT_USER_DATA> = {}) {
        const firstName = data.firstName ?? DEFAULT_USER_DATA.firstName;
        const lastName = data.lastName ?? DEFAULT_USER_DATA.lastName;
        const email = data.email ?? `${DEFAULT_USER_DATA.email.split('@')[0]}_${Date.now()}@gmail.com`;
        const address1 = data.address1 ?? DEFAULT_USER_DATA.address1;
        const city = data.city ?? DEFAULT_USER_DATA.city;
        const state = data.state ?? DEFAULT_USER_DATA.state;
        const zipCode = data.zipCode ?? DEFAULT_USER_DATA.zipCode;
        const phoneNumber = data.phoneNumber ?? DEFAULT_USER_DATA.phoneNumber;

        await this.page.locator('input[name="firstName"]').fill(firstName);
        await this.page.locator('input[name="lastName"]').fill(lastName);
        await this.page.locator('input[name="email"]').fill(email);
        await this.page.locator('input[name="address1"]').fill(address1);
        await this.page.locator('input[name="city"]').fill(city);

        await this.page.locator('#state').click();
        await this.page.getByRole('option', { name: state, exact: true }).click();
        
        await this.page.locator('input[name="zipCode"]').fill(zipCode);
        await this.page.locator('input[name="phoneNumber"]').fill(phoneNumber);
    }

    async selectRole(roleName: string = DEFAULT_USER_DATA.role) {
        await this.page.locator('#demo-multiple-checkbox').last().click();
        await this.page.getByRole('option', { name: new RegExp(roleName, 'i') }).click();
        await this.page.keyboard.press('Escape');
    }

    async selectDOB(dob: string = DEFAULT_USER_DATA.dob) {
        const dobContainer = this.page.locator('.MuiInputBase-root', { has: this.page.getByRole('button', { name: 'Choose date' }) });
        await dobContainer.locator('input').fill(dob);
    }

    async saveUser() {
        await this.page.getByRole('button', { name: 'Save' }).click();
    }
}
