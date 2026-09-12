"use client";

import { useCallback, useState } from "react";
import { Breadcrumb, BreadcrumbItem } from "@chumlab/ui/breadcrumb";

export default function BreadcrumbExample() {
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const handleItemClick = useCallback((item: BreadcrumbItem) => {
    setClickedItem(item.label);
    setTimeout(() => setClickedItem(null), 2000);
  }, []);
  return (
    <Breadcrumb
      items={
        [
          { id: "home", label: "Home" },
          {
            id: "status",
            label: "Status",
            content: (
              <span className="flex items-center gap-1.5">
                Status{" "}
                <span
                  className={"inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-cl-success/15 text-cl-text dark:bg-cl-success/20 dark:text-cl-success"}
                >
                  Active
                </span>
              </span>
            )
          },
          {
            id: "details",
            label: "Details",
            content: (
              <span className="flex items-center gap-1.5">
                Details{" "}
                <span
                  className={"inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-cl-accent/10 text-cl-text dark:bg-cl-accent/20 dark:text-cl-accent"}
                >
                  New
                </span>
              </span>
            )
          },
          { id: "current", label: "Overview" }
        ]
      }
      classes={
        {
          list: "flex flex-wrap items-center gap-1",
          item: "flex items-center gap-1 px-2 py-1 text-sm transition-colors cursor-pointer bg-transparent border border-none rounded text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover dark:text-cl-text-tertiary dark:hover:text-cl-text dark:hover:bg-cl-bg-elevated",
          separator: "text-cl-text-tertiary",
          link: "flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors text-cl-accent hover:text-cl-accent hover:underline dark:text-cl-accent dark:hover:text-cl-accent dark:hover:underline"
        }
      }
      onItemClick={handleItemClick}
    />
  );
}
