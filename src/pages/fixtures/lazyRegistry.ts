import type { ComponentType, ReactNode } from "react";
import {
  EXPORT_ALIAS,
  REQUIRED_PROPS,
  REQUIRED_WRAPPER,
} from "../../__tests__/contracts/registryMaps";
import type { Fixture } from "../../__tests__/fixtures/types";

/**
 * Lazy twin of the contract registry, for the fixture route.
 *
 * The contract tier globs every barrel and every fixture eagerly, which is
 * right for a test run and wrong for a page: the browser spent ~30s executing
 * the whole library plus 261 fixture modules to render one component, and every
 * navigation paid it again. These globs are lazy, so a fixture page loads only
 * what it renders.
 *
 * The maps it needs — EXPORT_ALIAS, REQUIRED_PROPS, REQUIRED_WRAPPER — are
 * imported from the registry rather than copied, so there is still one
 * definition of each. The owner export is derived from the entry name itself:
 * "Loader/DotLoader" names its own export, and a primary falls back to the
 * alias.
 */
const barrels = import.meta.glob("../../components/*/index.ts") as Record<
  string,
  () => Promise<Record<string, unknown>>
>;

const fixtureModules = import.meta.glob(
  "../../__tests__/fixtures/*.fixtures.tsx",
) as Record<string, () => Promise<{ default: Fixture[] }>>;

/** "CountryFlag.CountryFlagGroup" -> "CountryFlag/CountryFlagGroup". */
export const fromSlug = (slug: string) => slug.replace(/\.(?=[A-Z])/g, "/");
export const toSlug = (name: string) => name.replace("/", ".");

/** Every fixture module the glob can see, by registry name. */
export const componentNames = (): string[] =>
  Object.keys(fixtureModules)
    .map((path) =>
      fromSlug(path.split("/").pop()!.replace(".fixtures.tsx", "")),
    )
    .sort();

export const loadFixtures = async (name: string): Promise<Fixture[]> => {
  const load = fixtureModules[
    `../../__tests__/fixtures/${toSlug(name)}.fixtures.tsx`
  ];
  if (!load) return [];
  return (await load()).default;
};

export interface Resolved {
  Component: ComponentType<Record<string, unknown>>;
  props: Record<string, unknown>;
  wrap?: (node: ReactNode) => ReactNode;
}

export const loadComponent = async (name: string): Promise<Resolved | null> => {
  const [indexName, sub] = name.split("/");
  const load = barrels[`../../components/${indexName}/index.ts`];
  if (!load) return null;

  const barrel = await load();
  const exportName = sub ?? EXPORT_ALIAS[indexName] ?? indexName;
  const exported = barrel[exportName] ?? barrel.default;
  if (typeof exported !== "function" && typeof exported !== "object") return null;

  return {
    Component: exported as ComponentType<Record<string, unknown>>,
    props: REQUIRED_PROPS[name] ?? {},
    wrap: REQUIRED_WRAPPER[name],
  };
};
