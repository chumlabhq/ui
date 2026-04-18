import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDropdown } from "../utils/useDropdown";

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", disabled: true },
  { value: "date", label: "Date" },
];

// Helper: build a minimal synthetic KeyboardEvent-like object accepted by handleKeyDown
function makeKeyEvent(
  key: string,
  overrides: Partial<React.KeyboardEvent> = {},
): React.KeyboardEvent {
  return {
    key,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    target: { tagName: "BUTTON" } as unknown as EventTarget,
    ...overrides,
  } as unknown as React.KeyboardEvent;
}

// Helper: build a key event that pretends to come from an <INPUT> element
function makeInputKeyEvent(
  key: string,
  overrides: Partial<React.KeyboardEvent> = {},
): React.KeyboardEvent {
  return makeKeyEvent(key, {
    target: { tagName: "INPUT" } as unknown as EventTarget,
    ...overrides,
  });
}

// Helper: build a minimal synthetic MouseEvent-like object for handleClear
function makeMouseEvent(): React.MouseEvent {
  return {
    stopPropagation: vi.fn(),
  } as unknown as React.MouseEvent;
}

// ---------------------------------------------------------------------------
// 1. Initial state defaults
// ---------------------------------------------------------------------------

describe("useDropdown – initial state", () => {
  it("defaults: isOpen=false, searchQuery='', focusedIndex=-1", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.focusedIndex).toBe(-1);
  });

  it("defaults: isSearching=false, isLoadingInitial=false", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    expect(result.current.isSearching).toBe(false);
    expect(result.current.isLoadingInitial).toBe(false);
  });

  it("defaults: selectedOption=null, internalValue=null", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    expect(result.current.selectedOption).toBeNull();
    expect(result.current.internalValue).toBeNull();
  });

  it("defaults: displayOptions equals options when no search", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    expect(result.current.displayOptions).toEqual(options);
  });

  it("defaults: shouldRestoreFocusRef.current=false", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    expect(result.current.shouldRestoreFocusRef.current).toBe(false);
  });

  it("defaultOpen=true opens the dropdown initially", () => {
    const { result } = renderHook(() => useDropdown({ options, defaultOpen: true }));
    expect(result.current.isOpen).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. defaultValue initialization
// ---------------------------------------------------------------------------

describe("useDropdown – defaultValue", () => {
  it("sets internalValue to defaultValue", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "banana" }),
    );
    expect(result.current.internalValue).toBe("banana");
  });

  it("sets selectedOption when defaultValue matches an option", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "apple" }),
    );
    expect(result.current.selectedOption).toEqual(options[0]);
  });

  it("selectedOption is null when defaultValue does not match any option", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "grape" }),
    );
    expect(result.current.selectedOption).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 3. handleOpen
// ---------------------------------------------------------------------------

