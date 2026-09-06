import { forwardRef, useMemo } from "react";
import type { AvatarBadgeProps } from "../utils/types.js";
import { Slot } from "../../../utils/Slot.js";
import { getBadgePosition, getBadgeSizeClasses } from "../utils/helpers.js";
import { cn } from "../../../utils/scopedCn.js";

/**
 * The error token family, not Tailwind's red ramp.
 *
 * `bg-red-500 text-white` is 3.76:1 — under AA for the count, which is text —
 * and `text-red-500` on `bg-white` is the same pair inverted. Neither gate
 * could see it: `contrast.contract` reads the token scale and these were not
 * in it, and the painted sweep only measures what a fixture renders, which
 * nothing did. `--cl-error-bg` and `--cl-on-error` were minted for this, so all
 * three variants follow the theme and each pair is gated.
 */
const variantStyles = {
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
};

export const AvatarBadge = forwardRef<HTMLSpanElement, AvatarBadgeProps>(
  (
    {
      count,
      max = 99,
      showZero = false,
      dot = false,
      position = "top-right",
      offset,
      color,
      size = "md",
      variant = "solid",
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

    const defaultVariantClass = dot ? variantStyles[variant].dot : variantStyles[variant].count;

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
        {dot ? null : displayCount}
        {children}
      </Comp>
    );
  },
);

AvatarBadge.displayName = "AvatarBadge";
