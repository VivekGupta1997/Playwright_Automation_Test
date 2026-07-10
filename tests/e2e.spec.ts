import { test, expect } from './fixtures';

test('Complete End-to-End User and Offerings Management Flow', async ({
    loginPage,
    userPage,
    resourcePage,
    eventPage,
    programPage,
    passPage,
    sessionPage,
    seatCreationPage,
    seatBookingPage
}) => {
    test.setTimeout(900000); // 15 minutes

    // 1. Login
    await loginPage.navigateToLoginPage();
    await loginPage.login();

    // 2. Add User
    await userPage.navigateToUsersPage();
    await userPage.clickAddUsers();
    await userPage.selectOrganization();
    await userPage.fillUserDetails();
    await userPage.selectRole();
    await userPage.selectDOB();
    await userPage.saveUser();
    await expect(userPage.page).toHaveURL(/.*\/users/);

    // 3. Add Resource
    await resourcePage.navigateToAddResource();
    await resourcePage.fillResourceDetails();
    await resourcePage.fillFeeDetailsAndPublish();
    await expect(resourcePage.page).toHaveURL(/.*\/resources/);

    // 4. Add Event
    await eventPage.navigateToAddEvent();
    await eventPage.fillEventDetails();
    await eventPage.fillTicketDetailsAndPublish();
    await expect(eventPage.page).toHaveURL(/.*\/events/);

    // 5. Add Program
    await programPage.navigateToAddProgram();
    await programPage.fillProgramDetails();
    await programPage.fillFeeDetails();
    await programPage.addTaxAndPublish();
    await expect(programPage.page).toHaveURL(/.*\/programs/);

    // 6. Add Pass
    await passPage.navigateToAddPass();
    await passPage.fillPassDetails();
    await passPage.fillFeeDetailsAndPublish();
    await expect(passPage.page).toHaveURL(/.*\/passes/);

    // 7. Add Session
    await sessionPage.navigateToAddSession();
    await sessionPage.fillSessionDetails();
    await sessionPage.fillScheduleDetails();
    await sessionPage.fillFeeDetailsAndPublish();
    await expect(sessionPage.page).toHaveURL(/.*\/sessions/);

    // 8. Create Seat-Selection Event with Layout
    await seatCreationPage.navigateToAddEvent();
    await seatCreationPage.fillEventDetails();
    await seatCreationPage.enableSeatSelection();
    await seatCreationPage.createLayout();
    await seatCreationPage.proceedToTicketStep();
    await seatCreationPage.fillTicketAndPublish();
    await expect(seatCreationPage.page).toHaveURL(/.*\/events/);

    // 9. Book Seats for User
    await seatBookingPage.navigateToFullCatalog();
    await seatBookingPage.openEventOffering();
    await seatBookingPage.fillQuantity();
    await seatBookingPage.checkoutWithCash();
});