describe("useDropdown – handleOpen", () => {
  it("opens the dropdown", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    act(() => result.current.handleOpen());
    expect(result.current.isOpen).toBe(true);
  });

  it("is a no-op when disabled=true", () => {
    const { result } = renderHook(() => useDropdown({ options, disabled: true }));
    act(() => result.current.handleOpen());
    expect(result.current.isOpen).toBe(false);
  });

  it("calls onOpenChange(true) when opening", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useDropdown({ options, onOpenChange }));
    act(() => result.current.handleOpen());
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calling handleOpen while already open is harmless", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useDropdown({ options, onOpenChange }));
    act(() => result.current.handleOpen());
    act(() => result.current.handleOpen());
    // onOpenChange called once for the actual transition; second call is same value → no-op per useControllableState
    expect(result.current.isOpen).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 4. handleClose
// ---------------------------------------------------------------------------

describe("useDropdown – handleClose", () => {
  it("closes the dropdown", () => {
    const { result } = renderHook(() => useDropdown({ options, defaultOpen: true }));
    act(() => result.current.handleClose());
    expect(result.current.isOpen).toBe(false);
  });

  it("clears searchQuery", () => {
    const { result } = renderHook(() => useDropdown({ options, defaultOpen: true }));
    act(() => result.current.setSearchQuery("ban"));
    act(() => result.current.handleClose());
    expect(result.current.searchQuery).toBe("");
  });

  it("resets focusedIndex to -1", () => {
    const { result } = renderHook(() => useDropdown({ options, defaultOpen: true }));
    act(() => result.current.setFocusedIndex(2));
    act(() => result.current.handleClose());
    expect(result.current.focusedIndex).toBe(-1);
  });

  it("sets shouldRestoreFocusRef.current to true", () => {
    const { result } = renderHook(() => useDropdown({ options, defaultOpen: true }));
    act(() => result.current.handleClose());
    expect(result.current.shouldRestoreFocusRef.current).toBe(true);
  });

  it("calls onOpenChange(false)", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, onOpenChange }),
    );
    act(() => result.current.handleClose());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ---------------------------------------------------------------------------
// 5. handleToggle
// ---------------------------------------------------------------------------

describe("useDropdown – handleToggle", () => {
  it("opens when closed", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    act(() => result.current.handleToggle());
    expect(result.current.isOpen).toBe(true);
  });

  it("closes when open", () => {
    const { result } = renderHook(() => useDropdown({ options, defaultOpen: true }));
    act(() => result.current.handleToggle());
    expect(result.current.isOpen).toBe(false);
  });

  it("resets state when closing via toggle", () => {
    const { result } = renderHook(() => useDropdown({ options, defaultOpen: true }));
    act(() => result.current.setFocusedIndex(1));
    act(() => result.current.handleToggle());
    expect(result.current.focusedIndex).toBe(-1);
    expect(result.current.shouldRestoreFocusRef.current).toBe(true);
  });

  it("is a no-op when disabled=true (closed)", () => {
    const { result } = renderHook(() => useDropdown({ options, disabled: true }));
    act(() => result.current.handleToggle());
    expect(result.current.isOpen).toBe(false);
  });

  it("is a no-op when disabled=true (open controlled)", () => {
    // Even when we try to toggle, disabled prevents it
    const { result } = renderHook(() =>
      useDropdown({ options, disabled: true }),
    );
    act(() => result.current.handleToggle());
    expect(result.current.isOpen).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 6. handleClear
// ---------------------------------------------------------------------------

describe("useDropdown – handleClear", () => {
  it("calls event.stopPropagation()", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "apple", clearable: true }),
    );
    const event = makeMouseEvent();
    act(() => result.current.handleClear(event));
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
  });

  it("sets internalValue to null", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "apple", clearable: true }),
    );
    const event = makeMouseEvent();
    act(() => result.current.handleClear(event));
    expect(result.current.internalValue).toBeNull();
  });

  it("calls onValueChange(null, null) after clear", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "apple", clearable: true, onValueChange }),
    );
    const event = makeMouseEvent();
    act(() => result.current.handleClear(event));
    expect(onValueChange).toHaveBeenCalledWith(null, null);
  });

  it("sets selectedOption to null after clear", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "apple", clearable: true }),
    );
    const event = makeMouseEvent();
    act(() => result.current.handleClear(event));
    expect(result.current.selectedOption).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 7. handleOptionSelect
// ---------------------------------------------------------------------------

describe("useDropdown – handleOptionSelect", () => {
  it("sets internalValue to the selected option's value", () => {
    const { result } = renderHook(() => useDropdown({ options, defaultOpen: true }));
    act(() => result.current.handleOptionSelect(options[1])); // banana
    expect(result.current.internalValue).toBe("banana");
  });

  it("closes the dropdown after selection", () => {
    const { result } = renderHook(() => useDropdown({ options, defaultOpen: true }));
    act(() => result.current.handleOptionSelect(options[0]));
    expect(result.current.isOpen).toBe(false);
  });

  it("updates selectedOption after selection", () => {
    const { result } = renderHook(() => useDropdown({ options, defaultOpen: true }));
    act(() => result.current.handleOptionSelect(options[0])); // apple
    expect(result.current.selectedOption).toEqual(options[0]);
  });

  it("is a no-op when the option is disabled", () => {
    const { result } = renderHook(() => useDropdown({ options, defaultOpen: true }));
    act(() => result.current.handleOptionSelect(options[2])); // cherry – disabled
    expect(result.current.internalValue).toBeNull();
    expect(result.current.isOpen).toBe(true);
  });

  it("calls onValueChange with the option value and option object", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, onValueChange }),
    );
    act(() => result.current.handleOptionSelect(options[3])); // date
    expect(onValueChange).toHaveBeenCalledWith("date", options[3]);
  });
});

