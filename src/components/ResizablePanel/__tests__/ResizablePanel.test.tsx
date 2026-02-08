import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResizablePanel } from "../index";

beforeEach(() => {
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
});

function renderPanel(
  props: Partial<React.ComponentPropsWithoutRef<typeof ResizablePanel>> & { [key: `data-${string}`]: string | undefined } = {},
) {
  return render(
    <ResizablePanel
      defaultValue={300}
      minValue={100}
      maxValue={500}
      {...props}
    >
      <div>Panel Content</div>
    </ResizablePanel>,
  );
}

describe("ResizablePanel", () => {
  describe("Rendering", () => {
    it("renders children", () => {
      renderPanel();
      expect(screen.getByText("Panel Content")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      const { container } = renderPanel({ className: "custom-class" });
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("renders with custom id", () => {
      renderPanel({ id: "my-panel" });
      expect(document.getElementById("my-panel")).toBeInTheDocument();
    });

    it("passes rest props to root element", () => {
      renderPanel({ "data-testid": "my-panel" });
      expect(screen.getByTestId("my-panel")).toBeInTheDocument();
    });

    it("renders handleContent inside separator", () => {
      renderPanel({
        handleContent: <span data-testid="grip-icon">⋮</span>,
      });
      const separator = screen.getByRole("separator");
      expect(separator).toContainElement(screen.getByTestId("grip-icon"));
    });

    it("applies classes.root and classes.handle", () => {
      renderPanel({
        classes: { root: "root-class", handle: "handle-class" },
      });
      const separator = screen.getByRole("separator");
      expect(separator).toHaveClass("handle-class");
    });

    it("sets width via defaultValue for horizontal direction", () => {
      const { container } = renderPanel({ defaultValue: 250 });
      expect(container.firstChild).toHaveStyle({ width: "250px" });
    });

    it("sets height via defaultValue for vertical direction", () => {
      const { container } = renderPanel({
        defaultValue: 250,
        resizeDirection: "bottom",
      });
      expect(container.firstChild).toHaveStyle({ height: "250px" });
    });

    it("applies CSS custom properties", () => {
      const { container } = renderPanel({
        defaultValue: 300,
        minValue: 100,
        maxValue: 500,
      });
      const root = container.firstChild as HTMLElement;
      expect(root.style.getPropertyValue("--resizable-panel-size")).toBe(
        "300px",
      );
      expect(root.style.getPropertyValue("--resizable-panel-min")).toBe(
        "100px",
      );
      expect(root.style.getPropertyValue("--resizable-panel-max")).toBe(
        "500px",
      );
    });

    it("managed size cannot be overridden via style prop", () => {
      const { container } = renderPanel({
        defaultValue: 300,
        style: { width: "100%" },
      });
      expect(container.firstChild).toHaveStyle({ width: "300px" });
    });
  });

  describe("Accessibility", () => {
    it("separator has role='separator'", () => {
      renderPanel();
      expect(screen.getByRole("separator")).toBeInTheDocument();
    });

    it("separator has aria-orientation='vertical' for horizontal resize", () => {
      renderPanel({ resizeDirection: "right" });
      expect(screen.getByRole("separator")).toHaveAttribute(
        "aria-orientation",
        "vertical",
      );
    });

    it("separator has aria-orientation='horizontal' for vertical resize", () => {
      renderPanel({ resizeDirection: "bottom" });
      expect(screen.getByRole("separator")).toHaveAttribute(
        "aria-orientation",
        "horizontal",
      );
    });

    it("separator has aria-valuenow, aria-valuemin, aria-valuemax", () => {
      renderPanel({ defaultValue: 300, minValue: 100, maxValue: 500 });
      const sep = screen.getByRole("separator");
      expect(sep).toHaveAttribute("aria-valuenow", "300");
      expect(sep).toHaveAttribute("aria-valuemin", "100");
      expect(sep).toHaveAttribute("aria-valuemax", "500");
    });

    it("separator has aria-valuetext", () => {
      renderPanel({ defaultValue: 300 });
      expect(screen.getByRole("separator")).toHaveAttribute(
        "aria-valuetext",
        "300 pixels",
      );
    });

    it("separator has default aria-label", () => {
      renderPanel();
      expect(screen.getByRole("separator")).toHaveAttribute(
        "aria-label",
        "Resize panel",
      );
    });

    it("separator has custom aria-label", () => {
      renderPanel({ "aria-label": "Resize sidebar" });
      expect(screen.getByRole("separator")).toHaveAttribute(
        "aria-label",
        "Resize sidebar",
      );
    });

    it("separator has aria-controls pointing to panel id", () => {
      renderPanel({ id: "my-panel" });
      expect(screen.getByRole("separator")).toHaveAttribute(
        "aria-controls",
        "my-panel",
      );
    });

    it("disabled separator has aria-disabled and tabIndex=-1", () => {
      renderPanel({ disabled: true });
      const sep = screen.getByRole("separator");
      expect(sep).toHaveAttribute("aria-disabled", "true");
      expect(sep).toHaveAttribute("tabindex", "-1");
    });

    it("enabled separator has tabIndex=0", () => {
      renderPanel({ disabled: false });
      expect(screen.getByRole("separator")).toHaveAttribute("tabindex", "0");
    });
  });

  describe("Keyboard Navigation", () => {
    it("ArrowRight increases width for resizeDirection='right'", async () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 300,
        step: 10,
        onValueChange,
        resizeDirection: "right",
      });
      const sep = screen.getByRole("separator");
      sep.focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(onValueChange).toHaveBeenCalledWith(310);
    });

    it("ArrowLeft decreases width for resizeDirection='right'", async () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 300,
        step: 10,
        onValueChange,
        resizeDirection: "right",
      });
      const sep = screen.getByRole("separator");
      sep.focus();
      await userEvent.keyboard("{ArrowLeft}");
      expect(onValueChange).toHaveBeenCalledWith(290);
    });

    it("ArrowDown increases height for resizeDirection='bottom'", async () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 300,
        step: 10,
        onValueChange,
        resizeDirection: "bottom",
      });
      const sep = screen.getByRole("separator");
      sep.focus();
      await userEvent.keyboard("{ArrowDown}");
      expect(onValueChange).toHaveBeenCalledWith(310);
    });

    it("ArrowUp decreases height for resizeDirection='bottom'", async () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 300,
        step: 10,
        onValueChange,
        resizeDirection: "bottom",
      });
      const sep = screen.getByRole("separator");
      sep.focus();
      await userEvent.keyboard("{ArrowUp}");
      expect(onValueChange).toHaveBeenCalledWith(290);
    });

    it("ignores ArrowUp/ArrowDown for horizontal resize", async () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 300,
        step: 10,
        onValueChange,
        resizeDirection: "right",
      });
      const sep = screen.getByRole("separator");
      sep.focus();
      await userEvent.keyboard("{ArrowUp}");
      await userEvent.keyboard("{ArrowDown}");
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("ignores ArrowLeft/ArrowRight for vertical resize", async () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 300,
        step: 10,
        onValueChange,
        resizeDirection: "bottom",
      });
      const sep = screen.getByRole("separator");
      sep.focus();
      await userEvent.keyboard("{ArrowLeft}");
      await userEvent.keyboard("{ArrowRight}");
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("Home sets to minValue", async () => {
      const onValueChange = vi.fn();
      renderPanel({ defaultValue: 300, minValue: 100, onValueChange });
      const sep = screen.getByRole("separator");
      sep.focus();
      await userEvent.keyboard("{Home}");
      expect(onValueChange).toHaveBeenCalledWith(100);
    });

    it("End sets to maxValue", async () => {
      const onValueChange = vi.fn();
      renderPanel({ defaultValue: 300, maxValue: 500, onValueChange });
      const sep = screen.getByRole("separator");
      sep.focus();
      await userEvent.keyboard("{End}");
      expect(onValueChange).toHaveBeenCalledWith(500);
    });

    it("Shift+Arrow multiplies step by 5", async () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 300,
        step: 10,
        onValueChange,
        resizeDirection: "right",
      });
      const sep = screen.getByRole("separator");
      sep.focus();
      await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");
      expect(onValueChange).toHaveBeenCalledWith(350);
    });

    it("keyboard fires onResizeStart and onResizeEnd", async () => {
      const onResizeStart = vi.fn();
      const onResizeEnd = vi.fn();
      renderPanel({
        defaultValue: 300,
        step: 10,
        onResizeStart,
        onResizeEnd,
        resizeDirection: "right",
      });
      const sep = screen.getByRole("separator");
      sep.focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(onResizeStart).toHaveBeenCalledWith(300);
      expect(onResizeEnd).toHaveBeenCalledWith(310);
    });

    it("does not fire events when disabled", async () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 300,
        disabled: true,
        onValueChange,
        resizeDirection: "right",
      });
      const sep = screen.getByRole("separator");
      sep.focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("clamps to minValue/maxValue on arrow keys", async () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 495,
        step: 10,
        minValue: 100,
        maxValue: 500,
        onValueChange,
        resizeDirection: "right",
      });
      const sep = screen.getByRole("separator");
      sep.focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(onValueChange).toHaveBeenCalledWith(500);
    });
  });

  describe("Pointer Interaction", () => {
    it("starts drag on primary button pointerdown", () => {
      const onResizeStart = vi.fn();
      renderPanel({ defaultValue: 300, onResizeStart, resizeDirection: "right" });
      const sep = screen.getByRole("separator");
      fireEvent.pointerDown(sep, { clientX: 100, button: 0, pointerId: 1 });
      expect(onResizeStart).toHaveBeenCalledWith(300);
    });

    it("does not start drag on non-primary button", () => {
      const onResizeStart = vi.fn();
      renderPanel({ onResizeStart });
      const sep = screen.getByRole("separator");
      fireEvent.pointerDown(sep, { clientX: 100, button: 2, pointerId: 1 });
      expect(onResizeStart).not.toHaveBeenCalled();
    });

    it("calls setPointerCapture on drag start", () => {
      renderPanel();
      const sep = screen.getByRole("separator");
      fireEvent.pointerDown(sep, { clientX: 100, button: 0, pointerId: 42 });
      expect(Element.prototype.setPointerCapture).toHaveBeenCalledWith(42);
    });

    it("saves and restores body styles", () => {
      document.body.style.cursor = "wait";
      document.body.style.userSelect = "text";
      renderPanel();
      const sep = screen.getByRole("separator");
      fireEvent.pointerDown(sep, { clientX: 100, button: 0, pointerId: 1 });
      expect(document.body.style.cursor).toBe("col-resize");
      expect(document.body.style.userSelect).toBe("none");
      fireEvent.pointerUp(document);
      expect(document.body.style.cursor).toBe("wait");
      expect(document.body.style.userSelect).toBe("text");
    });

    it("uses row-resize cursor for vertical resize", () => {
      renderPanel({ resizeDirection: "bottom" });
      const sep = screen.getByRole("separator");
      fireEvent.pointerDown(sep, { clientY: 100, button: 0, pointerId: 1 });
      expect(document.body.style.cursor).toBe("row-resize");
    });

    it("resizes on pointermove", () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 300,
        onValueChange,
        resizeDirection: "right",
      });
      const sep = screen.getByRole("separator");
      fireEvent.pointerDown(sep, { clientX: 100, button: 0, pointerId: 1 });
      fireEvent.pointerMove(document, { clientX: 150 });
      expect(onValueChange).toHaveBeenCalledWith(350);
    });

    it("clamps during drag", () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 300,
        maxValue: 500,
        onValueChange,
        resizeDirection: "right",
      });
      const sep = screen.getByRole("separator");
      fireEvent.pointerDown(sep, { clientX: 100, button: 0, pointerId: 1 });
      fireEvent.pointerMove(document, { clientX: 500 });
      expect(onValueChange).toHaveBeenCalledWith(500);
    });

    it("calls onResizeEnd on pointerup", () => {
      const onResizeEnd = vi.fn();
      renderPanel({ defaultValue: 300, onResizeEnd });
      const sep = screen.getByRole("separator");
      fireEvent.pointerDown(sep, { clientX: 100, button: 0, pointerId: 1 });
      fireEvent.pointerUp(document);
      expect(onResizeEnd).toHaveBeenCalledWith(300);
    });

    it("cancels drag on Escape and restores original size", () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 300,
        onValueChange,
        resizeDirection: "right",
      });
      const sep = screen.getByRole("separator");
      fireEvent.pointerDown(sep, { clientX: 100, button: 0, pointerId: 1 });
      fireEvent.pointerMove(document, { clientX: 200 });
      expect(onValueChange).toHaveBeenCalledWith(400);
      fireEvent.keyDown(document, { key: "Escape" });
      expect(onValueChange).toHaveBeenLastCalledWith(300);
    });

    it("does not start drag when disabled", () => {
      const onResizeStart = vi.fn();
      renderPanel({ disabled: true, onResizeStart });
      const sep = screen.getByRole("separator");
      fireEvent.pointerDown(sep, { clientX: 100, button: 0, pointerId: 1 });
      expect(onResizeStart).not.toHaveBeenCalled();
    });

    it("handles vertical drag with resizeDirection='bottom'", () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 300,
        onValueChange,
        resizeDirection: "bottom",
      });
      const sep = screen.getByRole("separator");
      fireEvent.pointerDown(sep, { clientY: 100, button: 0, pointerId: 1 });
      fireEvent.pointerMove(document, { clientY: 150 });
      expect(onValueChange).toHaveBeenCalledWith(350);
    });

    it("handles vertical drag with resizeDirection='top'", () => {
      const onValueChange = vi.fn();
      renderPanel({
        defaultValue: 300,
        onValueChange,
        resizeDirection: "top",
      });
      const sep = screen.getByRole("separator");
      fireEvent.pointerDown(sep, { clientY: 100, button: 0, pointerId: 1 });
      fireEvent.pointerMove(document, { clientY: 50 });
      expect(onValueChange).toHaveBeenCalledWith(350);
    });

    it("restores body styles on pointercancel", () => {
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
      renderPanel();
      const sep = screen.getByRole("separator");
      fireEvent.pointerDown(sep, { clientX: 100, button: 0, pointerId: 1 });
      fireEvent.pointerCancel(document);
      expect(document.body.style.cursor).toBe("default");
      expect(document.body.style.userSelect).toBe("auto");
    });
  });

  describe("Controlled / Uncontrolled", () => {
    it("uses value for controlled mode", () => {
      const { container } = render(
        <ResizablePanel
          value={400}
          onValueChange={vi.fn()}
          minValue={100}
          maxValue={500}
        >
          <div>Content</div>
        </ResizablePanel>,
      );
      expect(container.firstChild).toHaveStyle({ width: "400px" });
    });

    it("clamps controlled value at render", () => {
      const { container } = render(
        <ResizablePanel
          value={600}
          onValueChange={vi.fn()}
          minValue={100}
          maxValue={500}
        >
          <div>Content</div>
        </ResizablePanel>,
      );
      expect(container.firstChild).toHaveStyle({ width: "500px" });
    });
  });

  describe("Data Attributes", () => {
    it("sets data-disabled when disabled", () => {
      const { container } = renderPanel({ disabled: true });
      expect(container.firstChild).toHaveAttribute("data-disabled", "true");
    });

    it("does not set data-disabled when enabled", () => {
      const { container } = renderPanel({ disabled: false });
      expect(container.firstChild).not.toHaveAttribute("data-disabled");
    });

    it("sets data-direction on handle", () => {
      renderPanel({ resizeDirection: "left" });
      expect(screen.getByRole("separator")).toHaveAttribute(
        "data-direction",
        "left",
      );
    });

    it("sets data-direction for vertical directions", () => {
      renderPanel({ resizeDirection: "bottom" });
      expect(screen.getByRole("separator")).toHaveAttribute(
        "data-direction",
        "bottom",
      );
    });

    it("sets data-resizing during drag", () => {
      const { container } = renderPanel();
      const sep = screen.getByRole("separator");
      expect(container.firstChild).not.toHaveAttribute("data-resizing");
      fireEvent.pointerDown(sep, { clientX: 100, button: 0, pointerId: 1 });
      expect(container.firstChild).toHaveAttribute("data-resizing", "true");
      fireEvent.pointerUp(document);
      expect(container.firstChild).not.toHaveAttribute("data-resizing");
    });
  });
});
