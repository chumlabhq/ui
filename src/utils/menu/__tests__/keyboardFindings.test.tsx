/** @jsxImportSource react */
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setReducedMotion } from "../../../test/matchMedia.js";
import { Avatar } from "../../../components/Avatar/index.js";
import { Breadcrumb } from "../../../components/Breadcrumb/index.js";
import { CascadingDropdown } from "../../../components/CascadingDropdown/index.js";
import { DatePicker } from "../../../components/DatePicker/index.js";
import { Dropdown } from "../../../components/Dropdown/index.js";
import { InternationalPhoneInput } from "../../../components/InternationalPhoneInput/index.js";
import { MultiSelectDropdown } from "../../../components/MultiSelectDropdown/index.js";
import { MultiSelectSearchableDropdown } from "../../../components/MultiSelectSearchableDropdown/index.js";
import { Pagination } from "../../../components/Pagination/index.js";
import { SearchableDropdown } from "../../../components/SearchableDropdown/index.js";
import { Table } from "../../../components/Table/index.js";
import { TimePicker } from "../../../components/TimePicker/index.js";
import { Tooltip } from "../../../components/Tooltip/index.js";

beforeEach(() => setReducedMotion(true));
afterEach(cleanup);

const OPTIONS = [
  { value: "a", label: "Apple", disabled: true },
  { value: "b", label: "Banana" },
  { value: "d", label: "Damson" },
];

const CASCADE = [
  {
    value: "fruit",
    label: "Fruit",
    children: [
      { value: "banana", label: "Banana" },
      { value: "damson", label: "Damson" },
    ],
  },
  { value: "leaf", label: "Leaf" },
  { value: "nuts", label: "Nuts", children: [{ value: "pecan", label: "Pecan" }] },
];

const COLLAPSED = [
  { id: "h", label: "Home", href: "#h" },
  { id: "one", label: "One", href: "#one" },
  { id: "two", label: "Two", href: "#two" },
  { id: "k", label: "Kept", href: "#k" },
  { id: "z", label: "Here" },
];

const trigger = () => screen.getByRole("combobox");
const menuTrigger = () => document.querySelector<HTMLElement>("button[aria-haspopup]")!;

