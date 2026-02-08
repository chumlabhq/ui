import { forwardRef } from "react";
import type { DrawerHeaderProps } from "../utils/types";
import { useDrawerContext } from "../utils/context";
import { cn } from "../../../utils/cn";

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
