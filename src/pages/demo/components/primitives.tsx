/**
 * Shared docs primitives. Every component-demo page uses these instead of
 * free-form className strings — that's how the docs stay visually
 * consistent across all 30 components and through both light/dark modes.
 *
 * Tokens come from the `--cl-*` namespace defined in `src/index.css`.
 * Nothing in this file uses raw hex.
 */

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useState,
} from "react";
import { cn } from "../../../utils/cn";

// ─── <Btn /> ────────────────────────────────────────────────────────────────
//
// One source of truth for every button rendered inside a demo. Variants
// match the Phase 3 spec exactly. Primary / secondary / ghost / destructive
// share padding, radius (--cl-radius-md = 8 px), and font; only colors
// differ. Icon-only is its own square treatment.

type BtnVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "iconOnly";

type BtnSize = "sm" | "md" | "lg";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
}

const sizeClasses: Record<BtnSize, string> = {
  sm: "h-8 px-3.5 text-[13px] gap-1.5",
  md: "h-9 px-4 text-[13px] gap-2",
  lg: "h-10 px-5 text-[14px] gap-2",
};
const iconSizeClasses: Record<BtnSize, string> = {
  sm: "w-8 h-8",
  md: "w-9 h-9",
  lg: "w-10 h-10",
};

const baseBtn =
  "inline-flex items-center justify-center font-medium rounded-cl-md " +
  "transition-colors duration-150 active:scale-[0.98] active:transition-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-border-input-focus focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg " +
  "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none " +
  "cursor-pointer";

const variantClasses: Record<BtnVariant, string> = {
  primary:
    "bg-cl-accent text-cl-on-accent hover:bg-cl-accent-hover",
  secondary:
    "bg-transparent text-cl-text border border-cl-border-strong hover:bg-cl-bg-hover hover:border-cl-border-input-hover",
  ghost:
    "bg-transparent text-cl-text-secondary hover:bg-cl-bg-hover hover:text-cl-text",
  destructive:
    "bg-cl-error text-white hover:brightness-90",
  iconOnly:
    "bg-transparent text-cl-text-secondary border border-cl-border hover:bg-cl-bg-hover hover:text-cl-text rounded-cl-sm",
};

export const Btn = forwardRef<HTMLButtonElement, BtnProps>(function Btn(
  { variant = "primary", size = "md", className, ...rest },
  ref,
) {
  const isIcon = variant === "iconOnly";
  return (
    <button
      ref={ref}
      type={rest.type ?? "button"}
      className={cn(
        baseBtn,
        isIcon ? iconSizeClasses[size] : sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...rest}
    />
  );
});

// ─── <Field /> family ───────────────────────────────────────────────────────
//
// Standardised input/textarea/select. Each renders the spec's surface:
// bg-cl-bg-input, 1 px solid bg-cl-border-input, focus ring via
// box-shadow so the border-width never shifts.

const fieldBase =
  "w-full bg-cl-bg-input text-cl-text placeholder:text-cl-text-tertiary " +
  "border border-cl-border-input rounded-cl-md " +
  "outline-none transition-colors duration-150 " +
  "hover:border-cl-border-input-hover " +
  "focus:border-cl-border-input-focus focus:shadow-[0_0_0_3px_var(--cl-accent-bg)] " +
  "disabled:bg-cl-bg-elevated disabled:text-cl-text-disabled disabled:border-cl-border disabled:cursor-not-allowed";

const fieldSize = {
  sm: "px-3 py-2 text-[13px]",
  md: "px-3.5 py-2.5 text-[14px]",
} as const;

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  fieldSize?: keyof typeof fieldSize;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ fieldSize: s = "md", className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(fieldBase, fieldSize[s], className)}
        {...rest}
      />
    );
  },
);

