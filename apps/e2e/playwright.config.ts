import { defineConfig, devices } from "@playwright/test";
import { CI } from "./playwright/config";

const isCI = !!CI;

/* See https://playwright.dev/docs/test-configuration. */

export default defineConfig({
  testDir: "./playwright",
  testMatch: "*/*.e2e.ts",
  fullyParallel: true /* Run tests in files in parallel */,
  forbidOnly: isCI /* test.only */,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,
  reporter: "html" /* See https://playwright.dev/docs/test-reporters */,
  /*  See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "cd ../../.docker && docker compose -f docker-compose.dev.yml up",
    url: "http://localhost:8080/api/user/me", // return 403 -> start tests
    reuseExistingServer: !isCI,
    timeout: 500000, // arbitrarily large, incase docker env needs to be built
  },
  // globalSetup: "./playwright/globals/setup.ts",
  globalTeardown: "./playwright/globals/teardown.ts",
});
