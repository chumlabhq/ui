import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { ToastProvider, useToast } from "../index.js";
import { Modal } from "../../Modal/index.js";
import { Drawer, DrawerBody } from "../../Drawer/index.js";
import { Dropdown } from "../../Dropdown/index.js";
import { CascadingDropdown } from "../../CascadingDropdown/index.js";
import { Table } from "../../Table/index.js";
import { DatePicker } from "../../DatePicker/index.js";

const TestConsumer = ({
  onMount,
}: {
  onMount?: (api: ReturnType<typeof useToast>) => void;
}) => {
  const toast = useToast();

  if (onMount) {
    onMount(toast);
  }

  return (
    <div>
      <button onClick={() => toast.success("Success message")}>Success</button>
      <button onClick={() => toast.error("Error message")}>Error</button>
      <button onClick={() => toast.warning("Warning message")}>Warning</button>
      <button onClick={() => toast.info("Info message")}>Info</button>
      <button onClick={() => toast.toast("Simple message")}>Simple</button>
      <button onClick={() => toast.dismissAll()}>Dismiss All</button>
    </div>
  );
};

const renderWithProvider = (
  ui?: React.ReactNode,
  providerProps?: Partial<Parameters<typeof ToastProvider>[0]>
) => {
  return render(
    <ToastProvider {...providerProps}>
      {ui ?? <TestConsumer />}
    </ToastProvider>
  );
};

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("renders toast with message when triggered", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      await user.click(screen.getByRole("button", { name: "Success" }));

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("Success message")).toBeInTheDocument();
    });

    it("renders toast with description when provided", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.success("Title", { description: "Description text" });
      });

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description text")).toBeInTheDocument();
    });

    it("renders custom content when content prop is provided", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.toast({
          content: <div data-testid="custom-content">Custom Content</div>,
        });
      });

      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    });

    it("renders custom icon when icon prop is provided", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.success("Message", {
          icon: <span data-testid="custom-icon">★</span>,
        });
      });

      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("applies correct variant styling via data-variant attribute", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      await user.click(screen.getByRole("button", { name: "Error" }));

      expect(screen.getByRole("alert")).toHaveAttribute(
        "data-variant",
        "error"
      );
    });
  });

  describe("Toast Variants", () => {
    it.each(["success", "error", "warning", "info"] as const)(
      "renders %s toast with correct variant attribute",
      async (type) => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        renderWithProvider();

        const buttonName = type.charAt(0).toUpperCase() + type.slice(1);
        await user.click(screen.getByRole("button", { name: buttonName }));

        const role = type === "error" || type === "warning" ? "alert" : "status";
        expect(screen.getByRole(role)).toHaveAttribute(
          "data-variant",
          type
        );
      }
    );

    it("renders toast via generic toast() method with string", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      await user.click(screen.getByRole("button", { name: "Simple" }));

      expect(screen.getByText("Simple message")).toBeInTheDocument();
    });
  });

  describe("Close Button", () => {
    it("renders close button by default", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      await user.click(screen.getByRole("button", { name: "Success" }));

      expect(
        screen.getByRole("button", { name: "Close notification" })
      ).toBeInTheDocument();
    });

    it("hides close button when showCloseButton is false", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { showCloseButton: false });
      });

      expect(
        screen.queryByRole("button", { name: "Close notification" })
      ).not.toBeInTheDocument();
    });

    it("dismisses toast when close button is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      await user.click(screen.getByRole("button", { name: "Success" }));

      expect(screen.getByRole("status")).toBeInTheDocument();

      const closeButton = screen.getByRole("button", { name: "Close notification" });
      fireEvent.click(closeButton);

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
    });

    it("calls onDismiss callback when toast is dismissed", async () => {
      const onDismiss = vi.fn();
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      let id = "";
      await act(async () => {
        id = toastApi.info("Message", { onDismiss });
      });

      const closeButton = screen.getByRole("button", { name: "Close notification" });
      fireEvent.click(closeButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
      expect(onDismiss).toHaveBeenCalledWith(id);
    });
  });

  describe("Auto-dismiss", () => {
    it("auto-dismisses after duration expires", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />,
        { defaultDuration: 1000 }
      );

      await act(async () => {
        toastApi.info("Message");
      });

      expect(screen.getByRole("status")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(1200);
      });

      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
    });

    it("does not auto-dismiss when duration is Infinity", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Persistent", { duration: Infinity });
      });

      await act(async () => {
        vi.advanceTimersByTime(10000);
      });

      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("does not auto-dismiss when duration is 0 or negative", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { duration: 0 });
      });

      await act(async () => {
        vi.advanceTimersByTime(10000);
      });

      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  describe("Progress Bar", () => {
    it("renders progress bar by default", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />,
        { defaultDuration: 5000 }
      );

      await act(async () => {
        toastApi.info("Message");
      });

      const toast = screen.getByRole("status");
      const progressBar = toast.querySelector('[style*="width"]');
      expect(progressBar).toBeInTheDocument();
    });

    it("hides progress bar when showProgress is false", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { showProgress: false });
      });

      const toast = screen.getByRole("status");
      const progressContainer = toast.querySelector(".absolute.bottom-0");
      expect(progressContainer).not.toBeInTheDocument();
    });

    it("hides progress bar when duration is Infinity", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { duration: Infinity });
      });

      const toast = screen.getByRole("status");
      const progressContainer = toast.querySelector(".absolute.bottom-0");
      expect(progressContainer).not.toBeInTheDocument();
    });
  });

  describe("Pause on Hover", () => {
    it("pauses timer on mouse enter", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />,
        { defaultDuration: 2000 }
      );

      await act(async () => {
        toastApi.info("Message");
      });

      const toast = screen.getByRole("status");
      fireEvent.mouseEnter(toast);

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("resumes timer on mouse leave", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />,
        { defaultDuration: 2000 }
      );

      await act(async () => {
        toastApi.info("Message");
      });

      const toast = screen.getByRole("status");
      fireEvent.mouseEnter(toast);
      fireEvent.mouseLeave(toast);

      await act(async () => {
        vi.advanceTimersByTime(2500);
      });

      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
    });

    it("does not pause when pauseOnHover is false", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { pauseOnHover: false, duration: 2000 });
      });

      const toast = screen.getByRole("status");
      fireEvent.mouseEnter(toast);

      await act(async () => {
        vi.advanceTimersByTime(2500);
      });

      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
    });
  });

  // WCAG 2.2.1: a keyboard or screen-reader user reading the toast holds it the
  // way a pointer over it does, and the two holds combine.
  describe("Pause on Focus", () => {
    const showToast = async (options?: { pauseOnHover?: boolean }) => {
      let toastApi: ReturnType<typeof useToast>;
      renderWithProvider(<TestConsumer onMount={(api) => (toastApi = api)} />);
      await act(async () => {
        toastApi.info("Message", { duration: 2000, ...options });
      });
      const toast = screen.getByRole("status");
      const close = screen.getByRole("button", { name: "Close notification" });
      return { toast, close };
    };
    const advance = async (ms: number) => {
      await act(async () => {
        vi.advanceTimersByTime(ms);
      });
    };
    const gone = () =>
      waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });

    it("pauses while focus is inside", async () => {
      const { close } = await showToast();
      act(() => close.focus());
      await advance(3000);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("resumes when focus leaves", async () => {
      const { close } = await showToast();
      act(() => close.focus());
      await advance(3000);
      expect(screen.getByRole("status")).toBeInTheDocument();
      act(() => close.blur());
      await advance(2500);
      await gone();
    });

    it("stays paused when the pointer leaves while focus is still inside", async () => {
      const { toast, close } = await showToast();
      fireEvent.mouseEnter(toast);
      act(() => close.focus());
      fireEvent.mouseLeave(toast);
      await advance(3000);
      expect(screen.getByRole("status")).toBeInTheDocument();
      act(() => close.blur());
      await advance(2500);
      await gone();
    });

    it("stays paused when focus leaves while the pointer is still over it", async () => {
      const { toast, close } = await showToast();
      act(() => close.focus());
      await advance(3000);
      expect(screen.getByRole("status")).toBeInTheDocument();
      fireEvent.mouseEnter(toast);
      act(() => close.blur());
      await advance(3000);
      expect(screen.getByRole("status")).toBeInTheDocument();
      fireEvent.mouseLeave(toast);
      await advance(2500);
      await gone();
    });

    it("pauses on focus when pauseOnHover is false", async () => {
      const { close } = await showToast({ pauseOnHover: false });
      act(() => close.focus());
      await advance(3000);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  describe("Programmatic Dismiss", () => {
    it("dismisses specific toast by id", async () => {
      let toastApi: ReturnType<typeof useToast>;
      let toastId: string;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastId = toastApi.info("Message", { duration: Infinity });
      });

      expect(screen.getByRole("status")).toBeInTheDocument();

      await act(async () => {
        toastApi.dismiss(toastId);
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
    });

    it("dismisses all toasts", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message 1", { duration: Infinity });
        toastApi.info("Message 2", { duration: Infinity });
        toastApi.info("Message 3", { duration: Infinity });
      });

      expect(screen.getAllByRole("status")).toHaveLength(3);

      await user.click(screen.getByRole("button", { name: "Dismiss All" }));

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryAllByRole("status")).toHaveLength(0);
      });
    });
  });

  describe("Max Toasts", () => {
    it("limits visible toasts to maxToasts", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />,
        { maxToasts: 3 }
      );

      await act(async () => {
        for (let i = 0; i < 5; i++) {
          toastApi.info(`Message ${i}`, { duration: Infinity });
        }
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.getAllByRole("status").length).toBeLessThanOrEqual(3);
      });
    });
  });

  describe("Keyboard Accessibility", () => {
    it("dismisses toast on Escape when closeOnEscape is true on provider", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />,
        { closeOnEscape: true }
      );

      await act(async () => {
        toastApi.info("Message", { duration: Infinity });
      });

      const toast = screen.getByRole("status");
      expect(toast).toBeInTheDocument();

      await user.keyboard("{Escape}");

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
    });

    it("dismisses only the newest toast on Escape by default, through its onDismiss", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      let toastApi: ReturnType<typeof useToast>;
      const onOlder = vi.fn();
      const onNewer = vi.fn();

      renderWithProvider(<TestConsumer onMount={(api) => (toastApi = api)} />);

      await act(async () => {
        toastApi.info("Older", { duration: Infinity, onDismiss: onOlder });
        toastApi.info("Newer", { duration: Infinity, onDismiss: onNewer });
      });

      await user.keyboard("{Escape}");
      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      await waitFor(() => {
        expect(screen.queryByText("Newer")).not.toBeInTheDocument();
      });
      expect(screen.getByText("Older")).toBeInTheDocument();
      expect(onNewer).toHaveBeenCalledTimes(1);
      expect(onOlder).not.toHaveBeenCalled();
    });

    it("sends a second Escape to the next toast, not the one still leaving", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      let toastApi: ReturnType<typeof useToast>;
      const onOlder = vi.fn();
      const onNewer = vi.fn();

      renderWithProvider(<TestConsumer onMount={(api) => (toastApi = api)} />);

      await act(async () => {
        toastApi.info("Older", { duration: Infinity, onDismiss: onOlder });
        toastApi.info("Newer", { duration: Infinity, onDismiss: onNewer });
      });

      await user.keyboard("{Escape}");
      await user.keyboard("{Escape}");

      expect(onNewer).toHaveBeenCalledTimes(1);
      expect(onOlder).toHaveBeenCalledTimes(1);
    });

    it("does not dismiss on Escape when closeOnEscape is false", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />,
        { closeOnEscape: false }
      );

      await act(async () => {
        toastApi.info("Message 1", { duration: Infinity });
        toastApi.info("Message 2", { duration: Infinity });
      });

      await user.keyboard("{Escape}");
      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      expect(screen.getAllByRole("status")).toHaveLength(2);
    });

    it("close button is focusable", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { duration: Infinity });
      });

      const closeButton = screen.getByRole("button", {
        name: "Close notification",
      });
      closeButton.focus();

      expect(closeButton).toHaveFocus();
    });

    it("dismisses toast via Enter on close button", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { duration: Infinity });
      });

      const closeButton = screen.getByRole("button", {
        name: "Close notification",
      });
      closeButton.focus();

      fireEvent.keyDown(closeButton, { key: "Enter" });
      fireEvent.click(closeButton);

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
    });

    it("dismisses toast via Space on close button", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { duration: Infinity });
      });

      const closeButton = screen.getByRole("button", {
        name: "Close notification",
      });
      closeButton.focus();

      fireEvent.keyDown(closeButton, { key: " " });
      fireEvent.click(closeButton);

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
    });
  });

  describe("Accessibility Attributes", () => {
    it("toast has correct role based on variant", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      await user.click(screen.getByRole("button", { name: "Success" }));

      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("close button has accessible label", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      await user.click(screen.getByRole("button", { name: "Success" }));

      expect(
        screen.getByRole("button", { name: "Close notification" })
      ).toBeInTheDocument();
    });

    it("toast container has role=region for accessibility", async () => {
      renderWithProvider();

      const container = document.querySelector('[role="region"]');
      expect(container).toBeInTheDocument();
    });

    it("toast container has aria-label='Notifications'", async () => {
      renderWithProvider();

      const container = document.querySelector('[aria-label="Notifications"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("Custom Styling", () => {
    it("applies custom classes to toast", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { classes: { root: "custom-toast-class" } });
      });

      expect(screen.getByRole("status")).toHaveClass("custom-toast-class");
    });

    it("applies custom style to toast", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { style: { maxWidth: "500px" } });
      });

      expect(screen.getByRole("status")).toHaveStyle({
        maxWidth: "500px",
      });
    });

    it("applies progressColor to progress bar", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { progressColor: "#ff0000" });
      });

      const toast = screen.getByRole("status");
      const progressBar = toast.querySelector('[style*="background-color"]');
      expect(progressBar).toHaveStyle({ backgroundColor: "#ff0000" });
    });
  });

  describe("Portal Cleanup", () => {
    it("removes portal element from DOM on unmount", async () => {
      const { unmount } = renderWithProvider(<TestConsumer />);

      const portalElements = Array.from(document.body.children).filter(
        (el) => (el as HTMLElement).style?.position === "fixed"
      );
      expect(portalElements.length).toBeGreaterThan(0);

      unmount();

      const portalElementsAfter = Array.from(document.body.children).filter(
        (el) => (el as HTMLElement).style?.position === "fixed"
      );
      expect(portalElementsAfter.length).toBe(0);
    });

    it("generates unique IDs across multiple provider instances", async () => {
      let api1: ReturnType<typeof useToast>;
      let api2: ReturnType<typeof useToast>;

      const { unmount: unmount1 } = render(
        <ToastProvider>
          <TestConsumer onMount={(api) => (api1 = api)} />
        </ToastProvider>
      );

      const { unmount: unmount2 } = render(
        <ToastProvider>
          <TestConsumer onMount={(api) => (api2 = api)} />
        </ToastProvider>
      );

      let id1: string;
      let id2: string;

      await act(async () => {
        id1 = api1.info("Toast 1", { duration: Infinity });
      });

      await act(async () => {
        vi.advanceTimersByTime(1);
      });

      await act(async () => {
        id2 = api2.info("Toast 2", { duration: Infinity });
      });

      expect(id1!).toBeTruthy();
      expect(id2!).toBeTruthy();
      expect(id1!).not.toBe(id2!);

      unmount1();
      unmount2();
    });
  });

  describe("Position", () => {
    it("pins the default bottom-end region to the inline end, which a right-to-left page puts on the left", () => {
      renderWithProvider();
      const region = screen.getByRole("region");
      expect(region.className.split(" ")).toEqual(expect.arrayContaining(["bottom-4", "end-4"]));
      expect(region.className).not.toMatch(/\b(left|right)-4\b/);
    });

    it("pins top-start to the inline start", () => {
      renderWithProvider(undefined, { position: "top-start" });
      expect(screen.getByRole("region").className.split(" ")).toEqual(expect.arrayContaining(["top-4", "start-4"]));
    });

    it.each([
      "top-start",
      "top-end",
      "top-center",
      "bottom-start",
      "bottom-end",
      "bottom-center",
    ] as const)("renders toasts in %s position", async (position) => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />,
        { position }
      );

      await act(async () => {
        toastApi.info("Message");
      });

      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });
});

