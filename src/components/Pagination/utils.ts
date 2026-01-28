export function getVisiblePages(
  totalPages: number,
  currentPage: number,
  visibleCount: number = 3
): (number | "ellipsis")[] {
  if (totalPages <= visibleCount + 1) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  for (let i = 1; i <= visibleCount; i++) {
    pages.push(i);
  }

  if (currentPage > visibleCount) {
    pages.push("ellipsis");
    pages.push(currentPage);
  }

  return pages;
}
