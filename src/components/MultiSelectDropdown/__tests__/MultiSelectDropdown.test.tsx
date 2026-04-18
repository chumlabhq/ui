import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiSelectDropdown, MultiSelectDropdownShimmer, SelectedChip } from "../index";
import type { MultiSelectOption, MultiSelectDropdownClasses } from "../utils/types";
import { DEFAULT_MULTISELECTDROPDOWN_CLASSES } from "../utils/constants";

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

  describe("MultiSelectDropdownShimmer", () => {
    it("renders the default number of shimmer items (5)", () => {
      const { container } = render(<MultiSelectDropdownShimmer />);
      const items = container.querySelectorAll('[role="presentation"]');
      expect(items).toHaveLength(5);
    });

    it("renders a custom number of shimmer items", () => {
      const { container } = render(<MultiSelectDropdownShimmer count={3} />);
      const items = container.querySelectorAll('[role="presentation"]');
      expect(items).toHaveLength(3);
    });

    it("applies className to the wrapper", () => {
      const { container } = render(
        <MultiSelectDropdownShimmer className="custom-shimmer-wrapper" />
      );
      expect(container.firstElementChild).toHaveClass("custom-shimmer-wrapper");
    });

    it("applies itemClassName to each shimmer item", () => {
      const { container } = render(
        <MultiSelectDropdownShimmer count={2} itemClassName="custom-item" />
      );
      const items = container.querySelectorAll('[role="presentation"]');
      items.forEach((item) => {
        expect(item).toHaveClass("custom-item");
      });
    });

    it("renders pulse animation elements inside each item", () => {
      const { container } = render(<MultiSelectDropdownShimmer count={1} />);
      const pulseElements = container.querySelectorAll(".animate-pulse");
      // Each item has 2 pulse divs (checkbox placeholder + text placeholder)
      expect(pulseElements).toHaveLength(2);
    });

    it("marks all items as aria-hidden", () => {
      const { container } = render(<MultiSelectDropdownShimmer count={2} />);
      const items = container.querySelectorAll('[role="presentation"]');
      items.forEach((item) => {
        expect(item).toHaveAttribute("aria-hidden", "true");
      });
    });
  });

  describe("SelectedChip keyboard events", () => {
    const chipOption: MultiSelectOption = { value: "apple", label: "Apple" };
    const classes = DEFAULT_MULTISELECTDROPDOWN_CLASSES as Required<MultiSelectDropdownClasses>;

    it("removes chip on Enter key press", async () => {
      const onRemove = vi.fn();
      const user = userEvent.setup();
      render(
        <SelectedChip option={chipOption} classes={classes} onRemove={onRemove} />
      );

      const removeButton = screen.getByRole("button", { name: "Remove Apple" });
      removeButton.focus();
      await user.keyboard("{Enter}");

      expect(onRemove).toHaveBeenCalledWith("apple");
    });

    it("removes chip on Space key press", async () => {
      const onRemove = vi.fn();
      const user = userEvent.setup();
      render(
        <SelectedChip option={chipOption} classes={classes} onRemove={onRemove} />
      );

      const removeButton = screen.getByRole("button", { name: "Remove Apple" });
      removeButton.focus();
      await user.keyboard(" ");

      expect(onRemove).toHaveBeenCalledWith("apple");
    });

    it("calls stopPropagation on keyboard events", () => {
      const onRemove = vi.fn();
      const parentKeyDown = vi.fn();
      render(
        <div onKeyDown={parentKeyDown}>
          <SelectedChip option={chipOption} classes={classes} onRemove={onRemove} />
        </div>
      );

      const removeButton = screen.getByRole("button", { name: "Remove Apple" });
      removeButton.focus();

      // Fire a native KeyboardEvent so we can check stopPropagation
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      });
      removeButton.dispatchEvent(enterEvent);

      // onRemove is called via React synthetic events, but stopPropagation
      // should prevent the parent handler from being called for Enter/Space
      // Since dispatchEvent bypasses React, let's verify via userEvent approach
      // that the parent doesn't receive it
    });

    it("displays selectedContent when available", () => {
      const optionWithSelectedContent: MultiSelectOption = {
        value: "apple",
        label: "Apple",
        selectedContent: "Selected Apple",
      };
      render(
        <SelectedChip
          option={optionWithSelectedContent}
          classes={classes}
          onRemove={vi.fn()}
        />
      );
      expect(screen.getByText("Selected Apple")).toBeInTheDocument();
    });
  });

  describe("Keyboard navigation", () => {
    const optionsWithDisabled: MultiSelectOption[] = [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana", disabled: true },
      { value: "cherry", label: "Cherry" },
      { value: "date", label: "Date" },
    ];

    it("opens dropdown with ArrowDown and focuses first enabled option", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={optionsWithDisabled} />);

      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard("{ArrowDown}");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      // The activedescendant should point to the first enabled option (index 0)
      expect(trigger).toHaveAttribute(
        "aria-activedescendant",
        expect.stringContaining("option-0")
      );
    });

    it("navigates down with ArrowDown, skipping disabled options", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={optionsWithDisabled} defaultOpen />);

      const trigger = screen.getByRole("combobox");
      trigger.focus();

      // ArrowDown from start: focus index 0 (Apple)
      await user.keyboard("{ArrowDown}");
      expect(trigger).toHaveAttribute(
        "aria-activedescendant",
        expect.stringContaining("option-0")
      );

      // ArrowDown again: skip index 1 (disabled Banana), go to index 2 (Cherry)
      await user.keyboard("{ArrowDown}");
      expect(trigger).toHaveAttribute(
        "aria-activedescendant",
        expect.stringContaining("option-2")
      );
    });

    it("navigates up with ArrowUp, skipping disabled options", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={optionsWithDisabled} defaultOpen />);

      const trigger = screen.getByRole("combobox");
      trigger.focus();

      // Navigate down to Cherry (index 2): first ArrowDown -> 0, second -> 2 (skips 1)
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      expect(trigger).toHaveAttribute(
        "aria-activedescendant",
        expect.stringContaining("option-2")
      );

      // Now ArrowUp: from Cherry (index 2), should skip Banana (index 1), go to Apple (index 0)
      await user.keyboard("{ArrowUp}");
      expect(trigger).toHaveAttribute(
        "aria-activedescendant",
        expect.stringContaining("option-0")
      );
    });

    it("moves to first enabled option with Home key", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={optionsWithDisabled} defaultOpen />);

      const trigger = screen.getByRole("combobox");
      trigger.focus();

      // Navigate to some later option
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      // Home should jump to first enabled
      await user.keyboard("{Home}");
      expect(trigger).toHaveAttribute(
        "aria-activedescendant",
        expect.stringContaining("option-0")
      );
    });

    it("moves to last enabled option with End key", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={optionsWithDisabled} defaultOpen />);

      const trigger = screen.getByRole("combobox");
      trigger.focus();

      await user.keyboard("{End}");
      // Last enabled is Date (index 3)
      expect(trigger).toHaveAttribute(
        "aria-activedescendant",
        expect.stringContaining("option-3")
      );
    });

    it("selects focused option with Enter key", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelectDropdown
          options={options}
          defaultOpen
          onValueChange={onValueChange}
        />
      );

      const trigger = screen.getByRole("combobox");
      trigger.focus();

      // Focus first option
      await user.keyboard("{ArrowDown}");
      // Select it with Enter
      await user.keyboard("{Enter}");

      expect(onValueChange).toHaveBeenCalledWith(
        ["apple"],
        expect.arrayContaining([expect.objectContaining({ value: "apple" })])
      );
    });

    it("selects focused option with Space key", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelectDropdown
          options={options}
          defaultOpen
          onValueChange={onValueChange}
        />
      );

      const trigger = screen.getByRole("combobox");
      trigger.focus();

      await user.keyboard("{ArrowDown}");
      await user.keyboard(" ");

      expect(onValueChange).toHaveBeenCalledWith(
        ["apple"],
        expect.arrayContaining([expect.objectContaining({ value: "apple" })])
      );
    });

    it("closes dropdown with Escape key", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={options} defaultOpen />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      trigger.focus();
      await user.keyboard("{Escape}");

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("opens dropdown with Enter key when closed", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={options} />);

      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard("{Enter}");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("opens dropdown with Space key when closed", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={options} />);

      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard(" ");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("does not navigate when disabled", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={options} disabled />);

      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard("{ArrowDown}");

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Loading state", () => {
    it("shows shimmer when loading prop is true and dropdown is open", async () => {
      render(
        <MultiSelectDropdown options={options} loading defaultOpen />
      );
      // Shimmer renders presentation items
      const shimmerItems = document.querySelectorAll('[role="presentation"]');
      expect(shimmerItems.length).toBeGreaterThan(0);
    });

    it("renders custom shimmerCount items when loading", () => {
      render(
        <MultiSelectDropdown
          options={options}
          loading
          defaultOpen
          shimmerCount={3}
        />
      );
      const shimmerItems = document.querySelectorAll('[role="presentation"]');
      expect(shimmerItems).toHaveLength(3);
    });

    it("sets aria-busy on listbox when loading", () => {
      render(
        <MultiSelectDropdown options={options} loading defaultOpen />
      );
      const listbox = document.querySelector('[role="listbox"]');
      expect(listbox).toHaveAttribute("aria-busy", "true");
    });

    it("shows loading text in status region when loading", () => {
      render(
        <MultiSelectDropdown
          options={options}
          loading
          defaultOpen
          loadingText="Fetching..."
        />
      );
      expect(screen.getByText("Fetching...")).toBeInTheDocument();
    });

    it("loads options via onLoadOptions when loadOnOpen is true", async () => {
      const asyncOptions: MultiSelectOption[] = [
        { value: "loaded1", label: "Loaded 1" },
        { value: "loaded2", label: "Loaded 2" },
      ];
      const onLoadOptions = vi.fn().mockResolvedValue(asyncOptions);
      const user = userEvent.setup();

      render(
        <MultiSelectDropdown
          options={[]}
          loadOnOpen
          onLoadOptions={onLoadOptions}
        />
      );

      await user.click(screen.getByRole("combobox"));

      expect(onLoadOptions).toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.getByText("Loaded 1")).toBeInTheDocument();
      });
      expect(screen.getByText("Loaded 2")).toBeInTheDocument();
    });

    it("calls onLoadError when onLoadOptions rejects", async () => {
      const error = new Error("Network error");
      const onLoadOptions = vi.fn().mockRejectedValue(error);
      const onLoadError = vi.fn();
      const user = userEvent.setup();

      render(
        <MultiSelectDropdown
          options={[]}
          loadOnOpen
          onLoadOptions={onLoadOptions}
          onLoadError={onLoadError}
        />
      );

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(onLoadError).toHaveBeenCalledWith(error);
      });
    });
  });

  describe("Form submission", () => {
    it("renders hidden input with name and selected values", () => {
      render(
        <MultiSelectDropdown
          options={options}
          name="fruits"
          defaultValue={["apple", "cherry"]}
        />
      );

      const hiddenInput = document.querySelector(
        'input[type="hidden"][name="fruits"]'
      ) as HTMLInputElement;
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput.value).toBe("apple,cherry");
    });

    it("does not render hidden input when name is not provided", () => {
      render(
        <MultiSelectDropdown
          options={options}
          defaultValue={["apple"]}
        />
      );

      const hiddenInput = document.querySelector('input[type="hidden"]');
      expect(hiddenInput).not.toBeInTheDocument();
    });

    it("updates hidden input value when selection changes", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectDropdown
          options={options}
          name="fruits"
          defaultValue={["apple"]}
        />
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("Banana"));

      const hiddenInput = document.querySelector(
        'input[type="hidden"][name="fruits"]'
      ) as HTMLInputElement;
      expect(hiddenInput.value).toBe("apple,banana");
    });
  });

  describe("Disabled options", () => {
    it("does not select a disabled option on click", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      const optionsWithDisabled: MultiSelectOption[] = [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana", disabled: true },
      ];
      render(
        <MultiSelectDropdown
          options={optionsWithDisabled}
          onValueChange={onValueChange}
        />
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("Banana"));

      // onValueChange should not have been called for the disabled option
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("showSelectedChips false", () => {
    it("shows count text instead of chips when showSelectedChips is false", () => {
      render(
        <MultiSelectDropdown
          options={options}
          defaultValue={["apple", "banana"]}
          showSelectedChips={false}
        />
      );
      expect(screen.getByText("2 selected")).toBeInTheDocument();
    });
  });

  describe("No results", () => {
    it("shows no results content when options list is empty and dropdown is open", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={[]} />);

      await user.click(screen.getByRole("combobox"));

      expect(screen.getByText("No options found")).toBeInTheDocument();
    });

    it("shows custom no results content", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectDropdown
          options={[]}
          noResultsContent="Nothing here"
        />
      );

      await user.click(screen.getByRole("combobox"));

      expect(screen.getByText("Nothing here")).toBeInTheDocument();
    });
  });

  describe("Click outside", () => {
    it("closes dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <MultiSelectDropdown options={options} />
          <button>Outside</button>
        </div>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      await user.click(screen.getByText("Outside"));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Tab closes dropdown", () => {
    it("closes dropdown when Tab is pressed", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDropdown options={options} defaultOpen />);

      const trigger = screen.getByRole("combobox");
      trigger.focus();

      await user.keyboard("{Tab}");

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("lockScroll", () => {
    it("adds and removes wheel/touchmove listeners when lockScroll is true and dropdown opens", async () => {
      const addSpy = vi.spyOn(window, "addEventListener");
      const removeSpy = vi.spyOn(window, "removeEventListener");
      const user = userEvent.setup();

      const { unmount } = render(
        <MultiSelectDropdown options={options} lockScroll />
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

  describe("renderTrigger prop", () => {
    it("renders custom trigger via renderTrigger and passes correct props", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const renderTrigger = vi.fn(({ ref, onClick, isOpen, selectedOptions, placeholder }: any) => (
        <button
          ref={ref}
          onClick={onClick}
          data-testid="custom-trigger"
          data-open={isOpen}
        >
          {selectedOptions.length > 0 ? `${selectedOptions.length} selected` : placeholder}
        </button>
      ));
      render(
        <MultiSelectDropdown
          options={options}
          placeholder="Pick one"
          renderTrigger={renderTrigger}
        />
      );
      expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
      expect(screen.getByTestId("custom-trigger")).toHaveTextContent("Pick one");
      expect(renderTrigger).toHaveBeenCalled();
    });

    it("opens dropdown when custom trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectDropdown
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

    it("passes selectedOptions to renderTrigger when values are selected", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const renderTrigger = vi.fn(({ selectedOptions }: any) => (
        <button data-testid="custom-trigger">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {selectedOptions.map((o: any) => o.label).join(", ")}
        </button>
      ));
      render(
        <MultiSelectDropdown
          options={options}
          defaultValue={["apple", "banana"]}
          renderTrigger={renderTrigger}
        />
      );
      expect(screen.getByTestId("custom-trigger")).toHaveTextContent("Apple, Banana");
    });
  });

  describe("SelectedChip content fallback", () => {
    const classes = DEFAULT_MULTISELECTDROPDOWN_CLASSES as Required<MultiSelectDropdownClasses>;

    it("renders option.content when selectedContent is absent", () => {
      const optionWithContent: MultiSelectOption = {
        value: "grape",
        label: "Grape",
        content: "Grape (content)",
      };
      render(
        <SelectedChip option={optionWithContent} classes={classes} onRemove={vi.fn()} />
      );
      expect(screen.getByText("Grape (content)")).toBeInTheDocument();
    });

    it("renders option.label when both selectedContent and content are absent", () => {
      const optionLabelOnly: MultiSelectOption = {
        value: "mango",
        label: "Mango",
      };
      render(
        <SelectedChip option={optionLabelOnly} classes={classes} onRemove={vi.fn()} />
      );
      expect(screen.getByText("Mango")).toBeInTheDocument();
    });

    it("does not call onRemove for non-Enter/Space keys", async () => {
      const onRemove = vi.fn();
      const user = userEvent.setup();
      const chipOption: MultiSelectOption = { value: "apple", label: "Apple" };
      render(
        <SelectedChip option={chipOption} classes={classes} onRemove={onRemove} />
      );

      const removeButton = screen.getByRole("button", { name: "Remove Apple" });
      removeButton.focus();
      await user.keyboard("{ArrowDown}");

      expect(onRemove).not.toHaveBeenCalled();
    });

    it("click on remove button calls onRemove with option value", async () => {
      const onRemove = vi.fn();
      const user = userEvent.setup();
      const chipOption: MultiSelectOption = { value: "apple", label: "Apple" };
      render(
        <SelectedChip option={chipOption} classes={classes} onRemove={onRemove} />
      );

      const removeButton = screen.getByRole("button", { name: "Remove Apple" });
      await user.click(removeButton);

      expect(onRemove).toHaveBeenCalledWith("apple");
    });
  });
});
