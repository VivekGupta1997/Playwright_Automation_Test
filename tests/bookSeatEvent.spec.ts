import { test, expect } from './fixtures';

// All data from testData.json → seatBookingEvent.booking
test('Book Seats for User in Seat-Selection Event', async ({ loginPage, seatBookingPage }) => {
    test.setTimeout(240000);

    // 1. Login to application
    await loginPage.navigateToLoginPage();
    await loginPage.login();

    // 2. Select event offering from catalog UI
    await seatBookingPage.selectSeatEvent('Etrak demo 3', 'Etrak demo 3 Event with seat');

    // 3. Select user with available seats (inspects dropdown and selects user who has seats, falling back if limit reached)
    await seatBookingPage.selectUserWithAvailableSeats(
        'test',
        'More, Steven',
        [
            { lastName: 'new', fullName: 'new, ranger' },
            { lastName: 'carry', fullName: 'carry, alex' }
        ],
        '02'
    );

    // 4. Select seats and add to cart
    await seatBookingPage.selectSeatsAndAddToCart(2);

    // 5. Complete cash checkout
    await seatBookingPage.checkoutWithCash();

    // 6. Verify order completion
    await expect(
        seatBookingPage.page.getByRole('button', { name: 'Complete Order' })
    ).toBeHidden({ timeout: 15000 });
});
