import { Button } from "@chumlab/ui/button";
import { Dropdown } from "@chumlab/ui/dropdown";
import { Table } from "@chumlab/ui/table";

/**
 * The library beside a consumer's own Tailwind, which is the premise `.cl-s`
 * exists for and the one nothing tested: all seven other templates import a
 * plain stylesheet and never run Tailwind at all.
 *
 * Every probe is a `data-probe` hook rather than a class, because the checks
 * ask the browser what was computed and a class would be the thing under test.
 */
const OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

const ROWS = [
  { id: "1", name: "Ada", role: "Engineer" },
  { id: "2", name: "Grace", role: "Admiral" },
];

const COLUMNS = [
  { id: "name", accessorKey: "name", header: "Name" },
  { id: "role", accessorKey: "role", header: "Role" },
];

export default function TailwindShowcase() {
  return (
    <main>
      <h1>chumlab-consumer-smoke</h1>

      {/* The consumer's own markup, in their own utilities. If the library's
          stylesheet reaches these, it has broken their page. */}
      <div data-probe="theirs" className="flex gap-4 bg-brand p-4">
        <span data-probe="their-text" className="text-white">theirs</span>
        <button data-probe="their-button">unstyled by their preflight</button>
      </div>

      <div data-probe="ours-button"><Button>Save</Button></div>
      <div data-probe="ours-dropdown"><Dropdown options={OPTIONS} label="Fruit" /></div>
      <div data-probe="ours-table">
        <Table data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} />
      </div>
    </main>
  );
}
