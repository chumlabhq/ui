/**
 * Joins class names, filtering out falsy values.
 */
export function joinClasses(
  ...classes: (string | false | null | undefined)[]
): string {
  return classes.filter(Boolean).join(" ");
}
