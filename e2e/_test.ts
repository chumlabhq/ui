import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test as base, type Route } from "@playwright/test";

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

export const test = base.extend<{ blockThirdParty: void }>({
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
