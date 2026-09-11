"use client";

import { useRef, useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function PaginationExample() {
  const [refPage, setRefPage] = useState(1);
  const paginationRef = useRef<HTMLElement>(null);
  return (
    <Pagination
      ref={paginationRef}
      id="ref-demo-pagination"
      data-section="footer"
      tabIndex={-1}
      value={refPage}
      totalPages={5}
      onValueChange={setRefPage}
      className="p-3 rounded-cl-md transition-all focus:bg-cl-accent/10 dark:focus:bg-cl-bg-elevated/50"
      classes={
        {
          root: "flex flex-wrap items-center gap-2",
          navButton: "p-2 rounded-cl-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-cl-border hover:bg-cl-bg-hover text-cl-text-secondary dark:border dark:border-cl-border dark:hover:bg-cl-bg-elevated dark:text-cl-text-secondary",
          ellipsis: "px-2 select-none text-cl-text-tertiary",
          rowsPerPage: {
            trigger: "flex items-center gap-2 px-3 py-1.5 rounded-cl-md transition-colors cursor-pointer border border-cl-border bg-white hover:bg-cl-bg-hover dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10",
            content: "rounded-cl-md shadow-lg py-1 min-w-[64px] bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
            icon: "w-4 h-4 transition-transform text-cl-text-secondary",
            positioner: "",
            item: "px-4 py-1.5 w-full text-left cursor-pointer transition-colors hover:bg-cl-bg-hover data-[selected]:bg-cl-accent/10 data-[selected]:text-cl-accent data-[highlighted]:bg-cl-bg-hover dark:text-cl-text dark:hover:bg-cl-text/10 dark:data-[selected]:bg-cl-accent/60 dark:data-[selected]:text-cl-accent dark:data-[highlighted]:bg-cl-text/10"
          },
          label: "text-sm text-cl-text-secondary",
          pageInfo: "flex items-center"
        }
      }
    />
  );
}
