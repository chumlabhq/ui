import type { ReactNode, ButtonHTMLAttributes } from "react";

export interface SwitchRenderProps {
  checked: boolean;
  disabled: boolean;
  switchId: string;
  descriptionId?: string;
}

export interface SwitchClasses {
  root?: string;
  labelContainer?: string;
  label?: string;
  disabledLabel?: string;
  description?: string;
  tracker?: string;
  disabledTracker?: string;
  thumb?: string;
  checkedTracker?: string;
  uncheckedTracker?: string;
  checkedThumb?: string;
  uncheckedThumb?: string;
  error?: string;
}

export interface SwitchProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick" | "role" | "aria-checked" | "type" | "id" | "defaultValue" | "onChange"
  > {
  className?: string;
  label?: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
  required?: boolean;
  id?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  classes?: SwitchClasses;
  errorClassName?: string;
  containerClassName?: string;
  labelContainerClassName?: string;
  labelClassName?: string;
  disabledLabelClassName?: string;
  descriptionClassName?: string;
  trackerClassName?: string;
  disabledTrackerClassName?: string;
  thumbClassName?: string;
  checkedTrackerClassName?: string;
  uncheckedTrackerClassName?: string;
  checkedThumbClassName?: string;
  uncheckedThumbClassName?: string;
  checkedIcon?: ReactNode;
  uncheckedIcon?: ReactNode;
  transitionDuration?: number;
  transitionTimingFunction?: string;
  renderLabel?: (props: SwitchRenderProps) => ReactNode;
  renderDescription?: (props: SwitchRenderProps) => ReactNode;
}
