import { test as base, Page } from '@playwright/test';
import { LoginPage, PassPage, ProgramPage, UserPage } from '../pages';

type MyFixtures = {
    loginPage: LoginPage;
    loggedInPage: Page;
    passPage: PassPage;
    programPage: ProgramPage;
    userPage: UserPage;
};

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    loggedInPage: async ({ page, loginPage }, use) => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(); // Authenticate using centralized default credentials
        await use(page);
    },
    passPage: async ({ loggedInPage }, use) => {
        await use(new PassPage(loggedInPage));
    },
    programPage: async ({ loggedInPage }, use) => {
        await use(new ProgramPage(loggedInPage));
    },
    userPage: async ({ loggedInPage }, use) => {
        await use(new UserPage(loggedInPage));
    },
});

export { expect } from '@playwright/test';

