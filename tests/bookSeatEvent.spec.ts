import { test, expect } from './fixtures';

// All data from testData.json → seatBookingEvent.booking
test('Book Seats for User in Seat-Selection Event', async ({ loginPage, seatBookingPage }) => {
    test.setTimeout(180000);

    await loginPage.navigateToLoginPage();
    await loginPage.login();

    await seatBookingPage.navigateToFullCatalog();
    await seatBookingPage.openEventOffering();
    await seatBookingPage.fillQuantity();
    await seatBookingPage.checkoutWithCash();

    await expect(
        seatBookingPage.page.getByRole('button', { name: 'Complete Order' })
    ).toBeHidden({ timeout: 15000 });
});
