/** @jsxImportSource react */
import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useMenuNavigation } from "../useMenuNavigation.js";
import { MENU_FIXTURES } from "./fixtures.js";

const key = (k: string, extra: Partial<React.KeyboardEvent> = {}) =>
  ({ key: k, preventDefault: vi.fn(), ...extra }) as unknown as React.KeyboardEvent;

const setup = (
  items: string[],
  disabled: number[] = [],
  options: Partial<Parameters<typeof useMenuNavigation<string>>[0]> = {},
) =>
  renderHook(() =>
    useMenuNavigation<string>({
      items,
      isOpen: true,
      isDisabled: (_item, index) => disabled.includes(index),
      ...options,
    }),
  );

const LETTERS = ["Apple", "Banana", "Cherry", "Damson", "Elderberry"];

describe("useMenuNavigation", () => {
  describe("moving", () => {
    it("starts on the first item and wraps at the end", () => {
      const { result } = setup(LETTERS);
      act(() => result.current.onKeyDown(key("ArrowDown")));
      expect(result.current.activeIndex).toBe(0);
      for (let i = 0; i < 4; i += 1) act(() => result.current.onKeyDown(key("ArrowDown")));
      expect(result.current.activeIndex).toBe(4);
      act(() => result.current.onKeyDown(key("ArrowDown")));
      expect(result.current.activeIndex).toBe(0);
    });

    it("wraps backwards from nothing to the last item", () => {
      const { result } = setup(LETTERS);
      act(() => result.current.onKeyDown(key("ArrowUp")));
      expect(result.current.activeIndex).toBe(4);
    });

    it("Home and End go to the ends", () => {
      const { result } = setup(LETTERS);
      act(() => result.current.onKeyDown(key("End")));
      expect(result.current.activeIndex).toBe(4);
      act(() => result.current.onKeyDown(key("Home")));
      expect(result.current.activeIndex).toBe(0);
    });
  });

  describe("disabled items", () => {
    // Every fixture, every direction: the wrap-and-skip loop is where the
    // family's hand-written copies went wrong, and a run of disabled items in
    // the middle breaks a different branch than one at an edge.
    it.each(MENU_FIXTURES)("$name never rests on a disabled item", ({ items, disabled }) => {
      const { result } = setup(items, disabled);
      const selectable = items.map((_, i) => i).filter((i) => !disabled.includes(i));

      for (const k of ["ArrowDown", "ArrowUp", "Home", "End"]) {
        for (let press = 0; press < items.length + 2; press += 1) {
          act(() => result.current.onKeyDown(key(k)));
          const index = result.current.activeIndex;
          if (selectable.length === 0) {
            expect(index, `${k} found an item in a list with none enabled`).toBe(-1);
          } else {
            expect(disabled, `${k} landed on a disabled item`).not.toContain(index);
          }
        }
      }
    });

    it("crosses a run of disabled items in one step", () => {
      const { result } = setup(LETTERS, [1, 2, 3]);
      act(() => result.current.onKeyDown(key("ArrowDown")));
      expect(result.current.activeIndex).toBe(0);
      act(() => result.current.onKeyDown(key("ArrowDown")));
      expect(result.current.activeIndex).toBe(4);
    });

    it("End lands on the last enabled item, not the last item", () => {
      const { result } = setup(LETTERS, [4]);
      act(() => result.current.onKeyDown(key("End")));
      expect(result.current.activeIndex).toBe(3);
    });

    it("never commits a disabled item", () => {
      const onSelect = vi.fn();
      const { result } = setup(LETTERS, [0, 1, 2, 3, 4], { onSelect });
      act(() => result.current.onKeyDown(key("ArrowDown")));
      act(() => result.current.onKeyDown(key("Enter")));
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe("committing", () => {
    it.each(["Enter", " "])("%s commits the active item", (k) => {
      // Space as well as Enter: TimePicker answered only Enter, and its options
      // are a listbox, where Space is a selection key.
      const onSelect = vi.fn();
      const { result } = setup(LETTERS, [], { onSelect });
      act(() => result.current.onKeyDown(key("ArrowDown")));
      act(() => result.current.onKeyDown(key(k)));
      expect(onSelect).toHaveBeenCalledWith("Apple", 0);
    });

    it("leaves Space alone for an editable trigger", () => {
      // A text input needs the character. ARIA's editable combobox does not
      // bind Space for the same reason.
      const onSelect = vi.fn();
      const event = key(" ");
      const { result } = setup(LETTERS, [], { onSelect, commitOnSpace: false });
      act(() => result.current.onKeyDown(key("ArrowDown")));
      act(() => result.current.onKeyDown(event));
      expect(onSelect).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it("commits nothing when no item is active", () => {
      const onSelect = vi.fn();
      const { result } = setup(LETTERS, [], { onSelect });
      act(() => result.current.onKeyDown(key("Enter")));
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe("opening and closing", () => {
    const closed = (options = {}) =>
      renderHook(() =>
        useMenuNavigation<string>({ items: LETTERS, isOpen: false, ...options }),
      );

    it.each(["ArrowDown", "ArrowUp", "Enter", " "])("%s opens a closed surface", (k) => {
      const onOpen = vi.fn();
      const { result } = closed({ onOpen });
      act(() => result.current.onKeyDown(key(k)));
      expect(onOpen).toHaveBeenCalled();
    });

    it("Escape closes and says so", () => {
      const onClose = vi.fn();
      const { result } = setup(LETTERS, [], { onClose });
      act(() => result.current.onKeyDown(key("Escape")));
      expect(onClose).toHaveBeenCalledWith("escape");
    });

    it("Tab closes without committing, and does not swallow the key", () => {
      const onClose = vi.fn();
      const onSelect = vi.fn();
      const event = key("Tab");
      const { result } = setup(LETTERS, [], { onClose, onSelect });
      act(() => result.current.onKeyDown(key("ArrowDown")));
      act(() => result.current.onKeyDown(event));
      expect(onClose).toHaveBeenCalledWith("tab");
      expect(onSelect).not.toHaveBeenCalled();
      expect(event.preventDefault, "Tab must keep moving focus").not.toHaveBeenCalled();
    });

    it("does nothing on Escape when already closed", () => {
      const onClose = vi.fn();
      const { result } = closed({ onClose });
      act(() => result.current.onKeyDown(key("Escape")));
      expect(onClose).not.toHaveBeenCalled();
    });

    it("drops the active item when the surface closes", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) => useMenuNavigation<string>({ items: LETTERS, isOpen }),
        { initialProps: { isOpen: true } },
      );
      act(() => result.current.onKeyDown(key("ArrowDown")));
      expect(result.current.activeIndex).toBe(0);
      rerender({ isOpen: false });
      expect(result.current.activeIndex, "a stale highlight reappears on reopen").toBe(-1);
    });
  });

  describe("type-ahead", () => {
    const typeahead = { getLabel: (item: string) => item };

    it("jumps to the first match", () => {
      const { result } = setup(LETTERS, [], { typeahead });
      act(() => result.current.onKeyDown(key("c")));
      expect(result.current.activeIndex).toBe(2);
    });

    it("accumulates characters", () => {
      const { result } = setup(["Dam", "Damson", "Date"], [], { typeahead });
      act(() => result.current.onKeyDown(key("d")));
      act(() => result.current.onKeyDown(key("a")));
      act(() => result.current.onKeyDown(key("t")));
      expect(result.current.activeIndex).toBe(2);
    });

    it("falls back to the newest character when the query dead-ends", () => {
      // Typing "ba" then "c" should land on Cherry rather than searching for
      // "bac" and finding nothing.
      const { result } = setup(LETTERS, [], { typeahead });
      act(() => result.current.onKeyDown(key("b")));
      act(() => result.current.onKeyDown(key("a")));
      expect(result.current.activeIndex).toBe(1);
      act(() => result.current.onKeyDown(key("c")));
      expect(result.current.activeIndex).toBe(2);
    });

    it("skips disabled matches", () => {
      const { result } = setup(LETTERS, [2], { typeahead });
      act(() => result.current.onKeyDown(key("c")));
      expect(result.current.activeIndex).toBe(-1);
    });

    it("still searches while the surface is closed", () => {
      // A caller that opens on the first typed character is one tick behind:
      // its `isOpen` is still false when the key arrives.
      const { result } = renderHook(() =>
        useMenuNavigation<string>({ items: LETTERS, isOpen: false, typeahead }),
      );
      act(() => result.current.onKeyDown(key("c")));
      expect(result.current.activeIndex).toBe(2);
    });

    it("does nothing when the caller did not ask for it", () => {
      const { result } = setup(LETTERS);
      act(() => result.current.onKeyDown(key("c")));
      expect(result.current.activeIndex).toBe(-1);
    });

    it("leaves modified keys to the browser", () => {
      const event = key("a", { ctrlKey: true });
      const { result } = setup(LETTERS, [], { typeahead });
      act(() => result.current.onKeyDown(event));
      expect(result.current.activeIndex).toBe(-1);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe("self-check", () => {
    it("would catch a model that stopped skipping disabled items", () => {
      // The shape of the bug: a plain wrap with no scan.
      const naive = (from: number, count: number) => (from < count - 1 ? from + 1 : 0);
      expect(naive(0, 5)).toBe(1);

      const { result } = setup(LETTERS, [1]);
      act(() => result.current.onKeyDown(key("ArrowDown")));
      act(() => result.current.onKeyDown(key("ArrowDown")));
      expect(result.current.activeIndex, "the hook must not agree with the naive version").toBe(2);
    });
  });
});
