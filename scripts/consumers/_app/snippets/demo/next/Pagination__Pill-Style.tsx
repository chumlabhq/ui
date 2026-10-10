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
      onRowsPerPageChange={
        (rows) => {
          setStyledRowsPerPage(rows);
          setStyledPage(1);
        }
      }
      showRowsPerPage
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
             item: "px-4 py-1.5 w-full text-left cursor-pointer transition-colors hover:bg-cl-bg-hover data-[selected]:bg-cl-accent-bg data-[selected]:text-cl-accent-hover data-[highlighted]:bg-cl-bg-hover text-cl-text"
           },
           label: "text-sm text-cl-text-secondary",
           pageInfo: "flex items-center"
         }),
                     root: "flex flex-wrap items-center justify-between gap-4 sm:gap-6 p-4 rounded-cl-lg bg-cl-bg-hover",
                     row: "flex items-center gap-1",
        navTrigger: "p-2 rounded-full shadow-sm hover:shadow transition-shadow disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text-secondary",
        item: "w-10 h-10 rounded-full shadow-sm hover:shadow transition-shadow flex items-center justify-center cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text data-[active]:bg-cl-accent-bg data-[active]:text-cl-accent-hover data-[active]:border data-[active]:border-cl-accent data-[active]:hover:text-cl-accent-hover",
                     list: "flex items-center gap-1",
                     rowsPerPage: {
                       trigger: "flex items-center gap-2 px-4 py-2 rounded-full shadow-sm hover:shadow transition-shadow cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text",
                       content: "rounded-cl-lg shadow-lg py-2 min-w-[80px] bg-cl-bg-panel border border-cl-border",
                       icon: "w-4 h-4 text-cl-text-secondary",
                       item: "px-4 py-2 w-full text-left cursor-pointer transition-colors hover:bg-cl-accent/10 data-[selected]:bg-cl-accent-bg data-[selected]:text-cl-accent-hover data-[highlighted]:bg-cl-accent/10 text-cl-text"
                     },
                     label: "text-sm font-medium text-cl-text-secondary",
                     ellipsis: "px-2 text-cl-text-tertiary",
                     navIcon: "w-5 h-5 text-cl-text-secondary"
                   }
      }
    />
  );
}
