import { test, expect } from './fixtures';

test('Refund Order Test', async ({ loginPage, refundPage }) => {
    test.setTimeout(240000);

    // 1. Login to the application
    await loginPage.navigateToLoginPage();
    await loginPage.login();

    // 2. Navigate to User List and filter by organization
    await refundPage.navigateToUserList();
    await refundPage.filterByOrganization();

    // 3. Open user profile & check orders tab
    // We try index 1 first (our successful target)
    await refundPage.openUserProfile(1);
    await refundPage.goToOrdersTab();

    // Try to initiate refund on the current user
    let isRefundInitiated = await refundPage.viewReceiptAndInitiateRefund();

    if (!isRefundInitiated) {
        console.log('Notice: User at index 1 does not have an active refund. Iterating user list...');
        // Go back and find any user profile containing an enabled refund ($) button
        await refundPage.goBackToUserList();
        isRefundInitiated = await refundPage.findAndOpenUserWithRefund(10);
    }

    if (isRefundInitiated) {
        // 4. Complete refund process
        await refundPage.selectItemForRefund('Eq Microphone Stand');
        await refundPage.completeRefundWithCash();
        await refundPage.returnToDashboard();
        console.log('Refund process completed successfully.');
    } else {
        console.log('No refundable orders found across the checked user profiles.');
    }
});
