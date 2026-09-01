import type { ReactNode } from "react";

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
export interface Fixture {
  /** Distinguishes states in failure output: "open", "loading", "error". */
  name: string;
  props: Record<string, unknown>;
  children?: ReactNode;
  /**
   * Interaction needed to reach the state, run after render. Keys behind
   * hover/focus/selection (`itemHighlighted`, `dayFocused`) have no prop.
   */
  act?: (container: HTMLElement) => void | Promise<void>;
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

export type Fixtures = Fixture[];
