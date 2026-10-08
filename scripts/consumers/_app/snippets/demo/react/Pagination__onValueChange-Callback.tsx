import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function PaginationExample() {
  const [valuePage, setValuePage] = useState(1);
  const [valueLog, setValueLog] = useState<number[]>([]);
  return (
    <>
      <Pagination
        value={valuePage}
        totalPages={10}
        onValueChange={
          (page) => {
            setValuePage(page);
            setValueLog((prev) => [...prev.slice(-4), page]);
          }
        }
        classes={
          {
            root: "flex flex-wrap items-center gap-2",
            navButton: "p-2 rounded-cl-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-cl-border hover:bg-cl-bg-hover text-cl-text-secondary dark:border",
            ellipsis: "px-2 select-none text-cl-text-tertiary",
            rowsPerPage: {
              trigger: "flex items-center gap-2 px-3 py-1.5 rounded-cl-md transition-colors cursor-pointer border border-cl-border bg-cl-bg-panel hover:bg-cl-bg-hover dark:border dark:text-cl-text",
              content: "rounded-cl-md shadow-lg py-1 min-w-[64px] bg-cl-bg-panel border border-cl-border dark:border",
              icon: "w-4 h-4 transition-transform text-cl-text-secondary",
              positioner: "",
              item: "px-4 py-1.5 w-full text-left cursor-pointer transition-colors hover:bg-cl-bg-hover data-[selected]:bg-cl-accent/10 data-[selected]:text-cl-accent data-[highlighted]:bg-cl-bg-hover dark:text-cl-text dark:data-[selected]:bg-cl-accent/60"
            },
            label: "text-sm text-cl-text-secondary",
            pageInfo: "flex items-center"
          }
        }
      />
      <p
        className="mt-3 text-sm text-cl-text-secondary"
        role="status"
        aria-live="polite"
        data-demo-action
      >
        {
          valueLog.length
          ? `onValueChange received: ${valueLog.join(" → ")}`
          : "onValueChange has not fired yet — pick a page."
        }
      </p>
    </>
  );
}
