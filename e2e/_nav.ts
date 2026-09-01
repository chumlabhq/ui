import { expect, type Page } from "@playwright/test";

/**
 * Navigation that fails loudly when it lands somewhere else.
 *
 * The whole e2e suite spent an unknown period asserting against the marketing
 * home page: every spec navigated to `/demo/<name>`, which has not existed
 * since the demo routes moved to the root, and `src/App.tsx` redirects anything
 * unmatched to `/`. Nothing noticed, because most assertions sat behind
 * existence guards that pass when the element is absent (E2E-INVENTORY.md).
 *
 * A redirect is silent by design, so the only way to catch one is to check the
 * URL you ended up at against the one you asked for, and to require a marker
 * that only the intended page carries.
 */

/**
 * Only ever called on the failure path. Reading the heading eagerly meant
 * `textContent()` waiting out the whole test timeout on any page without an
 * `h1` — a fixture page, for instance — so building the error message became
 * the slowest thing in the suite.
 */
const describeLanding = async (page: Page, requested: string) => {
  const landed = new URL(page.url()).pathname;
  const heading = await page
    .locator("h1")
    .first()
    .textContent({ timeout: 1000 })
    .catch(() => null);
  return (
    `navigated to "${requested}" but landed on "${landed}"` +
    (heading ? ` (h1: ${JSON.stringify(heading.trim().slice(0, 60))})` : "") +
    `. A redirect to "/" means the route does not exist.`
  );
};

/** Navigates and asserts only that the resolved URL is the one requested. */
async function gotoAsserted(page: Page, path: string): Promise<void> {
  // `domcontentloaded`, not the default `load`: the site pulls third-party
  // scripts that CSP blocks, and waiting for `load` stalls until the test
  // timeout — which reads as "the fixture never rendered".
  await page.goto(path, { waitUntil: "domcontentloaded" });

  // The redirect is client-side: at `domcontentloaded` the URL is still the one
  // that was asked for, and the router rewrites it a tick later. Checking too
  // early is how a guard against silent redirects would itself be silent.
  // Polling the pathname rather than waiting for `networkidle`, which the dev
  // server's HMR socket can keep from ever settling.
  await page
    .waitForFunction(
      (expected) => window.location.pathname !== expected,
      path,
      { timeout: 1500 },
    )
    .catch(() => {
      /* no redirect within the window is the good case */
    });

  const landed = new URL(page.url()).pathname;
  if (landed !== path) {
    expect(landed, await describeLanding(page, path)).toBe(path);
  }
}

/** Navigates to `path` and asserts both the resolved URL and a page marker. */
export async function gotoGuarded(
  page: Page,
  path: string,
  marker: string,
): Promise<void> {
  await gotoAsserted(page, path);
  await expect(
    page.locator(marker),
    `landed on "${path}" but its identifying element (${marker}) is absent`,
  ).toBeAttached({ timeout: 10000 });
}

/** URL slug for a registry name: `RadioButton/RadioButton` -> `RadioButton.RadioButton`. */
export const fixtureSlug = (component: string) => component.replace("/", ".");

export const fixturePath = (component: string, fixture: string) =>
  `/__fixtures/${fixtureSlug(component)}/${fixture}`;

/**
 * Navigates to one fixture page and asserts it is the one that rendered.
 *
 * Specs use this instead of a demo URL: a fixture page has no prose to drift,
 * which is what took 103 tests with it when a heading was renamed.
 */
export async function gotoFixture(
  page: Page,
  component: string,
  fixture: string,
): Promise<void> {
  const path = fixturePath(component, fixture);
  await gotoAsserted(page, path);

  // Checked before the marker, not after: the route renders a diagnostic page
  // rather than throwing on a miss, so waiting for a marker that will never
  // arrive would burn the timeout before reporting the real problem.
  await expect(
    page.locator("[data-fixture-error]"),
    `no fixture "${fixture}" for "${component}" — see /__fixtures for the list`,
  ).toHaveCount(0, { timeout: 5000 });

  await expect(
    page.locator(`[data-fixture="${component}/${fixture}"]`),
    `"${path}" resolved but rendered no fixture`,
  ).toBeAttached({ timeout: 10000 });
}
