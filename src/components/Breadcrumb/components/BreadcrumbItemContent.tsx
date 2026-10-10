import type { BreadcrumbItem } from "../utils/types.js";
import { cn } from "../../../utils/scopedCn.js";

interface BreadcrumbItemContentProps {
  item: BreadcrumbItem;
  iconClassName?: string;
}

function BreadcrumbItemContent({ item, iconClassName }: BreadcrumbItemContentProps) {
  const position = item.iconPosition ?? (item.icon ? "start" : undefined);

  const icon = item.icon != null && (
    <span className={cn(iconClassName) || undefined} aria-hidden="true">
      {item.icon}
    </span>
  );

  return (
    <>
      {position === "start" && icon}
      <span>{item.content || item.label}</span>
      {position === "end" && icon}
    </>
  );
}

BreadcrumbItemContent.displayName = "BreadcrumbItemContent";

export default BreadcrumbItemContent;
