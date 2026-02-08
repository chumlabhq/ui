import { forwardRef } from "react";
import type { DrawerBodyProps } from "../utils/types";
import { cn } from "../../../utils/cn";

const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(className) || undefined}
        data-drawer-body
        {...rest}
      >
        {children}
      </div>
    );
  },
);

DrawerBody.displayName = "DrawerBody";

export default DrawerBody;