// ---------------------------------------------------------------------------
// 8. Controlled value + onValueChange
// ---------------------------------------------------------------------------

describe("useDropdown – controlled value", () => {
  it("uses the controlled value prop", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, value: "banana" }),
    );
    expect(result.current.internalValue).toBe("banana");
    expect(result.current.selectedOption).toEqual(options[1]);
  });

  it("does not update internalValue when controlled (selection ignored internally)", () => {
    // In controlled mode, value is the source of truth; the hook calls onValueChange
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({ options, value: "banana", onValueChange, defaultOpen: true }),
    );
    act(() => result.current.handleOptionSelect(options[0])); // apple
    expect(onValueChange).toHaveBeenCalledWith("apple", options[0]);
    // internalValue stays as controlled prop "banana"
    expect(result.current.internalValue).toBe("banana");
  });

  it("onValueChange receives option object matching the selected value", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({ options, onValueChange, defaultOpen: true }),
    );
    act(() => result.current.handleOptionSelect(options[3])); // date
    const [, passedOption] = onValueChange.mock.calls[0];
    expect(passedOption).toEqual(options[3]);
  });
});

// ---------------------------------------------------------------------------
// 9. Controlled open + onOpenChange
// ---------------------------------------------------------------------------

describe("useDropdown – controlled open", () => {
  it("respects controlled open=true", () => {
    const { result } = renderHook(() => useDropdown({ options, open: true }));
    expect(result.current.isOpen).toBe(true);
  });

  it("respects controlled open=false", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, open: false }),
    );
    expect(result.current.isOpen).toBe(false);
  });

  it("calls onOpenChange when opening", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({ options, open: false, onOpenChange }),
    );
    act(() => result.current.handleOpen());
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onOpenChange(false) when closing", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({ options, open: true, onOpenChange }),
    );
    act(() => result.current.handleClose());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ---------------------------------------------------------------------------
// 10. Sync filtering via setSearchQuery
// ---------------------------------------------------------------------------

describe("useDropdown – sync filtering", () => {
  it("filters displayOptions by searchQuery (case-insensitive)", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    act(() => result.current.setSearchQuery("an"));
    // "banana" contains "an"; "Apple", "Cherry", "Date" do not
    expect(result.current.displayOptions).toEqual([options[1]]); // banana
  });

  it("returns all options when searchQuery is empty", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    act(() => result.current.setSearchQuery(""));
    expect(result.current.displayOptions).toEqual(options);
  });

  it("returns empty array when no options match", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    act(() => result.current.setSearchQuery("zzz"));
    expect(result.current.displayOptions).toHaveLength(0);
  });

  it("matches label, not value", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    // "date" value = "date", label = "Date"
    act(() => result.current.setSearchQuery("Dat"));
    expect(result.current.displayOptions).toEqual([options[3]]);
  });

  it("filtering handles uppercase query", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    act(() => result.current.setSearchQuery("APP"));
    expect(result.current.displayOptions).toEqual([options[0]]); // Apple
  });
});

// ---------------------------------------------------------------------------
// 11. showSearch=false: no filtering applied
// ---------------------------------------------------------------------------

describe("useDropdown – showSearch=false", () => {
  it("displayOptions equals all options even when searchQuery is set", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, showSearch: false }),
    );
    act(() => result.current.setSearchQuery("an"));
    expect(result.current.displayOptions).toEqual(options);
  });
});

// ---------------------------------------------------------------------------
// 12. selectedOption computed correctly
// ---------------------------------------------------------------------------

describe("useDropdown – selectedOption", () => {
  it("is null when no value is selected", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    expect(result.current.selectedOption).toBeNull();
  });

  it("reflects the currently selected option object", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "cherry" }),
    );
    expect(result.current.selectedOption).toEqual(options[2]);
  });

  it("updates after option selection", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.handleOptionSelect(options[3])); // date
    expect(result.current.selectedOption).toEqual(options[3]);
  });

  it("becomes null after clearing", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "banana", clearable: true }),
    );
    act(() => result.current.handleClear(makeMouseEvent()));
    expect(result.current.selectedOption).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 13. ArrowDown key
// ---------------------------------------------------------------------------

