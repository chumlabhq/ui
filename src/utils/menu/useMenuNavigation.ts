import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

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
   * The active index, when the caller owns it.
   *
   * The hook keeps its own by default. A caller that resets the index from a
   * callback declared before this hook runs — a loader clearing the highlight
   * when its options arrive — cannot reference a setter that does not exist
   * yet, so it passes its own state in instead.
   */
  activeIndex?: number;
  onActiveIndexChange?: Dispatch<SetStateAction<number>>;
  /**
   * What ArrowDown or ArrowUp highlights when they open a closed surface.
   *
   * `"edge"` — the near end of the list, which is the common case. `"none"`
   * leaves it to `onOpen`, for a surface that seeds from its current value:
   * Pagination opens on the row count already in use rather than on the first
   * option, and ARIA's combobox pattern allows either.
   */
  seedOnOpen?: "edge" | "none";
  /**
   * Whether Space commits the active item.
   *
   * True for a button trigger, where Space has no other meaning. False for a
   * text-input trigger: ARIA's editable combobox does not bind Space precisely
   * because it is a character, and TimePicker's input displays `2:30 PM` — a
   * format the user cannot type if Space is intercepted.
   */
  commitOnSpace?: boolean;
  /**
   * Type-to-jump. Opt-in, because the family was split on it: two comboboxes
   * implement it and two visually identical ones do not, and nothing recorded
   * why. Making it a parameter turns that into a decision.
   */
  typeahead?: { getLabel: (item: T) => string; timeout?: number };
}

export interface MenuNavigation {
  activeIndex: number;
  /** `useState`'s setter, so callers can update from the previous index. */
  setActiveIndex: Dispatch<SetStateAction<number>>;
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
  activeIndex: activeIndexProp,
  onActiveIndexChange,
  seedOnOpen = "edge",
  commitOnSpace = true,
  typeahead,
}: MenuNavigationOptions<T>): MenuNavigation {
  const [internalIndex, setInternalIndex] = useState(-1);
  const isControlled = activeIndexProp !== undefined;
  const activeIndex = isControlled ? activeIndexProp : internalIndex;
  // Written out rather than routed through `useControllableState`: the setter
  // has to keep a stable identity, or every callback below it re-creates on
  // each render and the compiler stops memoizing them.
  const setActiveIndex = useCallback<Dispatch<SetStateAction<number>>>(
    (value) => {
      onActiveIndexChange?.(value);
      if (!isControlled) setInternalIndex(value);
    },
    [onActiveIndexChange, isControlled],
  );
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

      // Searched from the item after the active one, so repeating a letter
      // walks through the matches instead of sticking on the first.
      const search = (query: string): number => {
        for (let offset = 1; offset <= items.length; offset += 1) {
          const index = (activeIndex + offset + items.length) % items.length;
          if (disabled(index)) continue;
          if (typeahead.getLabel(items[index]).toLowerCase().startsWith(query)) {
            return index;
          }
        }
        return -1;
      };

      let match = search(typedRef.current);
      // A query that matches nothing falls back to the character just typed, so
      // starting a new word does not dead-end against the previous one.
      if (match === -1 && typedRef.current.length > 1) {
        match = search(key.toLowerCase());
      }
      if (match === -1) return false;
      setActiveIndex(match);
      return true;
    },
    [typeahead, items, activeIndex, disabled, setActiveIndex],
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
            if (seedOnOpen === "edge") setActiveIndex(firstEnabledIndex);
          } else {
            setActiveIndex((prev) => nextEnabled(prev, 1));
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          if (!isOpen) {
            onOpen?.();
            if (seedOnOpen === "edge") setActiveIndex(edgeEnabled("last"));
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
        case " ": {
          // Space is a selection key for a listbox or a menu, and TimePicker was
          // the one surface that ignored it — but only where the trigger is not
          // an editable field. `commitOnSpace` is that distinction.
          if (event.key === " " && !commitOnSpace) break;
          event.preventDefault();
          if (!isOpen) onOpen?.();
          else commit();
          break;
        }

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
          //
          // Not gated on `isOpen`: a caller that opens on the first typed
          // character — Dropdown does — is still mid-update when this runs, so
          // its `isOpen` reads false for one more tick and the jump would be
          // dropped. Whether typing opens the surface is the caller's decision;
          // finding the match is not.
          if (
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
      seedOnOpen,
      commitOnSpace,
      typeahead,
      jumpToTyped,
      setActiveIndex,
    ],
  );

  return { activeIndex, setActiveIndex, onKeyDown, firstEnabledIndex };
}
