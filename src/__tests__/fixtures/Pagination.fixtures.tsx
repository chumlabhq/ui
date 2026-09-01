import { fireEvent } from "@testing-library/react";
import type { Fixtures } from "./types";

/**
 * `defaultValue`, not `value`: these fixtures are clicked in e2e, and a
 * controlled `value` with no `onValueChange` would swallow every navigation.
 * (They passed `currentPage` until E2E-TRIAGE.md — not a prop, so every fixture
 * silently rendered page 1. `Fixture["props"]` is `Record<string, unknown>`,
 * which is why nothing caught it.)
 */
const fixtures: Fixtures = [
  { name: "default", props: { defaultValue: 1, totalPages: 5 } },
  { name: "middle", props: { defaultValue: 5, totalPages: 20 }, note: "Drives the ellipsis, and leaves both nav buttons enabled." },
  {
    name: "rows-per-page",
    props: { defaultValue: 1, totalPages: 5, showRowsPerPage: true, rowsPerPage: 10 },
    note: "The selector needs BOTH the flag and a defined rowsPerPage.",
  },
  {
    name: "rows-per-page-open",
    props: { defaultValue: 1, totalPages: 5, showRowsPerPage: true, rowsPerPage: 10 },
    act: (c) => {
      const btn = c.querySelector("[aria-haspopup='listbox']");
      if (btn) fireEvent.click(btn);
    },
  },
  { name: "with-page-info", props: { defaultValue: 1, totalPages: 5, renderPageInfo: () => "1 of 5" }, note: "pageInfo has no boolean flag; it exists only via renderPageInfo." },
  { name: "disabled", props: { defaultValue: 1, totalPages: 5, disabled: true } },
];
export default fixtures;
