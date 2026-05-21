import { test as base } from '@playwright/test';
import { LoginPage, PassPage, ProgramPage, UserPage } from '../pages';

type MyFixtures = {
    loginPage: LoginPage;
    passPage: PassPage;
    programPage: ProgramPage;
    userPage: UserPage;
};

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    passPage: async ({ page }, use) => {
        await use(new PassPage(page));
    },
    programPage: async ({ page }, use) => {
        await use(new ProgramPage(page));
    },
    userPage: async ({ page }, use) => {
        await use(new UserPage(page));
    },
});

export { expect } from '@playwright/test';
