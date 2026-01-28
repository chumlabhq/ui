import type { ButtonGroupProps } from "./types";

const ButtonGroup = ({ children, className = "" }: ButtonGroupProps) => {
  return (
    <div className={className} role="group">
      {children}
    </div>
  );
};

ButtonGroup.displayName = "ButtonGroup";

export default ButtonGroup;
