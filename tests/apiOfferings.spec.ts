import { test, expect } from './fixtures';
import testData from '../testData.json';

test.describe('API Testing - Offerings & Resources Creation', () => {

    test('Create Program Offering via API', async ({ apiPage }) => {
        const timestamp = Date.now();
        const programPayload = {
            name: `API Program ${timestamp}`,
            organization: testData.organization,
            connectedResource: testData.program.connectedResource,
            maxAttendance: testData.program.maxAttendance,
            fee: {
                name: testData.program.fee.name,
                amount: testData.program.fee.amount,
                gla: testData.program.fee.gla
            }
        };

        const response = await apiPage.createProgram(programPayload);
        expect(response.status()).toBeLessThan(500);
    });

    test('Fetch Program Offerings via API', async ({ apiPage }) => {
        const response = await apiPage.getPrograms();
        expect(response.status()).toBeLessThan(500);
    });

    test('Create Pass Offering via API', async ({ apiPage }) => {
        const timestamp = Date.now();
        const passPayload = {
            name: `API Pass ${timestamp}`,
            passType: testData.pass.passType,
            passLevel: testData.pass.passLevel,
            numberPunches: testData.pass.numberPunches,
            organization: testData.organization,
            fee: {
                name: testData.pass.fee.name,
                amount: testData.pass.fee.amount,
                gla: testData.pass.fee.gla
            }
        };

        const response = await apiPage.createPass(passPayload);
        expect(response.status()).toBeLessThan(500);
    });

    test('Fetch Pass Offerings via API', async ({ apiPage }) => {
        const response = await apiPage.getPasses();
        expect(response.status()).toBeLessThan(500);
    });

    test('Create Event Offering via API', async ({ apiPage }) => {
        const timestamp = Date.now();
        const eventPayload = {
            name: `API Event ${timestamp}`,
            connectedResource: testData.event.connectedResource,
            maxAttendance: testData.event.maxAttendance,
            userTicketLimit: testData.event.userTicketLimit,
            familyTicketLimit: testData.event.familyTicketLimit,
            organization: testData.organization
        };

        const response = await apiPage.createEvent(eventPayload);
        expect(response.status()).toBeLessThan(500);
    });

    test('Create Resource via API', async ({ apiPage }) => {
        const timestamp = Date.now();
        const resourcePayload = {
            name: `API Resource ${timestamp}`,
            connectedResource: testData.resource.connectedResource,
            organization: testData.organization
        };

        const response = await apiPage.createResource(resourcePayload);
        expect(response.status()).toBeLessThan(500);
    });
});
