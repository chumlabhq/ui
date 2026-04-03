import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "../index";

/**
 * The calendar is rendered via createPortal and uses requestAnimationFrame
 * (via useStablePositionAfterOpen) to set its position. In jsdom,
 * requestAnimationFrame does not fire automatically, so we need to flush
 * pending frames after opening the calendar to make the dialog visible
 * and queryable by role.
 */

/** Flush two nested requestAnimationFrame calls used by useStablePositionAfterOpen. */
async function flushPositionFrames() {
  await act(async () => {
    // The hook calls rAF inside rAF, so we need to advance two frames
    vi.advanceTimersByTime(32);
  });
}

/** Helper: open the calendar and wait for it to become visible. */
async function openCalendar(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("combobox"));
  await flushPositionFrames();
}

describe("DatePicker", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<DatePicker />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("shows the default placeholder for single mode", () => {
      render(<DatePicker />);
      expect(screen.getByText("Select a date")).toBeInTheDocument();
    });

    it("shows the default placeholder for range mode", () => {
      render(<DatePicker mode="range" />);
      expect(screen.getByText("Select date range")).toBeInTheDocument();
    });

    it("shows the default placeholder for multiple mode", () => {
      render(<DatePicker mode="multiple" />);
      expect(screen.getByText("Select dates")).toBeInTheDocument();
    });

    it("shows custom placeholder text", () => {
      render(<DatePicker placeholder="Pick a date" />);
      expect(screen.getByText("Pick a date")).toBeInTheDocument();
    });

    it("renders a label when provided", () => {
      render(<DatePicker label="Start Date" />);
      expect(screen.getByText("Start Date")).toBeInTheDocument();
    });

    it("renders required indicator with label", () => {
      render(<DatePicker label="Date" required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders description text", () => {
      render(<DatePicker description="Choose your preferred date" />);
      expect(
        screen.getByText("Choose your preferred date"),
      ).toBeInTheDocument();
    });
  });

  describe("Open/Close", () => {
    it("opens calendar dropdown on trigger click", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<DatePicker />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await openCalendar(user);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("closes calendar on second trigger click", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<DatePicker />);

      const trigger = screen.getByRole("combobox");
      await openCalendar(user);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("displays current month and year in calendar header", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<DatePicker />);

      await openCalendar(user);

      const now = new Date();
      const monthName = now.toLocaleString("default", { month: "long" });
      const year = now.getFullYear().toString();

      expect(screen.getByText(monthName)).toBeInTheDocument();
      expect(screen.getByText(year)).toBeInTheDocument();
    });

    it("calls onOpenChange when opening and closing", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      const onOpenChange = vi.fn();
      render(<DatePicker onOpenChange={onOpenChange} />);

      await user.click(screen.getByRole("combobox"));
      expect(onOpenChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole("combobox"));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Date Selection", () => {
    it("selects a date when clicking a day cell", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      const onValueChange = vi.fn();
      render(<DatePicker onValueChange={onValueChange} />);

      await openCalendar(user);

      // Click on day 15 of the current month
      const dayCells = screen.getAllByRole("gridcell");
      const day15 = dayCells.find(
        (cell) =>
          cell.textContent?.trim() === "15" &&
          !cell.getAttribute("data-outside"),
      );
      expect(day15).toBeDefined();

      await user.click(day15!);
      expect(onValueChange).toHaveBeenCalledTimes(1);

      const [selectedDate] = onValueChange.mock.calls[0];
      expect(selectedDate).toBeInstanceOf(Date);
      expect(selectedDate.getDate()).toBe(15);
    });

    it("displays selected date value in the trigger", () => {
      const selectedDate = new Date(2025, 5, 15); // June 15, 2025
      render(<DatePicker value={selectedDate} />);

      // Default format is "MMM d, yyyy"
      expect(screen.getByText("Jun 15, 2025")).toBeInTheDocument();
    });
  });

  describe("Controlled Mode", () => {
    it("displays the controlled value", () => {
      const date = new Date(2025, 0, 10); // Jan 10, 2025
      render(<DatePicker value={date} />);
      expect(screen.getByText("Jan 10, 2025")).toBeInTheDocument();
    });

    it("fires onValueChange with date and dateValue", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      const onValueChange = vi.fn();
      render(<DatePicker value={null} onValueChange={onValueChange} />);

      await openCalendar(user);

      const dayCells = screen.getAllByRole("gridcell");
      const day10 = dayCells.find(
        (cell) =>
          cell.textContent?.trim() === "10" &&
          !cell.getAttribute("data-outside"),
      );
      await user.click(day10!);

      expect(onValueChange).toHaveBeenCalledTimes(1);
      const [selectedDate, dateValue] = onValueChange.mock.calls[0];
      expect(selectedDate).toBeInstanceOf(Date);
      expect(dateValue).toHaveProperty("date");
      expect(dateValue).toHaveProperty("dateString");
    });

    it("shows null value as placeholder", () => {
      render(<DatePicker value={null} placeholder="No date" />);
      expect(screen.getByText("No date")).toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("disables the trigger button when disabled", () => {
      render(<DatePicker disabled />);
      expect(screen.getByRole("combobox")).toBeDisabled();
    });

    it("does not open calendar when disabled trigger is clicked", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<DatePicker disabled />);

      await user.click(screen.getByRole("combobox"));
      expect(
        screen.queryByRole("dialog", { hidden: true }),
      ).not.toBeInTheDocument();
    });

    it("sets data-disabled on the root container", () => {
      const { container } = render(<DatePicker disabled />);
      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-disabled");
    });
  });

  describe("Error and Success States", () => {
    it("sets aria-invalid when error is true", () => {
      render(<DatePicker error />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("renders error message text", () => {
      render(<DatePicker error errorMessage="Date is required" />);
      expect(screen.getByText("Date is required")).toBeInTheDocument();
    });

    it("sets data-error on the root when error is true", () => {
      const { container } = render(<DatePicker error />);
      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-error");
    });

    it("sets data-success on the root when success is true", () => {
      const { container } = render(<DatePicker success />);
      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-success");
    });

    it("renders success message text", () => {
      render(<DatePicker success successMessage="Looks good!" />);
      expect(screen.getByText("Looks good!")).toBeInTheDocument();
    });

    it("links error message via aria-describedby", () => {
      render(<DatePicker id="dob" error errorMessage="Required field" />);
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-describedby", "dob-error");
    });
  });

  describe("Clearable Behavior", () => {
    it("shows clear button when a value is set and showClearButton is true", () => {
      const date = new Date(2025, 3, 20);
      render(<DatePicker value={date} showClearButton />);
      expect(screen.getByLabelText("Clear selection")).toBeInTheDocument();
    });

    it("does not show clear button when no value is set", () => {
      render(<DatePicker value={null} showClearButton />);
      expect(
        screen.queryByLabelText("Clear selection"),
      ).not.toBeInTheDocument();
    });

    it("calls onClear when clear button is clicked", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      const onClear = vi.fn();
      const onValueChange = vi.fn();
      const date = new Date(2025, 3, 20);

      render(
        <DatePicker
          value={date}
          onValueChange={onValueChange}
          onClear={onClear}
          showClearButton
        />,
      );

      await user.click(screen.getByLabelText("Clear selection"));
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it("does not show clear button when disabled", () => {
      const date = new Date(2025, 3, 20);
      render(<DatePicker value={date} disabled showClearButton />);
      expect(
        screen.queryByLabelText("Clear selection"),
      ).not.toBeInTheDocument();
    });
  });

  describe("ARIA Attributes", () => {
    it("has role=combobox on trigger", () => {
      render(<DatePicker />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("has aria-expanded=false when closed", () => {
      render(<DatePicker />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("has aria-expanded=true when open", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<DatePicker />);

      await user.click(screen.getByRole("combobox"));
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("has aria-haspopup=dialog on trigger", () => {
      render(<DatePicker />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-haspopup",
        "dialog",
      );
    });

    it("has aria-required when required prop is set", () => {
      render(<DatePicker required />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-required",
        "true",
      );
    });

    it("dialog has aria-modal=true and aria-label", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<DatePicker />);

      await openCalendar(user);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-label", "Date picker");
    });

    it("dialog aria-label reflects range mode", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<DatePicker mode="range" />);

      await openCalendar(user);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-label", "Date range picker");
    });

    it("dialog aria-label reflects multiple mode", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<DatePicker mode="multiple" />);

      await openCalendar(user);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-label", "Multiple dates picker");
    });
  });

  describe("Keyboard Interaction", () => {
    it("closes dropdown on Escape key", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<DatePicker />);

      const trigger = screen.getByRole("combobox");
      await openCalendar(user);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      await user.keyboard("{Escape}");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("opens dropdown on Enter key when trigger is focused", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<DatePicker />);

      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard("{Enter}");
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Custom Classes and Unstyled Mode", () => {
    it("applies custom className to root", () => {
      const { container } = render(<DatePicker className="my-datepicker" />);
      expect(container.firstElementChild).toHaveClass("my-datepicker");
    });

    it("applies custom classes via classes prop", () => {
      render(<DatePicker label="Test" classes={{ label: "custom-label" }} />);
      const label = screen.getByText("Test");
      expect(label).toHaveClass("custom-label");
    });

    it("applies fullWidth class", () => {
      const { container } = render(<DatePicker fullWidth />);
      expect(container.firstElementChild).toHaveClass("w-full");
    });

    it("renders in unstyled mode without default classes", async () => {
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<DatePicker unstyled />);
      const trigger = screen.getByRole("combobox");

      // In unstyled mode the trigger should not carry the default styled classes
      expect(trigger.className).not.toContain("border-gray-300");

      // It should still be functional
      await openCalendar(user);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("Calendar Icon", () => {
    it("shows calendar icon by default", () => {
      render(<DatePicker />);
      const trigger = screen.getByRole("combobox");
      const svgs = trigger.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThan(0);
    });

    it("hides calendar icon when showCalendarIcon is false", () => {
      render(<DatePicker showCalendarIcon={false} />);
      const trigger = screen.getByRole("combobox");
      const svgs = trigger.querySelectorAll("svg");
      expect(svgs.length).toBe(0);
    });
  });

  describe("Loading State", () => {
    it("sets data-loading on the root when loading is true", () => {
      const { container } = render(<DatePicker loading />);
      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-loading");
    });
  });
});
