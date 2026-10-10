import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Button, ButtonGroup } from "../index.js";

import { setReducedMotion } from "../../../test/matchMedia.js";

// The stub answers nothing by default, so every file that renders a
// motion-aware component states the preference it is testing under.
beforeEach(() => setReducedMotion(false));

describe("Button", () => {
  describe("Rendering", () => {
    it("renders as button element by default", () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole("button", { name: "Click me" });
      expect(button.tagName).toBe("BUTTON");
      expect(button).toHaveAttribute("type", "button");
    });

    it("renders as anchor when as='a' with href", () => {
      render(
        <Button as="a" href="https://example.com">
          Link
        </Button>
      );

      const link = screen.getByRole("link", { name: "Link" });
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "https://example.com");
    });

    it("renders as span with role='button' when as='span'", () => {
      render(<Button as="span">Span Button</Button>);

      const button = screen.getByRole("button", { name: "Span Button" });
      expect(button.tagName).toBe("SPAN");
      expect(button).toHaveAttribute("tabindex", "0");
    });

    it("renders leading icon", () => {
      render(
        <Button startIcon={<span data-testid="leading">→</span>}>
          With Icon
        </Button>
      );

      expect(screen.getByTestId("leading")).toBeInTheDocument();
    });

    it("renders trailing icon", () => {
      render(
        <Button endIcon={<span data-testid="trailing">←</span>}>
          With Icon
        </Button>
      );

      expect(screen.getByTestId("trailing")).toBeInTheDocument();
    });

    it("applies fullWidth class when fullWidth=true", () => {
      render(<Button fullWidth>Full Width</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full");
    });

    it("applies custom className", () => {
      render(<Button className="custom-class">Styled</Button>);

      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    it("applies custom classes.content", () => {
      render(<Button classes={{ itemText: "custom-content" }}>Content</Button>);

      const content = screen.getByText("Content").closest("span");
      expect(content).toHaveClass("custom-content");
    });
  });

  describe("Loading State", () => {
    it("shows loader when loading=true", () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toHaveAttribute("data-loading", "true");
    });

    it("displays loadingContent when provided", () => {
      render(
        <Button loading loadingContent="Please wait...">
          Submit
        </Button>
      );

      expect(screen.getByText("Please wait...")).toBeInTheDocument();
      expect(screen.queryByText("Submit")).not.toBeInTheDocument();
    });

    it("renders custom loader when provided", () => {
      render(
        <Button loading loader={<span data-testid="custom-loader">⏳</span>}>
          Loading
        </Button>
      );

      expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
    });

    it("positions loader at the start when loaderPosition='start'", () => {
      render(
        <Button
          loading
          loaderPosition="start"
          loader={<span data-testid="loader">⏳</span>}
        >
          Loading
        </Button>
      );

      const button = screen.getByRole("button");
      const content = button.querySelector("span");
      const loader = screen.getByTestId("loader");

      const children = Array.from(content?.childNodes || []);
      const loaderIndex = children.findIndex((n) =>
        n.contains(loader)
      );
      // Find the visible text node, skipping the visually-hidden status
      // announcement and the loader wrapper
      const textIndex = children.findIndex(
        (n) =>
          n.textContent === "Loading" &&
          !n.contains(loader) &&
          !(n instanceof HTMLElement && n.getAttribute("role") === "status"),
      );

      expect(loaderIndex).toBeLessThan(textIndex);
    });
  });

  describe("Disabled State", () => {
    it("disables button when disabled=true", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-disabled", "true");
    });

    it("disables button when loading=true", () => {
      render(<Button loading>Loading</Button>);

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
      );

      await user.click(screen.getByRole("button"));

      expect(onClick).not.toHaveBeenCalled();
    });

    it("does not call onClick when loading", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Button loading onClick={onClick}>
          Loading
        </Button>
      );

      await user.click(screen.getByRole("button"));

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("Click Handling", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<Button onClick={onClick}>Click me</Button>);

      await user.click(screen.getByRole("button"));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("supports submit type for forms", () => {
      render(<Button type="submit">Submit</Button>);

      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });
  });

  describe("Anchor Variant", () => {
    it("sets target and rel attributes", () => {
      render(
        <Button as="a" href="https://example.com" target="_blank" rel="noopener">
          External
        </Button>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener");
    });

    it("prevents navigation when disabled", async () => {
      const user = userEvent.setup();

      render(
        <Button as="a" href="https://example.com" disabled>
          Disabled Link
        </Button>
      );

      const anchor = document.querySelector("a")!;
      expect(anchor).toHaveAttribute("aria-disabled", "true");
      expect(anchor).not.toHaveAttribute("href");
      expect(anchor).toHaveAttribute("tabindex", "-1");

      await user.click(anchor);
      expect(anchor).toBeInTheDocument();
    });

    it("prevents navigation when loading", async () => {
      const user = userEvent.setup();

      render(
        <Button as="a" href="https://example.com" loading>
          Loading Link
        </Button>
      );

      const anchor = document.querySelector("a")!;
      expect(anchor).toHaveAttribute("aria-disabled", "true");
      expect(anchor).not.toHaveAttribute("href");

      await user.click(anchor);
      expect(anchor).toBeInTheDocument();
    });
  });

  describe("Span Variant - Keyboard Accessibility", () => {
    it("activates on Enter key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Button as="span" onClick={onClick}>
          Span Button
        </Button>
      );

      const button = screen.getByRole("button");
      button.focus();

      await user.keyboard("{Enter}");

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("activates on Space key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Button as="span" onClick={onClick}>
          Span Button
        </Button>
      );

      const button = screen.getByRole("button");
      button.focus();

      await user.keyboard(" ");

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not activate on Enter when disabled", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Button as="span" disabled onClick={onClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      button.focus();

      await user.keyboard("{Enter}");

      expect(onClick).not.toHaveBeenCalled();
    });

    it("has tabIndex=-1 when disabled", () => {
      render(
        <Button as="span" disabled>
          Disabled
        </Button>
      );

      expect(screen.getByRole("button")).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("asChild Pattern", () => {
    it("renders child element with merged props", () => {
      render(
        <Button asChild className="button-class">
          <a href="/test" className="link-class">
            Link
          </a>
        </Button>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("button-class");
      expect(link).toHaveClass("link-class");
    });

    // `Slot` read the child's ref as `element.ref`, which React 19 still answers
    // but warns about in development — where the matrix, building for
    // production, cannot look. The React 18 half runs in the matrix.
    it("hands the child's own ref its element, without a ref warning", () => {
      const error = vi.spyOn(console, "error");
      const ref = createRef<HTMLAnchorElement>();
      render(
        <Button asChild>
          <a href="/test" ref={ref}>
            Link
          </a>
        </Button>
      );

      expect(ref.current).toBe(screen.getByRole("link"));
      expect(error.mock.calls.flat().join(" ")).not.toMatch(/element\.ref|`ref` is not a prop/);
      error.mockRestore();
    });

    it("does not call onClick when disabled with asChild", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Button asChild disabled onClick={onClick}>
          <span>Child</span>
        </Button>
      );

      await user.click(screen.getByText("Child"));

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to button element", () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Button</Button>);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement);
    });

    it("forwards ref to anchor element", () => {
      const ref = vi.fn();
      render(
        <Button as="a" href="/test" ref={ref}>
          Link
        </Button>
      );

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLAnchorElement);
    });

    it("forwards ref to span element", () => {
      const ref = vi.fn();
      render(
        <Button as="span" ref={ref}>
          Span
        </Button>
      );

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe("className Override Priority", () => {
    it("consumer className overrides fullWidth class", () => {
      render(
        <Button fullWidth className="w-auto">
          Button
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-auto");
    });

    it("consumer className overrides internal group class", () => {
      render(
        <Button
          iconAnimation="slideRight"
          startIcon={<span>→</span>}
          className="custom-class"
        >
          Button
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("className comes after internal classes in class list", () => {
      render(
        <Button fullWidth className="custom-button">
          Button
        </Button>
      );

      const button = screen.getByRole("button");
      const classes = button.className;
      const fullWidthIndex = classes.indexOf("w-full");
      const customIndex = classes.indexOf("custom-button");
      expect(customIndex).toBeGreaterThan(fullWidthIndex);
    });
  });

  describe("Tooltip", () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
    });

    it("renders no tooltip when the prop is absent", () => {
      render(<Button>Save</Button>);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("shows the tooltip on hover", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Button tooltip="Saves your work" tooltipProps={{ delayDuration: 0 }}>
          Save
        </Button>
      );

      await user.hover(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveTextContent("Saves your work");
      });
    });

    it("hides the tooltip on unhover", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Button tooltip="Saves your work" tooltipProps={{ delayDuration: 0 }}>
          Save
        </Button>
      );

      const button = screen.getByRole("button", { name: "Save" });
      await user.hover(button);
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      await user.unhover(button);
      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });

    it("shows the tooltip on keyboard focus", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Button tooltip="Saves your work" tooltipProps={{ delayDuration: 0 }}>
          Save
        </Button>
      );

      await user.tab();

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveTextContent("Saves your work");
      });
    });

    it("honours tooltipProps.delayDuration", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Button tooltip="Delayed" tooltipProps={{ delayDuration: 300 }}>
          Save
        </Button>
      );

      await user.hover(screen.getByRole("button", { name: "Save" }));
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("describes the button by the tooltip while it is open", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Button tooltip="Saves your work" tooltipProps={{ delayDuration: 0 }}>
          Save
        </Button>
      );

      const button = screen.getByRole("button", { name: "Save" });
      await user.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(button).toHaveAttribute("aria-describedby", tooltip.id);
      });
    });

    it("still fires onClick when wrapped in a tooltip", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onClick = vi.fn();

      render(
        <Button tooltip="Saves your work" onClick={onClick}>
          Save
        </Button>
      );

      await user.click(screen.getByRole("button", { name: "Save" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("passes tooltipProps through to the tooltip", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Button
          tooltip="Configured"
          tooltipProps={{
            maxWidth: 123,
            contentClassName: "custom-tooltip",
            delayDuration: 0,
          }}
        >
          Save
        </Button>
      );

      await user.hover(screen.getByRole("button", { name: "Save" }));

      // `side` is deliberately not asserted here: it only moves the computed
      // top/left, and every rect is zero in jsdom. e2e/tooltip.spec.ts owns it.
      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveClass("custom-tooltip");
        expect(tooltip).toHaveStyle({ maxWidth: "123px" });
      });
    });

    it("wraps the anchor variant too", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Button as="a" href="/somewhere" tooltip="Go there" tooltipProps={{ delayDuration: 0 }}>
          Link
        </Button>
      );

      await user.hover(screen.getByRole("link", { name: "Link" }));

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveTextContent("Go there");
      });
    });
  });

  describe("Data Attributes", () => {
    it("sets data-loading when loading", () => {
      render(<Button loading>Loading</Button>);

      expect(screen.getByRole("button")).toHaveAttribute("data-loading", "true");
    });

    it("sets data-disabled when disabled", () => {
      render(<Button disabled>Disabled</Button>);

      expect(screen.getByRole("button")).toHaveAttribute("data-disabled", "true");
    });

    it("sets data-full-width when fullWidth", () => {
      render(<Button fullWidth>Full</Button>);

      expect(screen.getByRole("button")).toHaveAttribute("data-full-width", "true");
    });
  });
});

