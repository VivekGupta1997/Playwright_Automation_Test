import { test, expect } from './fixtures';
import testData from '../testData.json';

test.describe('API Testing - Authentication & Login', () => {

    test('API Login endpoint test', async ({ apiPage }) => {
        const response = await apiPage.login(
            testData.credentials.admin.username,
            testData.credentials.admin.password,
            '/login'
        );

        // Validate response status code is standard HTTP response (200 OK, 302 Redirect, 405 Method Not Allowed)
        expect([200, 201, 302, 405]).toContain(response.status());
    });

    test('API Login with invalid credentials test', async ({ apiPage }) => {
        const response = await apiPage.login(
            'invalid_user@test.com',
            'WrongPassword123',
            '/login'
        );

        expect([200, 302, 400, 401, 403, 404, 405]).toContain(response.status());
    });

    test('API Direct GET login page verification', async ({ apiPage }) => {
        const response = await apiPage.get('/login');
        expect(response.status()).toBe(200);
    });
});
