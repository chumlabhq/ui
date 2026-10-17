import { MultiSelectSearchableDropdown } from "../../../components/MultiSelectSearchableDropdown/index.js";
import type { Previews } from "./types.js";

const SKILLS = [
  { value: "css", label: "CSS" },
  { value: "figma", label: "Figma" },
  { value: "graphql", label: "GraphQL" },
  { value: "node", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "react", label: "React" },
  { value: "sql", label: "SQL" },
  { value: "typescript", label: "TypeScript" },
];

function Phone() {
  return (
    <MultiSelectSearchableDropdown label="Skills" options={SKILLS} defaultValue={["react", "typescript"]} defaultOpen />
  );
}

export default { phone: Phone } satisfies Previews;
