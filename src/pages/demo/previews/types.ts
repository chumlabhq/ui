import type { ComponentType } from "react";

/**
 * One component's previews: its `.preview.tsx` module, whose every export is a
 * component and nothing else, so Vite can hot-swap the file. `LongSheet` is what
 * `/preview/<Component>/long-sheet` renders. A `PhoneFrame` on the component's
 * page loads that route in a 360 px iframe.
 *
 * These are the demo's own examples, written as a reader would use the
 * component: not test fixtures, which are dev-only and never reach the site.
 */
export type Previews = Record<string, ComponentType>;