/** A press on nothing focusable: the handlers run, then the browser moves focus to body. */
async function pressBlank() {
  fireEvent.mouseDown(document.body);
  (document.activeElement as HTMLElement | null)?.blur();
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

async function key(k: string, target: Element = document.activeElement ?? document.body) {
  await act(async () => {
    fireEvent.keyDown(target, { key: k });
  });
}

/** Where focus is when the browser runs Tab's default, which is after every listener and before any re-render. */
function focusWhenTabLands(from: Element) {
  let at: Element | null = null;
  const read = () => {
    at = document.activeElement;
  };
  from.addEventListener("keydown", read);
  window.addEventListener("keydown", read);
  fireEvent.keyDown(from, { key: "Tab" });
  window.removeEventListener("keydown", read);
  return at;
}

const OUTSIDE_PRESS: Array<[string, () => ReactNode, () => HTMLElement]> = [
  ["Dropdown", () => <Dropdown options={OPTIONS} aria-label="x" />, trigger],
  ["MultiSelectDropdown", () => <MultiSelectDropdown options={OPTIONS} aria-label="x" />, trigger],
  ["SearchableDropdown", () => <SearchableDropdown options={OPTIONS} aria-label="x" />, trigger],
  [
    "MultiSelectSearchableDropdown",
    () => <MultiSelectSearchableDropdown options={OPTIONS} aria-label="x" />,
    trigger,
  ],
  ["CascadingDropdown", () => <CascadingDropdown options={CASCADE} aria-label="x" />, menuTrigger],
  ["DatePicker", () => <DatePicker aria-label="x" />, trigger],
  [
    "InternationalPhoneInput",
    () => <InternationalPhoneInput aria-label="x" />,
    () => screen.getAllByRole("combobox")[0],
  ],
  [
    "Pagination",
    () => <Pagination totalPages={5} defaultValue={1} rowsPerPage={10} showRowsPerPage />,
    () => document.querySelector<HTMLElement>('[aria-haspopup="listbox"]')!,
  ],
  [
    "Breadcrumb",
    () => <Breadcrumb items={COLLAPSED} maxVisible={3} />,
    () => document.querySelector<HTMLElement>("button[aria-haspopup]")!,
  ],
];

describe("an outside press hands focus back to the trigger", () => {
  for (const [name, ui, find] of OUTSIDE_PRESS) {
    it(name, async () => {
      render(<>{ui()}</>);
      const el = find();
      el.focus();
      await act(async () => {
        fireEvent.click(el);
      });
      await pressBlank();
      expect(document.activeElement).toBe(el);
    });
  }

  it("TimePicker", async () => {
    render(<TimePicker aria-label="x" />);
    const input = screen.getByRole("combobox") as HTMLInputElement;
    input.focus();
    await key("ArrowDown", input);
    await pressBlank();
    expect(document.activeElement).toBe(input);
  });

  it("Table's filter dialog", async () => {
    render(
      <Table
        data={[{ id: "1", name: "Ada" }]}
        columns={[{ id: "name", accessorKey: "name", header: "Name" }]}
        filterable
        filterableColumns={{ name: { options: [{ label: "Ada", value: "Ada" }], multi: true } }}
      />,
    );
    const filter = document.querySelector<HTMLElement>('thead [aria-haspopup]')!;
    await act(async () => {
      fireEvent.click(filter);
    });
    await waitFor(() => expect(document.querySelector("[data-table-filter-content]")).not.toBeNull());
    await pressBlank();
    expect(document.activeElement).toBe(filter);
  });
});

describe("a press on a multi-select option keeps focus in the widget", () => {
  for (const [name, ui] of [
    ["MultiSelectDropdown", <MultiSelectDropdown key="m" options={OPTIONS} aria-label="x" defaultOpen />],
    ["MultiSelectSearchableDropdown", <MultiSelectSearchableDropdown key="s" options={OPTIONS} aria-label="x" defaultOpen />],
  ] as const) {
    it(name, async () => {
      render(ui);
      const option = await screen.findByRole("option", { name: "Banana" });
      expect(fireEvent.mouseDown(option)).toBe(false);
    });
  }
});

describe("Tab from a portalled search box goes on from the trigger", () => {
  for (const [name, ui] of [
    ["SearchableDropdown", <SearchableDropdown key="s" options={OPTIONS} aria-label="x" />],
    ["MultiSelectSearchableDropdown", <MultiSelectSearchableDropdown key="m" options={OPTIONS} aria-label="x" />],
  ] as const) {
    it(name, async () => {
      render(ui);
      const el = trigger();
      el.focus();
      await key("ArrowDown", el);
      const search = await screen.findByRole("textbox");
      search.focus();
      expect(focusWhenTabLands(search)).toBe(el);
    });
  }

  it("CascadingDropdown, from a menu item", async () => {
    render(<CascadingDropdown options={CASCADE} aria-label="x" />);
    const el = menuTrigger();
    el.focus();
    await key("ArrowDown", el);
    const item = await screen.findByRole("menuitem", { name: /Fruit/ });
    item.focus();
    expect(focusWhenTabLands(item)).toBe(el);
  });
});

describe("a printable key on a closed search trigger opens it and starts the search", () => {
  for (const [name, ui] of [
    ["SearchableDropdown", <SearchableDropdown key="s" options={OPTIONS} aria-label="x" />],
    ["MultiSelectSearchableDropdown", <MultiSelectSearchableDropdown key="m" options={OPTIONS} aria-label="x" />],
  ] as const) {
    it(name, async () => {
      render(ui);
      await key("d", trigger());
      const search = (await screen.findByRole("textbox")) as HTMLInputElement;
      expect(search.value).toBe("d");
    });
  }
});

describe("SearchableDropdown clears from an empty search box", () => {
  for (const k of ["Backspace", "Delete"]) {
    it(k, async () => {
      const onValueChange = vi.fn();
      render(
        <SearchableDropdown options={OPTIONS} aria-label="x" clearable defaultValue="b" onValueChange={onValueChange} />,
      );
      await key("ArrowDown", trigger());
      const search = await screen.findByRole("textbox");
      await key(k, search);
      expect(onValueChange).toHaveBeenCalled();
    });
  }
});

describe("CascadingDropdown's documented keys", () => {
  const opened = async () => {
    render(<CascadingDropdown options={CASCADE} aria-label="x" />);
    await key("ArrowDown", menuTrigger());
    return screen.findByRole("menu");
  };

  it("type-ahead jumps at the top level", async () => {
    await opened();
    await key("n", menuTrigger());
    await waitFor(() => expect(screen.getByRole("menuitem", { name: /Nuts/ }).getAttribute("data-highlighted")).not.toBeNull());
  });

  it("type-ahead jumps inside a submenu", async () => {
    await opened();
    await key("ArrowRight", menuTrigger());
    await screen.findByRole("menuitemcheckbox", { name: /Banana/ });
    await key("d", menuTrigger());
    await waitFor(() =>
      expect(screen.getByRole("menuitemcheckbox", { name: /Damson/ }).getAttribute("data-highlighted")).not.toBeNull(),
    );
  });

  for (const k of ["Enter", " "]) {
    it(`${JSON.stringify(k)} on the closed trigger lands on the first item, as ArrowDown does`, async () => {
      render(<CascadingDropdown options={CASCADE} aria-label="x" />);
      await key(k, menuTrigger());
      await waitFor(() => expect(screen.getByRole("menuitem", { name: /Fruit/ }).getAttribute("data-highlighted")).not.toBeNull());
    });
  }
});

describe("Breadcrumb's collapsed menu", () => {
  const opened = async (props: Record<string, unknown> = {}) => {
    render(<Breadcrumb items={COLLAPSED} maxVisible={3} {...props} />);
    const ellipsis = document.querySelector<HTMLElement>("button[aria-haspopup]")!;
    ellipsis.focus();
    await act(async () => {
      fireEvent.click(ellipsis);
    });
    return { ellipsis, item: await screen.findByRole("menuitem", { name: "One" }) };
  };

  for (const k of ["Enter", " "]) {
    it(`${JSON.stringify(k)} works as the first key on a freshly opened menu`, async () => {
      const onItemClick = vi.fn();
      const { item } = await opened({ onItemClick });
      await key(k, item);
      expect(onItemClick).toHaveBeenCalledTimes(1);
    });
  }

  it("an item with an href is a link, as the trail's are", async () => {
    const { item } = await opened();
    expect(item.tagName).toBe("A");
    expect(item.getAttribute("href")).toBe("#one");
  });

  it("selecting an item hands focus back to the ellipsis", async () => {
    const { ellipsis, item } = await opened({ onItemClick: () => {} });
    await act(async () => {
      fireEvent.click(item);
    });
    expect(document.activeElement).toBe(ellipsis);
  });
});

describe("Pagination's arrow", () => {
  it("hands focus to the current page when it disables itself", async () => {
    render(<Pagination totalPages={2} defaultValue={1} />);
    const next = screen.getByRole("button", { name: /next/i }) as HTMLButtonElement;
    next.focus();
    await act(async () => {
      fireEvent.click(next);
      next.blur();
    });
    expect(next.disabled).toBe(true);
    expect(document.activeElement?.getAttribute("aria-current")).toBe("page");
  });
});

describe("TimePicker", () => {
  it("ArrowUp opens the closed list on its last time", async () => {
    render(<TimePicker aria-label="x" />);
    const input = screen.getByRole("combobox");
    input.focus();
    await key("ArrowUp", input);
    await screen.findByRole("listbox");
    const options = screen.getAllByRole("option");
    expect(input.getAttribute("aria-activedescendant")).toBe(options[options.length - 1].id);
  });
});

describe("Tooltip with focus inside its bubble", () => {
  const bubble = async () => {
    render(
      <Tooltip content={<a href="#in">Inside</a>} open hideDelayDuration={0}>
        <button>Trigger</button>
      </Tooltip>,
    );
    const link = await screen.findByRole("link", { name: "Inside" });
    link.focus();
    return { link, button: screen.getByRole("button", { name: "Trigger" }) };
  };

  it("Escape returns focus to the trigger", async () => {
    const { button } = await bubble();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.activeElement).toBe(button);
  });

  it("Tab past its end leaves through the trigger", async () => {
    const { link, button } = await bubble();
    fireEvent.keyDown(link, { key: "Tab" });
    expect(document.activeElement).toBe(button);
  });

  it("Shift+Tab past its start returns to the trigger", async () => {
    const { link, button } = await bubble();
    expect(fireEvent.keyDown(link, { key: "Tab", shiftKey: true })).toBe(false);
    expect(document.activeElement).toBe(button);
  });

  it("the pointer leaving does not close it under the focus", async () => {
    const onOpenChange = vi.fn();
    render(
      <Tooltip content={<a href="#in">Inside</a>} defaultOpen onOpenChange={onOpenChange}>
        <button>Trigger</button>
      </Tooltip>,
    );
    const link = await screen.findByRole("link", { name: "Inside" });
    link.focus();
    fireEvent.mouseLeave(screen.getByRole("tooltip"));
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("a press outside hands focus to the trigger", async () => {
    const { button } = await bubble();
    await pressBlank();
    expect(document.activeElement).toBe(button);
  });
});

describe("Table's filter dialog walks its own controls", () => {
  it("Tab past the last control closes it and goes on from the trigger", async () => {
    render(
      <Table
        data={[{ id: "1", name: "Ada" }]}
        columns={[{ id: "name", accessorKey: "name", header: "Name" }]}
        filterable
        filterableColumns={{ name: { options: [{ label: "Ada", value: "Ada" }], multi: true } }}
      />,
    );
    const filter = document.querySelector<HTMLElement>('thead [aria-haspopup]')!;
    await act(async () => {
      fireEvent.click(filter);
    });
    await waitFor(() => expect(document.querySelector("[data-table-filter-content]")).not.toBeNull());
    const panel = document.querySelector<HTMLElement>("[data-table-filter-content]")!;
    for (let i = 0; i < 12 && document.querySelector("[data-table-filter-content]"); i += 1) {
      await key("Tab", document.activeElement!.closest("[data-table-filter-content]") ? document.activeElement! : panel);
    }
    expect(document.querySelector("[data-table-filter-content]")).toBeNull();
    expect(document.activeElement).toBe(filter);
  });
});

describe("Avatar with onClick", () => {
  it("is a focusable button", () => {
    render(<Avatar name="Ada" onClick={() => {}} />);
    const avatar = screen.getByRole("button", { name: "Ada" });
    expect(avatar.getAttribute("tabindex")).toBe("0");
  });

  for (const k of ["Enter", " "]) {
    it(`${JSON.stringify(k)} fires the same onClick`, () => {
      const onClick = vi.fn();
      render(<Avatar name="Ada" onClick={onClick} />);
      const avatar = screen.getByRole("button", { name: "Ada" });
      avatar.focus();
      fireEvent.keyDown(avatar, { key: k });
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  }
});

describe("MultiSelectSearchableDropdown's trigger keeps focus on a press in WebKit", () => {
  it("takes focus on the press and prevents the default that would drop it", () => {
    render(<MultiSelectSearchableDropdown options={OPTIONS} aria-label="x" />);
    const el = trigger();
    expect(fireEvent.mouseDown(el)).toBe(false);
    expect(document.activeElement).toBe(el);
  });
});
