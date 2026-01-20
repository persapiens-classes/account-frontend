const { defineConfig } = require('cypress');

let coverageTask;
try {
  coverageTask = require('@cypress/code-coverage/task');
} catch (e) {
  console.log('Code coverage plugin not found, skipping coverage setup', e.message);
  coverageTask = null;
}

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200', // frontend
    specPattern:
      process.env.CYPRESS_USE_MOCK === 'true'
        ? 'cypress/e2e/**/*-mock.cy.{js,ts}'
        : 'cypress/e2e/**/!(.*-mock).cy.{js,ts}',
    supportFile: 'cypress/support/e2e.{js,ts}',
    video: false,
    screenshotOnFailure: false,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 0,
    memoryLimit: 2048,
    viewportWidth: 1280,
    viewportHeight: 720,
    chromeWebSecurity: false,
    launchArgs: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    nodeVersion: 'bundled',
    timeout: 30000,
    setupNodeEvents(on, config) {
      if (coverageTask) {
        coverageTask(on, config);
      }
      return config;
    },
    env: {
      validUsername: process.env.CYPRESS_USERNAME || 'persapiens',
      validPassword: process.env.CYPRESS_PASSWORD || 'account',
      useMock: process.env.CYPRESS_USE_MOCK === 'true',
    },
  },
});
