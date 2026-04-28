import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TabPanel } from "../index";
import type { Tab } from "../index";
import { useTabPanelContext } from "../utils/context";

const tabs: Tab[] = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

const tabsWithDisabled: Tab[] = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile", disabled: true },
  { id: "settings", label: "Settings" },
];

const tabsWithIcons: Tab[] = [
  { id: "home", label: "Home", icon: <span data-testid="icon-home">H</span> },
  { id: "profile", label: "Profile", icon: <span data-testid="icon-profile">P</span> },
];

const tabsWithCounts: Tab[] = [
  { id: "inbox", label: "Inbox", count: 12 },
  { id: "sent", label: "Sent", count: 0 },
];

describe("TabPanel", () => {
  describe("Rendering", () => {
    it("renders all tabs as buttons with role tab", () => {
      render(<TabPanel tabs={tabs}>Content</TabPanel>);

      const tabElements = screen.getAllByRole("tab");
      expect(tabElements).toHaveLength(3);
      expect(tabElements[0]).toHaveTextContent("Home");
      expect(tabElements[1]).toHaveTextContent("Profile");
      expect(tabElements[2]).toHaveTextContent("Settings");
    });

    it("renders a tablist container", () => {
      render(<TabPanel tabs={tabs}>Content</TabPanel>);

      expect(screen.getByRole("tablist")).toBeInTheDocument();
    });

    it("renders tabpanel elements for all tabs", () => {
      render(<TabPanel tabs={tabs}>Content</TabPanel>);

      const panels = screen.getAllByRole("tabpanel", { hidden: true });
      expect(panels).toHaveLength(3);
    });

    it("shows content only in the active panel", () => {
      render(<TabPanel tabs={tabs} defaultValue="profile">Active content</TabPanel>);

      const visiblePanel = screen.getByRole("tabpanel");
      expect(visiblePanel).toHaveTextContent("Active content");
    });

    it("renders with render function children", () => {
      render(
        <TabPanel tabs={tabs} defaultValue="home">
          {(tab) => <div>Content for {tab.label}</div>}
        </TabPanel>,
      );

      expect(screen.getByRole("tabpanel")).toHaveTextContent("Content for Home");
    });

    it("handles empty tabs array without crashing", () => {
      render(<TabPanel tabs={[]}>No tabs</TabPanel>);

      expect(screen.queryByRole("tab")).not.toBeInTheDocument();
      expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
    });
  });

  describe("Uncontrolled Mode", () => {
    it("activates first tab by default when no defaultValue", () => {
      render(<TabPanel tabs={tabs}>Content</TabPanel>);

      const tabElements = screen.getAllByRole("tab");
      expect(tabElements[0]).toHaveAttribute("aria-selected", "true");
      expect(tabElements[1]).toHaveAttribute("aria-selected", "false");
    });

    it("activates the tab matching defaultValue", () => {
      render(<TabPanel tabs={tabs} defaultValue="settings">Content</TabPanel>);

      const tabElements = screen.getAllByRole("tab");
      expect(tabElements[2]).toHaveAttribute("aria-selected", "true");
      expect(tabElements[0]).toHaveAttribute("aria-selected", "false");
    });

    it("switches tabs on click without external state", async () => {
      const user = userEvent.setup();
      render(<TabPanel tabs={tabs}>Content</TabPanel>);

      await user.click(screen.getByRole("tab", { name: "Profile" }));

      expect(screen.getByRole("tab", { name: "Profile" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });
  });

  describe("Controlled Mode", () => {
    it("reflects external value prop as active tab", () => {
      render(
        <TabPanel tabs={tabs} value="settings" onValueChange={() => {}}>
          Content
        </TabPanel>,
      );

      expect(screen.getByRole("tab", { name: "Settings" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("calls onValueChange when a tab is clicked", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TabPanel tabs={tabs} value="home" onValueChange={onValueChange}>
          Content
        </TabPanel>,
      );

      await user.click(screen.getByRole("tab", { name: "Profile" }));

      expect(onValueChange).toHaveBeenCalledWith("profile");
      expect(onValueChange).toHaveBeenCalledTimes(1);
    });

    it("does not call onValueChange when clicking the already-active tab", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TabPanel tabs={tabs} value="home" onValueChange={onValueChange}>
          Content
        </TabPanel>,
      );

      await user.click(screen.getByRole("tab", { name: "Home" }));

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("Keyboard Navigation (Horizontal)", () => {
    it("moves focus to next tab with ArrowRight", async () => {
      const user = userEvent.setup();
      render(<TabPanel tabs={tabs} defaultValue="home">Content</TabPanel>);

      const firstTab = screen.getByRole("tab", { name: "Home" });
      await user.click(firstTab);
      await user.keyboard("{ArrowRight}");

      expect(screen.getByRole("tab", { name: "Profile" })).toHaveFocus();
    });

    it("moves focus to previous tab with ArrowLeft", async () => {
      const user = userEvent.setup();
      render(<TabPanel tabs={tabs} defaultValue="profile">Content</TabPanel>);

      const secondTab = screen.getByRole("tab", { name: "Profile" });
      await user.click(secondTab);
      await user.keyboard("{ArrowLeft}");

      expect(screen.getByRole("tab", { name: "Home" })).toHaveFocus();
    });

    it("wraps around from last to first tab when loop is enabled", async () => {
      const user = userEvent.setup();
      render(<TabPanel tabs={tabs} defaultValue="settings" loop>Content</TabPanel>);

      await user.click(screen.getByRole("tab", { name: "Settings" }));
      await user.keyboard("{ArrowRight}");

      expect(screen.getByRole("tab", { name: "Home" })).toHaveFocus();
    });

    it("does not wrap when loop is disabled", async () => {
      const user = userEvent.setup();
      render(
        <TabPanel tabs={tabs} defaultValue="settings" loop={false}>
          Content
        </TabPanel>,
      );

      await user.click(screen.getByRole("tab", { name: "Settings" }));
      await user.keyboard("{ArrowRight}");

      expect(screen.getByRole("tab", { name: "Settings" })).toHaveFocus();
    });

    it("Home key moves to first enabled tab", async () => {
      const user = userEvent.setup();
      render(<TabPanel tabs={tabs} defaultValue="settings">Content</TabPanel>);

      await user.click(screen.getByRole("tab", { name: "Settings" }));
      await user.keyboard("{Home}");

      expect(screen.getByRole("tab", { name: "Home" })).toHaveFocus();
    });

    it("End key moves to last enabled tab", async () => {
      const user = userEvent.setup();
      render(<TabPanel tabs={tabs} defaultValue="home">Content</TabPanel>);

      await user.click(screen.getByRole("tab", { name: "Home" }));
      await user.keyboard("{End}");

      expect(screen.getByRole("tab", { name: "Settings" })).toHaveFocus();
    });

    it("skips disabled tabs during keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <TabPanel tabs={tabsWithDisabled} defaultValue="home">
          Content
        </TabPanel>,
      );

      await user.click(screen.getByRole("tab", { name: "Home" }));
      await user.keyboard("{ArrowRight}");

      expect(screen.getByRole("tab", { name: "Settings" })).toHaveFocus();
    });

    it("automatically activates tab on arrow key in automatic mode", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TabPanel
          tabs={tabs}
          value="home"
          onValueChange={onValueChange}
          activationMode="automatic"
        >
          Content
        </TabPanel>,
      );

      await user.click(screen.getByRole("tab", { name: "Home" }));
      await user.keyboard("{ArrowRight}");

      expect(onValueChange).toHaveBeenCalledWith("profile");
    });
  });

  describe("Keyboard Navigation (Vertical)", () => {
    it("uses ArrowDown/ArrowUp instead of ArrowRight/ArrowLeft", async () => {
      const user = userEvent.setup();
      render(
        <TabPanel tabs={tabs} defaultValue="home" orientation="vertical">
          Content
        </TabPanel>,
      );

      await user.click(screen.getByRole("tab", { name: "Home" }));
      await user.keyboard("{ArrowDown}");

      expect(screen.getByRole("tab", { name: "Profile" })).toHaveFocus();

      await user.keyboard("{ArrowUp}");

      expect(screen.getByRole("tab", { name: "Home" })).toHaveFocus();
    });
  });

  describe("RTL Keyboard Navigation", () => {
    it("reverses ArrowLeft/ArrowRight in RTL context", async () => {
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = ((...args: Parameters<typeof originalGetComputedStyle>) => {
        const styles = originalGetComputedStyle(...args);
        return new Proxy(styles, {
          get(target, prop) {
            if (prop === "direction") return "rtl";
            const value = Reflect.get(target, prop);
            if (typeof value === "function") return value.bind(target);
            return value;
          },
        });
      }) as typeof window.getComputedStyle;

      try {
        const user = userEvent.setup();
        render(<TabPanel tabs={tabs} defaultValue="home">Content</TabPanel>);

        await user.click(screen.getByRole("tab", { name: "Home" }));
        await user.keyboard("{ArrowLeft}");

        expect(screen.getByRole("tab", { name: "Profile" })).toHaveFocus();
      } finally {
        window.getComputedStyle = originalGetComputedStyle;
      }
    });
  });

  describe("Manual Activation Mode", () => {
    it("does not activate tab on arrow key navigation", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TabPanel
          tabs={tabs}
          value="home"
          onValueChange={onValueChange}
          activationMode="manual"
        >
          Content
        </TabPanel>,
      );

      await user.click(screen.getByRole("tab", { name: "Home" }));
      await user.keyboard("{ArrowRight}");

      expect(screen.getByRole("tab", { name: "Profile" })).toHaveFocus();
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("activates focused tab on Enter", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TabPanel
          tabs={tabs}
          value="home"
          onValueChange={onValueChange}
          activationMode="manual"
        >
          Content
        </TabPanel>,
      );

      await user.click(screen.getByRole("tab", { name: "Home" }));
      await user.keyboard("{ArrowRight}");
      await user.keyboard("{Enter}");

      expect(onValueChange).toHaveBeenCalledWith("profile");
    });

    it("activates focused tab on Space", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TabPanel
          tabs={tabs}
          value="home"
          onValueChange={onValueChange}
          activationMode="manual"
        >
          Content
        </TabPanel>,
      );

      await user.click(screen.getByRole("tab", { name: "Home" }));
      await user.keyboard("{ArrowRight}");
      await user.keyboard(" ");

      expect(onValueChange).toHaveBeenCalledWith("profile");
    });
  });

  describe("Disabled State", () => {
    it("does not activate a disabled tab on click", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TabPanel
          tabs={tabsWithDisabled}
          value="home"
          onValueChange={onValueChange}
        >
          Content
        </TabPanel>,
      );

      await user.click(screen.getByRole("tab", { name: "Profile" }));

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("marks disabled tabs with aria-disabled", () => {
      render(
        <TabPanel tabs={tabsWithDisabled} defaultValue="home">
          Content
        </TabPanel>,
      );

      expect(screen.getByRole("tab", { name: "Profile" })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      expect(screen.getByRole("tab", { name: "Home" })).not.toHaveAttribute(
        "aria-disabled",
      );
    });

    it("disables all tabs when disabled prop is true", () => {
      render(
        <TabPanel tabs={tabs} defaultValue="home" disabled>
          Content
        </TabPanel>,
      );

      screen.getAllByRole("tab").forEach((tab) => {
        expect(tab).toHaveAttribute("aria-disabled", "true");
      });
    });

    it("prevents activation when globally disabled", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TabPanel tabs={tabs} value="home" onValueChange={onValueChange} disabled>
          Content
        </TabPanel>,
      );

      await user.click(screen.getByRole("tab", { name: "Profile" }));

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("Dynamic Tabs (State Recovery)", () => {
    it("falls back to first tab when active tab is removed", () => {
      const { rerender } = render(
        <TabPanel tabs={tabs} defaultValue="profile">
          Content
        </TabPanel>,
      );

      expect(screen.getByRole("tab", { name: "Profile" })).toHaveAttribute(
        "aria-selected",
        "true",
      );

      const reducedTabs = [tabs[0], tabs[2]];
      rerender(
        <TabPanel tabs={reducedTabs} defaultValue="profile">
          Content
        </TabPanel>,
      );

      expect(screen.getByRole("tab", { name: "Home" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });
  });

  describe("Accessibility (ARIA)", () => {
    it("sets aria-orientation on the tablist", () => {
      render(
        <TabPanel tabs={tabs} orientation="vertical">
          Content
        </TabPanel>,
      );

      expect(screen.getByRole("tablist")).toHaveAttribute(
        "aria-orientation",
        "vertical",
      );
    });

    it("sets aria-label on the tablist", () => {
      render(
        <TabPanel tabs={tabs} aria-label="Navigation">
          Content
        </TabPanel>,
      );

      expect(screen.getByRole("tablist")).toHaveAttribute(
        "aria-label",
        "Navigation",
      );
    });

    it("defaults aria-label to Tabs", () => {
      render(<TabPanel tabs={tabs}>Content</TabPanel>);

      expect(screen.getByRole("tablist")).toHaveAttribute(
        "aria-label",
        "Tabs",
      );
    });

    it("links tabs to panels via aria-controls and aria-labelledby", () => {
      render(
        <TabPanel tabs={tabs} id="test-tabs">
          Content
        </TabPanel>,
      );

      const firstTab = screen.getByRole("tab", { name: "Home" });
      expect(firstTab).toHaveAttribute("aria-controls", "test-tabs-panel-home");

      const panels = screen.getAllByRole("tabpanel", { hidden: true });
      const homePanel = panels.find((p) => p.id === "test-tabs-panel-home");
      expect(homePanel).toHaveAttribute("aria-labelledby", "test-tabs-tab-home");
    });

    it("implements roving tabindex — only tabbable tab has tabIndex 0", () => {
      render(<TabPanel tabs={tabs} defaultValue="profile">Content</TabPanel>);

      const tabElements = screen.getAllByRole("tab");
      expect(tabElements[0]).toHaveAttribute("tabindex", "-1");
      expect(tabElements[1]).toHaveAttribute("tabindex", "0");
      expect(tabElements[2]).toHaveAttribute("tabindex", "-1");
    });

    it("sets data-state on tabs and panels", () => {
      render(
        <TabPanel tabs={tabs} defaultValue="home">
          Content
        </TabPanel>,
      );

      expect(screen.getByRole("tab", { name: "Home" })).toHaveAttribute(
        "data-state",
        "active",
      );
      expect(screen.getByRole("tab", { name: "Profile" })).toHaveAttribute(
        "data-state",
        "inactive",
      );

      expect(screen.getByRole("tabpanel")).toHaveAttribute(
        "data-state",
        "active",
      );
    });

    it("hidden panels have hidden attribute", () => {
      render(
        <TabPanel tabs={tabs} id="aria-test" defaultValue="home">
          Content
        </TabPanel>,
      );

      const panels = screen.getAllByRole("tabpanel", { hidden: true });
      const inactivePanels = panels.filter((p) => p.id !== "aria-test-panel-home");
      inactivePanels.forEach((panel) => {
        expect(panel).toHaveAttribute("hidden");
      });
    });

    it("provides aria-label on icon-only tabs when labels are hidden", () => {
      render(
        <TabPanel tabs={tabsWithIcons} defaultValue="home" alwaysShowLabels={false}>
          Content
        </TabPanel>,
      );

      const profileTab = screen.getByRole("tab", { name: "Profile" });
      expect(profileTab).toHaveAttribute("aria-label", "Profile");

      const homeTab = screen.getAllByRole("tab")[0];
      expect(homeTab).not.toHaveAttribute("aria-label");
    });

    it("marks icons as aria-hidden", () => {
      render(
        <TabPanel tabs={tabsWithIcons} defaultValue="home">
          Content
        </TabPanel>,
      );

      const iconSpans = screen.getByTestId("icon-home").closest("span[aria-hidden]");
      expect(iconSpans).toHaveAttribute("aria-hidden", "true");
    });

    it("active panel has tabIndex 0 for focus management", () => {
      render(
        <TabPanel tabs={tabs} defaultValue="home">
          Content
        </TabPanel>,
      );

      expect(screen.getByRole("tabpanel")).toHaveAttribute("tabindex", "0");
    });
  });

  describe("Icons", () => {
    it("renders icons in left position by default", () => {
      render(
        <TabPanel tabs={tabsWithIcons} defaultValue="home">
          Content
        </TabPanel>,
      );

      const homeTab = screen.getByRole("tab", { name: "Home" });
      const children = Array.from(homeTab.children);
      const iconIndex = children.findIndex(
        (el) => el.getAttribute("aria-hidden") === "true",
      );
      const labelIndex = children.findIndex(
        (el) => el.textContent === "Home" && !el.hasAttribute("aria-hidden"),
      );
      expect(iconIndex).toBeLessThan(labelIndex);
    });

    it("renders icons in right position when configured", () => {
      render(
        <TabPanel tabs={tabsWithIcons} defaultValue="home" iconPosition="right">
          Content
        </TabPanel>,
      );

      const homeTab = screen.getByRole("tab", { name: "Home" });
      const children = Array.from(homeTab.children);
      const iconIndex = children.findIndex(
        (el) => el.getAttribute("aria-hidden") === "true",
      );
      const labelIndex = children.findIndex(
        (el) => el.textContent === "Home" && !el.hasAttribute("aria-hidden"),
      );
      expect(iconIndex).toBeGreaterThan(labelIndex);
    });
  });

  describe("Count Badges", () => {
    it("displays count badges when count is defined", () => {
      render(
        <TabPanel tabs={tabsWithCounts} defaultValue="inbox">
          Content
        </TabPanel>,
      );

      const inboxTab = screen.getByRole("tab", { name: /Inbox/ });
      expect(within(inboxTab).getByText("12")).toBeInTheDocument();
    });

    it("hides zero count badges by default", () => {
      render(
        <TabPanel tabs={tabsWithCounts} defaultValue="inbox">
          Content
        </TabPanel>,
      );

      const sentTab = screen.getByRole("tab", { name: /Sent/ });
      expect(within(sentTab).queryByText("0")).not.toBeInTheDocument();
    });

    it("shows zero count badges when showZeroCount is true", () => {
      render(
        <TabPanel tabs={tabsWithCounts} defaultValue="inbox" showZeroCount>
          Content
        </TabPanel>,
      );

      const sentTab = screen.getByRole("tab", { name: /Sent/ });
      expect(within(sentTab).getByText("0")).toBeInTheDocument();
    });

    it("count badges have aria-label for screen readers", () => {
      render(
        <TabPanel tabs={tabsWithCounts} defaultValue="inbox">
          Content
        </TabPanel>,
      );

      expect(screen.getByLabelText("12 items")).toBeInTheDocument();
    });
  });

  describe("classes & Styling", () => {
    it("applies classes.root to root element", () => {
      const { container } = render(
        <TabPanel tabs={tabs} classes={{ root: "custom-root" }}>
          Content
        </TabPanel>,
      );

      expect(container.firstElementChild).toHaveClass("custom-root");
    });

    it("falls back to className when classes.root is not set", () => {
      const { container } = render(
        <TabPanel tabs={tabs} className="fallback-root">
          Content
        </TabPanel>,
      );

      expect(container.firstElementChild).toHaveClass("fallback-root");
    });

    it("merges classes.root with className on the root element", () => {
      const { container } = render(
        <TabPanel
          tabs={tabs}
          className="fallback"
          classes={{ root: "primary" }}
        >
          Content
        </TabPanel>,
      );

      expect(container.firstElementChild).toHaveClass("primary");
      expect(container.firstElementChild).toHaveClass("fallback");
    });

    it("applies style prop to root element", () => {
      const { container } = render(
        <TabPanel tabs={tabs} style={{ maxWidth: "400px" }}>
          Content
        </TabPanel>,
      );

      expect((container.firstElementChild as HTMLElement).style.maxWidth).toBe(
        "400px",
      );
    });

    it("applies classes.panel to panel elements", () => {
      render(
        <TabPanel
          tabs={tabs}
          defaultValue="home"
          classes={{ panel: "panel-class" }}
        >
          Content
        </TabPanel>,
      );

      expect(screen.getByRole("tabpanel")).toHaveClass("panel-class");
    });
  });

  describe("Custom ID", () => {
    it("uses provided id for tab and panel IDs", () => {
      render(
        <TabPanel tabs={tabs} id="custom" defaultValue="home">
          Content
        </TabPanel>,
      );

      expect(screen.getByRole("tab", { name: "Home" })).toHaveAttribute(
        "id",
        "custom-tab-home",
      );
      expect(screen.getByRole("tabpanel")).toHaveAttribute(
        "id",
        "custom-panel-home",
      );
    });

    it("generates a unique id when none is provided", () => {
      render(
        <TabPanel tabs={tabs} defaultValue="home">
          Content
        </TabPanel>,
      );

      const tab = screen.getByRole("tab", { name: "Home" });
      expect(tab.id).toContain("tab-home");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to root element", () => {
      const ref = { current: null as HTMLDivElement | null };
      render(
        <TabPanel tabs={tabs} ref={ref}>
          Content
        </TabPanel>,
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("data-orientation", () => {
    it("applies data-orientation to root element", () => {
      const { container } = render(
        <TabPanel tabs={tabs} orientation="vertical">
          Content
        </TabPanel>,
      );

      expect(container.firstElementChild).toHaveAttribute(
        "data-orientation",
        "vertical",
      );
    });
  });
});

describe("useTabPanelContext", () => {
  it("throws an error when used outside of a TabPanel", () => {
    expect(() => renderHook(() => useTabPanelContext())).toThrow(
      "TabPanel compound components must be used within a <TabPanel> component",
    );
  });
});
