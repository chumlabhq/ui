import type { ComponentType } from "react";

/**
 * One component's previews: an example id → what `/preview/<Component>/<id>`
 * renders. A `PhoneFrame` on the component's page loads that route in a
 * 360 px iframe.
 *
 * These are the demo's own examples, written as a reader would use the
 * component: not test fixtures, which are dev-only and never reach the site.
 */
export type Previews = Record<string, ComponentType>;
