import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../index";

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
  describe("Rendering", () => {
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

    it("uses custom showLabel and rowsPerPageLabel", () => {
      renderWithDropdown({ showLabel: "Afficher", rowsPerPageLabel: "lignes" });

      expect(screen.getByText("Afficher")).toBeInTheDocument();
      expect(screen.getByText("lignes")).toBeInTheDocument();
    });

    it("uses custom dropdownAriaLabel", async () => {
      const user = userEvent.setup();
      renderWithDropdown({ dropdownAriaLabel: "Zeilen pro Seite" });

      const trigger = screen.getByRole("button", { name: "25" });
      await user.click(trigger);

      expect(screen.getByRole("listbox", { name: "Zeilen pro Seite" })).toBeInTheDocument();
    });

    it("opens dropdown on click and shows options", async () => {
      const user = userEvent.setup();
      renderWithDropdown();

      const trigger = screen.getByRole("button", { name: "25" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(screen.getAllByRole("option")).toHaveLength(5);
    });

    it("selects an option and calls onRowsPerPageChange", async () => {
      const user = userEvent.setup();
      const { props } = renderWithDropdown();

      await user.click(screen.getByRole("button", { name: "25" }));
      await user.click(screen.getByRole("option", { name: "50" }));

      expect(props.onRowsPerPageChange).toHaveBeenCalledWith(50);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("marks selected option with aria-selected and data-selected", async () => {
      const user = userEvent.setup();
      renderWithDropdown();

      await user.click(screen.getByRole("button", { name: "25" }));

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

      const trigger = screen.getByRole("button", { name: "25" });
      expect(trigger).not.toHaveAttribute("aria-controls");

      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-controls");
      const listbox = screen.getByRole("listbox");
      expect(trigger.getAttribute("aria-controls")).toBe(listbox.id);
    });

    it("closes dropdown on Escape and returns focus to trigger", async () => {
      const user = userEvent.setup();
      renderWithDropdown();

      const trigger = screen.getByRole("button", { name: "25" });
      await user.click(trigger);
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      await user.keyboard("{Escape}");

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      expect(document.activeElement).toBe(trigger);
    });

    it("navigates options with ArrowDown and ArrowUp", async () => {
      const user = userEvent.setup();
      renderWithDropdown();

      const trigger = screen.getByRole("button", { name: "25" });
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

      const trigger = screen.getByRole("button", { name: "25" });
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

      const trigger = screen.getByRole("button", { name: "25" });
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

      const trigger = screen.getByRole("button", { name: "25" });
      trigger.focus();

      await user.keyboard("{ArrowDown}");
      await user.keyboard("{End}");

      const options = screen.getAllByRole("option");
      expect(options[options.length - 1]).toHaveAttribute("data-highlighted");
    });

    it("closes dropdown on outside click", async () => {
      const user = userEvent.setup();
      renderWithDropdown();

      await user.click(screen.getByRole("button", { name: "25" }));
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

      await user.click(screen.getByRole("button", { name: "25" }));
      await user.click(screen.getByRole("button", { name: "50" }));

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
          renderEllipsis={({ onPageChange: go }) => (
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
          renderPageInfo={({ currentPage, totalPages }) => (
            <span data-testid="page-info">Page {currentPage} of {totalPages}</span>
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
    it("renders custom prev and next icons as components", () => {
      const CustomPrev = ({ className }: { className?: string }) => (
        <span data-testid="custom-prev" className={className}>←</span>
      );
      const CustomNext = ({ className }: { className?: string }) => (
        <span data-testid="custom-next" className={className}>→</span>
      );

      render(
        <Pagination
          value={3}
          totalPages={5}
          onValueChange={() => {}}
          prevIcon={CustomPrev}
          nextIcon={CustomNext}
        />
      );

      expect(screen.getByTestId("custom-prev")).toBeInTheDocument();
      expect(screen.getByTestId("custom-next")).toBeInTheDocument();
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
