import { forwardRef } from "react";
import type { DrawerFooterProps } from "../utils/types";
import { cn } from "../../../utils/cn";

const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(className) || undefined}
        data-drawer-footer
        {...rest}
      >
        {children}
      </div>
    );
  },
);

DrawerFooter.displayName = "DrawerFooter";

export default DrawerFooter;
