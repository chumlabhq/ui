import type { TestProject } from "vitest/node";
import { componentViews } from "./propsWalk.js";

/**
 * The props a contract gates a test on, read from the props types once per run
 * and handed to every contract file.
 *
 * They were read from ai/component-index.json, which is written by hand and
 * had fallen behind: Breadcrumb and Pagination declare `keepMounted` and the
 * index did not list it, so their server-render test with it was skipped in
 * every run and could never fail. The types are what a consumer compiles
 * against, so they decide.
 *
 * Once per run rather than per file because the program takes over a second to
 * build and nineteen contract files read the registry.
 */
export const CAPABILITIES = ["asChild", "unstyled", "open", "keepMounted", "classes"] as const;
export type Capability = (typeof CAPABILITIES)[number];

declare module "vitest" {
  export interface ProvidedContext {
    /** `Dir/Export` → the capability props its props type declares. */
    declaredCapabilities: Record<string, Capability[]>;
  }
}

export default function setup(project: TestProject) {
  const declared: Record<string, Capability[]> = {};
  for (const view of componentViews()) {
    declared[view.id] = CAPABILITIES.filter((c) => view.props.some((p) => p.name === c));
  }
  project.provide("declaredCapabilities", declared);
}
