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
        aria-orientation={orientation}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";

export default ButtonGroup;
