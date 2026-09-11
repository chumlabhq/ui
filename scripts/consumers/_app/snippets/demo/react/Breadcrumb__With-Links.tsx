import { useCallback, useState } from "react";
import { Breadcrumb, BreadcrumbItem } from "@chumlab/ui/breadcrumb";

const itemsWithLinks: BreadcrumbItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "category", label: "Technology", href: "/blog/technology" },
  { id: "post", label: "Building Breadcrumb Components" },
];

export default function BreadcrumbExample() {
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const handleItemClick = useCallback((item: BreadcrumbItem) => {
    setClickedItem(item.label);
    setTimeout(() => setClickedItem(null), 2000);
  }, []);
  return (
    <Breadcrumb
      items={itemsWithLinks}
      classes={
        { ...({
          list: "flex flex-wrap items-center gap-1",
          item: "flex items-center gap-1 px-2 py-1 text-sm transition-colors cursor-pointer bg-transparent border border-none rounded text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover dark:text-cl-text-tertiary dark:hover:text-cl-text dark:hover:bg-cl-bg-elevated",
          separator: "text-cl-text-tertiary",
          link: "flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors text-cl-accent hover:text-cl-accent hover:underline dark:text-cl-accent dark:hover:text-cl-accent dark:hover:underline"
        }), link: "flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors text-cl-accent hover:text-cl-accent hover:underline dark:text-cl-accent dark:hover:text-cl-accent dark:hover:underline" }
      }
      onItemClick={handleItemClick}
    />
  );
}
