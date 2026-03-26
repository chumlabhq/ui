import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "../index";

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("renders trigger element with children", () => {
      render(
        <Tooltip content="Tooltip content">
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.getByText("Trigger")).toBeInTheDocument();
    });

    it("does not render tooltip content by default", () => {
      render(
        <Tooltip content="Tooltip content">
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("renders tooltip with defaultOpen=true", async () => {
      render(
        <Tooltip content="Default open tooltip" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
      expect(screen.getByText("Default open tooltip")).toBeInTheDocument();
    });

    it("renders arrow by default when tooltip is open", async () => {
      render(
        <Tooltip content="With arrow" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        const arrow = tooltip.querySelector("svg");
        expect(arrow).toBeInTheDocument();
        expect(arrow).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("hides arrow when showArrow=false", async () => {
      render(
        <Tooltip content="No arrow" showArrow={false} defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        const arrow = tooltip.querySelector("svg");
        expect(arrow).not.toBeInTheDocument();
      });
    });

    it("renders rich HTML content", async () => {
      render(
        <Tooltip
          content={<div data-testid="rich-content"><strong>Bold</strong></div>}
          defaultOpen
        >
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByTestId("rich-content")).toBeInTheDocument();
        expect(screen.getByText("Bold")).toBeInTheDocument();
      });
    });
  });

  describe("Mouse Interactions", () => {
    it("shows tooltip on mouse enter after delay", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Hover tooltip" delayDuration={200}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger");
      await user.hover(trigger);

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("shows tooltip immediately when delayDuration=0", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Instant tooltip" delayDuration={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByText("Trigger"));

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("hides tooltip on mouse leave", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Hide on leave" delayDuration={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger");
      await user.hover(trigger);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      await user.unhover(trigger);

      await act(async () => {
        vi.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });

    it("cancels show delay when mouse leaves before delay completes", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Cancelled" delayDuration={500}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger");
      await user.hover(trigger);

      await act(async () => {
        vi.advanceTimersByTime(200);
      });

      await user.unhover(trigger);

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  describe("Focus Interactions", () => {
    it("shows tooltip on focus", async () => {
      render(
        <Tooltip content="Focus tooltip" delayDuration={0}>
          <span>Trigger</span>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger").closest("[tabindex]") as HTMLElement;
      act(() => {
        trigger?.focus();
      });

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("hides tooltip on blur", async () => {
      render(
        <Tooltip content="Blur tooltip" delayDuration={0}>
          <span>Trigger</span>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger").closest("[tabindex]") as HTMLElement;
      act(() => {
        trigger?.focus();
      });

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      act(() => {
        trigger?.blur();
      });

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });
  });

  describe("Keyboard Navigation", () => {
    it("dismisses tooltip on Escape key", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Escape test" defaultOpen>
          <span tabIndex={0}>Trigger</span>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      const trigger = screen.getByText("Trigger").closest("span[tabindex]") as HTMLElement;
      act(() => {
        trigger?.focus();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });

    it("trigger wrapper omits tabIndex when children are interactive", () => {
      render(
        <Tooltip content="Focusable">
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger").closest("span");
      expect(trigger).not.toHaveAttribute("tabindex");
    });
  });

  describe("Accessibility", () => {
    it("tooltip has role='tooltip'", async () => {
      render(
        <Tooltip content="Accessible" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("trigger has aria-describedby pointing to tooltip when open", async () => {
      render(
        <Tooltip content="Described by" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        const trigger = screen.getByText("Trigger").closest("span");
        expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
      });
    });

    it("trigger does not have aria-describedby when tooltip is closed", () => {
      render(
        <Tooltip content="Not open">
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger").closest("span");
      expect(trigger).not.toHaveAttribute("aria-describedby");
    });

    it("tooltip has unique id", async () => {
      render(
        <Tooltip content="Unique ID" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip.id).toMatch(/^tooltip-/);
        expect(tooltip.id.length).toBeGreaterThan("tooltip-".length);
      });
    });
  });

  describe("Controlled State", () => {
    it("respects controlled open prop", async () => {
      const { rerender } = render(
        <Tooltip content="Controlled" open={false}>
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

      rerender(
        <Tooltip content="Controlled" open={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("calls onOpenChange when state changes", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onOpenChange = vi.fn();

      render(
        <Tooltip content="Callback" delayDuration={0} onOpenChange={onOpenChange}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByText("Trigger"));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });
    });

    it("controlled mode ignores internal state changes", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Controlled closed" open={false} delayDuration={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByText("Trigger"));

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("does not show tooltip when disabled", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Disabled" disabled delayDuration={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByText("Trigger"));

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("does not show tooltip on focus when disabled", () => {
      render(
        <Tooltip content="Disabled focus" disabled delayDuration={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger").closest("span");
      act(() => {
        trigger?.focus();
      });

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("renders children without tooltip wrapper when disabled", () => {
      render(
        <Tooltip content="No wrapper" disabled>
          <button data-testid="child">Trigger</button>
        </Tooltip>
      );

      const button = screen.getByTestId("child");
      expect(button.parentElement?.tagName).not.toBe("SPAN");
    });
  });

  describe("Hoverable Content", () => {
    it("keeps tooltip open when hovering tooltip content by default", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Hoverable" delayDuration={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByText("Trigger"));

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      const tooltip = screen.getByRole("tooltip");
      await user.unhover(screen.getByText("Trigger"));
      await user.hover(tooltip);

      await act(async () => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("closes immediately when disableHoverableContent=true", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Not hoverable" disableHoverableContent delayDuration={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByText("Trigger"));

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      await user.unhover(screen.getByText("Trigger"));

      await act(async () => {
        vi.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });
  });

  describe("Truncate Mode", () => {
    it("does not show tooltip when text is not truncated", () => {
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
        configurable: true,
        get() { return 50; },
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get() { return 100; },
      });

      render(
        <Tooltip truncate truncateWidth="max-w-[200px]">
          Short text
        </Tooltip>
      );

      const wrapper = screen.getByText("Short text");
      expect(wrapper).toBeInTheDocument();
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("shows children as tooltip content in truncate mode when truncated", async () => {
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
        configurable: true,
        get() { return 300; },
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get() { return 100; },
      });

      render(
        <Tooltip truncate truncateWidth="max-w-[200px]" defaultOpen>
          Long text content that will truncate
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveTextContent("Long text content that will truncate");
      });
    });
  });

  describe("Styling Props", () => {
    it("applies custom content class via classes prop", async () => {
      render(
        <Tooltip content="Styled" classes={{ content: "custom-tooltip-class" }} defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveClass("custom-tooltip-class");
      });
    });

    it("applies custom trigger class via classes prop", () => {
      render(
        <Tooltip content="Trigger styled" classes={{ trigger: "custom-trigger" }}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger").closest("span");
      expect(trigger).toHaveClass("custom-trigger");
    });

    it("applies custom arrow class via classes prop", async () => {
      render(
        <Tooltip content="Arrow styled" classes={{ arrow: "custom-arrow" }} defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        const arrow = tooltip.querySelector("svg");
        expect(arrow).toHaveClass("custom-arrow");
      });
    });

    it("applies contentStyle", async () => {
      render(
        <Tooltip
          content="Inline styled"
          contentStyle={{ backgroundColor: "red" }}
          defaultOpen
        >
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip.style.backgroundColor).toBe("red");
      });
    });

    it("applies custom zIndex", async () => {
      render(
        <Tooltip content="Z-indexed" zIndex={5000} defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveStyle({ zIndex: "5000" });
      });
    });

    it("applies maxWidth as number", async () => {
      render(
        <Tooltip content="Max width 200" maxWidth={200} defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveStyle({ maxWidth: "200px" });
      });
    });

    it("applies maxWidth as string", async () => {
      render(
        <Tooltip content="Max width 50vw" maxWidth="50vw" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveStyle({ maxWidth: "50vw" });
      });
    });
  });

  describe("Word Wrap", () => {
    it("applies break-word styles by default", async () => {
      render(
        <Tooltip content="Word wrap" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveStyle({ overflowWrap: "break-word" });
        expect(tooltip).toHaveStyle({ whiteSpace: "normal" });
      });
    });

    it("applies nowrap styles when wordWrap='nowrap'", async () => {
      render(
        <Tooltip content="No wrap" wordWrap="nowrap" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveStyle({ whiteSpace: "nowrap" });
      });
    });

    it("applies normal word break when wordWrap='normal'", async () => {
      render(
        <Tooltip content="Normal" wordWrap="normal" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveStyle({ overflowWrap: "normal" });
      });
    });
  });

  describe("Arrow Color", () => {
    it("applies custom arrowColor", async () => {
      render(
        <Tooltip content="Colored arrow" arrowColor="#ff0000" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        const arrow = tooltip.querySelector("svg");
        expect(arrow).toHaveStyle({ fill: "#ff0000" });
      });
    });
  });
});

