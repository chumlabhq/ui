import { useCallback, useEffect, useRef, useState } from "react";

export interface MenuNavigationOptions<T> {
  items: readonly T[];
  isOpen: boolean;
  /** Marks an item that may be focused past but never committed. */
  isDisabled?: (item: T, index: number) => boolean;
  /** Runs when Enter or Space commits the active item. */
  onSelect?: (item: T, index: number) => void;
  /** Runs when a closed surface should open — ArrowDown, Enter, Space. */
  onOpen?: () => void;
  /** Runs when Escape or Tab dismisses the surface. */
  onClose?: (reason: "escape" | "tab") => void;
  /**
   * Type-to-jump. Opt-in, because the family was split on it: two comboboxes
   * implement it and two visually identical ones do not, and nothing recorded
   * why. Making it a parameter turns that into a decision.
   */
  typeahead?: { getLabel: (item: T) => string; timeout?: number };
}

export interface MenuNavigation {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  /** First selectable index, or -1. Used to seed focus when the surface opens. */
  firstEnabledIndex: number;
}

const DEFAULT_TYPEAHEAD_MS = 500;

/**
 * The roving list and its keyboard model, shared.
 *
 * Ten surfaces implemented this by hand and split on three points — Space,
 * skipping disabled items, and type-ahead. On every one of them the majority
 * behaviour was also the correct one, so this is that behaviour and the
 * outliers are defects rather than variants. `docs/MENU-PRIMITIVE-SURVEY.md`
 * records which component was wrong on which point.
 *
 * Index-based rather than DOM-based: seven of the ten keep focus on the trigger
 * and point at the active item with `aria-activedescendant`. A hook that moved
 * real focus would not fit them, and a hook that only tracked an index would not
 * fit the three that move focus — so this owns the index and the caller decides
 * what to do with it.
 */
export function useMenuNavigation<T>({
  items,
  isOpen,
  isDisabled,
  onSelect,
  onOpen,
  onClose,
  typeahead,
}: MenuNavigationOptions<T>): MenuNavigation {
  const [activeIndex, setActiveIndex] = useState(-1);
  const typedRef = useRef("");
  const typedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const disabled = useCallback(
    (index: number) => (isDisabled ? isDisabled(items[index], index) : false),
    [isDisabled, items],
  );

  /**
   * The next selectable index in `step` direction, wrapping once.
   *
   * Wrapping and skipping are one operation: scanning forward from the wrapped
   * position and then from the start is what makes "last item, ArrowDown, first
   * enabled item" work when the first item is disabled.
   */
  const nextEnabled = useCallback(
    (from: number, step: 1 | -1): number => {
      const count = items.length;
      if (count === 0) return -1;
      // Nothing active yet: the first press lands on the near end rather than
      // one step back from it.
      const start = from < 0 ? (step === 1 ? -1 : 0) : from;
      for (let offset = 1; offset <= count; offset += 1) {
        const index = (((start + step * offset) % count) + count) % count;
        if (!disabled(index)) return index;
      }
      return from;
    },
    [items.length, disabled],
  );

  const edgeEnabled = useCallback(
    (edge: "first" | "last"): number => {
      const order =
        edge === "first"
          ? items.map((_, i) => i)
          : items.map((_, i) => items.length - 1 - i);
      for (const index of order) if (!disabled(index)) return index;
      return -1;
    },
    [items, disabled],
  );

  const firstEnabledIndex = edgeEnabled("first");

  // A closed surface has no active item. Without this the next open starts on
  // whatever was highlighted when it closed, which reads as a stuck highlight.
  //
  // Adjusted during render rather than from an effect: setting state inside one
  // schedules a second pass before the first has painted, and this repo already
  // derives open-state resets this way (`useStablePositionAfterOpen`).
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) setActiveIndex(-1);
  }

  useEffect(() => () => clearTimeout(typedTimerRef.current), []);

  const jumpToTyped = useCallback(
    (key: string) => {
      if (!typeahead) return false;
      clearTimeout(typedTimerRef.current);
      typedRef.current += key.toLowerCase();
      typedTimerRef.current = setTimeout(() => {
        typedRef.current = "";
      }, typeahead.timeout ?? DEFAULT_TYPEAHEAD_MS);

      const query = typedRef.current;
      // Searched from the item after the active one, so repeating a letter
      // walks through the matches instead of sticking on the first.
      for (let offset = 1; offset <= items.length; offset += 1) {
        const index = (activeIndex + offset + items.length) % items.length;
        if (disabled(index)) continue;
        if (typeahead.getLabel(items[index]).toLowerCase().startsWith(query)) {
          setActiveIndex(index);
          return true;
        }
      }
      return false;
    },
    [typeahead, items, activeIndex, disabled],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const commit = () => {
        if (activeIndex >= 0 && !disabled(activeIndex)) {
          onSelect?.(items[activeIndex], activeIndex);
        }
      };

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            onOpen?.();
            setActiveIndex(firstEnabledIndex);
          } else {
            setActiveIndex((prev) => nextEnabled(prev, 1));
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          if (!isOpen) {
            onOpen?.();
            setActiveIndex(edgeEnabled("last"));
          } else {
            setActiveIndex((prev) => nextEnabled(prev, -1));
          }
          break;

        case "Home":
          if (!isOpen) break;
          event.preventDefault();
          setActiveIndex(edgeEnabled("first"));
          break;

        case "End":
          if (!isOpen) break;
          event.preventDefault();
          setActiveIndex(edgeEnabled("last"));
          break;

        case "Enter":
        case " ":
          // Space is a selection key for both listbox and menu. TimePicker was
          // the one surface that answered Enter and ignored Space.
          event.preventDefault();
          if (!isOpen) onOpen?.();
          else commit();
          break;

        case "Escape":
          if (!isOpen) break;
          event.preventDefault();
          onClose?.("escape");
          break;

        case "Tab":
          // Not prevented: Tab must keep moving. It dismisses without
          // committing, which is what distinguishes it from Enter.
          if (isOpen) onClose?.("tab");
          break;

        default:
          // A single printable character, and no modifier — Ctrl+A and the like
          // belong to the browser.
          if (
            isOpen &&
            typeahead &&
            event.key.length === 1 &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey
          ) {
            if (jumpToTyped(event.key)) event.preventDefault();
          }
      }
    },
    [
      isOpen,
      items,
      activeIndex,
      disabled,
      nextEnabled,
      edgeEnabled,
      firstEnabledIndex,
      onSelect,
      onOpen,
      onClose,
      typeahead,
      jumpToTyped,
    ],
  );

  return { activeIndex, setActiveIndex, onKeyDown, firstEnabledIndex };
}
