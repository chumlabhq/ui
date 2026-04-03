import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Breadcrumb } from "../index";
import type { BreadcrumbItem } from "../utils/types";

const items: BreadcrumbItem[] = [
  { id: "home", label: "Home" },
  { id: "products", label: "Products" },
  { id: "shoes", label: "Shoes" },
];

describe("Breadcrumb", () => {
  describe("Rendering", () => {
    it("renders all items", () => {
      render(<Breadcrumb items={items} />);

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Shoes")).toBeInTheDocument();
    });

    it("renders as a nav element", () => {
      render(<Breadcrumb items={items} />);

      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("renders an ordered list", () => {
      render(<Breadcrumb items={items} />);

      const nav = screen.getByRole("navigation");
      const list = within(nav).getByRole("list");
      expect(list.tagName).toBe("OL");
    });

    it("renders items as list items", () => {
      render(<Breadcrumb items={items} />);

      // Separators have role="presentation", so only item <li>s are listitem
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBe(3);
    });
  });

  describe("Aria attributes", () => {
    it("renders nav with default aria-label", () => {
      render(<Breadcrumb items={items} />);

      expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "Breadcrumb");
    });

    it("applies custom aria-label", () => {
      render(<Breadcrumb items={items} aria-label="Site navigation" />);

      expect(screen.getByRole("navigation", { name: "Site navigation" })).toBeInTheDocument();
    });

    it("marks the last item with aria-current=page", () => {
      render(<Breadcrumb items={items} />);

      // Last item renders as a <span> with aria-current="page"
      const lastItemSpan = screen.getByText("Shoes").closest("[aria-current]") ?? screen.getByText("Shoes");
      expect(lastItemSpan).toHaveAttribute("aria-current", "page");
    });

    it("does not mark non-last items with aria-current", () => {
      render(<Breadcrumb items={items} />);

      const firstItem = screen.getByText("Home");
      expect(firstItem).not.toHaveAttribute("aria-current");
    });
  });

  describe("Separator", () => {
    it("renders separators between items", () => {
      const { container } = render(<Breadcrumb items={items} />);

      // Separators have role="presentation" and aria-hidden="true"
      const separators = container.querySelectorAll('li[role="presentation"]');
      // 2 separators for 3 items
      expect(separators.length).toBe(2);
    });

    it("separators have aria-hidden", () => {
      const { container } = render(<Breadcrumb items={items} />);

      const separators = container.querySelectorAll('li[role="presentation"]');
      separators.forEach((sep) => {
        expect(sep).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("renders custom separator content", () => {
      render(
        <Breadcrumb items={items} separator={<span data-testid="custom-sep">/</span>} />
      );

      const separators = screen.getAllByTestId("custom-sep");
      expect(separators.length).toBe(2);
      expect(separators[0]).toHaveTextContent("/");
    });
  });

  describe("Truncation with ellipsis", () => {
    const manyItems: BreadcrumbItem[] = [
      { id: "1", label: "Home" },
      { id: "2", label: "Category" },
      { id: "3", label: "Subcategory" },
      { id: "4", label: "Products" },
      { id: "5", label: "Details" },
    ];

    it("truncates items when exceeding maxVisibleItems", () => {
      render(<Breadcrumb items={manyItems} maxVisibleItems={3} />);

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("data-truncated", "true");
    });

    it("shows ellipsis button when truncated", () => {
      render(<Breadcrumb items={manyItems} maxVisibleItems={3} />);

      const ellipsisButton = screen.getByRole("button", { name: /collapsed breadcrumb/i });
      expect(ellipsisButton).toBeInTheDocument();
      expect(ellipsisButton).toHaveAttribute("aria-haspopup", "menu");
    });

    it("always shows first and last items when truncated", () => {
      render(<Breadcrumb items={manyItems} maxVisibleItems={3} />);

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Details")).toBeInTheDocument();
    });

    it("does not truncate when items fit within maxVisibleItems", () => {
      render(<Breadcrumb items={items} maxVisibleItems={5} />);

      const nav = screen.getByRole("navigation");
      expect(nav).not.toHaveAttribute("data-truncated");
    });

    it("opens dropdown when ellipsis is clicked", async () => {
      const user = userEvent.setup();
      render(<Breadcrumb items={manyItems} maxVisibleItems={3} />);

      const ellipsisButton = screen.getByRole("button", { name: /collapsed breadcrumb/i });
      await user.click(ellipsisButton);

      expect(ellipsisButton).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Click handling", () => {
    it("calls onItemClick when a non-last item is clicked", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();

      render(<Breadcrumb items={items} onItemClick={onItemClick} />);

      const homeButton = screen.getByText("Home");
      await user.click(homeButton);

      expect(onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: "home", label: "Home" })
      );
    });

    it("calls item.onClick handler", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const itemsWithClick: BreadcrumbItem[] = [
        { id: "home", label: "Home", onClick },
        { id: "current", label: "Current" },
      ];

      render(<Breadcrumb items={itemsWithClick} />);

      await user.click(screen.getByText("Home"));

      expect(onClick).toHaveBeenCalled();
    });

    it("renders items with href as links", () => {
      const itemsWithHref: BreadcrumbItem[] = [
        { id: "home", label: "Home", href: "/" },
        { id: "about", label: "About", href: "/about" },
        { id: "current", label: "Current" },
      ];

      render(<Breadcrumb items={itemsWithHref} />);

      const homeLink = screen.getByText("Home").closest("a") ?? screen.getByText("Home");
      expect(homeLink.tagName).toBe("A");
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });

  describe("Disabled items", () => {
    it("renders disabled items with aria-disabled", () => {
      const itemsWithDisabled: BreadcrumbItem[] = [
        { id: "home", label: "Home" },
        { id: "disabled", label: "Disabled", disabled: true },
        { id: "current", label: "Current" },
      ];

      render(<Breadcrumb items={itemsWithDisabled} />);

      // The disabled button wraps the content; find the button ancestor
      const disabledEl = screen.getByText("Disabled").closest("button") ?? screen.getByText("Disabled");
      expect(disabledEl).toHaveAttribute("aria-disabled", "true");
    });

    it("disabled items have data-disabled attribute", () => {
      const itemsWithDisabled: BreadcrumbItem[] = [
        { id: "home", label: "Home" },
        { id: "disabled", label: "Disabled", disabled: true },
        { id: "current", label: "Current" },
      ];

      render(<Breadcrumb items={itemsWithDisabled} />);

      const disabledEl = screen.getByText("Disabled").closest("button") ?? screen.getByText("Disabled");
      expect(disabledEl).toHaveAttribute("data-disabled", "true");
    });

    it("disabled items with href do not render as links", () => {
      const itemsWithDisabled: BreadcrumbItem[] = [
        { id: "home", label: "Home", href: "/", disabled: true },
        { id: "current", label: "Current" },
      ];

      render(<Breadcrumb items={itemsWithDisabled} />);

      const homeEl = screen.getByText("Home").closest("a");
      expect(homeEl).toBeNull();
    });
  });

  describe("Custom classes", () => {
    it("applies custom className to nav", () => {
      render(<Breadcrumb items={items} className="my-breadcrumb" />);

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("my-breadcrumb");
    });

    it("applies custom inline styles", () => {
      render(<Breadcrumb items={items} style={{ marginTop: "10px" }} />);

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveStyle({ marginTop: "10px" });
    });

    it("applies classes prop for sub-elements", () => {
      render(
        <Breadcrumb
          items={items}
          classes={{ root: "custom-root", list: "custom-list" }}
        />
      );

      const nav = screen.getByRole("navigation");
      expect(nav.className).toContain("custom-root");

      const list = within(nav).getByRole("list");
      expect(list.className).toContain("custom-list");
    });
  });

  describe("Icons", () => {
    it("renders item with icon", () => {
      const itemsWithIcon: BreadcrumbItem[] = [
        { id: "home", label: "Home", icon: <span data-testid="home-icon">H</span> },
        { id: "current", label: "Current" },
      ];

      render(<Breadcrumb items={itemsWithIcon} />);

      expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    });
  });
});
