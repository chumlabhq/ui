import type { ReactNode } from "react";
import { RadioGroup } from "../../components/RadioButton";

/**
 * The hand-maintained half of the registry, split out so it can be imported
 * without the eager globs.
 *
 * registry.tsx globs every barrel, every constants module and every fixture at
 * import time — correct for a test run, ruinous for a page: the dev-only
 * fixture route spent ~30s per navigation executing the whole library just to
 * reach these three maps. They have no dependency on the globs, so they live
 * here and both sides import them. One definition, either way.
 */

/**
 * Index entries whose name is not an export. `Loader` is a family
 * (CircularLoader, LinearLoader, DotLoader, PulseLoader) with no single
 * `Loader` export; the index names the family, so pick a representative.
 */
export const EXPORT_ALIAS: Record<string, string> = {
  Loader: "CircularLoader",
  // `RadioButton` throws outside a RadioGroup; the group is the public entry.
  RadioButton: "RadioGroup",
};

/** Minimal props for components that cannot render bare. Keyed by index name. */
export const REQUIRED_PROPS: Record<string, Record<string, unknown>> = {
  Accordion: { type: "single", children: null },
  Breadcrumb: { items: [{ id: "home", label: "Home" }] },
  CascadingDropdown: { options: [] },
  CountryFlag: { countryCode: "US" },
  Dropdown: { options: [] },
  MultiSelectDropdown: { options: [] },
  MultiSelectSearchableDropdown: { options: [] },
  Pagination: { currentPage: 1, totalPages: 3 },
  RadioButton: { options: [{ value: "a", label: "A" }] },
  SearchableDropdown: { options: [] },
  Stepper: { steps: [{ id: "a", label: "A" }] },
  Table: { data: [], columns: [] },
  TabPanel: { tabs: [{ id: "a", label: "A", content: "A" }] },
  Tooltip: { content: "tip", children: "trigger" },
  Modal: { children: "body" },
  Drawer: { children: "body" },
  Toast: { message: "hi" },
};

/**
 * Sub-components that throw outside a parent context. Hand-maintained like
 * REQUIRED_PROPS, and just as small: a RadioButton outside its RadioGroup
 * throws, and no prop combination substitutes for the provider.
 */
export const REQUIRED_WRAPPER: Record<string, (node: ReactNode) => ReactNode> = {
  "RadioButton/RadioButton": (node) => <RadioGroup>{node}</RadioGroup>,
};