describe("useDropdown – ArrowDown", () => {
  it("opens when closed and focuses first enabled option", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    act(() => result.current.handleKeyDown(makeKeyEvent("ArrowDown")));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.focusedIndex).toBe(0); // apple – first enabled
  });

  it("moves focus to next enabled when already open", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.setFocusedIndex(0)); // apple
    act(() => result.current.handleKeyDown(makeKeyEvent("ArrowDown")));
    expect(result.current.focusedIndex).toBe(1); // banana
  });

  it("skips disabled options when moving down", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.setFocusedIndex(1)); // banana → next enabled skips cherry(disabled) → date
    act(() => result.current.handleKeyDown(makeKeyEvent("ArrowDown")));
    expect(result.current.focusedIndex).toBe(3); // date
  });

  it("wraps from last to first enabled when moving down", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.setFocusedIndex(3)); // date (last)
    act(() => result.current.handleKeyDown(makeKeyEvent("ArrowDown")));
    expect(result.current.focusedIndex).toBe(0); // wraps to apple
  });

  it("calls preventDefault", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    const event = makeKeyEvent("ArrowDown");
    act(() => result.current.handleKeyDown(event));
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 14. ArrowUp key
// ---------------------------------------------------------------------------

describe("useDropdown – ArrowUp", () => {
  it("is a no-op when dropdown is closed", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    act(() => result.current.handleKeyDown(makeKeyEvent("ArrowUp")));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.focusedIndex).toBe(-1);
  });

  it("moves focus to previous enabled option", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.setFocusedIndex(3)); // date
    act(() => result.current.handleKeyDown(makeKeyEvent("ArrowUp")));
    // prev of date(3) skips cherry(2, disabled) → banana(1)
    expect(result.current.focusedIndex).toBe(1); // banana
  });

  it("wraps from first to last enabled when moving up", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.setFocusedIndex(0)); // apple
    act(() => result.current.handleKeyDown(makeKeyEvent("ArrowUp")));
    expect(result.current.focusedIndex).toBe(3); // wraps to date (last enabled)
  });

  it("calls preventDefault when open", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.setFocusedIndex(1));
    const event = makeKeyEvent("ArrowUp");
    act(() => result.current.handleKeyDown(event));
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 15. Home / End keys
// ---------------------------------------------------------------------------

