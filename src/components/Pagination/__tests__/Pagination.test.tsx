import { StrictMode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../index.js";
import { DEFAULT_PAGINATION_CLASSES, UNSTYLED_PAGINATION_CLASSES } from "../utils/constants.js";

import { setReducedMotion } from "../../../test/matchMedia.js";

// The stub answers nothing by default, so every file that renders a
// motion-aware component states the preference it is testing under.
beforeEach(() => setReducedMotion(false));

let rafSpy: { mockRestore: () => void };

beforeEach(() => {
  rafSpy = vi
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation((cb) => {
      cb(0);
      return 0;
    });
});

afterEach(() => {
  rafSpy.mockRestore();
});

describe("Pagination", () => {
  /**
   * ADR 002 R6: `rowsPerPage` carries the selector's whole anatomy rather than
   * a string. Asserts both paths cross the boundary — a consumer's classes AND
   * `unstyled` — because a nested bag can silently keep its decoration if the
   * unstyled derivation stops at the object.
   */
  describe("R6 nested rowsPerPage", () => {
    it("takes a child bag, and unstyled reaches inside it", () => {
      const styled = DEFAULT_PAGINATION_CLASSES.rowsPerPage as Record<string, string>;
      const bare = UNSTYLED_PAGINATION_CLASSES.rowsPerPage as Record<string, string>;
      expect(typeof styled, "rowsPerPage must be the child's bag").toBe("object");
      for (const slot of ["root", "trigger", "content", "item", "icon", "positioner"]) {
        expect(styled, `rowsPerPage.${slot} missing`).toHaveProperty(slot);
        expect(bare, `unstyled dropped rowsPerPage.${slot}`).toHaveProperty(slot);
      }
      expect(styled.trigger).toContain("border");
      expect(bare.trigger, "unstyled stopped at the R6 boundary").not.toContain("border");
      expect(bare.root, "unstyled dropped the child's structural utilities").toContain("flex");
    });

    it("routes a consumer's nested classes onto the selector", () => {
      render(
        <Pagination
          value={1}
          totalPages={3}
          showRowsPerPage
          rowsPerPage={10}
          onValueChange={() => {}}
          classes={{ rowsPerPage: { trigger: "cl-nested-trigger" } }}
        />,
      );
      expect(document.querySelector(".cl-nested-trigger")).not.toBeNull();
    });
  });

  describe("Rendering", () => {
    it("marks its previous and next chevrons to mirror in a right-to-left page", () => {
      render(<Pagination value={2} totalPages={5} onValueChange={() => {}} />);
      expect(screen.getByLabelText("Previous page").querySelector("svg")).toHaveClass("rtl:-scale-x-100");
      expect(screen.getByLabelText("Next page").querySelector("svg")).toHaveClass("rtl:-scale-x-100");
    });

    it("renders as a nav element with aria-label", () => {
      render(
        <Pagination value={1} totalPages={5} onValueChange={() => {}} />
      );

      const nav = screen.getByRole("navigation", { name: "Pagination" });
      expect(nav).toBeInTheDocument();
    });

    it("renders page buttons for all pages when few pages", () => {
      render(
        <Pagination value={1} totalPages={5} onValueChange={() => {}} />
      );

      for (let i = 1; i <= 5; i++) {
        expect(screen.getByRole("button", { name: `Page ${i}` })).toBeInTheDocument();
      }
    });

    it("renders prev and next navigation buttons", () => {
      render(
        <Pagination value={3} totalPages={5} onValueChange={() => {}} />
      );

      expect(screen.getByRole("button", { name: "Previous page" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Next page" })).toBeInTheDocument();
    });

    it("marks the active page with aria-current='page'", () => {
      render(
        <Pagination value={3} totalPages={5} onValueChange={() => {}} />
      );

      expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute("aria-current", "page");
      expect(screen.getByRole("button", { name: "Page 1" })).not.toHaveAttribute("aria-current");
    });

    it("marks the active page with data-active", () => {
      render(
        <Pagination value={3} totalPages={5} onValueChange={() => {}} />
      );

      expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute("data-active");
      expect(screen.getByRole("button", { name: "Page 1" })).not.toHaveAttribute("data-active");
    });

    it("disables prev button on first page", () => {
      render(
        <Pagination value={1} totalPages={5} onValueChange={() => {}} />
      );

      const prev = screen.getByRole("button", { name: "Previous page" });
      expect(prev).toBeDisabled();
      expect(prev).toHaveAttribute("data-disabled");
    });

    it("disables next button on last page", () => {
      render(
        <Pagination value={5} totalPages={5} onValueChange={() => {}} />
      );

      const next = screen.getByRole("button", { name: "Next page" });
      expect(next).toBeDisabled();
      expect(next).toHaveAttribute("data-disabled");
    });

    it("enables both nav buttons on a middle page", () => {
      render(
        <Pagination value={3} totalPages={5} onValueChange={() => {}} />
      );

      const prev = screen.getByRole("button", { name: "Previous page" });
      const next = screen.getByRole("button", { name: "Next page" });
      expect(prev).toBeEnabled();
      expect(prev).not.toHaveAttribute("data-disabled");
      expect(next).toBeEnabled();
      expect(next).not.toHaveAttribute("data-disabled");
    });

    it("renders ellipsis for many pages", () => {
      render(
        <Pagination value={1} totalPages={50} onValueChange={() => {}} />
      );

      const nav = screen.getByRole("navigation");
      expect(nav.textContent).toContain("\u2026");
    });

    it("renders no page buttons when totalPages is 0", () => {
      render(
        <Pagination value={1} totalPages={0} onValueChange={() => {}} />
      );

      expect(screen.queryByRole("button", { name: /^Page / })).not.toBeInTheDocument();
    });

    it("renders correctly with a single page", () => {
      render(
        <Pagination value={1} totalPages={1} onValueChange={() => {}} />
      );

      expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    });

    it("clamps currentPage when it exceeds totalPages", () => {
      render(
        <Pagination value={100} totalPages={5} onValueChange={() => {}} />
      );

      expect(screen.getByRole("button", { name: "Page 5" })).toHaveAttribute("aria-current", "page");
    });

    it("applies custom className", () => {
      render(
        <Pagination
          value={1}
          totalPages={5}
          onValueChange={() => {}}
          className="custom-class"
        />
      );

      expect(screen.getByRole("navigation")).toHaveClass("custom-class");
    });

    it("allows aria-label override via rest props", () => {
      render(
        <Pagination
          value={1}
          totalPages={5}
          onValueChange={() => {}}
          aria-label="Navigation des pages"
        />
      );

      expect(screen.getByRole("navigation", { name: "Navigation des pages" })).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("calls onValueChange when clicking a page button", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <Pagination value={1} totalPages={5} onValueChange={onValueChange} />
      );

      await user.click(screen.getByRole("button", { name: "Page 3" }));
      expect(onValueChange).toHaveBeenCalledWith(3);
    });

    it("calls onValueChange with previous page when clicking prev", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <Pagination value={3} totalPages={5} onValueChange={onValueChange} />
      );

      await user.click(screen.getByRole("button", { name: "Previous page" }));
      expect(onValueChange).toHaveBeenCalledWith(2);
    });

    it("calls onValueChange with next page when clicking next", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <Pagination value={3} totalPages={5} onValueChange={onValueChange} />
      );

      await user.click(screen.getByRole("button", { name: "Next page" }));
      expect(onValueChange).toHaveBeenCalledWith(4);
    });

    it("does not fire onValueChange when clicking disabled prev", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <Pagination value={1} totalPages={5} onValueChange={onValueChange} />
      );

      await user.click(screen.getByRole("button", { name: "Previous page" }));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("does not fire onValueChange when clicking disabled next", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <Pagination value={5} totalPages={5} onValueChange={onValueChange} />
      );

      await user.click(screen.getByRole("button", { name: "Next page" }));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("Rows Per Page Dropdown", () => {
    const renderWithDropdown = (overrides = {}) => {
      const defaults = {
        value: 1,
        totalPages: 10,
        onValueChange: vi.fn(),
        showRowsPerPage: true,
        rowsPerPage: 25,
        onRowsPerPageChange: vi.fn(),
      };

      const props = { ...defaults, ...overrides };
      return { ...render(<Pagination {...props} />), props };
    };

    it("renders selector when showRowsPerPage is true", () => {
      renderWithDropdown();

      expect(screen.getByText("Show")).toBeInTheDocument();
      expect(screen.getByText("rows")).toBeInTheDocument();
    });

    it("does not render selector when showRowsPerPage is false", () => {
      render(
        <Pagination
          value={1}
          totalPages={10}
          onValueChange={() => {}}
          rowsPerPage={25}
        />
      );

      expect(screen.queryByText("Show")).not.toBeInTheDocument();
    });

    it("uses custom rowsPerPagePrefix and rowsPerPageSuffix", () => {
      renderWithDropdown({ rowsPerPagePrefix: "Afficher", rowsPerPageSuffix: "lignes" });

      expect(screen.getByText("Afficher")).toBeInTheDocument();
      expect(screen.getByText("lignes")).toBeInTheDocument();
    });

    it("names the rows-per-page select by its visible prefix and suffix, and its value is its content", () => {
      const { unmount } = renderWithDropdown();
      const byDefault = screen.getByRole("combobox", { expanded: false, name: "Show rows" });
      expect(byDefault).toHaveTextContent("25");
      expect(byDefault).toHaveAttribute("aria-haspopup", "listbox");
      unmount();

      const { unmount: unmountTranslated } = renderWithDropdown({ rowsPerPagePrefix: "Afficher", rowsPerPageSuffix: "lignes" });
      expect(screen.getByRole("combobox", { name: "Afficher lignes" })).toHaveTextContent("25");
      unmountTranslated();

      renderWithDropdown({ rowsPerPagePrefix: "", rowsPerPageSuffix: "" });
      const unlabelled = screen.getByRole("combobox", { name: "Rows per page" });
      expect(unlabelled).not.toHaveAttribute("aria-labelledby");
    });

    it("carries a combobox's popup state: expanded, a listbox popup, and the listbox it controls while open", async () => {
      const user = userEvent.setup();
      renderWithDropdown();
      const trigger = screen.getByRole("combobox", { name: "Show rows" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
      expect(trigger).not.toHaveAttribute("aria-controls");

      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", screen.getByRole("listbox").id);
    });

    it("rotates its chevron while open, like the dropdown chevrons", async () => {
      const user = userEvent.setup();
      renderWithDropdown();
      const trigger = screen.getByRole("combobox", { name: "Show rows" });
      const icon = trigger.querySelector("svg")!;
      expect(icon).not.toHaveClass("rotate-180");
      await user.click(trigger);
      expect(icon).toHaveClass("rotate-180");
    });

    it("rotates a custom dropdownIcon while open too", async () => {
      const user = userEvent.setup();
      renderWithDropdown({ dropdownIcon: <span data-testid="custom-caret">v</span> });
      const trigger = screen.getByRole("combobox", { name: "Show rows" });
      const rotated = () => screen.getByTestId("custom-caret").closest(".rotate-180");
      expect(rotated()).toBeNull();
      await user.click(trigger);
      expect(rotated()).not.toBeNull();
      expect(trigger.contains(rotated())).toBe(true);
    });

    it("uses custom dropdownAriaLabel", async () => {
      const user = userEvent.setup();
      renderWithDropdown({ dropdownAriaLabel: "Zeilen pro Seite" });

      const trigger = screen.getByRole("combobox", { name: "Show rows" });
      await user.click(trigger);

      expect(screen.getByRole("listbox", { name: "Zeilen pro Seite" })).toBeInTheDocument();
    });

    it("opens dropdown on click and shows options", async () => {
      const user = userEvent.setup();
      renderWithDropdown();

      const trigger = screen.getByRole("combobox", { name: "Show rows" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(screen.getAllByRole("option")).toHaveLength(5);
    });

    it("selects an option and calls onRowsPerPageChange", async () => {
      const user = userEvent.setup();
      const { props } = renderWithDropdown();

      await user.click(screen.getByRole("combobox", { name: "Show rows" }));
      await user.click(screen.getByRole("option", { name: "50" }));

      expect(props.onRowsPerPageChange).toHaveBeenCalledWith(50);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("marks selected option with aria-selected and data-selected", async () => {
      const user = userEvent.setup();
      renderWithDropdown();

      await user.click(screen.getByRole("combobox", { name: "Show rows" }));

      const selected = screen.getByRole("option", { name: "25" });
      expect(selected).toHaveAttribute("aria-selected", "true");
      expect(selected).toHaveAttribute("data-selected");

      const other = screen.getByRole("option", { name: "50" });
      expect(other).toHaveAttribute("aria-selected", "false");
      expect(other).not.toHaveAttribute("data-selected");
    });

    it("sets aria-controls on trigger when dropdown is open", async () => {
      const user = userEvent.setup();
      renderWithDropdown();

      const trigger = screen.getByRole("combobox", { name: "Show rows" });
      expect(trigger).not.toHaveAttribute("aria-controls");

      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-controls");
      const listbox = screen.getByRole("listbox");
      expect(trigger.getAttribute("aria-controls")).toBe(listbox.id);
    });

    it("closes dropdown on Escape and returns focus to trigger", async () => {
      const user = userEvent.setup();
      renderWithDropdown();

      const trigger = screen.getByRole("combobox", { name: "Show rows" });
      await user.click(trigger);
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      await user.keyboard("{Escape}");

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      expect(document.activeElement).toBe(trigger);
    });

    it("navigates options with ArrowDown and ArrowUp", async () => {
      const user = userEvent.setup();
      renderWithDropdown();

      const trigger = screen.getByRole("combobox", { name: "Show rows" });
      trigger.focus();

      await user.keyboard("{ArrowDown}");
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      const options = screen.getAllByRole("option");
      expect(options[2]).toHaveAttribute("data-highlighted");

      await user.keyboard("{ArrowDown}");
      expect(options[3]).toHaveAttribute("data-highlighted");

      await user.keyboard("{ArrowUp}");
      expect(options[2]).toHaveAttribute("data-highlighted");
    });

    it("selects option with Enter key", async () => {
      const user = userEvent.setup();
      const { props } = renderWithDropdown();

      const trigger = screen.getByRole("combobox", { name: "Show rows" });
      trigger.focus();

      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(props.onRowsPerPageChange).toHaveBeenCalled();
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("navigates to first option with Home key", async () => {
      const user = userEvent.setup();
      renderWithDropdown();

      const trigger = screen.getByRole("combobox", { name: "Show rows" });
      trigger.focus();

      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Home}");

      const options = screen.getAllByRole("option");
      expect(options[0]).toHaveAttribute("data-highlighted");
    });

    it("navigates to last option with End key", async () => {
      const user = userEvent.setup();
      renderWithDropdown();

      const trigger = screen.getByRole("combobox", { name: "Show rows" });
      trigger.focus();

      await user.keyboard("{ArrowDown}");
      await user.keyboard("{End}");

      const options = screen.getAllByRole("option");
      expect(options[options.length - 1]).toHaveAttribute("data-highlighted");
    });

    it("closes dropdown on outside click", async () => {
      const user = userEvent.setup();
      renderWithDropdown();

      await user.click(screen.getByRole("combobox", { name: "Show rows" }));
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      await user.click(document.body);

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  describe("Unique IDs", () => {
    it("generates unique option IDs across multiple instances", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Pagination
            value={1}
            totalPages={5}
            onValueChange={() => {}}
            showRowsPerPage
            rowsPerPage={25}
          />
          <Pagination
            value={1}
            totalPages={5}
            onValueChange={() => {}}
            showRowsPerPage
            rowsPerPage={50}
          />
        </div>
      );

      const [first, second] = screen.getAllByRole("combobox", { name: "Show rows" });
      await user.click(first);
      await user.click(second);

      const allOptions = screen.getAllByRole("option");
      const ids = allOptions.map((opt) => opt.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("Custom Ellipsis", () => {
    it("renders custom ellipsis via renderEllipsis", () => {
      render(
        <Pagination
          value={25}
          totalPages={50}
          onValueChange={() => {}}
          renderEllipsis={({ position }) => (
            <span data-testid={`ellipsis-${position}`}>jump</span>
          )}
        />
      );

      expect(screen.getByTestId("ellipsis-start")).toBeInTheDocument();
      expect(screen.getByTestId("ellipsis-end")).toBeInTheDocument();
    });

    it("passes onValueChange to renderEllipsis", () => {
      const onValueChange = vi.fn();

      render(
        <Pagination
          value={25}
          totalPages={50}
          onValueChange={onValueChange}
          renderEllipsis={({ onValueChange: go }) => (
            <button type="button" onClick={() => go(10)} data-testid="jump-btn">
              Go
            </button>
          )}
        />
      );

      const buttons = screen.getAllByTestId("jump-btn");
      buttons[0].click();
      expect(onValueChange).toHaveBeenCalledWith(10);
    });

    it("assigns correct position to ellipsis elements", () => {
      render(
        <Pagination
          value={1}
          totalPages={50}
          onValueChange={() => {}}
          renderEllipsis={({ position }) => (
            <span data-testid={`pos-${position}`}>{position}</span>
          )}
        />
      );

      expect(screen.getByTestId("pos-end")).toBeInTheDocument();
      expect(screen.queryByTestId("pos-start")).not.toBeInTheDocument();
    });
  });

  describe("Page Info", () => {
    it("renders page info via renderPageInfo", () => {
      render(
        <Pagination
          value={3}
          totalPages={10}
          onValueChange={() => {}}
          renderPageInfo={({ value, totalPages }) => (
            <span data-testid="page-info">Page {value} of {totalPages}</span>
          )}
        />
      );

      expect(screen.getByTestId("page-info")).toHaveTextContent("Page 3 of 10");
    });

    it("passes rowsPerPage to renderPageInfo", () => {
      render(
        <Pagination
          value={1}
          totalPages={10}
          rowsPerPage={25}
          onValueChange={() => {}}
          renderPageInfo={({ rowsPerPage }) => (
            <span data-testid="info">{rowsPerPage} per page</span>
          )}
        />
      );

      expect(screen.getByTestId("info")).toHaveTextContent("25 per page");
    });

    it("does not render page info when renderPageInfo is not provided", () => {
      const { container } = render(
        <Pagination value={1} totalPages={5} onValueChange={() => {}} />
      );

      expect(container.querySelector("[class*=pageInfo]")).not.toBeInTheDocument();
    });
  });

  describe("Section Order", () => {
    it("renders sections in default order", () => {
      const { container } = render(
        <Pagination
          value={1}
          totalPages={10}
          onValueChange={() => {}}
          showRowsPerPage
          rowsPerPage={25}
          renderPageInfo={() => <span data-testid="info">info</span>}
        />
      );

      const nav = container.querySelector("nav")!;
      const children = Array.from(nav.children);
      const selectorIdx = children.findIndex((el) => el.textContent?.includes("Show"));
      const infoIdx = children.findIndex((el) => el.querySelector("[data-testid='info']"));
      const navIdx = children.findIndex((el) => el.querySelector("[aria-label='Previous page']"));

      expect(selectorIdx).toBeLessThan(infoIdx);
      expect(infoIdx).toBeLessThan(navIdx);
    });

    it("renders sections in custom order", () => {
      const { container } = render(
        <Pagination
          value={1}
          totalPages={10}
          onValueChange={() => {}}
          showRowsPerPage
          rowsPerPage={25}
          renderPageInfo={() => <span data-testid="info">info</span>}
          sectionOrder={["nav", "pageInfo", "selector"]}
        />
      );

      const nav = container.querySelector("nav")!;
      const children = Array.from(nav.children);
      const navIdx = children.findIndex((el) => el.querySelector("[aria-label='Previous page']"));
      const infoIdx = children.findIndex((el) => el.querySelector("[data-testid='info']"));
      const selectorIdx = children.findIndex((el) => el.textContent?.includes("Show"));

      expect(navIdx).toBeLessThan(infoIdx);
      expect(infoIdx).toBeLessThan(selectorIdx);
    });

    it("omits sections not in sectionOrder", () => {
      render(
        <Pagination
          value={1}
          totalPages={10}
          onValueChange={() => {}}
          showRowsPerPage
          rowsPerPage={25}
          sectionOrder={["nav"]}
        />
      );

      expect(screen.queryByText("Show")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Previous page" })).toBeInTheDocument();
    });
  });

  describe("Custom Icons", () => {
    it("renders a custom dropdownIcon as given, in place of the default chevron", () => {
      render(
        <Pagination
          value={1}
          totalPages={5}
          onValueChange={() => {}}
          showRowsPerPage
          rowsPerPage={10}
          onRowsPerPageChange={() => {}}
          dropdownIcon={<span aria-hidden="true" data-testid="custom-caret">v</span>}
        />
      );

      const trigger = screen.getByRole("combobox", { name: "Show rows" });
      const caret = screen.getByTestId("custom-caret");
      // Inside the icon slot's span, which carries the rotation, as Dropdown
      // wraps its chevronIcon.
      expect(caret.parentElement?.parentElement).toBe(trigger);
      expect(trigger.querySelector("svg")).toBeNull();
    });

    it("renders custom icons as ReactNode", () => {
      render(
        <Pagination
          value={3}
          totalPages={5}
          onValueChange={() => {}}
          prevIcon={<span data-testid="node-prev">←</span>}
          nextIcon={<span data-testid="node-next">→</span>}
        />
      );

      expect(screen.getByTestId("node-prev")).toBeInTheDocument();
      expect(screen.getByTestId("node-next")).toBeInTheDocument();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to the nav element", () => {
      const ref = vi.fn();

      render(
        <Pagination ref={ref} value={1} totalPages={5} onValueChange={() => {}} />
      );

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0].tagName).toBe("NAV");
    });
  });

  describe("Props Spreading", () => {
    it("spreads additional HTML attributes onto nav", () => {
      render(
        <Pagination
          value={1}
          totalPages={5}
          onValueChange={() => {}}
          data-testid="my-pagination"
          id="pg-1"
        />
      );

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("data-testid", "my-pagination");
      expect(nav).toHaveAttribute("id", "pg-1");
    });
  });

  describe("Edge Cases", () => {
    it("handles negative totalPages gracefully", () => {
      render(
        <Pagination value={1} totalPages={-5} onValueChange={() => {}} />
      );

      expect(screen.queryByRole("button", { name: /^Page / })).not.toBeInTheDocument();
    });

    it("handles fractional totalPages by flooring", () => {
      render(
        <Pagination value={1} totalPages={3.7} onValueChange={() => {}} />
      );

      expect(screen.getByRole("button", { name: "Page 3" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Page 4" })).not.toBeInTheDocument();
    });

    it("handles currentPage less than 1", () => {
      render(
        <Pagination value={-1} totalPages={5} onValueChange={() => {}} />
      );

      expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
    });
  });
});

/**
 * The step-down, with layout supplied: jsdom measures every box as zero, so the
 * list's content width is computed from what it renders (a page button 36 px,
 * 28 px at compact padding; an ellipsis 30 px, 22 px compact; the gap from the
 * list's own style) and the widths the list and the host offer are set per
 * test. For the middle fixture (page 5 of 20) that makes the full set 288 px,
 * siblings at 0 200 px, compact spacing 168 px and compact padding 144 px. A
 * ResizeObserver stand-in hands each test the callback the component
 * registers.
 */
describe("Pagination fits one row by showing fewer pages", () => {
  let listWidth = 1000;
  let hostWidth = 1000;
  let resize: (() => void) | undefined;
  const pages = () => screen.getAllByRole("button", { name: /^Page / }).map((b) => b.textContent);
  const list = () => screen.getByRole("button", { name: "Page 1" }).parentElement!;
  const page1 = () => screen.getByRole("button", { name: "Page 1" });

  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(cb: () => void) {
          resize = cb;
        }
        observe() {}
        disconnect() {}
      },
    );
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (this: HTMLElement) {
      if (!this.querySelector(":scope > button")) return 0;
      const gap = parseFloat(this.style.columnGap) || 8;
      const items = Array.from(this.children) as HTMLElement[];
      const widths = items.map((el) =>
        el.tagName === "BUTTON" ? (el.style.paddingInline ? 28 : 36) : el.style.paddingInline ? 22 : 30,
      );
      return widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
    });
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
      if (this.querySelector(":scope > nav")) return hostWidth;
      return this.querySelector(":scope > button") ? listWidth : 0;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    listWidth = 1000;
    hostWidth = 1000;
    resize = undefined;
  });

  const renderMiddle = () => render(<Pagination defaultValue={5} totalPages={20} />);

  it("shows siblingCount pages either side when they fit", () => {
    renderMiddle();
    expect(pages()).toEqual(["1", "4", "5", "6", "20"]);
    expect(list().style.columnGap).toBe("");
  });

  it("steps siblings down to 0 when the full set overflows", () => {
    listWidth = 250;
    renderMiddle();
    expect(pages()).toEqual(["1", "5", "20"]);
    expect(list().style.columnGap).toBe("");
  });

  it("takes one step per measurement under StrictMode, which runs mount effects twice", () => {
    listWidth = 250;
    render(
      <StrictMode>
        <Pagination defaultValue={5} totalPages={20} />
      </StrictMode>,
    );
    expect(pages()).toEqual(["1", "5", "20"]);
    expect(list().style.columnGap).toBe("");
  });

  it("tightens the spacing once siblings are at 0 and the set still overflows", () => {
    listWidth = 180;
    renderMiddle();
    expect(pages()).toEqual(["1", "5", "20"]);
    expect(list().style.columnGap).toBe("4px");
    expect(page1().style.paddingInline).toBe("");
  });

  it("tightens the page buttons' padding after the spacing, keeping a 24 px minimum", () => {
    listWidth = 150;
    renderMiddle();
    expect(list().style.columnGap).toBe("4px");
    expect(page1().style.paddingInline).toBe("8px");
    expect(page1().style.minWidth).toBe("24px");
    expect(list().style.overflowX).toBe("");
  });

  it("lets the list scroll when even compact padding overflows", () => {
    listWidth = 120;
    renderMiddle();
    expect(pages()).toEqual(["1", "5", "20"]);
    expect(page1().style.paddingInline).toBe("8px");
    expect(list().style.overflowX).toBe("auto");
  });

  it("returns to the full set when its host grows", () => {
    listWidth = 120;
    hostWidth = 260;
    renderMiddle();
    expect(list().style.overflowX).toBe("auto");
    listWidth = 1000;
    hostWidth = 1000;
    act(() => resize!());
    expect(pages()).toEqual(["1", "4", "5", "6", "20"]);
    expect(list().style.columnGap).toBe("");
    expect(page1().style.paddingInline).toBe("");
  });
});
