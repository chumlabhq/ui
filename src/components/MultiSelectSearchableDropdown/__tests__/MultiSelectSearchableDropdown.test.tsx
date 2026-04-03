import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiSelectSearchableDropdown } from "../index";
import type { MultiSelectOption } from "../utils/types";

const options: MultiSelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
];

describe("MultiSelectSearchableDropdown", () => {
  describe("Rendering", () => {
    it("renders with default placeholder", () => {
      render(<MultiSelectSearchableDropdown options={options} />);
      expect(screen.getByText("Select options...")).toBeInTheDocument();
    });

    it("renders with custom placeholder", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          placeholder="Pick fruits"
        />
      );
      expect(screen.getByText("Pick fruits")).toBeInTheDocument();
    });

    it("renders label when provided", () => {
      render(
        <MultiSelectSearchableDropdown options={options} label="Fruits" />
      );
      expect(screen.getByText("Fruits")).toBeInTheDocument();
    });

    it("renders required asterisk when required", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          label="Fruits"
          required
        />
      );
      const label = screen.getByText("Fruits");
      expect(label.parentElement?.textContent).toContain("*");
    });

    it("renders description when provided", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          description="Select multiple"
        />
      );
      expect(screen.getByText("Select multiple")).toBeInTheDocument();
    });

    it("renders error message when error", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          error
          errorMessage="Field is required"
        />
      );
      expect(screen.getByText("Field is required")).toBeInTheDocument();
    });

    it("renders success message when success and no error", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          success
          successMessage="All good!"
        />
      );
      expect(screen.getByText("All good!")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <MultiSelectSearchableDropdown
          options={options}
          className="my-searchable"
        />
      );
      expect(container.firstElementChild).toHaveClass("my-searchable");
    });
  });

  describe("Interaction", () => {
    it("opens dropdown on trigger click", async () => {
      const user = userEvent.setup();
      render(<MultiSelectSearchableDropdown options={options} />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("shows all options when opened", async () => {
      const user = userEvent.setup();
      render(<MultiSelectSearchableDropdown options={options} />);

      await user.click(screen.getByRole("combobox"));

      // The listbox is portalled; verify options render
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
      expect(screen.getByText("Cherry")).toBeInTheDocument();
    });

    it("selects an option and calls onValueChange", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelectSearchableDropdown
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
    });

    it("selects multiple options", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelectSearchableDropdown
          options={options}
          onValueChange={onValueChange}
        />
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("Apple"));
      await user.click(screen.getByText("Cherry"));

      expect(onValueChange).toHaveBeenLastCalledWith(
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
        <MultiSelectSearchableDropdown
          options={options}
          defaultValue={["apple"]}
          onValueChange={onValueChange}
        />
      );

      await user.click(screen.getByRole("combobox"));

      // "Apple" appears both as a chip and in the dropdown options
      const allApples = screen.getAllByText("Apple");
      // Click the dropdown option (last occurrence)
      await user.click(allApples[allApples.length - 1]);

      expect(onValueChange).toHaveBeenCalledWith([], []);
    });

    it("shows selected chips in trigger", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          defaultValue={["apple", "banana"]}
        />
      );
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
    });

    it("removes a chip via remove button", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelectSearchableDropdown
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
        <MultiSelectSearchableDropdown
          options={options}
          defaultValue={["apple", "banana", "cherry", "date"]}
          maxDisplayedChips={2}
        />
      );
      expect(screen.getByText("+2")).toBeInTheDocument();
    });
  });

  describe("Search filtering", () => {
    it("renders search input when dropdown is open", async () => {
      const user = userEvent.setup();
      render(<MultiSelectSearchableDropdown options={options} />);

      await user.click(screen.getByRole("combobox"));

      // Search input is inside the portalled dropdown
      const searchInput = document.querySelector('input[type="text"]');
      expect(searchInput).toBeInTheDocument();
    });

    it("filters options by search query", async () => {
      const user = userEvent.setup();
      render(<MultiSelectSearchableDropdown options={options} showSearch />);

      await user.click(screen.getByRole("combobox"));

      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "app");

      // Only Apple should be visible after filtering
      expect(screen.getByText("Apple")).toBeInTheDocument();
      // Other options should be filtered out
      expect(screen.queryByText("Banana")).not.toBeInTheDocument();
    });

    it("shows no results when no options match search", async () => {
      const user = userEvent.setup();
      render(<MultiSelectSearchableDropdown options={options} showSearch />);

      await user.click(screen.getByRole("combobox"));

      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "zzz");

      expect(screen.getByText("No options found")).toBeInTheDocument();
    });
  });

  describe("Disabled state", () => {
    it("does not open when disabled", async () => {
      const user = userEvent.setup();
      render(<MultiSelectSearchableDropdown options={options} disabled />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Controlled mode", () => {
    it("reflects controlled value in selected chips", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          value={["banana", "cherry"]}
        />
      );
      expect(screen.getByText("Banana")).toBeInTheDocument();
      expect(screen.getByText("Cherry")).toBeInTheDocument();
    });

    it("respects controlled open state", () => {
      render(
        <MultiSelectSearchableDropdown options={options} open={true} />
      );
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Accessibility", () => {
    it("sets combobox role on trigger", () => {
      render(<MultiSelectSearchableDropdown options={options} />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("sets aria-haspopup='listbox'", () => {
      render(<MultiSelectSearchableDropdown options={options} />);
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    });

    it("sets aria-invalid when error", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          error
          errorMessage="Error"
        />
      );
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-invalid", "true");
    });

    it("sets aria-required when required", () => {
      render(
        <MultiSelectSearchableDropdown options={options} required />
      );
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-required", "true");
    });

    it("sets aria-multiselectable on listbox", async () => {
      const user = userEvent.setup();
      render(<MultiSelectSearchableDropdown options={options} />);

      await user.click(screen.getByRole("combobox"));

      // Listbox is portaled; query broadly
      const listboxes = document.querySelectorAll('[role="listbox"]');
      expect(listboxes.length).toBeGreaterThan(0);
      expect(listboxes[0]).toHaveAttribute("aria-multiselectable", "true");
    });
  });

  describe("Clear all", () => {
    it("shows clear button when clearable and has values", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          defaultValue={["apple"]}
          clearable
        />
      );
      expect(
        screen.getByRole("button", { name: "Clear all selections" })
      ).toBeInTheDocument();
    });

    it("clears all when clear button is clicked", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelectSearchableDropdown
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
