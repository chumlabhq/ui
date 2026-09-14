import { defineConfig, devices } from "@playwright/test";

/**
 * Razorpay's checkout script, unreachable in every Chromium project.
 *
 * `index.html` loads it with `defer`, and DOMContentLoaded waits for deferred
 * scripts, so every navigation in the suite — `load` and `domcontentloaded`
 * alike — waited on checkout.razorpay.com answering. Holding that host for 35s
 * timed out both the Pagination spec's wait and _nav.ts's. No fixture or demo
 * under test uses the checkout, so the name is made to fail to resolve and the
 * script errors at once rather than whenever the network answers. Firefox and
 * WebKit are in no gate and take no Chromium switches.
 */
const CHROMIUM = {
  launchOptions: { args: ["--host-resolver-rules=MAP checkout.razorpay.com ~NOTFOUND"] },
};

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
  // Stated, not inherited. Without this block every assertion carried
  // Playwright's own 5s expect timeout and every screenshot its own comparison
  // defaults — numbers nobody on this project chose, in gates whose whole
  // purpose is to hold a chosen number still.
  expect: {
    // Long enough for an anchored surface to settle on a cold dev server,
    // short enough that a genuinely stuck locator fails the run rather than
    // hanging it.
    timeout: 10_000,
    toHaveScreenshot: {
      // The per-call sites in visual.spec.ts restate both of these. Repeated
      // here so a NEW screenshot assertion written anywhere in e2e/ inherits a
      // number this project picked rather than Playwright's 0.2, which was
      // wide enough to hide an entire skeleton fill going transparent.
      //
      // One, not 30. The whole suite at `maxDiffPixels: 0` differs by exactly
      // zero pixels on 437 of 437 comparisons, so 30 was pure slack — enough
      // to hide a 14x14 check glyph (8 px), a 16x16 chevron (6) or a 20px
      // loader recoloured into its own background. `visual.spec.ts` carries
      // the full measurement and the four subjects this still cannot reach.
      maxDiffPixels: 1,
      threshold: 0.05,
      animations: "disabled",
    },
  },
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
      testMatch: /(accessibility-full|contrast-painted|default-state)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], ...CHROMIUM },
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
      use: { ...devices["Desktop Chrome"], ...CHROMIUM },
    },
    {
      name: "chromium",
      testIgnore: /(accessibility-full|contrast-painted|default-state|visual)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], ...CHROMIUM },
    },
    {
      name: "firefox",
      testIgnore: /(accessibility-full|contrast-painted|default-state|visual)\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testIgnore: /(accessibility-full|contrast-painted|default-state|visual)\.spec\.ts/,
      use: { ...devices["Desktop Safari"] },
    },
    // Mobile viewports
    {
      name: "Mobile Chrome",
      testIgnore: /(accessibility-full|contrast-painted|default-state|visual)\.spec\.ts/,
      use: { ...devices["Pixel 5"], ...CHROMIUM },
    },
    {
      name: "Mobile Safari",
      testIgnore: /(accessibility-full|contrast-painted|default-state|visual)\.spec\.ts/,
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
