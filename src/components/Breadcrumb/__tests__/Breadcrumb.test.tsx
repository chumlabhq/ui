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

    it("renders icon on the left by default", () => {
      const itemsWithIcon: BreadcrumbItem[] = [
        { id: "home", label: "Home", icon: <span data-testid="icon">I</span> },
        { id: "current", label: "Current" },
      ];

      render(<Breadcrumb items={itemsWithIcon} />);

      const icon = screen.getByTestId("icon");
      const label = screen.getByText("Home");
      // Icon should come before the label in the DOM
      const parent = icon.closest("button") ?? icon.parentElement!;
      const children = Array.from(parent.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex((c) => c.contains(label));
      expect(iconIndex).toBeLessThan(labelIndex);
    });

    it("renders icon on the right when iconPosition is right", () => {
      const itemsWithIcon: BreadcrumbItem[] = [
        { id: "home", label: "Home", icon: <span data-testid="icon">I</span>, iconPosition: "right" },
        { id: "current", label: "Current" },
      ];

      render(<Breadcrumb items={itemsWithIcon} />);

      const icon = screen.getByTestId("icon");
      const label = screen.getByText("Home");
      const parent = icon.closest("button") ?? icon.parentElement!;
      const children = Array.from(parent.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex((c) => c.contains(label));
      expect(iconIndex).toBeGreaterThan(labelIndex);
    });

    it("icon wrapper has aria-hidden", () => {
      const itemsWithIcon: BreadcrumbItem[] = [
        { id: "home", label: "Home", icon: <span data-testid="icon">I</span> },
        { id: "current", label: "Current" },
      ];

      render(<Breadcrumb items={itemsWithIcon} />);

      const iconWrapper = screen.getByTestId("icon").closest("[aria-hidden]");
      expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Truncation Advanced", () => {
    const manyItems: BreadcrumbItem[] = [
      { id: "1", label: "Root" },
      { id: "2", label: "Level1" },
      { id: "3", label: "Level2" },
      { id: "4", label: "Level3" },
      { id: "5", label: "Level4" },
      { id: "6", label: "Current" },
    ];

    it("shows first item and last N-1 items based on maxVisibleItems", () => {
      render(<Breadcrumb items={manyItems} maxVisibleItems={3} />);

      // First item always visible
      expect(screen.getByText("Root")).toBeInTheDocument();
      // Last 2 items visible (maxVisibleItems=3 means first + last 2)
      expect(screen.getByText("Level4")).toBeInTheDocument();
      expect(screen.getByText("Current")).toBeInTheDocument();
      // Middle items should NOT be visible
      expect(screen.queryByText("Level1")).not.toBeInTheDocument();
      expect(screen.queryByText("Level2")).not.toBeInTheDocument();
      expect(screen.queryByText("Level3")).not.toBeInTheDocument();
    });

    it("shows collapsed items in dropdown when ellipsis is clicked", async () => {
      const user = userEvent.setup();
      render(<Breadcrumb items={manyItems} maxVisibleItems={3} />);

      const ellipsisButton = screen.getByRole("button", { name: /collapsed breadcrumb/i });
      await user.click(ellipsisButton);

      // Dropdown renders via portal; query collapsed items directly
      const menu = document.querySelector("[role='menu']");
      expect(menu).toBeInTheDocument();
      expect(screen.getByText("Level1")).toBeInTheDocument();
      expect(screen.getByText("Level2")).toBeInTheDocument();
      expect(screen.getByText("Level3")).toBeInTheDocument();
    });

    it("closes dropdown when clicking an item in it", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();
      render(<Breadcrumb items={manyItems} maxVisibleItems={3} onItemClick={onItemClick} />);

      const ellipsisButton = screen.getByRole("button", { name: /collapsed breadcrumb/i });
      await user.click(ellipsisButton);

      const menuItems = document.querySelectorAll("[role='menuitem']");
      const level1Item = Array.from(menuItems).find(el => el.textContent?.includes("Level1"));
      expect(level1Item).toBeTruthy();
      await user.click(level1Item!);

      expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ id: "2", label: "Level1" }));
      // Dropdown should close
      expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
    });

    it("enforces minimum maxVisibleItems of 2", () => {
      render(<Breadcrumb items={manyItems} maxVisibleItems={1} />);

      // Even with maxVisibleItems=1, it should show at least 2 (first + last)
      expect(screen.getByText("Root")).toBeInTheDocument();
      expect(screen.getByText("Current")).toBeInTheDocument();
      // Ellipsis should be present since there are collapsed items
      expect(screen.getByRole("button", { name: /collapsed breadcrumb/i })).toBeInTheDocument();
    });

    it("calls onDropdownOpenChange when dropdown opens and closes", async () => {
      const user = userEvent.setup();
      const onDropdownOpenChange = vi.fn();
      render(
        <Breadcrumb
          items={manyItems}
          maxVisibleItems={3}
          onDropdownOpenChange={onDropdownOpenChange}
        />,
      );

      const ellipsisButton = screen.getByRole("button", { name: /collapsed breadcrumb/i });

      await user.click(ellipsisButton);
      expect(onDropdownOpenChange).toHaveBeenCalledWith(true);

      await user.click(ellipsisButton);
      expect(onDropdownOpenChange).toHaveBeenCalledWith(false);
    });

    it("sets data-dropdown-open on nav when dropdown is open", async () => {
      const user = userEvent.setup();
      render(<Breadcrumb items={manyItems} maxVisibleItems={3} />);

      const nav = screen.getByRole("navigation");
      expect(nav).not.toHaveAttribute("data-dropdown-open");

      const ellipsisButton = screen.getByRole("button", { name: /collapsed breadcrumb/i });
      await user.click(ellipsisButton);

      expect(nav).toHaveAttribute("data-dropdown-open", "true");
    });
  });

  describe("Custom Separator", () => {
    it("renders custom separator component", () => {
      const CustomSeparator = ({ style }: { style?: React.CSSProperties }) => (
        <span data-testid="custom-sep-icon" style={style}>&gt;</span>
      );

      render(<Breadcrumb items={items} separatorIcon={CustomSeparator} />);

      const seps = screen.getAllByTestId("custom-sep-icon");
      expect(seps.length).toBe(2);
    });

    it("uses default ChevronRightIcon when no separator provided", () => {
      const { container } = render(<Breadcrumb items={items} />);

      const svgs = container.querySelectorAll('li[role="presentation"] svg');
      expect(svgs.length).toBe(2);
    });
  });

  describe("Disabled Items Advanced", () => {
    it("does not call onItemClick for disabled items", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();
      const itemsWithDisabled: BreadcrumbItem[] = [
        { id: "home", label: "Home" },
        { id: "disabled", label: "Disabled", disabled: true },
        { id: "current", label: "Current" },
      ];

      render(<Breadcrumb items={itemsWithDisabled} onItemClick={onItemClick} />);

      const disabledBtn = screen.getByText("Disabled").closest("button")!;
      await user.click(disabledBtn);

      expect(onItemClick).not.toHaveBeenCalled();
    });

    it("disabled items in dropdown have data-disabled and aria-disabled", async () => {
      const user = userEvent.setup();
      const manyItemsWithDisabled: BreadcrumbItem[] = [
        { id: "1", label: "Root" },
        { id: "2", label: "DisabledMiddle", disabled: true },
        { id: "3", label: "Middle2" },
        { id: "4", label: "Middle3" },
        { id: "5", label: "Current" },
      ];

      render(<Breadcrumb items={manyItemsWithDisabled} maxVisibleItems={3} />);

      const ellipsisButton = screen.getByRole("button", { name: /collapsed breadcrumb/i });
      await user.click(ellipsisButton);

      const menuItems = document.querySelectorAll("[role='menuitem']");
      const disabledMenuItem = Array.from(menuItems).find(el => el.textContent?.includes("DisabledMiddle"));
      expect(disabledMenuItem).toBeTruthy();
      expect(disabledMenuItem!).toHaveAttribute("aria-disabled", "true");
      expect(disabledMenuItem!).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("Tooltip on Items", () => {
    it("does not render tooltip when showTooltips is false", () => {
      const itemsWithTooltip: BreadcrumbItem[] = [
        { id: "home", label: "Home", tooltip: "Go to homepage" },
        { id: "current", label: "Current" },
      ];

      const { container } = render(
        <Breadcrumb items={itemsWithTooltip} showTooltips={false} />,
      );

      // Tooltip wrapper should not be present
      expect(container.querySelector("[data-tooltip]")).not.toBeInTheDocument();
    });
  });

  describe("Active (Last) Item Styling", () => {
    it("last item has data-state=active", () => {
      render(<Breadcrumb items={items} />);

      const lastItem = screen.getByText("Shoes").closest("[data-state]");
      expect(lastItem).toHaveAttribute("data-state", "active");
    });

    it("non-last items have data-state=inactive", () => {
      render(<Breadcrumb items={items} />);

      const firstItem = screen.getByText("Home").closest("[data-state]");
      expect(firstItem).toHaveAttribute("data-state", "inactive");
    });

    it("last item renders as span (not button or link)", () => {
      render(<Breadcrumb items={items} />);

      const lastItem = screen.getByText("Shoes").closest("span");
      expect(lastItem).toBeInTheDocument();
      expect(lastItem!.tagName).toBe("SPAN");
    });

    it("last item with href still gets aria-current=page", () => {
      const itemsWithHref: BreadcrumbItem[] = [
        { id: "home", label: "Home", href: "/" },
        { id: "current", label: "Current", href: "/current" },
      ];

      render(<Breadcrumb items={itemsWithHref} />);

      const lastItem = screen.getByText("Current").closest("[aria-current]");
      expect(lastItem).toHaveAttribute("aria-current", "page");
    });
  });

  describe("Dropdown Keyboard Navigation", () => {
    const manyItems: BreadcrumbItem[] = [
      { id: "1", label: "Root" },
      { id: "2", label: "Level1" },
      { id: "3", label: "Level2" },
      { id: "4", label: "Level3" },
      { id: "5", label: "Current" },
    ];

    it("closes dropdown on Escape and returns focus to ellipsis", async () => {
      const user = userEvent.setup();
      render(<Breadcrumb items={manyItems} maxVisibleItems={3} />);

      const ellipsisButton = screen.getByRole("button", { name: /collapsed breadcrumb/i });
      await user.click(ellipsisButton);

      expect(document.querySelector("[role='menu']")).toBeInTheDocument();

      await user.keyboard("{Escape}");

      expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
      expect(document.activeElement).toBe(ellipsisButton);
    });

    it("opens dropdown on ArrowDown when focused on ellipsis", async () => {
      const user = userEvent.setup();
      render(<Breadcrumb items={manyItems} maxVisibleItems={3} />);

      const ellipsisButton = screen.getByRole("button", { name: /collapsed breadcrumb/i });
      ellipsisButton.focus();

      await user.keyboard("{ArrowDown}");

      expect(document.querySelector("[role='menu']")).toBeInTheDocument();
    });

    it("ellipsis button has aria-expanded and aria-haspopup", async () => {
      const user = userEvent.setup();
      render(<Breadcrumb items={manyItems} maxVisibleItems={3} />);

      const ellipsisButton = screen.getByRole("button", { name: /collapsed breadcrumb/i });
      expect(ellipsisButton).toHaveAttribute("aria-haspopup", "menu");
      expect(ellipsisButton).toHaveAttribute("aria-expanded", "false");

      await user.click(ellipsisButton);

      expect(ellipsisButton).toHaveAttribute("aria-expanded", "true");
      expect(ellipsisButton).toHaveAttribute("aria-controls");
    });
  });

  describe("Custom Ellipsis", () => {
    it("renders custom ellipsis icon", () => {
      const CustomEllipsis = () => <span data-testid="custom-ellipsis">...</span>;
      const manyItems: BreadcrumbItem[] = [
        { id: "1", label: "Root" },
        { id: "2", label: "Level1" },
        { id: "3", label: "Level2" },
        { id: "4", label: "Level3" },
        { id: "5", label: "Current" },
      ];

      render(<Breadcrumb items={manyItems} maxVisibleItems={3} ellipsisIcon={CustomEllipsis} />);

      expect(screen.getByTestId("custom-ellipsis")).toBeInTheDocument();
    });

    it("uses custom ellipsisAriaLabel", () => {
      const manyItems: BreadcrumbItem[] = [
        { id: "1", label: "Root" },
        { id: "2", label: "Level1" },
        { id: "3", label: "Level2" },
        { id: "4", label: "Current" },
      ];

      render(
        <Breadcrumb
          items={manyItems}
          maxVisibleItems={3}
          ellipsisAriaLabel="Show more items"
        />,
      );

      expect(screen.getByRole("button", { name: "Show more items" })).toBeInTheDocument();
    });
  });

  describe("Content Prop", () => {
    it("renders custom content instead of label", () => {
      const itemsWithContent: BreadcrumbItem[] = [
        { id: "home", label: "Home", content: <span data-testid="custom-content">Custom Home</span> },
        { id: "current", label: "Current" },
      ];

      render(<Breadcrumb items={itemsWithContent} />);

      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
      expect(screen.getByText("Custom Home")).toBeInTheDocument();
    });
  });

  describe("Unstyled Mode", () => {
    it("applies empty classes when unstyled", () => {
      render(<Breadcrumb items={items} unstyled />);

      const nav = screen.getByRole("navigation");
      const list = within(nav).getByRole("list");
      // Unstyled classes are all empty strings
      expect(list.className).toBeFalsy();
    });
  });

  describe("Icon Size as String", () => {
    it("passes className when iconSize is a string", () => {
      render(<Breadcrumb items={items} iconSize="w-5 h-5" />);

      // When iconSize is a string, separator icons get className instead of style
      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
      // SVG separators should be rendered with className from iconSize string
      const svgs = document.querySelectorAll('li[role="presentation"] svg');
      expect(svgs.length).toBe(2);
      svgs.forEach((svg) => {
        expect(svg).toHaveClass("w-5");
        expect(svg).toHaveClass("h-5");
      });
    });
  });

  describe("Link Items with onClick handlers", () => {
    it("calls onItemClick and prevents default navigation for href items", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();
      const itemsWithHref: BreadcrumbItem[] = [
        { id: "home", label: "Home", href: "/home" },
        { id: "about", label: "About", href: "/about" },
        { id: "current", label: "Current" },
      ];

      render(<Breadcrumb items={itemsWithHref} onItemClick={onItemClick} />);

      const homeLink = screen.getByText("Home").closest("a")!;
      await user.click(homeLink);

      expect(onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: "home", label: "Home" }),
      );
    });

    it("calls item.onClick for href items with onClick handler", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const itemsWithHref: BreadcrumbItem[] = [
        { id: "home", label: "Home", href: "/home", onClick },
        { id: "current", label: "Current" },
      ];

      render(<Breadcrumb items={itemsWithHref} />);

      const homeLink = screen.getByText("Home").closest("a")!;
      await user.click(homeLink);

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe("Dropdown Menu Keyboard Navigation (Enter/Space on menu items)", () => {
    const manyItems: BreadcrumbItem[] = [
      { id: "1", label: "Root" },
      { id: "2", label: "Level1" },
      { id: "3", label: "Level2" },
      { id: "4", label: "Level3" },
      { id: "5", label: "Current" },
    ];

    it("selects item and closes dropdown when Enter pressed on menu item", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();

      render(
        <Breadcrumb
          items={manyItems}
          maxVisibleItems={3}
          onItemClick={onItemClick}
        />,
      );

      const ellipsisButton = screen.getByRole("button", {
        name: /collapsed breadcrumb/i,
      });
      await user.click(ellipsisButton);

      // Menu should be open; navigate with ArrowDown then press Enter
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(onItemClick).toHaveBeenCalled();
      expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
    });

    it("selects item when Space pressed on menu item", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();

      render(
        <Breadcrumb
          items={manyItems}
          maxVisibleItems={3}
          onItemClick={onItemClick}
        />,
      );

      const ellipsisButton = screen.getByRole("button", {
        name: /collapsed breadcrumb/i,
      });
      await user.click(ellipsisButton);

      await user.keyboard("{ArrowDown}");
      await user.keyboard(" ");

      expect(onItemClick).toHaveBeenCalled();
    });
  });
});