describe("useDropdown – Home and End", () => {
  it("Home focuses first enabled option when open", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.setFocusedIndex(3));
    act(() => result.current.handleKeyDown(makeKeyEvent("Home")));
    expect(result.current.focusedIndex).toBe(0); // apple
  });

  it("End focuses last enabled option when open", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.setFocusedIndex(0));
    act(() => result.current.handleKeyDown(makeKeyEvent("End")));
    expect(result.current.focusedIndex).toBe(3); // date (cherry is disabled)
  });

  it("Home does nothing when closed", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    act(() => result.current.handleKeyDown(makeKeyEvent("Home")));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.focusedIndex).toBe(-1);
  });

  it("End does nothing when closed", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    act(() => result.current.handleKeyDown(makeKeyEvent("End")));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.focusedIndex).toBe(-1);
  });

  it("Home calls preventDefault when open", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    const event = makeKeyEvent("Home");
    act(() => result.current.handleKeyDown(event));
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("End calls preventDefault when open", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    const event = makeKeyEvent("End");
    act(() => result.current.handleKeyDown(event));
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 16. Enter key
// ---------------------------------------------------------------------------

describe("useDropdown – Enter", () => {
  it("opens when closed and focuses first enabled option", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    act(() => result.current.handleKeyDown(makeKeyEvent("Enter")));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.focusedIndex).toBe(0);
  });

  it("selects focused option when open", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.setFocusedIndex(1)); // banana
    act(() => result.current.handleKeyDown(makeKeyEvent("Enter")));
    expect(result.current.internalValue).toBe("banana");
    expect(result.current.isOpen).toBe(false);
  });

  it("does not select when focused option is disabled", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.setFocusedIndex(2)); // cherry – disabled
    act(() => result.current.handleKeyDown(makeKeyEvent("Enter")));
    expect(result.current.internalValue).toBeNull();
    expect(result.current.isOpen).toBe(true);
  });

  it("calls preventDefault", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    const event = makeKeyEvent("Enter");
    act(() => result.current.handleKeyDown(event));
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 17. Space key
// ---------------------------------------------------------------------------

describe("useDropdown – Space", () => {
  it("opens when closed", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    act(() => result.current.handleKeyDown(makeKeyEvent(" ")));
    expect(result.current.isOpen).toBe(true);
  });

  it("selects focused option when open", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.setFocusedIndex(0)); // apple
    act(() => result.current.handleKeyDown(makeKeyEvent(" ")));
    expect(result.current.internalValue).toBe("apple");
  });

  it("calls preventDefault", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    const event = makeKeyEvent(" ");
    act(() => result.current.handleKeyDown(event));
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 18. Escape key
// ---------------------------------------------------------------------------

describe("useDropdown – Escape", () => {
  it("closes when open", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.handleKeyDown(makeKeyEvent("Escape")));
    expect(result.current.isOpen).toBe(false);
  });

  it("is a no-op when already closed", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    const event = makeKeyEvent("Escape");
    act(() => result.current.handleKeyDown(event));
    expect(result.current.isOpen).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("calls preventDefault when open", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    const event = makeKeyEvent("Escape");
    act(() => result.current.handleKeyDown(event));
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 19. Tab key
// ---------------------------------------------------------------------------

describe("useDropdown – Tab", () => {
  it("closes dropdown when open", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.handleKeyDown(makeKeyEvent("Tab")));
    expect(result.current.isOpen).toBe(false);
  });

  it("does NOT call preventDefault (allows native tab navigation)", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    const event = makeKeyEvent("Tab");
    act(() => result.current.handleKeyDown(event));
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("is a no-op (no state change) when already closed", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    const event = makeKeyEvent("Tab");
    act(() => result.current.handleKeyDown(event));
    expect(result.current.isOpen).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 20. Delete / Backspace
// ---------------------------------------------------------------------------

describe("useDropdown – Delete and Backspace", () => {
  it("Delete clears value when clearable+hasValue+closed", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "apple", clearable: true }),
    );
    act(() => result.current.handleKeyDown(makeKeyEvent("Delete")));
    expect(result.current.internalValue).toBeNull();
  });

  it("Backspace clears value when clearable+hasValue+closed", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "banana", clearable: true }),
    );
    act(() => result.current.handleKeyDown(makeKeyEvent("Backspace")));
    expect(result.current.internalValue).toBeNull();
  });

  it("Delete is a no-op when dropdown is open", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "apple", clearable: true, defaultOpen: true }),
    );
    act(() => result.current.handleKeyDown(makeKeyEvent("Delete")));
    expect(result.current.internalValue).toBe("apple");
  });

  it("Delete is a no-op when clearable=false", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "apple", clearable: false }),
    );
    act(() => result.current.handleKeyDown(makeKeyEvent("Delete")));
    expect(result.current.internalValue).toBe("apple");
  });

  it("Delete is a no-op when no value is set", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, clearable: true }),
    );
    act(() => result.current.handleKeyDown(makeKeyEvent("Delete")));
    expect(result.current.internalValue).toBeNull();
  });

  it("Backspace calls preventDefault when clearing", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultValue: "apple", clearable: true }),
    );
    const event = makeKeyEvent("Backspace");
    act(() => result.current.handleKeyDown(event));
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 21. Typeahead: letter accumulation and focus
// ---------------------------------------------------------------------------

describe("useDropdown – Typeahead (searchInputFocused=false)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("pressing a letter while open focuses matching option", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.handleKeyDown(makeKeyEvent("b")));
    expect(result.current.focusedIndex).toBe(1); // Banana starts with 'b'
  });

  it("accumulates chars and narrows match", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() => result.current.handleKeyDown(makeKeyEvent("d")));
    // 'd' → Date (index 3)
    expect(result.current.focusedIndex).toBe(3);
    act(() => result.current.handleKeyDown(makeKeyEvent("a")));
    // 'da' → Date still matches
    expect(result.current.focusedIndex).toBe(3);
  });

  it("no-op when dropdown is closed", () => {
    const { result } = renderHook(() => useDropdown({ options }));
    act(() => result.current.handleKeyDown(makeKeyEvent("a")));
    // Pressing 'a' when closed should not open via typeahead
    expect(result.current.focusedIndex).toBe(-1);
  });

  it("resets typeahead query after typeaheadTimeout", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, typeaheadTimeout: 500 }),
    );
    act(() => result.current.handleKeyDown(makeKeyEvent("b")));
    expect(result.current.focusedIndex).toBe(1); // Banana
    act(() => {
      vi.advanceTimersByTime(600); // past 500ms timeout
    });
    // Now type 'a' – should match Apple fresh (no accumulated query)
    act(() => result.current.handleKeyDown(makeKeyEvent("a")));
    expect(result.current.focusedIndex).toBe(0); // Apple
  });

  it("does not trigger typeahead with modifier keys (ctrl)", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true }),
    );
    act(() =>
      result.current.handleKeyDown(
        makeKeyEvent("a", { ctrlKey: true }),
      ),
    );
    // With ctrlKey, single char falls through to default but guard prevents typeahead
    expect(result.current.focusedIndex).toBe(-1);
  });
});

