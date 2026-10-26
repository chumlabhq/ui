import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test as base, type Browser, type BrowserContext, type Route } from "@playwright/test";

export * from "@playwright/test";

/**
 * Hosts no spec may reach: Razorpay's checkout and everything it loads.
 *
 * `index.html` loads checkout.razorpay.com with `defer`, and DOMContentLoaded
 * waits for deferred scripts, so every navigation in the suite — `load` and
 * `domcontentloaded` alike — waited on that host answering. Holding it for 35s
 * timed out both the Pagination spec's wait and _nav.ts's. No fixture or demo
 * under test uses the checkout, so the request is aborted and the script
 * errors at once rather than whenever the network answers.
 *
 * Google Tag Manager and Clarity are not listed: the dev server's CSP refuses
 * both before the network, in all three engines, so a route never sees them:
 * Chromium reports each as a request that fails with `csp`, Firefox and WebKit
 * report nothing (measured 2026-10-16). `third-party.spec.ts` fails if either
 * ever answers.
 *
 * A context route rather than the Chromium-only `--host-resolver-rules`
 * switch it replaces, so Firefox and WebKit are held to the same network. The
 * route takes a pattern, not a match function. The engine pauses every request
 * either way once a route exists; with a pattern, Playwright's server matches it
 * and continues the rest itself, where a function is registered as `**\/*` and
 * puts every request in the suite through the route handler.
 */
export const BLOCKED_HOSTS = /(^|\.)razorpay\.com$/;
export const BLOCKED_URLS = /^https?:\/\/([^/?#]+\.)?razorpay\.com(:\d+)?\//;

/**
 * Demo data, answered from `e2e/fixtures/` rather than the network.
 *
 * Two pages render remote data: /table's Server-Side example fetches its rows
 * and category list from dummyjson.com in an effect and shows each row's
 * thumbnail from cdn.dummyjson.com; /avatar shows photos from
 * images.unsplash.com. Answered by those hosts, /table's measured count moved
 * by 140 between runs (its rows landed before or after the measurement) and a
 * slow or absent answer was a slow or failed page. Answered here, they are the
 * same bytes every run, in every engine, with no network.
 *
 * The API answers what the demo asks: `/products`, `/products/search?q=`,
 * `/products/category/{slug}` and `/products/category-list`, honouring
 * `limit`, `skip`, `sortBy`, `order` and `select` as dummyjson does. The rows
 * are 24 invented products in `fixtures/dummyjson/products.json`; the images
 * are two small SVGs. Every stubbed response carries `STUB_HEADER`, which is
 * how `third-party.spec.ts` tells a stubbed answer from the network's.
 */
export const STUBBED_URLS = /^https:\/\/(dummyjson\.com|cdn\.dummyjson\.com|images\.unsplash\.com)\//;
export const STUB_HEADER = "x-chumlab-stub";

/**
 * Every other host, aborted.
 *
 * Nothing in the suite may wait on a host this file does not name: a request
 * here fails at once instead of whenever the network answers.
 * `third-party.spec.ts` reports each one as unhandled and fails, so a new host
 * is listed above (stubbed or blocked) rather than silently refused.
 */
export const UNLISTED_URLS = /^https?:\/\/(?!(localhost|127\.0\.0\.1)(:\d+)?\/)/;

const FIXTURES = resolve(process.cwd(), "e2e/fixtures");

type Product = Record<string, unknown> & { title: string; category: string; brand: string };

let products: Product[] | undefined;
const productFixture = (): Product[] =>
  (products ??= JSON.parse(readFileSync(`${FIXTURES}/dummyjson/products.json`, "utf8")) as Product[]);

function dummyjson(url: URL): { status: number; body: unknown } {
  const all = productFixture();
  const path = url.pathname.replace(/\/+$/, "");
  if (path === "/products/category-list") return { status: 200, body: [...new Set(all.map((p) => p.category))] };

  let rows: Product[];
  if (path === "/products") rows = all;
  else if (path === "/products/search") {
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    rows = all.filter((p) => `${p.title} ${p.brand} ${p.category}`.toLowerCase().includes(q));
  } else if (path.startsWith("/products/category/")) {
    const slug = decodeURIComponent(path.slice("/products/category/".length));
    rows = all.filter((p) => p.category === slug);
  } else return { status: 404, body: { message: `no fixture for ${path}` } };

  const sortBy = url.searchParams.get("sortBy");
  if (sortBy) {
    const dir = url.searchParams.get("order") === "desc" ? -1 : 1;
    rows = [...rows].sort((a, b) => {
      const x = a[sortBy];
      const y = b[sortBy];
      return dir * (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y)));
    });
  }
  const total = rows.length;
  const skip = Number(url.searchParams.get("skip") ?? 0);
  const limit = Number(url.searchParams.get("limit") ?? 30);
  const fields = url.searchParams.get("select")?.split(",");
  const page = rows.slice(skip, skip + limit).map((p) =>
    fields ? Object.fromEntries(["id", ...fields].filter((f) => f in p).map((f) => [f, p[f]])) : p,
  );
  return { status: 200, body: { products: page, total, skip, limit } };
}

