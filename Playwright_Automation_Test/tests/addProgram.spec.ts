import { test, expect } from './fixtures';
import { DEFAULT_PROGRAM_DATA } from './testData';

test('Add New Program Test', async ({ programPage }) => {
    test.setTimeout(120000); // Calendar and time selections can take longer

    await programPage.navigateToAddProgram();
    await programPage.fillProgramDetails(DEFAULT_PROGRAM_DATA);
    await programPage.fillFeeDetails(DEFAULT_PROGRAM_DATA.fee);
    await programPage.addTaxAndPublish(DEFAULT_PROGRAM_DATA.tax);

    // Verify program was published successfully and redirected to the list
    await expect(programPage.page).toHaveURL(/.*\/programs/);
});


