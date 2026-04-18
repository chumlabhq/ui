import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMultiSelectDropdown } from "../utils/useMultiSelectDropdown";
import type { MultiSelectOption } from "../utils/types";

const options: MultiSelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", disabled: true },
  { value: "date", label: "Date" },
];

function makeKeyEvent(key: string): React.KeyboardEvent {
  return {
    key,
    preventDefault: vi.fn(),
  } as unknown as React.KeyboardEvent;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderDefault(
  overrides: Partial<Parameters<typeof useMultiSelectDropdown>[0]> = {},
) {
  return renderHook(() =>
    useMultiSelectDropdown({ options, ...overrides }),
  );
}

// ---------------------------------------------------------------------------
// 1. Initial state
// ---------------------------------------------------------------------------

describe("useMultiSelectDropdown", () => {
  describe("initial state", () => {
    it("has isOpen=false by default", () => {
      const { result } = renderDefault();
      expect(result.current.isOpen).toBe(false);
    });

    it("has focusedIndex=-1 by default", () => {
      const { result } = renderDefault();
      expect(result.current.focusedIndex).toBe(-1);
    });

    it("has currentValue=[] by default", () => {
      const { result } = renderDefault();
      expect(result.current.currentValue).toEqual([]);
    });

    it("has isLoadingOptions=false by default", () => {
      const { result } = renderDefault();
      expect(result.current.isLoadingOptions).toBe(false);
    });

    it("displayOptions equals the options prop by default", () => {
      const { result } = renderDefault();
      expect(result.current.displayOptions).toEqual(options);
    });

    it("selectedOptions is empty when nothing is selected", () => {
      const { result } = renderDefault();
      expect(result.current.selectedOptions).toEqual([]);
    });

    it("shouldRestoreFocusRef.current starts as false", () => {
      const { result } = renderDefault();
      expect(result.current.shouldRestoreFocusRef.current).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // 2. defaultValue initialization
  // -------------------------------------------------------------------------

  describe("defaultValue initialization", () => {
    it("initialises currentValue from defaultValue", () => {
      const { result } = renderDefault({ defaultValue: ["apple", "banana"] });
      expect(result.current.currentValue).toEqual(["apple", "banana"]);
    });

    it("populates selectedOptions based on defaultValue", () => {
      const { result } = renderDefault({ defaultValue: ["banana"] });
      expect(result.current.selectedOptions).toEqual([
        { value: "banana", label: "Banana" },
      ]);
    });
  });

  // -------------------------------------------------------------------------
  // 3. handleToggle opens/closes and resets focus
  // -------------------------------------------------------------------------

  describe("handleToggle", () => {
    it("opens the dropdown when closed", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle());
      expect(result.current.isOpen).toBe(true);
    });

    it("closes the dropdown when open", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle());
      act(() => result.current.handleToggle());
      expect(result.current.isOpen).toBe(false);
    });

    it("resets focusedIndex to -1 on open", () => {
      const { result } = renderDefault();
      act(() => result.current.setFocusedIndex(2));
      act(() => result.current.handleToggle());
      expect(result.current.focusedIndex).toBe(-1);
    });

    it("resets focusedIndex to -1 on close", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.setFocusedIndex(1));
      act(() => result.current.handleToggle()); // close
      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  // -------------------------------------------------------------------------
  // 4. handleToggle disabled=true is a no-op
  // -------------------------------------------------------------------------

  describe("handleToggle when disabled", () => {
    it("does not open the dropdown when disabled=true", () => {
      const { result } = renderDefault({ disabled: true });
      act(() => result.current.handleToggle());
      expect(result.current.isOpen).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // 5. handleClose
  // -------------------------------------------------------------------------

  describe("handleClose", () => {
    it("closes the dropdown", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.handleClose());
      expect(result.current.isOpen).toBe(false);
    });

    it("sets shouldRestoreFocusRef.current to true", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.handleClose());
      expect(result.current.shouldRestoreFocusRef.current).toBe(true);
    });

    it("resets focusedIndex to -1", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.setFocusedIndex(1));
      act(() => result.current.handleClose());
      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  // -------------------------------------------------------------------------
  // 6. handleOptionToggle selects / deselects
  // -------------------------------------------------------------------------

  describe("handleOptionToggle", () => {
    it("selects an option", () => {
      const { result } = renderDefault();
      act(() => result.current.handleOptionToggle(options[0]));
      expect(result.current.currentValue).toEqual(["apple"]);
    });

    it("deselects an already-selected option", () => {
      const { result } = renderDefault({ defaultValue: ["apple"] });
      act(() => result.current.handleOptionToggle(options[0]));
      expect(result.current.currentValue).toEqual([]);
    });

    it("calls onValueChange with updated values and selected options on select", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ onValueChange });
      act(() => result.current.handleOptionToggle(options[0]));
      expect(onValueChange).toHaveBeenCalledOnce();
      expect(onValueChange).toHaveBeenCalledWith(
        ["apple"],
        [{ value: "apple", label: "Apple" }],
      );
    });

    it("calls onValueChange with updated values and selected options on deselect", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({
        defaultValue: ["apple", "banana"],
        onValueChange,
      });
      act(() => result.current.handleOptionToggle(options[0])); // remove apple
      expect(onValueChange).toHaveBeenCalledWith(
        ["banana"],
        [{ value: "banana", label: "Banana" }],
      );
    });

    it("accumulates multiple selections", () => {
      const { result } = renderDefault();
      act(() => result.current.handleOptionToggle(options[0]));
      act(() => result.current.handleOptionToggle(options[1]));
      expect(result.current.currentValue).toEqual(["apple", "banana"]);
    });
  });

  // -------------------------------------------------------------------------
  // 7. handleOptionToggle ignores disabled options
  // -------------------------------------------------------------------------

  describe("handleOptionToggle with disabled option", () => {
    it("does not select a disabled option", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ onValueChange });
      act(() => result.current.handleOptionToggle(options[2])); // cherry is disabled
      expect(result.current.currentValue).toEqual([]);
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 8. handleRemoveOption
  // -------------------------------------------------------------------------

  describe("handleRemoveOption", () => {
    it("removes a specific value from current selection", () => {
      const { result } = renderDefault({ defaultValue: ["apple", "banana"] });
      act(() => result.current.handleRemoveOption("apple"));
      expect(result.current.currentValue).toEqual(["banana"]);
    });

    it("calls onValueChange with the remaining values and options", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({
        defaultValue: ["apple", "banana"],
        onValueChange,
      });
      act(() => result.current.handleRemoveOption("apple"));
      expect(onValueChange).toHaveBeenCalledWith(
        ["banana"],
        [{ value: "banana", label: "Banana" }],
      );
    });

    it("is a no-op when the value is not in the selection", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({
        defaultValue: ["banana"],
        onValueChange,
      });
      act(() => result.current.handleRemoveOption("apple"));
      expect(result.current.currentValue).toEqual(["banana"]);
      // onValueChange is still called but with the same values
      expect(onValueChange).toHaveBeenCalledWith(
        ["banana"],
        [{ value: "banana", label: "Banana" }],
      );
    });
  });

  // -------------------------------------------------------------------------
  // 9. Controlled value (value prop)
  // -------------------------------------------------------------------------

  describe("controlled value", () => {
    it("uses value prop as currentValue", () => {
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options, value: ["banana"] }),
      );
      expect(result.current.currentValue).toEqual(["banana"]);
    });

    it("selectedOptions reflects the controlled value", () => {
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options, value: ["apple", "date"] }),
      );
      expect(result.current.selectedOptions).toEqual([
        { value: "apple", label: "Apple" },
        { value: "date", label: "Date" },
      ]);
    });
  });

  // -------------------------------------------------------------------------
  // 10. Controlled open (open prop, onOpenChange called)
  // -------------------------------------------------------------------------

  describe("controlled open", () => {
    it("uses the open prop as isOpen", () => {
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options, open: true }),
      );
      expect(result.current.isOpen).toBe(true);
    });

    it("calls onOpenChange when handleToggle is invoked", () => {
      const onOpenChange = vi.fn();
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options, open: false, onOpenChange }),
      );
      act(() => result.current.handleToggle());
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("calls onOpenChange(false) when handleClose is invoked", () => {
      const onOpenChange = vi.fn();
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options, open: true, onOpenChange }),
      );
      act(() => result.current.handleClose());
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  // -------------------------------------------------------------------------
  // 11. Keyboard: ArrowDown opens and moves focus
  // -------------------------------------------------------------------------

  describe("keyboard – ArrowDown", () => {
    it("opens the dropdown when closed", () => {
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(makeKeyEvent("ArrowDown")));
      expect(result.current.isOpen).toBe(true);
    });

    it("focuses the first enabled option when opening via ArrowDown", () => {
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(makeKeyEvent("ArrowDown")));
      expect(result.current.focusedIndex).toBe(0); // apple is enabled
    });

    it("moves focus to next option when already open", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.setFocusedIndex(0));
      act(() => result.current.handleKeyDown(makeKeyEvent("ArrowDown")));
      expect(result.current.focusedIndex).toBe(1); // banana
    });

    it("wraps from last option to first enabled option", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.setFocusedIndex(3)); // date (last)
      act(() => result.current.handleKeyDown(makeKeyEvent("ArrowDown")));
      expect(result.current.focusedIndex).toBe(0); // wraps to apple
    });

    it("calls preventDefault", () => {
      const { result } = renderDefault();
      const event = makeKeyEvent("ArrowDown");
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 12. Keyboard: ArrowUp moves focus up and wraps
  // -------------------------------------------------------------------------

  describe("keyboard – ArrowUp", () => {
    it("moves focus to the previous option", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.setFocusedIndex(1)); // banana
      act(() => result.current.handleKeyDown(makeKeyEvent("ArrowUp")));
      expect(result.current.focusedIndex).toBe(0); // apple
    });

    it("wraps from first option to last enabled option", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.setFocusedIndex(0)); // apple
      act(() => result.current.handleKeyDown(makeKeyEvent("ArrowUp")));
      expect(result.current.focusedIndex).toBe(3); // date (last enabled)
    });

    it("does nothing when dropdown is closed", () => {
      const { result } = renderDefault();
      act(() => result.current.setFocusedIndex(2));
      act(() => result.current.handleKeyDown(makeKeyEvent("ArrowUp")));
      // focusedIndex unchanged and dropdown still closed
      expect(result.current.isOpen).toBe(false);
    });

    it("calls preventDefault", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      const event = makeKeyEvent("ArrowUp");
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 13. Keyboard: Home / End
  // -------------------------------------------------------------------------

  describe("keyboard – Home", () => {
    it("focuses the first enabled option", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.setFocusedIndex(3));
      act(() => result.current.handleKeyDown(makeKeyEvent("Home")));
      expect(result.current.focusedIndex).toBe(0);
    });

    it("does nothing when dropdown is closed", () => {
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(makeKeyEvent("Home")));
      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  describe("keyboard – End", () => {
    it("focuses the last enabled option", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.setFocusedIndex(0));
      act(() => result.current.handleKeyDown(makeKeyEvent("End")));
      expect(result.current.focusedIndex).toBe(3); // date is the last enabled
    });

    it("does nothing when dropdown is closed", () => {
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(makeKeyEvent("End")));
      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  // -------------------------------------------------------------------------
  // 14. Keyboard: Enter selects the focused option
  // -------------------------------------------------------------------------

  describe("keyboard – Enter", () => {
    it("selects the focused option when open", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ onValueChange });
      act(() => result.current.handleToggle()); // open
      act(() => result.current.setFocusedIndex(0)); // apple
      act(() => result.current.handleKeyDown(makeKeyEvent("Enter")));
      expect(result.current.currentValue).toEqual(["apple"]);
      expect(onValueChange).toHaveBeenCalledWith(
        ["apple"],
        [{ value: "apple", label: "Apple" }],
      );
    });

    it("deselects if the focused option was already selected", () => {
      const { result } = renderDefault({ defaultValue: ["apple"] });
      act(() => result.current.handleToggle()); // open
      act(() => result.current.setFocusedIndex(0)); // apple
      act(() => result.current.handleKeyDown(makeKeyEvent("Enter")));
      expect(result.current.currentValue).toEqual([]);
    });

    it("opens the dropdown when closed and no option is focused", () => {
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(makeKeyEvent("Enter")));
      expect(result.current.isOpen).toBe(true);
    });

    it("does nothing when open but focusedIndex is -1", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ onValueChange });
      act(() => result.current.handleToggle()); // open, focusedIndex=-1
      act(() => result.current.handleKeyDown(makeKeyEvent("Enter")));
      expect(onValueChange).not.toHaveBeenCalled();
      expect(result.current.isOpen).toBe(true);
    });

    it("calls preventDefault", () => {
      const { result } = renderDefault();
      const event = makeKeyEvent("Enter");
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 15. Keyboard: Space selects the focused option
  // -------------------------------------------------------------------------

  describe("keyboard – Space", () => {
    it("selects the focused option when open", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ onValueChange });
      act(() => result.current.handleToggle()); // open
      act(() => result.current.setFocusedIndex(1)); // banana
      act(() => result.current.handleKeyDown(makeKeyEvent(" ")));
      expect(result.current.currentValue).toEqual(["banana"]);
    });

    it("opens the dropdown when closed", () => {
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(makeKeyEvent(" ")));
      expect(result.current.isOpen).toBe(true);
    });

    it("calls preventDefault", () => {
      const { result } = renderDefault();
      const event = makeKeyEvent(" ");
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 16. Keyboard: Escape closes the dropdown
  // -------------------------------------------------------------------------

  describe("keyboard – Escape", () => {
    it("closes the dropdown when open", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.handleKeyDown(makeKeyEvent("Escape")));
      expect(result.current.isOpen).toBe(false);
    });

    it("sets shouldRestoreFocusRef.current to true on Escape", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.handleKeyDown(makeKeyEvent("Escape")));
      expect(result.current.shouldRestoreFocusRef.current).toBe(true);
    });

    it("calls preventDefault when open", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      const event = makeKeyEvent("Escape");
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("does not call preventDefault when already closed", () => {
      const { result } = renderDefault();
      const event = makeKeyEvent("Escape");
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 17. Keyboard: all keys are no-ops when disabled
  // -------------------------------------------------------------------------

  describe("keyboard when disabled", () => {
    const disabledCases: string[] = [
      "Enter",
      " ",
      "Escape",
      "ArrowDown",
      "ArrowUp",
      "Home",
      "End",
    ];

    disabledCases.forEach((key) => {
      it(`${key} does not change state when disabled=true`, () => {
        const onValueChange = vi.fn();
        const onOpenChange = vi.fn();
        const { result } = renderDefault({
          disabled: true,
          onValueChange,
          onOpenChange,
        });
        act(() => result.current.handleKeyDown(makeKeyEvent(key)));
        expect(result.current.isOpen).toBe(false);
        expect(result.current.focusedIndex).toBe(-1);
        expect(onValueChange).not.toHaveBeenCalled();
      });
    });
  });

  // -------------------------------------------------------------------------
  // 18. loadOnOpen: calls onLoadOptions on open, uses loaded options
  // -------------------------------------------------------------------------

  describe("loadOnOpen – loads on toggle", () => {
    it("calls onLoadOptions when toggling open with loadOnOpen=true", async () => {
      const loadedOpts: MultiSelectOption[] = [
        { value: "mango", label: "Mango" },
      ];
      const onLoadOptions = vi.fn().mockResolvedValue(loadedOpts);
      const { result } = renderDefault({ loadOnOpen: true, onLoadOptions });

      await act(async () => {
        result.current.handleToggle();
      });

      expect(onLoadOptions).toHaveBeenCalledOnce();
    });

    it("sets isLoadingOptions to true while loading", async () => {
      let resolveLoad!: (v: MultiSelectOption[]) => void;
      const onLoadOptions = vi.fn(
        () =>
          new Promise<MultiSelectOption[]>((res) => {
            resolveLoad = res;
          }),
      );
      const { result } = renderDefault({ loadOnOpen: true, onLoadOptions });

      act(() => result.current.handleToggle());
      expect(result.current.isLoadingOptions).toBe(true);

      await act(async () => resolveLoad([]));
      expect(result.current.isLoadingOptions).toBe(false);
    });

    it("uses loaded options as displayOptions after load", async () => {
      const loadedOpts: MultiSelectOption[] = [
        { value: "mango", label: "Mango" },
        { value: "papaya", label: "Papaya" },
      ];
      const onLoadOptions = vi.fn().mockResolvedValue(loadedOpts);
      const { result } = renderDefault({ loadOnOpen: true, onLoadOptions });

      await act(async () => result.current.handleToggle());

      expect(result.current.displayOptions).toEqual(loadedOpts);
    });
  });

  // -------------------------------------------------------------------------
  // 19. loadOnOpen: only loads once (hasLoadedRef prevents re-load)
  // -------------------------------------------------------------------------

  describe("loadOnOpen – loads only once", () => {
    it("does not call onLoadOptions a second time on re-open", async () => {
      const loadedOpts: MultiSelectOption[] = [
        { value: "mango", label: "Mango" },
      ];
      const onLoadOptions = vi.fn().mockResolvedValue(loadedOpts);
      const { result } = renderDefault({ loadOnOpen: true, onLoadOptions });

      // First open – loads
      await act(async () => result.current.handleToggle());
      // Close
      await act(async () => result.current.handleToggle());
      // Second open – should NOT reload
      await act(async () => result.current.handleToggle());

      expect(onLoadOptions).toHaveBeenCalledOnce();
    });
  });

  // -------------------------------------------------------------------------
  // 20. onLoadError called on rejection
  // -------------------------------------------------------------------------

  describe("onLoadError", () => {
    it("calls onLoadError when onLoadOptions rejects", async () => {
      const error = new Error("network failure");
      const onLoadOptions = vi.fn().mockRejectedValue(error);
      const onLoadError = vi.fn();
      const { result } = renderDefault({
        loadOnOpen: true,
        onLoadOptions,
        onLoadError,
      });

      await act(async () => result.current.handleToggle());

      expect(onLoadError).toHaveBeenCalledWith(error);
    });

    it("resets isLoadingOptions to false after error", async () => {
      const onLoadOptions = vi.fn().mockRejectedValue(new Error("fail"));
      const { result } = renderDefault({
        loadOnOpen: true,
        onLoadOptions,
        onLoadError: vi.fn(),
      });

      await act(async () => result.current.handleToggle());

      expect(result.current.isLoadingOptions).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // 21. selectedOptions computed correctly
  // -------------------------------------------------------------------------

  describe("selectedOptions", () => {
    it("returns the option objects matching currentValue", () => {
      const { result } = renderDefault({ defaultValue: ["apple", "date"] });
      expect(result.current.selectedOptions).toEqual([
        { value: "apple", label: "Apple" },
        { value: "date", label: "Date" },
      ]);
    });

    it("excludes values that are not present in displayOptions", () => {
      const { result } = renderDefault({ defaultValue: ["notexist"] });
      expect(result.current.selectedOptions).toEqual([]);
    });

    it("updates after handleOptionToggle", () => {
      const { result } = renderDefault();
      act(() => result.current.handleOptionToggle(options[1]));
      expect(result.current.selectedOptions).toEqual([
        { value: "banana", label: "Banana" },
      ]);
    });

    it("updates after handleRemoveOption", () => {
      const { result } = renderDefault({ defaultValue: ["apple", "banana"] });
      act(() => result.current.handleRemoveOption("apple"));
      expect(result.current.selectedOptions).toEqual([
        { value: "banana", label: "Banana" },
      ]);
    });
  });

  // -------------------------------------------------------------------------
  // 22. ArrowDown skips disabled options
  // -------------------------------------------------------------------------

  describe("ArrowDown skips disabled options", () => {
    it("skips the disabled cherry option (index 2) when moving down from banana (index 1)", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.setFocusedIndex(1)); // banana
      act(() => result.current.handleKeyDown(makeKeyEvent("ArrowDown")));
      // cherry (index 2) is disabled, so should land on date (index 3)
      expect(result.current.focusedIndex).toBe(3);
    });

    it("skips disabled options when focusing first item via ArrowDown from closed", () => {
      const disabledFirstOptions: MultiSelectOption[] = [
        { value: "alpha", label: "Alpha", disabled: true },
        { value: "beta", label: "Beta" },
      ];
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: disabledFirstOptions }),
      );
      act(() => result.current.handleKeyDown(makeKeyEvent("ArrowDown")));
      expect(result.current.focusedIndex).toBe(1); // beta, since alpha is disabled
    });

    it("ArrowUp skips the disabled cherry option when moving up from date (index 3)", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle()); // open
      act(() => result.current.setFocusedIndex(3)); // date
      act(() => result.current.handleKeyDown(makeKeyEvent("ArrowUp")));
      // cherry (index 2) is disabled, so should land on banana (index 1)
      expect(result.current.focusedIndex).toBe(1);
    });
  });

  // -------------------------------------------------------------------------
  // Additional edge cases
  // -------------------------------------------------------------------------

  describe("defaultOpen", () => {
    it("starts open when defaultOpen=true", () => {
      const { result } = renderDefault({ defaultOpen: true });
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe("displayOptions fallback", () => {
    it("uses options prop when onLoadOptions is set but no options have loaded yet", () => {
      const onLoadOptions = vi.fn(
        () =>
          new Promise<MultiSelectOption[]>(() => {
            // never resolves during test
          }),
      );
      const { result } = renderDefault({ loadOnOpen: true, onLoadOptions });
      // Before toggling open, loadedOptions is empty → should use options prop
      expect(result.current.displayOptions).toEqual(options);
    });

    it("falls back to options prop when onLoadOptions is not provided", () => {
      const { result } = renderDefault();
      expect(result.current.displayOptions).toEqual(options);
    });
  });

  describe("setFocusedIndex", () => {
    it("updates the focused index directly", () => {
      const { result } = renderDefault();
      act(() => result.current.setFocusedIndex(2));
      expect(result.current.focusedIndex).toBe(2);
    });
  });
});
