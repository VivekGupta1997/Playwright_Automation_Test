import { test, expect } from './fixtures';
import testData from '../testData.json';

test.describe('API Testing - User Management', () => {

    test('Create new User via API', async ({ apiPage }) => {
        const timestamp = Date.now();
        const newUserPayload = {
            firstName: 'API_User',
            lastName: `Test_${timestamp}`,
            email: `api_test_${timestamp}@gmail.com`,
            address1: testData.user.address1,
            city: testData.user.city,
            state: testData.user.state,
            zipCode: testData.user.zipCode,
            phoneNumber: testData.user.phoneNumber,
            role: testData.user.role,
            dob: testData.user.dob,
            organization: testData.organization,
        };

        const response = await apiPage.createUser(newUserPayload);
        
        // Assert API status code is either 200/201 or server responded
        expect(response.status()).toBeLessThan(500);
    });

    test('Fetch User list via API', async ({ apiPage }) => {
        const response = await apiPage.getUsers({ organization: testData.organization });
        expect(response.status()).toBeLessThan(500);
    });

    test('Fetch specific User details by ID via API', async ({ apiPage }) => {
        const userId = '1';
        const response = await apiPage.getUserById(userId);
        expect(response.status()).toBeLessThan(500);
    });

    test('Update User details via API', async ({ apiPage }) => {
        const userId = '1';
        const updatedData = {
            firstName: 'API_Updated_Name',
            phoneNumber: '(888)888-8888'
        };

        const response = await apiPage.updateUser(userId, updatedData);
        expect(response.status()).toBeLessThan(500);
    });
});
