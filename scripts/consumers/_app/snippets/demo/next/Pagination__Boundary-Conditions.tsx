"use client";

import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function PaginationExample() {
  const [edgeSinglePage, setEdgeSinglePage] = useState(1);
  const [edgeBoundaryPage, setEdgeBoundaryPage] = useState(1);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="space-y-3">
        <Pagination
          value={1}
          totalPages={0}
          onValueChange={() => {}}
          classes={
            {
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
            }
          }
        />
        <p className="text-xs font-medium text-cl-text-tertiary">
          Both buttons disabled, no page buttons
        </p>
      </div>
      <div className="space-y-3">
        <Pagination
          value={edgeSinglePage}
          totalPages={1}
          onValueChange={setEdgeSinglePage}
          classes={
            {
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
            }
          }
        />
        <p className="text-xs font-medium text-cl-text-tertiary">
          Both buttons disabled, single active page
        </p>
      </div>
      <div className="space-y-3">
        <Pagination
          value={edgeBoundaryPage}
          totalPages={3}
          onValueChange={setEdgeBoundaryPage}
          classes={
            {
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
            }
          }
        />
        <p className="text-xs font-medium text-cl-text-tertiary">
          Navigate to page 1 or 3 to see disabled states
        </p>
      </div>
    </div>
  );
}
