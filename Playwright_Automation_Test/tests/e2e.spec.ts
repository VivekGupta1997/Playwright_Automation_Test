import { test, expect } from '@playwright/test';
import { 
    LoginPage, 
    UserPage, 
    ResourcePage, 
    EventPage, 
    ProgramPage, 
    PassPage, 
    SessionPage 
} from '../pages';

test('Complete End-to-End User and Offerings Management Flow', async ({ page }) => {
    test.setTimeout(480000); // 8 minutes timeout to comfortably accommodate slowMo and all sequential steps

    const loginPage = new LoginPage(page);
    const userPage = new UserPage(page);
    const resourcePage = new ResourcePage(page);
    const eventPage = new EventPage(page);
    const programPage = new ProgramPage(page);
    const passPage = new PassPage(page);
    const sessionPage = new SessionPage(page);

    // 1. Admin Login
    await loginPage.navigateToLoginPage();
    await loginPage.login();

    // 2. Add New User Flow
    await userPage.navigateToUsersPage();
    await userPage.clickAddUsers();
    await userPage.selectOrganization();
    await userPage.fillUserDetails();
    await userPage.selectRole();
    await userPage.selectDOB();
    await userPage.saveUser();
    await expect(page).toHaveURL(/.*\/users/);

    // 3. Add New Resource Flow
    await resourcePage.navigateToAddResource();
    await resourcePage.fillResourceDetails();
    await resourcePage.fillFeeDetailsAndPublish();
    await expect(page).toHaveURL(/.*\/resources/);

    // 4. Add New Event Flow
    await eventPage.navigateToAddEvent();
    await eventPage.fillEventDetails();
    await eventPage.fillTicketDetailsAndPublish();
    await expect(page).toHaveURL(/.*\/events/);

    // 5. Add New Program Flow
    await programPage.navigateToAddProgram();
    await programPage.fillProgramDetails();
    await programPage.fillFeeDetails();
    await programPage.addTaxAndPublish();
    await expect(page).toHaveURL(/.*\/programs/);

    // 6. Add New Pass Flow
    await passPage.navigateToAddPass();
    await passPage.fillPassDetails();
    await passPage.fillFeeDetailsAndPublish();
    await expect(page).toHaveURL(/.*\/passes/);

    // 7. Add New Session Flow
    await sessionPage.navigateToAddSession();
    await sessionPage.fillSessionDetails();
    await sessionPage.fillScheduleDetails();
    await sessionPage.fillFeeDetailsAndPublish();
    await page.getByRole('link', { name: 'Session List View' }).click();
    await expect(page).toHaveURL(/.*\/sessions/);
});
