"use client";

import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function PaginationExample() {
  const [minimalPage, setMinimalPage] = useState(1);
  return (
    <div className="flex justify-center">
      <Pagination
        value={minimalPage}
        totalPages={12}
        onValueChange={setMinimalPage}
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
                        root: "flex items-center",
                        navTrigger: "p-1.5 rounded-cl-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-cl-bg-hover text-cl-text-secondary",
                        item: "min-w-[36px] h-9 rounded-cl-md flex items-center justify-center text-sm font-medium transition-colors cursor-pointer text-cl-text-secondary hover:bg-cl-bg-hover hover:text-cl-text data-[active]:bg-cl-accent-bg data-[active]:text-cl-accent-hover data-[active]:border data-[active]:border-cl-accent data-[active]:hover:text-cl-accent-hover",
                        ellipsis: "px-1 text-cl-text-tertiary",
                        list: "flex items-center gap-0.5",
                        navIcon: "w-4 h-4"
                      }
        }
      />
    </div>
  );
}
