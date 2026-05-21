import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: ['**/*.e2e.test.js', '**/*.spec.ts'],

  // globalSetup: require.resolve('./tests/e2e/global-setup.js'),

  // globalTeardown: require.resolve('./tests/e2e/global-teardown.js'),

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  use: {
    viewport: null, // Sets viewport to the actual browser window size
    launchOptions: {
      slowMo: 2000,
      args: ['--start-maximized'] // Maximizes the browser window on launch
    },
  },
});