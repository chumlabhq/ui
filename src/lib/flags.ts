/**
 * Marketing-site feature flags.
 *
 * These gate what the public site exposes. They are compile-time constants, so
 * a disabled feature's UI is tree-shaken out of the production bundle rather
 * than merely hidden — nothing ships that a visitor could reach.
 *
 * Scope: the marketing site and its routing only. Nothing here affects the
 * published @chumlab/ui library, which builds from src/components and never
 * imports this file.
 */

/**
 * The AI Playground: its routes, and every nav item and CTA that leads to it.
 *
 * While false the playground is unreachable — unlinked AND direct-URL requests
 * to /playground redirect home. The code stays in the repo untouched; flipping
 * this to true restores the routes and every entry point at once.
 */
export const PLAYGROUND_ENABLED = false;
