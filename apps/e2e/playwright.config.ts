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
  // reporter: "html" /* See https://playwright.dev/docs/test-reporters */,
  // reporter: [["html", { open: "never" }]],
  reporter: "html",
  /*  See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: "http://localhost:9090",
    // baseURL: "http://nginx-prod:80",
    // baseURL: "local",
    // baseURL: "ws://nginx-prod",
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      // teardown: "./teardown.ts",
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
  // current issue where webserver is sent SIGKILL and doesn't allow clean up
  // ref: https://github.com/microsoft/playwright/issues/18209
  webServer: {
    command: "cd ../../.docker && docker compose -f docker-compose.playwright.yml up",
    url: "http://localhost:9090/api/user/me", // return 403 -> start tests
    reuseExistingServer: !isCI,
    timeout: 500000, // arbitrarily large, incase docker env needs to be built
    stderr: "pipe",
    stdout: "pipe",
  },
  // webServer: {
  //   command: "",
  //   url: "http://nginx-prod/api/user/me",
  //   reuseExistingServer: true,
  // },
});
