/**
 * The playground's own feature flag.
 *
 * It used to live in `src/lib/flags.ts` and gate the routes from the site
 * shell. It does not gate anything on the site any more: the playground was
 * removed on 2026-09-07 and nothing outside this directory imports it, so the
 * flag survives only for the code kept here. See docs/playground-removal.md.
 */
export const PLAYGROUND_ENABLED = false;
