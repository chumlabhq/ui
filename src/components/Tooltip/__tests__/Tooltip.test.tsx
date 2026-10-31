import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { Tooltip } from "../index.js";
import { Modal } from "../../Modal/index.js";

/**
 * Which kind of focus the stubbed `:focus-visible` reports.
 *
 * jsdom's own answer cannot be used: measured inside a focus handler, the
 * first Tab reported `:focus-visible` true and the second, onto the next
 * button, false. So these tests declare the browser's answer and prove the
 * wiring — that both trigger shapes ask it of the focused element. What each
 * engine actually answers for a click, a Tab and a restored focus is measured
 * in `e2e/tooltip.spec.ts`, in chromium, firefox and webkit.
 */
let focusModality: "keyboard" | "pointer" = "keyboard";
const nativeMatches = Element.prototype.matches;

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    focusModality = "keyboard";
    vi.spyOn(Element.prototype, "matches").mockImplementation(function (this: Element, selector: string) {
      if (selector === ":focus-visible") {
        return focusModality === "keyboard" && this === document.activeElement;
      }
      return nativeMatches.call(this, selector);
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
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

    it("stays open when focus moves from the trigger into its own content, and closes when it moves on elsewhere", async () => {
      render(
        <>
          <Tooltip content="Hoverable tip" delayDuration={0}>
            <span>Trigger</span>
          </Tooltip>
          <button type="button">Elsewhere</button>
        </>
      );

      const trigger = screen.getByText("Trigger").closest("[tabindex]") as HTMLElement;
      act(() => trigger.focus());
      const tooltip = await screen.findByRole("tooltip");

      act(() => tooltip.focus());
      expect(document.activeElement).toBe(tooltip);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      act(() => screen.getByRole("button", { name: "Elsewhere" }).focus());
      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });

    it("closes when focus moves from the trigger into content that is not hoverable", async () => {
      render(
        <Tooltip content="Plain tip" delayDuration={0} hoverableContent={false}>
          <span>Trigger</span>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger").closest("[tabindex]") as HTMLElement;
      act(() => trigger.focus());
      const tooltip = await screen.findByRole("tooltip");
      expect(tooltip).not.toHaveAttribute("tabindex");

      act(() => {
        trigger.dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: tooltip }));
      });
      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });
  });

  /**
   * Focus opens the tooltip only when the browser would draw a focus ring for
   * it. A click, a tap or a focus handed back by a closing dialog is not a
   * request for the tip. Hover is delayed far past the test so that anything
   * that opens here opened from focus; which focus it was is `focusModality`.
   */
  describe("Focus modality", () => {
    const NEVER = 60_000;

    it.each([
      ["the default trigger", false],
      ["an asChild trigger", true],
    ])("opens from Tab onto %s", async (_label, asChild) => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Tooltip content="Keyboard tip" delayDuration={NEVER} asChild={asChild}>
          {asChild ? <button>Trigger</button> : <span>Trigger</span>}
        </Tooltip>
      );

      await user.tab();

      expect(await screen.findByRole("tooltip")).toHaveTextContent("Keyboard tip");
    });

    it.each([
      ["the default trigger", false],
      ["an asChild trigger", true],
    ])("stays shut when a click focuses %s", async (_label, asChild) => {
      focusModality = "pointer";
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Tooltip content="Click tip" delayDuration={NEVER} asChild={asChild}>
          {asChild ? <button>Trigger</button> : <span>Trigger</span>}
        </Tooltip>
      );
      const trigger = asChild
        ? screen.getByRole("button", { name: "Trigger" })
        : (screen.getByText("Trigger").closest("[tabindex]") as HTMLElement);

      await user.click(trigger);
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(trigger).toHaveFocus();
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("stays shut when a Modal closed by the mouse hands focus back to the trigger", async () => {
      focusModality = "pointer";
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const Harness = () => {
        const [open, setOpen] = useState(false);
        return (
          <>
            {/* The pointer leaves the trigger on its way to the dialog's close
                button, and that hide timer would otherwise close whatever the
                restored focus opened before this reads it. */}
            <Tooltip content="Restored tip" delayDuration={NEVER} hideDelayDuration={NEVER} asChild>
              <button onClick={() => setOpen(true)}>Open dialog</button>
            </Tooltip>
            <Modal open={open} onOpenChange={setOpen} title="Dialog" reduceMotion>
              <p>Body</p>
            </Modal>
          </>
        );
      };
      render(<Harness />);
      const trigger = screen.getByRole("button", { name: "Open dialog" });

      await user.click(trigger);
      await act(async () => {
        vi.advanceTimersByTime(50);
      });
      await user.click(screen.getByRole("button", { name: "Close modal" }));
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(trigger).toHaveFocus();
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("still closes a keyboard-opened tooltip on Escape", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Tooltip content="Escape tip" delayDuration={NEVER}>
          <span>Trigger</span>
        </Tooltip>
      );

      await user.tab();
      expect(await screen.findByRole("tooltip")).toBeInTheDocument();

      await user.keyboard("{Escape}");

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

    it("the focusable trigger is described by the tooltip when open, not its wrapper", async () => {
      render(
        <Tooltip content="Described by" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        const trigger = screen.getByRole("button", { name: "Trigger" });
        expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
        expect(trigger.closest("span")).not.toHaveAttribute("aria-describedby");
      });
    });

    it("trigger does not have aria-describedby when tooltip is closed", () => {
      render(
        <Tooltip content="Not open">
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });
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

    it("closes immediately when hoverableContent={false}", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Not hoverable" hoverableContent={false} delayDuration={0}>
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

  describe("handleMouseEnter delay-timeout clearing (lines 261-262)", () => {
    it("clears existing delay timeout when mouse re-enters during a pending delay", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Re-hover test" delayDuration={300}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger");

      // First hover — starts delay timeout
      await user.hover(trigger);
      // Advance time partially (timeout not yet fired)
      await act(async () => { vi.advanceTimersByTime(100); });

      // Leave before timeout fires — cancels the show timeout (hide timeout starts)
      await user.unhover(trigger);

      // Re-hover immediately — this hits line 261-262: clears the pending delay timeout
      // and starts a new one
      await user.hover(trigger);

      await act(async () => { vi.advanceTimersByTime(300); });

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("clears existing hide timeout when re-hovering after leaving (line 256-258)", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Hide-clear test" delayDuration={0} hideDelayDuration={300}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger");

      await user.hover(trigger);
      await waitFor(() => { expect(screen.getByRole("tooltip")).toBeInTheDocument(); });

      await user.unhover(trigger);
      await act(async () => { vi.advanceTimersByTime(100); });

      // Re-hover before hide timeout fires — hits line 256-258 clearing hideTimeoutRef
      await user.hover(trigger);
      await act(async () => { vi.advanceTimersByTime(300); });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  describe("handleTouchOutside — touchstart outside closes tooltip (lines 305-311)", () => {
    it("closes tooltip when touchstart fires outside both tooltip and trigger", async () => {
      const outsideButton = document.createElement("button");
      outsideButton.textContent = "Outside";
      document.body.appendChild(outsideButton);

      render(
        <Tooltip content="Touch outside test" defaultOpen delayDuration={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      act(() => {
        const touchEvent = new TouchEvent("touchstart", {
          bubbles: true,
          cancelable: true,
          touches: [],
        });
        Object.defineProperty(touchEvent, "target", { value: outsideButton, configurable: true });
        document.dispatchEvent(touchEvent);
      });

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });

      document.body.removeChild(outsideButton);
    });

    it("keeps tooltip open when touchstart fires inside the trigger element", async () => {
      render(
        <Tooltip content="Touch inside test" defaultOpen delayDuration={0}>
          <button data-testid="trigger-btn">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      const triggerEl = screen.getByTestId("trigger-btn");

      // Simulate touchstart on the trigger element — hits the early-return guard (line 307-309)
      act(() => {
        const touchEvent = new TouchEvent("touchstart", {
          bubbles: true,
          cancelable: true,
          touches: [],
        });
        Object.defineProperty(touchEvent, "target", { value: triggerEl, configurable: true });
        document.dispatchEvent(touchEvent);
      });

      // Should still be open because touch was on the trigger
      await act(async () => { vi.advanceTimersByTime(200); });
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
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

  describe("AsChild / TooltipAsChildTrigger", () => {
    // React 19 only, as is this whole suite: on 18 the same child carries its
    // ref on the element rather than in props. That half is asserted by the
    // consumer matrix's vite-react18 template, which runs a real React 18.
    it("hands the child's own ref its element, without a ref warning", () => {
      const error = vi.spyOn(console, "error");
      const ref = createRef<HTMLButtonElement>();
      render(
        <Tooltip content="Ref tip" asChild>
          <button ref={ref}>Ref trigger</button>
        </Tooltip>
      );

      expect(ref.current).toBe(screen.getByRole("button", { name: "Ref trigger" }));
      expect(error.mock.calls.flat().join(" ")).not.toMatch(/element\.ref|`ref` is not a prop/);
      error.mockRestore();
    });

    it("merges props onto child instead of wrapping in span", () => {
      render(
        <Tooltip content="AsChild tooltip" asChild>
          <button data-testid="aschild-btn">Click me</button>
        </Tooltip>
      );

      const button = screen.getByTestId("aschild-btn");
      // Should NOT be wrapped in a span -- button's parent should not be a trigger span
      expect(button.parentElement?.tagName).not.toBe("SPAN");
      expect(button).toBeInTheDocument();
    });

    it("shows tooltip on hover in asChild mode", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="AsChild hover" asChild delayDuration={0}>
          <button data-testid="aschild-hover">Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByTestId("aschild-hover"));

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
        expect(screen.getByText("AsChild hover")).toBeInTheDocument();
      });
    });

    it("sets aria-describedby on child element when tooltip is open in asChild mode", async () => {
      render(
        <Tooltip content="Described" asChild defaultOpen>
          <button data-testid="aschild-aria">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const button = screen.getByTestId("aschild-aria");
        const tooltip = screen.getByRole("tooltip");
        expect(button).toHaveAttribute("aria-describedby", tooltip.id);
      });
    });

    it("does not set aria-describedby when tooltip is closed in asChild mode", () => {
      render(
        <Tooltip content="Not described" asChild>
          <button data-testid="aschild-closed">Trigger</button>
        </Tooltip>
      );

      const button = screen.getByTestId("aschild-closed");
      expect(button).not.toHaveAttribute("aria-describedby");
    });

    it("calls child's original event handlers in asChild mode", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onMouseEnter = vi.fn();
      const onMouseLeave = vi.fn();
      const onFocus = vi.fn();

      render(
        <Tooltip content="Handlers" asChild delayDuration={0}>
          <button
            data-testid="aschild-handlers"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={onFocus}
          >
            Trigger
          </button>
        </Tooltip>
      );

      const button = screen.getByTestId("aschild-handlers");

      await user.hover(button);
      expect(onMouseEnter).toHaveBeenCalled();

      await user.unhover(button);
      expect(onMouseLeave).toHaveBeenCalled();

      act(() => {
        button.focus();
      });
      expect(onFocus).toHaveBeenCalled();
    });

    it("dismisses tooltip on Escape in asChild mode", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Escape asChild" asChild defaultOpen>
          <button data-testid="aschild-esc">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      const button = screen.getByTestId("aschild-esc");
      act(() => {
        button.focus();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });

    it("merges className from child and trigger class in asChild mode", () => {
      render(
        <Tooltip
          content="Merged class"
          asChild
          classes={{ trigger: "tooltip-trigger-cls" }}
        >
          <button className="original-cls" data-testid="aschild-cls">
            Trigger
          </button>
        </Tooltip>
      );

      const button = screen.getByTestId("aschild-cls");
      expect(button).toHaveClass("original-cls");
      expect(button).toHaveClass("tooltip-trigger-cls");
    });
  });

  describe("Portal Rendering", () => {
    it("renders tooltip content in document.body by default via portal", async () => {
      render(
        <Tooltip content="Portal test" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        // Portal renders into document.body, so the tooltip should be a descendant of body
        expect(document.body.contains(tooltip)).toBe(true);
      });
    });

    it("renders tooltip inline when portal=false", async () => {
      render(
        <div data-testid="inline-container">
          <Tooltip content="Inline test" portal={false} defaultOpen>
            <button>Trigger</button>
          </Tooltip>
        </div>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        const container = screen.getByTestId("inline-container");
        expect(container.contains(tooltip)).toBe(true);
      });
    });

    it("renders tooltip into custom portal container", async () => {
      const portalTarget = document.createElement("div");
      portalTarget.setAttribute("data-testid", "portal-target");
      document.body.appendChild(portalTarget);

      render(
        <Tooltip content="Custom portal" defaultOpen portalContainer={portalTarget}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(portalTarget.contains(tooltip)).toBe(true);
      });

      document.body.removeChild(portalTarget);
    });
  });

  describe("Truncation-Only Mode", () => {
    afterEach(() => {
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
        configurable: true,
        get() {
          return this.offsetWidth || 0;
        },
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get() {
          return this.offsetWidth || 0;
        },
      });
    });

    it("renders children as truncated text", () => {
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
        configurable: true,
        get() { return 50; },
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get() { return 100; },
      });

      render(
        <Tooltip truncate>
          Short text that fits
        </Tooltip>
      );

      expect(screen.getByText("Short text that fits")).toBeInTheDocument();
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("renders truncated span with truncate class", () => {
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
        configurable: true,
        get() { return 300; },
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get() { return 100; },
      });

      render(
        <Tooltip truncate>
          This is a very long text that will be truncated
        </Tooltip>
      );

      const textSpan = screen.getByText(
        "This is a very long text that will be truncated"
      );
      expect(textSpan).toHaveClass("truncate");
    });

    it("applies truncateWidth style when truncateWidth is a number", () => {
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
        configurable: true,
        get() { return 300; },
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get() { return 100; },
      });

      render(
        <Tooltip truncate truncateWidth={150} defaultOpen>
          Truncated with width
        </Tooltip>
      );

      const textSpans = screen.getAllByText("Truncated with width");
      const styledSpan = textSpans.find(el => el.style.maxWidth);
      expect(styledSpan).toBeTruthy();
      expect(styledSpan!.style.maxWidth).toBe("150px");
    });

    it("shows children as tooltip content when text is truncated", async () => {
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
        configurable: true,
        get() { return 300; },
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get() { return 100; },
      });

      render(
        <Tooltip truncate defaultOpen>
          Truncated text tooltip content
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveTextContent("Truncated text tooltip content");
      });
    });
  });

  describe("Rich Content", () => {
    it("renders complex JSX content in tooltip", async () => {
      render(
        <Tooltip
          content={
            <div>
              <h3 data-testid="rich-heading">Title</h3>
              <p data-testid="rich-para">Description paragraph</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          }
          defaultOpen
        >
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByTestId("rich-heading")).toBeInTheDocument();
        expect(screen.getByTestId("rich-para")).toBeInTheDocument();
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
      });
    });

    it("renders string content as text", async () => {
      render(
        <Tooltip content="Simple string content" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByText("Simple string content")).toBeInTheDocument();
      });
    });
  });

  describe("Shadow Presets", () => {
    it("applies no shadow when shadow='none'", async () => {
      render(
        <Tooltip content="No shadow" shadow="none" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveStyle({ boxShadow: "none" });
      });
    });

    it("applies sm shadow preset", async () => {
      render(
        <Tooltip content="Small shadow" shadow="sm" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip.style.boxShadow).toContain("rgba(0, 0, 0");
      });
    });

    it("applies custom shadow string", async () => {
      render(
        <Tooltip content="Custom shadow" shadow="0 0 10px red" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveStyle({ boxShadow: "0 0 10px red" });
      });
    });

    it("applies default lg shadow preset", async () => {
      render(
        <Tooltip content="Default shadow" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        // Default shadow is "lg": "0 6px 16px rgba(0, 0, 0, 0.2)"
        expect(tooltip.style.boxShadow).toBeTruthy();
      });
    });
  });

  describe("Controlled Tooltip (open prop)", () => {
    it("shows tooltip when open=true", async () => {
      render(
        <Tooltip content="Controlled open" open={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("hides tooltip when open=false", () => {
      render(
        <Tooltip content="Controlled closed" open={false}>
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("toggles visibility when open prop changes", async () => {
      const { rerender } = render(
        <Tooltip content="Toggle me" open={false}>
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

      rerender(
        <Tooltip content="Toggle me" open={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      rerender(
        <Tooltip content="Toggle me" open={false}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });

    it("fires onOpenChange but does not change state when controlled", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onOpenChange = vi.fn();

      render(
        <Tooltip content="Controlled" open={false} delayDuration={0} onOpenChange={onOpenChange}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByText("Trigger"));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });

      // Tooltip should still be hidden because open is controlled to false
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  describe("Unstyled Mode", () => {
    it("renders without default styled classes when unstyled=true", async () => {
      render(
        <Tooltip content="Unstyled" unstyled defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        // Unstyled should not have the default content classes
        // Was `not.toContain("rounded-lg")` — Tooltip uses the cl-* scale and
        // has never emitted rounded-lg, so half of this test was inert.
        expect(tooltip).not.toHaveClass("rounded-cl-md");
        expect(tooltip).not.toHaveClass("bg-white");
      });
    });
  });

  describe("Trigger Display", () => {
    it("applies custom triggerDisplay style", () => {
      render(
        <Tooltip content="Block trigger" triggerDisplay="block">
          <span>Trigger</span>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger").closest("span[style]");
      if (trigger) {
        expect(trigger).toHaveStyle({ display: "block" });
      }
    });
  });

  describe("Arrow Size", () => {
    it("applies custom arrowSize to SVG dimensions", async () => {
      render(
        <Tooltip content="Large arrow" arrowSize={10} defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        const arrow = tooltip.querySelector("svg");
        expect(arrow).toHaveAttribute("width", "20"); // arrowSize * 2
        expect(arrow).toHaveAttribute("height", "10");
      });
    });
  });

  describe("Tooltip mouse leave on content", () => {
    it("hides tooltip when mouse leaves the tooltip content", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Content leave" delayDuration={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByText("Trigger"));

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      const tooltip = screen.getByRole("tooltip");
      await user.hover(tooltip);
      await user.unhover(tooltip);

      await act(async () => {
        vi.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });
  });

  describe("Touch Interactions", () => {
    it("shows tooltip after long press on touch", async () => {
      render(
        <Tooltip content="Touch tooltip" delayDuration={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger").closest("span") as HTMLElement;

      act(() => {
        trigger.dispatchEvent(new Event("touchstart", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("cancels touch tooltip if touch ends before timeout", async () => {
      render(
        <Tooltip content="Cancelled touch" delayDuration={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText("Trigger").closest("span") as HTMLElement;

      act(() => {
        trigger.dispatchEvent(new Event("touchstart", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(200);
      });

      act(() => {
        trigger.dispatchEvent(new Event("touchend", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  describe("AsChild Touch and Blur Events", () => {
    it("calls child's onBlur handler in asChild mode", async () => {
      const onBlur = vi.fn();

      render(
        <Tooltip content="Blur handlers" asChild delayDuration={0}>
          <button data-testid="aschild-blur" onBlur={onBlur}>
            Trigger
          </button>
        </Tooltip>
      );

      const button = screen.getByTestId("aschild-blur");
      act(() => {
        button.focus();
      });

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      act(() => {
        button.blur();
      });

      expect(onBlur).toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });

    it("calls child's onKeyDown handler in asChild mode", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onKeyDown = vi.fn();

      render(
        <Tooltip content="KeyDown asChild" asChild defaultOpen>
          <button data-testid="aschild-keydown" onKeyDown={onKeyDown}>
            Trigger
          </button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      const button = screen.getByTestId("aschild-keydown");
      act(() => {
        button.focus();
      });

      // Any key but Escape: while the tooltip is open it takes Escape at the
      // window, ahead of everything (close-on-escape contract), so the child's
      // handler sees Escape only once the tooltip has closed. The composition
      // this test guards is that the child's own handler still runs.
      await user.keyboard("a");

      expect(onKeyDown).toHaveBeenCalled();

      await user.keyboard("{Escape}");
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("calls child's onTouchStart and onTouchEnd in asChild mode", () => {
      const onTouchStart = vi.fn();
      const onTouchEnd = vi.fn();

      render(
        <Tooltip content="Touch asChild" asChild delayDuration={0}>
          <button
            data-testid="aschild-touch"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            Trigger
          </button>
        </Tooltip>
      );

      const button = screen.getByTestId("aschild-touch");

      act(() => {
        button.dispatchEvent(new Event("touchstart", { bubbles: true }));
      });
      expect(onTouchStart).toHaveBeenCalled();

      act(() => {
        button.dispatchEvent(new Event("touchend", { bubbles: true }));
      });
      expect(onTouchEnd).toHaveBeenCalled();
    });
  });

  describe("Arrow positioning for different sides", () => {
    it("renders arrow for side='bottom'", async () => {
      render(
        <Tooltip content="Bottom tooltip" side="bottom" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        const arrow = tooltip.querySelector("svg");
        expect(arrow).toBeInTheDocument();
      });
    });

    it("renders arrow for side='left'", async () => {
      render(
        <Tooltip content="Left tooltip" side="left" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        const arrow = tooltip.querySelector("svg");
        expect(arrow).toBeInTheDocument();
      });
    });

    it("renders arrow for side='right'", async () => {
      render(
        <Tooltip content="Right tooltip" side="right" defaultOpen>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        const arrow = tooltip.querySelector("svg");
        expect(arrow).toBeInTheDocument();
      });
    });
  });

  describe("HideDelayDuration", () => {
    it("respects custom hideDelayDuration", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Custom hide delay" delayDuration={0} hideDelayDuration={500}>
          <button>Trigger</button>
        </Tooltip>
      );

      await user.hover(screen.getByText("Trigger"));

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      await user.unhover(screen.getByText("Trigger"));

      // After 200ms it should still be visible (hideDelay is 500ms)
      await act(async () => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });
  });
});

import { computeForSide, wouldOverflow, calculatePosition } from "../utils/helpers.js";

import { setReducedMotion } from "../../../test/matchMedia.js";

// The stub answers nothing by default, so every file that renders a
// motion-aware component states the preference it is testing under.
beforeEach(() => setReducedMotion(false));

function makeDOMRect(x: number, y: number, width: number, height: number): DOMRect {
  return {
    x, y, width, height,
    top: y, left: x, right: x + width, bottom: y + height,
    toJSON() {},
  };
}

describe("computeForSide", () => {
  const trigger = makeDOMRect(100, 100, 80, 30);
  const tooltip = makeDOMRect(0, 0, 120, 40);

  it("computes top positioning", () => {
    const result = computeForSide(trigger, tooltip, "top", "center", 6, 0);
    expect(result.top).toBe(100 - 40 - 6);
    expect(result.arrowRotation).toBe(180);
    expect(result.arrowLeft).toBeDefined();
  });

  it("computes bottom positioning", () => {
    const result = computeForSide(trigger, tooltip, "bottom", "center", 6, 0);
    expect(result.top).toBe(130 + 6);
    expect(result.arrowRotation).toBe(0);
  });

  it("computes left positioning", () => {
    const result = computeForSide(trigger, tooltip, "left", "center", 6, 0);
    expect(result.x).toBe(100 - 120 - 6);
    expect(result.arrowRotation).toBe(90);
    expect(result.arrowTop).toBeDefined();
  });

  it("computes right positioning", () => {
    const result = computeForSide(trigger, tooltip, "right", "center", 6, 0);
    expect(result.x).toBe(180 + 6);
    expect(result.arrowRotation).toBe(-90);
  });

  it("computes start alignment for horizontal sides", () => {
    const result = computeForSide(trigger, tooltip, "top", "start", 6, 10);
    expect(result.x).toBe(100 + 10);
  });

  it("computes end alignment for horizontal sides", () => {
    const result = computeForSide(trigger, tooltip, "top", "end", 6, 0);
    expect(result.x).toBe(180 - 120);
  });

  it("computes start alignment for vertical sides", () => {
    const result = computeForSide(trigger, tooltip, "left", "start", 6, 5);
    expect(result.top).toBe(100 + 5);
  });

  it("computes end alignment for vertical sides", () => {
    const result = computeForSide(trigger, tooltip, "left", "end", 6, 0);
    expect(result.top).toBe(130 - 40);
  });
});

describe("wouldOverflow", () => {
  const tooltip = makeDOMRect(0, 0, 100, 40);

  it("returns false when fully within viewport", () => {
    expect(wouldOverflow(50, 50, tooltip, 800, 600, 8)).toBe(false);
  });

  it("returns true when left is less than padding", () => {
    expect(wouldOverflow(50, 5, tooltip, 800, 600, 8)).toBe(true);
  });

  it("returns true when top is less than padding", () => {
    expect(wouldOverflow(5, 50, tooltip, 800, 600, 8)).toBe(true);
  });

  it("returns true when right edge exceeds viewport", () => {
    expect(wouldOverflow(50, 710, tooltip, 800, 600, 8)).toBe(true);
  });

  it("returns true when bottom edge exceeds viewport", () => {
    expect(wouldOverflow(570, 50, tooltip, 800, 600, 8)).toBe(true);
  });
});

describe("calculatePosition", () => {
  // Mock window dimensions for jsdom
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { value: 800, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 600, configurable: true });
  });

  const trigger = makeDOMRect(100, 100, 80, 30);
  const tooltip = makeDOMRect(0, 0, 120, 40);

  it("returns position with resolvedSide", () => {
    const pos = calculatePosition(trigger, tooltip, "top", "center", 6, 0);
    expect(pos.resolvedSide).toBeDefined();
    expect(pos.top).toBeDefined();
    expect(pos.inlineStart).toBeDefined();
  });

  it("clamps left to padding when positioned too far left", () => {
    const edgeTrigger = makeDOMRect(5, 100, 20, 30);
    const pos = calculatePosition(edgeTrigger, tooltip, "top", "center", 6, 0);
    expect(pos.inlineStart).toBeGreaterThanOrEqual(8);
  });

  it("clamps top to padding when positioned too high", () => {
    const edgeTrigger = makeDOMRect(100, 5, 80, 30);
    const pos = calculatePosition(edgeTrigger, tooltip, "top", "center", 6, 0);
    expect(pos.top).toBeGreaterThanOrEqual(8);
  });

  it("adjusts arrowLeft when left is clamped", () => {
    const edgeTrigger = makeDOMRect(5, 200, 20, 30);
    const pos = calculatePosition(edgeTrigger, tooltip, "top", "center", 6, 0);
    if (pos.arrowLeft !== undefined) {
      expect(pos.arrowLeft).toBeGreaterThanOrEqual(12);
      expect(pos.arrowLeft).toBeLessThanOrEqual(120 - 12);
    }
  });

  it("adjusts arrowTop when positioned on left side and top is clamped", () => {
    const edgeTrigger = makeDOMRect(200, 5, 80, 30);
    const pos = calculatePosition(edgeTrigger, tooltip, "left", "center", 6, 0);
    if (pos.arrowTop !== undefined) {
      expect(pos.arrowTop).toBeGreaterThanOrEqual(12);
      expect(pos.arrowTop).toBeLessThanOrEqual(40 - 12);
    }
  });

  it("flips side when primary side would overflow", () => {
    // Trigger at very top of viewport - "top" placement should flip to "bottom"
    const topTrigger = makeDOMRect(100, 0, 80, 30);
    const pos = calculatePosition(topTrigger, tooltip, "top", "center", 6, 0);
    expect(pos.resolvedSide).toBe("bottom");
  });

  it("adjusts right edge clamping with arrowLeft", () => {
    const rightTrigger = makeDOMRect(750, 200, 40, 30);
    const pos = calculatePosition(rightTrigger, tooltip, "bottom", "center", 6, 0);
    expect(pos.inlineStart).toBeLessThanOrEqual(800 - 8 - 120);
  });

  it("adjusts bottom edge clamping with arrowTop", () => {
    const bottomTrigger = makeDOMRect(200, 580, 80, 30);
    const pos = calculatePosition(bottomTrigger, tooltip, "right", "center", 6, 0);
    expect(pos.top).toBeLessThanOrEqual(600 - 8 - 40);
  });
});

describe("align in right-to-left", () => {
  const trigger = makeDOMRect(100, 100, 80, 30);
  const tooltip = makeDOMRect(0, 0, 120, 40);

  it("start aligns the right edges, end the left edges", () => {
    expect(computeForSide(trigger, tooltip, "bottom", "start", 6, 0, true).x).toBe(180 - 120);
    expect(computeForSide(trigger, tooltip, "bottom", "end", 6, 0, true).x).toBe(100);
    expect(computeForSide(trigger, tooltip, "top", "start", 6, 0, true).x).toBe(180 - 120);
  });

  it("keeps left-to-right start and end where they were", () => {
    expect(computeForSide(trigger, tooltip, "bottom", "start", 6, 0).x).toBe(100);
    expect(computeForSide(trigger, tooltip, "bottom", "end", 6, 0).x).toBe(180 - 120);
  });

  it("moves alignOffset toward the inline end", () => {
    expect(computeForSide(trigger, tooltip, "bottom", "start", 6, 10, true).x).toBe(180 - 120 - 10);
    expect(computeForSide(trigger, tooltip, "bottom", "center", 6, 10, true).x).toBe(100 + (80 - 120) / 2 - 10);
  });

  it("keeps the arrow on the trigger's centre", () => {
    const result = computeForSide(trigger, tooltip, "bottom", "start", 6, 0, true);
    expect(result.arrowLeft).toBe(140 - (180 - 120));
  });

  it("leaves the vertical axis of a side placement alone", () => {
    expect(computeForSide(trigger, tooltip, "right", "start", 6, 0, true)).toEqual(computeForSide(trigger, tooltip, "right", "start", 6, 0));
  });

  it("writes the offset from the right edge for a right-to-left tooltip", () => {
    const wide = makeDOMRect(400, 200, 80, 30);
    const extent = document.documentElement.clientWidth || window.innerWidth;
    const rtl = calculatePosition(wide, tooltip, "bottom", "start", 6, 0, true);
    expect(extent - rtl.inlineStart).toBe(480);
    const physical = calculatePosition(wide, tooltip, "bottom", "start", 6, 0, true, false);
    expect(physical.inlineStart).toBe(480 - 120);
  });
});

describe("Tooltip arrow sits on its anchor", () => {
  it("measures the arrow from inside the tooltip's border, where its absolute offset starts", async () => {
    const clientLeft = vi.spyOn(HTMLElement.prototype, "clientLeft", "get").mockReturnValue(1);
    render(
      <Tooltip content="Tip" defaultOpen showArrow>
        <button>Trigger</button>
      </Tooltip>,
    );
    await waitFor(() => expect(screen.getByRole("tooltip").querySelector("svg")?.style.left).toBe("5px"));
    clientLeft.mockRestore();
  });

  it("centres a side arrow on the trigger's midline: the rotated box's centre is half its height below its top", async () => {
    render(
      <Tooltip content="Tip" defaultOpen showArrow side="right">
        <button>Trigger</button>
      </Tooltip>,
    );
    await waitFor(() => expect(screen.getByRole("tooltip").querySelector("svg")?.style.top).toBe("9px"));
  });
});
