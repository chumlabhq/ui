import type { ButtonGroupProps } from "../utils/types";
import { cn } from "../../../utils/cn";

const ButtonGroup = ({
  children,
  className,
  ...props
}: ButtonGroupProps) => {
  return (
    <div className={cn(className) || undefined} role="group" {...props}>
      {children}
    </div>
  );
};

ButtonGroup.displayName = "ButtonGroup";

export default ButtonGroup;
