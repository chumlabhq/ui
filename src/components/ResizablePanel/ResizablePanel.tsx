import {
  forwardRef,
  useState,
  useId,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  type KeyboardEvent,
  type CSSProperties,
} from "react";
import type { ResizablePanelProps } from "./utils/types";
import {
  DEFAULT_RESIZABLEPANEL_CLASSES,
  UNSTYLED_RESIZABLEPANEL_CLASSES,
} from "./utils/constants";
import { cn } from "../../utils/cn";
import { useControllableState } from "../../utils/useControllableState";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  (props, ref) => {
    const {
      children,
      value: valueProp,
      defaultValue = 300,
      onValueChange,
      onResizeStart,
      onResizeEnd,
      minValue = 200,
      maxValue = 800,
      resizeDirection = "right",
      step = 10,
      disabled = false,
      unstyled = false,
      "aria-label": ariaLabel = "Resize panel",
      classes: classesProp,
      handleContent,
      className,
      style,
      id: idProp,
      ...rest
    } = props;

    const isVertical =
      resizeDirection === "top" || resizeDirection === "bottom";

    const baseClasses = unstyled ? UNSTYLED_RESIZABLEPANEL_CLASSES : DEFAULT_RESIZABLEPANEL_CLASSES;
    const mergedClasses = useMemo(() => ({
      root: classesProp?.root ?? baseClasses.root,
      handle: classesProp?.handle ?? baseClasses.handle,
    }), [classesProp, baseClasses]);

    const warnedRef = useRef(false);
    useEffect(() => {
      if (process.env.NODE_ENV !== "production") {
        const r = rest as Record<string, unknown>;
        if (!r["aria-label"] && !r["aria-labelledby"] && !warnedRef.current) {
          warnedRef.current = true;
          console.warn("ResizablePanel: requires `aria-label` or `aria-labelledby` for accessibility.");
        }
      }
    }, [rest]);

    const boundsWarnedRef = useRef(false);
    useEffect(() => {
      if (process.env.NODE_ENV !== "production" && !boundsWarnedRef.current) {
        if (minValue > maxValue) {
          boundsWarnedRef.current = true;
          console.warn(
            `ResizablePanel: minValue (${minValue}) is greater than maxValue (${maxValue}). ` +
              `This will produce unexpected clamping behavior.`,
          );
        }
        if (
          valueProp !== undefined &&
          (valueProp < minValue || valueProp > maxValue)
        ) {
          boundsWarnedRef.current = true;
          console.warn(
            `ResizablePanel: controlled value (${valueProp}) is outside the ` +
              `[minValue=${minValue}, maxValue=${maxValue}] range. ` +
              `The rendered size will be clamped.`,
          );
        }
        if (
          valueProp === undefined &&
          (defaultValue < minValue || defaultValue > maxValue)
        ) {
          boundsWarnedRef.current = true;
          console.warn(
            `ResizablePanel: defaultValue (${defaultValue}) is outside the ` +
              `[minValue=${minValue}, maxValue=${maxValue}] range. ` +
              `The initial size will be clamped.`,
          );
        }
      }
    }, [minValue, maxValue, valueProp, defaultValue]);

    const generatedId = useId();
    const panelId = idProp ?? generatedId;

    const clampedDefault = Math.max(minValue, Math.min(maxValue, defaultValue));

    const [rawSize, setSize] = useControllableState<number>({
      value: valueProp,
      defaultValue: clampedDefault,
      onChange: onValueChange,
    });

    const size = Math.max(minValue, Math.min(maxValue, rawSize));

    useEffect(() => {
      if (valueProp === undefined && size !== rawSize) {
        setSize(size);
      }
    }, [valueProp, size, rawSize, setSize]);

    const [isResizing, setIsResizing] = useState(false);
    const isResizingRef = useRef(false);
    const startPosRef = useRef(0);
    const startSizeRef = useRef(0);
    const startDirectionRef = useRef(resizeDirection);
    const sizeRef = useRef(size);
    const minValueRef = useRef(minValue);
    const maxValueRef = useRef(maxValue);
    const onResizeStartRef = useRef(onResizeStart);
    const onResizeEndRef = useRef(onResizeEnd);
    const setSizeRef = useRef(setSize);
    const savedBodyCursorRef = useRef("");
    const savedBodyUserSelectRef = useRef("");
    const captureTargetRef = useRef<Element | null>(null);
    const pointerIdRef = useRef<number | null>(null);

    useIsomorphicLayoutEffect(() => {
      sizeRef.current = size;
      minValueRef.current = minValue;
      maxValueRef.current = maxValue;
      onResizeStartRef.current = onResizeStart;
      onResizeEndRef.current = onResizeEnd;
      setSizeRef.current = setSize;
    });

    const releasePointerCapture = useCallback(() => {
      if (captureTargetRef.current && pointerIdRef.current !== null) {
        try {
          captureTargetRef.current.releasePointerCapture(
            pointerIdRef.current,
          );
        } catch {
          void 0;
        }
      }
      captureTargetRef.current = null;
      pointerIdRef.current = null;
    }, []);

    const restoreBodyStyles = useCallback(() => {
      document.body.style.cursor = savedBodyCursorRef.current;
      document.body.style.userSelect = savedBodyUserSelectRef.current;
    }, []);

    const cancelResize = useCallback(() => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      setIsResizing(false);
      restoreBodyStyles();
      releasePointerCapture();
      setSizeRef.current(startSizeRef.current);
    }, [restoreBodyStyles, releasePointerCapture]);

    const finishResize = useCallback(() => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      setIsResizing(false);
      restoreBodyStyles();
      releasePointerCapture();
      onResizeEndRef.current?.(sizeRef.current);
    }, [restoreBodyStyles, releasePointerCapture]);

    useEffect(() => {
      const clamp = (v: number) =>
        Math.max(minValueRef.current, Math.min(maxValueRef.current, v));

      const handlePointerMove = (e: PointerEvent) => {
        if (!isResizingRef.current) return;
        const dir = startDirectionRef.current;
        const isVert = dir === "top" || dir === "bottom";
        const delta = isVert
          ? e.clientY - startPosRef.current
          : e.clientX - startPosRef.current;
        const newSize =
          dir === "right" || dir === "bottom"
            ? startSizeRef.current + delta
            : startSizeRef.current - delta;
        setSizeRef.current(clamp(newSize));
      };

      const handlePointerUp = () => {
        finishResize();
      };

      const handlePointerCancel = () => {
        cancelResize();
      };

      const handleKeyDown = (e: globalThis.KeyboardEvent) => {
        if (!isResizingRef.current) return;
        if (e.key === "Escape") {
          e.preventDefault();
          cancelResize();
        }
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
      document.addEventListener("pointercancel", handlePointerCancel);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
        document.removeEventListener("pointercancel", handlePointerCancel);
        document.removeEventListener("keydown", handleKeyDown);
        if (isResizingRef.current) {
          isResizingRef.current = false;
          document.body.style.cursor = savedBodyCursorRef.current;
          document.body.style.userSelect = savedBodyUserSelectRef.current;
        }
      };
    }, [finishResize, cancelResize]);

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return;
        if (e.button !== 0) return;
        e.preventDefault();
        isResizingRef.current = true;
        setIsResizing(true);
        startDirectionRef.current = resizeDirection;
        startPosRef.current = isVertical ? e.clientY : e.clientX;
        startSizeRef.current = sizeRef.current;
        savedBodyCursorRef.current = document.body.style.cursor;
        savedBodyUserSelectRef.current = document.body.style.userSelect;
        document.body.style.cursor = isVertical ? "row-resize" : "col-resize";
        document.body.style.userSelect = "none";
        captureTargetRef.current = e.currentTarget;
        pointerIdRef.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        onResizeStartRef.current?.(sizeRef.current);
      },
      [disabled, resizeDirection, isVertical],
    );

    const handleSeparatorKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        const resolvedStep = e.shiftKey ? step * 5 : step;
        const clamp = (v: number) => Math.max(minValue, Math.min(maxValue, v));

        let newSize: number | undefined;

        switch (e.key) {
          case "ArrowRight":
            if (isVertical) return;
            e.preventDefault();
            newSize = clamp(
              sizeRef.current +
                (resizeDirection === "right" ? resolvedStep : -resolvedStep),
            );
            break;
          case "ArrowLeft":
            if (isVertical) return;
            e.preventDefault();
            newSize = clamp(
              sizeRef.current +
                (resizeDirection === "right" ? -resolvedStep : resolvedStep),
            );
            break;
          case "ArrowDown":
            if (!isVertical) return;
            e.preventDefault();
            newSize = clamp(
              sizeRef.current +
                (resizeDirection === "bottom" ? resolvedStep : -resolvedStep),
            );
            break;
          case "ArrowUp":
            if (!isVertical) return;
            e.preventDefault();
            newSize = clamp(
              sizeRef.current +
                (resizeDirection === "bottom" ? -resolvedStep : resolvedStep),
            );
            break;
          case "Home":
            e.preventDefault();
            newSize = minValue;
            break;
          case "End":
            e.preventDefault();
            newSize = maxValue;
            break;
          default:
            return;
        }

        if (newSize !== undefined && newSize !== sizeRef.current) {
          onResizeStartRef.current?.(sizeRef.current);
          setSize(newSize);
          onResizeEndRef.current?.(newSize);
        }
      },
      [disabled, step, resizeDirection, isVertical, minValue, maxValue, setSize],
    );

    const roundedSize = Math.round(size);
    const sizeProperty = isVertical ? "height" : "width";

    return (
      <div
        {...rest}
        ref={ref}
        id={panelId}
        className={cn("relative", mergedClasses.root, className)}
        style={
          {
            ...style,
            [sizeProperty]: `${size}px`,
            "--resizable-panel-size": `${roundedSize}px`,
            "--resizable-panel-min": `${minValue}px`,
            "--resizable-panel-max": `${maxValue}px`,
          } as CSSProperties
        }
        data-resizing={isResizing || undefined}
        data-disabled={disabled || undefined}
      >
        {children}
        <div
          role="separator"
          tabIndex={disabled ? -1 : 0}
          aria-orientation={isVertical ? "horizontal" : "vertical"}
          aria-valuenow={roundedSize}
          aria-valuemin={minValue}
          aria-valuemax={maxValue}
          aria-valuetext={`${roundedSize} pixels`}
          aria-label={ariaLabel}
          aria-disabled={disabled || undefined}
          aria-controls={panelId}
          onPointerDown={handlePointerDown}
          onKeyDown={handleSeparatorKeyDown}
          className={cn(
            "absolute touch-none select-none motion-reduce:transition-none",
            isVertical
              ? cn(
                  "left-0 w-full h-2",
                  resizeDirection === "bottom" ? "-bottom-1" : "-top-1",
                )
              : cn(
                  "top-0 h-full w-2",
                  resizeDirection === "right" ? "-right-1" : "-left-1",
                ),
            disabled
              ? "cursor-default opacity-0"
              : isVertical
                ? "cursor-row-resize"
                : "cursor-col-resize",
            mergedClasses.handle,
          )}
          data-resizing={isResizing || undefined}
          data-disabled={disabled || undefined}
          data-direction={resizeDirection}
        >
          {handleContent}
        </div>
      </div>
    );
  },
);

ResizablePanel.displayName = "ResizablePanel";

export { ResizablePanel };
