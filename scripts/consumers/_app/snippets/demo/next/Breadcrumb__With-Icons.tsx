"use client";

import { useCallback, useState } from "react";
import { Breadcrumb, BreadcrumbItem } from "@chumlab/ui/breadcrumb";

const DocumentIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
      clipRule="evenodd"
    />
  </svg>
);

const FolderIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
  </svg>
);

const HomeIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const itemsWithIcons: BreadcrumbItem[] = [
  { id: "home", label: "Home", icon: <HomeIcon className="w-4 h-4" /> },
  {
    id: "documents",
    label: "Documents",
    icon: <FolderIcon className="w-4 h-4" />,
  },
  { id: "reports", label: "Reports", icon: <FolderIcon className="w-4 h-4" /> },
  {
    id: "annual-report",
    label: "Annual Report",
    icon: <DocumentIcon className="w-4 h-4" />,
    iconPosition: "end",
  },
];

export default function BreadcrumbExample() {
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const handleItemClick = useCallback((item: BreadcrumbItem) => {
    setClickedItem(item.label);
    setTimeout(() => setClickedItem(null), 2000);
  }, []);
  return (
    <Breadcrumb
      items={itemsWithIcons}
      classes={
        { ...({
          list: "flex flex-wrap items-center gap-1",
          item: "flex items-center gap-1 px-2 py-1 text-sm transition-colors cursor-pointer bg-transparent border border-none rounded text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover",
          separator: "text-cl-text-tertiary",
          link: "flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors text-cl-accent hover:text-cl-accent hover:underline"
        }), itemIcon: "shrink-0" }
      }
      onItemClick={handleItemClick}
    />
  );
}
