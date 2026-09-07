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
  /** Outer container div */
  root?: string;
  row?: string;
  labelGroup?: string;
  /** Label element */
  label?: string;
  /** Description span element */
  description?: string;
  control?: string;
  /** Thumb (handle) span element */
  thumb?: string;
  message?: string;
  loading?: string;
}

/**
 * Props for the Switch component.
 *
 * @example
 * ```tsx
 * <Switch checked={on} onValueChange={setOn} />
 * ```
 */
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
  /** Fires when the checked state changes. */
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
