import { test, expect } from './fixtures';

test('Book Offering from Scheduler Test', async ({ loginPage, schedulerPage, page }) => {
    test.setTimeout(240000); // 4 minutes timeout

    // Step 1: Login
    await loginPage.navigateToLoginPage();
    await loginPage.login(); // defaults to admin from testData.json

    // Step 2: Navigate to the scheduler for the organization
    await schedulerPage.navigateToScheduler('Etrak demo 3');

    // Step 3: Select a slot on the calendar grid
    await schedulerPage.selectTimeSlot(20);

    // Step 4: Fill description and notes
    await schedulerPage.fillBookingDetails('test', 'test notes');

    // Step 5: Select the user
    await schedulerPage.selectUser('test', 'Test, Nancy');

    // Step 6: Select resource/checkbox options
    await schedulerPage.selectResource(5);

    // Step 7: Add to cart, checkout, and complete the order
    await schedulerPage.addToCartAndCheckout();

    // Step 8: Return to the dashboard
    await schedulerPage.returnToDashboard();

    // Step 9: Verify return to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
});
