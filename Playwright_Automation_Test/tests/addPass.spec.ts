import { test, expect } from './fixtures';
import { DEFAULT_PASS_DATA } from './testData';

test('Add New Pass Test', async ({ passPage }) => {
    test.setTimeout(120000); // Pass creation flows can be complex

    await passPage.navigateToAddPass();
    await passPage.fillPassDetails(DEFAULT_PASS_DATA);
    await passPage.fillFeeDetailsAndPublish(DEFAULT_PASS_DATA.fee);

    // Verify pass was published successfully and redirected to the list
    await expect(passPage.page).toHaveURL(/.*\/passes/);
});

