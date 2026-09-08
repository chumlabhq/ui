"use client";

import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function PaginationExample() {
  const [dropdownUpPage, setDropdownUpPage] = useState(1);
  const [dropdownUpRowsPerPage, setDropdownUpRowsPerPage] = useState(10);
  const [dropdownDownPage, setDropdownDownPage] = useState(1);
  const [dropdownDownRowsPerPage, setDropdownDownRowsPerPage] = useState(10);
  return (
    <div className="space-y-8">
                <div className="space-y-3">
                  
                  <Pagination
                    value={dropdownUpPage}
                    totalPages={Math.ceil(100 / dropdownUpRowsPerPage)}
                    rowsPerPage={dropdownUpRowsPerPage}
                    onValueChange={setDropdownUpPage}
                    onRowsPerPageChange={(rows) => {
                      setDropdownUpRowsPerPage(rows);
                      setDropdownUpPage(1);
                    }}
                    showRowsPerPage
                    dropdownPosition="top"
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
                </div>
                <div
                  className="border-t pt-8 border-cl-border"
                >
                  <div className="space-y-3">
                    
                    <Pagination
                      value={dropdownDownPage}
                      totalPages={Math.ceil(100 / dropdownDownRowsPerPage)}
                      rowsPerPage={dropdownDownRowsPerPage}
                      onValueChange={setDropdownDownPage}
                      onRowsPerPageChange={(rows) => {
                        setDropdownDownRowsPerPage(rows);
                        setDropdownDownPage(1);
                      }}
                      showRowsPerPage
                      dropdownPosition="bottom"
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
                  </div>
                </div>
              </div>
  );
}
