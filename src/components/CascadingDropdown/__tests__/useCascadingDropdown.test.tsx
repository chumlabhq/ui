import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCascadingDropdown } from "../utils/useCascadingDropdown";
import type { CascadingOption } from "../utils/types";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const flatOptions: CascadingOption[] = [
  { value: "fruits", label: "Fruits" },
  { value: "vegetables", label: "Vegetables" },
  { value: "grains", label: "Grains" },
];

const nestedOptions: CascadingOption[] = [
  {
    value: "fruits",
    label: "Fruits",
    children: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
    ],
  },
  {
    value: "vegetables",
    label: "Vegetables",
    children: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
    ],
  },
];

const multiSelectOptions: CascadingOption[] = [
  {
    value: "fruits",
    label: "Fruits",
    selectionMode: "multi",
    children: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "cherry", label: "Cherry" },
    ],
  },
];

const optionsWithDisabled: CascadingOption[] = [
  { value: "a", label: "A" },
  { value: "b", label: "B", disabled: true },
  { value: "c", label: "C" },
  { value: "d", label: "D", disabled: true },
  { value: "e", label: "E" },
];

const nestedWithDisabled: CascadingOption[] = [
  {
    value: "fruits",
    label: "Fruits",
    children: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana", disabled: true },
      { value: "cherry", label: "Cherry" },
    ],
  },
];

