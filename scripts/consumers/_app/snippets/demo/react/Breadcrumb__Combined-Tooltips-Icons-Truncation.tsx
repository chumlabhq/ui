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
          {
            id: "home",
            label: "Home",
            tooltip: "Go to homepage",
            icon: <HomeIcon className="w-4 h-4" />
          },
          {
            id: "l1",
            label: "Projects",
            tooltip: "View all projects",
            icon: <FolderIcon className="w-4 h-4" />
          },
          {
            id: "l2",
            label: "Web Development",
            tooltip: "Web projects",
            icon: <FolderIcon className="w-4 h-4" />
          },
          {
            id: "l3",
            label: "React Applications",
            tooltip: "React projects",
            icon: <FolderIcon className="w-4 h-4" />
          },
          {
            id: "l4",
            label: "Component Library",
            tooltip: "UI library",
            icon: <FolderIcon className="w-4 h-4" />
          },
          {
            id: "current",
            label: "Breadcrumb",
            tooltip: "Currently viewing",
            tooltipProps: { side: "bottom" },
            icon: <DocumentIcon className="w-4 h-4" />,
            iconPosition: "right"
          }
        ]
      }
      maxVisibleItems={3}
      showTooltips
      ellipsisTooltip="Show 3 hidden items"
      defaultTooltipProps={{ delayDuration: 150 }}
      classes={
        {
                    ...({
          root: "p-4 rounded-cl-md bg-cl-accent/10 dark:bg-cl-accent/20",
          list: "flex flex-wrap items-center gap-1",
          item: "flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer bg-transparent border border-none text-cl-accent hover:text-cl-accent hover:bg-cl-accent/10 dark:hover:bg-cl-accent/20",
          separator: "text-cl-accent"
        }),
                    itemIcon: "shrink-0",
                    ellipsisTrigger: "flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer bg-cl-accent-bg hover:bg-cl-accent-bg-hover text-cl-accent-hover",
                    content: "flex flex-col min-w-40 rounded-cl-md shadow-lg py-1 bg-cl-bg-panel border border-cl-border-input-focus dark:border",
                    collapsedItem: "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border border-none text-cl-accent hover:bg-cl-accent/10 dark:hover:bg-cl-accent/20"
                  }
      }
      onItemClick={handleItemClick}
    />
  );
}
