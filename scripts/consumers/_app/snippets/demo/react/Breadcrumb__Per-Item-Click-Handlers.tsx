import { useState } from "react";
import { Breadcrumb } from "@chumlab/ui/breadcrumb";

export default function BreadcrumbExample() {
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  return (
    <Breadcrumb
      items={
        [
          {
            id: "home",
            label: "Home",
            onClick: () => setClickedItem("Home (item.onClick)")
          },
          {
            id: "products",
            label: "Products",
            onClick: () => setClickedItem("Products (item.onClick)")
          },
          { id: "electronics", label: "Electronics" },
          { id: "phones", label: "Phones" }
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
      onItemClick={
        (item) =>
        setClickedItem(`${item.label} (onItemClick)`)
      }
    />
  );
}
