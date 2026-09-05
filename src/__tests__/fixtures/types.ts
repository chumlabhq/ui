import type { ComponentProps, ElementType, ReactNode } from "react";
import type { ActTools } from "./_act.js";

/**
 * A named prop combination that drives a component into one distinct state.
 *
 * Fixtures exist because the contract tier could not otherwise reach most of the
 * library. GATE-HONESTY §3 measured 377 of 495 `classes` keys never rendering
 * under the tier's minimal props, and 213 never named anywhere in the repo — so
 * `overrides.contract` was passing trivially for 43% of the public styling API.
 * A key that no fixture can render is dead by ADR 002 R8; a key no fixture
 * *does* render is untested. This module is what makes the difference decidable.
 */
/**
 * Distributive, so a discriminated union of props (Accordion's `type: "single"`
 * vs `"multiple"`) survives the omit instead of collapsing to its common keys.
 */
type WithoutChildren<T> = T extends unknown ? Omit<T, "children"> : never;

export interface Fixture<P = Record<string, unknown>> {
  /** Distinguishes states in failure output: "open", "loading", "error". */
  name: string;
  /**
   * Typed against the component, so a renamed or misspelled prop is a compile
   * error rather than a fixture that quietly renders the default state.
   *
   * It was `Record<string, unknown>` until E2E-TRIAGE.md, and every Pagination
   * fixture passed `currentPage` — a prop whose own doc comment reads "Not
   * `currentPage` or `page`". They all rendered page 1, and five contract
   * suites asserted against that wrong render without a single failure.
   *
   * `children` is omitted: the fixture supplies it through its own `children`
   * field, which is what the contract tier passes separately.
   */
  props: WithoutChildren<P>;
  children?: P extends { children?: infer C } ? C : ReactNode;
  /**
   * Interaction needed to reach the state, run after render. Keys behind
   * hover/focus/selection (`itemHighlighted`, `dayFocused`) have no prop.
   *
   * The gestures arrive as `ui` rather than being imported, so an act cannot
   * reach for a jsdom-only API: it has no `fireEvent` in scope, and the same
   * body runs in the contract tier and on the fixture page. It used to import
   * one, and the fixture page never called `act` at all — every browser suite
   * measured the base state of 50 fixtures named for a state they never left.
   */
  act?: (container: HTMLElement, ui: ActTools) => void | Promise<void>;
  /**
   * Wraps the rendered element. Sub-components that need a parent context —
   * a RadioButton outside its RadioGroup throws — have no other route.
   */
  wrap?: (node: ReactNode) => ReactNode;
  /**
   * Takes over rendering entirely, for behaviour a static prop set cannot
   * reach: "opens on trigger click" needs a trigger and a piece of state, and
   * the alternative is reaching back into a demo page, which is what
   * E2E-INVENTORY.md is about.
   *
   * A `render` fixture is excluded from the `classes`-key contracts, which work
   * by passing a sentinel `classes` map the fixture would not receive.
   */
  render?: () => ReactNode;
  /** Why this fixture exists, when the name is not self-evident. */
  note?: string;
}

/**
 * What a fixture module declares: `Fixtures<typeof Component>`.
 *
 * The type argument is the point — it is what turns a misspelled prop into a
 * compile error. A module that omits it gets no checking at all, so every
 * module supplies one.
 */
export type Fixtures<C extends ElementType> = Fixture<ComponentProps<C>>[];

/**
 * The heterogeneous view. `index.ts` collects the modules by glob, so on the
 * consumer side the component type is not knowable and the props are opaque.
 */
export type AnyFixtures = Fixture[];
