import { defineConfig, devices } from "@playwright/test";
import { guardRun } from "./e2e/_machine";

/**
 * WebKit and Mobile Safari: one worker, no video.
 *
 * This is an 8 GB Mac. One WebKit worker's browser alone peaks at 1.3 to
 * 1.8 GB, and with video on every page also pipes its frames to an ffmpeg. The
 * webkit project at 2 workers with video on pushed swap to 5.2 GB and the run
 * was killed (X1R), and the default here is 4 workers.
 *
 * Measured on forms + pagination + flex-shrink (100 tests), sampling every
 * 10 s. 2026-10-21, 4 workers with video: 4 WebContent + 6 ffmpeg, peak
 * 2.9 GB, swap +181 to +586 MB. 2026-10-26, 1 worker: with video, 98 passed,
 * peak load1 5.89, memory free 68% down to 32%; without, 98 passed, peak load1
 * 3.23, 69% down to 35%, swap +0. One worker is what keeps memory off the 25%
 * line; video at one worker costs load rather than memory (one ffmpeg, the
 * browser's own swing is larger), and load is what the flaky WebKit runs had
 * in common, so it stays off.
 *
 * Per project, so chromium and firefox keep their parallelism. Mobile Chrome
 * is Chromium and keeps it too: the same 100 tests at 4 workers with video,
 * 100 passed, peak load1 6.05, memory free 69% down to 42%, swap +0
 * (2026-10-26). The machine guard in `e2e/_machine.ts` still applies to it.
 *
 * Neither setting is what stalled WebKit every 64th test; that was a thread
 * leak in WebKit's browser process, fixed by `browser` in `e2e/_test.ts`.
 */
const ONE_AT_A_TIME = {
  workers: 1,
  use: { video: "off" as const },
};

const config = defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // CI: two, stated rather than inherited. At one, CI's chromium job never
  // finished: its 660 tests take 72.8 min on one worker (measured locally with
  // CI=true, 2026-10-31), and every run that reached them was killed by the
  // job's 30-minute timeout at about test 188 — the same test this machine had
  // reached at 30 minutes. Two is Playwright's own default on the 4-vCPU
  // runner, and the job is also sharded four ways in .github/workflows/ci.yml.
  // Locally, unset: half the cores.
  workers: process.env.CI ? 2 : undefined,
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
      testIgnore: /(accessibility-full|contrast-painted|default-state|visual)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testIgnore: /(accessibility-full|contrast-painted|default-state|visual)\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testIgnore: /(accessibility-full|contrast-painted|default-state|visual)\.spec\.ts/,
      ...ONE_AT_A_TIME,
      use: { ...devices["Desktop Safari"], ...ONE_AT_A_TIME.use },
    },
    // Mobile viewports
    {
      name: "Mobile Chrome",
      testIgnore: /(accessibility-full|contrast-painted|default-state|visual)\.spec\.ts/,
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      testIgnore: /(accessibility-full|contrast-painted|default-state|visual)\.spec\.ts/,
      ...ONE_AT_A_TIME,
      use: { ...devices["iPhone 12"], ...ONE_AT_A_TIME.use },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 120000,
  },
});

guardRun(config.projects!.map((p) => p.name!));

export default config;
