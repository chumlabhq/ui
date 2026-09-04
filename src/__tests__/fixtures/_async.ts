import { fireEvent } from "@testing-library/react";
import { tick } from "./_act";

/**
 * Helpers for the dropdown family's async option sources.
 *
 * The async branch is a discriminated union that `prop-unions.type-test.tsx`
 * proves cannot be instantiated wrongly. Proving it renders needs three
 * distinguishable states, and the difference between them is *when* the promise
 * settles — so the loader, not the props, is what varies below.
 */

/** A loader that never settles, so the in-flight state holds still to assert on. */
export const neverResolves = <T,>() => (): Promise<T[]> => new Promise<T[]>(() => {});

/** A loader that resolves on the next microtask. Pair with `openMenu`. */
export const resolvesTo = <T,>(value: T[]) => async (): Promise<T[]> => value;

/** A loader that rejects, for the error path `onLoadError` reports. */
export const rejectsWith = <T,>(reason: string) => (): Promise<T[]> =>
  Promise.reject(new Error(reason));

/**
 * Opens the menu by clicking the trigger, then flushes.
 *
 * `defaultOpen` is not a substitute. `useDropdown` calls `loadOptions()` from
 * `handleOpen`/`handleToggle` only — there is no effect keyed on `isOpen` — so
 * a dropdown that starts open never fetches, and a fixture relying on
 * `defaultOpen` would assert against a permanently empty menu. The two
 * searchable dropdowns load from an effect and do not have this problem, which
 * is the inconsistency the composition phase inherits.
 */
export const openMenu = async (container: HTMLElement) => {
  const trigger =
    container.querySelector<HTMLElement>("[role='combobox']") ??
    container.querySelector<HTMLElement>("button");
  if (trigger) fireEvent.click(trigger);
  await tick();
};

/** Opens the menu and lets a settling promise resolve before the assertion. */
export const openMenuAndSettle = async (container: HTMLElement) => {
  await openMenu(container);
  await tick();
};

/** Flushes a settling prefetch for components that load from an effect. */
export const settleAsync = async () => {
  await tick();
  await tick();
};
