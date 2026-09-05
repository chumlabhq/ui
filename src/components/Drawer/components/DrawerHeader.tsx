import { forwardRef } from "react";
import type { DrawerHeaderProps } from "../utils/types.js";
import { useDrawerContext } from "../utils/context.js";
import { cn } from "../../../utils/scopedCn.js";

const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ children, className, id: idProp, ...rest }, ref) => {
    const context = useDrawerContext();
    const id = idProp ?? context?.titleId;

    return (
      <div
        ref={ref}
        id={id}
        className={cn(className) || undefined}
        data-drawer-header
        {...rest}
      >
        {children}
      </div>
    );
  },
);

DrawerHeader.displayName = "DrawerHeader";

export default DrawerHeader;
