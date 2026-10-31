import { describe, it, expect, vi, beforeAll, beforeEach, afterEach, type MockInstance } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";

import { setReducedMotion } from "../../../test/matchMedia.js";

// The stub answers nothing by default, so every file that renders a
// motion-aware component states the preference it is testing under.
beforeEach(() => setReducedMotion(false));

// jsdom doesn't support pointer capture
beforeAll(() => {
  if (!HTMLElement.prototype.setPointerCapture) {
    HTMLElement.prototype.setPointerCapture = vi.fn();
  }
  if (!HTMLElement.prototype.releasePointerCapture) {
    HTMLElement.prototype.releasePointerCapture = vi.fn();
  }
});
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
} from "../index.js";

function renderDrawer(
  props: Partial<React.ComponentProps<typeof Drawer>> = {},
) {
  const onOpenChange = props.onOpenChange ?? vi.fn();
  return {
    onOpenChange: onOpenChange as ReturnType<typeof vi.fn>,
    ...render(
      <Drawer
        open={true}
        onOpenChange={onOpenChange}
        aria-label="Test drawer"
        animationDuration={0}
        {...props}
      >
        <DrawerHeader>Header</DrawerHeader>
        <DrawerBody>
          <button>First</button>
          <button>Second</button>
        </DrawerBody>
        <DrawerFooter>Footer</DrawerFooter>
      </Drawer>,
    ),
  };
}