interface TextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  fieldSize?: keyof typeof fieldSize;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField({ fieldSize: s = "md", className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(fieldBase, fieldSize[s], "resize-y", className)}
        {...rest}
      />
    );
  },
);

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  fieldSize?: keyof typeof fieldSize;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField({ fieldSize: s = "md", className, ...rest }, ref) {
    return (
      <select
        ref={ref}
        className={cn(fieldBase, fieldSize[s], className)}
        {...rest}
      />
    );
  },
);

// ─── <Callout /> ────────────────────────────────────────────────────────────

interface CalloutProps {
  variant?: "info" | "success" | "warning";
  /** Optional inline label. Defaults to the variant's name (Tip/Success/Warning). */
  label?: string;
  children: ReactNode;
  className?: string;
}

const calloutSurface: Record<NonNullable<CalloutProps["variant"]>, string> = {
  info: "border-cl-accent/25 bg-cl-accent-bg",
  success: "border-cl-success/25 bg-cl-success/[0.08]",
  warning: "border-cl-warning/25 bg-cl-warning/[0.08]",
};
const calloutLabel: Record<NonNullable<CalloutProps["variant"]>, string> = {
  info: "text-cl-accent",
  success: "text-cl-success",
  warning: "text-cl-warning",
};
const calloutDefaultLabel: Record<NonNullable<CalloutProps["variant"]>, string> = {
  info: "Tip",
  success: "Success",
  warning: "Warning",
};

export const Callout: React.FC<CalloutProps> = ({
  variant = "info",
  label,
  children,
  className,
}) => (
  <div
    className={cn(
      "rounded-cl-md border px-4 py-3",
      calloutSurface[variant],
      className,
    )}
  >
    <span className={cn("font-medium", calloutLabel[variant])}>
      {label ?? calloutDefaultLabel[variant]}:
    </span>{" "}
    <span className="text-cl-text">{children}</span>
  </div>
);

// ─── <Chip /> ───────────────────────────────────────────────────────────────
//
// Filter / option chip. Selected inverts colors (text bg becomes the chip
// bg) so the affordance reads without burning the accent token.

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

const chipBase =
  "inline-flex items-center justify-center px-3 py-1.5 rounded-cl-sm " +
  "font-mono text-[11px] transition-colors duration-150 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-border-input-focus focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg " +
  "cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { selected, className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? "button"}
      data-selected={selected || undefined}
      className={cn(
        chipBase,
        selected
          ? "border border-cl-border-strong bg-cl-text text-cl-bg font-medium"
          : "border border-cl-border bg-cl-bg-elevated text-cl-text-secondary hover:text-cl-text hover:border-cl-border-strong",
        className,
      )}
      {...rest}
    />
  );
});

// ─── <CodeFenced /> ─────────────────────────────────────────────────────────
//
// Code block with eyebrow header + copy button. Replaces the legacy
// `<CodeBlock>` from Section.tsx (which is kept as a thin compatibility
// alias so existing imports don't break).

interface CodeFencedProps {
  /** Source code body. */
  code: string;
  /** Optional filename / language label rendered in the eyebrow. */
  filename?: string;
  className?: string;
}

const CopyIcon = ({ check }: { check?: boolean }) =>
  check ? (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ) : (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );

export const CodeFenced: React.FC<CodeFencedProps> = ({
  code,
  filename = "Code",
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — silently ignore */
    }
  };
  return (
    <div
      className={cn(
        "rounded-cl-lg border border-cl-border bg-cl-code-bg overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-cl-border">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-cl-text-tertiary">
          {filename}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex items-center justify-center w-7 h-7 rounded-cl-sm text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover transition-colors"
        >
          <CopyIcon check={copied} />
        </button>
      </div>
      <pre className="px-4 py-3 font-mono text-[12px] leading-[1.65] text-cl-code-text overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// ─── <InlineCode /> ─────────────────────────────────────────────────────────

export const InlineCode: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <code
    className={cn(
      "px-1.5 py-0.5 rounded-cl-sm bg-cl-bg-elevated border border-cl-border font-mono text-[0.9em] text-cl-accent",
      className,
    )}
  >
    {children}
  </code>
);
