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
 *
 * The catch-all renders a 404 page now instead of redirecting to "/", so an
 * unknown route keeps its URL and the comparison above cannot see it. The 404
 * page carries `data-route-404` for exactly this reason.
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
    `. Landing anywhere else means the route redirected.`
  );
};

/**
 * Navigates and asserts only that the resolved URL is the one requested.
 *
 * `rendered` names every finished page the route can render. With it, the wait
 * ends when one of them is in the document or the URL changes, whichever comes
 * first; without it, the redirect window below runs its full 1.5s, because a
 * caller's own marker (`body`, say) can attach before a 404 page has rendered.
 */
async function gotoAsserted(page: Page, url: string, rendered?: string): Promise<void> {
  // The query string carries the `classes` probe; only the path identifies the
  // page, and comparing the whole URL would fail every probed navigation.
  const path = url.split("?")[0];
  // `domcontentloaded`, not the default `load`: the site pulls third-party
  // scripts that CSP blocks, and waiting for `load` stalls until the test
  // timeout — which reads as "the fixture never rendered".
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // The redirect is client-side: at `domcontentloaded` the URL is still the one
  // that was asked for, and the router rewrites it a tick later. Checking too
  // early is how a guard against silent redirects would itself be silent.
  // Polling the pathname rather than waiting for `networkidle`, which the dev
  // server's HMR socket can keep from ever settling.
  //
  // A fixture route says when it has become its fixture: `data-fixture-act`
  // leaves "pending" once its act has run, and is "none" from the first commit
  // of a fixture without one; a miss renders the error or 404 page instead.
  // Then every finite animation and transition on the page has to have ended,
  // and stayed ended for 150 ms, so a drawer that slides in on mount is where
  // it will stay. One that would outlast the wait is the page's resting state,
  // not its arrival, and is not waited on: a spinner that loops forever, or a
  // toast's countdown, 600 s in the Toast provider fixtures. The 150 ms is
  // three polls, not a delay: Drawer/tall-left reports its act "none" at
  // 739 ms and starts its 300 ms slide one frame later, at 767.
  //
  // The window was 1.5s of every `gotoFixture` call: 10.5 of the 12 s the
  // TimePicker typing test took alone in firefox, seven calls in one test.
  // Under the full firefox project at four workers it and loader-paint, a call
  // per Loader fixture, both ran out their 30 s inside it. Each half of the
  // condition was measured missing: on `[data-fixture]` alone, Table/
  // cell-editing's act double-clicked the cell after the caller's own
  // double-click, so Enter left an editor open; on the act alone, Drawer/
  // tall-left and tall-bottom were still sliding in when overlay-reach read
  // where the last control was. Polled on an interval rather than on frames:
  // `data-fixture-still`, which waits on frames, once stayed pending past 15 s
  // on a page that had rendered.
  if (rendered) {
    await page
      .waitForFunction(
        ({ expected, selector }) => {
          if (window.location.pathname !== expected) return true;
          const held = window as unknown as { gotoHeldSince?: number };
          const finished =
            !!document.querySelector(selector) &&
            document.getAnimations().every((a) => {
              const timing = a.effect?.getComputedTiming();
              return a.playState !== "running" || !timing || Number(timing.endTime) - Number(timing.localTime ?? 0) > 15000;
            });
          if (!finished) {
            held.gotoHeldSince = undefined;
            return false;
          }
          held.gotoHeldSince ??= performance.now();
          return performance.now() - held.gotoHeldSince >= 150;
        },
        { expected: path, selector: rendered },
        { timeout: 15000, polling: 50 },
      )
      .catch(() => {
        throw new Error(
          `"${path}" did not render one of ${rendered} with its animations ended in 15s, and its URL did not change`,
        );
      });
  } else {
    await page
      .waitForFunction(
        (expected) => window.location.pathname !== expected,
        path,
        { timeout: 1500 },
      )
      .catch(() => {
        /* no redirect within the window is the good case */
      });
  }

  const landed = new URL(page.url()).pathname;
  if (landed !== path) {
    expect(landed, await describeLanding(page, path)).toBe(path);
  }

  // The app has rendered by now — one of its pages is in the document, or the
  // redirect window has run out — so this needs no timeout of its own.
  const notFound = await page.locator("[data-route-404]").count();
  expect(
    notFound,
    `navigated to "${path}" and the site answered its 404 page. The route does not exist.`,
  ).toBe(0);
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

/**
 * Navigates to the fixture index and waits for it to have enumerated.
 *
 * The index renders its container on the first commit and fills the list from
 * an async effect, so `[data-fixture-index]` is attached before there is
 * anything behind it. Every spec that enumerates fixtures goes through here
 * rather than asserting the count itself: a guard each caller has to remember
 * is one the next caller will not.
 */
export async function gotoFixtureIndex(page: Page): Promise<void> {
  await gotoGuarded(page, "/__fixtures", "[data-fixture-index]");
  await expect(
    page.locator("[data-fixture-index-ready]"),
    "the fixture index never finished enumerating — it renders its container " +
      "before the list, so reading links now would read an empty page",
  ).toBeAttached({ timeout: 30000 });
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
  /** `classes` sentinels for the browser-tier key re-attempt; see FixtureRoute. */
  probe?: { classes: Record<string, string> },
): Promise<void> {
  const path =
    fixturePath(component, fixture) +
    (probe ? `?classes=${encodeURIComponent(JSON.stringify(probe.classes))}` : "");
  await gotoAsserted(
    page,
    path,
    'main[data-fixture-act]:not([data-fixture-act="pending"]), [data-fixture-error], [data-route-404]',
  );

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

/** Serves every fixture document as `<html dir="rtl">`; everything else falls through to the harness's routes. */
export async function servedRtl(page: Page): Promise<void> {
  await page.route(/\/__fixtures(\/|$)/, async (route) => {
    if (route.request().resourceType() !== "document") return route.fallback();
    const response = await route.fetch();
    const body = (await response.text()).replace(/<html([^>]*)>/, '<html$1 dir="rtl">');
    await route.fulfill({ response, body });
  });
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { animation: none !important; transition: none !important; }";
    document.documentElement.appendChild(style);
  });
}
