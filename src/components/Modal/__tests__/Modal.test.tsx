import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import Modal, { ModalHeader, ModalBody, ModalFooter } from "../Modal";

// Mock scrollLock utilities
const acquireScrollLockMock = vi.fn();
const releaseScrollLockMock = vi.fn();

vi.mock("../../../utils/scrollLock", () => ({
  acquireScrollLock: (...args: unknown[]) => acquireScrollLockMock(...args),
  releaseScrollLock: (...args: unknown[]) => releaseScrollLockMock(...args),
}));

// Mock isBrowser to always return true in tests
vi.mock("../../../utils/isBrowser", () => ({
  isBrowser: true,
}));

beforeEach(() => {
  acquireScrollLockMock.mockClear();
  releaseScrollLockMock.mockClear();
});

describe("Modal", () => {
  describe("Rendering", () => {
    it("renders when open=true", () => {
      render(
        <Modal open onOpenChange={() => {}}>
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Modal content")).toBeInTheDocument();
    });

    it("does not render when open=false", () => {
      render(
        <Modal open={false} onOpenChange={() => {}}>
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("renders title in the header", () => {
      render(
        <Modal open onOpenChange={() => {}} title="Test Title">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("renders description in the header", () => {
      render(
        <Modal open onOpenChange={() => {}} description="Test Description">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });
  });

  describe("Close Button", () => {
    it("renders close button with aria-label by default", () => {
      render(
        <Modal open onOpenChange={() => {}}>
          <p>Content</p>
        </Modal>
      );

      const closeBtn = screen.getByRole("button", { name: "Close modal" });
      expect(closeBtn).toBeInTheDocument();
      expect(closeBtn).toHaveAttribute("aria-label", "Close modal");
    });

    it("calls onOpenChange(false) when close button is clicked", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Modal open onOpenChange={onOpenChange}>
          <p>Content</p>
        </Modal>
      );

      await user.click(screen.getByRole("button", { name: "Close modal" }));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("does not render close button when showCloseButton=false", () => {
      render(
        <Modal open onOpenChange={() => {}} showCloseButton={false}>
          <p>Content</p>
        </Modal>
      );

      expect(
        screen.queryByRole("button", { name: "Close modal" })
      ).not.toBeInTheDocument();
    });
  });

  describe("Escape Key", () => {
    it("calls onOpenChange(false) when Escape is pressed", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Modal open onOpenChange={onOpenChange}>
          <p>Content</p>
        </Modal>
      );

      await user.keyboard("{Escape}");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("does not close on Escape when closeOnEscape=false", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Modal open onOpenChange={onOpenChange} closeOnEscape={false}>
          <p>Content</p>
        </Modal>
      );

      await user.keyboard("{Escape}");
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("Focus Trap", () => {
    it("cycles focus forward from the last to the first focusable element", async () => {
      render(
        <Modal open onOpenChange={() => {}} disableAnimation>
          <button>First</button>
          <button>Second</button>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Focus the last focusable element (Second button)
      const secondBtn = screen.getByText("Second");
      secondBtn.focus();
      expect(document.activeElement).toBe(secondBtn);

      // Dispatch a Tab keydown event (the modal listens via document capture)
      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(tabEvent);

      // After Tab from the last element, focus should wrap to the first focusable (close button)
      const closeBtn = screen.getByRole("button", { name: "Close modal" });
      expect(document.activeElement).toBe(closeBtn);
    });

    it("cycles focus backward from the first to the last focusable element", async () => {
      render(
        <Modal open onOpenChange={() => {}} disableAnimation>
          <button>First</button>
          <button>Second</button>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Focus the close button (first focusable element in the modal)
      const closeBtn = screen.getByRole("button", { name: "Close modal" });
      closeBtn.focus();
      expect(document.activeElement).toBe(closeBtn);

      // Dispatch a Shift+Tab keydown event
      const shiftTabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(shiftTabEvent);

      const secondBtn = screen.getByText("Second");
      expect(document.activeElement).toBe(secondBtn);
    });
  });

  describe("Focus Restoration", () => {
    it("restores focus to the previously focused element on close", async () => {
      const onOpenChange = vi.fn();

      const { rerender } = render(
        <div>
          <button data-testid="trigger">Open</button>
          <Modal open={false} onOpenChange={onOpenChange} disableAnimation>
            <p>Content</p>
          </Modal>
        </div>
      );

      // Focus the trigger button
      const trigger = screen.getByTestId("trigger");
      trigger.focus();
      expect(document.activeElement).toBe(trigger);

      // Open the modal
      rerender(
        <div>
          <button data-testid="trigger">Open</button>
          <Modal open onOpenChange={onOpenChange} disableAnimation>
            <p>Content</p>
          </Modal>
        </div>
      );

      // Wait for focus to move into modal
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Close the modal
      rerender(
        <div>
          <button data-testid="trigger">Open</button>
          <Modal open={false} onOpenChange={onOpenChange} disableAnimation>
            <p>Content</p>
          </Modal>
        </div>
      );

      // Focus should be restored to the trigger
      await waitFor(() => {
        expect(document.activeElement).toBe(trigger);
      });
    });

    it("does not restore focus when restoreFocus=false", async () => {
      const onOpenChange = vi.fn();
      const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");

      const { rerender } = render(
        <div>
          <button data-testid="trigger">Open</button>
          <Modal
            open={false}
            onOpenChange={onOpenChange}
            restoreFocus={false}
            disableAnimation
          >
            <p>Content</p>
          </Modal>
        </div>
      );

      const trigger = screen.getByTestId("trigger");
      trigger.focus();

      // Open the modal
      rerender(
        <div>
          <button data-testid="trigger">Open</button>
          <Modal
            open
            onOpenChange={onOpenChange}
            restoreFocus={false}
            disableAnimation
          >
            <p>Content</p>
          </Modal>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Clear spy call history so we only track calls during close
      focusSpy.mockClear();

      // Close the modal
      rerender(
        <div>
          <button data-testid="trigger">Open</button>
          <Modal
            open={false}
            onOpenChange={onOpenChange}
            restoreFocus={false}
            disableAnimation
          >
            <p>Content</p>
          </Modal>
        </div>
      );

      // Focus should NOT have been called on the trigger during close
      const triggerFocusCalls = focusSpy.mock.contexts.filter(
        (ctx) => ctx === trigger
      );
      expect(triggerFocusCalls).toHaveLength(0);

      focusSpy.mockRestore();
    });
  });

  describe("Overlay Click", () => {
    it("calls onOpenChange(false) when overlay is clicked", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Modal open onOpenChange={onOpenChange}>
          <p>Content</p>
        </Modal>
      );

      // Click the container (acts as the overlay click target)
      const container = document.querySelector("[data-modal-container]")!;
      await user.click(container);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("does not close on overlay click when preventOutsideClick=true", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Modal open onOpenChange={onOpenChange} preventOutsideClick>
          <p>Content</p>
        </Modal>
      );

      const container = document.querySelector("[data-modal-container]")!;
      await user.click(container);
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("does not close when clicking inside modal content", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Modal open onOpenChange={onOpenChange}>
          <p>Content</p>
        </Modal>
      );

      await user.click(screen.getByText("Content"));
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("ARIA Attributes", () => {
    it("sets aria-modal='true' on the dialog", () => {
      render(
        <Modal open onOpenChange={() => {}}>
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    });

    it("sets aria-labelledby linked to the title element", () => {
      render(
        <Modal open onOpenChange={() => {}} title="My Title">
          <p>Content</p>
        </Modal>
      );

      const dialog = screen.getByRole("dialog");
      const labelledBy = dialog.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();

      const titleEl = document.getElementById(labelledBy!);
      expect(titleEl).toBeInTheDocument();
      expect(titleEl).toHaveTextContent("My Title");
    });

    it("sets aria-describedby linked to the description element", () => {
      render(
        <Modal open onOpenChange={() => {}} description="My Description">
          <p>Content</p>
        </Modal>
      );

      const dialog = screen.getByRole("dialog");
      const describedBy = dialog.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();

      const descEl = document.getElementById(describedBy!);
      expect(descEl).toBeInTheDocument();
      expect(descEl).toHaveTextContent("My Description");
    });

    it("uses custom aria-label when provided", () => {
      render(
        <Modal open onOpenChange={() => {}} aria-label="Custom Label">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByRole("dialog")).toHaveAttribute(
        "aria-label",
        "Custom Label"
      );
    });

    it("uses custom aria-labelledby over auto-generated when no title", () => {
      render(
        <Modal open onOpenChange={() => {}} aria-labelledby="external-label">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByRole("dialog")).toHaveAttribute(
        "aria-labelledby",
        "external-label"
      );
    });

    it("uses custom aria-describedby over auto-generated when no description", () => {
      render(
        <Modal open onOpenChange={() => {}} aria-describedby="external-desc">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByRole("dialog")).toHaveAttribute(
        "aria-describedby",
        "external-desc"
      );
    });
  });

  describe("keepMounted", () => {
    it("keeps the modal in the DOM when closed with keepMounted=true", () => {
      render(
        <Modal open={false} onOpenChange={() => {}} keepMounted>
          <p>Content</p>
        </Modal>
      );

      // The dialog should still be in the DOM
      expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
    });

    it("hides the modal visually when closed with keepMounted=true", () => {
      render(
        <Modal open={false} onOpenChange={() => {}} keepMounted>
          <p>Content</p>
        </Modal>
      );

      const root = document.querySelector("[data-modal-root]")!;
      expect(root).toHaveStyle({ visibility: "hidden", pointerEvents: "none" });
    });

    it("removes the modal from the DOM when closed without keepMounted", () => {
      render(
        <Modal open={false} onOpenChange={() => {}}>
          <p>Content</p>
        </Modal>
      );

      expect(
        screen.queryByRole("dialog", { hidden: true })
      ).not.toBeInTheDocument();
    });
  });

  describe("Nested Modals", () => {
    it("does not render modal that exceeds maxNestingLevel", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(
        <Modal open onOpenChange={() => {}} nestingLevel={3} maxNestingLevel={3}>
          <p>Should not render</p>
        </Modal>
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Maximum nesting level")
      );

      warnSpy.mockRestore();
    });

    it("renders modal below maxNestingLevel", () => {
      render(
        <Modal open onOpenChange={() => {}} nestingLevel={2} maxNestingLevel={5}>
          <p>Nested content</p>
        </Modal>
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Nested content")).toBeInTheDocument();
    });

    it("sets correct data-nesting-level attribute", () => {
      render(
        <Modal open onOpenChange={() => {}} nestingLevel={2}>
          <p>Content</p>
        </Modal>
      );

      const root = document.querySelector("[data-modal-root]")!;
      expect(root).toHaveAttribute("data-nesting-level", "2");
    });
  });

  describe("Scroll Lock", () => {
    it("acquires scroll lock when modal opens", () => {
      render(
        <Modal open onOpenChange={() => {}}>
          <p>Content</p>
        </Modal>
      );

      expect(acquireScrollLockMock).toHaveBeenCalled();
    });

    it("releases scroll lock when modal closes", () => {
      const { rerender } = render(
        <Modal open onOpenChange={() => {}} disableAnimation>
          <p>Content</p>
        </Modal>
      );

      rerender(
        <Modal open={false} onOpenChange={() => {}} disableAnimation>
          <p>Content</p>
        </Modal>
      );

      expect(releaseScrollLockMock).toHaveBeenCalled();
    });

    it("does not acquire scroll lock when lockScroll=false", () => {
      render(
        <Modal open onOpenChange={() => {}} lockScroll={false}>
          <p>Content</p>
        </Modal>
      );

      expect(acquireScrollLockMock).not.toHaveBeenCalled();
    });
  });

  describe("Custom Classes", () => {
    it("applies custom className to the content panel", () => {
      render(
        <Modal open onOpenChange={() => {}} className="custom-modal">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByRole("dialog")).toHaveClass("custom-modal");
    });

    it("applies custom classes via the classes prop", () => {
      render(
        <Modal
          open
          onOpenChange={() => {}}
          classes={{
            root: "custom-root",
            overlay: "custom-overlay",
            content: "custom-content",
            body: "custom-body",
          }}
        >
          <p>Content</p>
        </Modal>
      );

      const root = document.querySelector("[data-modal-root]")!;
      expect(root).toHaveClass("custom-root");

      const overlay = document.querySelector("[data-modal-overlay]")!;
      expect(overlay).toHaveClass("custom-overlay");

      const content = document.querySelector("[data-modal-content]")!;
      expect(content).toHaveClass("custom-content");

      const body = document.querySelector("[data-modal-body]")!;
      expect(body).toHaveClass("custom-body");
    });
  });

  describe("Unstyled Mode", () => {
    it("does not apply default styling classes when unstyled=true", () => {
      render(
        <Modal open onOpenChange={() => {}} unstyled>
          <p>Content</p>
        </Modal>
      );

      const dialog = screen.getByRole("dialog");
      // Unstyled mode should not include the default layout classes
      expect(dialog.className).not.toContain("bg-white");
    });

    it("does not apply fixed positioning classes to root when unstyled=true", () => {
      render(
        <Modal open onOpenChange={() => {}} unstyled>
          <p>Content</p>
        </Modal>
      );

      const root = document.querySelector("[data-modal-root]")!;
      expect(root.className).not.toContain("fixed inset-0");
    });
  });

  describe("forwardRef", () => {
    it("forwards ref to the dialog content element", () => {
      const ref = createRef<HTMLDivElement>();

      render(
        <Modal open onOpenChange={() => {}} ref={ref}>
          <p>Content</p>
        </Modal>
      );

      expect(ref.current).toBe(screen.getByRole("dialog"));
    });
  });

  describe("Compound Components", () => {
    it("renders ModalHeader with data-modal-header attribute", () => {
      const { container } = render(
        <ModalHeader>Header Content</ModalHeader>
      );

      const header = container.querySelector("[data-modal-header]")!;
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent("Header Content");
    });

    it("renders ModalBody with data-modal-body attribute", () => {
      const { container } = render(<ModalBody>Body Content</ModalBody>);

      const body = container.querySelector("[data-modal-body]")!;
      expect(body).toBeInTheDocument();
      expect(body).toHaveTextContent("Body Content");
    });

    it("renders ModalFooter with data-modal-footer attribute", () => {
      const { container } = render(
        <ModalFooter>Footer Content</ModalFooter>
      );

      const footer = container.querySelector("[data-modal-footer]")!;
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent("Footer Content");
    });

    it("forwards ref on ModalHeader", () => {
      const ref = createRef<HTMLDivElement>();
      render(<ModalHeader ref={ref}>Header</ModalHeader>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("forwards ref on ModalBody", () => {
      const ref = createRef<HTMLDivElement>();
      render(<ModalBody ref={ref}>Body</ModalBody>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("forwards ref on ModalFooter", () => {
      const ref = createRef<HTMLDivElement>();
      render(<ModalFooter ref={ref}>Footer</ModalFooter>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

// ─── useModal hook ────────────────────────────────────────────────────────────

import { renderHook } from "@testing-library/react";
import { useModal } from "../useModal";

describe("useModal", () => {
  it("throws when used outside Modal", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useModal())).toThrow(
      "useModal must be used within a Modal",
    );
    spy.mockRestore();
  });

  it("returns context when used inside Modal", () => {
    let ctx: ReturnType<typeof useModal> | undefined;
    function Inner() {
      // eslint-disable-next-line react-hooks/globals
      ctx = useModal();
      return null;
    }
    render(
      <Modal open onOpenChange={() => {}}>
        <Inner />
      </Modal>,
    );
    expect(ctx).toBeDefined();
    expect(ctx!.close).toBeDefined();
  });
});

// ─── Modal icons ──────────────────────────────────────────────────────────────

import { CloseIcon, InfoIcon } from "../icons";

describe("Modal Icons", () => {
  it("renders CloseIcon with className", () => {
    const { container } = render(<CloseIcon className="test-class" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("test-class");
  });

  it("renders InfoIcon with className", () => {
    const { container } = render(<InfoIcon className="test-class" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("test-class");
  });

  it("renders CloseIcon with default empty className", () => {
    const { container } = render(<CloseIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders InfoIcon with default empty className", () => {
    const { container } = render(<InfoIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
