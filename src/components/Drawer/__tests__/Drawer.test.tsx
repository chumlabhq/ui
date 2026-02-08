import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
} from "../index";

function renderDrawer(
  props: Partial<React.ComponentProps<typeof Drawer>> = {},
) {
  const onClose = props.onClose ?? vi.fn();
  return {
    onClose: onClose as ReturnType<typeof vi.fn>,
    ...render(
      <Drawer
        open={true}
        onClose={onClose}
        aria-label="Test drawer"
        duration={0}
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

    it("sets data-direction attribute", () => {
      renderDrawer({ direction: "right" });
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("data-direction", "right");
    });

    it("sets data-open on root element", () => {
      renderDrawer();
      const root = screen.getByRole("dialog").parentElement!;
      expect(root).toHaveAttribute("data-open");
    });
  });

  describe("Closing Behavior", () => {
    it("calls onClose on overlay pointerdown", async () => {
      const { onClose } = renderDrawer();
      const overlay = document.querySelector("[data-drawer-overlay]")!;

      await act(() => {
        overlay.dispatchEvent(
          new PointerEvent("pointerdown", { bubbles: true }),
        );
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when closeOnOverlayClick is false", async () => {
      const { onClose } = renderDrawer({ closeOnOverlayClick: false });
      const overlay = document.querySelector("[data-drawer-overlay]")!;

      await act(() => {
        overlay.dispatchEvent(
          new PointerEvent("pointerdown", { bubbles: true }),
        );
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it("calls onClose on Escape keydown", async () => {
      const user = userEvent.setup();
      const { onClose } = renderDrawer();

      await user.keyboard("{Escape}");

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose on Escape when closeOnEscape is false", async () => {
      const user = userEvent.setup();
      const { onClose } = renderDrawer({ closeOnEscape: false });

      await user.keyboard("{Escape}");

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("DrawerCloseButton", () => {
    it("calls onClose via context", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Drawer
          open={true}
          onClose={onClose}
          aria-label="Close test"
          duration={0}
        >
          <DrawerCloseButton data-testid="close-btn" />
        </Drawer>,
      );

      await user.click(screen.getByTestId("close-btn"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("renders default icon when no children", () => {
      render(
        <Drawer
          open={true}
          onClose={() => {}}
          aria-label="Icon test"
          duration={0}
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
          onClose={() => {}}
          aria-label="Custom test"
          duration={0}
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
          onClose={() => {}}
          aria-label="A11y test"
          duration={0}
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

      const buttons = screen.getAllByRole("button");
      const first = buttons[0];
      const last = buttons[buttons.length - 1];

      last.focus();
      await user.tab();

      expect(document.activeElement).toBe(first);
    });

    it("traps focus backward with Shift+Tab in modal mode", async () => {
      const user = userEvent.setup();
      renderDrawer();

      const buttons = screen.getAllByRole("button");
      const first = buttons[0];
      const last = buttons[buttons.length - 1];

      first.focus();
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
              onClose={() => setOpen(false)}
              aria-label="Restore focus test"
              duration={0}
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
            onClose={() => {}}
            aria-label="Initial focus test"
            duration={0}
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
          onClose={() => {}}
          aria-label="Autofocus test"
          duration={0}
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
          onClose={() => {}}
          aria-label="Fallback focus test"
          duration={0}
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

    it("does not trap focus in non-modal mode", async () => {
      const user = userEvent.setup();

      render(
        <>
          <button data-testid="outside">Outside</button>
          <Drawer
            open={true}
            onClose={() => {}}
            aria-label="Non-modal test"
            duration={0}
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
          onClose={() => {}}
          duration={0}
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
          onClose={() => {}}
          aria-labelledby="custom-id"
          duration={0}
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
          onClose={() => {}}
          aria-label="Keep mounted"
          duration={0}
          keepMounted
        >
          <DrawerBody>Persistent</DrawerBody>
        </Drawer>,
      );

      rerender(
        <Drawer
          open={false}
          onClose={() => {}}
          aria-label="Keep mounted"
          duration={0}
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
          onClose={() => {}}
          aria-label="Not kept"
          duration={0}
        >
          <DrawerBody>Transient</DrawerBody>
        </Drawer>,
      );

      rerender(
        <Drawer
          open={false}
          onClose={() => {}}
          aria-label="Not kept"
          duration={0}
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
          onClose={() => {}}
          aria-label="Transition test"
          duration={200}
          onTransitionEnd={onTransitionEnd}
          keepMounted
        >
          <DrawerBody>Content</DrawerBody>
        </Drawer>,
      );

      rerender(
        <Drawer
          open={true}
          onClose={() => {}}
          aria-label="Transition test"
          duration={200}
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
          onClose={() => {}}
          aria-label="Transition test"
          duration={200}
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
          onClose={() => {}}
          aria-label="Transition test"
          duration={200}
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
    it.each(["left", "right", "top", "bottom"] as const)(
      "sets data-direction='%s' on the panel",
      (direction) => {
        renderDrawer({ direction });
        expect(screen.getByRole("dialog")).toHaveAttribute(
          "data-direction",
          direction,
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
});
