import type { LabelHTMLAttributes, MouseEvent, TextareaHTMLAttributes, ReactNode } from "react";

export interface TextAreaLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** The label's content. */
  label: ReactNode;
  /** Marks the field required and draws the required indicator. */
  required?: boolean;
  /** The id of the control this labels. Set automatically when the label is rendered by the field. */
  htmlFor?: string;
  /** Additional classes for the root element. */
  className?: string;
}

export type TextAreaSize = "sm" | "md" | "lg";

export interface TextAreaClasses {
  /** Outermost container (same element as className) */
  root?: string;
  /** The box around the textarea, which is where the border and focus ring live. */
  control?: string;
  /** Label element */
  label?: string;
  /** Helper/description text */
  description?: string;
  /** The `<textarea>` itself. */
  input?: string;
  /** The error or hint line under the field. */
  message?: string;
  /** Character count display */
  count?: string;
}

/**
 * Props for the TextArea component.
 *
 * @example
 * ```tsx
 * <TextArea value={text} onValueChange={setText} error errorMessage="Required" />
 * ```
 */
export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  description?: ReactNode;
  /** Error state boolean. Pass message via `errorMessage`. Do not pass a string here. */
  error?: boolean;
  /** Error message displayed below the textarea. */
  errorMessage?: ReactNode;
  /** Green success state for validated fields. */
  success?: boolean;
  successMessage?: ReactNode;
  /**
   * Size variant: the control's padding and type size together, at 28, 40 and 52px
   * for the field itself and 30, 42 and 54 with its border. Unset paints `md`, which
   * is the field as it has always been. Also emits `data-size` on the root — a hook
   * for CSS, which is all this prop used to be.
   */
  size?: TextAreaSize;
  /** Icon rendered before the textarea. Becomes a button when `onStartIconClick` is provided. */
  startIcon?: ReactNode;
  /** Icon rendered after the textarea. Becomes a button when `onEndIconClick` is provided. */
  endIcon?: ReactNode;
  /** Makes `startIcon` a clickable button, called with the native click event. Requires `startIconAriaLabel` for accessibility. */
  onStartIconClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Makes `endIcon` a clickable button, called with the native click event. Requires `endIconAriaLabel` for accessibility. */
  onEndIconClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Accessible label for `startIcon` when it is clickable. Required with `onStartIconClick`. */
  startIconAriaLabel?: string;
  /** Accessible label for `endIcon` when it is clickable. Required with `onEndIconClick`. */
  endIconAriaLabel?: string;
  /**
   * Fired with the current string value when the value changes (including clear).
   * Prefer this when you only need the value; use `onChange` when you need the DOM event.
   */
  onValueChange?: (value: string) => void;
  /** Show a built-in clear button when the textarea has a value. */
  clearable?: boolean;
  /**
   * Callback when the clear button is clicked.
   * If not provided, `onChange` is fired with a synthetic event whose `target` is the real
   * HTMLTextAreaElement (so `e.target.name`, `e.target.value` etc. work correctly).
   */
  onClear?: () => void;
  /** Show character count. Not `showCharCount`. Requires `maxLength`. */
  showCount?: boolean;
  /** Automatically resize height to fit content. When `true`, the textarea grows/shrinks as the user types. */
  autoResize?: boolean;
  loading?: boolean;
  loader?: ReactNode;
  /**
   * Size of the default CircularLoader in pixels.
   * Only applies to the built-in loader — ignored when a custom `loader` prop is provided.
   */
  loaderSize?: number;
  fullWidth?: boolean;
  /** CSS class for the root container element (wraps label, textarea row, error/success). */
  className?: string;
  /** Slot-based class overrides for internal elements. */
  classes?: TextAreaClasses;
  /** When true, all default classes are removed; only `classes` overrides apply. */
  unstyled?: boolean;
}