// ---------------------------------------------------------------------------
// 22. Typeahead resets after timeout (separate focused test)
// ---------------------------------------------------------------------------

describe("useDropdown – Typeahead timeout reset", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("typing 'ch' focuses cherry, after timeout 'c' focuses cherry fresh", () => {
    // Note: cherry is disabled – typeahead still sets focusedIndex but won't select
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, typeaheadTimeout: 1000 }),
    );
    act(() => result.current.handleKeyDown(makeKeyEvent("c")));
    expect(result.current.focusedIndex).toBe(2); // Cherry
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    // After reset, 'b' should go to Banana
    act(() => result.current.handleKeyDown(makeKeyEvent("b")));
    expect(result.current.focusedIndex).toBe(1); // Banana
  });
});

// ---------------------------------------------------------------------------
// 23. Search input focused path (searchInputFocused=true)
// ---------------------------------------------------------------------------

describe("useDropdown – searchInputFocused path", () => {
  it("ArrowDown moves focus when input is focused", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, showSearch: true }),
    );
    act(() => result.current.setFocusedIndex(0)); // apple
    act(() => result.current.handleKeyDown(makeInputKeyEvent("ArrowDown")));
    expect(result.current.focusedIndex).toBe(1); // banana
  });

  it("ArrowUp moves focus when input is focused", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, showSearch: true }),
    );
    act(() => result.current.setFocusedIndex(3)); // date
    act(() => result.current.handleKeyDown(makeInputKeyEvent("ArrowUp")));
    expect(result.current.focusedIndex).toBe(1); // skips cherry (disabled) → banana
  });

  it("Escape closes from input", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, showSearch: true }),
    );
    act(() => result.current.handleKeyDown(makeInputKeyEvent("Escape")));
    expect(result.current.isOpen).toBe(false);
  });

  it("Escape from input calls preventDefault", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, showSearch: true }),
    );
    const event = makeInputKeyEvent("Escape");
    act(() => result.current.handleKeyDown(event));
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("Home focuses first enabled option from input", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, showSearch: true }),
    );
    act(() => result.current.setFocusedIndex(3));
    act(() => result.current.handleKeyDown(makeInputKeyEvent("Home")));
    expect(result.current.focusedIndex).toBe(0);
  });

  it("End focuses last enabled option from input", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, showSearch: true }),
    );
    act(() => result.current.setFocusedIndex(0));
    act(() => result.current.handleKeyDown(makeInputKeyEvent("End")));
    expect(result.current.focusedIndex).toBe(3); // date
  });

  it("Enter selects focused option from input", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, showSearch: true }),
    );
    act(() => result.current.setFocusedIndex(1)); // banana
    act(() => result.current.handleKeyDown(makeInputKeyEvent("Enter")));
    expect(result.current.internalValue).toBe("banana");
    expect(result.current.isOpen).toBe(false);
  });

  it("Enter from input calls preventDefault", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, showSearch: true }),
    );
    act(() => result.current.setFocusedIndex(0));
    const event = makeInputKeyEvent("Enter");
    act(() => result.current.handleKeyDown(event));
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("ArrowDown wraps from last to first enabled when input focused", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, showSearch: true }),
    );
    act(() => result.current.setFocusedIndex(3)); // date (last)
    act(() => result.current.handleKeyDown(makeInputKeyEvent("ArrowDown")));
    expect(result.current.focusedIndex).toBe(0); // wraps to apple
  });

  it("ArrowUp wraps from first to last enabled when input focused", () => {
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, showSearch: true }),
    );
    act(() => result.current.setFocusedIndex(0)); // apple
    act(() => result.current.handleKeyDown(makeInputKeyEvent("ArrowUp")));
    expect(result.current.focusedIndex).toBe(3); // wraps to date
  });

  it("input path is skipped when showSearch=false (falls through to normal handler)", () => {
    // With showSearch=false and INPUT target, the searchInputFocused branch is skipped
    const { result } = renderHook(() =>
      useDropdown({ options, defaultOpen: true, showSearch: false }),
    );
    // In the normal handler branch, Escape closes the dropdown
    act(() =>
      result.current.handleKeyDown(makeInputKeyEvent("Escape")),
    );
    expect(result.current.isOpen).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 24. loadInitialOnOpen
// ---------------------------------------------------------------------------

describe("useDropdown – loadInitialOnOpen", () => {
  it("loads initial options on first open", async () => {
    const extra = [{ value: "fig", label: "Fig" }];
    const onLoadInitialOptions = vi.fn().mockResolvedValue(extra);

    const { result } = renderHook(() =>
      useDropdown({
        options,
        loadInitialOnOpen: true,
        onLoadInitialOptions,
      }),
    );

    await act(async () => {
      result.current.handleOpen();
    });

    expect(onLoadInitialOptions).toHaveBeenCalledTimes(1);
  });

  it("does not re-load on second open (hasLoadedInitial guard)", async () => {
    const extra = [{ value: "fig", label: "Fig" }];
    const onLoadInitialOptions = vi.fn().mockResolvedValue(extra);

    const { result } = renderHook(() =>
      useDropdown({
        options,
        loadInitialOnOpen: true,
        onLoadInitialOptions,
      }),
    );

    await act(async () => {
      result.current.handleOpen();
    });
    await act(async () => {
      result.current.handleClose();
    });
    await act(async () => {
      result.current.handleOpen();
    });

    expect(onLoadInitialOptions).toHaveBeenCalledTimes(1);
  });

  it("sets isLoadingInitial=true while loading, false after", async () => {
    let resolve!: (v: typeof options) => void;
    const promise = new Promise<typeof options>((res) => { resolve = res; });
    const onLoadInitialOptions = vi.fn().mockReturnValue(promise);

    const { result } = renderHook(() =>
      useDropdown({
        options,
        loadInitialOnOpen: true,
        onLoadInitialOptions,
      }),
    );

    await act(async () => { result.current.handleOpen(); });
    // isLoadingInitial should be true while unresolved
    expect(result.current.isLoadingInitial).toBe(true);

    // Resolve the promise and flush all resulting microtasks + state updates
    await act(async () => {
      resolve([]);
      await promise;
      // Flush any remaining promise microtasks
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(result.current.isLoadingInitial).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 25. onLoadError called on load failure
// ---------------------------------------------------------------------------

describe("useDropdown – onLoadError", () => {
  it("calls onLoadError when onLoadInitialOptions rejects", async () => {
    const error = new Error("load failed");
    const onLoadInitialOptions = vi.fn().mockRejectedValue(error);
    const onLoadError = vi.fn();

    const { result } = renderHook(() =>
      useDropdown({
        options,
        loadInitialOnOpen: true,
        onLoadInitialOptions,
        onLoadError,
      }),
    );

    await act(async () => { result.current.handleOpen(); });
    await act(async () => {});

    expect(onLoadError).toHaveBeenCalledWith(error);
  });

  it("calls onLoadError when async onSearch rejects", async () => {
    vi.useFakeTimers();
    const error = new Error("search failed");
    const onSearch = vi.fn().mockRejectedValue(error);
    const onLoadError = vi.fn();

    const { result } = renderHook(() =>
      useDropdown({ options, onSearch, onLoadError, searchDebounceMs: 0, defaultOpen: true }),
    );

    act(() => { result.current.setSearchQuery("apple"); });

    // Flush the setTimeout(fn, 0) debounce
    await act(async () => { vi.runAllTimers(); });
    // Flush the rejected promise microtasks
    await act(async () => { await Promise.resolve(); });

    vi.useRealTimers();
    expect(onLoadError).toHaveBeenCalledWith(error);
  });
});

// ---------------------------------------------------------------------------
// 26. disabled: all keyboard actions are no-ops
// ---------------------------------------------------------------------------

describe("useDropdown – disabled mode (keyboard)", () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const disabledHook = () => useDropdown({ options, disabled: true });

  it("Enter does not open", () => {
    const { result } = renderHook(disabledHook);
    act(() => result.current.handleKeyDown(makeKeyEvent("Enter")));
    expect(result.current.isOpen).toBe(false);
  });

  it("Space does not open", () => {
    const { result } = renderHook(disabledHook);
    act(() => result.current.handleKeyDown(makeKeyEvent(" ")));
    expect(result.current.isOpen).toBe(false);
  });

  it("ArrowDown does not open", () => {
    const { result } = renderHook(disabledHook);
    act(() => result.current.handleKeyDown(makeKeyEvent("ArrowDown")));
    expect(result.current.isOpen).toBe(false);
  });

  it("ArrowUp does not change state", () => {
    const { result } = renderHook(disabledHook);
    act(() => result.current.handleKeyDown(makeKeyEvent("ArrowUp")));
    expect(result.current.focusedIndex).toBe(-1);
  });

  it("Escape does not throw or change state", () => {
    const { result } = renderHook(disabledHook);
    act(() => result.current.handleKeyDown(makeKeyEvent("Escape")));
    expect(result.current.isOpen).toBe(false);
  });

  it("Tab does not call preventDefault but is still no-op for open", () => {
    const { result } = renderHook(disabledHook);
    const event = makeKeyEvent("Tab");
    act(() => result.current.handleKeyDown(event));
    expect(result.current.isOpen).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("letter key does not trigger typeahead", () => {
    const { result } = renderHook(disabledHook);
    act(() => result.current.handleKeyDown(makeKeyEvent("a")));
    expect(result.current.focusedIndex).toBe(-1);
  });
});

// ---------------------------------------------------------------------------
// 27. Async mode – displayOptions behavior
// ---------------------------------------------------------------------------

describe("useDropdown – async mode (onSearch)", () => {
  it("displayOptions returns allInitialOptions when searchQuery is empty", () => {
    const asyncInitial = [{ value: "fig", label: "Fig" }];
    const onSearch = vi.fn().mockResolvedValue([]);

    const { result } = renderHook(() =>
      useDropdown({
        options,
        onSearch,
        initialOptions: asyncInitial,
        defaultOpen: true,
      }),
    );

    expect(result.current.displayOptions).toEqual(asyncInitial);
  });

  it("displayOptions returns asyncOptions when searchQuery is non-empty", async () => {
    vi.useFakeTimers();
    const searchResults = [{ value: "avocado", label: "Avocado" }];
    const onSearch = vi.fn().mockResolvedValue(searchResults);

    const { result } = renderHook(() =>
      useDropdown({ options, onSearch, searchDebounceMs: 0, defaultOpen: true }),
    );

    act(() => { result.current.setSearchQuery("avo"); });
    await act(async () => { vi.runAllTimers(); });
    await act(async () => { await Promise.resolve(); });
    vi.useRealTimers();

    expect(result.current.displayOptions).toEqual(searchResults);
  });

  it("isSearching becomes true when searchQuery is set (async mode)", () => {
    const onSearch = vi.fn().mockResolvedValue([]);
    const { result } = renderHook(() =>
      useDropdown({ options, onSearch, searchDebounceMs: 300, defaultOpen: true }),
    );

    act(() => { result.current.setSearchQuery("ban"); });
    // At render time, hasActiveSearch=true so isSearching should be set true
    expect(result.current.isSearching).toBe(true);
  });

  it("displayOptions resets to initialOptions when searchQuery is cleared", async () => {
    vi.useFakeTimers();
    const asyncInitial = [{ value: "fig", label: "Fig" }];
    const searchResults = [{ value: "avocado", label: "Avocado" }];
    const onSearch = vi.fn().mockResolvedValue(searchResults);

    const { result } = renderHook(() =>
      useDropdown({
        options,
        onSearch,
        initialOptions: asyncInitial,
        searchDebounceMs: 0,
        defaultOpen: true,
      }),
    );

    act(() => { result.current.setSearchQuery("avo"); });
    // Flush setTimeout(fn, 0) debounce then the resolved promise
    await act(async () => { vi.runAllTimers(); });
    await act(async () => { await Promise.resolve(); });

    expect(result.current.displayOptions).toEqual(searchResults);

    act(() => { result.current.setSearchQuery(""); });
    vi.useRealTimers();
    expect(result.current.displayOptions).toEqual(asyncInitial);
  });
});
