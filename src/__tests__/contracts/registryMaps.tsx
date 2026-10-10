import type { ReactNode } from "react";
import { RadioButton as RadioButtonItem, RadioGroup } from "../../components/RadioButton/index.js";
import type { AccordionProps } from "../../components/Accordion/utils/types.js";
import type { BreadcrumbProps } from "../../components/Breadcrumb/utils/types.js";
import type { CascadingDropdownProps } from "../../components/CascadingDropdown/utils/types.js";
import type { CountryFlagProps } from "../../components/CountryFlag/utils/types.js";
import type { DropdownProps } from "../../components/Dropdown/utils/types.js";
import type { DrawerProps } from "../../components/Drawer/utils/types.js";
import type { ModalProps } from "../../components/Modal/utils/types.js";
import type { MultiSelectDropdownProps } from "../../components/MultiSelectDropdown/utils/types.js";
import type { MultiSelectSearchableDropdownProps } from "../../components/MultiSelectSearchableDropdown/utils/types.js";
import type { PaginationProps } from "../../components/Pagination/utils/types.js";
import type { RadioGroupProps } from "../../components/RadioButton/utils/types.js";
import type { SearchableDropdownProps } from "../../components/SearchableDropdown/utils/types.js";
import type { StepperProps } from "../../components/Stepper/utils/types.js";
import type { TableProps } from "../../components/Table/utils/types.js";
import type { TabPanelProps } from "../../components/TabPanel/utils/types.js";
import type { ToastProps } from "../../components/Toast/utils/types.js";
import type { TooltipProps } from "../../components/Tooltip/utils/types.js";


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

/**
 * Minimal props for components that cannot render bare. Keyed by index name.
 *
 * Type-checked against each component's real props via the `satisfies` below.
 * It carried the same defect the fixture props did — `countryCode`,
 * `currentPage`, a `content` key on a tab object, a `Toast` missing both its
 * required props — and nothing caught any of it, because the map was
 * `Record<string, unknown>` (E2E-TRIAGE.md Appendix C).
 *
 * The imports above are `import type`, so they are erased at compile time. This
 * module is loaded by the dev-only fixture route, which exists precisely to
 * avoid pulling the whole library into a page; a value import of seventeen
 * components here would undo that.
 *
 * `children` is optional in the shape: some entries supply one because the
 * component cannot render without it, and the widened export below is what the
 * two call sites index by an arbitrary registry name.
 */
type Minimal<P> = (P extends unknown ? Omit<P, "children"> : never) & {
  children?: ReactNode;
};

interface RequiredPropsShape {
  Accordion: Minimal<AccordionProps>;
  Breadcrumb: Minimal<BreadcrumbProps>;
  CascadingDropdown: Minimal<CascadingDropdownProps>;
  CountryFlag: Minimal<CountryFlagProps>;
  Dropdown: Minimal<DropdownProps>;
  MultiSelectDropdown: Minimal<MultiSelectDropdownProps>;
  MultiSelectSearchableDropdown: Minimal<MultiSelectSearchableDropdownProps>;
  Pagination: Minimal<PaginationProps>;
  RadioButton: Minimal<RadioGroupProps>;
  SearchableDropdown: Minimal<SearchableDropdownProps>;
  Stepper: Minimal<StepperProps>;
  Table: Minimal<TableProps<unknown>>;
  TabPanel: Minimal<TabPanelProps>;
  Tooltip: Minimal<TooltipProps>;
  Modal: Minimal<ModalProps>;
  Drawer: Minimal<DrawerProps>;
  Toast: Minimal<ToastProps>;
}

const TYPED_REQUIRED_PROPS = {
  Accordion: { type: "single", children: null },
  Breadcrumb: { items: [{ id: "home", label: "Home" }] },
  CascadingDropdown: { options: [] },
  CountryFlag: { code: "US" },
  Dropdown: { options: [] },
  MultiSelectDropdown: { options: [] },
  MultiSelectSearchableDropdown: { options: [] },
  Pagination: { defaultValue: 1, totalPages: 3 },
  // Not `options`: RadioGroup takes RadioButton children, and an `options`
  // array renders an empty group — the same defect the fixtures had, still
  // here because nothing checked this map.
  RadioButton: { children: <RadioButtonItem value="a" label="A" /> },
  SearchableDropdown: { options: [] },
  Stepper: { steps: [{ id: "a", label: "A" }] },
  Table: { data: [], columns: [] },
  TabPanel: { tabs: [{ id: "a", label: "A" }] },
  Tooltip: { content: "tip", children: "trigger" },
  Modal: { children: "body" },
  Drawer: { children: "body" },
  Toast: { id: "t", onDismiss: () => {}, message: "hi" },
} satisfies RequiredPropsShape;

/** Widened: both call sites look up an arbitrary registry name. */
export const REQUIRED_PROPS: Record<string, Record<string, unknown>> =
  TYPED_REQUIRED_PROPS;
/**
 * Sub-components that throw outside a parent context. Hand-maintained like
 * REQUIRED_PROPS, and just as small: a RadioButton outside its RadioGroup
 * throws, and no prop combination substitutes for the provider.
 */
export const REQUIRED_WRAPPER: Record<string, (node: ReactNode) => ReactNode> = {
  "RadioButton/RadioButton": (node) => <RadioGroup>{node}</RadioGroup>,
};
