const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200', // frontend
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.{js,ts}',
    video: false,
    screenshotOnFailure: false,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 0,
    viewportWidth: 1280,
    viewportHeight: 720,
    chromeWebSecurity: false,
    env: {
      validUsername: process.env.CYPRESS_USERNAME || 'persapiens',
      validPassword: process.env.CYPRESS_PASSWORD || 'account',
      useMock: process.env.CYPRESS_USE_MOCK === 'true',
    },
  },
});
