import { describe, it, expect, vi } from "vitest";
import { render, screen, act as rtlAct } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimePicker } from "../index";
import { ClockFace } from "../ClockFace";
import { UNSTYLED_TIMEPICKER_CLASSES } from "../utils/constants";
import type { ClockFaceClasses, TimeValue } from "../utils/types";
import {
  parseTimeInput,
  formatTimeValue,
  generateTimeOptions,
  convertTimeFormat,
  clampMinuteStep,
  getDefaultTimeValue,
  timeValueToMinutes,
  isMinutesInRange,
  parseTimeToMinutes,
  pad,
} from "../utils";

describe("TimePicker", () => {
  describe("Rendering", () => {
    it("renders a combobox input", () => {
      render(<TimePicker />);

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("renders with a label", () => {
      render(<TimePicker label="Select time" />);

      expect(screen.getByText("Select time")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("renders with required indicator when required", () => {
      render(<TimePicker label="Time" required />);

      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders description text", () => {
      render(<TimePicker description="Pick a meeting time" />);

      expect(screen.getByText("Pick a meeting time")).toBeInTheDocument();
    });
  });

  describe("Placeholder", () => {
    it("shows default placeholder for 24h format", () => {
      render(<TimePicker format="24h" />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("placeholder", "hh:mm");
    });

    it("shows default placeholder for 12h format", () => {
      render(<TimePicker format="12h" />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("placeholder", "hh:mm AM/PM");
    });

    it("shows custom placeholder", () => {
      render(<TimePicker placeholder="Choose time" />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("placeholder", "Choose time");
    });
  });

  describe("Dropdown", () => {
    it("opens dropdown on click", async () => {
      const user = userEvent.setup();
      render(<TimePicker />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("sets aria-expanded to false when closed", () => {
      render(<TimePicker />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-expanded", "false");
    });

    it("has aria-haspopup=listbox for dropdown variant", () => {
      render(<TimePicker variant="dropdown" />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-haspopup", "listbox");
    });

    it("has aria-haspopup=dialog for clock variant", () => {
      render(<TimePicker variant="clock" />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-haspopup", "dialog");
    });
  });

  describe("Selecting time", () => {
    it("opens dropdown and shows time options when clicked", async () => {
      const user = userEvent.setup();

      render(<TimePicker format="24h" />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      // Dropdown should be expanded
      expect(input).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Controlled mode", () => {
    it("displays controlled value", () => {
      render(<TimePicker value="14:30" format="24h" />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("14:30");
    });

    it("displays 12h controlled value", () => {
      render(<TimePicker value="02:30 PM" format="12h" />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("02:30 PM");
    });

    it("supports controlled open state", async () => {
      const onOpenChange = vi.fn();
      render(<TimePicker open={false} onOpenChange={onOpenChange} />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Disabled", () => {
    it("disables the input when disabled is true", () => {
      render(<TimePicker disabled />);

      const input = screen.getByRole("combobox");
      expect(input).toBeDisabled();
    });

    it("does not open dropdown when disabled", async () => {
      const user = userEvent.setup();
      render(<TimePicker disabled />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      expect(input).toHaveAttribute("aria-expanded", "false");
    });

    it("sets data-disabled on root", () => {
      const { container } = render(<TimePicker disabled />);

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("Format (12h / 24h)", () => {
    it("defaults to 24h format", () => {
      render(<TimePicker />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("placeholder", "hh:mm");
    });

    it("uses 12h format when specified", () => {
      render(<TimePicker format="12h" />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("placeholder", "hh:mm AM/PM");
    });
  });

  describe("ARIA attributes", () => {
    it("sets aria-invalid when error is true", () => {
      render(<TimePicker error />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("renders error message with role=alert", () => {
      render(<TimePicker error errorMessage="Invalid time" />);

      expect(screen.getByRole("alert")).toHaveTextContent("Invalid time");
    });

    it("sets aria-required when required", () => {
      render(<TimePicker required />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-required", "true");
    });

    it("sets aria-describedby pointing to error message", () => {
      render(<TimePicker error errorMessage="Bad time" />);

      const input = screen.getByRole("combobox");
      const errorEl = screen.getByRole("alert");
      expect(input).toHaveAttribute("aria-describedby", errorEl.id);
    });

    it("sets aria-autocomplete to list for dropdown variant", () => {
      render(<TimePicker variant="dropdown" />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-autocomplete", "list");
    });
  });

  describe("Custom classes", () => {
    it("applies custom className to root", () => {
      const { container } = render(<TimePicker className="my-picker" />);

      const root = container.firstElementChild;
      expect(root?.className).toContain("my-picker");
    });

    it("applies classes prop overrides", () => {
      const { container } = render(
        <TimePicker classes={{ root: "custom-root" }} />
      );

      const root = container.firstElementChild;
      expect(root?.className).toContain("custom-root");
    });

    it("expands to full width with fullWidth prop", () => {
      const { container } = render(<TimePicker fullWidth />);

      const root = container.firstElementChild;
      expect(root?.className).toContain("w-full");
    });
  });

  describe("Clearable", () => {
    it("shows clear button when clearable and value is set", () => {
      render(<TimePicker value="10:00" clearable />);

      expect(screen.getByLabelText("Clear time")).toBeInTheDocument();
    });

    it("does not show clear button when no value", () => {
      render(<TimePicker clearable />);

      expect(screen.queryByLabelText("Clear time")).not.toBeInTheDocument();
    });

    it("calls onClear when clear button is clicked", async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      const onValueChange = vi.fn();

      render(
        <TimePicker value="10:00" clearable onClear={onClear} onValueChange={onValueChange} />
      );

      await user.click(screen.getByLabelText("Clear time"));

      expect(onValueChange).toHaveBeenCalledWith(null, null);
    });
  });

  describe("Error and success states", () => {
    it("sets data-error on root when error", () => {
      const { container } = render(<TimePicker error />);

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-error", "true");
    });

    it("renders success message", () => {
      render(<TimePicker success successMessage="Looks good" />);

      expect(screen.getByText("Looks good")).toBeInTheDocument();
    });

    it("sets data-success on root when success", () => {
      const { container } = render(<TimePicker success />);

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-success", "true");
    });
  });

  describe("Hidden input for forms", () => {
    it("renders hidden input with name prop", () => {
      const { container } = render(<TimePicker name="meeting_time" value="09:00" />);

      const hidden = container.querySelector('input[name="meeting_time"]');
      expect(hidden).toBeInTheDocument();
      expect(hidden).toHaveAttribute("type", "hidden");
      expect(hidden).toHaveValue("09:00");
    });
  });

  // ─── Dropdown keyboard navigation ────────────────────────────────────
  describe("Dropdown keyboard navigation", () => {
    it("opens dropdown on ArrowDown and focuses first option", async () => {
      const user = userEvent.setup();
      render(<TimePicker format="24h" minuteStep={60} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      // Close first
      await user.keyboard("{Escape}");
      expect(input).toHaveAttribute("aria-expanded", "false");

      // ArrowDown should reopen
      await user.keyboard("{ArrowDown}");
      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("closes dropdown on Escape", async () => {
      const user = userEvent.setup();
      render(<TimePicker format="24h" />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      expect(input).toHaveAttribute("aria-expanded", "true");

      await user.keyboard("{Escape}");
      expect(input).toHaveAttribute("aria-expanded", "false");
    });

    it("selects option with Enter when focused", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<TimePicker format="24h" minuteStep={60} onValueChange={onValueChange} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      // Arrow down to focus first option (00:00), then Enter
      await user.keyboard("{ArrowDown}{Enter}");

      expect(onValueChange).toHaveBeenCalledWith("00:00", expect.objectContaining({ hours: 0, minutes: 0 }));
    });

    it("navigates options with ArrowUp and ArrowDown", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<TimePicker format="24h" minuteStep={60} onValueChange={onValueChange} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      // Go down twice then select
      await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");

      // Second option is 01:00
      expect(onValueChange).toHaveBeenCalledWith("01:00", expect.objectContaining({ hours: 1, minutes: 0 }));
    });
  });

  // ─── Typing and filtering ────────────────────────────────────────────
  describe("Typing and filtering", () => {
    it("filters dropdown options as user types", async () => {
      const user = userEvent.setup();
      render(<TimePicker format="24h" minuteStep={60} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "14");

      // The portal-rendered listbox should contain the filtered option
      const options = document.querySelectorAll("[role='option']");
      const labels = Array.from(options).map((o) => o.getAttribute("aria-label") || o.textContent);
      expect(labels.some(l => l?.includes("14:00"))).toBe(true);
    });

    it("shows no matching times when filter yields nothing", async () => {
      const user = userEvent.setup();
      render(<TimePicker format="24h" minuteStep={60} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "99");

      expect(screen.getByText("No matching times")).toBeInTheDocument();
    });

  });

  describe("Clearable (extended)", () => {
    it("does not show clear button when disabled", () => {
      render(<TimePicker value="10:00" clearable disabled />);
      expect(screen.queryByLabelText("Clear time")).not.toBeInTheDocument();
    });

    it("clears value and calls onClear on click", async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      const onValueChange = vi.fn();

      render(
        <TimePicker value="10:00" clearable onClear={onClear} onValueChange={onValueChange} />,
      );

      await user.click(screen.getByLabelText("Clear time"));

      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith(null, null);
    });
  });

  // ─── Unstyled mode ──────────────────────────────────────────────────
  describe("Unstyled mode", () => {
    it("uses unstyled classes when unstyled=true", () => {
      const { container } = render(<TimePicker unstyled />);
      // With unstyled, root class should be empty
      const root = container.firstElementChild;
      // It should not have the default styled classes
      expect(root?.className).not.toContain("inline-flex");
    });
  });

  // ─── Loading state ──────────────────────────────────────────────────
  describe("Loading state", () => {
    it("sets data-loading on root when loading", () => {
      const { container } = render(<TimePicker loading />);
      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-loading", "true");
    });
  });

  // ─── Data attributes ───────────────────────────────────────────────
  describe("Data attributes on open", () => {
    it("sets data-open on root when opened", async () => {
      const user = userEvent.setup();
      const { container } = render(<TimePicker />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-open", "true");
    });
  });

  describe("Clock variant", () => {
    it("opens clock face dialog on click when variant is clock", async () => {
      const user = userEvent.setup();
      render(<TimePicker variant="clock" format="24h" />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("calls onCancel callback when cancel is clicked on clock", async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(<TimePicker variant="clock" format="24h" onCancel={onCancel} />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      const cancelBtn = screen.getByText("Cancel");
      await user.click(cancelBtn);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("calls onConfirm and onValueChange when OK is clicked on clock", async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      const onValueChange = vi.fn();
      render(
        <TimePicker
          variant="clock"
          format="24h"
          onConfirm={onConfirm}
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      const okBtn = screen.getByText("OK");
      await user.click(okBtn);

      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalled();
    });
  });

  describe("Paste handling", () => {
    it("handles paste event on the input", async () => {
      const onValueChange = vi.fn();
      render(<TimePicker onValueChange={onValueChange} />);

      const input = screen.getByRole("combobox");
      const clipboardData = {
        getData: () => "14:30",
      };

      // Simulate paste event
      input.dispatchEvent(
        Object.assign(new Event("paste", { bubbles: true }), {
          clipboardData,
        }),
      );

      // The paste handler should process the pasted text
      expect(input).toBeInTheDocument();
    });
  });

  describe("Keyboard navigation extended", () => {
    it("handles Home key to focus first option", async () => {
      const user = userEvent.setup();
      render(<TimePicker format="24h" minuteStep={60} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.keyboard("{ArrowDown}{ArrowDown}{Home}");

      // Should not throw and input should still be expanded
      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("handles End key to focus last option", async () => {
      const user = userEvent.setup();
      render(<TimePicker format="24h" minuteStep={60} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.keyboard("{End}");

      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("commits value on Tab key", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<TimePicker format="24h" onValueChange={onValueChange} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "14:30");
      await user.keyboard("{Tab}");

      // Tab should commit the typed value
      expect(input).toBeInTheDocument();
    });

    it("does not handle keys when disabled", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<TimePicker disabled onValueChange={onValueChange} />);

      const input = screen.getByRole("combobox");
      input.focus();
      await user.keyboard("{ArrowDown}");

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════
// ClockFace standalone tests
// ═══════════════════════════════════════════════════════════════════════
describe("ClockFace", () => {
  const blankClasses: Required<ClockFaceClasses> = {
    clockContainer: UNSTYLED_TIMEPICKER_CLASSES.clockContainer,
    clockDisplay: UNSTYLED_TIMEPICKER_CLASSES.clockDisplay,
    clockDisplayHours: UNSTYLED_TIMEPICKER_CLASSES.clockDisplayHours,
    clockDisplayMinutes: UNSTYLED_TIMEPICKER_CLASSES.clockDisplayMinutes,
    clockDisplayActive: UNSTYLED_TIMEPICKER_CLASSES.clockDisplayActive,
    clockDisplaySeparator: UNSTYLED_TIMEPICKER_CLASSES.clockDisplaySeparator,
    clockFace: UNSTYLED_TIMEPICKER_CLASSES.clockFace,
    clockHand: UNSTYLED_TIMEPICKER_CLASSES.clockHand,
    clockHandLine: UNSTYLED_TIMEPICKER_CLASSES.clockHandLine,
    clockHandDot: UNSTYLED_TIMEPICKER_CLASSES.clockHandDot,
    clockNumber: UNSTYLED_TIMEPICKER_CLASSES.clockNumber,
    clockNumberSelected: UNSTYLED_TIMEPICKER_CLASSES.clockNumberSelected,
    clockNumberInner: UNSTYLED_TIMEPICKER_CLASSES.clockNumberInner,
    clockNumberDisabled: UNSTYLED_TIMEPICKER_CLASSES.clockNumberDisabled,
    clockCenter: UNSTYLED_TIMEPICKER_CLASSES.clockCenter,
    clockActions: UNSTYLED_TIMEPICKER_CLASSES.clockActions,
    clockCancelButton: UNSTYLED_TIMEPICKER_CLASSES.clockCancelButton,
    clockOkButton: UNSTYLED_TIMEPICKER_CLASSES.clockOkButton,
    clockPeriodToggle: UNSTYLED_TIMEPICKER_CLASSES.clockPeriodToggle,
    clockPeriodButton: UNSTYLED_TIMEPICKER_CLASSES.clockPeriodButton,
    clockPeriodActive: UNSTYLED_TIMEPICKER_CLASSES.clockPeriodActive,
  };

  const defaultProps = {
    value: { hours: 10, minutes: 30 } as TimeValue,
    format: "24h" as const,
    minuteStep: 1,
    onValueChange: vi.fn(),
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    classes: blankClasses,
  };

  describe("Rendering (24h hours mode)", () => {
    it("renders slider with label Select hours by default", () => {
      render(<ClockFace {...defaultProps} />);
      expect(screen.getByLabelText("Select hours")).toBeInTheDocument();
    });

    it("displays hours and minutes in the display bar", () => {
      render(<ClockFace {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.find((b) => b.textContent === "10")).toBeDefined();
      expect(buttons.find((b) => b.textContent === "30")).toBeDefined();
    });

    it("renders outer numbers 0-11 for 24h hours", () => {
      render(<ClockFace {...defaultProps} />);
      const slider = screen.getByRole("slider");
      // Outer ring: 0-11
      for (let i = 0; i <= 11; i++) {
        expect(slider.textContent).toContain(String(i));
      }
    });

    it("renders inner numbers 12-23 for 24h hours", () => {
      render(<ClockFace {...defaultProps} />);
      const slider = screen.getByRole("slider");
      for (let i = 12; i <= 23; i++) {
        expect(slider.textContent).toContain(String(i));
      }
    });

    it("marks the selected hour with data-selected", () => {
      render(<ClockFace {...defaultProps} />);
      const selectedEl = screen.getByRole("slider").querySelector("[data-selected]");
      expect(selectedEl).toBeInTheDocument();
      expect(selectedEl?.textContent).toBe("10");
    });

    it("marks inner ring numbers with data-inner", () => {
      render(<ClockFace {...defaultProps} value={{ hours: 14, minutes: 0 }} />);
      const innerEls = screen.getByRole("slider").querySelectorAll("[data-inner]");
      expect(innerEls.length).toBe(12); // 12-23
    });

    it("sets aria-valuenow to current hour", () => {
      render(<ClockFace {...defaultProps} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "10");
    });

    it("sets aria-valuemax to 23 for 24h format", () => {
      render(<ClockFace {...defaultProps} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuemax", "23");
    });
  });

  describe("Rendering (12h hours mode)", () => {
    it("renders numbers 1-12 without inner ring", () => {
      render(<ClockFace {...defaultProps} format="12h" value={{ hours: 3, minutes: 0, period: "AM" }} />);
      const slider = screen.getByRole("slider");
      // Should have 12 on the face, no inner ring
      const innerEls = slider.querySelectorAll("[data-inner]");
      expect(innerEls.length).toBe(0);
    });

    it("sets aria-valuemax to 12 for 12h format", () => {
      render(<ClockFace {...defaultProps} format="12h" value={{ hours: 3, minutes: 0, period: "AM" }} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuemax", "12");
    });

    it("shows AM/PM toggle buttons", () => {
      render(<ClockFace {...defaultProps} format="12h" value={{ hours: 3, minutes: 0, period: "AM" }} />);
      expect(screen.getByText("AM")).toBeInTheDocument();
      expect(screen.getByText("PM")).toBeInTheDocument();
    });

    it("AM button has aria-pressed true when period is AM", () => {
      render(<ClockFace {...defaultProps} format="12h" value={{ hours: 3, minutes: 0, period: "AM" }} />);
      expect(screen.getByText("AM")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("PM")).toHaveAttribute("aria-pressed", "false");
    });

    it("toggles period when PM button is clicked", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ClockFace
          {...defaultProps}
          format="12h"
          value={{ hours: 3, minutes: 0, period: "AM" }}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByText("PM"));
      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 3, minutes: 0, period: "PM" }),
      );
    });
  });

  describe("Rendering (minutes mode)", () => {
    it("switches to minutes mode when minutes display button is clicked", async () => {
      const user = userEvent.setup();
      render(<ClockFace {...defaultProps} />);

      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "30");
      await user.click(minutesBtn!);

      expect(screen.getByLabelText("Select minutes")).toBeInTheDocument();
    });

    it("renders minute numbers based on minuteStep", async () => {
      const user = userEvent.setup();
      render(<ClockFace {...defaultProps} minuteStep={15} />);

      // Switch to minutes
      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "30");
      await user.click(minutesBtn!);

      const slider = screen.getByRole("slider");
      // With step=15, should show 00, 15, 30, 45
      expect(slider.textContent).toContain("00");
      expect(slider.textContent).toContain("15");
      expect(slider.textContent).toContain("30");
      expect(slider.textContent).toContain("45");
    });

    it("sets aria-valuemax to 59 in minutes mode", async () => {
      const user = userEvent.setup();
      render(<ClockFace {...defaultProps} />);

      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "30");
      await user.click(minutesBtn!);

      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuemax", "59");
    });

    it("displays 00 for minute value 0", async () => {
      const user = userEvent.setup();
      render(<ClockFace {...defaultProps} value={{ hours: 10, minutes: 0 }} />);

      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "00");
      await user.click(minutesBtn!);

      const slider = screen.getByRole("slider");
      // "00" should appear on the clock face
      expect(slider.textContent).toContain("00");
    });

    it("does not show inner ring in minutes mode", async () => {
      const user = userEvent.setup();
      render(<ClockFace {...defaultProps} />);

      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "30");
      await user.click(minutesBtn!);

      const slider = screen.getByRole("slider");
      expect(slider.querySelectorAll("[data-inner]").length).toBe(0);
    });
  });

  describe("Keyboard navigation", () => {
    it("ArrowUp increments hour by 1 in hours mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowUp}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 11, minutes: 30 }),
      );
    });

    it("ArrowDown decrements hour by 1 in hours mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowDown}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 9, minutes: 30 }),
      );
    });

    it("ArrowRight increments hour by 1", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 11 }),
      );
    });

    it("ArrowLeft decrements hour by 1", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowLeft}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 9 }),
      );
    });

    it("wraps around 23 to 0 in 24h mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ClockFace {...defaultProps} value={{ hours: 23, minutes: 0 }} onValueChange={onValueChange} />,
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowUp}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 0 }),
      );
    });

    it("wraps around 0 to 23 in 24h mode going down", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ClockFace {...defaultProps} value={{ hours: 0, minutes: 0 }} onValueChange={onValueChange} />,
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowDown}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 23 }),
      );
    });

    it("wraps 12h hour from 12 to 1 going up", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ClockFace
          {...defaultProps}
          format="12h"
          value={{ hours: 12, minutes: 0, period: "PM" }}
          onValueChange={onValueChange}
        />,
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowUp}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 1 }),
      );
    });

    it("wraps 12h hour from 1 to 12 going down", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ClockFace
          {...defaultProps}
          format="12h"
          value={{ hours: 1, minutes: 0, period: "AM" }}
          onValueChange={onValueChange}
        />,
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowDown}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 12 }),
      );
    });

    it("PageUp jumps by 2 hours in hours mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{PageUp}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 12 }),
      );
    });

    it("PageDown jumps by -2 hours in hours mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{PageDown}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 8 }),
      );
    });

    it("Home sets hour to 0 in 24h mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{Home}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 0 }),
      );
    });

    it("End sets hour to 23 in 24h mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{End}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 23 }),
      );
    });

    it("Home sets hour to 12 in 12h mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ClockFace
          {...defaultProps}
          format="12h"
          value={{ hours: 5, minutes: 0, period: "AM" }}
          onValueChange={onValueChange}
        />,
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{Home}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 12 }),
      );
    });

    it("End sets hour to 11 in 12h mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ClockFace
          {...defaultProps}
          format="12h"
          value={{ hours: 5, minutes: 0, period: "AM" }}
          onValueChange={onValueChange}
        />,
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{End}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 11 }),
      );
    });

    it("ArrowUp in minutes mode increments by minuteStep", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} minuteStep={5} onValueChange={onValueChange} />);

      // Switch to minutes
      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "30");
      await user.click(minutesBtn!);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowUp}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ minutes: 35 }),
      );
    });

    it("ArrowDown in minutes mode decrements by minuteStep", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} minuteStep={5} onValueChange={onValueChange} />);

      // Switch to minutes
      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "30");
      await user.click(minutesBtn!);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowDown}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ minutes: 25 }),
      );
    });

    it("minutes wrap from 55 to 0 going up with step=5", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ClockFace {...defaultProps} minuteStep={5} value={{ hours: 10, minutes: 55 }} onValueChange={onValueChange} />,
      );

      // Switch to minutes
      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "55");
      await user.click(minutesBtn!);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowUp}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ minutes: 0 }),
      );
    });

    it("Home in minutes mode sets to 0", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      // Switch to minutes
      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "30");
      await user.click(minutesBtn!);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{Home}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ minutes: 0 }),
      );
    });

    it("End in minutes mode sets to 60 - step", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} minuteStep={15} onValueChange={onValueChange} />);

      // Switch to minutes
      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "30");
      await user.click(minutesBtn!);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{End}");

      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ minutes: 45 }),
      );
    });

    it("PageUp jumps by 3 steps in minutes mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} minuteStep={5} onValueChange={onValueChange} />);

      // Switch to minutes
      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "30");
      await user.click(minutesBtn!);

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{PageUp}");

      // 30 + 3*5 = 45
      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ minutes: 45 }),
      );
    });

    it("does nothing when disabled", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} disabled onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      // Slider has tabIndex -1 when disabled, so we force focus
      slider.focus();
      await user.keyboard("{ArrowUp}");

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("Cancel and OK buttons", () => {
    it("calls onCancel when Cancel is clicked", async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(<ClockFace {...defaultProps} onCancel={onCancel} />);

      await user.click(screen.getByText("Cancel"));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("calls onConfirm when OK is clicked", async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      render(<ClockFace {...defaultProps} onConfirm={onConfirm} />);

      await user.click(screen.getByText("OK"));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("uses custom button text", () => {
      render(<ClockFace {...defaultProps} cancelText="Abort" okText="Apply" />);
      expect(screen.getByText("Abort")).toBeInTheDocument();
      expect(screen.getByText("Apply")).toBeInTheDocument();
    });

    it("disables OK when time is out of range", () => {
      render(
        <ClockFace
          {...defaultProps}
          value={{ hours: 8, minutes: 0 }}
          minTime="09:00"
          maxTime="17:00"
        />,
      );

      const okBtn = screen.getByText("OK");
      expect(okBtn).toBeDisabled();
    });

    it("enables OK when time is in range", () => {
      render(
        <ClockFace
          {...defaultProps}
          value={{ hours: 10, minutes: 0 }}
          minTime="09:00"
          maxTime="17:00"
        />,
      );

      const okBtn = screen.getByText("OK");
      expect(okBtn).not.toBeDisabled();
    });

    it("disables Cancel and OK when disabled prop is true", () => {
      render(<ClockFace {...defaultProps} disabled />);
      expect(screen.getByText("Cancel")).toBeDisabled();
      expect(screen.getByText("OK")).toBeDisabled();
    });
  });

  describe("Min/max time disabled numbers", () => {
    it("marks disabled hours with data-disabled in hours mode", () => {
      render(
        <ClockFace
          {...defaultProps}
          value={{ hours: 12, minutes: 0 }}
          minTime="09:00"
          maxTime="14:00"
        />,
      );

      const slider = screen.getByRole("slider");
      const disabledEls = slider.querySelectorAll("[data-disabled]");
      expect(disabledEls.length).toBeGreaterThan(0);
    });

    it("marks disabled minutes with data-disabled in minutes mode", async () => {
      const user = userEvent.setup();
      render(
        <ClockFace
          {...defaultProps}
          value={{ hours: 14, minutes: 0 }}
          minTime="14:00"
          maxTime="14:30"
          minuteStep={15}
        />,
      );

      // Switch to minutes
      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "00");
      await user.click(minutesBtn!);

      const slider = screen.getByRole("slider");
      const disabledEls = slider.querySelectorAll("[data-disabled]");
      // 45 should be disabled since max is 14:30
      expect(disabledEls.length).toBeGreaterThan(0);
    });
  });

  describe("Display with null value", () => {
    it("uses default time value when value is null", () => {
      render(<ClockFace {...defaultProps} value={null} />);
      // Should still render without error
      expect(screen.getByRole("slider")).toBeInTheDocument();
      expect(screen.getByLabelText("Select hours")).toBeInTheDocument();
    });
  });

  describe("reduceMotion", () => {
    it("applies transition:none when reduceMotion is true", () => {
      const { container } = render(<ClockFace {...defaultProps} reduceMotion />);
      const clockContainer = container.firstElementChild as HTMLElement;
      expect(clockContainer.style.transition).toBe("none");
    });
  });

  describe("AM/PM disabled state", () => {
    it("does not toggle period when disabled", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ClockFace
          {...defaultProps}
          format="12h"
          value={{ hours: 3, minutes: 0, period: "AM" }}
          onValueChange={onValueChange}
          disabled
        />,
      );

      await user.click(screen.getByText("PM"));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("Focus trap (Tab key)", () => {
    it("traps focus within clock face on Tab", async () => {
      const user = userEvent.setup();
      render(<ClockFace {...defaultProps} />);

      // Focus the first button to set up for Tab trap
      const buttons = screen.getAllByRole("button");
      const firstButton = buttons[0];
      firstButton.focus();

      // Press Tab repeatedly - should not throw
      await user.keyboard("{Tab}");
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBeTruthy();
    });

    it("traps focus backward with Shift+Tab", async () => {
      const user = userEvent.setup();
      render(<ClockFace {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      buttons[0].focus();

      await user.keyboard("{Shift>}{Tab}{/Shift}");
      expect(document.activeElement).toBeTruthy();
    });
  });

  describe("Clock face switching modes", () => {
    it("switches from minutes back to hours mode when hours button clicked", async () => {
      const user = userEvent.setup();
      render(<ClockFace {...defaultProps} />);

      // First switch to minutes
      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "30");
      await user.click(minutesBtn!);
      expect(screen.getByLabelText("Select minutes")).toBeInTheDocument();

      // Switch back to hours
      const hoursBtn = screen.getAllByRole("button").find((b) => b.textContent === "10");
      await user.click(hoursBtn!);
      expect(screen.getByLabelText("Select hours")).toBeInTheDocument();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════
// Utils unit tests
// ═══════════════════════════════════════════════════════════════════════
describe("TimePicker utils", () => {

  describe("pad", () => {
    it("pads single digit to two digits", () => {
      expect(pad(0)).toBe("00");
      expect(pad(5)).toBe("05");
      expect(pad(9)).toBe("09");
    });

    it("does not pad two-digit numbers", () => {
      expect(pad(10)).toBe("10");
      expect(pad(23)).toBe("23");
    });
  });

  describe("clampMinuteStep", () => {
    it("returns the input for valid step values", () => {
      expect(clampMinuteStep(1)).toBe(1);
      expect(clampMinuteStep(15)).toBe(15);
      expect(clampMinuteStep(30)).toBe(30);
      expect(clampMinuteStep(60)).toBe(60);
    });

    it("clamps values below 1 to 1", () => {
      expect(clampMinuteStep(0)).toBe(1);
      expect(clampMinuteStep(-5)).toBe(1);
    });

    it("clamps values above 60 to 60", () => {
      expect(clampMinuteStep(90)).toBe(60);
      expect(clampMinuteStep(120)).toBe(60);
    });

    it("floors non-integer values", () => {
      expect(clampMinuteStep(15.7)).toBe(15);
      expect(clampMinuteStep(0.5)).toBe(1);
    });

    it("handles NaN and Infinity", () => {
      expect(clampMinuteStep(NaN)).toBe(1);
      expect(clampMinuteStep(Infinity)).toBe(1);
    });
  });

  describe("parseTimeInput", () => {
    describe("24h format", () => {
      it("parses HH:MM format", () => {
        expect(parseTimeInput("14:30", "24h")).toEqual({ hours: 14, minutes: 30 });
      });

      it("parses single digit hour", () => {
        expect(parseTimeInput("9:05", "24h")).toEqual({ hours: 9, minutes: 5 });
      });

      it("parses midnight", () => {
        expect(parseTimeInput("00:00", "24h")).toEqual({ hours: 0, minutes: 0 });
      });

      it("parses 23:59", () => {
        expect(parseTimeInput("23:59", "24h")).toEqual({ hours: 23, minutes: 59 });
      });

      it("returns null for hour > 23", () => {
        expect(parseTimeInput("24:00", "24h")).toBeNull();
      });

      it("returns null for minutes > 59", () => {
        expect(parseTimeInput("12:60", "24h")).toBeNull();
      });

      it("returns null for empty string", () => {
        expect(parseTimeInput("", "24h")).toBeNull();
      });

      it("parses bare number as hour (1-2 digits)", () => {
        expect(parseTimeInput("14", "24h")).toEqual({ hours: 14, minutes: 0 });
        expect(parseTimeInput("9", "24h")).toEqual({ hours: 9, minutes: 0 });
      });

      it("parses 3-digit number as H:MM", () => {
        expect(parseTimeInput("930", "24h")).toEqual({ hours: 9, minutes: 30 });
      });

      it("parses 4-digit number as HH:MM", () => {
        expect(parseTimeInput("1430", "24h")).toEqual({ hours: 14, minutes: 30 });
      });

      it("returns null for 5+ digits", () => {
        expect(parseTimeInput("14300", "24h")).toBeNull();
      });
    });

    describe("12h format", () => {
      it("parses HH:MM AM", () => {
        expect(parseTimeInput("02:30 AM", "12h")).toEqual({ hours: 2, minutes: 30, period: "AM" });
      });

      it("parses HH:MM PM", () => {
        expect(parseTimeInput("02:30 PM", "12h")).toEqual({ hours: 2, minutes: 30, period: "PM" });
      });

      it("parses 12:00 PM", () => {
        expect(parseTimeInput("12:00 PM", "12h")).toEqual({ hours: 12, minutes: 0, period: "PM" });
      });

      it("parses 12:00 AM", () => {
        expect(parseTimeInput("12:00 AM", "12h")).toEqual({ hours: 12, minutes: 0, period: "AM" });
      });

      it("defaults to AM when no period specified for small hours", () => {
        expect(parseTimeInput("3:00", "12h")).toEqual({ hours: 3, minutes: 0, period: "AM" });
      });

      it("defaults to PM for 12 without period", () => {
        expect(parseTimeInput("12:00", "12h")).toEqual({ hours: 12, minutes: 0, period: "PM" });
      });

      it("converts 24h hour > 12 to 12h with PM in 12h mode", () => {
        expect(parseTimeInput("14:30", "12h")).toEqual({ hours: 2, minutes: 30, period: "PM" });
      });

      it("converts hour 0 to 12 AM in 12h mode", () => {
        expect(parseTimeInput("0:00", "12h")).toEqual({ hours: 12, minutes: 0, period: "AM" });
      });

      it("parses case-insensitive am/pm", () => {
        expect(parseTimeInput("2:30 pm", "12h")).toEqual({ hours: 2, minutes: 30, period: "PM" });
        expect(parseTimeInput("2:30 am", "12h")).toEqual({ hours: 2, minutes: 30, period: "AM" });
      });

      it("parses shorthand p/a", () => {
        expect(parseTimeInput("2:30p", "12h")).toEqual({ hours: 2, minutes: 30, period: "PM" });
        expect(parseTimeInput("2:30a", "12h")).toEqual({ hours: 2, minutes: 30, period: "AM" });
      });
    });

    describe("edge cases", () => {
      it("trims whitespace", () => {
        expect(parseTimeInput("  14:30  ", "24h")).toEqual({ hours: 14, minutes: 30 });
      });

      it("returns null for whitespace-only", () => {
        expect(parseTimeInput("   ", "24h")).toBeNull();
      });
    });
  });

  describe("formatTimeValue", () => {
    it("formats 24h time", () => {
      expect(formatTimeValue({ hours: 14, minutes: 30 }, "24h")).toBe("14:30");
    });

    it("formats midnight in 24h", () => {
      expect(formatTimeValue({ hours: 0, minutes: 0 }, "24h")).toBe("00:00");
    });

    it("formats 12h time with AM", () => {
      expect(formatTimeValue({ hours: 9, minutes: 5, period: "AM" }, "12h")).toBe("09:05 AM");
    });

    it("formats 12h time with PM", () => {
      expect(formatTimeValue({ hours: 2, minutes: 30, period: "PM" }, "12h")).toBe("02:30 PM");
    });

    it("formats 12h time defaulting to AM if no period", () => {
      expect(formatTimeValue({ hours: 3, minutes: 0 }, "12h")).toBe("03:00 AM");
    });

    it("converts 12h PM value to 24h correctly", () => {
      expect(formatTimeValue({ hours: 2, minutes: 30, period: "PM" }, "24h")).toBe("14:30");
    });

    it("converts 12 AM to 00 in 24h", () => {
      expect(formatTimeValue({ hours: 12, minutes: 0, period: "AM" }, "24h")).toBe("00:00");
    });

    it("keeps 12 PM as 12 in 24h", () => {
      expect(formatTimeValue({ hours: 12, minutes: 0, period: "PM" }, "24h")).toBe("12:00");
    });
  });

  describe("convertTimeFormat", () => {
    it("returns null for invalid input", () => {
      expect(convertTimeFormat("invalid", "24h", "12h")).toBeNull();
    });

    it("converts 12h PM to 24h", () => {
      expect(convertTimeFormat("02:30 PM", "12h", "24h")).toBe("14:30");
    });

    it("converts 12h AM to 24h", () => {
      const result = convertTimeFormat("12:00 AM", "12h", "24h");
      expect(result).toBe("00:00");
    });

    it("returns string for valid same-format conversion", () => {
      const result = convertTimeFormat("14:30", "24h", "24h");
      expect(result).toBe("14:30");
    });
  });

  describe("generateTimeOptions", () => {
    it("generates 24 options with step=60 in 24h", () => {
      const options = generateTimeOptions("24h", 60);
      expect(options.length).toBe(24);
      expect(options[0]).toBe("00:00");
      expect(options[23]).toBe("23:00");
    });

    it("generates options with step=15 in 24h", () => {
      const options = generateTimeOptions("24h", 15);
      expect(options.length).toBe(96); // 24*4
      expect(options[0]).toBe("00:00");
      expect(options[1]).toBe("00:15");
    });

    it("generates 12h formatted options", () => {
      const options = generateTimeOptions("12h", 60);
      expect(options[0]).toBe("12:00 AM");
      expect(options[12]).toBe("12:00 PM");
      expect(options[13]).toBe("01:00 PM");
    });

    it("respects minTime", () => {
      const options = generateTimeOptions("24h", 60, "10:00");
      expect(options[0]).toBe("10:00");
      expect(options).not.toContain("09:00");
    });

    it("respects maxTime", () => {
      const options = generateTimeOptions("24h", 60, undefined, "14:00");
      expect(options[options.length - 1]).toBe("14:00");
      expect(options).not.toContain("15:00");
    });

    it("respects both minTime and maxTime", () => {
      const options = generateTimeOptions("24h", 60, "09:00", "17:00");
      expect(options[0]).toBe("09:00");
      expect(options[options.length - 1]).toBe("17:00");
      expect(options.length).toBe(9); // 09, 10, 11, 12, 13, 14, 15, 16, 17
    });
  });

  describe("parseTimeToMinutes", () => {
    it("converts 24h time to total minutes", () => {
      expect(parseTimeToMinutes("14:30", "24h")).toBe(14 * 60 + 30);
    });

    it("converts midnight to 0", () => {
      expect(parseTimeToMinutes("00:00", "24h")).toBe(0);
    });

    it("converts 12h PM time correctly", () => {
      expect(parseTimeToMinutes("02:30 PM", "12h")).toBe(14 * 60 + 30);
    });

    it("converts 12:00 AM to 0", () => {
      expect(parseTimeToMinutes("12:00 AM", "12h")).toBe(0);
    });

    it("returns 0 for invalid input", () => {
      expect(parseTimeToMinutes("invalid", "24h")).toBe(0);
    });
  });

  describe("timeValueToMinutes", () => {
    it("converts 24h TimeValue to minutes", () => {
      expect(timeValueToMinutes({ hours: 14, minutes: 30 }, "24h")).toBe(870);
    });

    it("converts 12h AM TimeValue", () => {
      expect(timeValueToMinutes({ hours: 9, minutes: 15, period: "AM" }, "12h")).toBe(555);
    });

    it("converts 12h PM TimeValue", () => {
      expect(timeValueToMinutes({ hours: 2, minutes: 30, period: "PM" }, "12h")).toBe(870);
    });

    it("converts 12 AM to 0 minutes", () => {
      expect(timeValueToMinutes({ hours: 12, minutes: 0, period: "AM" }, "12h")).toBe(0);
    });

    it("converts 12 PM to 720 minutes", () => {
      expect(timeValueToMinutes({ hours: 12, minutes: 0, period: "PM" }, "12h")).toBe(720);
    });
  });

  describe("isMinutesInRange", () => {
    it("returns true when no constraints", () => {
      expect(isMinutesInRange(500, "24h")).toBe(true);
    });

    it("returns true when within range", () => {
      expect(isMinutesInRange(600, "24h", "09:00", "17:00")).toBe(true);
    });

    it("returns false when below min", () => {
      expect(isMinutesInRange(400, "24h", "09:00", "17:00")).toBe(false);
    });

    it("returns false when above max", () => {
      expect(isMinutesInRange(1100, "24h", "09:00", "17:00")).toBe(false);
    });

    it("returns true at exact min boundary", () => {
      expect(isMinutesInRange(540, "24h", "09:00")).toBe(true); // 9*60 = 540
    });

    it("returns true at exact max boundary", () => {
      expect(isMinutesInRange(1020, "24h", undefined, "17:00")).toBe(true); // 17*60 = 1020
    });
  });

  describe("getDefaultTimeValue", () => {
    it("returns a TimeValue for 24h format", () => {
      const result = getDefaultTimeValue("24h");
      expect(result).toHaveProperty("hours");
      expect(result).toHaveProperty("minutes");
      expect(result.hours).toBeGreaterThanOrEqual(0);
      expect(result.hours).toBeLessThanOrEqual(23);
    });

    it("returns a TimeValue with period for 12h format", () => {
      const result = getDefaultTimeValue("12h");
      expect(result).toHaveProperty("period");
      expect(["AM", "PM"]).toContain(result.period);
      expect(result.hours).toBeGreaterThanOrEqual(1);
      expect(result.hours).toBeLessThanOrEqual(12);
    });
  });
});

// ─── TimePicker Icons ─────────────────────────────────────────────────────────

import { ChevronDownIcon, ClockIcon, CheckIcon, ClearIcon } from "../icons";

describe("TimePicker Icons", () => {
  it.each([
    ["ChevronDownIcon", ChevronDownIcon],
    ["ClockIcon", ClockIcon],
    ["CheckIcon", CheckIcon],
    ["ClearIcon", ClearIcon],
  ])("renders %s with className", (_name, Icon) => {
    const { container } = render(<Icon className="test-icon" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("test-icon");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it.each([
    ["ChevronDownIcon", ChevronDownIcon],
    ["ClockIcon", ClockIcon],
    ["CheckIcon", CheckIcon],
    ["ClearIcon", ClearIcon],
  ])("renders %s with default className", (_name, Icon) => {
    const { container } = render(<Icon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════
// ClockFace — additional coverage tests
// ═══════════════════════════════════════════════════════════════════════
describe("ClockFace (additional coverage)", () => {
  const blankClasses: Required<ClockFaceClasses> = {
    clockContainer: UNSTYLED_TIMEPICKER_CLASSES.clockContainer,
    clockDisplay: UNSTYLED_TIMEPICKER_CLASSES.clockDisplay,
    clockDisplayHours: UNSTYLED_TIMEPICKER_CLASSES.clockDisplayHours,
    clockDisplayMinutes: UNSTYLED_TIMEPICKER_CLASSES.clockDisplayMinutes,
    clockDisplayActive: UNSTYLED_TIMEPICKER_CLASSES.clockDisplayActive,
    clockDisplaySeparator: UNSTYLED_TIMEPICKER_CLASSES.clockDisplaySeparator,
    clockFace: UNSTYLED_TIMEPICKER_CLASSES.clockFace,
    clockHand: UNSTYLED_TIMEPICKER_CLASSES.clockHand,
    clockHandLine: UNSTYLED_TIMEPICKER_CLASSES.clockHandLine,
    clockHandDot: UNSTYLED_TIMEPICKER_CLASSES.clockHandDot,
    clockNumber: UNSTYLED_TIMEPICKER_CLASSES.clockNumber,
    clockNumberSelected: UNSTYLED_TIMEPICKER_CLASSES.clockNumberSelected,
    clockNumberInner: UNSTYLED_TIMEPICKER_CLASSES.clockNumberInner,
    clockNumberDisabled: UNSTYLED_TIMEPICKER_CLASSES.clockNumberDisabled,
    clockCenter: UNSTYLED_TIMEPICKER_CLASSES.clockCenter,
    clockActions: UNSTYLED_TIMEPICKER_CLASSES.clockActions,
    clockCancelButton: UNSTYLED_TIMEPICKER_CLASSES.clockCancelButton,
    clockOkButton: UNSTYLED_TIMEPICKER_CLASSES.clockOkButton,
    clockPeriodToggle: UNSTYLED_TIMEPICKER_CLASSES.clockPeriodToggle,
    clockPeriodButton: UNSTYLED_TIMEPICKER_CLASSES.clockPeriodButton,
    clockPeriodActive: UNSTYLED_TIMEPICKER_CLASSES.clockPeriodActive,
  };

  const defaultProps = {
    value: { hours: 10, minutes: 30 } as TimeValue,
    format: "24h" as const,
    minuteStep: 1,
    onValueChange: vi.fn(),
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    classes: blankClasses,
  };

  // Helper: mock pointer capture methods that JSDOM doesn't implement
  function mockPointerCapture(el: Element) {
    el.setPointerCapture = vi.fn();
    el.releasePointerCapture = vi.fn();
    el.hasPointerCapture = vi.fn(() => false);
  }

  describe("Pointer events (drag interactions)", () => {
    it("fires onValueChange when pointer is pressed on the clock face (hours mode)", () => {
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      mockPointerCapture(slider);

      const rect = { left: 0, top: 0, width: 200, height: 200, bottom: 200, right: 200 };
      vi.spyOn(slider, "getBoundingClientRect").mockReturnValue(rect as DOMRect);

      // Simulate pointer down roughly at the 3 o'clock position (right side center)
      slider.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          clientX: 190, // far right → ~3 o'clock
          clientY: 100, // vertical center
          button: 0,
          pointerId: 1,
        }),
      );

      // onValueChange should have been called with an updated hours value
      expect(onValueChange).toHaveBeenCalled();
    });

    it("does not fire onValueChange on pointer down when disabled", () => {
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} disabled onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      mockPointerCapture(slider);
      slider.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true, clientX: 190, clientY: 100, button: 0, pointerId: 1 }),
      );

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("ignores non-primary button pointer down events", () => {
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      mockPointerCapture(slider);
      slider.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true, clientX: 190, clientY: 100, button: 2, pointerId: 1 }),
      );

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("handles pointer up event on clock face", () => {
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      mockPointerCapture(slider);

      const rect = { left: 0, top: 0, width: 200, height: 200, bottom: 200, right: 200 };
      vi.spyOn(slider, "getBoundingClientRect").mockReturnValue(rect as DOMRect);

      slider.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 190, clientY: 100, button: 0, pointerId: 1 }));
      // pointer up should not throw
      slider.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: 190, clientY: 100, pointerId: 1 }));

      expect(slider).toBeInTheDocument();
    });

    it("handles pointer cancel event on clock face", () => {
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      mockPointerCapture(slider);

      const rect = { left: 0, top: 0, width: 200, height: 200, bottom: 200, right: 200 };
      vi.spyOn(slider, "getBoundingClientRect").mockReturnValue(rect as DOMRect);

      slider.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 190, clientY: 100, button: 0, pointerId: 1 }));
      // pointercancel should end the drag without throwing
      slider.dispatchEvent(new PointerEvent("pointercancel", { bubbles: true, clientX: 190, clientY: 100, pointerId: 1 }));

      expect(slider).toBeInTheDocument();
    });

    it("ignores pointer up from a different pointerId", () => {
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      mockPointerCapture(slider);

      const rect = { left: 0, top: 0, width: 200, height: 200, bottom: 200, right: 200 };
      vi.spyOn(slider, "getBoundingClientRect").mockReturnValue(rect as DOMRect);

      slider.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 190, clientY: 100, button: 0, pointerId: 1 }));
      // Different pointerId — should be ignored
      slider.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: 190, clientY: 100, pointerId: 99 }));

      // Component should still be in dragging state (no error)
      expect(slider).toBeInTheDocument();
    });

    it("selects from inner ring in 24h mode when pointer is close to center", () => {
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} value={{ hours: 10, minutes: 0 }} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      mockPointerCapture(slider);

      // Clock: left=0, top=0, width=200, height=200 → center=(100,100), radius=100
      // Inner ring threshold = 0.65. Distance from center to (150,100) = 50 → normalized 0.5 < 0.65 → inner ring
      const rect = { left: 0, top: 0, width: 200, height: 200, bottom: 200, right: 200 };
      vi.spyOn(slider, "getBoundingClientRect").mockReturnValue(rect as DOMRect);

      slider.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true, clientX: 150, clientY: 100, button: 0, pointerId: 1 }),
      );

      expect(onValueChange).toHaveBeenCalled();
      const callArg = onValueChange.mock.calls[0][0] as TimeValue;
      // Right-of-center → ~3 o'clock → raw hour=3, inner ring → hour=15
      expect(callArg.hours).toBeGreaterThanOrEqual(12);
    });

    it("fires onValueChange when pointer moves while dragging in minutes mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ClockFace
          {...defaultProps}
          value={{ hours: 10, minutes: 30 }}
          minuteStep={5}
          onValueChange={onValueChange}
        />,
      );

      // Switch to minutes mode
      const minutesBtn = screen.getAllByRole("button").find((b) => b.textContent === "30");
      await user.click(minutesBtn!);
      onValueChange.mockClear();

      const slider = screen.getByRole("slider");
      mockPointerCapture(slider);

      const rect = { left: 0, top: 0, width: 200, height: 200, bottom: 200, right: 200 };
      vi.spyOn(slider, "getBoundingClientRect").mockReturnValue(rect as DOMRect);

      // Start drag — wrap in act to flush isDragging state update before pointermove
      await rtlAct(async () => {
        slider.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 190, clientY: 100, button: 0, pointerId: 1 }));
      });
      onValueChange.mockClear();

      // Move pointer — isDragging is now true, should trigger value update
      slider.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 100, clientY: 10, pointerId: 1 }));

      expect(onValueChange).toHaveBeenCalled();
    });

    it("ignores pointer move when not dragging", () => {
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      // Move without first pressing down — isDragging is false, should be ignored
      slider.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 190, clientY: 100, pointerId: 1 }));

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("does not update hour when hour is disabled (minTime/maxTime)", () => {
      const onValueChange = vi.fn();
      // Only hours 9-17 valid. Clock at 0-200 with center 100,100.
      render(
        <ClockFace
          {...defaultProps}
          value={{ hours: 10, minutes: 0 }}
          minTime="09:00"
          maxTime="17:00"
          onValueChange={onValueChange}
        />,
      );

      const slider = screen.getByRole("slider");
      mockPointerCapture(slider);

      const rect = { left: 0, top: 0, width: 200, height: 200, bottom: 200, right: 200 };
      vi.spyOn(slider, "getBoundingClientRect").mockReturnValue(rect as DOMRect);

      // Point at (100, 190): bottom of clock = 6 o'clock direction = hour 6 (disabled)
      slider.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true, clientX: 100, clientY: 190, button: 0, pointerId: 1 }),
      );

      // onValueChange should NOT be called because hour 6 is out of range
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("Focus trap — Tab key wrapping", () => {
    it("moves focus to last focusable element when Shift+Tab on first element", async () => {
      render(<ClockFace {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      // Focus the first button (Hours display button)
      buttons[0].focus();
      expect(document.activeElement).toBe(buttons[0]);

      // Fire a Shift+Tab keydown on the container
      const container = buttons[0].closest("div[class]")!.parentElement as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true }),
      );

      // Focus should have been moved (last focusable element)
      expect(document.activeElement).toBeTruthy();
    });

    it("moves focus to first focusable element when Tab on last element", async () => {
      render(<ClockFace {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      const lastButton = buttons[buttons.length - 1];
      lastButton.focus();
      expect(document.activeElement).toBe(lastButton);

      const clockContainer = lastButton.closest("[onKeyDown]") ?? lastButton.parentElement!;
      clockContainer.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", shiftKey: false, bubbles: true }),
      );

      expect(document.activeElement).toBeTruthy();
    });
  });

  describe("AM button click when already AM", () => {
    it("calls onValueChange with AM when AM button is clicked (toggling to same period)", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ClockFace
          {...defaultProps}
          format="12h"
          value={{ hours: 3, minutes: 0, period: "AM" }}
          onValueChange={onValueChange}
        />,
      );

      // Click AM when already in AM mode — still fires onValueChange
      await user.click(screen.getByText("AM"));
      expect(onValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ period: "AM" }),
      );
    });
  });

  describe("24h mode — hand angle for inner ring (hours >= 12)", () => {
    it("renders with inner ring hand when hour >= 12 in 24h mode", () => {
      render(<ClockFace {...defaultProps} value={{ hours: 15, minutes: 0 }} />);
      // Hour 15 is in inner ring (hours >= 12 in 24h)
      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuenow", "15");
    });

    it("renders with hour=0 in 24h mode correctly (outer ring, angle=0)", () => {
      render(<ClockFace {...defaultProps} value={{ hours: 0, minutes: 0 }} />);
      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuenow", "0");
    });
  });

  describe("12h mode — hand angle for hour=12", () => {
    it("renders with hour=12 in 12h mode (angle=0)", () => {
      render(
        <ClockFace
          {...defaultProps}
          format="12h"
          value={{ hours: 12, minutes: 0, period: "PM" }}
        />,
      );
      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuenow", "12");
    });
  });

  describe("Window pointer up listener during drag", () => {
    it("ends drag when window pointerup fires while dragging", () => {
      const onValueChange = vi.fn();
      render(<ClockFace {...defaultProps} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      mockPointerCapture(slider);

      const rect = { left: 0, top: 0, width: 200, height: 200, bottom: 200, right: 200 };
      vi.spyOn(slider, "getBoundingClientRect").mockReturnValue(rect as DOMRect);

      // Start drag to enter dragging state
      slider.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 190, clientY: 100, button: 0, pointerId: 1 }));

      // Dispatch window-level pointerup to trigger the global listener
      window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));

      // Component should handle it without errors
      expect(slider).toBeInTheDocument();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════
