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
  /** The line holding the label group and the track, which is what `labelPosition` reorders. */
  row?: string;
  /** The label and description stacked together, so they move as one. */
  labelGroup?: string;
  /** Label element */
  label?: string;
  /** Description span element */
  description?: string;
  /** The track the thumb slides along. */
  control?: string;
  /** Thumb (handle) span element */
  thumb?: string;
  /** The error or hint line under the row. */
  message?: string;
  /** The spinner shown on the thumb while the change is in flight. */
  loading?: string;
}

/**
 * Props for the Switch component.
 *
 * @example
 * ```tsx
 * <Switch checked={on} onCheckedChange={setOn} />
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
  /** Fires with the new `checked` state. The `value` prop below is form data and is never reported here. */
  onCheckedChange?: (checked: boolean) => void;
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