/** Helper: synthesise a keyboard event */
function makeKeyEvent(key: string): React.KeyboardEvent {
  return {
    key,
    preventDefault: vi.fn(),
    defaultPrevented: false,
  } as unknown as React.KeyboardEvent;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useCascadingDropdown", () => {
  // ── 1. Initial state ────────────────────────────────────────────────────────
  describe("initial state", () => {
    it("returns isOpen=false by default", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      expect(result.current.isOpen).toBe(false);
    });

    it("returns focusedIndex=-1 by default", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      expect(result.current.focusedIndex).toBe(-1);
    });

    it("returns activeSubmenu=null by default", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      expect(result.current.activeSubmenu).toBeNull();
    });

    it("returns submenuFocusedIndex=-1 by default", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      expect(result.current.submenuFocusedIndex).toBe(-1);
    });

    it("returns empty internalValue by default", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      expect(result.current.internalValue).toEqual({});
    });

    it("respects defaultOpen=true", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, defaultOpen: true })
      );
      expect(result.current.isOpen).toBe(true);
    });

    it("respects defaultValue", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: nestedOptions,
          defaultValue: { fruits: "apple" },
        })
      );
      expect(result.current.internalValue).toEqual({ fruits: "apple" });
    });

    it("returns filteredOptions equal to options initially", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      expect(result.current.filteredOptions).toEqual(flatOptions);
    });

    it("returns empty loadedChildren and loadingChildren initially", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      expect(result.current.loadedChildren).toEqual({});
      expect(result.current.loadingChildren).toEqual({});
    });
  });

  // ── 2. handleToggle ─────────────────────────────────────────────────────────
  describe("handleToggle", () => {
    it("opens dropdown when closed", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      act(() => { result.current.handleToggle(); });
      expect(result.current.isOpen).toBe(true);
    });

    it("closes dropdown when open", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, defaultOpen: true })
      );
      act(() => { result.current.handleToggle(); });
      expect(result.current.isOpen).toBe(false);
    });

    it("resets focusedIndex on toggle", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      act(() => { result.current.handleToggle(); });
      expect(result.current.focusedIndex).toBe(-1);
    });

    it("resets activeSubmenu on toggle", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions })
      );
      act(() => {
        result.current.handleToggle();
        result.current.handleMenuItemHover(nestedOptions[0], 0);
      });
      act(() => { result.current.handleToggle(); });
      expect(result.current.activeSubmenu).toBeNull();
    });

    it("is a no-op when disabled=true", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, disabled: true })
      );
      act(() => { result.current.handleToggle(); });
      expect(result.current.isOpen).toBe(false);
    });

    it("calls onOpenChange when toggling", () => {
      const onOpenChange = vi.fn();
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, onOpenChange })
      );
      act(() => { result.current.handleToggle(); });
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  // ── 3. handleClose ──────────────────────────────────────────────────────────
  describe("handleClose", () => {
    it("sets isOpen to false", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, defaultOpen: true })
      );
      act(() => { result.current.handleClose(); });
      expect(result.current.isOpen).toBe(false);
    });

    it("resets focusedIndex to -1", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, defaultOpen: true })
      );
      act(() => { result.current.setFocusedIndex(2); });
      act(() => { result.current.handleClose(); });
      expect(result.current.focusedIndex).toBe(-1);
    });

    it("resets activeSubmenu to null", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => { result.current.handleMenuItemHover(nestedOptions[0], 0); });
      act(() => { result.current.handleClose(); });
      expect(result.current.activeSubmenu).toBeNull();
    });

    it("resets submenuFocusedIndex to -1", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => { result.current.setSubmenuFocusedIndex(1); });
      act(() => { result.current.handleClose(); });
      expect(result.current.submenuFocusedIndex).toBe(-1);
    });

    it("calls onOpenChange(false)", () => {
      const onOpenChange = vi.fn();
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: flatOptions,
          defaultOpen: true,
          onOpenChange,
        })
      );
      act(() => { result.current.handleClose(); });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  // ── 4. handleMenuItemHover ──────────────────────────────────────────────────
  describe("handleMenuItemHover", () => {
    it("sets focusedIndex to the hovered index", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions })
      );
      act(() => { result.current.handleMenuItemHover(nestedOptions[1], 1); });
      expect(result.current.focusedIndex).toBe(1);
    });

    it("opens the submenu for an option with children", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions })
      );
      act(() => { result.current.handleMenuItemHover(nestedOptions[0], 0); });
      expect(result.current.activeSubmenu).toBe("fruits");
    });

    it("does not open submenu for an option without children", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      act(() => { result.current.handleMenuItemHover(flatOptions[0], 0); });
      expect(result.current.activeSubmenu).toBeNull();
    });

    it("resets submenuFocusedIndex when opening submenu", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions })
      );
      act(() => { result.current.setSubmenuFocusedIndex(2); });
      act(() => { result.current.handleMenuItemHover(nestedOptions[0], 0); });
      expect(result.current.submenuFocusedIndex).toBe(-1);
    });
  });

  // ── 5. handleMenuItemClick ──────────────────────────────────────────────────
  describe("handleMenuItemClick", () => {
    it("selects a flat option and updates internalValue", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      act(() => { result.current.handleMenuItemClick(flatOptions[0]); });
      expect(result.current.internalValue).toEqual({ root: "fruits" });
    });

    it("calls onValueChange with correct args for flat option", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, onValueChange })
      );
      act(() => { result.current.handleMenuItemClick(flatOptions[1]); });
      expect(onValueChange).toHaveBeenCalledWith(
        { root: "vegetables" },
        [flatOptions[1]]
      );
    });

    it("closes dropdown after selecting flat option when closeOnSelect=true", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: flatOptions,
          defaultOpen: true,
          closeOnSelect: true,
        })
      );
      act(() => { result.current.handleMenuItemClick(flatOptions[0]); });
      expect(result.current.isOpen).toBe(false);
    });

    it("keeps dropdown open when closeOnSelect=false", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: flatOptions,
          defaultOpen: true,
          closeOnSelect: false,
        })
      );
      act(() => { result.current.handleMenuItemClick(flatOptions[0]); });
      expect(result.current.isOpen).toBe(true);
    });

    it("does nothing for a disabled flat option", () => {
      const disabledOption: CascadingOption = { value: "x", label: "X", disabled: true };
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: [disabledOption], onValueChange })
      );
      act(() => { result.current.handleMenuItemClick(disabledOption); });
      expect(onValueChange).not.toHaveBeenCalled();
      expect(result.current.internalValue).toEqual({});
    });

    it("does nothing when clicking a parent option (has children)", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, onValueChange })
      );
      act(() => { result.current.handleMenuItemClick(nestedOptions[0]); });
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  // ── 6. handleSubmenuItemClick — single-select ───────────────────────────────
  describe("handleSubmenuItemClick (single-select)", () => {
    it("selects a submenu item (single mode)", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions })
      );
      const parent = nestedOptions[0];
      const child = parent.children![0];
      act(() => { result.current.handleSubmenuItemClick(parent, child); });
      expect(result.current.internalValue).toEqual({ fruits: "apple" });
    });

    it("calls onValueChange with parent + child path", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, onValueChange })
      );
      const parent = nestedOptions[0];
      const child = parent.children![1];
      act(() => { result.current.handleSubmenuItemClick(parent, child); });
      expect(onValueChange).toHaveBeenCalledWith(
        { fruits: "banana" },
        [parent, child]
      );
    });

    it("closes dropdown on submenu single-select when closeOnSelect=true", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: nestedOptions,
          defaultOpen: true,
          closeOnSelect: true,
        })
      );
      const parent = nestedOptions[0];
      act(() => { result.current.handleSubmenuItemClick(parent, parent.children![0]); });
      expect(result.current.isOpen).toBe(false);
    });

    it("keeps dropdown open on submenu single-select when closeOnSelect=false", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: nestedOptions,
          defaultOpen: true,
          closeOnSelect: false,
        })
      );
      const parent = nestedOptions[0];
      act(() => { result.current.handleSubmenuItemClick(parent, parent.children![0]); });
      expect(result.current.isOpen).toBe(true);
    });

    it("does nothing for a disabled submenu option", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedWithDisabled, onValueChange })
      );
      const parent = nestedWithDisabled[0];
      const disabledChild = parent.children![1]; // banana is disabled
      act(() => { result.current.handleSubmenuItemClick(parent, disabledChild); });
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("replaces previous selection on second single-select click", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: nestedOptions,
          closeOnSelect: false,
        })
      );
      const parent = nestedOptions[0];
      act(() => { result.current.handleSubmenuItemClick(parent, parent.children![0]); });
      act(() => { result.current.handleSubmenuItemClick(parent, parent.children![1]); });
      expect(result.current.internalValue).toEqual({ fruits: "banana" });
    });
  });

  // ── 7. handleSubmenuItemClick — multi-select ────────────────────────────────
  describe("handleSubmenuItemClick (multi-select)", () => {
    it("adds item to multi-select array", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: multiSelectOptions, closeOnSelect: false })
      );
      const parent = multiSelectOptions[0];
      act(() => { result.current.handleSubmenuItemClick(parent, parent.children![0]); });
      expect(result.current.internalValue).toEqual({ fruits: ["apple"] });
    });

    it("adds a second item to multi-select array", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: multiSelectOptions, closeOnSelect: false })
      );
      const parent = multiSelectOptions[0];
      act(() => { result.current.handleSubmenuItemClick(parent, parent.children![0]); });
      act(() => { result.current.handleSubmenuItemClick(parent, parent.children![1]); });
      expect(result.current.internalValue).toEqual({ fruits: ["apple", "banana"] });
    });

    it("removes item when toggling an already-selected item", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: multiSelectOptions, closeOnSelect: false })
      );
      const parent = multiSelectOptions[0];
      act(() => { result.current.handleSubmenuItemClick(parent, parent.children![0]); });
      act(() => { result.current.handleSubmenuItemClick(parent, parent.children![1]); });
      act(() => { result.current.handleSubmenuItemClick(parent, parent.children![0]); }); // deselect apple
      expect(result.current.internalValue).toEqual({ fruits: ["banana"] });
    });

    it("does not close dropdown after multi-select pick", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: multiSelectOptions,
          defaultOpen: true,
          closeOnSelect: true, // still stays open because multi
        })
      );
      const parent = multiSelectOptions[0];
      act(() => { result.current.handleSubmenuItemClick(parent, parent.children![0]); });
      expect(result.current.isOpen).toBe(true);
    });
  });

  // ── 8. Controlled value ─────────────────────────────────────────────────────
  describe("controlled value", () => {
    it("uses provided value prop as internalValue", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: nestedOptions,
          value: { fruits: "apple" },
        })
      );
      expect(result.current.internalValue).toEqual({ fruits: "apple" });
    });

    it("updates when value prop changes", () => {
      let value = { fruits: "apple" };
      const { result, rerender } = renderHook(
        ({ val }) =>
          useCascadingDropdown({ options: nestedOptions, value: val }),
        { initialProps: { val: value } }
      );
      expect(result.current.internalValue).toEqual({ fruits: "apple" });

      value = { fruits: "banana" };
      rerender({ val: value });
      expect(result.current.internalValue).toEqual({ fruits: "banana" });
    });
  });

  // ── 9. Controlled open ──────────────────────────────────────────────────────
  describe("controlled open", () => {
    it("uses provided open prop", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, open: true })
      );
      expect(result.current.isOpen).toBe(true);
    });

    it("reflects open=false prop", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, open: false })
      );
      expect(result.current.isOpen).toBe(false);
    });
  });

  // ── 10. getDisplayValue ─────────────────────────────────────────────────────
  describe("getDisplayValue", () => {
    it("returns empty string when nothing is selected", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      expect(result.current.getDisplayValue()).toBe("");
    });

    it("returns label for root (flat) selection", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: flatOptions,
          defaultValue: { root: "fruits" },
        })
      );
      expect(result.current.getDisplayValue()).toBe("Fruits");
    });

    it("returns 'ParentLabel: ChildLabel' for submenu selection", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: nestedOptions,
          defaultValue: { fruits: "apple" },
        })
      );
      expect(result.current.getDisplayValue()).toBe("Fruits: Apple");
    });

    it("joins multiple selections with ' | '", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: nestedOptions,
          defaultValue: { fruits: "apple", vegetables: "carrot" },
        })
      );
      const display = result.current.getDisplayValue();
      expect(display).toContain("Fruits: Apple");
      expect(display).toContain("Vegetables: Carrot");
      expect(display).toContain(" | ");
    });

    it("returns multi-select labels joined by ', '", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: multiSelectOptions,
          defaultValue: { fruits: ["apple", "banana"] },
        })
      );
      expect(result.current.getDisplayValue()).toBe("Fruits: Apple, Banana");
    });

    it("updates after a selection is made", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, closeOnSelect: false })
      );
      act(() => { result.current.handleMenuItemClick(flatOptions[2]); });
      expect(result.current.getDisplayValue()).toBe("Grains");
    });
  });

  // ── 11. isSubmenuOpen ───────────────────────────────────────────────────────
  describe("isSubmenuOpen", () => {
    it("returns false when no submenu is active", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions })
      );
      expect(result.current.isSubmenuOpen("fruits")).toBe(false);
    });

    it("returns true for the active submenu", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions })
      );
      act(() => { result.current.handleMenuItemHover(nestedOptions[0], 0); });
      expect(result.current.isSubmenuOpen("fruits")).toBe(true);
      expect(result.current.isSubmenuOpen("vegetables")).toBe(false);
    });
  });

  // ── 12. Keyboard – ArrowDown ────────────────────────────────────────────────
  describe("keyboard navigation – ArrowDown", () => {
    it("opens dropdown and focuses first item if closed", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowDown")); });
      expect(result.current.isOpen).toBe(true);
      expect(result.current.focusedIndex).toBe(0);
    });

    it("moves focus down within main menu", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, defaultOpen: true })
      );
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowDown")); }); // 0
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowDown")); }); // 1
      expect(result.current.focusedIndex).toBe(1);
    });

    it("wraps from last to first item", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, defaultOpen: true })
      );
      // Start at last index
      act(() => { result.current.setFocusedIndex(2); });
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowDown")); });
      expect(result.current.focusedIndex).toBe(0);
    });

    it("skips disabled menu items when moving down", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: optionsWithDisabled, defaultOpen: true })
      );
      // index 0 = A, index 1 = B (disabled), should jump to index 2 = C
      act(() => { result.current.setFocusedIndex(0); });
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowDown")); });
      expect(result.current.focusedIndex).toBe(2);
    });

    it("navigates within submenu when submenu is focused", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => {
        result.current.handleMenuItemHover(nestedOptions[0], 0);
        result.current.setSubmenuFocusedIndex(0);
      });
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowDown")); });
      expect(result.current.submenuFocusedIndex).toBe(1);
    });

    it("wraps submenu from last to first", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => {
        result.current.handleMenuItemHover(nestedOptions[0], 0);
        result.current.setSubmenuFocusedIndex(1); // last child index
      });
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowDown")); });
      expect(result.current.submenuFocusedIndex).toBe(0);
    });
  });

  // ── 13. Keyboard – ArrowUp ──────────────────────────────────────────────────
  describe("keyboard navigation – ArrowUp", () => {
    it("moves focus up within main menu", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, defaultOpen: true })
      );
      act(() => { result.current.setFocusedIndex(2); });
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowUp")); });
      expect(result.current.focusedIndex).toBe(1);
    });

    it("wraps from first to last item", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, defaultOpen: true })
      );
      act(() => { result.current.setFocusedIndex(0); });
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowUp")); });
      expect(result.current.focusedIndex).toBe(2);
    });

    it("skips disabled items when moving up", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: optionsWithDisabled, defaultOpen: true })
      );
      // index 2 = C, index 1 = B (disabled) → should go to index 0 = A
      act(() => { result.current.setFocusedIndex(2); });
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowUp")); });
      expect(result.current.focusedIndex).toBe(0);
    });

    it("navigates up within submenu", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => {
        result.current.handleMenuItemHover(nestedOptions[0], 0);
        result.current.setSubmenuFocusedIndex(1);
      });
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowUp")); });
      expect(result.current.submenuFocusedIndex).toBe(0);
    });

    it("wraps submenu from first to last", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => {
        result.current.handleMenuItemHover(nestedOptions[0], 0);
        result.current.setSubmenuFocusedIndex(0);
      });
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowUp")); });
      expect(result.current.submenuFocusedIndex).toBe(1);
    });

    it("is a no-op when dropdown is closed", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowUp")); });
      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  // ── 14. Keyboard – Home / End ───────────────────────────────────────────────
  describe("keyboard navigation – Home / End", () => {
    it("Home focuses the first enabled menu item", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, defaultOpen: true })
      );
      act(() => { result.current.setFocusedIndex(2); });
      act(() => { result.current.handleKeyDown(makeKeyEvent("Home")); });
      expect(result.current.focusedIndex).toBe(0);
    });

    it("End focuses the last enabled menu item", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, defaultOpen: true })
      );
      act(() => { result.current.handleKeyDown(makeKeyEvent("End")); });
      expect(result.current.focusedIndex).toBe(2);
    });

    it("End skips trailing disabled items", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: optionsWithDisabled, defaultOpen: true })
      );
      // last two: index 3 = D (disabled), index 4 = E (enabled)
      act(() => { result.current.handleKeyDown(makeKeyEvent("End")); });
      expect(result.current.focusedIndex).toBe(4);
    });

    it("Home inside submenu focuses first enabled submenu item", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => {
        result.current.handleMenuItemHover(nestedOptions[0], 0);
        result.current.setSubmenuFocusedIndex(1);
      });
      act(() => { result.current.handleKeyDown(makeKeyEvent("Home")); });
      expect(result.current.submenuFocusedIndex).toBe(0);
    });

    it("End inside submenu focuses last enabled submenu item", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => {
        result.current.handleMenuItemHover(nestedOptions[0], 0);
        result.current.setSubmenuFocusedIndex(0);
      });
      act(() => { result.current.handleKeyDown(makeKeyEvent("End")); });
      expect(result.current.submenuFocusedIndex).toBe(1);
    });

    it("Home/End are no-ops when dropdown is closed", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      act(() => { result.current.handleKeyDown(makeKeyEvent("Home")); });
      act(() => { result.current.handleKeyDown(makeKeyEvent("End")); });
      expect(result.current.focusedIndex).toBe(-1);
    });
  });

  // ── 15. Keyboard – ArrowRight ───────────────────────────────────────────────
  describe("keyboard navigation – ArrowRight", () => {
    it("opens submenu for the focused item with children", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => { result.current.setFocusedIndex(0); });
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowRight")); });
      expect(result.current.activeSubmenu).toBe("fruits");
      expect(result.current.submenuFocusedIndex).toBe(0);
    });

    it("does not open submenu for flat option", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, defaultOpen: true })
      );
      act(() => { result.current.setFocusedIndex(0); });
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowRight")); });
      expect(result.current.activeSubmenu).toBeNull();
    });

    it("is a no-op when dropdown is closed", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions })
      );
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowRight")); });
      expect(result.current.activeSubmenu).toBeNull();
    });

    it("is a no-op when no item is focused (focusedIndex=-1)", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowRight")); });
      expect(result.current.activeSubmenu).toBeNull();
    });
  });

  // ── 16. Keyboard – ArrowLeft ────────────────────────────────────────────────
  describe("keyboard navigation – ArrowLeft", () => {
    it("closes submenu and resets submenuFocusedIndex", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => {
        result.current.handleMenuItemHover(nestedOptions[0], 0);
        result.current.setSubmenuFocusedIndex(1);
      });
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowLeft")); });
      expect(result.current.activeSubmenu).toBeNull();
      expect(result.current.submenuFocusedIndex).toBe(-1);
    });

    it("is a no-op when no submenu is focused", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => { result.current.handleMenuItemHover(nestedOptions[0], 0); });
      // submenuFocusedIndex is -1 so isInSubmenu is false
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowLeft")); });
      // activeSubmenu stays because ArrowLeft only fires when isInSubmenu
      expect(result.current.activeSubmenu).toBe("fruits");
    });
  });

  // ── 17. Keyboard – Escape ───────────────────────────────────────────────────
  describe("keyboard navigation – Escape", () => {
    it("closes submenu when in submenu context", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => {
        result.current.handleMenuItemHover(nestedOptions[0], 0);
        result.current.setSubmenuFocusedIndex(0);
      });
      act(() => { result.current.handleKeyDown(makeKeyEvent("Escape")); });
      expect(result.current.activeSubmenu).toBeNull();
      expect(result.current.submenuFocusedIndex).toBe(-1);
    });

    it("closes dropdown when no submenu is focused", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, defaultOpen: true })
      );
      act(() => { result.current.handleKeyDown(makeKeyEvent("Escape")); });
      expect(result.current.isOpen).toBe(false);
    });
  });

  // ── 18. Keyboard – Enter / Space ───────────────────────────────────────────
  describe("keyboard navigation – Enter / Space", () => {
    it("selects focused submenu item on Enter", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: nestedOptions,
          defaultOpen: true,
          closeOnSelect: false,
          onValueChange,
        })
      );
      act(() => {
        result.current.handleMenuItemHover(nestedOptions[0], 0);
        result.current.setSubmenuFocusedIndex(0);
      });
      act(() => { result.current.handleKeyDown(makeKeyEvent("Enter")); });
      expect(onValueChange).toHaveBeenCalledWith(
        { fruits: "apple" },
        expect.any(Array)
      );
    });

    it("selects focused flat menu item on Enter", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: flatOptions,
          defaultOpen: true,
          closeOnSelect: false,
          onValueChange,
        })
      );
      act(() => { result.current.setFocusedIndex(0); });
      act(() => { result.current.handleKeyDown(makeKeyEvent("Enter")); });
      expect(onValueChange).toHaveBeenCalledWith({ root: "fruits" }, [flatOptions[0]]);
    });

    it("opens submenu on Enter when focused item has children", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, defaultOpen: true })
      );
      act(() => { result.current.setFocusedIndex(0); });
      act(() => { result.current.handleKeyDown(makeKeyEvent("Enter")); });
      expect(result.current.activeSubmenu).toBe("fruits");
      expect(result.current.submenuFocusedIndex).toBe(0);
    });

    it("opens dropdown on Enter when closed", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      act(() => { result.current.handleKeyDown(makeKeyEvent("Enter")); });
      expect(result.current.isOpen).toBe(true);
    });

    it("Space key works same as Enter", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: flatOptions,
          defaultOpen: true,
          closeOnSelect: false,
          onValueChange,
        })
      );
      act(() => { result.current.setFocusedIndex(1); });
      act(() => { result.current.handleKeyDown(makeKeyEvent(" ")); });
      expect(onValueChange).toHaveBeenCalledWith(
        { root: "vegetables" },
        [flatOptions[1]]
      );
    });
  });

  // ── 19. Keyboard – Tab ──────────────────────────────────────────────────────
  describe("keyboard navigation – Tab", () => {
    it("closes dropdown on Tab", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, defaultOpen: true })
      );
      act(() => { result.current.handleKeyDown(makeKeyEvent("Tab")); });
      expect(result.current.isOpen).toBe(false);
    });
  });

  // ── 20. Keyboard – disabled dropdown ───────────────────────────────────────
  describe("keyboard navigation – disabled dropdown", () => {
    it("ignores all key events when disabled", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, disabled: true })
      );
      act(() => { result.current.handleKeyDown(makeKeyEvent("ArrowDown")); });
      expect(result.current.isOpen).toBe(false);
    });
  });

  // ── 21. handleSubmenuItemHover ──────────────────────────────────────────────
  describe("handleSubmenuItemHover", () => {
    it("sets submenuFocusedIndex", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions })
      );
      act(() => { result.current.handleSubmenuItemHover(2); });
      expect(result.current.submenuFocusedIndex).toBe(2);
    });
  });

  // ── 22. handleSubmenuMouseEnter / Leave ─────────────────────────────────────
  describe("handleSubmenuMouseEnter / Leave", () => {
    it("handleSubmenuMouseEnter does not throw", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions })
      );
      expect(() => {
        act(() => { result.current.handleSubmenuMouseEnter(); });
      }).not.toThrow();
    });

    it("handleSubmenuMouseLeave does not throw", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions })
      );
      expect(() => {
        act(() => { result.current.handleSubmenuMouseLeave(); });
      }).not.toThrow();
    });
  });

  // ── 23. Client-side menu search ─────────────────────────────────────────────
  describe("client-side menu search (showMenuSearch)", () => {
    it("filters options by search query", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, showMenuSearch: true })
      );
      act(() => { result.current.onMenuSearchChange("veg"); });
      expect(result.current.filteredOptions).toHaveLength(1);
      expect(result.current.filteredOptions[0].value).toBe("vegetables");
    });

    it("resets focusedIndex when search changes", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, showMenuSearch: true, defaultOpen: true })
      );
      act(() => { result.current.setFocusedIndex(2); });
      act(() => { result.current.onMenuSearchChange("fr"); });
      expect(result.current.focusedIndex).toBe(-1);
    });

    it("returns all options when query is empty", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, showMenuSearch: true })
      );
      act(() => { result.current.onMenuSearchChange("fr"); });
      act(() => { result.current.onMenuSearchChange(""); });
      expect(result.current.filteredOptions).toHaveLength(3);
    });

    it("is case-insensitive", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, showMenuSearch: true })
      );
      act(() => { result.current.onMenuSearchChange("FRUITS"); });
      expect(result.current.filteredOptions).toHaveLength(1);
    });
  });

  // ── 24. Client-side submenu search ──────────────────────────────────────────
  describe("client-side submenu search (showSubmenuSearch)", () => {
    it("filters submenu options by query", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, showSubmenuSearch: true })
      );
      act(() => { result.current.onSubmenuSearchChange("app"); });
      const filtered = result.current.getFilteredSubmenuOptions(nestedOptions[0]);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].value).toBe("apple");
    });

    it("resets submenuFocusedIndex when search changes", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, showSubmenuSearch: true })
      );
      act(() => { result.current.setSubmenuFocusedIndex(1); });
      act(() => { result.current.onSubmenuSearchChange("app"); });
      expect(result.current.submenuFocusedIndex).toBe(-1);
    });

    it("returns all children when query is empty", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, showSubmenuSearch: true })
      );
      const filtered = result.current.getFilteredSubmenuOptions(nestedOptions[0]);
      expect(filtered).toHaveLength(2);
    });
  });

  // ── 25. Async menu search ───────────────────────────────────────────────────
  describe("async menu search (onMenuSearch)", () => {
    beforeEach(() => { vi.useFakeTimers(); });

    it("calls onMenuSearch after debounce delay", async () => {
      const onMenuSearch = vi.fn().mockResolvedValue([flatOptions[0]]);
      const { result } = renderHook(() =>
        useCascadingDropdown({
          options: flatOptions,
          onMenuSearch,
          searchDebounceMs: 300,
        })
      );
      act(() => { result.current.onMenuSearchChange("fru"); });
      // Not called immediately
      expect(onMenuSearch).not.toHaveBeenCalled();
      // Advance timers
      await act(async () => { vi.advanceTimersByTime(300); });
      expect(onMenuSearch).toHaveBeenCalledWith("fru");
    });

    it("sets isMenuSearching=true while debounce is pending", () => {
      const onMenuSearch = vi.fn().mockResolvedValue([]);
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, onMenuSearch, searchDebounceMs: 300 })
      );
      act(() => { result.current.onMenuSearchChange("fru"); });
      expect(result.current.isMenuSearching).toBe(true);
    });

    it("resets isMenuSearching when query is cleared", () => {
      const onMenuSearch = vi.fn().mockResolvedValue([]);
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, onMenuSearch, searchDebounceMs: 300 })
      );
      act(() => { result.current.onMenuSearchChange("fru"); });
      act(() => { result.current.onMenuSearchChange(""); });
      expect(result.current.isMenuSearching).toBe(false);
    });

    afterEach(() => { vi.useRealTimers(); });
  });

  // ── 26. setFocusedIndex / setSubmenuFocusedIndex ────────────────────────────
  describe("setFocusedIndex and setSubmenuFocusedIndex", () => {
    it("setFocusedIndex updates focusedIndex", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      act(() => { result.current.setFocusedIndex(1); });
      expect(result.current.focusedIndex).toBe(1);
    });

    it("setSubmenuFocusedIndex updates submenuFocusedIndex", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions })
      );
      act(() => { result.current.setSubmenuFocusedIndex(3); });
      expect(result.current.submenuFocusedIndex).toBe(3);
    });
  });

  // ── 27. getFilteredSubmenuOptions – loadedChildren fallback ─────────────────
  describe("getFilteredSubmenuOptions with static children", () => {
    it("returns children from the option when no loadedChildren", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions })
      );
      const children = result.current.getFilteredSubmenuOptions(nestedOptions[0]);
      expect(children).toEqual(nestedOptions[0].children);
    });

    it("returns empty array for option with no children", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions })
      );
      const children = result.current.getFilteredSubmenuOptions(flatOptions[0]);
      expect(children).toEqual([]);
    });
  });

  // ── 28. onLoadChildren (async child loading) ────────────────────────────────
  describe("onLoadChildren", () => {
    it("loads children when hovering option with hasChildren", async () => {
      const dynamicChildren: CascadingOption[] = [
        { value: "dynamic-1", label: "Dynamic 1" },
      ];
      const onLoadChildren = vi.fn().mockResolvedValue(dynamicChildren);
      const lazyOptions: CascadingOption[] = [
        { value: "lazy", label: "Lazy", hasChildren: true },
      ];
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: lazyOptions, onLoadChildren })
      );
      await act(async () => {
        result.current.handleMenuItemHover(lazyOptions[0], 0);
      });
      expect(onLoadChildren).toHaveBeenCalledWith(lazyOptions[0]);
      expect(result.current.loadedChildren["lazy"]).toEqual(dynamicChildren);
    });

    it("calls onLoadError when onLoadChildren rejects", async () => {
      const error = new Error("Load failed");
      const onLoadChildren = vi.fn().mockRejectedValue(error);
      const onLoadError = vi.fn();
      const lazyOptions: CascadingOption[] = [
        { value: "lazy", label: "Lazy", hasChildren: true },
      ];
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: lazyOptions, onLoadChildren, onLoadError })
      );
      await act(async () => {
        result.current.handleMenuItemHover(lazyOptions[0], 0);
      });
      expect(onLoadError).toHaveBeenCalledWith(error);
    });
  });

  // ── 29. menuSearchQuery / submenuSearchQuery state ──────────────────────────
  describe("search query state", () => {
    it("tracks menuSearchQuery", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, showMenuSearch: true })
      );
      act(() => { result.current.onMenuSearchChange("hello"); });
      expect(result.current.menuSearchQuery).toBe("hello");
    });

    it("tracks submenuSearchQuery", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, showSubmenuSearch: true })
      );
      act(() => { result.current.onSubmenuSearchChange("world"); });
      expect(result.current.submenuSearchQuery).toBe("world");
    });

    it("handleClose resets menuSearchQuery to empty string", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: flatOptions, showMenuSearch: true, defaultOpen: true })
      );
      act(() => { result.current.onMenuSearchChange("test"); });
      act(() => { result.current.handleClose(); });
      expect(result.current.menuSearchQuery).toBe("");
    });

    it("handleClose resets submenuSearchQuery to empty string", () => {
      const { result } = renderHook(() =>
        useCascadingDropdown({ options: nestedOptions, showSubmenuSearch: true, defaultOpen: true })
      );
      act(() => { result.current.onSubmenuSearchChange("test"); });
      act(() => { result.current.handleClose(); });
      expect(result.current.submenuSearchQuery).toBe("");
    });
  });
});
