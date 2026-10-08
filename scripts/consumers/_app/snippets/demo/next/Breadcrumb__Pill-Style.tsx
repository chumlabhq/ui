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
    <Breadcrumb
      items={longItems}
      maxVisibleItems={4}
      classes={
        { ...({
          list: "flex flex-wrap items-center gap-2",
          item: "flex items-center gap-1 px-4 py-2 text-sm rounded-full transition-all cursor-pointer text-cl-text hover:text-cl-text bg-cl-bg-panel hover:bg-cl-bg-hover border border-cl-border dark:border-cl-text-tertiary hover:shadow-sm",
          separator: "text-cl-text-secondary",
          ellipsisTrigger: "flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer bg-cl-bg-panel hover:bg-cl-bg-hover text-cl-text-secondary border border-cl-border dark:border-cl-text-tertiary hover:shadow-sm",
          content: "flex flex-col min-w-40 rounded-cl-lg shadow-lg py-2 bg-cl-bg-elevated border border-cl-border",
          collapsedItem: "flex items-center gap-2 px-4 py-2 text-sm cursor-pointer w-full text-left bg-transparent text-cl-text-secondary hover:bg-cl-bg-hover"
        }), itemIcon: "shrink-0" }
      }
      onItemClick={handleItemClick}
    />
  );
}
