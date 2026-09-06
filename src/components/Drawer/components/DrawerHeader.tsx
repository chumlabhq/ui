import { forwardRef, useEffect } from "react";
import type { DrawerHeaderProps } from "../utils/types.js";
import { useDrawerContext } from "../utils/context.js";
import { cn } from "../../../utils/scopedCn.js";

const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ children, className, id: idProp, ...rest }, ref) => {
    const context = useDrawerContext();
    const id = idProp ?? context?.titleId;

    // Only when the header takes the drawer's own title id: a header given its
    // own `id` names something else, and the panel must not point at it.
    const owns = !idProp && !!context;
    const register = context?.registerTitle;
    useEffect(() => {
      if (!owns || !register) return;
      register(true);
      return () => register(false);
    }, [owns, register]);

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
