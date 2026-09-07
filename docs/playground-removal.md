# Playground removal (2026-09-07)

The AI Playground is off the marketing site. It returns as a feature release,
so the code was kept and unwired rather than deleted: everything that made it
reachable is gone, everything that makes it work is still here and still
typechecks.

The standard the removal was held to: **a visitor, a crawler and a bundle
inspector all find nothing.** `npm run verify:playground-removed` re-checks that
after every build — see the bottom of this file.

## What was removed from the site

| Where | What |
| --- | --- |
| `src/App.tsx` | the `/playground` and `/oauth/google` routes. Both now fall through to the catch-all 404. |
| `src/components/SiteHeader.tsx` | nav item, CTA button, and the two mobile-menu equivalents |
| `src/components/SiteFooter.tsx` | the footer link |
| `src/pages/Home.tsx` | the hero pill, `<AIPlaygroundSection />`, and the `#ai-playground` hash-scroll effect |
| `src/components/ChumlabComparisonSection.tsx` | the "Type a prompt. Get real React." comparison row |
| `src/pages/faqData.ts` | 7 questions and the "AI Playground" category |
| `index.html` | the playground FAQPage JSON-LD question |
| `src/index.css` | every playground rule, lifted to `src/pages/playground/playground.css` |
| `src/redux/api/baseApi.ts` | the two playground tag types (a tag name is a string in the bundle) |
| `package.json` | `build:preview` dropped from `prebuild` |
| `vite.config.ts` | the dev-server CSP relaxations the preview iframe needed |
| `ai/11-readme.md`, `ai/15-seo.md` | the playground copy, so a later pipeline run cannot put it back into the site's meta |

There was no playground entry in `public/sitemap.xml`, `public/robots.txt`,
`public/llms.txt`, `llms-full.txt`, the OG/Twitter meta or any blog post.

## What was kept, and where

Nothing below is reachable from any route, so Vite never pulls it into the
bundle. It is all still compiled by `tsc -b`, so it cannot rot silently.

- `src/pages/playground/**` — the feature: pages, components, `types.ts`,
  `lib/enterPlayground.ts` (the Google OAuth entry point), and now also
  - `flags.ts` — was `src/lib/flags.ts`
  - `oauth/OauthRedirect.tsx` — was `src/pages/oauth/`
  - `preview/runtime.ts` — was `src/lib/preview/`
  - `preview/preview-bridge.js` — was `public/preview-bridge.js`, moved out of
    `public/` so a plain `npm run build` cannot ship it
  - `playground.css` — the rules lifted out of `src/index.css`. Nothing imports
    it; restoring is one `@import`.
- `src/redux/api/playgroundApi.ts` and `adminApi.ts` — they add their own tag
  types with `enhanceEndpoints`, so `baseApi` carries none of it.
- `scripts/build-preview-vendor.mjs` — still works, still writes
  `public/preview-vendor/`, `public/preview.html` and `public/preview-bridge.js`
  (all three gitignored). It just is not part of `prebuild` any more.

`src/lib/analytics.ts` is all that is left in `src/lib`.

## The 404 page

"Unreachable by URL" needed somewhere for the URL to go. The catch-all was
`<Navigate to="/" replace />`, so `/playground` answered 200 with the homepage —
a soft 404 that a crawler indexes as a duplicate of `/`, and the reason the e2e
suite once spent months asserting against the homepage.

`src/pages/NotFound.tsx` replaces it: a real 404 page, `noindex, nofollow`, and
a `data-route-404` marker. A static SPA cannot send a 404 status from the
client, so `noindex` is the strongest signal available; a host-level rule that
returns a real 404 for unknown paths would be strictly better and is not
configured here.

`e2e/_nav.ts` had to learn about it. The guard caught a missing route by
noticing the URL change a redirect causes, and an unknown route keeps its URL
now — so it looks for the marker as well. `e2e/navigation-guard.spec.ts` covers
this: 7 tests, all passing, including the three `/demo/<name>` paths.

## Restoring it

1. `src/App.tsx` — re-add the two routes.
2. `src/pages/playground/flags.ts` — `PLAYGROUND_ENABLED = true`, and move it
   back to `src/lib/flags.ts` if the site shell needs to read it again.
3. `src/index.css` — `@import "./pages/playground/playground.css";`, or paste
   the rules back.
4. `package.json` — `"prebuild": "npm run build:lib && npm run build:preview"`.
5. `vite.config.ts` — `script-src` needs `blob:` back, `frame-src` and
   `frame-ancestors` need `'self'`, and `X-Frame-Options` goes to `SAMEORIGIN`.
6. Re-add the entry points that were copy, not code: header nav item and CTA,
   footer link, hero pill, `<AIPlaygroundSection />`, the comparison row, the
   FAQ category and its 7 questions, the JSON-LD question, and the marketing
   copy in `ai/11-readme.md` / `ai/15-seo.md`.
7. Delete the removal assertions from `scripts/assert-playground-removed.mjs`,
   or the gate will fail on the restored site.

The backend is untouched: `/playground/*`, `/admin/playground/*` and the Google
OAuth routes are all still live in `chumlab-be`.

## The gate

`npm run verify:playground-removed` runs against `dist/` and fails on any of:

- the string `playground` or `chumlab.ai` in any built file, case-insensitively
- `/playground` or `/oauth/google` resolving to anything but the 404 page
- a `preview-vendor/`, `preview.html` or `preview-bridge.js` in `dist/`

`--self-check` plants each of those three defects in a scratch copy of `dist/`
and requires the gate to catch all three.
