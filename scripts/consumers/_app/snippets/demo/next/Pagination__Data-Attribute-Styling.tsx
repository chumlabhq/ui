"use client";

import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function PaginationExample() {
  const [dataAttrPage, setDataAttrPage] = useState(3);
  return (
    <Pagination
      value={dataAttrPage}
      totalPages={10}
      onValueChange={setDataAttrPage}
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
                    navTrigger: "p-2 rounded-cl-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-cl-bg-hover text-cl-text-secondary",
                    item: "px-3 py-1 rounded-cl-md transition-colors cursor-pointer text-cl-text-secondary hover:bg-cl-bg-hover data-[active]:bg-cl-accent data-[active]:text-cl-on-accent data-[active]:hover:bg-cl-accent/90 hover:text-cl-text"
                  }
      }
    />
  );
}
