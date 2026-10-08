"use client";

import { useCallback, useState } from "react";
import { Breadcrumb, BreadcrumbItem } from "@chumlab/ui/breadcrumb";

const longItems: BreadcrumbItem[] = [
  { id: "home", label: "Home" },
  { id: "documentation", label: "Documentation" },
  { id: "themes", label: "Themes" },
  { id: "github", label: "GitHub" },
  { id: "components", label: "Components" },
  { id: "breadcrumb", label: "Breadcrumb" },
];

export default function BreadcrumbExample() {
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const handleItemClick = useCallback((item: BreadcrumbItem) => {
    setClickedItem(item.label);
    setTimeout(() => setClickedItem(null), 2000);
  }, []);
  return (
    <>
      <Breadcrumb
        items={longItems}
        maxVisibleItems={3}
        classes={
          {
                          ...({
            list: "flex flex-wrap items-center gap-1",
            item: "flex items-center gap-1 px-2 py-1 text-sm transition-colors cursor-pointer bg-transparent border border-none rounded text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover",
            separator: "text-cl-text-tertiary",
            link: "flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors text-cl-accent hover:text-cl-accent hover:underline"
          }),
                          ellipsisTrigger: "flex items-center justify-center w-8 h-8 rounded-cl-md transition-colors cursor-pointer bg-cl-bg-hover hover:bg-cl-text/[0.14] text-cl-text-secondary",
                          content: "flex flex-col min-w-40 rounded-cl-md shadow-lg py-1 bg-cl-bg-elevated border border-cl-border",
                          collapsedItem: "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border border-none text-cl-text-secondary hover:bg-cl-bg-elevated"
                        }
        }
        onItemClick={handleItemClick}
      />
      <Breadcrumb
        items={longItems}
        maxVisibleItems={4}
        classes={
          {
                          ...({
            list: "flex flex-wrap items-center gap-1",
            item: "flex items-center gap-1 px-2 py-1 text-sm transition-colors cursor-pointer bg-transparent border border-none rounded text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover",
            separator: "text-cl-text-tertiary",
            link: "flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors text-cl-accent hover:text-cl-accent hover:underline"
          }),
                          ellipsisTrigger: "flex items-center justify-center w-8 h-8 rounded-cl-md transition-colors cursor-pointer bg-cl-bg-hover hover:bg-cl-text/[0.14] text-cl-text-secondary",
                          content: "flex flex-col min-w-40 rounded-cl-md shadow-lg py-1 bg-cl-bg-elevated border border-cl-border",
                          collapsedItem: "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border border-none text-cl-text-secondary hover:bg-cl-bg-elevated"
                        }
        }
        onItemClick={handleItemClick}
      />
    </>
  );
}
