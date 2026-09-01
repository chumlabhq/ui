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
import type { ComponentType, ReactNode } from "react";
import { RadioGroup } from "../../components/RadioButton";
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
 * Constants source, read as text so a class set can be tied to the component
 * that owns it.
 *
 * A barrel can export several components — RadioButton ships `RadioGroup` and
 * `RadioButton`, CountryFlag ships the flag and its group, Loader ships four —
 * and each has its own `classes` prop backed by its own constant. Taking the
 * first one found meant RadioButton's nine radio-level keys were never checked
 * and fixtures.contract passed anyway (Task 2 finding).
 *
 * The owner is read from the declaration's type annotation,
 * `DEFAULT_RADIO_CLASSES: Required<RadioButtonClasses>`, which names it exactly.
 * Matching on the constant's own name would need an alias for RADIO -> RadioButton.
 */
const constantSources = {
  ...(import.meta.glob("../../components/*/utils/constants.ts", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>),
  ...(import.meta.glob("../../components/*/constants.ts", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>),
};

/** Props-interface source, for deciding what a sub-component actually accepts. */
const typeSources = {
  ...(import.meta.glob("../../components/*/utils/types.ts", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>),
  ...(import.meta.glob("../../components/*/types.ts", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>),
};

/**
 * Whether `owner` declares `prop`, read from `interface <Owner>Props`.
 *
 * A sub-component does not necessarily share its parent's API:
 * CountryFlagGroupProps declares no `unstyled`, so inheriting the index entry's
 * `supports` would have the contract assert behaviour for a prop that does not
 * exist.
 */
const declaresProp = (component: string, owner: string, prop: string): boolean => {
  for (const [path, source] of Object.entries(typeSources)) {
    if (!path.startsWith(`../../components/${component}/`)) continue;
    const block = new RegExp(
      `export interface ${owner}Props[^{]*\\{([\\s\\S]*?)\\n\\}`,
    ).exec(source);
    if (!block) continue;
    if (new RegExp(`^\\s*${prop}\\??:`, "m").test(block[1])) return true;
  }
  return false;
};

/** `DEFAULT_RADIO_CLASSES` -> `RadioButton`, from the type annotation. */
const owners = (component: string): Map<string, string> => {
  const out = new Map<string, string>();
  for (const [path, source] of Object.entries(constantSources)) {
    if (!path.startsWith(`../../components/${component}/`)) continue;
    for (const m of source.matchAll(
      /export const (DEFAULT_\w+_CLASSES)\s*:\s*Required<(\w+)Classes>/g,
    )) {
      out.set(m[1], m[2]);
    }
  }
  return out;
};

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

/**
 * Sub-components that throw outside a parent context. Hand-maintained like
 * REQUIRED_PROPS, and just as small: a RadioButton outside its RadioGroup
 * throws, and no prop combination substitutes for the provider.
 */
const REQUIRED_WRAPPER: Record<string, (node: ReactNode) => ReactNode> = {
  "RadioButton/RadioButton": (node) => <RadioGroup>{node}</RadioGroup>,
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
  /** The component that owns this class set — the index name for the primary. */
  name: string;
  /** The ai/component-index.json entry this came from. */
  indexName: string;
  /** Which DEFAULT_*_CLASSES this entry covers. */
  constantName: string;
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
  /** Parent context this component cannot render without. */
  wrap?: (node: ReactNode) => ReactNode;
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

/** Every class set a component's modules export, in declaration order. */
const pickConstants = (
  modules: (Record<string, unknown> | undefined)[],
  prefix: "DEFAULT" | "UNSTYLED",
): [string, Record<string, string>][] => {
  const out: [string, Record<string, string>][] = [];
  const seen = new Set<string>();
  for (const mod of modules) {
    if (!mod) continue;
    for (const [key, value] of Object.entries(mod)) {
      if (!key.startsWith(`${prefix}_`) || !key.endsWith("_CLASSES")) continue;
      if (!value || typeof value !== "object" || seen.has(key)) continue;
      seen.add(key);
      out.push([key, value as Record<string, string>]);
    }
  }
  return out;
};

export const COMPONENTS: ComponentUnderContract[] = entries.flatMap((entry) => {
  const barrel = barrelFor(entry.name);
  if (!barrel) {
    throw new Error(
      `ai/component-index.json lists ${entry.name} but src/components/${entry.name}/index.ts does not exist`,
    );
  }

  const primaryExport = EXPORT_ALIAS[entry.name] ?? entry.name;
  const modules = [barrel, ...constantsFor(entry.name)];
  const ownerOf = owners(entry.name);
  const defaults = pickConstants(modules, "DEFAULT");
  const unstyled = new Map(
    pickConstants(modules, "UNSTYLED").map(([key, value]) => [
      key.replace("UNSTYLED_", ""),
      value,
    ]),
  );
  const counts = countAllTokens(modules);
  const props = entry.props;
  const supports = {
    asChild: props.includes("asChild"),
    unstyled: props.includes("unstyled"),
    open: props.includes("open"),
    keepMounted: props.includes("keepMounted"),
    classes: props.includes("classes"),
  };

  const resolve = (exportName: string) => {
    const exported = barrel[exportName] ?? barrel.default;
    if (typeof exported !== "function" && typeof exported !== "object") {
      throw new Error(
        `src/components/${entry.name}/index.ts exports no component named ${exportName} and no default`,
      );
    }
    return exported as ComponentType<Record<string, unknown>>;
  };

  // One entry per class set, named for the component that owns it, so a barrel
  // exposing several components is covered rather than sampled.
  const sets = defaults.length ? defaults : [["", {} as Record<string, string>] as const];
  return sets.map(([constantName, values]) => {
    const owner = ownerOf.get(constantName) ?? primaryExport;
    const isPrimary = owner === primaryExport || !barrel[owner];
    const exportName = barrel[owner] ? owner : primaryExport;
    // `Index/Owner` for the extras. A bare owner name would collide whenever a
    // sub-component shares the index name, which RadioButton does.
    const name = isPrimary ? entry.name : `${entry.name}/${owner}`;
    return {
      name,
      indexName: entry.name,
      constantName,
      Component: resolve(exportName),
      props: REQUIRED_PROPS[name] ?? {},
      wrap: REQUIRED_WRAPPER[name],
      defaults: values,
      unstyled: unstyled.get(constantName.replace("DEFAULT_", "")) ?? null,
      allTokenCounts: counts,
      // `unstyled` and `classes` are read from the owner's own Props interface
      // rather than the index entry: a sub-component's API is its own
      // (CountryFlagGroupProps declares no `unstyled`), and the index is stale
      // enough to have missed Loader's `classes` entirely (GATE-HONESTY §1.6).
      supports: {
        ...supports,
        unstyled:
          declaresProp(entry.name, owner, "unstyled") ||
          (isPrimary && supports.unstyled),
        classes:
          declaresProp(entry.name, owner, "classes") ||
          (isPrimary && supports.classes),
      },
    };
  });
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
