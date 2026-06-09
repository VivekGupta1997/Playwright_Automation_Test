import { test, expect } from '@playwright/test';
import { LoginPage, EventPage } from '../pages';

test('Add New Event Test', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes timeout

    const loginPage = new LoginPage(page);
    const eventPage = new EventPage(page);

    // Login first
    await loginPage.navigateToLoginPage();
    await loginPage.login();

    // Add Event Flow using simple POM methods
    await eventPage.navigateToAddEvent();
    await eventPage.fillEventDetails();
    await eventPage.fillTicketDetailsAndPublish();

    // Verify event was published successfully and redirected to the list
    await expect(page).toHaveURL(/.*\/events/);
});
