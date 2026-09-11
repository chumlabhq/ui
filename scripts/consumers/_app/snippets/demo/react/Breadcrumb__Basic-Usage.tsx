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
    <>
      <Breadcrumb items={basicItems} onItemClick={handleItemClick} />
    </>
  );
}
