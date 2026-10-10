import { useCallback, useState } from "react";
import { Breadcrumb, BreadcrumbItem } from "@chumlab/ui/breadcrumb";

const ArrowIcon = ({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path
      fillRule="evenodd"
      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

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
    <>
      <Breadcrumb
        items={basicItems}
        separator={<span className="text-cl-text-tertiary">/</span>}
        classes={
          {
            list: "flex flex-wrap items-center gap-1",
            item: "flex items-center gap-1 px-2 py-1 text-sm transition-colors cursor-pointer bg-transparent border border-none rounded text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover",
            separator: "text-cl-text-tertiary",
            link: "flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors text-cl-accent hover:text-cl-accent hover:underline"
          }
        }
        onItemClick={handleItemClick}
      />
      <Breadcrumb
        items={basicItems}
        separatorIcon={<ArrowIcon style={{ width: 16, height: 16 }} />}
        classes={
          {
            list: "flex flex-wrap items-center gap-1",
            item: "flex items-center gap-1 px-2 py-1 text-sm transition-colors cursor-pointer bg-transparent border border-none rounded text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover",
            separator: "text-cl-text-tertiary",
            link: "flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors text-cl-accent hover:text-cl-accent hover:underline"
          }
        }
        onItemClick={handleItemClick}
      />
    </>
  );
}
