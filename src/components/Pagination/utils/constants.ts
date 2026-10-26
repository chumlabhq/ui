import type { PaginationClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const DEFAULT_ROW_OPTIONS = [5, 10, 25, 50, 100] as const;

export const DEFAULT_VISIBLE_PAGE_COUNT = 3;

export const DEFAULT_PAGINATION_CLASSES: Required<PaginationClasses> = {
  root: "flex flex-wrap items-center gap-2 max-w-full data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
  row: "flex items-center gap-2 min-w-0 max-w-full",
  list: "flex items-center gap-2 min-w-0",
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
   * The text is `--cl-accent-hover`, not `--cl-accent`. `text-cl-accent` on
   * this tint was reported as 4.50:1 and painted 4.31:1 in light — measured by
   * `contrast-painted` on nine Pagination fixtures, and 3.97:1 on a demo
   * page's tinted surface — so the selected page failed AA in the state it
   * exists to show. `--cl-accent-hover` is the step ADR 007 names for text on
   * an accent tint. Hover on a selected page deepens the tint to
   * `--cl-accent-bg-hover` instead, since the text is already on its darker
   * step.
   */
  item:
    "px-3 py-1 rounded-cl-md border transition-colors cursor-pointer border-cl-border hover:bg-cl-bg-hover text-cl-text-chrome data-[active]:bg-cl-accent-bg data-[active]:text-cl-accent-hover data-[active]:border-cl-accent data-[active]:hover:bg-cl-accent-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg",
  navTrigger:
    "p-2 rounded-cl-md border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-cl-border hover:bg-cl-bg-hover text-cl-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg",
  ellipsis: "px-2 select-none text-cl-text-tertiary",
  rowsPerPage: {
    root: "flex items-center gap-2",
    trigger: "flex items-center gap-2 px-3 py-1.5 rounded-cl-md border transition-colors cursor-pointer border-cl-border-input bg-cl-bg-panel hover:bg-cl-bg-item-hover text-cl-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg",
    content: "rounded-cl-md shadow-lg py-1 border min-w-[64px] bg-cl-bg-panel border-cl-border",
    positioner: "relative",
    /**
     * Selected owns the background and the text colour; highlight deepens the
     * tint.
     *
     * The selected tint was `bg-cl-accent/15` with a `dark:` override at
     * `/60` — the accent itself, at 60%, under `text-cl-accent`. axe measured
     * the pair at 2.2:1. An alpha of the foreground colour is a background the
     * token contract cannot see, which is how it shipped.
     *
     * It is `--cl-accent-bg` now, and the text on it is `--cl-accent-hover`.
     * `text-cl-accent` on this tint painted 4.4999:1 in light — under AA,
     * which WCAG does not round — and was reported as 4.50 because every
     * contrast gate compared a two-decimal value, and because opening the menu
     * highlights the selected option, so no fixture had ever rendered the plain
     * selected state (`rows-per-page-open-unhighlighted` does now). With the
     * text already on the deeper step, a highlighted or hovered selected option
     * deepens the tint to `--cl-accent-bg-hover` instead, as the page buttons
     * do. The compound variants stay deliberate: `data-[selected]` and
     * `data-[highlighted]` are the same specificity, so emission order, not
     * intent, decided which painted the background.
     */
    item: "px-4 py-1.5 w-full text-start cursor-pointer transition-colors text-cl-text hover:bg-cl-bg-item-hover data-[highlighted]:bg-cl-bg-item-hover data-[selected]:bg-cl-accent-bg data-[selected]:text-cl-accent-hover data-[selected]:hover:bg-cl-accent-bg-hover data-[selected]:data-[highlighted]:bg-cl-accent-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg",
    icon: "w-4 h-4 transition-transform text-cl-text-tertiary",
  },
  label: "text-sm text-cl-text-chrome-quiet",
  navIcon: "w-5 h-5 text-cl-text-chrome-quiet",
  pageInfo: "flex items-center",
};

export const UNSTYLED_PAGINATION_CLASSES: Required<PaginationClasses> =
  structuralOnly(DEFAULT_PAGINATION_CLASSES);