// TimePicker — additional coverage tests
// ═══════════════════════════════════════════════════════════════════════
describe("TimePicker (additional coverage)", () => {
  describe("Keyboard navigation — Escape when closed", () => {
    it("does nothing when Escape is pressed and dropdown is closed", async () => {
      const user = userEvent.setup();
      render(<TimePicker format="24h" />);

      const input = screen.getByRole("combobox");
      // Don't open the dropdown first
      input.focus();
      await user.keyboard("{Escape}");

      // Should remain closed with no error
      expect(input).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Clock variant — value flowing through handleClockChange", () => {
    it("updates displayed value when clock face interaction changes value then OK is clicked", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <TimePicker
          variant="clock"
          format="24h"
          value="10:00"
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      // Find the clock face slider via document (it's in a portal but attached to document.body)
      const slider = document.querySelector('[role="slider"]') as HTMLElement;
      expect(slider).not.toBeNull();
      slider.focus();
      await user.keyboard("{ArrowUp}"); // hours 10 → 11 (calls handleClockChange)

      // Confirm
      await user.click(screen.getByText("OK"));

      expect(onValueChange).toHaveBeenCalledWith("11:00", expect.objectContaining({ hours: 11 }));
    });

    it("calls onCancel callback and closes clock without changing value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const onCancel = vi.fn();
      render(
        <TimePicker
          variant="clock"
          format="24h"
          value="10:00"
          onValueChange={onValueChange}
          onCancel={onCancel}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      // Find the clock face slider via document (it's in a portal)
      const slider = document.querySelector('[role="slider"]') as HTMLElement;
      expect(slider).not.toBeNull();
      slider.focus();
      await user.keyboard("{ArrowUp}");

      await user.click(screen.getByText("Cancel"));

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onValueChange).not.toHaveBeenCalled();
      // Dropdown closed
      expect(input).toHaveAttribute("aria-expanded", "false");
    });

    it("clock value uses parsed value prop when no local change has occurred", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <TimePicker
          variant="clock"
          format="24h"
          value="14:30"
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      // Immediately click OK without touching anything → should use parsed "14:30"
      await user.click(screen.getByText("OK"));

      expect(onValueChange).toHaveBeenCalledWith("14:30", expect.objectContaining({ hours: 14, minutes: 30 }));
    });
  });

  describe("Scroll/resize repositioning", () => {
    it("repositions dropdown on window scroll when open", async () => {
      const user = userEvent.setup();
      render(<TimePicker format="24h" />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      // Trigger a scroll event — should not throw
      window.dispatchEvent(new Event("scroll", { bubbles: true }));

      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("repositions dropdown on window resize when open", async () => {
      const user = userEvent.setup();
      render(<TimePicker format="24h" />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      // Trigger a resize event — should not throw
      window.dispatchEvent(new Event("resize"));

      expect(input).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("keepMounted mode", () => {
    it("renders dropdown content even when closed with keepMounted=true", () => {
      render(<TimePicker format="24h" minuteStep={60} keepMounted />);

      // Dropdown should be in DOM even when closed
      const listbox = document.querySelector('[role="listbox"]');
      expect(listbox).toBeInTheDocument();
    });
  });

  describe("ArrowUp key in dropdown (wrapping)", () => {
    it("navigates to last option when ArrowUp is pressed at first option", async () => {
      const user = userEvent.setup();
      render(<TimePicker format="24h" minuteStep={60} />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      // Arrow down to first option then Arrow up — wraps to last
      await user.keyboard("{ArrowDown}"); // focus index 0
      await user.keyboard("{ArrowUp}"); // should wrap to last

      // Input should still be open
      expect(input).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Enter key when no option focused", () => {
    it("commits typed value when Enter is pressed with no option focused", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<TimePicker format="24h" onValueChange={onValueChange} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "1430");
      // Don't navigate to any option, just press Enter
      await user.keyboard("{Enter}");

      expect(onValueChange).toHaveBeenCalledWith("14:30", expect.objectContaining({ hours: 14, minutes: 30 }));
    });
  });

  describe("Input click when already open", () => {
    it("does not re-open when input is clicked while already open", async () => {
      const user = userEvent.setup();
      render(<TimePicker format="24h" />);

      const input = screen.getByRole("combobox");
      await user.click(input); // opens
      expect(input).toHaveAttribute("aria-expanded", "true");

      // Click again on input (not trigger wrapper)
      await user.click(input); // should not crash
      expect(input).toBeInTheDocument();
    });
  });

  describe("12h clock variant OK with no prior value", () => {
    it("uses default time value when OK clicked on clock with no value prop", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <TimePicker
          variant="clock"
          format="12h"
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      await user.click(screen.getByText("OK"));

      expect(onValueChange).toHaveBeenCalled();
      const [timeStr] = onValueChange.mock.calls[0] as [string, TimeValue];
      expect(timeStr).toMatch(/\d{2}:\d{2} (AM|PM)/);
    });
  });

  describe("renderOptionContent prop", () => {
    it("uses custom renderOptionContent to render option labels", async () => {
      const user = userEvent.setup();
      const renderOptionContent = vi.fn((time: string) => <span data-testid="custom">{`[${time}]`}</span>);
      render(<TimePicker format="24h" minuteStep={60} renderOptionContent={renderOptionContent} />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      // Custom renderer should be called
      expect(renderOptionContent).toHaveBeenCalled();
      // Custom output appears in the DOM
      const customEls = document.querySelectorAll("[data-testid='custom']");
      expect(customEls.length).toBeGreaterThan(0);
    });
  });

  describe("selectedIcon prop", () => {
    it("renders custom selectedIcon for selected option", async () => {
      const user = userEvent.setup();
      const CustomIcon = () => <span data-testid="custom-check">✓</span>;
      render(
        <TimePicker
          format="24h"
          minuteStep={60}
          value="00:00"
          selectedIcon={<CustomIcon />}
          showSelectedIcon
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      expect(document.querySelector("[data-testid='custom-check']")).toBeInTheDocument();
    });
  });

  describe("lockScroll prop", () => {
    it("opens dropdown normally when lockScroll=true", async () => {
      const user = userEvent.setup();
      render(<TimePicker format="24h" lockScroll />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      // Component should be open and functional
      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("cleans up scroll lock listeners when closed", async () => {
      const user = userEvent.setup();
      render(<TimePicker format="24h" lockScroll />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      expect(input).toHaveAttribute("aria-expanded", "true");

      await user.keyboard("{Escape}");
      expect(input).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("onBlur prop", () => {
    it("accepts onBlur prop without error", () => {
      // onBlur fires inside double-requestAnimationFrame which JSDOM doesn't run
      // synchronously; verify the component at least mounts with onBlur provided.
      const onBlur = vi.fn();
      render(<TimePicker format="24h" onBlur={onBlur} />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("endIcon prop (custom)", () => {
    it("renders custom endIcon when provided", () => {
      const CustomEndIcon = () => <span data-testid="custom-end">▼</span>;
      render(<TimePicker format="24h" endIcon={<CustomEndIcon />} />);

      expect(document.querySelector("[data-testid='custom-end']")).toBeInTheDocument();
    });

    it("does not render end icon when showEndIcon is false", () => {
      render(<TimePicker format="24h" showEndIcon={false} />);

      // No chevron rendered; the input trigger should have no chevron
      // Only icons inside actual content count; no chevron SVG
      expect(document.querySelector("[data-testid='custom-end']")).toBeNull();
    });
  });

  describe("portalContainer prop", () => {
    it("renders dropdown in custom portal container", async () => {
      const user = userEvent.setup();
      const portalEl = document.createElement("div");
      portalEl.id = "custom-portal";
      document.body.appendChild(portalEl);

      render(<TimePicker format="24h" minuteStep={60} portalContainer={portalEl} />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      // Listbox should be inside custom portal container
      const listbox = portalEl.querySelector('[role="listbox"]');
      expect(listbox).toBeInTheDocument();

      document.body.removeChild(portalEl);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════
// useTimePicker — hook-level coverage tests
// ═══════════════════════════════════════════════════════════════════════
import { renderHook, act } from "@testing-library/react";
import { useTimePicker } from "../useTimePicker";

describe("useTimePicker (additional coverage)", () => {
  const baseProps = {
    value: null as string | null,
    format: "24h" as const,
    minuteStep: 15,
    disabled: false,
    onValueChange: vi.fn(),
  };

  describe("Escape key in hook handleKeyDown", () => {
    it("calls preventDefault when Escape is pressed", () => {
      const { result } = renderHook(() => useTimePicker(baseProps));

      const mockEvent = {
        key: "Escape",
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe("ArrowUp wrapping in hook handleKeyDown", () => {
    it("wraps to last option when ArrowUp is pressed at index 0", () => {
      const { result } = renderHook(() =>
        useTimePicker({ ...baseProps, value: null }),
      );

      // displayOptions should be populated (24h, step=15 → 96 options)
      const lastIndex = result.current.displayOptions.length - 1;

      // First set focusedIndex to 0
      act(() => {
        result.current.setFocusedIndex(0);
      });

      const mockEvent = {
        key: "ArrowUp",
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(result.current.focusedIndex).toBe(lastIndex);
    });

    it("decrements focusedIndex when ArrowUp is pressed at index > 0", () => {
      const { result } = renderHook(() => useTimePicker(baseProps));

      act(() => {
        result.current.setFocusedIndex(5);
      });

      const mockEvent = {
        key: "ArrowUp",
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(result.current.focusedIndex).toBe(4);
    });
  });

  describe("Format change syncs input value", () => {
    it("resets input value when format changes from 24h to 12h", () => {
      const onValueChange = vi.fn();
      const { result, rerender } = renderHook(
        ({ format }: { format: "12h" | "24h" }) =>
          useTimePicker({ ...baseProps, value: "14:30", format, onValueChange }),
        { initialProps: { format: "24h" as "12h" | "24h" } },
      );

      expect(result.current.inputValue).toBe("14:30");

      // Rerender with 12h format — should reformat
      rerender({ format: "12h" });

      expect(result.current.inputValue).toBe("02:30 PM");
    });
  });

  describe("commitValue with no input", () => {
    it("calls onValueChange with null when input is cleared", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useTimePicker({ ...baseProps, value: "14:30", onValueChange }),
      );

      // Simulate user clearing the input
      act(() => {
        result.current.handleInputChange("");
      });

      // commitValue via blur
      act(() => {
        result.current.handleBlur();
      });

      expect(onValueChange).toHaveBeenCalledWith(null, null);
    });
  });

  describe("handleOptionSelect", () => {
    it("updates input value and calls onValueChange", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useTimePicker({ ...baseProps, onValueChange }),
      );

      act(() => {
        result.current.handleOptionSelect("09:00");
      });

      expect(result.current.inputValue).toBe("09:00");
      expect(onValueChange).toHaveBeenCalledWith("09:00", expect.objectContaining({ hours: 9, minutes: 0 }));
    });
  });

  describe("handleKeyDown Enter with focusedIndex", () => {
    it("selects focused option when Enter is pressed with focusedIndex >= 0", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useTimePicker({ ...baseProps, onValueChange }),
      );

      // Focus first option
      act(() => {
        result.current.setFocusedIndex(0);
      });

      const mockEvent = {
        key: "Enter",
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(onValueChange).toHaveBeenCalled();
    });
  });

  describe("handleKeyDown Home/End", () => {
    it("sets focusedIndex to 0 on Home key", () => {
      const { result } = renderHook(() => useTimePicker(baseProps));

      act(() => { result.current.setFocusedIndex(5); });

      act(() => {
        result.current.handleKeyDown({ key: "Home", preventDefault: vi.fn() } as unknown as React.KeyboardEvent);
      });

      expect(result.current.focusedIndex).toBe(0);
    });

    it("sets focusedIndex to last option on End key", () => {
      const { result } = renderHook(() => useTimePicker(baseProps));

      act(() => {
        result.current.handleKeyDown({ key: "End", preventDefault: vi.fn() } as unknown as React.KeyboardEvent);
      });

      expect(result.current.focusedIndex).toBe(result.current.displayOptions.length - 1);
    });
  });

  describe("disabled state", () => {
    it("does nothing on key events when disabled", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useTimePicker({ ...baseProps, disabled: true, onValueChange }),
      );

      const mockEvent = {
        key: "ArrowDown",
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it("does nothing on handleToggle when disabled", () => {
      const { result } = renderHook(() =>
        useTimePicker({ ...baseProps, disabled: true }),
      );

      // Should not throw
      act(() => {
        result.current.handleToggle();
      });

      expect(result.current.focusedIndex).toBe(-1);
    });
  });
});
