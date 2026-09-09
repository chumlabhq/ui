import { forwardRef, useMemo } from "react";
import type { AvatarGroupCountProps, AvatarTooltipConfig } from "../utils/types.js";
import { Tooltip } from "../../Tooltip/index.js";
import { Slot } from "../../../utils/Slot.js";
import { DEFAULT_SIZE, DEFAULT_SHAPE } from "../utils/constants.js";
import {
  getNumericSize,
  getFontSize,
  getBorderRadius,
  parseBorder,
} from "../utils/helpers.js";
import { cn } from "../../../utils/scopedCn.js";
import { isTooltipConfig } from "../../../utils/isTooltipConfig.js";
import { useAvatarGroupContext } from "../utils/context.js";

/** The ring `Avatar` and the surplus both draw, in px. */
const RING_WIDTH = 2;

/**
 * The most a surplus shows inside a group before it stops counting: `+99`.
 *
 * Three digits do not belong in an avatar-sized circle — Ant caps explicitly
 * for the same reason, and past about a hundred the exact number has stopped
 * being information anyway. The `+` prefix already reads as "this many more",
 * so the capped form is `+99` and not `+99+`, which says it twice. A caller
 * that wants a different ceiling still passes `max`.
 */
const GROUP_MAX_COUNT = 99;

/**
 * Advance width of one glyph as a fraction of font size, for the digits and the
 * `+` this renders. Deliberately generous: it decides the font that makes the
 * widest count fit, and guessing narrow puts a glyph under the neighbour.
 */
const GLYPH_WIDTH_RATIO = 0.62;

/** Widest string the group form can show — `+99`. */
const WIDEST_GROUP_GLYPHS = 3;

/** Smallest the count may shrink to before legibility loses to fitting. */
const MIN_GROUP_FONT_SIZE = 7;

const variantClassNames = {
  solid:
    "font-medium bg-cl-bg-item-hover text-cl-text-secondary select-none",
  outline:
    "font-medium border-2 border-cl-border text-cl-text-secondary bg-transparent select-none",
  ghost: "font-medium text-cl-text-secondary select-none",
};

/**
 * The solid fill inside a group, which is not the one that works standalone.
 *
 * `bg-cl-bg-item-hover` is a 10% overlay meant to sit on a surface and be felt
 * rather than seen. On the page behind a stack it composites to 1.20 against
 * the background where a real avatar reads 1.77, so the disc barely painted
 * and the stack looked like it stopped at the last avatar — reported, twice,
 * as a gap between the last avatar and the surplus. It is not a gap: the
 * overlap is the same 8px every other member gets.
 *
 * A filled disc rather than an outlined one, because that is what the stack
 * implementations render and it cannot be misread: an outline over a
 * page-coloured interior still leaves a hole in the row. `--cl-border-strong`
 * is the neutral at the strength this needs — 1.39 against the page in dark and
 * 1.48 in light, either side of the 1.77/1.23 an avatar scores — and the scale
 * has no opaque mid-neutral surface to use instead. If one is ever minted, this
 * is its first caller.
 */
const GROUP_SOLID_CLASSES = "bg-cl-border-strong";

export const AvatarGroupCount = forwardRef<
  HTMLDivElement,
  AvatarGroupCountProps
