import type { ButtonGroupProps } from "./types";

const ButtonGroup = ({
  children,
  className = "",
  ...props
}: ButtonGroupProps) => {
  return (
    <div className={className} role="group" {...props}>
      {children}
    </div>
  );
};

ButtonGroup.displayName = "ButtonGroup";

export default ButtonGroup;
