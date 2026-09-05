import { Button } from "@chumlab/ui/button";
import { DatePicker, Dropdown, Table } from "@chumlab/ui";

/**
 * The same component in all five consumers, copied in by
 * verify-consumer-matrix.mjs rather than duplicated per template.
 *
 * Four components across the shapes the bundle gate classifies — a control, an
 * overlay, an anchored surface and a data surface — because a package can
 * resolve for one and not the others: a subpath export can be wrong on its own,
 * and a chunk can lose its "use client" without the rest of the package
 * noticing.
 *
 * Deliberately not marked "use client". Under the App Router this is a server
 * component, so every client boundary here has to come from the library's own
 * directives. Marking it would test the template instead of the package.
 *
 * Every prop is a plain value for the same reason: a function prop crossing the
 * server boundary is a Next error about the consumer, not about the library,
 * and it would mask the failure this is looking for.
 */
const OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

type Row = { id: string; name: string; role: string };

const ROWS: Row[] = [
  { id: "1", name: "Ada", role: "Engineer" },
  { id: "2", name: "Grace", role: "Admiral" },
];

const COLUMNS = [
  { id: "name", accessorKey: "name", header: "Name" },
  { id: "role", accessorKey: "role", header: "Role" },
];

export default function Showcase() {
  return (
    <main>
      {/* The sentinel the matrix greps for in server-rendered HTML. */}
      <h1>chumlab-consumer-smoke</h1>
      <Button>Save</Button>
      <Dropdown options={OPTIONS} label="Fruit" />
      <DatePicker label="Date" />
      <Table data={ROWS} columns={COLUMNS} />
    </main>
  );
}
