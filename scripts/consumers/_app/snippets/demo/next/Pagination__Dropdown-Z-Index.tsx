"use client";

import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function PaginationExample() {
  const [zIndexPage, setZIndexPage] = useState(1);
  const [zIndexRowsPerPage, setZIndexRowsPerPage] = useState(10);
  return (
    <Pagination
      value={zIndexPage}
      totalPages={10}
      onValueChange={setZIndexPage}
      showRowsPerPage
      rowsPerPage={zIndexRowsPerPage}
      onRowsPerPageChange={
        (rows) => {
          setZIndexRowsPerPage(rows);
          setZIndexPage(1);
        }
      }
      dropdownZIndex={100}
      classes={
        {
                    ...({
          root: "flex flex-wrap items-center gap-2",
          navButton: "p-2 rounded-cl-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-cl-border hover:bg-cl-bg-hover text-cl-text-secondary",
          ellipsis: "px-2 select-none text-cl-text-tertiary",
          rowsPerPage: {
            trigger: "flex items-center gap-2 px-3 py-1.5 rounded-cl-md transition-colors cursor-pointer border border-cl-border bg-cl-bg-panel hover:bg-cl-bg-hover text-cl-text",
            content: "rounded-cl-md shadow-lg py-1 min-w-[64px] bg-cl-bg-panel border border-cl-border",
            icon: "w-4 h-4 transition-transform text-cl-text-secondary",
            positioner: "",
            item: "px-4 py-1.5 w-full text-left cursor-pointer transition-colors hover:bg-cl-bg-hover data-[selected]:bg-cl-accent/10 data-[selected]:text-cl-accent data-[highlighted]:bg-cl-bg-hover text-cl-text"
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
