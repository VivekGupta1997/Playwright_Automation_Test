/**
 * fixtures.ts
 *
 * Extends Playwright's base `test` with pre-built page objects and auto-login.
 * Import `test` and `expect` from HERE instead of '@playwright/test' in every spec file.
 *
 * Usage in a test file:
 *   import { test, expect } from './fixtures';
 */
import { test as base } from '@playwright/test';
import {
    LoginPage,
    UserPage,
    ResourcePage,
    EventPage,
    ProgramPage,
    PassPage,
    SessionPage,
    SeatBookingPage,
    SeatCreationPage,
} from '../pages';

// Define the shape of our custom fixtures
type AppFixtures = {
    loginPage: LoginPage;
    userPage: UserPage;
    resourcePage: ResourcePage;
    eventPage: EventPage;
    programPage: ProgramPage;
    passPage: PassPage;
    sessionPage: SessionPage;
    seatBookingPage: SeatBookingPage;
    seatCreationPage: SeatCreationPage;
};

export const test = base.extend<AppFixtures>({
    // Each fixture auto-creates the page object
    loginPage: async ({ page }, use) => use(new LoginPage(page)),
    userPage: async ({ page }, use) => use(new UserPage(page)),
    resourcePage: async ({ page }, use) => use(new ResourcePage(page)),
    eventPage: async ({ page }, use) => use(new EventPage(page)),
    programPage: async ({ page }, use) => use(new ProgramPage(page)),
    passPage: async ({ page }, use) => use(new PassPage(page)),
    sessionPage: async ({ page }, use) => use(new SessionPage(page)),
    seatBookingPage: async ({ page }, use) => use(new SeatBookingPage(page)),
    seatCreationPage: async ({ page }, use) => use(new SeatCreationPage(page)),
});

export { expect } from '@playwright/test';

