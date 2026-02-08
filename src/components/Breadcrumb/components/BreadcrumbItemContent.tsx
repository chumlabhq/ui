import { memo } from "react";
import type { BreadcrumbItem } from "../utils/types";
import { cn } from "../../../utils/cn";

interface BreadcrumbItemContentProps {
  item: BreadcrumbItem;
  iconClassName?: string;
}

const BreadcrumbItemContent = memo(function BreadcrumbItemContent({
  item,
  iconClassName,
}: BreadcrumbItemContentProps) {
  const icon = item.icon != null && (
    <span className={cn(iconClassName) || undefined} aria-hidden="true">
      {item.icon}
    </span>
  );

  return (
    <>
      {item.iconPosition === "left" && icon}
      <span>{item.content || item.label}</span>
      {item.iconPosition === "right" && icon}
    </>
  );
});

BreadcrumbItemContent.displayName = "BreadcrumbItemContent";

export default BreadcrumbItemContent;