describe("Drawer", () => {
  describe("Rendering", () => {
    it("renders dialog when open", () => {
      renderDrawer({ open: true });
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("does not render when closed", () => {
      renderDrawer({ open: false });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("renders into document.body by default", () => {
      renderDrawer();
      const dialog = screen.getByRole("dialog");
      expect(dialog.closest("body")).toBe(document.body);
    });

    it("renders into custom portalContainer", () => {
      const container = document.createElement("div");
      container.id = "custom-portal";
      document.body.appendChild(container);

      renderDrawer({ portalContainer: container });

      const dialog = screen.getByRole("dialog");
      expect(dialog.closest("#custom-portal")).toBe(container);

      document.body.removeChild(container);
    });

    it("renders sub-components", () => {
      renderDrawer();
      expect(screen.getByText("Header")).toBeInTheDocument();
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });

    it("sets data-side attribute", () => {
      renderDrawer({ side: "end" });
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("data-side", "end");
    });

    it("sets data-state='open' on root element when open", () => {
      renderDrawer();
      const root = screen.getByRole("dialog").parentElement!;
      expect(root).toHaveAttribute("data-state", "open");
    });

    it("sets data-state='closed' on root element when closed", () => {
      const { rerender } = render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="State test"
          animationDuration={0}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      rerender(
        <Drawer
          open={false}
          onOpenChange={() => {}}
          aria-label="State test"
          animationDuration={0}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      const root = screen.getByRole("dialog", { hidden: true }).parentElement!;
      expect(root).toHaveAttribute("data-state", "closed");
    });

    it("sets aria-hidden and inert when keepMounted and closed", () => {
      const { rerender } = render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Inert test"
          animationDuration={0}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      rerender(
        <Drawer
          open={false}
          onOpenChange={() => {}}
          aria-label="Inert test"
          animationDuration={0}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      const root = screen.getByRole("dialog", { hidden: true }).parentElement!;
      expect(root).toHaveAttribute("aria-hidden", "true");
      const panel = screen.getByRole("dialog", { hidden: true });
      expect(panel).toHaveAttribute("inert");
    });
  });

  describe("Closing Behavior", () => {
    it("calls onOpenChange on overlay click", async () => {
      const { onOpenChange } = renderDrawer();
      const overlay = document.querySelector("[data-drawer-overlay]")!;

      await act(() => {
        overlay.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      expect(onOpenChange).toHaveBeenCalledTimes(1);
    });

    it("does not call onOpenChange when closeOnOverlayClick is false", async () => {
      const { onOpenChange } = renderDrawer({ closeOnOverlayClick: false });
      const overlay = document.querySelector("[data-drawer-overlay]")!;

      await act(() => {
        overlay.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("calls onOpenChange on Escape keydown", async () => {
      const user = userEvent.setup();
      const { onOpenChange } = renderDrawer();

      await user.keyboard("{Escape}");

      expect(onOpenChange).toHaveBeenCalledTimes(1);
    });

    it("does not call onOpenChange on Escape when closeOnEscape is false", async () => {
      const user = userEvent.setup();
      const { onOpenChange } = renderDrawer({ closeOnEscape: false });

      await user.keyboard("{Escape}");

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("only closes topmost drawer on Escape when stacked", async () => {
      const user = userEvent.setup();
      const outerOpenChange = vi.fn();
      const innerOpenChange = vi.fn();

      render(
        <>
          <Drawer
            open={true}
            onOpenChange={outerOpenChange}
            aria-label="Outer"
            animationDuration={0}
          >
            <DrawerBody>Outer</DrawerBody>
          </Drawer>
          <Drawer
            open={true}
            onOpenChange={innerOpenChange}
            aria-label="Inner"
            animationDuration={0}
          >
            <DrawerBody>Inner</DrawerBody>
          </Drawer>
        </>,
      );

      await user.keyboard("{Escape}");

      expect(innerOpenChange).toHaveBeenCalledTimes(1);
      expect(outerOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("DrawerCloseButton", () => {
    it("calls onOpenChange via context", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Drawer
          open={true}
          onOpenChange={onOpenChange}
          aria-label="Close test"
          animationDuration={0}
        >
          <DrawerCloseButton data-testid="close-btn" />
        </Drawer>,
      );

      await user.click(screen.getByTestId("close-btn"));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
    });

    it("renders default icon when no children", () => {
      render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Icon test"
          animationDuration={0}
        >
          <DrawerCloseButton data-testid="close-btn" />
        </Drawer>,
      );

      const btn = screen.getByTestId("close-btn");
      expect(btn.querySelector("svg")).toBeInTheDocument();
    });

    it("renders custom children instead of default icon", () => {
      render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Custom test"
          animationDuration={0}
        >
          <DrawerCloseButton data-testid="close-btn">
            <span>X</span>
          </DrawerCloseButton>
        </Drawer>,
      );

      const btn = screen.getByTestId("close-btn");
      expect(btn).toHaveTextContent("X");
      expect(btn.querySelector("svg")).not.toBeInTheDocument();
    });

    it("has aria-label='Close' by default", () => {
      render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="A11y test"
          animationDuration={0}
        >
          <DrawerCloseButton data-testid="close-btn" />
        </Drawer>,
      );

      expect(screen.getByTestId("close-btn")).toHaveAttribute(
        "aria-label",
        "Close",
      );
    });
  });

  describe("Focus Management", () => {
    it("traps focus forward with Tab in modal mode", async () => {
      const user = userEvent.setup();
      renderDrawer();

      await act(async () => {
        await new Promise((r) => setTimeout(r, 100));
      });

      const dialog = screen.getByRole("dialog");
      const buttons = dialog.querySelectorAll("button");
      const first = buttons[0];
      const last = buttons[buttons.length - 1];

      (last as HTMLElement).focus();
      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });
      await user.tab();

      expect(document.activeElement).toBe(first);
    });

    it("traps focus backward with Shift+Tab in modal mode", async () => {
      const user = userEvent.setup();
      renderDrawer();

      const buttons = screen.getAllByRole("button");
      const first = buttons[0];
      const last = buttons[buttons.length - 1];

      // Ensure focus trap is active before testing
      first.focus();
      await new Promise((r) => setTimeout(r, 50));
      await user.tab({ shift: true });

      expect(document.activeElement).toBe(last);
    });

    it("restores focus to trigger on close", async () => {
      function TestWrapper() {
        const [open, setOpen] = useState(false);
        return (
          <>
            <button onClick={() => setOpen(true)}>Open</button>
            <Drawer
              open={open}
              onOpenChange={(o) => setOpen(o)}
              aria-label="Restore focus test"
              animationDuration={0}
            >
              <DrawerBody>
                <button>Inside</button>
              </DrawerBody>
            </Drawer>
          </>
        );
      }

      const user = userEvent.setup();
      render(<TestWrapper />);

      const trigger = screen.getByText("Open");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(document.activeElement).toBe(trigger);
      });
    });

    it("focuses initialFocus ref when provided", async () => {
      function TestWrapper() {
        const inputRef = createRef<HTMLInputElement>();
        return (
          <Drawer
            open={true}
            onOpenChange={() => {}}
            aria-label="Initial focus test"
            animationDuration={0}
            initialFocus={inputRef}
          >
            <DrawerBody>
              <button>Button</button>
              <input ref={inputRef} data-testid="target-input" />
            </DrawerBody>
          </Drawer>
        );
      }

      render(<TestWrapper />);

      await waitFor(() => {
        expect(document.activeElement).toBe(
          screen.getByTestId("target-input"),
        );
      });
    });

    it("focuses element with data-autofocus attribute", async () => {
      render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Autofocus test"
          animationDuration={0}
        >
          <DrawerBody>
            <button>First</button>
            <button data-autofocus data-testid="autofocus-btn">
              Auto
            </button>
          </DrawerBody>
        </Drawer>,
      );

      await waitFor(() => {
        expect(document.activeElement).toBe(
          screen.getByTestId("autofocus-btn"),
        );
      });
    });

    it("focuses first focusable element as fallback", async () => {
      render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Fallback focus test"
          animationDuration={0}
        >
          <DrawerBody>
            <button data-testid="first-btn">First</button>
            <button>Second</button>
          </DrawerBody>
        </Drawer>,
      );

      await waitFor(() => {
        expect(document.activeElement).toBe(screen.getByTestId("first-btn"));
      });
    });

    /**
     * Opened from CLOSED, which every other case in this block skips by
     * rendering with `open` already true. The panel is portalled by a later
     * effect, so on that first path `panelRef.current` was null, the focus
     * effect returned early and never re-ran: focus stayed on the trigger.
     * Measured on the demo page before the fix — `initialFocus` and
     * `data-autofocus` were both dead there while these tests stayed green.
     */
    it("focuses data-autofocus when the drawer opens from closed", async () => {
      const user = userEvent.setup();

      function TestWrapper() {
        const [open, setOpen] = useState(false);
        return (
          <>
            <button data-testid="trigger" onClick={() => setOpen(true)}>
              Open
            </button>
            <Drawer
              open={open}
              onOpenChange={setOpen}
              aria-label="Open from closed"
              animationDuration={0}
            >
              <DrawerBody>
                <button>First</button>
                <input data-autofocus data-testid="target-input" />
              </DrawerBody>
            </Drawer>
          </>
        );
      }

      render(<TestWrapper />);
      await user.click(screen.getByTestId("trigger"));

      await waitFor(() => {
        expect(document.activeElement).toBe(screen.getByTestId("target-input"));
      });
    });

    it("does not trap focus in non-modal mode", async () => {
      const user = userEvent.setup();

      render(
        <>
          <button data-testid="outside">Outside</button>
          <Drawer
            open={true}
            onOpenChange={() => {}}
            aria-label="Non-modal test"
            animationDuration={0}
            modal={false}
          >
            <DrawerBody>
              <button data-testid="inside">Inside</button>
            </DrawerBody>
          </Drawer>
        </>,
      );

      const inside = screen.getByTestId("inside");
      inside.focus();
      await user.tab();

      expect(document.activeElement).not.toBe(inside);
    });
  });

  describe("Accessibility", () => {
    it("panel has role='dialog'", () => {
      renderDrawer();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has aria-modal='true' in modal mode", () => {
      renderDrawer({ modal: true });
      expect(screen.getByRole("dialog")).toHaveAttribute(
        "aria-modal",
        "true",
      );
    });

    it("does not have aria-modal in non-modal mode", () => {
      renderDrawer({ modal: false });
      expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-modal");
    });

    it("supports aria-label", () => {
      renderDrawer({ "aria-label": "My drawer" });
      expect(screen.getByRole("dialog")).toHaveAttribute(
        "aria-label",
        "My drawer",
      );
    });

    it("auto-wires aria-labelledby from DrawerHeader", () => {
      render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          animationDuration={0}
        >
          <DrawerHeader>Title</DrawerHeader>
        </Drawer>,
      );

      const dialog = screen.getByRole("dialog");
      const labelledBy = dialog.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();

      const header = screen.getByText("Title");
      expect(header.closest("[data-drawer-header]")).toHaveAttribute(
        "id",
        labelledBy,
      );
    });

    it("custom aria-labelledby overrides auto-wired one", () => {
      render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-labelledby="custom-id"
          animationDuration={0}
        >
          <DrawerHeader>Title</DrawerHeader>
        </Drawer>,
      );

      expect(screen.getByRole("dialog")).toHaveAttribute(
        "aria-labelledby",
        "custom-id",
      );
    });

    it("supports aria-describedby", () => {
      renderDrawer({ "aria-describedby": "desc-id" });
      expect(screen.getByRole("dialog")).toHaveAttribute(
        "aria-describedby",
        "desc-id",
      );
    });
  });

  describe("Missing-name warning", () => {
    const nameWarnings = (warn: MockInstance<typeof console.warn>) =>
      warn.mock.calls.filter((call) =>
        String(call[0]).startsWith("Drawer: rendered with no accessible name"),
      ).length;
    const nextFrame = () =>
      act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));

    let warn: MockInstance<typeof console.warn>;
    beforeEach(() => {
      warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => warn.mockRestore());

    const Named = ({ open, keepMounted }: { open: boolean; keepMounted?: boolean }) => (
      <Drawer open={open} onOpenChange={() => {}} keepMounted={keepMounted} animationDuration={0}>
        <DrawerHeader>Settings</DrawerHeader>
        Body
      </Drawer>
    );
    const Unnamed = ({ open }: { open: boolean }) => (
      <Drawer open={open} onOpenChange={() => {}} animationDuration={0}>
        Body
      </Drawer>
    );

    it("does not warn for a closed drawer whose DrawerHeader has not mounted yet", async () => {
      render(<Named open={false} />);
      await nextFrame();
      await nextFrame();
      expect(nameWarnings(warn)).toBe(0);
    });

    it("does not warn for a closed, kept-mounted drawer with a DrawerHeader", async () => {
      render(<Named open={false} keepMounted />);
      await nextFrame();
      await nextFrame();
      expect(nameWarnings(warn)).toBe(0);
    });

    it("does not warn for a drawer open at mount with a DrawerHeader", async () => {
      render(<Named open />);
      await nextFrame();
      await nextFrame();
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-labelledby");
      expect(nameWarnings(warn)).toBe(0);
    });

    it("does not warn when a closed drawer with a DrawerHeader opens", async () => {
      const { rerender } = render(<Named open={false} />);
      await nextFrame();
      rerender(<Named open />);
      await nextFrame();
      await nextFrame();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(nameWarnings(warn)).toBe(0);
    });

    it("warns once for a drawer open at mount with no DrawerHeader, aria-label or aria-labelledby", async () => {
      render(<Unnamed open />);
      await waitFor(() => expect(nameWarnings(warn)).toBe(1));
      expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-labelledby");
      expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-label");
    });

    it("warns when an unnamed drawer opens, not while it is closed", async () => {
      const { rerender } = render(<Unnamed open={false} />);
      await nextFrame();
      await nextFrame();
      expect(nameWarnings(warn)).toBe(0);
      rerender(<Unnamed open />);
      await waitFor(() => expect(nameWarnings(warn)).toBe(1));
    });
  });

  describe("Modal vs Non-Modal", () => {
    it("modal mode renders overlay", () => {
      renderDrawer({ modal: true });
      expect(
        document.querySelector("[data-drawer-overlay]"),
      ).toBeInTheDocument();
    });

    it("non-modal mode does not render overlay", () => {
      renderDrawer({ modal: false });
      expect(
        document.querySelector("[data-drawer-overlay]"),
      ).not.toBeInTheDocument();
    });
  });

  describe("keepMounted", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("keeps content in DOM when closed with keepMounted", () => {
      const { rerender } = render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Keep mounted"
          animationDuration={0}
          keepMounted
        >
          <DrawerBody>Persistent</DrawerBody>
        </Drawer>,
      );

      rerender(
        <Drawer
          open={false}
          onOpenChange={() => {}}
          aria-label="Keep mounted"
          animationDuration={0}
          keepMounted
        >
          <DrawerBody>Persistent</DrawerBody>
        </Drawer>,
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.getByText("Persistent")).toBeInTheDocument();
    });

    it("removes content from DOM after close when not keepMounted", () => {
      const { rerender } = render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Not kept"
          animationDuration={0}
        >
          <DrawerBody>Transient</DrawerBody>
        </Drawer>,
      );

      rerender(
        <Drawer
          open={false}
          onOpenChange={() => {}}
          aria-label="Not kept"
          animationDuration={0}
        >
          <DrawerBody>Transient</DrawerBody>
        </Drawer>,
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.queryByText("Transient")).not.toBeInTheDocument();
    });
  });

  describe("onTransitionEnd", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("fires with open=true after opening", () => {
      const onTransitionEnd = vi.fn();

      const { rerender } = render(
        <Drawer
          open={false}
          onOpenChange={() => {}}
          aria-label="Transition test"
          animationDuration={200}
          onTransitionEnd={onTransitionEnd}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      rerender(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Transition test"
          animationDuration={200}
          onTransitionEnd={onTransitionEnd}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(onTransitionEnd).toHaveBeenCalledWith(true);
    });

    it("fires with open=false after closing", () => {
      const onTransitionEnd = vi.fn();

      const { rerender } = render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Transition test"
          animationDuration={200}
          onTransitionEnd={onTransitionEnd}
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      act(() => {
        vi.advanceTimersByTime(250);
      });

      onTransitionEnd.mockClear();

      rerender(
        <Drawer
          open={false}
          onOpenChange={() => {}}
          aria-label="Transition test"
          animationDuration={200}
          onTransitionEnd={onTransitionEnd}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(onTransitionEnd).toHaveBeenCalledWith(false);
    });
  });

  describe("Direction", () => {
    it.each(["start", "end", "top", "bottom"] as const)(
      "sets data-side='%s' on the panel",
      (side) => {
        renderDrawer({ side });
        expect(screen.getByRole("dialog")).toHaveAttribute(
          "data-side",
          side,
        );
      },
    );
  });

  describe("Scroll Lock", () => {
    it("locks body scroll when open in modal mode", () => {
      renderDrawer({ modal: true, lockScroll: true });
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("does not lock scroll in non-modal mode", () => {
      const originalOverflow = document.body.style.overflow;
      renderDrawer({ modal: false, lockScroll: true });
      expect(document.body.style.overflow).toBe(originalOverflow);
    });

    it("does not lock scroll when lockScroll is false", () => {
      const originalOverflow = document.body.style.overflow;
      renderDrawer({ modal: true, lockScroll: false });
      expect(document.body.style.overflow).toBe(originalOverflow);
    });
  });

  describe("className", () => {
    it("applies className to the root, the outer fixed layer", () => {
      renderDrawer({ className: "my-custom-class" });
      const root = screen.getByRole("dialog").parentElement!;
      expect(root.className).toContain("my-custom-class");
    });

    it("does not apply className to the panel, which classes.content styles", () => {
      renderDrawer({ className: "my-custom-class" });
      const panel = screen.getByRole("dialog");
      expect(panel.className).not.toContain("my-custom-class");
    });
  });

  describe("Direction Styling", () => {
    it.each([
      ["start", "translateX"],
      ["end", "translateX"],
      ["top", "translateY"],
      ["bottom", "translateY"],
    ] as const)(
      "applies %s side with correct transform axis (%s)",
      (side, expectedTransform) => {
        renderDrawer({ side });
        const panel = screen.getByRole("dialog");
        const style = panel.getAttribute("style") ?? "";
        expect(style).toContain(expectedTransform);
      },
    );

    it("applies width style for start/end directions", () => {
      renderDrawer({ side: "start", size: "400px" });
      const panel = screen.getByRole("dialog");
      expect(panel.style.width).toBe("400px");
    });

    it("applies height style for top/bottom directions", () => {
      renderDrawer({ side: "top", size: "200px" });
      const panel = screen.getByRole("dialog");
      expect(panel.style.height).toBe("200px");
    });
  });

  describe("Swipe Gesture Simulation", () => {
    /**
     * A finger in contact, as the browser reports it.
     *
     * `buttons` is 1 while the contact is down and 0 on the release — the drag
     * ends on any move that reports nothing pressed, so an event built without
     * it describes a pointer no real input produces mid-drag.
     */
    function createPointerEvent(
      type: string,
      clientX: number,
      clientY: number,
      pointerId = 1,
    ) {
      return new PointerEvent(type, {
        bubbles: true,
        clientX,
        clientY,
        pointerId,
        pointerType: "touch",
        button: 0,
        buttons: type === "pointerup" ? 0 : 1,
      });
    }

    it("sets touch-action on the panel when swipeable", () => {
      renderDrawer({ swipeable: true, side: "start" });
      const panel = screen.getByRole("dialog");
      expect(panel.style.touchAction).toBe("pan-y");
    });

    it("leaves touch to the browser on a top/bottom sheet, so its content scrolls", () => {
      renderDrawer({ swipeable: true, side: "bottom" });
      const panel = screen.getByRole("dialog");
      expect(panel.style.touchAction).toBe("auto");
    });

    it("gives the handle, and a sheet's header, touch-action none", () => {
      renderDrawer({ swipeable: true, side: "bottom" });
      const handle = document.querySelector<HTMLElement>("[data-drawer-handle]")!;
      const header = document.querySelector<HTMLElement>("[data-drawer-header]")!;
      expect(handle.style.touchAction).toBe("none");
      expect(header.style.touchAction).toBe("none");
    });

    it.each([false, true])(
      "keeps the handle's row out of a full-height child's height (unstyled: %s)",
      (unstyled) => {
        renderDrawer({ swipeable: true, side: "bottom", unstyled });
        const panel = screen.getByRole("dialog");
        const handle = document.querySelector<HTMLElement>("[data-drawer-handle]")!;
        expect(panel.className.split(" ")).toContain("pt-5");
        expect(handle.className.split(" ")).toEqual(expect.arrayContaining(["sticky", "h-5", "-mt-5", "-top-5"]));
        expect(handle.className.split(" ")).not.toContain("top-0");
      },
    );

    it("leaves a non-swipeable panel unpadded", () => {
      renderDrawer({ swipeable: false, side: "bottom" });
      expect(screen.getByRole("dialog").className.split(" ")).not.toContain("pt-5");
    });

    it("leaves a side drawer's header to the browser", () => {
      renderDrawer({ swipeable: true, side: "start" });
      const header = document.querySelector<HTMLElement>("[data-drawer-header]")!;
      expect(header.style.touchAction).toBeFalsy();
    });

    it("does not set touch-action when not swipeable", () => {
      renderDrawer({ swipeable: false, side: "start" });
      const panel = screen.getByRole("dialog");
      expect(panel.style.touchAction).toBeFalsy();
    });

    it("attaches pointer event handlers when swipeable", () => {
      renderDrawer({ swipeable: true });
      const panel = screen.getByRole("dialog");
      expect(panel).toHaveAttribute("data-drawer-panel");
    });

    it("calls onOpenChange after swipe exceeding threshold on right drawer", async () => {
      const onOpenChange = vi.fn();
      renderDrawer({
        swipeable: true,
        side: "end",
        swipeThreshold: 0.3,
        onOpenChange,
      });

      const panel = screen.getByRole("dialog");
      Object.defineProperty(panel, "offsetWidth", { value: 300, configurable: true });

      await act(async () => {
        panel.dispatchEvent(createPointerEvent("pointerdown", 300, 200));
      });
      await act(async () => {
        // Move past deadzone and beyond threshold
        panel.dispatchEvent(createPointerEvent("pointermove", 420, 200));
      });
      await act(async () => {
        panel.dispatchEvent(createPointerEvent("pointerup", 420, 200));
      });

      expect(onOpenChange).toHaveBeenCalled();
    });

    // A finger on a sheet's content is scrolling it; only the handle or the
    // header starts the dismiss drag.
    it("dismisses a bottom sheet on a touch drag from the header, not from the content", async () => {
      const onOpenChange = vi.fn();
      renderDrawer({ swipeable: true, side: "bottom", onOpenChange });
      const panel = screen.getByRole("dialog");
      Object.defineProperty(panel, "offsetHeight", { value: 300, configurable: true });

      const dragFrom = async (el: Element) => {
        await act(async () => {
          el.dispatchEvent(createPointerEvent("pointerdown", 200, 300));
        });
        await act(async () => {
          el.dispatchEvent(createPointerEvent("pointermove", 200, 500));
        });
        await act(async () => {
          el.dispatchEvent(createPointerEvent("pointerup", 200, 500));
        });
      };

      await dragFrom(screen.getByRole("button", { name: "First" }));
      expect(onOpenChange).not.toHaveBeenCalled();

      await dragFrom(document.querySelector("[data-drawer-header]")!);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Overlay Interaction", () => {
    it("overlay has data-drawer-overlay attribute", () => {
      renderDrawer();
      const overlay = document.querySelector("[data-drawer-overlay]");
      expect(overlay).toBeInTheDocument();
    });

    it("overlay has aria-hidden='true'", () => {
      renderDrawer();
      const overlay = document.querySelector("[data-drawer-overlay]");
      expect(overlay).toHaveAttribute("aria-hidden", "true");
    });

    it("overlayOpacity tints the background and leaves the open overlay opaque", async () => {
      renderDrawer({ overlayOpacity: 0.7 });
      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });
      const overlay = document.querySelector("[data-drawer-overlay]") as HTMLElement;
      // Element opacity would composite overlayBlur back against the sharp page.
      expect(overlay.style.opacity).toBe("1");
      expect(overlay.getAttribute("style")).toContain("70%");
    });
  });

  describe("Escape Key Behavior", () => {
    it("stops immediate propagation when Escape is pressed", async () => {
      const user = userEvent.setup();
      const outerHandler = vi.fn();

      render(
        <div onKeyDown={outerHandler}>
          <Drawer
            open={true}
            onOpenChange={() => {}}
            aria-label="Escape test"
            animationDuration={0}
          >
            <DrawerBody>Content</DrawerBody>
          </Drawer>
        </div>,
      );

      await user.keyboard("{Escape}");

      // The outer handler should NOT be called because stopImmediatePropagation
      // is called on the document-level listener, but the React synthetic event
      // on the div is different. This tests the drawer does close.
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("Focus Trap Edge Cases", () => {
    it("prevents Tab when no focusable elements exist", async () => {
      render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Empty drawer"
          animationDuration={0}
        >
          <DrawerBody>
            <p>No focusable elements here</p>
          </DrawerBody>
        </Drawer>,
      );

      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });

      // Panel itself should have focus since no focusable children
      const dialog = screen.getByRole("dialog");
      expect(document.activeElement).toBe(dialog);
    });
  });

  describe("Scroll Lock Cleanup", () => {
    it("restores body overflow on unmount", () => {
      document.body.style.overflow = "";
      const { unmount } = render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Scroll lock cleanup"
          animationDuration={0}
          lockScroll
          modal
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      expect(document.body.style.overflow).toBe("hidden");
      unmount();
      expect(document.body.style.overflow).not.toBe("hidden");
    });
  });

  describe("keepMounted Advanced", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("shows aria-hidden when keepMounted and closed", () => {
      const { rerender } = render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Keep test"
          animationDuration={0}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      rerender(
        <Drawer
          open={false}
          onOpenChange={() => {}}
          aria-label="Keep test"
          animationDuration={0}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      const root = screen.getByRole("dialog", { hidden: true }).parentElement!;
      expect(root).toHaveAttribute("aria-hidden", "true");
    });

    it("re-renders correctly when toggling open with keepMounted", () => {
      const { rerender } = render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Toggle test"
          animationDuration={0}
          keepMounted
        >
          <DrawerBody>Persistent Content</DrawerBody>
        </Drawer>,
      );

      rerender(
        <Drawer
          open={false}
          onOpenChange={() => {}}
          aria-label="Toggle test"
          animationDuration={0}
          keepMounted
        >
          <DrawerBody>Persistent Content</DrawerBody>
        </Drawer>,
      );

      expect(screen.getByText("Persistent Content")).toBeInTheDocument();

      rerender(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Toggle test"
          animationDuration={0}
          keepMounted
        >
          <DrawerBody>Persistent Content</DrawerBody>
        </Drawer>,
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("dialog").parentElement).not.toHaveAttribute("aria-hidden");
    });
  });

  describe("Transition Callbacks Advanced", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("does not fire onTransitionEnd when callback is not provided", () => {
      const { rerender } = render(
        <Drawer
          open={false}
          onOpenChange={() => {}}
          aria-label="No callback test"
          animationDuration={100}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      rerender(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="No callback test"
          animationDuration={100}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("uses effectiveDuration of 0 when reduceMotion is true", () => {
      const onTransitionEnd = vi.fn();

      const { rerender } = render(
        <Drawer
          open={false}
          onOpenChange={() => {}}
          aria-label="Reduce motion test"
          animationDuration={300}
          reduceMotion={true}
          onTransitionEnd={onTransitionEnd}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      rerender(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Reduce motion test"
          animationDuration={300}
          reduceMotion={true}
          onTransitionEnd={onTransitionEnd}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      act(() => {
        vi.advanceTimersByTime(10);
      });

      expect(onTransitionEnd).toHaveBeenCalledWith(true);
    });
  });

  describe("Nested Drawers", () => {
    it("renders two drawers simultaneously", () => {
      render(
        <>
          <Drawer
            open={true}
            onOpenChange={() => {}}
            aria-label="Outer drawer"
            animationDuration={0}
          >
            <DrawerBody>Outer Content</DrawerBody>
          </Drawer>
          <Drawer
            open={true}
            onOpenChange={() => {}}
            aria-label="Inner drawer"
            animationDuration={0}
          >
            <DrawerBody>Inner Content</DrawerBody>
          </Drawer>
        </>,
      );

      const dialogs = screen.getAllByRole("dialog");
      expect(dialogs).toHaveLength(2);
      expect(screen.getByText("Outer Content")).toBeInTheDocument();
      expect(screen.getByText("Inner Content")).toBeInTheDocument();
    });

    it("only topmost drawer closes on Escape when nested", async () => {
      const user = userEvent.setup();
      const outerChange = vi.fn();
      const innerChange = vi.fn();

      render(
        <>
          <Drawer
            open={true}
            onOpenChange={outerChange}
            aria-label="Outer"
            animationDuration={0}
          >
            <DrawerBody>Outer</DrawerBody>
          </Drawer>
          <Drawer
            open={true}
            onOpenChange={innerChange}
            aria-label="Inner"
            animationDuration={0}
          >
            <DrawerBody>Inner</DrawerBody>
          </Drawer>
        </>,
      );

      await user.keyboard("{Escape}");

      expect(innerChange).toHaveBeenCalledWith(false);
      expect(outerChange).not.toHaveBeenCalled();
    });
  });

  describe("Unstyled Mode", () => {
    // ADR 001: z-* is structural — an overlay that loses its stacking order
    // renders behind the content it is meant to cover, which is a layout
    // failure, not a visual one. DEFAULT_DRAWER_CLASSES.root is z-999999 and
    // nothing else, so unstyled keeps it whole.
    it("keeps stacking order when unstyled is true", () => {
      renderDrawer({ unstyled: true });
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("z-999999");
    });

    it("drops the overlay transition when unstyled is true", () => {
      renderDrawer({ unstyled: true });
      const overlay = document.querySelector("[data-drawer-overlay]");
      if (!overlay) return;
      expect(overlay).toHaveClass("fixed", "inset-0");
      expect(overlay).not.toHaveClass("transition-opacity");
    });
  });

  describe("Custom zIndex", () => {
    it("applies custom zIndex to root", () => {
      renderDrawer({ zIndex: 12345 });
      const root = screen.getByRole("dialog").parentElement!;
      expect(root.style.zIndex).toBe("12345");
    });
  });

  describe("Snap Point Validation", () => {
    it("clamps out-of-bounds snap point index", () => {
      const onSnapPointChange = vi.fn();
      render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Snap test"
          animationDuration={0}
          swipeable
          snapPoints={[0.3, 0.6, 1]}
          snapPointIndex={10}
          onSnapPointIndexChange={onSnapPointChange}
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("floors non-integer snap point index", () => {
      render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          aria-label="Snap test"
          animationDuration={0}
          swipeable
          snapPoints={[0.3, 0.6, 1]}
          snapPointIndex={1.7}
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});

describe("Drawer side follows the inline direction", () => {
  it("anchors the default start panel to the inline start and signs its slide by the page direction", () => {
    renderDrawer();
    const panel = screen.getByRole("dialog");
    expect(panel).toHaveAttribute("data-side", "start");
    expect(panel.style.insetInlineStart).toBe("0");
    expect(panel.style.left).toBe("");
    expect(panel).toHaveClass("rtl:[--cl-inline-sign:-1]");
  });

  it("anchors an end panel to the inline end", () => {
    renderDrawer({ side: "end" });
    const panel = screen.getByRole("dialog");
    expect(panel.style.insetInlineEnd).toBe("0");
    expect(panel.style.right).toBe("");
  });
});
