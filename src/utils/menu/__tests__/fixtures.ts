/**
 * The list shapes the keyboard model has to hold up under.
 *
 * Written as data rather than inline per test because the interesting cases are
 * all about *which* items are disabled: a disabled first item, a disabled last
 * item, and a run of them in the middle each break a different part of the
 * wrap-and-skip loop, and the family's own bugs were all in that loop.
 */
export interface MenuFixture {
  name: string;
  items: string[];
  disabled: number[];
  note?: string;
}

const LETTERS = ["Apple", "Banana", "Cherry", "Damson", "Elderberry"];

export const MENU_FIXTURES: MenuFixture[] = [
  { name: "all-enabled", items: LETTERS, disabled: [] },
  {
    name: "first-disabled",
    items: LETTERS,
    disabled: [0],
    note: "ArrowDown from the last item must wrap past index 0, not onto it.",
  },
  {
    name: "last-disabled",
    items: LETTERS,
    disabled: [LETTERS.length - 1],
    note: "End must land on the last *enabled* item, not the last item.",
  },
  {
    name: "middle-run-disabled",
    items: LETTERS,
    disabled: [1, 2, 3],
    note: "A single step has to cross a run, not stop inside it.",
  },
  {
    name: "single-enabled",
    items: LETTERS,
    disabled: [0, 1, 3, 4],
    note: "Every move resolves to the same index; nothing may loop forever.",
  },
  {
    name: "all-disabled",
    items: LETTERS,
    disabled: [0, 1, 2, 3, 4],
    note: "No selectable item at all — the scan must terminate and commit nothing.",
  },
  { name: "empty", items: [], disabled: [] },
];
