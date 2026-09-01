import { fireEvent } from "@testing-library/react";
import type { Fixtures } from "./types";

const fixtures: Fixtures = [
  { name: "default", props: { currentPage: 1, totalPages: 5 } },
  { name: "middle", props: { currentPage: 5, totalPages: 20 }, note: "Drives the ellipsis." },
  {
    name: "rows-per-page",
    props: { currentPage: 1, totalPages: 5, showRowsPerPage: true, rowsPerPage: 10 },
    note: "The selector needs BOTH the flag and a defined rowsPerPage.",
  },
  {
    name: "rows-per-page-open",
    props: { currentPage: 1, totalPages: 5, showRowsPerPage: true, rowsPerPage: 10 },
    act: (c) => {
      const btn = c.querySelector("[aria-haspopup='listbox']");
      if (btn) fireEvent.click(btn);
    },
  },
  { name: "with-page-info", props: { currentPage: 1, totalPages: 5, renderPageInfo: () => "1 of 5" }, note: "pageInfo has no boolean flag; it exists only via renderPageInfo." },
  { name: "disabled", props: { currentPage: 1, totalPages: 5, disabled: true } },
];
export default fixtures;
