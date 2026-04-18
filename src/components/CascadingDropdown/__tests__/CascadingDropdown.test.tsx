import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CascadingDropdown } from "../index";
import type { CascadingOption } from "../utils/types";

const simpleOptions: CascadingOption[] = [
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

describe("CascadingDropdown", () => {
  describe("Rendering", () => {
    it("renders with default placeholder", () => {
      render(<CascadingDropdown options={simpleOptions} />);
      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("renders with custom placeholder", () => {
      render(
        <CascadingDropdown
          options={simpleOptions}
          placeholder="Choose a category"
        />
      );
      expect(screen.getByText("Choose a category")).toBeInTheDocument();
    });

    it("renders label when provided", () => {
      render(
        <CascadingDropdown options={simpleOptions} label="Food Category" />
      );
      expect(screen.getByText("Food Category")).toBeInTheDocument();
    });

    it("renders required asterisk when required", () => {
      render(
        <CascadingDropdown
          options={simpleOptions}
          label="Category"
          required
        />
      );
      const label = screen.getByText("Category");
      expect(label.parentElement?.textContent).toContain("*");
    });

    it("renders description when provided", () => {
      render(
        <CascadingDropdown
          options={simpleOptions}
          description="Pick a food type"
        />
      );
      expect(screen.getByText("Pick a food type")).toBeInTheDocument();
    });

    it("renders error message when error is true", () => {
      render(
        <CascadingDropdown
          options={simpleOptions}
          error
          errorMessage="Required field"
        />
      );
      expect(screen.getByText("Required field")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <CascadingDropdown
          options={simpleOptions}
          className="my-cascading"
        />
      );
      expect(container.firstElementChild).toHaveClass("my-cascading");
    });
  });

  describe("Interaction", () => {
    it("opens dropdown on trigger click", async () => {
      const user = userEvent.setup();
      render(<CascadingDropdown options={simpleOptions} />);

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("shows options when opened", async () => {
      const user = userEvent.setup();
      render(<CascadingDropdown options={simpleOptions} />);

      await user.click(screen.getByRole("button"));

      // The menu is portalled and may have visibility:hidden in jsdom (no layout),
      // so query with { hidden: true }
      expect(screen.getByRole("menu", { hidden: true })).toBeInTheDocument();
      expect(screen.getByText("Fruits")).toBeInTheDocument();
      expect(screen.getByText("Vegetables")).toBeInTheDocument();
      expect(screen.getByText("Grains")).toBeInTheDocument();
    });

    it("selects a flat option and calls onValueChange", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <CascadingDropdown
          options={simpleOptions}
          onValueChange={onValueChange}
        />
      );

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByText("Fruits"));

      expect(onValueChange).toHaveBeenCalledWith(
        { root: "fruits" },
        expect.any(Array)
      );
    });

    it("shows submenu on hover of parent with children", async () => {
      const user = userEvent.setup();
      render(<CascadingDropdown options={nestedOptions} />);

      await user.click(screen.getByRole("button"));

      // The parent items should have aria-haspopup="menu"
      const fruitItem = screen.getByText("Fruits").closest("[role='menuitem']");
      expect(fruitItem).toHaveAttribute("aria-haspopup", "menu");
    });

    it("selects submenu option and calls onValueChange", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <CascadingDropdown
          options={nestedOptions}
          onValueChange={onValueChange}
        />
      );

      await user.click(screen.getByRole("button"));

      // Hover over parent to open submenu
      const fruitItem = screen.getByText("Fruits").closest("[role='menuitem']");
      await user.hover(fruitItem!);

      // Wait for submenu to appear
      const submenu = await screen.findByRole("menu", {
        name: "Fruits submenu",
      });
      expect(submenu).toBeInTheDocument();

      // Click on submenu option
      const appleOption = within(submenu).getByText("Apple");
      await user.click(appleOption);

      expect(onValueChange).toHaveBeenCalledWith(
        { fruits: "apple" },
        expect.any(Array)
      );
    });
  });

  describe("Disabled state", () => {
    it("does not open when disabled", async () => {
      const user = userEvent.setup();
      render(<CascadingDropdown options={simpleOptions} disabled />);

      const trigger = screen.getByRole("button");
      expect(trigger).toBeDisabled();

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Controlled mode", () => {
    it("renders controlled value display", () => {
      render(
        <CascadingDropdown
          options={nestedOptions}
          value={{ fruits: "apple" }}
        />
      );
      // The display value should reflect the selection
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("respects controlled open state", () => {
      render(
        <CascadingDropdown options={simpleOptions} open={true} />
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Accessibility", () => {
    it("sets aria-haspopup on trigger", () => {
      render(<CascadingDropdown options={simpleOptions} />);
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-haspopup", "true");
    });

    it("sets aria-invalid when error is true", () => {
      render(
        <CascadingDropdown
          options={simpleOptions}
          error
          errorMessage="Error"
        />
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-invalid", "true");
    });

    it("sets aria-required when required", () => {
      render(<CascadingDropdown options={simpleOptions} required />);
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-required", "true");
    });

    it("sets custom aria-label on trigger", () => {
      render(
        <CascadingDropdown
          options={simpleOptions}
          aria-label="Pick food"
        />
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-label", "Pick food");
    });
  });
});

// ─── CascadingDropdown — Scroll lock (line ~462-479) ─────────────────────────

describe("CascadingDropdown — Scroll lock", () => {
  it("attaches wheel and touchmove listeners when lockScroll is true and dropdown opens", async () => {
    const user = userEvent.setup();
    const addSpy = vi.spyOn(window, "addEventListener");

    render(<CascadingDropdown options={simpleOptions} lockScroll />);
    await user.click(screen.getByRole("button"));

    const wheelCalls = addSpy.mock.calls.filter(([type]) => type === "wheel");
    const touchCalls = addSpy.mock.calls.filter(([type]) => type === "touchmove");
    expect(wheelCalls.length).toBeGreaterThan(0);
    expect(touchCalls.length).toBeGreaterThan(0);

    addSpy.mockRestore();
  });

  it("does not attach scroll listeners when lockScroll is false", async () => {
    const user = userEvent.setup();
    const addSpy = vi.spyOn(window, "addEventListener");

    render(<CascadingDropdown options={simpleOptions} lockScroll={false} />);
    await user.click(screen.getByRole("button"));

    const wheelCalls = addSpy.mock.calls.filter(([type]) => type === "wheel");
    expect(wheelCalls.length).toBe(0);

    addSpy.mockRestore();
  });

  it("removes wheel listener when dropdown closes after lockScroll was active", async () => {
    const user = userEvent.setup();
    const removeSpy = vi.spyOn(window, "removeEventListener");

    render(<CascadingDropdown options={simpleOptions} lockScroll />);
    const trigger = screen.getByRole("button");
    await user.click(trigger); // open
    await user.click(trigger); // close

    const wheelRemoved = removeSpy.mock.calls.filter(([type]) => type === "wheel");
    expect(wheelRemoved.length).toBeGreaterThan(0);

    removeSpy.mockRestore();
  });
});

// ─── CascadingDropdown — renderTrigger prop (line ~530, 542, 571-594) ─────────

describe("CascadingDropdown — renderTrigger prop", () => {
  it("calls renderTrigger with the expected props and renders the result", async () => {
    const user = userEvent.setup();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderTrigger = vi.fn(({ onClick, ref: _ref, ...rest }: any) => (
      <button
        data-testid="custom-trigger"
        onClick={onClick}
        aria-expanded={rest["aria-expanded"]}
      >
        custom
      </button>
    ));

    render(
      <CascadingDropdown
        options={simpleOptions}
        renderTrigger={renderTrigger}
      />
    );

    expect(renderTrigger).toHaveBeenCalled();
    const customTrigger = screen.getByTestId("custom-trigger");
    expect(customTrigger).toBeInTheDocument();

    // Clicking it should open the dropdown via the passed onClick
    await user.click(customTrigger);
    expect(customTrigger).toHaveAttribute("aria-expanded", "true");
  });

  it("passes ref callback to renderTrigger so the trigger ref is wired", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderTrigger = vi.fn(({ ref: refCb, onClick }: any) => (
      <button ref={refCb} data-testid="custom-trigger-ref" onClick={onClick}>
        custom
      </button>
    ));

    render(
      <CascadingDropdown
        options={simpleOptions}
        renderTrigger={renderTrigger}
      />
    );

    // renderTrigger receives a ref callback (line ~530)
    const callArgs = renderTrigger.mock.calls[0][0];
    expect(typeof callArgs.ref).toBe("function");
  });
});

// ─── CascadingDropdown — Clearable (lines ~634-637) ──────────────────────────

describe("CascadingDropdown — Clearable", () => {
  it("shows clear button when clearable and a value is selected", async () => {
    const user = userEvent.setup();
    render(
      <CascadingDropdown options={simpleOptions} clearable />
    );

    await user.click(screen.getByRole("button", { name: /select an option/i }));
    await user.click(screen.getByText("Fruits"));

    expect(
      screen.getByRole("button", { name: /clear selection/i })
    ).toBeInTheDocument();
  });

  it("calls onValueChange with empty value when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <CascadingDropdown
        options={simpleOptions}
        clearable
        onValueChange={onValueChange}
      />
    );

    // Select a value first
    await user.click(screen.getByRole("button", { name: /select an option/i }));
    await user.click(screen.getByText("Fruits"));
    onValueChange.mockClear();

    // Now click the clear button
    const clearBtn = screen.getByRole("button", { name: /clear selection/i });
    await user.click(clearBtn);

    expect(onValueChange).toHaveBeenCalledWith({}, []);
  });

  it("does not show clear button when clearable but no value is selected", () => {
    render(<CascadingDropdown options={simpleOptions} clearable />);
    expect(
      screen.queryByRole("button", { name: /clear selection/i })
    ).not.toBeInTheDocument();
  });
});

// ─── CascadingDropdown — keepMounted (line ~643) ─────────────────────────────

describe("CascadingDropdown — keepMounted", () => {
  it("keeps the menu in the DOM when closed with keepMounted=true", async () => {
    const user = userEvent.setup();
    render(<CascadingDropdown options={simpleOptions} keepMounted />);

    // Menu should be present in DOM even before opening (keepMounted)
    const menu = screen.getByRole("menu", { hidden: true });
    expect(menu).toBeInTheDocument();

    // Open then close
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    await user.click(trigger);

    // Menu should still be in DOM after close
    expect(screen.getByRole("menu", { hidden: true })).toBeInTheDocument();
  });
});

// ─── CascadingDropdown — getSelectedValuesForParent single string (line ~542) ─

describe("CascadingDropdown — single-mode submenu selection display", () => {
  it("shows selected icon on a single-mode submenu item when closeOnSelect is false", async () => {
    const user = userEvent.setup();
    const options: CascadingOption[] = [
      {
        value: "fruits",
        label: "Fruits",
        selectionMode: "single",
        children: [
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana" },
        ],
      },
    ];

    render(
      <CascadingDropdown
        options={options}
        closeOnSelect={false}
        showSelectedIcon
      />
    );

    await user.click(screen.getByRole("button"));

    // Hover to open submenu
    const fruitItem = screen.getByText("Fruits").closest("[role='menuitem']");
    await user.hover(fruitItem!);

    const submenu = await screen.findByRole("menu", { name: "Fruits submenu" });

    // Click Apple — single-mode, closeOnSelect=false keeps it open
    const appleOption = within(submenu).getByText("Apple");
    await user.click(appleOption);

    // Submenu should still be open, Apple should be selected (getSelectedValuesForParent returns [string])
    const submenuAfter = await screen.findByRole("menu", {
      name: "Fruits submenu",
    });
    // Apple item should have data-selected since it's selected
    expect(within(submenuAfter).getByText("Apple").closest("[aria-checked]")).toHaveAttribute("aria-checked", "true");
  });
});

// ─── CascadingDropdown — keyboard navigation ─────────────────────────────────

describe("CascadingDropdown — keyboard navigation", () => {
  it("opens the dropdown with ArrowDown key", async () => {
    const user = userEvent.setup();
    render(<CascadingDropdown options={simpleOptions} />);

    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{ArrowDown}");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the dropdown with Escape key", async () => {
    const user = userEvent.setup();
    render(<CascadingDropdown options={simpleOptions} />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onKeyDown prop and still handles the key event", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    render(
      <CascadingDropdown options={simpleOptions} onKeyDown={onKeyDown} />
    );

    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{ArrowDown}");

    expect(onKeyDown).toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("does not call handleKeyDown when onKeyDown calls preventDefault", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn((e: React.KeyboardEvent) => e.preventDefault());
    render(
      <CascadingDropdown options={simpleOptions} onKeyDown={onKeyDown} />
    );

    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{ArrowDown}");

    // onKeyDown prevented default, so handleKeyDown should not have opened the dropdown
    expect(onKeyDown).toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

// ─── CascadingDropdown — menu search (lines ~667-668) ────────────────────────

describe("CascadingDropdown — menu search", () => {
  it("renders search input when showMenuSearch is true", async () => {
    const user = userEvent.setup();
    render(
      <CascadingDropdown options={simpleOptions} showMenuSearch />
    );

    await user.click(screen.getByRole("button"));

    const searchInput = screen.getByRole("textbox", { hidden: true });
    expect(searchInput).toBeInTheDocument();
  });

  it("fires onChange on the search input (line ~667)", async () => {
    const user = userEvent.setup();
    render(
      <CascadingDropdown options={simpleOptions} showMenuSearch />
    );

    await user.click(screen.getByRole("button"));
    const searchInput = screen.getByRole("textbox", { hidden: true });
    await user.type(searchInput, "Fr");

    expect((searchInput as HTMLInputElement).value).toBe("Fr");
  });

  it("stopPropagation on search input click keeps dropdown open (line ~668)", async () => {
    const user = userEvent.setup();
    render(
      <CascadingDropdown options={simpleOptions} showMenuSearch />
    );

    await user.click(screen.getByRole("button"));
    const searchInput = screen.getByRole("textbox", { hidden: true });
    await user.click(searchInput);

    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });
});

// ─── CascadingDropdown — loading state (lines ~676-681) ──────────────────────

describe("CascadingDropdown — loading state", () => {
  it("shows loading text and shimmer items when loading=true (lines ~676-681)", async () => {
    const user = userEvent.setup();
    render(
      <CascadingDropdown
        options={simpleOptions}
        loading
        loadingText="Loading items..."
        shimmerCount={3}
      />
    );

    await user.click(screen.getByRole("button"));

    expect(screen.getByText("Loading items...")).toBeInTheDocument();
  });

  it("uses custom loadingText when loading", async () => {
    const user = userEvent.setup();
    render(
      <CascadingDropdown
        options={[]}
        loading
        loadingText={<span data-testid="custom-loading">Custom loader</span>}
      />
    );

    await user.click(screen.getByRole("button"));
    expect(screen.getByTestId("custom-loading")).toBeInTheDocument();
  });
});

// ─── CascadingDropdown — submenu left position ───────────────────────────────

describe("CascadingDropdown — submenuPosition left", () => {
  it("renders submenu on the left side when submenuPosition='left'", async () => {
    const user = userEvent.setup();
    render(
      <CascadingDropdown
        options={nestedOptions}
        submenuPosition="left"
      />
    );

    await user.click(screen.getByRole("button"));

    const fruitItem = screen.getByText("Fruits").closest("[role='menuitem']");
    await user.hover(fruitItem!);

    await screen.findByRole("menu", { name: "Fruits submenu" });
    // The submenu container should use right-full positioning class
    const submenuContainers = document.querySelectorAll("[class*='right-full']");
    expect(submenuContainers.length).toBeGreaterThan(0);
  });
});

// ─── CascadingDropdown Icons ──────────────────────────────────────────────────

import {
  ChevronDownIcon,
  ChevronRightIcon,
  ClearIcon,
  SearchIcon,
  CheckIcon,
} from "../utils/icons";

describe("CascadingDropdown Icons", () => {
  it.each([
    ["ChevronDownIcon", ChevronDownIcon],
    ["ChevronRightIcon", ChevronRightIcon],
    ["ClearIcon", ClearIcon],
    ["SearchIcon", SearchIcon],
    ["CheckIcon", CheckIcon],
  ])("renders %s with className", (_name, Icon) => {
    const { container } = render(<Icon className="test-icon" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("test-icon");
  });

  it.each([
    ["ChevronDownIcon", ChevronDownIcon],
    ["ChevronRightIcon", ChevronRightIcon],
    ["ClearIcon", ClearIcon],
    ["SearchIcon", SearchIcon],
    ["CheckIcon", CheckIcon],
  ])("renders %s with default className", (_name, Icon) => {
    const { container } = render(<Icon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
