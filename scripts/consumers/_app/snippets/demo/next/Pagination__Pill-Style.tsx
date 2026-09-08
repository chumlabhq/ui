"use client";

import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function PaginationExample() {
  const [styledPage, setStyledPage] = useState(1);
  const [styledRowsPerPage, setStyledRowsPerPage] = useState(10);
  return (
    <Pagination
                value={styledPage}
                totalPages={10}
                rowsPerPage={styledRowsPerPage}
                onValueChange={setStyledPage}
                onRowsPerPageChange={(rows) => {
                  setStyledRowsPerPage(rows);
                  setStyledPage(1);
                }}
                showRowsPerPage
                classes={{
                  ...({
        root: "flex flex-wrap items-center gap-2",
        navButton: `p-2 rounded-cl-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-cl-border hover:bg-cl-bg-hover text-cl-text-secondary dark:border dark:border-cl-border dark:hover:bg-cl-bg-elevated dark:text-cl-text-secondary`,
        ellipsis: `px-2 select-none text-cl-text-tertiary`,
        rowsPerPage: {
          trigger: `flex items-center gap-2 px-3 py-1.5 rounded-cl-md transition-colors cursor-pointer border border-cl-border bg-white hover:bg-cl-bg-hover dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10`,
          content: `rounded-cl-md shadow-lg py-1 min-w-[64px] bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
          icon: `w-4 h-4 transition-transform text-cl-text-secondary`,
          positioner: "",
          item: `px-4 py-1.5 w-full text-left cursor-pointer transition-colors hover:bg-cl-bg-hover data-[selected]:bg-cl-accent/10 data-[selected]:text-cl-accent data-[highlighted]:bg-cl-bg-hover dark:text-cl-text dark:hover:bg-cl-text/10 dark:data-[selected]:bg-cl-accent/60 dark:data-[selected]:text-cl-accent dark:data-[highlighted]:bg-cl-text/10`
        },
        label: `text-sm text-cl-text-secondary`,
        pageInfo: "flex items-center"
      }),
                  root: `flex flex-wrap items-center justify-between gap-4 sm:gap-6 p-4 rounded-cl-lg bg-cl-bg-hover dark:bg-cl-bg-elevated/40`,
                  row: "flex items-center gap-1",
     navButton: `p-2 rounded-full shadow-sm hover:shadow transition-shadow disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border dark:text-cl-text-secondary`,
     item: `w-10 h-10 rounded-full shadow-sm hover:shadow transition-shadow flex items-center justify-center cursor-pointer bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border dark:text-cl-text`,
                  list: "flex items-center gap-1",
                  rowsPerPage: {
                    trigger: `flex items-center gap-2 px-4 py-2 rounded-full shadow-sm hover:shadow transition-shadow cursor-pointer bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border dark:text-cl-text`,
                    content: `rounded-cl-lg shadow-lg py-2 min-w-[80px] bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
                    icon: `w-4 h-4 text-cl-text-secondary`,
                    item: `px-4 py-2 w-full text-left cursor-pointer transition-colors hover:bg-cl-accent/10 data-[selected]:bg-cl-accent/10 data-[selected]:text-cl-accent data-[highlighted]:bg-cl-accent/10 dark:text-cl-text dark:hover:bg-cl-accent/40 dark:data-[selected]:bg-cl-accent/60 dark:data-[selected]:text-cl-accent dark:data-[highlighted]:bg-cl-accent/40`
                  },
                  label: `text-sm font-medium text-cl-text-secondary`,
                  ellipsis: `px-2 text-cl-text-tertiary`,
                  navIcon: "w-5 h-5 text-cl-text-secondary"
                }}
              />
  );
}
