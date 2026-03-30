import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";

export interface SwitchRenderProps {
  checked: boolean;
  disabled: boolean;
  error: boolean;
  loading: boolean;
  success: boolean;
  switchId: string;
  descriptionId?: string;
}

export interface SwitchClasses {
  root?: string;
  innerRow?: string;
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
  success?: string;
  loading?: string;
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
  onValueChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
  required?: boolean;
  id?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  success?: boolean;
  successMessage?: ReactNode;
  loading?: boolean;
  loader?: ReactNode;
  loaderSize?: number;
  checkedIcon?: ReactNode;
  uncheckedIcon?: ReactNode;
  transitionDuration?: number;
  transitionTimingFunction?: string;
  renderLabel?: (props: SwitchRenderProps) => ReactNode;
  renderDescription?: (props: SwitchRenderProps) => ReactNode;
  classes?: SwitchClasses;
  unstyled?: boolean;
  /** Inline styles applied to the root element. */
  style?: CSSProperties;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
}
