/**
 * The component roster every contract suite iterates.
 *
 * The list comes from ai/component-index.json rather than a literal in this
 * file, so a component added to the library is covered by these contracts
 * without anyone remembering to add it here. That is the whole point of the
 * tier: AUDIT-GAP.md §1.7 and §2.6 record two mechanisms — the cl-s marker and
 * server rendering — with zero coverage across 2,976 tests, because the suite
 * is organised strictly per component and a cross-cutting test had nowhere to
 * live.
 *
 * Only `props` below is hand-maintained, and only where a component cannot
 * render without one. A component absent from that map gets `{}`, so the
 * failure mode for a new component is a legible test error rather than silent
 * omission.
 */
import type { ComponentType } from "react";
import index from "../../../ai/component-index.json";

interface IndexEntry {
  name: string;
  path: string;
  props: string[];
}

const entries = (index as { components: IndexEntry[] }).components;

const barrels = import.meta.glob("../../components/*/index.ts", {
  eager: true,
}) as Record<string, Record<string, unknown>>;

const barrelFor = (name: string) =>
  barrels[`../../components/${name}/index.ts`];

/**
 * Constants modules are read directly, not through the barrel: variant and size
 * maps like Stepper's INDICATOR_SIZE are internal and never re-exported, yet
 * their tokens collide with slot defaults and must be counted.
 */
const constantModules = {
  ...(import.meta.glob("../../components/*/utils/constants.ts", {
    eager: true,
  }) as Record<string, Record<string, unknown>>),
  ...(import.meta.glob("../../components/*/constants.ts", {
    eager: true,
  }) as Record<string, Record<string, unknown>>),
};

const constantsFor = (name: string) => [
  constantModules[`../../components/${name}/utils/constants.ts`],
  constantModules[`../../components/${name}/constants.ts`],
];

/**
 * Index entries whose name is not an export. `Loader` is a family
 * (CircularLoader, LinearLoader, DotLoader, PulseLoader) with no single
 * `Loader` export; the index names the family, so pick a representative.
 */
const EXPORT_ALIAS: Record<string, string> = {
  Loader: "CircularLoader",
  // `RadioButton` throws outside a RadioGroup; the group is the public entry.
  RadioButton: "RadioGroup",
};

/** Minimal props for components that cannot render bare. Keyed by index name. */
const REQUIRED_PROPS: Record<string, Record<string, unknown>> = {
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

export interface ComponentUnderContract {
  name: string;
  /** The component itself, resolved from its own subpath barrel. */
  Component: ComponentType<Record<string, unknown>>;
  /** Minimal props needed to render. */
  props: Record<string, unknown>;
  /** DEFAULT_*_CLASSES from the same barrel, when the component ships one. */
  defaults: Record<string, string> | null;
  /** UNSTYLED_*_CLASSES from the same barrel, when the component ships one. */
  unstyled: Record<string, string> | null;
  /**
   * Every class token the barrel exports, from any constant — default sets,
   * variant maps, size maps. Used to tell whether a token identifies one slot:
   * Stepper's `label` and its `INDICATOR_SIZE.numbered` share
   * "text-xs sm:text-sm font-medium", and a check that only looked at the
   * default set would blame the wrong one.
   */
  allTokenCounts: Map<string, number>;
  /** Whether the index records these props on the component. */
  supports: {
    asChild: boolean;
    unstyled: boolean;
    open: boolean;
    keepMounted: boolean;
    classes: boolean;
  };
}

/** Token frequency across every string-valued class map the barrel exports. */
const countAllTokens = (modules: (Record<string, unknown> | undefined)[]) => {
  const counts = new Map<string, number>();
  for (const mod of modules) {
    if (!mod) continue;
    for (const value of Object.values(mod)) {
      if (!value || typeof value !== "object") continue;
      for (const entry of Object.values(value as Record<string, unknown>)) {
        if (typeof entry !== "string" || !entry.trim()) continue;
        for (const token of new Set(entry.split(/\s+/).filter(Boolean))) {
          counts.set(token, (counts.get(token) ?? 0) + 1);
        }
      }
    }
  }
  return counts;
};

const pickConstant = (
  barrel: Record<string, unknown>,
  prefix: "DEFAULT" | "UNSTYLED",
): Record<string, string> | null => {
  for (const [key, value] of Object.entries(barrel)) {
    if (!key.startsWith(`${prefix}_`) || !key.endsWith("_CLASSES")) continue;
    if (value && typeof value === "object") return value as Record<string, string>;
  }
  return null;
};

export const COMPONENTS: ComponentUnderContract[] = entries.map((entry) => {
  const barrel = barrelFor(entry.name);
  if (!barrel) {
    throw new Error(
      `ai/component-index.json lists ${entry.name} but src/components/${entry.name}/index.ts does not exist`,
    );
  }

  const exportName = EXPORT_ALIAS[entry.name] ?? entry.name;
  const exported = barrel[exportName] ?? barrel.default;
  if (typeof exported !== "function" && typeof exported !== "object") {
    throw new Error(
      `src/components/${entry.name}/index.ts exports no component named ${entry.name} and no default`,
    );
  }

  const props = entry.props;
  return {
    name: entry.name,
    Component: exported as ComponentType<Record<string, unknown>>,
    props: REQUIRED_PROPS[entry.name] ?? {},
    defaults: pickConstant(barrel, "DEFAULT"),
    unstyled: pickConstant(barrel, "UNSTYLED"),
    allTokenCounts: countAllTokens([barrel, ...constantsFor(entry.name)]),
    supports: {
      asChild: props.includes("asChild"),
      unstyled: props.includes("unstyled"),
      open: props.includes("open"),
      keepMounted: props.includes("keepMounted"),
      classes: props.includes("classes"),
    },
  };
});

/** Every class token in a subtree, deduplicated. */
export const classTokens = (root: Element | null): Set<string> => {
  const out = new Set<string>();
  if (!root) return out;
  for (const el of [root, ...Array.from(root.querySelectorAll("*"))]) {
    const cls = el.getAttribute?.("class");
    if (cls) for (const token of cls.split(/\s+/)) if (token) out.add(token);
  }
  return out;
};
