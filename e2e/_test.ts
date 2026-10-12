import { test as base } from "@playwright/test";

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
 * both before a request is made, in all three engines, so a route never sees
 * them. `third-party.spec.ts` fails if either ever answers. Demo data
 * (dummyjson, unsplash) is what the demos render and is not blocked.
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

export const test = base.extend<{ blockThirdParty: void }>({
  blockThirdParty: [
    async ({ context }, use) => {
      await context.route(BLOCKED_URLS, (route) => route.abort("blockedbyclient"));
      await use();
    },
    { auto: true },
  ],
});
