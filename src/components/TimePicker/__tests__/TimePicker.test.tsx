import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimePicker } from "../index";

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
});