>(
  (
    {
      count,
      size = DEFAULT_SIZE,
      shape = DEFAULT_SHAPE,
      max,
      showPlus = true,
      format,
      variant = "solid",
      tooltip,
      bordered,
      textClassName = "",
      textStyle,
      "aria-live": ariaLive,
      asChild = false,
      className,
      style,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    // Inside a group the surplus is the last avatar in the stack, not a caption
    // after it: the ring comes from the same context the avatars read, so it
    // punches the same clean edge where the one before it overlaps.
    const groupCtx = useAvatarGroupContext();
    const numericSize = getNumericSize(size);
    const fontSize = getFontSize(size);
    const borderRadius = getBorderRadius(shape);

    // How much of the circle the member before it covers: the stack overlaps by
    // `spacing` and that member paints its ring on top. Capped at half the box
    // so a large overlap cannot leave no room at all.
    const overlapCover = groupCtx
      ? Math.min(Math.max(0, -groupCtx.spacing) + RING_WIDTH, Math.floor(numericSize / 2))
      : 0;

    // The box is the avatar's size and stays that size, so the type is what
    // gives: sized to fit the widest count the cap allows, inside the part of
    // the circle the neighbour does not cover. Sized for `+99` rather than for
    // this instance's own string, so every surplus at a given avatar size
    // renders at the same size instead of `+2` and `+47` disagreeing.
    const groupFontSize = groupCtx
      ? Math.max(
          // A floor of 8 overrode the fit at `xs`, where 24px less the overlap
          // leaves 14px and `+99` needs 15. The type has to be allowed to get
          // small enough, because the box is not allowed to get bigger.
          MIN_GROUP_FONT_SIZE,
          Math.min(
            Math.round(fontSize * 0.8),
            Math.floor(
              (numericSize - overlapCover) /
                (WIDEST_GROUP_GLYPHS * GLYPH_WIDTH_RATIO),
            ),
          ),
        )
      : fontSize;

    const displayCount = useMemo(() => {
      if (format) return format(count);
      // Standalone keeps the `99+` it always showed; only the group form, which
      // has to live inside a circle, takes the default ceiling.
      if (groupCtx && max === undefined) {
        const value = Math.min(count, GROUP_MAX_COUNT);
        return showPlus ? `+${value}` : String(value);
      }
      const displayValue = max !== undefined && count > max ? `${max}+` : count;
      return showPlus ? `+${displayValue}` : String(displayValue);
    }, [count, max, format, showPlus, groupCtx]);

    const tooltipConfig = useMemo(() => {
      if (!tooltip) return null;
      if (isTooltipConfig<AvatarTooltipConfig>(tooltip)) return tooltip;
      return { content: tooltip };
    }, [tooltip]);

    const Comp = asChild ? Slot : "div";

    const ariaLabel = `${count} more member${count !== 1 ? "s" : ""} not shown`;

    const countElement = (
      <Comp
        ref={ref}
        role={onClick ? "button" : "status"}
        className={cn(
          "shrink-0 inline-flex items-center justify-center",
          variantClassNames[variant],
          // Only the default variant: `outline` and `ghost` are deliberate
          // treatments a caller asked for and are left as they are.
          groupCtx && variant === "solid" && GROUP_SOLID_CLASSES,
          onClick && "cursor-pointer hover:opacity-80 transition-opacity",
          className,
        )}
        style={{
          height: numericSize,
          borderRadius,
          fontSize: groupFontSize,
          ...(groupCtx
            ? {
                // A member of the stack, so it is exactly the size of the
                // avatars beside it and does not grow: `minWidth` let a wide
                // count push the whole row along. The count shrinks to fit
                // instead, which is what every stack implementation does.
                //
                // The start padding is the member before it: text centred in
                // the full box begins under the overlap — `+47` sat 1.8px
                // behind the neighbour's ring — so the padding centres it in
                // the part that is actually visible. `border-box` keeps that
                // inside the width rather than adding to it.
                width: numericSize,
                minWidth: numericSize,
                maxWidth: numericSize,
                boxSizing: "border-box",
                paddingInlineStart: overlapCover,
                paddingInlineEnd: 0,
                boxShadow: `0 0 0 2px ${groupCtx.ringColor}`,
              }
            : {
                minWidth: numericSize,
                paddingInline: Math.round(numericSize * 0.25),
              }),
          border: parseBorder(bordered),
          ...style,
        }}
        aria-label={ariaLabel}
        aria-live={ariaLive}
        onClick={onClick}
        {...rest}
      >
        <span className={textClassName} style={textStyle}>
          {displayCount}
        </span>
        {children}
      </Comp>
    );

    if (tooltipConfig) {
      return (
        <Tooltip
          content={tooltipConfig.content}
          side={tooltipConfig.side ?? "top"}
          align={tooltipConfig.align ?? "center"}
          sideOffset={tooltipConfig.sideOffset ?? 6}
          delayDuration={tooltipConfig.delayDuration ?? 200}
          classes={tooltipConfig.className ? { content: tooltipConfig.className } : undefined}
          showArrow={tooltipConfig.showArrow ?? true}
        >
          {countElement}
        </Tooltip>
      );
    }

    return countElement;
  },
);

AvatarGroupCount.displayName = "AvatarGroupCount";
