import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function PaginationExample() {
  const [pageInfoPage, setPageInfoPage] = useState(1);
  const [pageInfoRowsPerPage, setPageInfoRowsPerPage] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  return (
    <Pagination
                value={pageInfoPage}
                totalPages={Math.ceil(100 / pageInfoRowsPerPage)}
                rowsPerPage={pageInfoRowsPerPage}
                onValueChange={setPageInfoPage}
                onRowsPerPageChange={(rows) => {
                  setPageInfoRowsPerPage(rows);
                  setPageInfoPage(1);
                }}
                showRowsPerPage
                renderPageInfo={({ value, totalPages, rowsPerPage: rpp }) => (
                  <span
                    className={`text-sm tabular-nums text-cl-text-secondary`}
                  >
                    Page {value} of {totalPages}
                    {rpp ? ` (${rpp} per page)` : ""}
                  </span>
                )}
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
                  root: "flex flex-wrap items-center justify-between gap-4"
                }}
              />
  );
}
