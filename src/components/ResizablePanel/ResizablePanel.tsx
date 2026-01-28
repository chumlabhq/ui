import { useRef, useEffect, useState, useCallback, forwardRef } from "react";
import type { ResizablePanelProps } from "./types";

const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      children,
      initialWidth,
      minWidth = 200,
      maxWidth = 800,
      onWidthChange,
      className = "",
      resizeHandleClassName = "",
      resizeDirection = "right",
    },
    ref
  ) => {
    const [width, setWidth] = useState(initialWidth);
    const [isResizing, setIsResizing] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef<number>(0);
    const startWidthRef = useRef<number>(0);

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        startXRef.current = e.clientX;
        startWidthRef.current = width;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
      },
      [width]
    );

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startXRef.current;
        let newWidth;

        if (resizeDirection === "right") {
          newWidth = startWidthRef.current + deltaX;
        } else {
          newWidth = startWidthRef.current - deltaX;
        }

        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

        setWidth(newWidth);
        onWidthChange?.(newWidth);
      },
      [isResizing, minWidth, maxWidth, onWidthChange, resizeDirection]
    );

    const handleMouseUp = useCallback(() => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }, []);

    useEffect(() => {
      if (isResizing) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    useEffect(() => {
      setWidth(initialWidth);
    }, [initialWidth]);

    return (
      <div
        ref={ref || panelRef}
        className={["relative", className].filter(Boolean).join(" ")}
        style={{ width: `${width}px` }}
        data-resizing={isResizing || undefined}
      >
        {children}
        <div
          className={[
            "absolute top-0 h-full cursor-col-resize",
            resizeHandleClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          onMouseDown={handleMouseDown}
          style={{
            [resizeDirection === "right" ? "right" : "left"]: "-2px",
            width: "4px",
          }}
          role="separator"
          aria-orientation="vertical"
          aria-valuenow={width}
          aria-valuemin={minWidth}
          aria-valuemax={maxWidth}
        />
      </div>
    );
  }
);

ResizablePanel.displayName = "ResizablePanel";

export default ResizablePanel;