describe("ButtonGroup", () => {
  describe("Rendering", () => {
    it("renders children with role='group'", () => {
      render(
        <ButtonGroup>
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup>
      );

      const group = screen.getByRole("group");
      expect(group).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "One" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Two" })).toBeInTheDocument();
    });

    it("applies className", () => {
      render(
        <ButtonGroup className="custom-group">
          <Button>Button</Button>
        </ButtonGroup>
      );

      expect(screen.getByRole("group")).toHaveClass("custom-group");
    });
  });

  describe("ARIA Support", () => {
    it("accepts aria-label for screen readers", () => {
      render(
        <ButtonGroup aria-label="Action buttons">
          <Button>Save</Button>
          <Button>Cancel</Button>
        </ButtonGroup>
      );

      expect(screen.getByRole("group")).toHaveAttribute(
        "aria-label",
        "Action buttons"
      );
    });

    it("accepts aria-labelledby", () => {
      render(
        <>
          <h2 id="group-label">Actions</h2>
          <ButtonGroup aria-labelledby="group-label">
            <Button>Save</Button>
          </ButtonGroup>
        </>
      );

      expect(screen.getByRole("group")).toHaveAttribute(
        "aria-labelledby",
        "group-label"
      );
    });
  });

  describe("Props Spreading", () => {
    it("spreads additional HTML attributes", () => {
      render(
        <ButtonGroup data-testid="my-group" id="button-group">
          <Button>Button</Button>
        </ButtonGroup>
      );

      const group = screen.getByRole("group");
      expect(group).toHaveAttribute("data-testid", "my-group");
      expect(group).toHaveAttribute("id", "button-group");
    });
  });
  describe("Size", () => {
    const classesOf = (el: HTMLElement) => new Set((el.getAttribute("class") ?? "").split(/\s+/));

    it("paints each size, and md is what an unset prop renders", () => {
      const { rerender } = render(<Button size="sm">Save</Button>);
      for (const [size, pad, text] of [
        ["sm", "px-3", "text-xs"],
        ["md", "px-4", "text-sm"],
        ["lg", "px-6", "text-base"],
      ] as const) {
        rerender(<Button size={size}>Save</Button>);
        const cls = classesOf(screen.getByRole("button"));
        expect(cls.has(pad), `${size} lost ${pad}`).toBe(true);
        expect(cls.has(text), `${size} lost ${text}`).toBe(true);
      }
      rerender(<Button>Save</Button>);
      const unset = classesOf(screen.getByRole("button"));
      expect(unset.has("px-4")).toBe(true);
      expect(unset.has("text-sm")).toBe(true);
    });

    it("emits data-size only when the consumer asked for one", () => {
      // The attribute reports the prop, not the paint: it stays a targeting
      // hook, and an unset prop rendering `md` does not start claiming one.
      const { rerender } = render(<Button size="lg">Save</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-size", "lg");
      rerender(<Button>Save</Button>);
      expect(screen.getByRole("button")).not.toHaveAttribute("data-size");
    });

    it("lets a consumer's className beat the size", () => {
      /**
       * The requirement this component already failed one layer down:
       * `border-none` in a default kept a consumer's `border` company instead
       * of yielding to it, because the two are in different tailwind-merge
       * groups. Every size token is in the same group as the utility a
       * consumer reaches for, so the consumer's replaces it outright — and the
       * library's is GONE from the class list, not merely outranked.
       */
      render(
        <Button size="lg" className="px-8 py-1 text-lg gap-4">
          Save
        </Button>,
      );
      const cls = classesOf(screen.getByRole("button"));
      // Variants stripped before the comparison. `data-[size=lg]:px-6` is not
      // the token `px-6`, so a check for the bare name passes against exactly
      // the form that defeats the consumer — it did, when this was planted.
      const base = new Set([...cls].map((c) => c.slice(c.lastIndexOf(":") + 1)));
      expect(base.has("px-8")).toBe(true);
      expect(base.has("px-6"), "the size's padding survived the consumer's").toBe(false);
      expect(base.has("py-1")).toBe(true);
      expect(base.has("py-3.5"), "the size's vertical padding survived").toBe(false);
      expect(base.has("text-lg")).toBe(true);
      expect(base.has("text-base"), "the size's type survived").toBe(false);
    });

    it("scales the loader with the size, and an explicit loaderSize still wins", () => {
      const { container, rerender } = render(
        <Button size="sm" loading>
          Save
        </Button>,
      );
      const loaderBox = () => container.querySelector<HTMLElement>("[style*='--loader-size']");
      expect(loaderBox()?.style.getPropertyValue("--loader-size")).toBe("12px");
      rerender(
        <Button size="lg" loading>
          Save
        </Button>,
      );
      expect(loaderBox()?.style.getPropertyValue("--loader-size")).toBe("20px");
      rerender(
        <Button size="lg" loading loaderSize={9}>
          Save
        </Button>,
      );
      expect(loaderBox()?.style.getPropertyValue("--loader-size")).toBe("9px");
    });

    it("drops the size's decoration under unstyled and keeps its structure", () => {
      render(
        <Button size="lg" unstyled>
          Save
        </Button>,
      );
      const cls = classesOf(screen.getByRole("button"));
      expect(cls.has("px-6"), "unstyled kept decorative padding").toBe(false);
      expect(cls.has("text-base"), "unstyled kept a type size").toBe(false);
    });
  });
});
