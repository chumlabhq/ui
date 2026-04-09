import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import Switch from "../Switch";

describe("Switch Component", () => {
  describe("Rendering", () => {
    it("renders a switch button with role='switch'", () => {
      render(<Switch aria-label="Test switch" />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("renders with label when provided", () => {
      render(<Switch label="Enable feature" />);
      expect(screen.getByText("Enable feature")).toBeInTheDocument();
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("renders with description when provided", () => {
      render(
        <Switch
          label="Dark mode"
          description="Enable dark theme for the application"
        />
      );
      expect(screen.getByText("Enable dark theme for the application")).toBeInTheDocument();
    });

    it("renders checked icon when checked is true", () => {
      render(
        <Switch
          checked={true}
          checkedIcon={<span data-testid="check-icon">✓</span>}
          uncheckedIcon={<span data-testid="cross-icon">✗</span>}
          aria-label="Toggle"
        />
      );
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("cross-icon")).not.toBeInTheDocument();
    });

    it("renders unchecked icon when checked is false", () => {
      render(
        <Switch
          checked={false}
          checkedIcon={<span data-testid="check-icon">✓</span>}
          uncheckedIcon={<span data-testid="cross-icon">✗</span>}
          aria-label="Toggle"
        />
      );
      expect(screen.getByTestId("cross-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
    });
  });

  describe("Toggle Behavior", () => {
    it("calls onCheckedChange when clicked", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(
        <Switch
          checked={false}
          onCheckedChange={onCheckedChange}
          aria-label="Toggle feature"
        />
      );

      await user.click(screen.getByRole("switch"));
      expect(onCheckedChange).toHaveBeenCalledTimes(1);
    });

    it("calls onCheckedChange when label is clicked", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(
        <Switch
          label="Enable notifications"
          checked={false}
          onCheckedChange={onCheckedChange}
        />
      );

      await user.click(screen.getByText("Enable notifications"));
      expect(onCheckedChange).toHaveBeenCalledTimes(1);
    });

    it("reflects controlled checked state via aria-checked", () => {
      const { rerender } = render(
        <Switch checked={false} aria-label="Toggle" />
      );
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");

      rerender(<Switch checked={true} aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    });
  });

  describe("Disabled State", () => {
    it("does not call onCheckedChange when disabled", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(
        <Switch
          checked={false}
          onCheckedChange={onCheckedChange}
          disabled
          aria-label="Toggle"
        />
      );

      await user.click(screen.getByRole("switch"));
      expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it("sets disabled attribute on button when disabled", () => {
      render(<Switch disabled aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toBeDisabled();
    });

    it("is disabled via native disabled attribute when disabled", () => {
      render(<Switch disabled aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toBeDisabled();
    });

    it("sets data-disabled attribute when disabled", () => {
      render(<Switch disabled aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("Keyboard Accessibility", () => {
    it("can be focused via Tab", async () => {
      const user = userEvent.setup();
      render(<Switch aria-label="Toggle" />);

      await user.tab();
      expect(screen.getByRole("switch")).toHaveFocus();
    });

    it("toggles on Space key press", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(
        <Switch
          checked={false}
          onCheckedChange={onCheckedChange}
          aria-label="Toggle"
        />
      );

      const switchEl = screen.getByRole("switch");
      switchEl.focus();
      await user.keyboard(" ");
      expect(onCheckedChange).toHaveBeenCalledTimes(1);
    });

    it("toggles on Enter key press", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(
        <Switch
          checked={false}
          onCheckedChange={onCheckedChange}
          aria-label="Toggle"
        />
      );

      const switchEl = screen.getByRole("switch");
      switchEl.focus();
      await user.keyboard("{Enter}");
      expect(onCheckedChange).toHaveBeenCalledTimes(1);
    });

    it("does not toggle on Space when disabled", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(
        <Switch
          checked={false}
          onCheckedChange={onCheckedChange}
          disabled
          aria-label="Toggle"
        />
      );

      const switchEl = screen.getByRole("switch");
      switchEl.focus();
      await user.keyboard(" ");
      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe("ARIA Attributes", () => {
    it("has role='switch'", () => {
      render(<Switch aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("sets aria-checked based on checked prop", () => {
      const { rerender } = render(<Switch checked={false} aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");

      rerender(<Switch checked={true} aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    });

    it("sets aria-label when provided", () => {
      render(<Switch aria-label="Toggle dark mode" />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-label", "Toggle dark mode");
    });

    it("associates description via aria-describedby", () => {
      render(
        <Switch
          id="my-switch"
          label="Feature"
          description="This enables the feature"
        />
      );
      const switchEl = screen.getByRole("switch");
      expect(switchEl).toHaveAttribute("aria-describedby", "my-switch-description");
      expect(screen.getByText("This enables the feature")).toHaveAttribute("id", "my-switch-description");
    });

    it("does not set aria-describedby when no description", () => {
      render(<Switch label="Feature" />);
      expect(screen.getByRole("switch")).not.toHaveAttribute("aria-describedby");
    });
  });

  describe("Label Association", () => {
    it("associates label with switch via htmlFor", () => {
      render(<Switch id="test-switch" label="Enable feature" />);
      const label = screen.getByText("Enable feature");
      expect(label).toHaveAttribute("for", "test-switch");
    });

    it("generates unique ID when not provided", () => {
      render(<Switch label="Feature" />);
      const switchEl = screen.getByRole("switch");
      const label = screen.getByText("Feature");
      expect(switchEl.id).toBeTruthy();
      expect(label).toHaveAttribute("for", switchEl.id);
    });
  });

  describe("Data Attributes", () => {
    it("sets data-checked when checked is true", () => {
      render(<Switch checked={true} aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toHaveAttribute("data-checked", "true");
    });

    it("does not set data-checked when checked is false", () => {
      render(<Switch checked={false} aria-label="Toggle" />);
      expect(screen.getByRole("switch")).not.toHaveAttribute("data-checked");
    });

    it("sets data-disabled when disabled", () => {
      render(<Switch disabled aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to the button element", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Switch ref={ref} aria-label="Toggle" />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toBe(screen.getByRole("switch"));
    });

    it("allows programmatic focus via ref", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Switch ref={ref} aria-label="Toggle" />);
      ref.current?.focus();
      expect(screen.getByRole("switch")).toHaveFocus();
    });

    it("allows programmatic click via ref", async () => {
      const onCheckedChange = vi.fn();
      const ref = createRef<HTMLButtonElement>();
      render(<Switch ref={ref} onCheckedChange={onCheckedChange} aria-label="Toggle" />);
      ref.current?.click();
      expect(onCheckedChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Render Props", () => {
    it("uses renderLabel when provided", () => {
      render(
        <Switch
          checked={true}
          renderLabel={({ checked }) => (
            <span data-testid="custom-label">{checked ? "On" : "Off"}</span>
          )}
        />
      );
      expect(screen.getByTestId("custom-label")).toHaveTextContent("On");
    });

    it("updates renderLabel based on state change", () => {
      const { rerender } = render(
        <Switch
          checked={false}
          renderLabel={({ checked }) => (
            <span data-testid="custom-label">{checked ? "Active" : "Inactive"}</span>
          )}
        />
      );
      expect(screen.getByTestId("custom-label")).toHaveTextContent("Inactive");

      rerender(
        <Switch
          checked={true}
          renderLabel={({ checked }) => (
            <span data-testid="custom-label">{checked ? "Active" : "Inactive"}</span>
          )}
        />
      );
      expect(screen.getByTestId("custom-label")).toHaveTextContent("Active");
    });

    it("uses renderDescription when provided", () => {
      render(
        <Switch
          checked={false}
          renderDescription={({ checked }) => (
            <span data-testid="custom-desc">
              {checked ? "Feature enabled" : "Feature disabled"}
            </span>
          )}
        />
      );
      expect(screen.getByTestId("custom-desc")).toHaveTextContent("Feature disabled");
    });

    it("passes disabled state to render props", () => {
      render(
        <Switch
          checked={false}
          disabled
          renderLabel={({ disabled }) => (
            <span data-testid="custom-label">
              {disabled ? "Cannot toggle" : "Can toggle"}
            </span>
          )}
        />
      );
      expect(screen.getByTestId("custom-label")).toHaveTextContent("Cannot toggle");
    });
  });

  describe("Custom Transition Styles", () => {
    it("applies transitionDuration when provided", () => {
      render(<Switch transitionDuration={500} aria-label="Toggle" />);
      const switchEl = screen.getByRole("switch");
      expect(switchEl.style.transitionDuration).toBe("500ms");
    });

    it("applies transitionTimingFunction when provided", () => {
      render(<Switch transitionTimingFunction="ease-in-out" aria-label="Toggle" />);
      const switchEl = screen.getByRole("switch");
      expect(switchEl.style.transitionTimingFunction).toBe("ease-in-out");
    });

    it("does not apply inline transition styles when not provided", () => {
      render(<Switch aria-label="Toggle" />);
      const switchEl = screen.getByRole("switch");
      expect(switchEl.style.transitionDuration).toBe("");
      expect(switchEl.style.transitionTimingFunction).toBe("");
    });
  });

  describe("Button Props Forwarding", () => {
    it("forwards onFocus handler", async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();
      render(<Switch onFocus={onFocus} aria-label="Toggle" />);

      await user.tab();
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it("forwards onBlur handler", async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();
      render(<Switch onBlur={onBlur} aria-label="Toggle" />);

      await user.tab();
      await user.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it("forwards data-* attributes", () => {
      render(<Switch data-testid="my-switch" aria-label="Toggle" />);
      expect(screen.getByTestId("my-switch")).toBeInTheDocument();
    });

    it("forwards custom aria-* attributes", () => {
      render(<Switch aria-controls="panel-1" aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-controls", "panel-1");
    });
  });

  describe("CSS Custom Properties for Theming", () => {
    it("uses CSS custom properties in default tracker styles", () => {
      render(<Switch checked={true} aria-label="Toggle" />);
      const switchEl = screen.getByRole("switch");
      expect(switchEl.className).toContain("var(--switch-focus-ring");
    });

    it("uses CSS custom properties in default thumb styles", () => {
      render(<Switch checked={true} aria-label="Toggle" />);
      const switchEl = screen.getByRole("switch");
      const thumb = switchEl.querySelector("span");
      expect(thumb?.className).toContain("var(--switch-thumb-bg");
    });
  });

  describe("Form Integration", () => {
    it("renders hidden input when name is provided", () => {
      render(<Switch name="notifications" aria-label="Toggle" />);

      const hidden = document.querySelector('input[type="hidden"]');
      expect(hidden).toBeInTheDocument();
      expect(hidden).toHaveAttribute("name", "notifications");
    });

    it("sends empty string value when unchecked", () => {
      render(<Switch name="notifications" checked={false} aria-label="Toggle" />);

      const hidden = document.querySelector('input[type="hidden"]');
      expect(hidden).toHaveAttribute("value", "");
    });

    it("sends value when checked", () => {
      render(<Switch name="notifications" checked={true} value="yes" aria-label="Toggle" />);

      const hidden = document.querySelector('input[type="hidden"]');
      expect(hidden).toHaveAttribute("value", "yes");
    });

    it("sends default value 'on' when checked without custom value", () => {
      render(<Switch name="notifications" checked={true} aria-label="Toggle" />);

      const hidden = document.querySelector('input[type="hidden"]');
      expect(hidden).toHaveAttribute("value", "on");
    });

    it("does not render hidden input when name is not provided", () => {
      render(<Switch aria-label="Toggle" />);

      const hidden = document.querySelector('input[type="hidden"]');
      expect(hidden).not.toBeInTheDocument();
    });

    it("disables hidden input when switch is disabled", () => {
      render(<Switch name="notifications" disabled aria-label="Toggle" />);

      const hidden = document.querySelector('input[type="hidden"]');
      expect(hidden).toBeDisabled();
    });

    it("updates hidden input value when toggled", async () => {
      const user = userEvent.setup();
      render(<Switch name="notifications" aria-label="Toggle" />);

      const hidden = document.querySelector('input[type="hidden"]');
      expect(hidden).toHaveAttribute("value", "");

      await user.click(screen.getByRole("switch"));
      expect(hidden).toHaveAttribute("value", "on");
    });
  });

  describe("Error State", () => {
    it("sets data-error on container when error=true", () => {
      render(<Switch error aria-label="Toggle" classes={{ root: "container" }} />);

      const container = document.querySelector(".container");
      expect(container).toHaveAttribute("data-error", "true");
    });

    it("renders error message when error and errorMessage provided", () => {
      render(<Switch error errorMessage="Required field" aria-label="Toggle" />);

      expect(screen.getByRole("alert")).toHaveTextContent("Required field");
    });

    it("does not render error message when error=false", () => {
      render(<Switch error={false} errorMessage="Required field" aria-label="Toggle" />);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("applies error class from classes prop to error message", () => {
      render(
        <Switch error errorMessage="Error" classes={{ error: "custom-error" }} aria-label="Toggle" />
      );

      expect(screen.getByRole("alert")).toHaveClass("custom-error");
    });

    it("includes error id in aria-describedby", () => {
      render(
        <Switch id="my-switch" error errorMessage="Error text" aria-label="Toggle" />
      );

      const switchEl = screen.getByRole("switch");
      expect(switchEl).toHaveAttribute("aria-describedby", expect.stringContaining("my-switch-error"));
    });

    it("includes both description and error in aria-describedby", () => {
      render(
        <Switch
          id="my-switch"
          description="Help text"
          error
          errorMessage="Error text"
          aria-label="Toggle"
        />
      );

      const switchEl = screen.getByRole("switch");
      expect(switchEl).toHaveAttribute(
        "aria-describedby",
        "my-switch-description my-switch-error"
      );
    });
  });

  describe("Custom Styling", () => {
    it("applies className to root container", () => {
      render(<Switch className="custom-root" aria-label="Toggle" />);

      const container = document.querySelector(".custom-root");
      expect(container).toBeInTheDocument();
      expect(screen.getByRole("switch")).not.toHaveClass("custom-root");
    });

    it("applies classes.root to root container", () => {
      render(<Switch classes={{ root: "custom-container" }} aria-label="Toggle" />);

      expect(document.querySelector(".custom-container")).toBeInTheDocument();
    });

    it("applies className after classes.root for override", () => {
      render(
        <Switch
          classes={{ root: "bg-red-500" }}
          className="bg-blue-500"
          aria-label="Toggle"
        />
      );

      const container = document.querySelector(".bg-blue-500");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("renders without onCheckedChange (uncontrolled display)", () => {
      render(<Switch checked={true} aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    });

    it("defaults checked to false", () => {
      render(<Switch aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    });

    it("handles rapid toggle calls", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(
        <Switch onCheckedChange={onCheckedChange} aria-label="Toggle" />
      );

      const switchEl = screen.getByRole("switch");
      await user.click(switchEl);
      await user.click(switchEl);
      await user.click(switchEl);
      expect(onCheckedChange).toHaveBeenCalledTimes(3);
    });
  });
});