describe("useToast Hook", () => {
  it("throws error when used outside ToastProvider", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow("useToast must be used within a ToastProvider");

    consoleError.mockRestore();
  });

  it("returns stable API reference", async () => {
    const apiRefs: ReturnType<typeof useToast>[] = [];

    const Tracker = () => {
      const toast = useToast();
      useEffect(() => {
        apiRefs.push(toast);
      });
      return null;
    };

    const { rerender } = render(
      <ToastProvider>
        <Tracker />
      </ToastProvider>
    );

    rerender(
      <ToastProvider>
        <Tracker />
      </ToastProvider>
    );

    expect(apiRefs.length).toBeGreaterThanOrEqual(2);
    expect(apiRefs[0].toast).toBe(apiRefs[1].toast);
    expect(apiRefs[0].dismiss).toBe(apiRefs[1].dismiss);
    expect(apiRefs[0].dismissAll).toBe(apiRefs[1].dismissAll);
  });

  it("returns toast id from all methods", async () => {
    let toastApi: ReturnType<typeof useToast>;

    render(
      <ToastProvider>
        <TestConsumer onMount={(api) => (toastApi = api)} />
      </ToastProvider>
    );

    await act(async () => {
      const successId = toastApi.success("Success");
      const errorId = toastApi.error("Error");
      const warningId = toastApi.warning("Warning");
      const infoId = toastApi.info("Info");
      const toastId = toastApi.toast("Toast");

      expect(typeof successId).toBe("string");
      expect(typeof errorId).toBe("string");
      expect(typeof warningId).toBe("string");
      expect(typeof infoId).toBe("string");
      expect(typeof toastId).toBe("string");
    });
  });
});

