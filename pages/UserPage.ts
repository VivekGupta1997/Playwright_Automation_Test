import { Page } from '@playwright/test';
import testData from '../testData.json';

const D = testData.user;

export class UserPage {
    constructor(readonly page: Page) {}

    async navigateToUsersPage() {
        const link = this.page.getByRole('link', { name: 'Users', exact: true });
        if (await link.isVisible()) {
            await link.click();
        } else {
            await this.page.goto(testData.app.baseUrl);
            await link.click();
        }
    }

    async clickAddUsers() {
        await this.page.getByRole('link', { name: 'Add Users' })
            .or(this.page.getByRole('button', { name: 'Add Users' }))
            .first()
            .click();
    }

    async selectOrganization(orgName: string = testData.organization) {
        await this.page.getByRole('combobox').first().click();
        await this.page.getByRole('option', { name: orgName }).click();
        await this.page.keyboard.press('Escape');
    }

    async fillUserDetails(data: Partial<typeof D> = {}) {
        const firstName    = data.firstName    ?? D.firstName;
        const lastName     = data.lastName     ?? D.lastName;
        const email        = data.email        ?? `${D.email.split('@')[0]}_${Date.now()}@gmail.com`;
        const address1     = data.address1     ?? D.address1;
        const city         = data.city         ?? D.city;
        const state        = data.state        ?? D.state;
        const zipCode      = data.zipCode      ?? D.zipCode;
        const phoneNumber  = data.phoneNumber  ?? D.phoneNumber;

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

    async selectRole(roleName: string = D.role) {
        await this.page.locator('#demo-multiple-checkbox').last().click();
        await this.page.getByRole('option', { name: new RegExp(roleName, 'i') }).click();
        await this.page.keyboard.press('Escape');
    }

    async selectDOB(dob: string = D.dob) {
        const dobContainer = this.page.locator('.MuiInputBase-root', {
            has: this.page.getByRole('button', { name: 'Choose date' }),
        });
        await dobContainer.last().locator('input').fill(dob);
    }

    async saveUser() {
        await this.page.getByRole('button', { name: 'Save' }).click();
    }

    async filterByOrganization(orgName: string = testData.organization) {
        await this.page.getByRole('button').nth(2).click();
        await this.page.getByRole('combobox', { name: 'Organization(s)' }).click();
        await this.page.getByRole('combobox', { name: 'Organization(s)' }).fill(orgName.slice(0, 4));
        await this.page.getByRole('option', { name: orgName }).click();
        await this.page.getByText('User ListUsersUser List').click();
    }

    async viewUserProfile(index: number = 0) {
        await this.page.getByRole('link', { name: 'View Profile' }).nth(index).click();
    }

    async addFamilyMember(data: { firstName: string; lastName: string; city: string; dobYear: string; dobMonth: string }) {
        await this.page.getByRole('button', { name: 'Family Members' }).click();
        await this.page.locator("//button[@aria-label='Add Family Member']//*[name()='svg']").click();

        await this.page.locator('input[name="firstName"]').fill(data.firstName);
        await this.page.locator('input[name="lastName"]').fill(data.lastName);
        await this.page.locator('input[name="city"]').fill(data.city);

        // Convert month name (e.g. "June") to a two-digit number (e.g. "06")
        const monthMap: Record<string, string> = {
            January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
            July: '07', August: '08', September: '09', October: '10', November: '11', December: '12'
        };
        const mm = monthMap[data.dobMonth] || '01';
        const formattedDob = `${mm}/01/${data.dobYear}`;
        
        await this.selectDOB(formattedDob);

        await this.page.getByText('Gender').click();
        
        // Save the family member after all fields are filled
        await this.page.getByRole('button', { name: 'Save' }).click();
    }
}
