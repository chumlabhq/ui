"use client";

import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function PaginationExample() {
  const [i18nPage, setI18nPage] = useState(1);
  const [i18nRowsPerPage, setI18nRowsPerPage] = useState(10);
  return (
    <Pagination
      value={i18nPage}
      totalPages={Math.ceil(100 / i18nRowsPerPage)}
      rowsPerPage={i18nRowsPerPage}
      onValueChange={setI18nPage}
      onRowsPerPageChange={
        (rows) => {
          setI18nRowsPerPage(rows);
          setI18nPage(1);
        }
      }
      showRowsPerPage
      showLabel="Afficher"
      rowsPerPageLabel="lignes"
      dropdownAriaLabel="Lignes par page"
      paginationAriaLabel="Navigation des pages"
      prevAriaLabel="Page pr\u00e9c\u00e9dente"
      nextAriaLabel="Page suivante"
      pageAriaLabel={(page) => `Page ${page}`}
      renderPageInfo={
        ({ value, totalPages }) => (
          <span
            className={"text-sm text-cl-text-secondary"}
          >
            Page {value} sur {totalPages}
          </span>
        )
      }
      classes={
        {
                    ...({
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
        }),
                    root: "flex flex-wrap items-center justify-between gap-4"
                  }
      }
    />
  );
}
