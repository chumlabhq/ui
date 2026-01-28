export function getColumnId(columnDef: {
  accessorKey?: string;
  id?: string;
}): string {
  return columnDef.accessorKey ?? columnDef.id ?? "";
}

export function getSortDirection(
  isSorted: false | "asc" | "desc",
): "ascending" | "descending" | "none" {
  if (isSorted === "asc") return "ascending";
  if (isSorted === "desc") return "descending";
  return "none";
}

export function isInteractiveElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  return !!target.closest(
    "[data-popup-content], [data-interactive], button, a, input, select, textarea, [role='button'], [role='link']",
  );
}
