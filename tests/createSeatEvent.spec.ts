import { test, expect } from './fixtures';

// All data from testData.json → seatBookingEvent
test('Create Seat-Selection Event with Layout', async ({ loginPage, seatCreationPage }) => {
    test.setTimeout(240000);

    await loginPage.navigateToLoginPage();
    await loginPage.login();

    await seatCreationPage.navigateToAddEvent();
    await seatCreationPage.fillEventDetails();
    await seatCreationPage.enableSeatSelection();
    await seatCreationPage.createLayout();
    await seatCreationPage.proceedToTicketStep();
    await seatCreationPage.fillTicketAndPublish();

    await expect(seatCreationPage.page).toHaveURL(/.*\/events/);
});
