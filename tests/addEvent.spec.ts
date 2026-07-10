import { test, expect } from './fixtures';

test('Add New Event Test', async ({ loginPage, eventPage }) => {
    test.setTimeout(240000);

    await loginPage.navigateToLoginPage();
    await loginPage.login();

    await eventPage.navigateToAddEvent();
    await eventPage.fillEventDetails();
    await eventPage.fillTicketDetailsAndPublish();

    await expect(eventPage.page).toHaveURL(/.*\/events/);
});
