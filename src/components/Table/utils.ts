import type { ColumnDef } from "@tanstack/react-table";

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

/**
 * Escapes a CSV field value, wrapping in double quotes if necessary.
 */
function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export table data to CSV and trigger a browser download.
 *
 * @param data - Array of row data objects.
 * @param columns - TanStack column definitions. Used to derive headers and accessors.
 * @param filename - Name of the downloaded file (without extension). Defaults to "table-export".
 */
export function exportTableToCSV<TData>(
  data: TData[],
  columns: ColumnDef<TData>[],
  filename = "table-export",
): void {
  if (typeof document === "undefined") return;
  // Build header row and accessor functions
  const headers: string[] = [];
  const accessors: ((row: TData) => unknown)[] = [];

  for (const col of columns) {
    const def = col as { accessorKey?: string; id?: string; header?: unknown; accessorFn?: (row: TData) => unknown };
    const id = def.accessorKey ?? def.id;
    if (!id || id.startsWith("__")) continue;

    // Use header as label if it's a string, otherwise fall back to id
    const headerLabel = typeof def.header === "string" ? def.header : id;
    headers.push(headerLabel);

    if (def.accessorFn) {
      accessors.push(def.accessorFn);
    } else if (def.accessorKey) {
      const key = def.accessorKey;
      accessors.push((row: TData) => (row as Record<string, unknown>)[key]);
    } else {
      accessors.push(() => "");
    }
  }

  const lines: string[] = [headers.map(escapeCsvField).join(",")];

  for (const row of data) {
    const values = accessors.map((accessor) => escapeCsvField(accessor(row)));
    lines.push(values.join(","));
  }

  const csvContent = lines.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to the clipboard using the Clipboard API with a fallback.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof document === "undefined") return false;
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
}
