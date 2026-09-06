import { forwardRef } from "react";
import type { ButtonGroupProps } from "../utils/types.js";
import { cn } from "../../../utils/scopedCn.js";

const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, className, orientation = "horizontal", ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(className) || undefined}
        role="group"
        // No `aria-orientation`: `group` does not support it — the attribute is
        // for the roles that own arrow-key navigation (toolbar, listbox, menu,
        // radiogroup, tablist, tree). It rode along as `aria-allowed-attr`,
        // critical, on both orientations, and nothing rendered a group until
        // now. `data-orientation` carries the same fact for styling.
        data-orientation={orientation}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";

export default ButtonGroup;