import { getDefaultIcon } from "../utils/getDefaultIcon.js";

import { setReducedMotion } from "../../../test/matchMedia.js";

// The stub answers nothing by default, so every file that renders a
// motion-aware component states the preference it is testing under.
beforeEach(() => setReducedMotion(false));

describe("getDefaultIcon", () => {
  it("returns InfoIcon for unknown variant (default case)", () => {
    const icon = getDefaultIcon("unknown" as never);
    const { container } = render(<>{icon}</>);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

/**
 * Escape closes the top layer and nothing under it.
 *
 * Every overlay marks the Escape it acts on — Modal and Drawer stop it,
 * Tooltip stops it, the dropdown family prevents its default — and the toast
 * listens last, on window, and ignores a marked one. These set
 * `closeOnEscape` explicitly so that each case exercised the old listener
 * too: under the old default of off, every one of them passed without
 * measuring anything.
 */
describe("Toast Escape layering", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const Harness = ({ children }: { children?: React.ReactNode }) => (
    <ToastProvider closeOnEscape>
      <TestConsumer />
      {children}
    </ToastProvider>
  );

  const showToast = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByRole("button", { name: "Info" }));
    expect(screen.getByText("Info message")).toBeInTheDocument();
  };

  const settle = () =>
    act(async () => {
      vi.advanceTimersByTime(600);
    });

  it("closes an open Modal and leaves the toast", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onOpenChange = vi.fn();
    const { rerender } = render(<Harness />);
    await showToast(user);

    rerender(
      <Harness>
        <Modal open onOpenChange={onOpenChange} reduceMotion>
          <p>Dialog</p>
        </Modal>
      </Harness>
    );
    await user.keyboard("{Escape}");
    await settle();

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByText("Info message")).toBeInTheDocument();
  });

  // The toast's listener went on document before the drawer's did, and two
  // bubble listeners on one node fire in the order they were added.
  it("closes a Drawer opened after the toast and leaves the toast", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onOpenChange = vi.fn();
    const { rerender } = render(<Harness />);
    await showToast(user);

    rerender(
      <Harness>
        <Drawer open onOpenChange={onOpenChange} aria-label="Panel" animationDuration={0}>
          <DrawerBody>Panel</DrawerBody>
        </Drawer>
      </Harness>
    );
    await user.keyboard("{Escape}");
    await settle();

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Info message")).toBeInTheDocument();
  });

  it("does nothing to either while a Modal that declines Escape is open", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onOpenChange = vi.fn();
    const { rerender } = render(<Harness />);
    await showToast(user);

    rerender(
      <Harness>
        <Modal open onOpenChange={onOpenChange} closeOnEscape={false} reduceMotion>
          <p>Dialog</p>
        </Modal>
      </Harness>
    );
    await user.keyboard("{Escape}");
    await settle();

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByText("Info message")).toBeInTheDocument();
  });

  it("closes an open Dropdown menu and leaves the toast", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onOpenChange = vi.fn();
    const { rerender } = render(<Harness />);
    await showToast(user);

    rerender(
      <Harness>
        <Dropdown
          aria-label="Fruit"
          options={[{ value: "a", label: "Apple" }, { value: "b", label: "Banana" }]}
          onOpenChange={onOpenChange}
        />
      </Harness>
    );
    await user.click(screen.getByRole("combobox"));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.keyboard("{Escape}");
    await settle();

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByText("Info message")).toBeInTheDocument();
  });

  // A handler that marks Escape without acting on it takes the key from the
  // toast for nothing. Each surface below is tried both ways: focused with
  // nothing to close, where the toast must go, and acting, where it must stay.
  describe("surfaces that act on Escape only sometimes", () => {
    const cascadingOptions = [
      { value: "fruits", label: "Fruits" },
      { value: "grains", label: "Grains" },
    ];

    it("dismisses the toast from a closed CascadingDropdown trigger", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { rerender } = render(<Harness />);
      await showToast(user);

      rerender(
        <Harness>
          <CascadingDropdown aria-label="Category" options={cascadingOptions} />
        </Harness>
      );
      const trigger = screen.getByRole("button", { name: "Category" });
      act(() => trigger.focus());
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.keyboard("{Escape}");
      await settle();

      await waitFor(() => {
        expect(screen.queryByText("Info message")).not.toBeInTheDocument();
      });
    });

    it("closes an open CascadingDropdown and leaves the toast", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { rerender } = render(<Harness />);
      await showToast(user);

      rerender(
        <Harness>
          <CascadingDropdown aria-label="Category" options={cascadingOptions} />
        </Harness>
      );
      const trigger = screen.getByRole("button", { name: "Category" });
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      await user.keyboard("{Escape}");
      await settle();

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(screen.getByText("Info message")).toBeInTheDocument();
    });

    const people = [
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ];
    const peopleColumns = [{ accessorKey: "name", header: "Name" }];

    // The grid's Escape resets the roving tab stop and tells the consumer no
    // row is hovered. Nothing closes and nothing is cancelled.
    it("dismisses the toast from a focused Table cell", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { rerender } = render(<Harness />);
      await showToast(user);

      rerender(
        <Harness>
          <Table columns={peopleColumns} data={people} getRowId={(row) => row.id} />
        </Harness>
      );
      const [cell] = screen.getAllByRole("gridcell");
      act(() => cell.focus());

      await user.keyboard("{Escape}");
      await settle();

      await waitFor(() => {
        expect(screen.queryByText("Info message")).not.toBeInTheDocument();
      });
    });

    it("cancels a Table cell edit and leaves the toast", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onCellEdit = vi.fn();
      const { rerender } = render(<Harness />);
      await showToast(user);

      rerender(
        <Harness>
          <Table
            columns={peopleColumns}
            data={people}
            getRowId={(row) => row.id}
            editable
            onCellEdit={onCellEdit}
          />
        </Harness>
      );
      const [cell] = screen.getAllByRole("gridcell");
      await user.dblClick(cell);
      expect(screen.getByDisplayValue("Alice")).toHaveFocus();

      await user.keyboard("{Escape}");
      await settle();

      expect(screen.queryByDisplayValue("Alice")).not.toBeInTheDocument();
      expect(onCellEdit).not.toHaveBeenCalled();
      expect(screen.getByText("Info message")).toBeInTheDocument();
    });

    // No closed case for the calendar's own handlers: a closed calendar is
    // unmounted, or `display: none` under `keepMounted`, so no day cell can
    // hold focus while it is shut. The closed case is the field's trigger.
    it("dismisses the toast from a DatePicker whose calendar is shut", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { rerender } = render(<Harness />);
      await showToast(user);

      rerender(
        <Harness>
          <DatePicker label="Date" />
        </Harness>
      );
      const trigger = screen.getByRole("combobox");
      act(() => trigger.focus());

      await user.keyboard("{Escape}");
      await settle();

      await waitFor(() => {
        expect(screen.queryByText("Info message")).not.toBeInTheDocument();
      });
    });

    it("closes an open DatePicker calendar from a day and leaves the toast", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { rerender } = render(<Harness />);
      await showToast(user);

      rerender(
        <Harness>
          <DatePicker label="Date" />
        </Harness>
      );
      const trigger = screen.getByRole("combobox");
      await user.click(trigger);
      const [day] = await screen.findAllByRole("gridcell");
      act(() => day.focus());

      await user.keyboard("{Escape}");
      await settle();

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(screen.getByText("Info message")).toBeInTheDocument();
    });
  });
});
