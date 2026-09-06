import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // `_reconcile-reporter` is last so its one-line verdict is the final thing
  // printed. The summary of the `list` reporter puts `N failed` above a long
  // failure list and `N passed` at the very bottom, which is why reading the
  // tail of a run showed a passing count while 1191 tests were failing.
  reporter: [
    ["html", { open: "on-failure" }],
    ["list"],
    ["./e2e/_reconcile-reporter.ts"],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    /**
     * The full accessibility sweep: every fixture of every component, not one
     * per component. Minutes long, so it is its own project and every other
     * project ignores it — `npx playwright test --project=a11y-full`.
     *
     * It has its own project rather than a tag because the sweep needs a much
     * longer timeout than any behavioural spec should be allowed.
     */
    {
      name: "a11y-full",
      // The painted-contrast sweep runs here too: it walks the same 367 fixture
      // pages, twice each for the two themes, which is the same shape of cost.
      testMatch: /(accessibility-full|contrast-painted)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    /**
     * Visual baselines. Its own project for the same reason `a11y-full` is:
     * 30 components x 6 widths x 2 themes is minutes, and running it in all
     * five browser projects would multiply the baselines by five for no extra
     * signal — a spacing change shows in one engine as well as in all of them.
     */
    {
      name: "visual",
      testMatch: /visual\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium",
      testIgnore: /(accessibility-full|contrast-painted|visual)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testIgnore: /(accessibility-full|contrast-painted|visual)\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testIgnore: /(accessibility-full|contrast-painted|visual)\.spec\.ts/,
      use: { ...devices["Desktop Safari"] },
    },
    // Mobile viewports
    {
      name: "Mobile Chrome",
      testIgnore: /(accessibility-full|contrast-painted|visual)\.spec\.ts/,
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      testIgnore: /(accessibility-full|contrast-painted|visual)\.spec\.ts/,
      use: { ...devices["iPhone 12"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
