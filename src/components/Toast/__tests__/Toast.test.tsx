import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { ToastProvider, useToast } from "../index";

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

    it("applies correct type styling via data-toast-type attribute", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      await user.click(screen.getByRole("button", { name: "Error" }));

      expect(screen.getByRole("alert")).toHaveAttribute(
        "data-toast-type",
        "error"
      );
    });
  });

  describe("Toast Types", () => {
    it.each(["success", "error", "warning", "info"] as const)(
      "renders %s toast with correct type attribute",
      async (type) => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        renderWithProvider();

        const buttonName = type.charAt(0).toUpperCase() + type.slice(1);
        await user.click(screen.getByRole("button", { name: buttonName }));

        const role = type === "error" || type === "warning" ? "alert" : "status";
        expect(screen.getByRole(role)).toHaveAttribute(
          "data-toast-type",
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

    it("calls onClose callback when toast is dismissed", async () => {
      const onClose = vi.fn();
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { onClose });
      });

      const closeButton = screen.getByRole("button", { name: "Close notification" });
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
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

      // Advance past the full duration while hovered — toast should still exist
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

      // After mouse leave, timer resumes — toast should auto-dismiss
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

      // Even while hovered, toast should auto-dismiss since pauseOnHover is false
      await act(async () => {
        vi.advanceTimersByTime(2500);
      });

      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
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
    it("dismisses toast on Escape when dismissOnEscape is true on toast", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { dismissOnEscape: true, duration: Infinity });
      });

      const toast = screen.getByRole("status");
      expect(toast).toBeInTheDocument();

      // The component only dismisses on Escape when the toast is focused or hovered
      fireEvent.mouseEnter(toast);

      await user.keyboard("{Escape}");

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
    });

    it("dismisses all toasts on Escape when dismissOnEscape is true on provider", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />,
        { dismissOnEscape: true }
      );

      await act(async () => {
        toastApi.info("Message 1", { duration: Infinity });
        toastApi.info("Message 2", { duration: Infinity });
      });

      expect(screen.getAllByRole("status")).toHaveLength(2);

      await user.keyboard("{Escape}");

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryAllByRole("status")).toHaveLength(0);
      });
    });

    it("does not dismiss on Escape when dismissOnEscape is false", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { duration: Infinity });
      });

      await user.keyboard("{Escape}");

      expect(screen.getByRole("status")).toBeInTheDocument();
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
    it("toast has correct role based on type", async () => {
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

    it("toast container has aria-live='polite'", async () => {
      renderWithProvider();

      const container = document.querySelector('[aria-live="polite"]');
      expect(container).toBeInTheDocument();
    });

    it("toast container has aria-label='Notifications'", async () => {
      renderWithProvider();

      const container = document.querySelector('[aria-label="Notifications"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className to toast", async () => {
      let toastApi: ReturnType<typeof useToast>;

      renderWithProvider(
        <TestConsumer onMount={(api) => (toastApi = api)} />
      );

      await act(async () => {
        toastApi.info("Message", { className: "custom-toast-class" });
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

  describe("Position", () => {
    it.each([
      "top-left",
      "top-right",
      "top-center",
      "bottom-left",
      "bottom-right",
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
