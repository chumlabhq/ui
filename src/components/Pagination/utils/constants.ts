import type { PaginationClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const DEFAULT_ROW_OPTIONS = [5, 10, 25, 50, 100] as const;

export const DEFAULT_VISIBLE_PAGE_COUNT = 3;

export const DEFAULT_PAGINATION_CLASSES: Required<PaginationClasses> = {
  root: "flex flex-wrap items-center gap-2 data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
  row: "flex items-center gap-2",
  list: "flex flex-wrap items-center gap-2",
  /**
   * The selected page, which the component announced three ways and painted
   * none of.
   *
   * `aria-current="page"`, `data-state="active"` and `data-active` were all
   * emitted and no default styled any of them, so no section of the demo could
   * show which page you were on — and ADR 007 had already established
   * `--cl-accent-hover` as the readable step on an accent tint BECAUSE this
   * row needed it. A recorded decision for a state nothing rendered.
   *
   * `--cl-accent-bg` under `text-cl-accent` is the pair the rows-per-page
   * option below already uses, measured 4.50:1 light and 6.04:1 dark; hover on
   * a selected page deepens the text to `--cl-accent-hover` rather than
   * repainting the background, which is the same rule as that option.
   */
  item:
    "px-3 py-1 rounded-cl-md border transition-colors cursor-pointer border-cl-border hover:bg-cl-bg-hover text-cl-text-chrome data-[active]:bg-cl-accent-bg data-[active]:text-cl-accent data-[active]:border-cl-accent data-[active]:hover:bg-cl-accent-bg data-[active]:hover:text-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg",
  navButton:
    "p-2 rounded-cl-md border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-cl-border hover:bg-cl-bg-hover text-cl-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg",
  ellipsis: "px-2 select-none text-cl-text-tertiary",
  rowsPerPage: {
    root: "flex items-center gap-2",
    trigger: "flex items-center gap-2 px-3 py-1.5 rounded-cl-md border transition-colors cursor-pointer border-cl-border bg-cl-bg-panel hover:bg-cl-bg-item-hover text-cl-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg",
    content: "rounded-cl-md shadow-lg py-1 border min-w-[64px] bg-cl-bg-panel border-cl-border",
    positioner: "relative",
    /**
     * Selected owns the background; highlight does not repaint it.
     *
     * The selected tint was `bg-cl-accent/15` with a `dark:` override at
     * `/60` — the accent itself, at 60%, under `text-cl-accent`. axe measured
     * the pair at 2.2:1. An alpha of the foreground colour is a background the
     * token contract cannot see, which is how it shipped.
     *
     * It is `--cl-accent-bg` in both themes now (4.50:1 light, 6.04:1 dark),
     * and the compound variants are deliberate: `data-[selected]` and
     * `data-[highlighted]` are the same specificity, so which one painted the
     * background was decided by emission order rather than by intent, and the
     * transient state was winning over the durable one. A highlighted selected
     * option keeps its accent tint and deepens its text to `--cl-accent-hover`
     * (5.83:1 / 7.66:1) — the cursor stays visible without a second background.
     */
    item: "px-4 py-1.5 w-full text-left cursor-pointer transition-colors text-cl-text hover:bg-cl-bg-item-hover data-[highlighted]:bg-cl-bg-item-hover data-[selected]:bg-cl-accent-bg data-[selected]:text-cl-accent data-[selected]:hover:bg-cl-accent-bg data-[selected]:data-[highlighted]:bg-cl-accent-bg data-[selected]:data-[highlighted]:text-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg",
    icon: "w-4 h-4 transition-transform text-cl-text-tertiary",
  },
  label: "text-sm text-cl-text-chrome-quiet",
  navIcon: "w-5 h-5 text-cl-text-chrome-quiet",
  pageInfo: "flex items-center",
};

export const UNSTYLED_PAGINATION_CLASSES: Required<PaginationClasses> =
  structuralOnly(DEFAULT_PAGINATION_CLASSES);
