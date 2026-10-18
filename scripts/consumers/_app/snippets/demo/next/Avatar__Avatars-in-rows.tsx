import { Avatar } from "@chumlab/ui/avatar";
import { Dropdown } from "@chumlab/ui/dropdown";
import { Table } from "@chumlab/ui/table";

export default function AvatarExample() {
  return (
    <div data-demo-recipe="avatars-in-rows" className="w-full space-y-6">
      <Table
        caption="The team"
        getRowId={(person) => person.id}
        data={
          [
            { id: "ada", name: "Ada Lovelace", role: "Engineer" },
            { id: "grace", name: "Grace Hopper", role: "Admiral" },
            { id: "alan", name: "Alan Turing", role: "Researcher" }
          ]
        }
        columns={
          [
            {
              id: "name",
              accessorKey: "name",
              header: "Name",
              cell: ({ row }) => (
                <span className="flex items-center gap-2">
                  <Avatar name={row.original.name} size="sm" />
                  {row.original.name}
                </span>
              )
            },
            { id: "role", accessorKey: "role", header: "Role" }
          ]
        }
      />
      <div className="w-full sm:max-w-xs">
        <Dropdown
          label="Assign to"
          options={
            ["Ada Lovelace", "Grace Hopper", "Alan Turing"].map((name) => (
              {
                value: name,
                label: name,
                content: (
                  <span className="flex items-center gap-2">
                    <Avatar name={name} size="xs" />
                    {name}
                  </span>
                )
              }
            ))
          }
        />
      </div>
    </div>
  );
}
