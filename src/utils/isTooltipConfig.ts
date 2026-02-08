export function isTooltipConfig<T extends { content: unknown }>(
  value: unknown,
): value is T {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "content" in value &&
    !("$$typeof" in value)
  );
}
