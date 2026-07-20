import { test, expect } from './fixtures';
import testData from '../testData.json';

test.describe('Point of Sale Tests', () => {
    test.setTimeout(240000); // 4 minutes

    test('Point of Sale Checkout with Pay Later (POM)', async ({ loginPage, posPage }) => {
        // 1. Navigate and Login
        await loginPage.navigateToLoginPage();
        await loginPage.login(testData.credentials.admin.username, testData.credentials.admin.password);

        // 2. Navigate to POS
        await posPage.navigateToPOS();

        // 3. Select Organization/Site
        await posPage.selectOrganization(testData.organization);

        // 4. Search and Select User
        await posPage.searchAndSelectUser('test', ', fam');

        // 5. Add First Item/Fee to Cart
        await posPage.addFirstFeeToCart();

        // 6. Checkout with Pay Later and Complete Order
        await posPage.checkoutAndCompleteOrderWithPayLater();

        // 7. Return to Dashboard
        await posPage.returnToDashboard();
    });

    test('Point of Sale Checkout with Pay Later (Raw Recorded)', async ({ page }) => {
        // This is the raw code provided by the user
        await page.goto('https://www.etrak-recsoftware.com/login');
        await page.getByRole('textbox', { name: 'Email Address / Username' }).click();
        await page.getByRole('textbox', { name: 'Email Address / Username' }).fill('vishal@gmail.com');
        await page.getByRole('textbox', { name: 'Email Address / Username' }).press('Tab');
        await page.getByRole('textbox', { name: 'Password' }).fill('vishaltiwari');
        await page.getByRole('button', { name: 'Sign in', exact: true }).click();
        await page.goto('https://www.etrak-recsoftware.com/');
        await page.getByRole('link', { name: 'Point of Sale' }).or(page.getByRole('button', { name: 'Point of Sale' })).first().click();
        await page.getByLabel('', { exact: true }).click();
        await page.getByRole('option', { name: 'Etrak demo 3' }).click();
        await page.getByRole('button', { name: 'directions' }).click();
        await page.getByRole('textbox', { name: 'Search for user by last name' }).click();
        await page.getByRole('textbox', { name: 'Search for user by last name' }).fill('test');
        await page.getByRole('textbox', { name: 'Search for user by last name' }).press('Enter');
        await page.getByRole('combobox', { name: 'Select User' }).click();
        await page.getByText(', fam').or(page.getByText('Test, TestUser')).first().click();
        await page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-colorPrimary.css-h6l4cr').first().click();
        await page.getByRole('button', { name: /-\s*\$/ }).first().click();
        await page.getByRole('button', { name: 'cart' }).click();
        await page.getByRole('button', { name: 'Check Out' }).click();
        await page.getByRole('button', { name: 'Complete Order' }).waitFor({ state: 'visible' });
        const payLaterCheckbox = page.getByRole('checkbox', { name: 'Pay Later Allow user to pay' });
        if (await payLaterCheckbox.isVisible()) {
            await payLaterCheckbox.check();
        }
        await page.getByRole('button', { name: 'Complete Order' }).click();
        const dashboardBtn = page.getByRole('button', { name: 'Dashboard' }).or(page.getByLabel('mailbox folders').getByRole('button', { name: 'Dashboard' })).first();
        if (!await dashboardBtn.isVisible()) {
            await page.getByRole('button').first().click();
        }
        await dashboardBtn.click();
    });
});
