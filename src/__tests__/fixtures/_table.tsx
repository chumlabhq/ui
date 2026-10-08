import { useState } from "react";
import { Table } from "../../components/Table/index.js";
import { ROWS, COLUMNS } from "./_data.js";

// Its own module rather than inside Table.fixtures.tsx: the coverage audit reads
// every `name=` attribute in a fixtures file as that component's prop.

type Row = (typeof ROWS)[number];
const GET_ID = (r: Row) => r.id;

/** A presentational icon, the shape `CheckboxIcon` is for: no element of its own to focus. */
export const StarIcon = ({ checked, indeterminate, className }: { checked: boolean; indeterminate?: boolean; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} width="20" height="20" fill={checked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
    {indeterminate ? <path d="M6 12h12" /> : <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />}
  </svg>
);

/**
 * The default checkbox and a custom icon side by side, each with its own row
 * clicks and selection counted on the wrapper, so a browser check can hold the
 * custom one to what the default does on the same page.
 */
function Counted({ variant }: { variant: "default" | "custom" }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [rowClicks, setRowClicks] = useState(0);
  return (
    <div data-table-variant={variant} data-selected={selected.length} data-row-clicks={rowClicks}>
      <Table
        data={ROWS}
        columns={COLUMNS}
        selectionMode="multiple"
        getRowId={GET_ID}
        onSelectionChange={(ids) => setSelected(ids as string[])}
        onRowClick={() => setRowClicks((n) => n + 1)}
        // Inline on purpose: a new component every render, as consumers write it.
        CheckboxIcon={variant === "custom" ? (props) => <StarIcon {...props} /> : undefined}
      />
    </div>
  );
}

export function CheckboxPair() {
  return (
    <div className="space-y-6">
      <Counted variant="default" />
      <Counted variant="custom" />
    </div>
  );
}
