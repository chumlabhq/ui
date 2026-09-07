import { Breadcrumb } from "@chumlab/ui/breadcrumb";

export default function PageHeader() {
  return (
    <Breadcrumb
      items={[
        { id: "home", label: "Home" },
        { id: "products", label: "Products" },
        { id: "electronics", label: "Electronics" },
        { id: "phones", label: "Phones" },
      ]}
      onItemClick={(item) => console.log("Navigate to:", item.label)}
    />
  );
}