async function answerDemoData(route: Route) {
  const url = new URL(route.request().url());
  const headers = { [STUB_HEADER]: "1", "access-control-allow-origin": "*" };
  if (url.hostname === "dummyjson.com") {
    const { status, body } = dummyjson(url);
    await route.fulfill({ status, headers, contentType: "application/json", body: JSON.stringify(body) });
    return;
  }
  const image = url.hostname === "images.unsplash.com" ? "avatar.svg" : "product.svg";
  await route.fulfill({ status: 200, headers, contentType: "image/svg+xml", path: `${FIXTURES}/images/${image}` });
}

/**
 * Pages one WebKit browser opens before the harness relaunches it.
 *
 * WebKit's UI process keeps a thread for every page it has ever opened: each
 * page leaves a user-interactive GCD worker parked in
 * `-[NSAnimation _runBlocking]` for the life of the browser, and closing the
 * page or its context does not return it. macOS gives a process at most 64
 * such workers (`kern.wq_max_constrained_threads`), so once 64 are parked the
 * 64th page's work never gets a thread and its `goto` waits out the test
 * without sending a request. That is the stall single-worker WebKit and
 * Mobile Safari runs hit at almost exactly every 64th test.
 *
 * Measured 2026-10-26. A bare `webkit.launch()` loop, with no test runner, no
 * routes and no Vite: pages 1-63 navigate in 7 ms and page 64 hangs, whether
 * the pages share one context or have one each, and whether or not the
 * earlier pages navigated; contexts without a page do not count. Relaunching
 * every 63 pages ran 200 clean; every 64, page 64 hung. A `sample` of the hung
 * UI process showed exactly 64 workers, all in `_runBlocking`. In the suite
 * the UI process grew from 1 thread to 73 by test 63 and stalled at tests 64,
 * 128, 192 and 256; it only recovered because each timeout restarted the
 * worker, which is a browser relaunch by accident.
 *
 * Only while the Mac's display is off. With the display on, the animations
 * finish and the threads come back: the UI process held 15 threads for 535
 * tests, began climbing three seconds after `pmset` logged "Display is turned
 * off" and stopped when it came back on (2026-10-27, three such transitions).
 * Unattended runs are display-off runs, which is why the stall reached some
 * slices and not others, and why it is fixed here rather than waited out.
 *
 * The harness cannot close what leaks, so it relaunches deliberately, between
 * tests, 16 pages short of the stall. Chromium and Firefox are untouched.
 */
export const WEBKIT_PAGES_PER_BROWSER = 48;

export const test = base.extend<{ blockThirdParty: void }>({
  browser: [
    async ({ browser, browserName, playwright }, use) => {
      if (browserName !== "webkit") {
        await use(browser);
        return;
      }
      let current: Browser = browser;
      let pages = 0;
      const counted = (context: BrowserContext) => {
        pages += context.pages().length;
        context.on("page", () => pages++);
        return context;
      };
      // Only between tests: a browser with a context still open is not closed.
      const fresh = async () => {
        if (pages < WEBKIT_PAGES_PER_BROWSER || current.contexts().length) return;
        await current.close();
        // Launched with the project's options: `_browserOptions` sets them as
        // the defaults for this worker, which is how the base fixture launches.
        current = await playwright.webkit.launch();
        pages = 0;
      };
      const recycling = new Proxy(browser, {
        get(_target, key) {
          if (key === "newContext")
            return async (...args: Parameters<Browser["newContext"]>) => {
              await fresh();
              return counted(await current.newContext(...args));
            };
          if (key === "newPage")
            return async (...args: Parameters<Browser["newPage"]>) => {
              await fresh();
              const page = await current.newPage(...args);
              counted(page.context());
              return page;
            };
          const value: unknown = Reflect.get(current, key, current);
          return typeof value === "function" ? value.bind(current) : value;
        },
      });
      await use(recycling);
      // The base fixture closes the browser it launched; this one closes the last relaunch.
      await current.close();
    },
    { scope: "worker", timeout: 0 },
  ],
  blockThirdParty: [
    async ({ context }, use) => {
      // Registered first, so it is matched last: the named hosts below win.
      await context.route(UNLISTED_URLS, (route) => route.abort("blockedbyclient"));
      await context.route(STUBBED_URLS, answerDemoData);
      await context.route(BLOCKED_URLS, (route) => route.abort("blockedbyclient"));
      await use();
    },
    { auto: true },
  ],
});
