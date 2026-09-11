import { useCallback, useState } from "react";
import { Breadcrumb, BreadcrumbItem } from "@chumlab/ui/breadcrumb";

const basicItems: BreadcrumbItem[] = [
  { id: "home", label: "Home" },
  { id: "products", label: "Products" },
  { id: "electronics", label: "Electronics" },
  { id: "phones", label: "Phones" },
];

export default function BreadcrumbExample() {
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const handleItemClick = useCallback((item: BreadcrumbItem) => {
    setClickedItem(item.label);
    setTimeout(() => setClickedItem(null), 2000);
  }, []);
  return (
    <Breadcrumb
      items={basicItems}
      classes={
        {
          root: "p-4 rounded-cl-md bg-cl-accent/10 dark:bg-cl-accent/20",
          list: "flex flex-wrap items-center gap-1",
          item: "flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer bg-transparent border border-none text-cl-accent hover:text-cl-accent hover:bg-cl-accent/10 dark:text-cl-accent dark:hover:text-cl-accent dark:hover:bg-cl-accent/20",
          separator: "text-cl-accent"
        }
      }
      onItemClick={handleItemClick}
    />
  );
}
