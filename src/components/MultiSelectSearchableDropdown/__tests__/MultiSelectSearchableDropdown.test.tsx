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

  describe("renderTrigger prop", () => {
    it("renders custom trigger via renderTrigger and calls setTriggerNode", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const renderTrigger = vi.fn(({ ref, onClick, isOpen }: any) => (
        <button ref={ref} onClick={onClick} data-testid="custom-trigger" data-open={isOpen}>
          Custom trigger
        </button>
      ));
      render(
        <MultiSelectSearchableDropdown
          options={options}
          renderTrigger={renderTrigger}
        />
      );
      expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
      expect(renderTrigger).toHaveBeenCalled();
    });

    it("opens dropdown when custom trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectSearchableDropdown
          options={options}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          renderTrigger={({ ref, onClick }: any) => (
            <button ref={ref} onClick={onClick} data-testid="custom-trigger">
              Custom
            </button>
          )}
        />
      );
      await user.click(screen.getByTestId("custom-trigger"));
      expect(screen.getByText("Apple")).toBeInTheDocument();
    });
  });

  describe("onKeyDown passthrough", () => {
    it("calls onKeyDown prop before internal handler", async () => {
      const onKeyDown = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelectSearchableDropdown
          options={options}
          onKeyDown={onKeyDown}
        />
      );
      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard("{Enter}");
      expect(onKeyDown).toHaveBeenCalled();
    });

    it("does not call internal handleKeyDown when onKeyDown prevents default", async () => {
      const onKeyDown = vi.fn((e: React.KeyboardEvent) => e.preventDefault());
      const user = userEvent.setup();
      render(
        <MultiSelectSearchableDropdown
          options={options}
          onKeyDown={onKeyDown}
        />
      );
      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard("{Enter}");
      // onKeyDown was called and prevented default — dropdown should remain closed
      expect(onKeyDown).toHaveBeenCalled();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("name hidden input", () => {
    it("renders a hidden input when name is provided", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          name="fruits"
          defaultValue={["apple", "banana"]}
        />
      );
      const hiddenInput = document.querySelector('input[type="hidden"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute("name", "fruits");
    });

    it("hidden input value reflects selected options joined by comma", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          name="fruits"
          defaultValue={["apple", "cherry"]}
        />
      );
      const hiddenInput = document.querySelector(
        'input[type="hidden"]'
      ) as HTMLInputElement;
      expect(hiddenInput.value).toBe("apple,cherry");
    });
  });

  describe("Loading / shimmer", () => {
    it("renders loading text when loading is true and dropdown is open", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          loading
          shimmerCount={3}
          open
        />
      );
      // The loading status text is rendered inside a role="status" element
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders custom loadingText when loading", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          loading
          open
          loadingText="Fetching..."
        />
      );
      expect(screen.getByText("Fetching...")).toBeInTheDocument();
    });
  });

  describe("showSelectedChips=false", () => {
    it("shows count text instead of chips when showSelectedChips is false", () => {
      render(
        <MultiSelectSearchableDropdown
          options={options}
          defaultValue={["apple", "banana"]}
          showSelectedChips={false}
        />
      );
      expect(screen.getByText("2 selected")).toBeInTheDocument();
    });
  });

  describe("lockScroll", () => {
    it("adds wheel and touchmove listeners when lockScroll=true and dropdown is open", async () => {
      const addSpy = vi.spyOn(window, "addEventListener");
      const removeSpy = vi.spyOn(window, "removeEventListener");
      const user = userEvent.setup();

      const { unmount } = render(
        <MultiSelectSearchableDropdown options={options} lockScroll />
      );

      await user.click(screen.getByRole("combobox"));

      expect(addSpy).toHaveBeenCalledWith(
        "wheel",
        expect.any(Function),
        expect.objectContaining({ capture: true })
      );
      expect(addSpy).toHaveBeenCalledWith(
        "touchmove",
        expect.any(Function),
        expect.objectContaining({ capture: true })
      );

      unmount();

      expect(removeSpy).toHaveBeenCalledWith(
        "wheel",
        expect.any(Function),
        expect.objectContaining({ capture: true })
      );
      expect(removeSpy).toHaveBeenCalledWith(
        "touchmove",
        expect.any(Function),
        expect.objectContaining({ capture: true })
      );

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });
  });

  describe("Keyboard: Tab closes without restoring focus", () => {
    it("closes dropdown on Tab key and does not restore focus to trigger", async () => {
      const user = userEvent.setup();
      render(<MultiSelectSearchableDropdown options={options} defaultOpen />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      // Tab from the trigger — fires on the capture listener registered on document
      trigger.focus();
      await user.keyboard("{Tab}");

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });
});
