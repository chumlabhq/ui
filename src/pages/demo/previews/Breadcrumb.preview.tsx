import { Breadcrumb } from "../../../components/Breadcrumb/index.js";
import type { Previews } from "./types.js";

const TRAIL = [
  { id: "home", label: "Home", href: "#" },
  { id: "projects", label: "Projects", href: "#" },
  { id: "design-system", label: "Design system", href: "#" },
  { id: "components", label: "Components", href: "#" },
  { id: "navigation", label: "Navigation", href: "#" },
  { id: "breadcrumb", label: "Breadcrumb" },
];

function Phone() {
  return <Breadcrumb items={TRAIL} maxVisible={3} />;
}

export default { phone: Phone } satisfies Previews;
