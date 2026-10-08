import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Pagination } from "@chumlab/ui/pagination";

export default function PaginationExample() {
  const [externalRows, setExternalRows] = useState(10);
  const [externalPage, setExternalPage] = useState(1);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-cl-text-secondary">Items per page:</span>
        {
          [10, 25, 50, 100].map((r) => (
            <Button
              key={r}
              size="md"
              onClick={
                () => {
                  setExternalRows(r);
                  setExternalPage(1);
                }
              }
              className={
                `rounded-cl-md border ${
                  externalRows === r
                    ? "bg-cl-accent text-cl-on-accent border-cl-border-input-focus"
                    : "border-cl-border text-cl-text hover:bg-cl-bg-hover"
                }`
              }
            >
              {r}
            </Button>
          ))
        }
      </div>
      <Pagination
        value={externalPage}
        totalPages={Math.ceil(200 / externalRows)}
        onValueChange={setExternalPage}
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
    </div>
  );
}
