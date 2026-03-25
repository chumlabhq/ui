import type { BreadcrumbItem } from "../utils/types";
import { cn } from "../../../utils/cn";

interface BreadcrumbItemContentProps {
  item: BreadcrumbItem;
  iconClassName?: string;
}

function BreadcrumbItemContent({ item, iconClassName }: BreadcrumbItemContentProps) {
  const position = item.iconPosition ?? (item.icon ? "left" : undefined);

  const icon = item.icon != null && (
    <span className={cn(iconClassName) || undefined} aria-hidden="true">
      {item.icon}
    </span>
  );

  return (
    <>
      {position === "left" && icon}
      <span>{item.content || item.label}</span>
      {position === "right" && icon}
    </>
  );
}

BreadcrumbItemContent.displayName = "BreadcrumbItemContent";

export default BreadcrumbItemContent;
