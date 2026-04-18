import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMultiSelectDropdown } from "../utils/useMultiSelectDropdown";
import type { MultiSelectOption } from "../utils/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeKey(key: string): React.KeyboardEvent {
  return {
    key,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as unknown as React.KeyboardEvent;
}

const OPTIONS: MultiSelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

const OPTIONS_WITH_DISABLED: MultiSelectOption[] = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta", disabled: true },
  { value: "gamma", label: "Gamma" },
];

function renderDefault(
  overrides: Partial<Parameters<typeof useMultiSelectDropdown>[0]> = {},
) {
  return renderHook(() => useMultiSelectDropdown({ options: OPTIONS, ...overrides }));
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe("useMultiSelectDropdown", () => {
  // -------------------------------------------------------------------------
  // 1. Initial state
  // -------------------------------------------------------------------------
  describe("initial state", () => {
    it("defaults: isOpen=false, searchQuery='', focusedIndex=-1, selectedValues=[]", () => {
      const { result } = renderDefault();
      expect(result.current.isOpen).toBe(false);
      expect(result.current.searchQuery).toBe("");
      expect(result.current.focusedIndex).toBe(-1);
      expect(result.current.selectedValues).toEqual([]);
      expect(result.current.selectedOptions).toEqual([]);
      expect(result.current.isSearching).toBe(false);
      expect(result.current.isLoadingInitial).toBe(false);
    });

    it("displayOptions equals the options prop when no filter/async", () => {
      const { result } = renderDefault();
      expect(result.current.displayOptions).toEqual(OPTIONS);
    });

    it("shouldRestoreFocusRef.current starts as false", () => {
      const { result } = renderDefault();
      expect(result.current.shouldRestoreFocusRef.current).toBe(false);
    });

    it("honours defaultValue", () => {
      const { result } = renderDefault({ defaultValue: ["banana"] });
      expect(result.current.selectedValues).toEqual(["banana"]);
      expect(result.current.selectedOptions).toEqual([OPTIONS[1]]);
    });

    it("honours defaultOpen=true", () => {
      const { result } = renderDefault({ defaultOpen: true });
      expect(result.current.isOpen).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // 2. handleToggle opens/closes, resets searchQuery on close
  // -------------------------------------------------------------------------
  describe("handleToggle", () => {
    it("opens when closed", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle());
      expect(result.current.isOpen).toBe(true);
    });

    it("closes when open", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle());
      act(() => result.current.handleToggle());
      expect(result.current.isOpen).toBe(false);
    });

    it("resets searchQuery and focusedIndex on close", () => {
      const { result } = renderDefault();
      act(() => result.current.handleToggle());
      act(() => result.current.setSearchQuery("app"));
      act(() => result.current.setFocusedIndex(1));
      act(() => result.current.handleToggle()); // close
      expect(result.current.searchQuery).toBe("");
      expect(result.current.focusedIndex).toBe(-1);
    });

    it("resets focusedIndex on open", () => {
      const { result } = renderDefault();
      act(() => result.current.setFocusedIndex(2));
      act(() => result.current.handleToggle()); // open
      expect(result.current.focusedIndex).toBe(-1);
    });

    it("calls onOpenChange with the new open value", () => {
      const onOpenChange = vi.fn();
      const { result } = renderDefault({ onOpenChange });
      act(() => result.current.handleToggle());
      expect(onOpenChange).toHaveBeenCalledWith(true);
      act(() => result.current.handleToggle());
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  // -------------------------------------------------------------------------
  // 3. handleToggle with disabled=true: no-op
  // -------------------------------------------------------------------------
  describe("handleToggle when disabled", () => {
    it("does not open when disabled=true", () => {
      const { result } = renderDefault({ disabled: true });
      act(() => result.current.handleToggle());
      expect(result.current.isOpen).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // 4. Sync mode: setSearchQuery filters displayOptions
  // -------------------------------------------------------------------------
  describe("sync filtering", () => {
    it("filters displayOptions by searchQuery (case-insensitive)", () => {
      const { result } = renderDefault({ showSearch: true });
      act(() => result.current.setSearchQuery("ban"));
      expect(result.current.displayOptions).toEqual([OPTIONS[1]]); // Banana
    });

    it("returns all options when searchQuery is empty", () => {
      const { result } = renderDefault({ showSearch: true });
      act(() => result.current.setSearchQuery(""));
      expect(result.current.displayOptions).toEqual(OPTIONS);
    });

    it("returns empty array when no options match", () => {
      const { result } = renderDefault({ showSearch: true });
      act(() => result.current.setSearchQuery("zzz"));
      expect(result.current.displayOptions).toEqual([]);
    });

    it("treats whitespace-only query as empty (shows all)", () => {
      const { result } = renderDefault({ showSearch: true });
      act(() => result.current.setSearchQuery("   "));
      expect(result.current.displayOptions).toEqual(OPTIONS);
    });

    it("partial match on label is case-insensitive", () => {
      const { result } = renderDefault({ showSearch: true });
      act(() => result.current.setSearchQuery("CHER"));
      expect(result.current.displayOptions).toEqual([OPTIONS[2]]); // Cherry
    });
  });

  // -------------------------------------------------------------------------
  // 5. showSearch=false: displayOptions not filtered by searchQuery
  // -------------------------------------------------------------------------
  describe("showSearch=false", () => {
    it("displayOptions is not filtered by searchQuery when showSearch=false", () => {
      const { result } = renderDefault({ showSearch: false });
      act(() => result.current.setSearchQuery("ban"));
      expect(result.current.displayOptions).toEqual(OPTIONS);
    });
  });

  // -------------------------------------------------------------------------
  // 6. handleOptionToggle: selects, deselects, calls onValueChange
  // -------------------------------------------------------------------------
  describe("handleOptionToggle", () => {
    it("selects an option and calls onValueChange", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ onValueChange });
      act(() => result.current.handleOptionToggle(OPTIONS[0]));
      expect(result.current.selectedValues).toEqual(["apple"]);
      expect(onValueChange).toHaveBeenCalledWith(["apple"], [OPTIONS[0]]);
    });

    it("deselects an already-selected option", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ defaultValue: ["apple"], onValueChange });
      act(() => result.current.handleOptionToggle(OPTIONS[0]));
      expect(result.current.selectedValues).toEqual([]);
      expect(onValueChange).toHaveBeenCalledWith([], []);
    });

    it("allows selecting multiple options", () => {
      const { result } = renderDefault();
      act(() => result.current.handleOptionToggle(OPTIONS[0]));
      act(() => result.current.handleOptionToggle(OPTIONS[2]));
      expect(result.current.selectedValues).toEqual(["apple", "cherry"]);
    });
  });

  // -------------------------------------------------------------------------
  // 7. handleOptionToggle: skips disabled options
  // -------------------------------------------------------------------------
  describe("handleOptionToggle with disabled option", () => {
    it("does not toggle a disabled option", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: OPTIONS_WITH_DISABLED, onValueChange })
      );
      act(() => result.current.handleOptionToggle(OPTIONS_WITH_DISABLED[1])); // beta disabled
      expect(result.current.selectedValues).toEqual([]);
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 8. handleRemoveOption: removes value, calls onValueChange
  // -------------------------------------------------------------------------
  describe("handleRemoveOption", () => {
    it("removes a selected value and calls onValueChange", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ defaultValue: ["apple", "cherry"], onValueChange });
      act(() => result.current.handleRemoveOption("apple"));
      expect(result.current.selectedValues).toEqual(["cherry"]);
      expect(onValueChange).toHaveBeenCalledWith(["cherry"], [OPTIONS[2]]);
    });

    it("leaves other values intact", () => {
      const { result } = renderDefault({ defaultValue: ["apple", "banana", "cherry"] });
      act(() => result.current.handleRemoveOption("banana"));
      expect(result.current.selectedValues).toEqual(["apple", "cherry"]);
    });

    it("results in empty selection when last value is removed", () => {
      const { result } = renderDefault({ defaultValue: ["apple"] });
      act(() => result.current.handleRemoveOption("apple"));
      expect(result.current.selectedValues).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // 9. handleClose: sets shouldRestoreFocusRef.current=true
  // -------------------------------------------------------------------------
  describe("handleClose", () => {
    it("sets shouldRestoreFocusRef.current to true", () => {
      const { result } = renderDefault({ defaultOpen: true });
      act(() => result.current.handleClose());
      expect(result.current.shouldRestoreFocusRef.current).toBe(true);
    });

    it("closes the dropdown", () => {
      const { result } = renderDefault({ defaultOpen: true });
      act(() => result.current.handleClose());
      expect(result.current.isOpen).toBe(false);
    });

    it("resets searchQuery and focusedIndex", () => {
      const { result } = renderDefault({ defaultOpen: true });
      act(() => result.current.setSearchQuery("app"));
      act(() => result.current.setFocusedIndex(0));
      act(() => result.current.handleClose());
      expect(result.current.searchQuery).toBe("");
      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  // -------------------------------------------------------------------------
  // 10. Controlled values (value prop) + controlled open
  // -------------------------------------------------------------------------
  describe("controlled mode", () => {
    it("respects controlled value prop", () => {
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: OPTIONS, value: ["banana"] })
      );
      expect(result.current.selectedValues).toEqual(["banana"]);
    });

    it("respects controlled open prop", () => {
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: OPTIONS, open: true })
      );
      expect(result.current.isOpen).toBe(true);
    });

    it("calls onOpenChange but does not change internal open when controlled", () => {
      const onOpenChange = vi.fn();
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: OPTIONS, open: false, onOpenChange })
      );
      act(() => result.current.handleToggle());
      expect(result.current.isOpen).toBe(false);
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("calls onOpenChange(false) when handleClose is invoked in controlled mode", () => {
      const onOpenChange = vi.fn();
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: OPTIONS, open: true, onOpenChange })
      );
      act(() => result.current.handleClose());
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  // -------------------------------------------------------------------------
  // 11. Keyboard ArrowDown: opens when closed, moves focus, wraps, skips disabled
  // -------------------------------------------------------------------------
  describe("keyboard: ArrowDown", () => {
    it("opens dropdown and focuses first enabled option when closed", () => {
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(makeKey("ArrowDown")));
      expect(result.current.isOpen).toBe(true);
      expect(result.current.focusedIndex).toBe(0);
    });

    it("moves focus to next option when already open", () => {
      const { result } = renderDefault({ defaultOpen: true });
      act(() => result.current.setFocusedIndex(0));
      act(() => result.current.handleKeyDown(makeKey("ArrowDown")));
      expect(result.current.focusedIndex).toBe(1);
    });

    it("wraps from last to first", () => {
      const { result } = renderDefault({ defaultOpen: true });
      act(() => result.current.setFocusedIndex(OPTIONS.length - 1));
      act(() => result.current.handleKeyDown(makeKey("ArrowDown")));
      expect(result.current.focusedIndex).toBe(0);
    });

    it("skips disabled options when moving down", () => {
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: OPTIONS_WITH_DISABLED, defaultOpen: true })
      );
      act(() => result.current.setFocusedIndex(0)); // alpha
      act(() => result.current.handleKeyDown(makeKey("ArrowDown")));
      // beta (index 1) is disabled → lands on gamma (index 2)
      expect(result.current.focusedIndex).toBe(2);
    });

    it("focuses first enabled index when first option is disabled (open via ArrowDown)", () => {
      const opts: MultiSelectOption[] = [
        { value: "a", label: "A", disabled: true },
        { value: "b", label: "B" },
      ];
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: opts })
      );
      act(() => result.current.handleKeyDown(makeKey("ArrowDown")));
      expect(result.current.focusedIndex).toBe(1);
    });

    it("calls preventDefault", () => {
      const event = makeKey("ArrowDown");
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 12. Keyboard ArrowUp: moves up, wraps
  // -------------------------------------------------------------------------
  describe("keyboard: ArrowUp", () => {
    it("moves focus to previous option", () => {
      const { result } = renderDefault({ defaultOpen: true });
      act(() => result.current.setFocusedIndex(2));
      act(() => result.current.handleKeyDown(makeKey("ArrowUp")));
      expect(result.current.focusedIndex).toBe(1);
    });

    it("wraps from first to last", () => {
      const { result } = renderDefault({ defaultOpen: true });
      act(() => result.current.setFocusedIndex(0));
      act(() => result.current.handleKeyDown(makeKey("ArrowUp")));
      expect(result.current.focusedIndex).toBe(OPTIONS.length - 1);
    });

    it("skips disabled options when moving up", () => {
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: OPTIONS_WITH_DISABLED, defaultOpen: true })
      );
      act(() => result.current.setFocusedIndex(2)); // gamma
      act(() => result.current.handleKeyDown(makeKey("ArrowUp")));
      // beta (index 1) is disabled → lands on alpha (index 0)
      expect(result.current.focusedIndex).toBe(0);
    });

    it("does not open/move focus when dropdown is closed", () => {
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(makeKey("ArrowUp")));
      expect(result.current.isOpen).toBe(false);
      expect(result.current.focusedIndex).toBe(-1);
    });

    it("calls preventDefault", () => {
      const event = makeKey("ArrowUp");
      const { result } = renderDefault({ defaultOpen: true });
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 13. Keyboard Home/End
  // -------------------------------------------------------------------------
  describe("keyboard: Home", () => {
    it("focuses first enabled option", () => {
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: OPTIONS_WITH_DISABLED, defaultOpen: true })
      );
      act(() => result.current.setFocusedIndex(2));
      act(() => result.current.handleKeyDown(makeKey("Home")));
      expect(result.current.focusedIndex).toBe(0); // alpha is enabled
    });

    it("calls preventDefault", () => {
      const event = makeKey("Home");
      const { result } = renderDefault({ defaultOpen: true });
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("does not change focusedIndex when dropdown is closed", () => {
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(makeKey("Home")));
      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  describe("keyboard: End", () => {
    it("focuses last enabled option", () => {
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: OPTIONS_WITH_DISABLED, defaultOpen: true })
      );
      act(() => result.current.setFocusedIndex(0));
      act(() => result.current.handleKeyDown(makeKey("End")));
      expect(result.current.focusedIndex).toBe(2); // gamma is last enabled
    });

    it("calls preventDefault", () => {
      const event = makeKey("End");
      const { result } = renderDefault({ defaultOpen: true });
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("does not change focusedIndex when dropdown is closed", () => {
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(makeKey("End")));
      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  // -------------------------------------------------------------------------
  // 14. Keyboard Enter: opens when closed; selects when open+focused
  // -------------------------------------------------------------------------
  describe("keyboard: Enter", () => {
    it("opens dropdown when closed", () => {
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(makeKey("Enter")));
      expect(result.current.isOpen).toBe(true);
    });

    it("selects focused option when open", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ defaultOpen: true, onValueChange });
      act(() => result.current.setFocusedIndex(1));
      act(() => result.current.handleKeyDown(makeKey("Enter")));
      expect(result.current.selectedValues).toEqual(["banana"]);
      expect(onValueChange).toHaveBeenCalledWith(["banana"], [OPTIONS[1]]);
    });

    it("deselects focused option when already selected", () => {
      const { result } = renderDefault({ defaultOpen: true, defaultValue: ["apple"] });
      act(() => result.current.setFocusedIndex(0));
      act(() => result.current.handleKeyDown(makeKey("Enter")));
      expect(result.current.selectedValues).toEqual([]);
    });

    it("does nothing when open but focusedIndex=-1", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ defaultOpen: true, onValueChange });
      act(() => result.current.handleKeyDown(makeKey("Enter")));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("calls preventDefault", () => {
      const event = makeKey("Enter");
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 15. Keyboard Space: when showSearch+isOpen, does NOT prevent default/select
  // -------------------------------------------------------------------------
  describe("keyboard: Space when showSearch=true and open", () => {
    it("does NOT call preventDefault", () => {
      const event = makeKey(" ");
      const { result } = renderDefault({ showSearch: true, defaultOpen: true });
      act(() => result.current.setFocusedIndex(0));
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it("does NOT toggle selection", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ showSearch: true, defaultOpen: true, onValueChange });
      act(() => result.current.setFocusedIndex(0));
      act(() => result.current.handleKeyDown(makeKey(" ")));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 16. Keyboard Space: when !showSearch, selects focused
  // -------------------------------------------------------------------------
  describe("keyboard: Space when showSearch=false", () => {
    it("opens dropdown when closed", () => {
      const { result } = renderDefault({ showSearch: false });
      act(() => result.current.handleKeyDown(makeKey(" ")));
      expect(result.current.isOpen).toBe(true);
    });

    it("selects focused option when open", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ showSearch: false, defaultOpen: true, onValueChange });
      act(() => result.current.setFocusedIndex(2));
      act(() => result.current.handleKeyDown(makeKey(" ")));
      expect(result.current.selectedValues).toEqual(["cherry"]);
      expect(onValueChange).toHaveBeenCalledWith(["cherry"], [OPTIONS[2]]);
    });

    it("calls preventDefault", () => {
      const event = makeKey(" ");
      const { result } = renderDefault({ showSearch: false });
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 17. Keyboard Escape: closes
  // -------------------------------------------------------------------------
  describe("keyboard: Escape", () => {
    it("closes the dropdown when open", () => {
      const { result } = renderDefault({ defaultOpen: true });
      act(() => result.current.handleKeyDown(makeKey("Escape")));
      expect(result.current.isOpen).toBe(false);
    });

    it("sets shouldRestoreFocusRef.current=true", () => {
      const { result } = renderDefault({ defaultOpen: true });
      act(() => result.current.handleKeyDown(makeKey("Escape")));
      expect(result.current.shouldRestoreFocusRef.current).toBe(true);
    });

    it("calls preventDefault when open", () => {
      const event = makeKey("Escape");
      const { result } = renderDefault({ defaultOpen: true });
      act(() => result.current.handleKeyDown(event));
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("does nothing when already closed", () => {
      const event = makeKey("Escape");
      const { result } = renderDefault();
      act(() => result.current.handleKeyDown(event));
      expect(result.current.isOpen).toBe(false);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 18. Async mode: isAsync detection and synchronous state
  // -------------------------------------------------------------------------
  describe("async mode: isAsync detection", () => {
    it("in async mode, empty query shows allInitialOptions", () => {
      const onSearch = vi.fn().mockResolvedValue([]);
      const initialOpts: MultiSelectOption[] = [{ value: "i1", label: "I1" }];
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: [], onSearch, initialOptions: initialOpts })
      );
      expect(result.current.displayOptions).toEqual(initialOpts);
    });

    it("in async mode, non-empty searchQuery sets isSearching=true before debounce fires", () => {
      const onSearch = vi.fn().mockResolvedValue([]);
      const { result } = renderHook(() =>
        // large debounce ensures timeout doesn't fire during synchronous assertions
        useMultiSelectDropdown({ options: [], onSearch, searchDebounceMs: 60_000 })
      );
      act(() => result.current.setSearchQuery("foo"));
      expect(result.current.isSearching).toBe(true);
      expect(result.current.displayOptions).toEqual([]);
    });

    it("in async mode, clearing searchQuery resets isSearching to false immediately", () => {
      const onSearch = vi.fn().mockResolvedValue([]);
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: [], onSearch, searchDebounceMs: 60_000 })
      );
      act(() => result.current.setSearchQuery("foo"));
      expect(result.current.isSearching).toBe(true);
      act(() => result.current.setSearchQuery(""));
      expect(result.current.isSearching).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // 22. selectedOptions computed from allOptions
  // -------------------------------------------------------------------------
  describe("selectedOptions computation", () => {
    it("returns selectedOptions matching selectedValues from options", () => {
      const { result } = renderDefault({ defaultValue: ["apple", "cherry"] });
      expect(result.current.selectedOptions).toEqual([OPTIONS[0], OPTIONS[2]]);
    });

    it("returns empty array when no values are selected", () => {
      const { result } = renderDefault();
      expect(result.current.selectedOptions).toEqual([]);
    });

    it("ignores values that have no matching option", () => {
      const { result } = renderDefault({ defaultValue: ["nonexistent"] });
      expect(result.current.selectedOptions).toEqual([]);
    });

    it("updates after handleOptionToggle", () => {
      const { result } = renderDefault();
      act(() => result.current.handleOptionToggle(OPTIONS[1]));
      expect(result.current.selectedOptions).toEqual([OPTIONS[1]]);
    });

    it("updates after handleRemoveOption", () => {
      const { result } = renderDefault({ defaultValue: ["apple", "banana"] });
      act(() => result.current.handleRemoveOption("apple"));
      expect(result.current.selectedOptions).toEqual([OPTIONS[1]]);
    });
  });

  // -------------------------------------------------------------------------
  // 23. initialOptions prop (synchronous aspects)
  // -------------------------------------------------------------------------
  describe("initialOptions prop (sync)", () => {
    it("makes initialOptions available in displayOptions (async, empty query)", () => {
      const initialOpts: MultiSelectOption[] = [
        { value: "init1", label: "Initial 1" },
        { value: "init2", label: "Initial 2" },
      ];
      const onSearch = vi.fn().mockResolvedValue([]);
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: [], onSearch, initialOptions: initialOpts })
      );
      expect(result.current.displayOptions).toEqual(initialOpts);
    });

    it("includes initialOptions in selectedOptions computation", () => {
      const initialOpts: MultiSelectOption[] = [
        { value: "init1", label: "Initial 1" },
      ];
      const onSearch = vi.fn().mockResolvedValue([]);
      const { result } = renderHook(() =>
        useMultiSelectDropdown({
          options: [],
          onSearch,
          initialOptions: initialOpts,
          defaultValue: ["init1"],
        })
      );
      expect(result.current.selectedValues).toEqual(["init1"]);
      expect(result.current.selectedOptions).toEqual(initialOpts);
    });

    it("initialOptions NOT included in sync displayOptions (isAsync=false)", () => {
      const initialOpts: MultiSelectOption[] = [{ value: "init1", label: "Initial 1" }];
      const { result } = renderHook(() =>
        useMultiSelectDropdown({ options: OPTIONS, initialOptions: initialOpts })
      );
      // no onSearch → isAsync=false → displayOptions = filteredSyncOptions = options
      expect(result.current.displayOptions).toEqual(OPTIONS);
    });
  });

  // -------------------------------------------------------------------------
  // Extra: disabled prop makes handleKeyDown a no-op
  // -------------------------------------------------------------------------
  describe("handleKeyDown when disabled", () => {
    it("Enter does nothing when disabled=true", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ disabled: true, defaultOpen: true, onValueChange });
      act(() => result.current.handleKeyDown(makeKey("Enter")));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("ArrowDown does nothing when disabled=true", () => {
      const { result } = renderDefault({ disabled: true });
      act(() => result.current.handleKeyDown(makeKey("ArrowDown")));
      expect(result.current.isOpen).toBe(false);
    });

    it("Space does nothing when disabled=true", () => {
      const onValueChange = vi.fn();
      const { result } = renderDefault({ disabled: true, onValueChange });
      act(() => result.current.handleKeyDown(makeKey(" ")));
      expect(onValueChange).not.toHaveBeenCalled();
      expect(result.current.isOpen).toBe(false);
    });

    it("Escape does nothing when disabled=true", () => {
      const { result } = renderDefault({ disabled: true, defaultOpen: true });
      act(() => result.current.handleKeyDown(makeKey("Escape")));
      // disabled → no-op, isOpen stays true
      expect(result.current.isOpen).toBe(true);
    });

    it("Home does nothing when disabled=true", () => {
      const { result } = renderDefault({ disabled: true, defaultOpen: true });
      act(() => result.current.setFocusedIndex(2));
      act(() => result.current.handleKeyDown(makeKey("Home")));
      // focusedIndex unchanged (disabled)
      expect(result.current.focusedIndex).toBe(2);
    });
  });
});
