import { Pagination } from "../../components/Pagination/index.js";
import type { Fixtures } from "./types.js";
import { RtlBoundary } from "./_harness.js";
import { motionOverrides } from "./_motion.js";

/**
 * `defaultValue`, not `value`: these fixtures are clicked in e2e, and a
 * controlled `value` with no `onValueChange` would swallow every navigation.
 * (They passed `currentPage` until E2E-TRIAGE.md — not a prop, so every fixture
 * silently rendered page 1. `Fixture["props"]` is `Record<string, unknown>`,
 * which is why nothing caught it.)
 */
const fixtures: Fixtures<typeof Pagination> = [
  { name: "default", props: { defaultValue: 1, totalPages: 5 } },
  { name: "middle", props: { defaultValue: 5, totalPages: 20 }, note: "Drives the ellipsis, and leaves both nav buttons enabled." },
  {
    name: "narrow",
    props: { defaultValue: 118, totalPages: 240 },
    wrap: (node) => <div style={{ width: 240 }}>{node}</div>,
    note: "A 240 px container narrower than the compact set of three-digit pages, which needs 253 px: the page list scrolls inside the row, prev and next stay on it, and the current page is scrolled into view.",
  },
  { name: "three-digit", props: { defaultValue: 118, totalPages: 240 }, note: "Three-digit page numbers, the widest buttons the fit has to hold at a phone width." },
  { name: "sibling-count-2", props: { defaultValue: 15, totalPages: 30, siblingCount: 2 } },
  {
    name: "centred",
    props: { defaultValue: 5, totalPages: 20 },
    wrap: (node) => <div style={{ display: "flex", justifyContent: "center" }}>{node}</div>,
    note: "A host that sizes Pagination to its content, as a centred footer does: the fit has to come from the component's own content, not from a width the host gives it.",
  },
  {
    name: "rows-per-page",
    props: { defaultValue: 1, totalPages: 5, showRowsPerPage: true, rowsPerPage: 10 },
    note: "The selector needs BOTH the flag and a defined rowsPerPage.",
  },
  {
    name: "rows-per-page-open",
    props: { defaultValue: 1, totalPages: 5, showRowsPerPage: true, rowsPerPage: 10 },
    act: (c, ui) => ui.click(c.querySelector("[aria-haspopup='listbox']")),
  },
  {
    name: "rows-per-page-open-unhighlighted",
    props: { defaultValue: 1, totalPages: 5, showRowsPerPage: true, rowsPerPage: 10 },
    act: async (c, ui) => {
      ui.click(c.querySelector("[aria-haspopup='listbox']"));
      await ui.settle();
      ui.keyDown(document.querySelector("[role='listbox']"), "ArrowDown");
    },
    note: "Selected and not highlighted. Opening highlights the selected option, so `rows-per-page-open` only ever painted the highlighted pair, and the plain selected text on its tint — 4.4999:1 in light, under AA — was never rendered by any fixture and so never measured.",
  },
  { name: "with-page-info", props: { defaultValue: 1, totalPages: 5, renderPageInfo: () => "1 of 5" }, note: "pageInfo has no boolean flag; it exists only via renderPageInfo." },
  { name: "disabled", props: { defaultValue: 1, totalPages: 5, disabled: true } },
  {
    name: "custom-ellipsis",
    props: {
      defaultValue: 5,
      totalPages: 40,
      renderEllipsis: ({ position }) => <span data-ellipsis={position}>...</span>,
    },
    note: "The ellipsis is the one part of the pager a consumer can replace.",
  },
  {
    name: "rows-per-page-open-rtl",
    props: { defaultValue: 1, totalPages: 5, showRowsPerPage: true, rowsPerPage: 10 },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    act: (c, ui) => ui.click(c.querySelector("[aria-haspopup='listbox']")),
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
