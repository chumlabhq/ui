import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiSelectDropdown } from "../index";
import type { MultiSelectOption } from "../utils/types";

const options: MultiSelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
];

describe("MultiSelectDropdown", () => {
  describe("Rendering", () => {
    it("renders with default placeholder", () => {
      render(<MultiSelectDropdown options={options} />);
      expect(screen.getByText("Select options...")).toBeInTheDocument();
    });

    it("renders with custom placeholder", () => {
      render(
        <MultiSelectDropdown options={options} placeholder="Choose fruits" />
      );
      expect(screen.getByText("Choose fruits")).toBeInTheDocument();
    });

    it("renders label when provided", () => {
      render(<MultiSelectDropdown options={options} label="Fruits" />);
      expect(screen.getByText("Fruits")).toBeInTheDocument();
    });

    it("renders required asterisk when required", () => {
      render(
        <MultiSelectDropdown options={options} label="Fruits" required />
      );
      const label = screen.getByText("Fruits");
      expect(label.parentElement?.textContent).toContain("*");
    });

    it("renders description when provided", () => {
      render(
        <MultiSelectDropdown
          options={options}
          description="Select multiple fruits"
        />
      );
      expect(screen.getByText("Select multiple fruits")).toBeInTheDocument();
    });

    it("renders error message when error is true", () => {
      render(
        <MultiSelectDropdown
          options={options}
          error
          errorMessage="Required"
        />
      );
      expect(screen.getByText("Required")).toBeInTheDocument();
    });

    it("renders success message when success is true and no error", () => {
      render(
        <MultiSelectDropdown
          options={options}
          success
          successMessage="Looks good!"
        />
      );
      expect(screen.getByText("Looks good!")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <MultiSelectDropdown options={options} className="my-multi" />
      );
      expect(container.firstElementChild).toHaveClass("my-multi");
    });
  });

  describe("Interaction", () => {
    it("opens dropdown on trigger click", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={options} />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("shows all options when opened", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={options} />);

      await user.click(screen.getByRole("combobox"));

      // The listbox is portalled and may have visibility:hidden in jsdom (no layout)
      const listbox = screen.getByRole("listbox", { hidden: true });
      expect(listbox).toBeInTheDocument();

      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
      expect(screen.getByText("Cherry")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
    });

    it("selects multiple options and calls onValueChange", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelectDropdown
          options={options}
          onValueChange={onValueChange}
        />
      );

      await user.click(screen.getByRole("combobox"));

      await user.click(screen.getByText("Apple"));
      expect(onValueChange).toHaveBeenCalledWith(
        ["apple"],
        expect.arrayContaining([expect.objectContaining({ value: "apple" })])
      );

      await user.click(screen.getByText("Cherry"));
      expect(onValueChange).toHaveBeenCalledWith(
        ["apple", "cherry"],
        expect.arrayContaining([
          expect.objectContaining({ value: "apple" }),
          expect.objectContaining({ value: "cherry" }),
        ])
      );
    });

    it("deselects an option on second click", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelectDropdown
          options={options}
          defaultValue={["apple"]}
          onValueChange={onValueChange}
        />
      );

      await user.click(screen.getByRole("combobox"));

      // "Apple" appears both as a chip and in the listbox; find options in the portaled dropdown
      const allApples = screen.getAllByText("Apple");
      // Click the one in the dropdown list (last occurrence)
      await user.click(allApples[allApples.length - 1]);

      expect(onValueChange).toHaveBeenCalledWith([], []);
    });

    it("shows selected chips in trigger", async () => {
      render(
        <MultiSelectDropdown
          options={options}
          defaultValue={["apple", "banana"]}
        />
      );

      // Chips should show the selected labels
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
    });

    it("removes a chip via remove button", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelectDropdown
          options={options}
          defaultValue={["apple", "banana"]}
          onValueChange={onValueChange}
        />
      );

      const removeButton = screen.getByRole("button", {
        name: "Remove Apple",
      });
      await user.click(removeButton);

      expect(onValueChange).toHaveBeenCalledWith(
        ["banana"],
        expect.arrayContaining([
          expect.objectContaining({ value: "banana" }),
        ])
      );
    });

    it("shows '+N' when more items selected than maxDisplayedChips", () => {
      render(
        <MultiSelectDropdown
          options={options}
          defaultValue={["apple", "banana", "cherry", "date"]}
          maxDisplayedChips={2}
        />
      );

      expect(screen.getByText("+2")).toBeInTheDocument();
    });
  });

  describe("Disabled state", () => {
    it("does not open when disabled", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={options} disabled />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Controlled mode", () => {
    it("reflects controlled value in selected chips", () => {
      render(
        <MultiSelectDropdown options={options} value={["banana", "cherry"]} />
      );
      expect(screen.getByText("Banana")).toBeInTheDocument();
      expect(screen.getByText("Cherry")).toBeInTheDocument();
    });

    it("respects controlled open state", () => {
      render(<MultiSelectDropdown options={options} open={true} />);
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Accessibility", () => {
    it("sets combobox role on trigger", () => {
      render(<MultiSelectDropdown options={options} />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("sets aria-haspopup='listbox' on trigger", () => {
      render(<MultiSelectDropdown options={options} />);
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    });

    it("sets aria-invalid when error is true", () => {
      render(
        <MultiSelectDropdown
          options={options}
          error
          errorMessage="Error"
        />
      );
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-invalid", "true");
    });

    it("sets aria-required when required", () => {
      render(<MultiSelectDropdown options={options} required />);
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-required", "true");
    });

    it("sets aria-multiselectable on listbox", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={options} />);

      await user.click(screen.getByRole("combobox"));

      // Listbox is portaled; query broadly including hidden elements
      const listboxes = document.querySelectorAll('[role="listbox"]');
      expect(listboxes.length).toBeGreaterThan(0);
      expect(listboxes[0]).toHaveAttribute("aria-multiselectable", "true");
    });

    it("has a live region for status announcements", () => {
      render(<MultiSelectDropdown options={options} />);
      const status = screen.getAllByRole("status");
      expect(status.length).toBeGreaterThan(0);
    });
  });

  describe("Clear all", () => {
    it("shows clear button when clearable and has values", () => {
      render(
        <MultiSelectDropdown
          options={options}
          defaultValue={["apple"]}
          clearable
        />
      );
      expect(
        screen.getByRole("button", { name: "Clear all selections" })
      ).toBeInTheDocument();
    });

    it("clears all selections when clear button is clicked", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelectDropdown
          options={options}
          defaultValue={["apple", "banana"]}
          clearable
          onValueChange={onValueChange}
        />
      );

      await user.click(
        screen.getByRole("button", { name: "Clear all selections" })
      );
      expect(onValueChange).toHaveBeenCalledWith([], []);
    });
  });
});
