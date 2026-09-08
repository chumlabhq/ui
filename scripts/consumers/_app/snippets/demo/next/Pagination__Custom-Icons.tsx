"use client";

import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

const DoubleArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 5l7 7-7 7M5 5l7 7-7 7"
    />
  </svg>
);

const DoubleArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
    />
  </svg>
);

const CaretDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

export default function PaginationExample() {
  const [customIconsPage, setCustomIconsPage] = useState(1);
  const [customIconsRowsPerPage, setCustomIconsRowsPerPage] = useState(10);
  const [doubleArrowPage, setDoubleArrowPage] = useState(1);
  return (
    <div className="space-y-8">
                <div className="space-y-3">
                  
                  <Pagination
                    value={customIconsPage}
                    totalPages={Math.ceil(100 / customIconsRowsPerPage)}
                    rowsPerPage={customIconsRowsPerPage}
                    onValueChange={setCustomIconsPage}
                    onRowsPerPageChange={(rows) => {
                      setCustomIconsRowsPerPage(rows);
                      setCustomIconsPage(1);
                    }}
                    showRowsPerPage
                    prevIcon={ArrowLeftIcon}
                    nextIcon={ArrowRightIcon}
                    dropdownIcon={CaretDownIcon}
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
                      root: "flex flex-wrap items-center justify-between gap-4",
                      navButton: `p-2 rounded-cl-md border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-cl-border-input-focus bg-cl-accent/10 hover:bg-cl-accent/10 text-cl-accent dark:border dark:border-cl-border-input-focus dark:bg-cl-accent/30 dark:hover:bg-cl-accent/50 dark:text-cl-accent`,
                      navIcon: "w-5 h-5 text-cl-accent"
                    }}
                  />
                </div>
                <div
                  className="border-t pt-8 border-cl-border"
                >
                  <div className="space-y-3">
                    
                    <div className="flex justify-center">
                      <Pagination
                        value={doubleArrowPage}
                        totalPages={20}
                        onValueChange={setDoubleArrowPage}
                        prevIcon={
                          <DoubleArrowLeftIcon
                            className={`w-5 h-5 text-cl-success dark:text-cl-success`}
                          />
                        }
                        nextIcon={
                          <DoubleArrowRightIcon
                            className={`w-5 h-5 text-cl-success dark:text-cl-success`}
                          />
                        }
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
                          navButton: `p-2 rounded-full border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-cl-success bg-cl-success/15 hover:bg-cl-success/15 dark:border dark:border-cl-success dark:bg-cl-success/30 dark:hover:bg-cl-success/50`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
  );
}
