import { forwardRef, useMemo } from "react";
import type { AvatarBadgeProps, BadgeTone, BadgeVariant } from "../utils/types.js";
import { Slot } from "../../../utils/Slot.js";
import { getBadgePosition, getBadgeSizeClasses } from "../utils/helpers.js";
import { cn } from "../../../utils/scopedCn.js";
import { INLINE_SIGN } from "../../../utils/isBrowser.js";

/**
 * Token families, not Tailwind's ramps.
 *
 * `bg-red-500 text-white` is 3.76:1 — under AA for the count, which is text —
 * and `text-red-500` on `bg-white` is the same pair inverted. Raw ramp colours
 * sit outside the token scale, so nothing measuring the scale could see them.
 * The `error` and `accent` families each carry a surface, an on-colour and a
 * soft background, so all three variants follow the theme in both tones.
 *
 * `accent` is the default: a count is how many things are waiting, which is
 * information rather than a fault, and a page of red bubbles spends the one
 * colour that should mean "something is wrong". Red stays one prop away for a
 * badge that does report one.
 */
const toneStyles: Record<BadgeTone, Record<BadgeVariant, { dot: string; count: string }>> = {
  accent: {
    solid: {
      dot: "bg-cl-accent rounded-full",
      count: "font-medium bg-cl-accent text-cl-on-accent rounded-full px-1.5",
    },
    outline: {
      dot: "border-2 border-cl-accent bg-transparent rounded-full",
      count:
        "font-medium border-2 border-cl-accent text-cl-accent bg-cl-bg-panel rounded-full px-1.5",
    },
    soft: {
      dot: "bg-cl-accent-bg rounded-full",
      // Not `text-cl-accent`: 4.31:1 on this tint, under AA at 11px.
      count: "font-medium bg-cl-accent-bg text-cl-accent-hover rounded-full px-1.5",
    },
  },
  error: {
    solid: {
      dot: "bg-cl-error rounded-full",
      count: "font-medium bg-cl-error text-cl-on-error rounded-full px-1.5",
    },
    outline: {
      dot: "border-2 border-cl-error bg-transparent rounded-full",
      count:
        "font-medium border-2 border-cl-error text-cl-error bg-cl-bg-panel rounded-full px-1.5",
    },
    soft: {
      dot: "bg-cl-error-bg rounded-full",
      count: "font-medium bg-cl-error-bg text-cl-error rounded-full px-1.5",
    },
  },
};

export const AvatarBadge = forwardRef<HTMLSpanElement, AvatarBadgeProps>(
  (
    {
      count,
      max = 99,
      showZero = false,
      dot = false,
      position = "top-end",
      offset,
      color,
      size = "md",
      variant = "solid",
      tone = "accent",
      overlap = "circular",
      pulse = false,
      invisible = false,
      "aria-live": ariaLive = "polite",
      asChild = false,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const displayCount = count !== undefined && count > max ? `${max}+` : count;
    const shouldShow =
      !invisible && (dot || showZero || (count !== undefined && count > 0));

    const { minWidth, height, fontSize, lineHeight } = useMemo(
      () => getBadgeSizeClasses(size, dot),
      [size, dot],
    );

    const positionStyle = useMemo(
      () => getBadgePosition(position, overlap, offset),
      [position, overlap, offset],
    );

    const toneVariant = toneStyles[tone][variant];
    const defaultVariantClass = dot ? toneVariant.dot : toneVariant.count;

    const colorStyle = useMemo(() => {
      if (!color) return {};
      if (dot) {
        return variant === "outline"
          ? { borderColor: color }
          : { backgroundColor: color };
      }
      return variant === "outline"
        ? { borderColor: color, color }
        : { backgroundColor: color };
    }, [color, dot, variant]);

    const ariaLabel = useMemo(() => {
      if (dot) return "New notification";
      if (count !== undefined)
        return `${count} notification${count !== 1 ? "s" : ""}`;
      return undefined;
    }, [dot, count]);

    if (!shouldShow) return null;

    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        role="status"
        className={cn(
          "absolute flex items-center justify-center",
          INLINE_SIGN,
          defaultVariantClass,
          pulse && "animate-pulse",
          className,
        )}
        style={{
          minWidth,
          height,
          ...(fontSize ? { fontSize, lineHeight } : {}),
          ...positionStyle,
          ...colorStyle,
          ...style,
        }}
        aria-label={ariaLabel}
        aria-live={ariaLive}
        {...rest}
      >
        {!dot && <span dir="auto">{displayCount}</span>}
        {children}
      </Comp>
    );
  },
);

AvatarBadge.displayName = "AvatarBadge";
