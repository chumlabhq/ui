import type { AnyFixtures } from "./types.js";

/**
 * Every component's fixtures, keyed by the name used in ai/component-index.json.
 *
 * Collected by glob rather than an import list so a new fixture module is picked
 * up without editing this file — the same reason registry.ts reads the roster
 * from the index instead of a literal.
 */
const modules = import.meta.glob("./*.fixtures.tsx", { eager: true }) as Record<
  string,
  { default: AnyFixtures }
>;

export const FIXTURES: Record<string, AnyFixtures> = Object.fromEntries(
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

export const fixturesFor = (component: string): AnyFixtures =>
  FIXTURES[component] ?? [];

export type { Fixture, Fixtures, AnyFixtures } from "./types.js";
