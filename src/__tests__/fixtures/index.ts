import type { Fixtures } from "./types";

/**
 * Every component's fixtures, keyed by the name used in ai/component-index.json.
 *
 * Collected by glob rather than an import list so a new fixture module is picked
 * up without editing this file — the same reason registry.ts reads the roster
 * from the index instead of a literal.
 */
const modules = import.meta.glob("./*.fixtures.tsx", { eager: true }) as Record<
  string,
  { default: Fixtures }
>;

export const FIXTURES: Record<string, Fixtures> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    // "CountryFlag.CountryFlagGroup.fixtures.tsx" -> "CountryFlag/CountryFlagGroup",
    // the registry's name for a sub-component's class set.
    path
      .replace("./", "")
      .replace(".fixtures.tsx", "")
      .replace(/\.(?=[A-Z])/g, "/"),
    mod.default,
  ]),
);

export const fixturesFor = (component: string): Fixtures =>
  FIXTURES[component] ?? [];

export type { Fixture, Fixtures } from "./types";
