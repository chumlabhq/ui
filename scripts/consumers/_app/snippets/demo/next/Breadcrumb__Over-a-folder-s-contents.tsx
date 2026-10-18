"use client";

import { useState } from "react";
import { Breadcrumb } from "@chumlab/ui/breadcrumb";
import { Button } from "@chumlab/ui/button";
import { Table } from "@chumlab/ui/table";

export default function BreadcrumbExample() {
  const [folderPath, setFolderPath] = useState<string[]>(["Home"]);
  return (
    <div data-demo-recipe="breadcrumb-folders" className="w-full space-y-4">
      <Breadcrumb
        items={
          folderPath.map((name, index) => ({
            id: folderPath.slice(0, index + 1).join("/"),
            label: name,
            onClick: index < folderPath.length - 1 ? () => setFolderPath(folderPath.slice(0, index + 1)) : undefined
          }))
        }
      />
      <Table
        caption={`Contents of ${folderPath.join(" / ")}`}
        getRowId={(entry) => entry.name}
        data={
          (
            {
              Home: [
                { name: "Projects", kind: "Folder" },
                { name: "notes.txt", kind: "Text file" }
              ],
              "Home/Projects": [
                { name: "Chumlab", kind: "Folder" },
                { name: "roadmap.md", kind: "Markdown file" }
              ],
              "Home/Projects/Chumlab": [{ name: "README.md", kind: "Markdown file" }]
            } as Record<string, Array<{ name: string; kind: string }>>
          )[folderPath.join("/")] ?? []
        }
        columns={
          [
            {
              id: "name",
              accessorKey: "name",
              header: "Name",
              cell: ({ row }) =>
                row.original.kind === "Folder" ? (
                  <Button
                    className="px-0 py-0 text-cl-accent underline underline-offset-2"
                    onClick={() => setFolderPath([...folderPath, row.original.name])}
                  >
                    {row.original.name}
                  </Button>
                ) : (
                  row.original.name
                )
            },
            { id: "kind", accessorKey: "kind", header: "Kind" }
          ]
        }
      />
    </div>
  );
}
