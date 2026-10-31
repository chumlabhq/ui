"use client";

import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function PaginationExample() {
  const [pageInfoPage, setPageInfoPage] = useState(1);
  const [pageInfoRowsPerPage, setPageInfoRowsPerPage] = useState(10);
  return (
    <Pagination
      value={pageInfoPage}
      totalPages={Math.ceil(100 / pageInfoRowsPerPage)}
      rowsPerPage={pageInfoRowsPerPage}
      onValueChange={setPageInfoPage}
      onRowsPerPageChange={
        (rows) => {
          setPageInfoRowsPerPage(rows);
          setPageInfoPage(1);
        }
      }
      showRowsPerPage
      renderPageInfo={
        ({ value, totalPages, rowsPerPage: rpp }) => (
          <span
            className={"text-sm tabular-nums text-cl-text-secondary"}
          >
            Page {value} of {totalPages}
            {rpp ? ` (${rpp} per page)` : ""}
          </span>
        )
      }
      classes={
        {
                    ...({
          root: "flex flex-wrap items-center gap-2",
          navTrigger: "p-2 rounded-cl-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-cl-border hover:bg-cl-bg-hover text-cl-text-secondary",
          ellipsis: "px-2 select-none text-cl-text-tertiary",
          rowsPerPage: {
            trigger: "flex items-center gap-2 px-3 py-1.5 rounded-cl-md transition-colors cursor-pointer border border-cl-border bg-cl-bg-panel hover:bg-cl-bg-hover text-cl-text",
            content: "rounded-cl-md shadow-lg py-1 min-w-[64px] bg-cl-bg-panel border border-cl-border",
            icon: "w-4 h-4 transition-transform text-cl-text-secondary",
            positioner: "",
            item: "px-4 py-1.5 w-full text-start cursor-pointer transition-colors hover:bg-cl-bg-hover data-[selected]:bg-cl-accent-bg data-[selected]:text-cl-accent-hover data-[highlighted]:bg-cl-bg-hover text-cl-text"
          },
          label: "text-sm text-cl-text-secondary",
          pageInfo: "flex items-center"
        }),
                    root: "flex flex-wrap items-center justify-between gap-4"
                  }
      }
    />
  );
}
