import {
  createElement,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";

/**
 * Marketing-site Button.
 *
 * The single canonical button shape used across every marketing surface
 * (Home, Blog, FAQ, sections, modals). NOT to be confused with the published
 * library Button at src/components/Button/Button.tsx — that's a polymorphic
 * primitive shipped to consumers.
 *
 * The component owns padding, height, font size, weight, border radius,
 * background, text, border, hover, focus ring, and disabled state. Consumers
 * pass `className` only for layout-level utilities (margins, alignment,
 * flex children) — visual styles are NOT overridable.
 *
 * Mobile width rule (baked in):
 *   primary + secondary  →  w-full on mobile, auto on tablet+ (≥640px)
 *   ghost + icon         →  always auto
 *   Pass fullWidthMobile={false} to opt a primary/secondary out (rare;
 *   include a code comment explaining why).
 */

type Variant = "primary" | "secondary" | "ghost" | "icon";
type Size = "sm" | "md" | "lg";

interface ButtonOwnProps {
  variant: Variant;
  size?: Size;
  /** Render as a button (default) or as an anchor for navigation. */
  as?: "button" | "a";
  /** Defaults to true for primary/secondary; ignored for ghost/icon. */
  fullWidthMobile?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

type ButtonAsButtonProps = ButtonOwnProps & {
  as?: "button";
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

type ButtonAsAnchorProps = ButtonOwnProps & {
  as: "a";
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps>;

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

// ─── canonical style tokens ──────────────────────────────────────────────
// All radii converge on rounded-md (6px) for primary/secondary/icon buttons.
// Ghost has no radius (text-only with focus ring on a tight rounded shape).

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 font-medium select-none cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-base)] disabled:opacity-50 disabled:cursor-not-allowed";

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] rounded-md",
  md: "h-10 px-4 text-[14px] rounded-md",
  lg: "h-11 px-5 text-[14px] rounded-md",
};

// Icon variant uses square sizing instead of horizontal padding.
const ICON_SIZE_CLASSES: Record<Size, string> = {
  sm: "w-8 h-8 rounded-md",
  md: "w-10 h-10 rounded-md",
  lg: "w-11 h-11 rounded-md",
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[color:var(--text-primary)] text-[color:var(--bg-base)] hover:bg-white",
  secondary:
    "bg-[color:var(--bg-elevated)] text-[color:var(--text-primary)] border-[0.5px] border-[color:var(--border-faint)] hover:border-[color:var(--border-active)]",
  ghost:
    "bg-transparent text-[color:var(--accent)] hover:text-[color:var(--text-primary)] rounded-md",
  icon: "bg-transparent text-[color:var(--text-secondary)] border-[0.5px] border-[color:var(--border-soft)] hover:border-[color:var(--border-active)] hover:bg-[color:var(--text-primary)]/[0.03] hover:text-[color:var(--text-primary)]",
};

// Mobile width rule: primary/secondary stack full-width on mobile by default;
// ghost shrinks to content; icon's width is owned by ICON_SIZE_CLASSES (square).
function widthClass(variant: Variant, fullWidthMobile: boolean): string {
  // Icon variant has w-8 / w-10 / w-11 baked into its size class — leave
  // it alone so we don't accidentally collapse the box to content width.
  if (variant === "icon") return "";
  if (variant === "ghost") return "w-auto";
  return fullWidthMobile ? "w-full sm:w-auto" : "w-auto";
}

// Tiny inline spinner so loading states don't pull in the library Loader.
function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
      aria-hidden
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export default function Button(props: ButtonProps) {
  const {
    variant,
    size = "md",
    as: asProp = "button",
    fullWidthMobile = true,
    startIcon,
    endIcon,
    loading = false,
    className,
    children,
    ...rest
  } = props;

  const Tag = asProp === "a" ? "a" : "button";

  const sizeClass =
    variant === "icon" ? ICON_SIZE_CLASSES[size] : SIZE_CLASSES[size];

  const computedClassName = cn(
    BASE_CLASSES,
    sizeClass,
    VARIANT_CLASSES[variant],
    widthClass(variant, fullWidthMobile),
    className,
  );

  // Keep the `disabled` semantic on real buttons; for anchors we mark
  // aria-disabled and prevent the click.
  const tagProps: Record<string, unknown> = {
    ...rest,
    className: computedClassName,
  };

  if (Tag === "button") {
    const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    if (loading || buttonRest.disabled) {
      tagProps.disabled = true;
    }
    if (!buttonRest.type) {
      tagProps.type = "button";
    }
  } else if (loading) {
    tagProps["aria-disabled"] = true;
    tagProps.onClick = (e: React.MouseEvent) => e.preventDefault();
  }

  const showStart = loading ? <Spinner /> : startIcon ?? null;
  const showEnd = !loading ? endIcon ?? null : null;

  return createElement(
    Tag,
    tagProps,
    showStart,
    children,
    showEnd,
  );
}
