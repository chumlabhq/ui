import { Table } from "@chumlab/ui/table";
import type { ColumnDef } from "@tanstack/react-table";

interface User { name: string; email: string; }

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
];

const data: User[] = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
];

export default function Example() {
  return <Table columns={columns} data={data} />;
}
