import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, ButtonGroup } from "../index";

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

    it("applies custom contentClassName", () => {
      render(<Button contentClassName="custom-content">Content</Button>);

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

    it("displays loadingText when provided", () => {
      render(
        <Button loading loadingText="Please wait...">
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

    it("positions loader on the left when loaderPosition='left'", () => {
      render(
        <Button
          loading
          loaderPosition="left"
          loader={<span data-testid="loader">⏳</span>}
        >
          Loading
        </Button>
      );

      const content = screen.getByText("Loading").closest("span");
      const loader = screen.getByTestId("loader");

      const children = Array.from(content?.childNodes || []);
      const loaderIndex = children.findIndex((n) =>
        n.contains(loader)
      );
      const textIndex = children.findIndex(
        (n) => n.textContent === "Loading"
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
});
