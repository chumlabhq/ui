import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../index";

describe("Checkbox", () => {
  describe("Rendering", () => {
    it("renders checkbox input", () => {
      render(<Checkbox />);

      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("renders with label", () => {
      render(<Checkbox label="Accept terms" />);

      expect(screen.getByText("Accept terms")).toBeInTheDocument();
    });

    it("renders with description", () => {
      render(
        <Checkbox
          label="Notifications"
          description="Receive email updates"
        />
      );

      expect(screen.getByText("Notifications")).toBeInTheDocument();
      expect(screen.getByText("Receive email updates")).toBeInTheDocument();
    });

    it("renders required indicator when required", () => {
      render(<Checkbox label="Required field" required />);

      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("applies classes.root to container div", () => {
      render(<Checkbox classes={{ root: "custom-class" }} />);

      const container = screen.getByRole("checkbox").closest("label")?.parentElement;
      expect(container).toHaveClass("custom-class");
    });

    it("applies classes.root to container", () => {
      render(<Checkbox classes={{ root: "custom-container" }} />);

      const container = document.querySelector(".custom-container");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Controlled Behavior", () => {
    it("reflects checked state", () => {
      render(<Checkbox checked onValueChange={() => {}} />);

      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("reflects unchecked state", () => {
      render(<Checkbox checked={false} />);

      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("calls onValueChange with checked value when clicked", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<Checkbox checked={false} onValueChange={onValueChange} />);

      await user.click(screen.getByRole("checkbox"));

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it("calls onValueChange with unchecked value when unchecking", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<Checkbox checked={true} onValueChange={onValueChange} />);

      await user.click(screen.getByRole("checkbox"));

      expect(onValueChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Indeterminate State", () => {
    it("sets indeterminate property on input", () => {
      render(<Checkbox indeterminate />);

      const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    it("updates indeterminate when prop changes", () => {
      const { rerender } = render(<Checkbox indeterminate={false} />);

      const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(false);

      rerender(<Checkbox indeterminate={true} />);
      expect(checkbox.indeterminate).toBe(true);
    });

    it("sets data-indeterminate attribute when indeterminate", () => {
      render(<Checkbox indeterminate classes={{ root: "container" }} />);

      const container = document.querySelector(".container");
      expect(container).toHaveAttribute("data-indeterminate", "true");
    });
  });

  describe("Disabled State", () => {
    it("disables checkbox when disabled=true", () => {
      render(<Checkbox disabled />);

      expect(screen.getByRole("checkbox")).toBeDisabled();
    });

    it("does not call onValueChange when disabled", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<Checkbox disabled onValueChange={onValueChange} />);

      await user.click(screen.getByRole("checkbox"));

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("sets data-disabled attribute when disabled", () => {
      render(<Checkbox disabled classes={{ root: "container" }} />);

      const container = document.querySelector(".container");
      expect(container).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("Error State", () => {
    it("sets aria-invalid when error=true", () => {
      render(<Checkbox error />);

      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("renders error message when error and errorMessage provided", () => {
      render(<Checkbox error errorMessage="This field is required" />);

      expect(screen.getByRole("alert")).toHaveTextContent("This field is required");
    });

    it("does not render error message when error=false", () => {
      render(<Checkbox error={false} errorMessage="Error" />);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("sets aria-describedby to error element", () => {
      render(<Checkbox id="test-checkbox" error errorMessage="Error" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-describedby", "test-checkbox-error");
    });

    it("sets data-error attribute when error=true", () => {
      render(<Checkbox error classes={{ root: "container" }} />);

      const container = document.querySelector(".container");
      expect(container).toHaveAttribute("data-error", "true");
    });

    it("applies classes.error to error message", () => {
      render(<Checkbox error errorMessage="Error" classes={{ error: "custom-error" }} />);

      expect(screen.getByRole("alert")).toHaveClass("custom-error");
    });
  });

  describe("Required State", () => {
    it("sets required attribute on input", () => {
      render(<Checkbox required />);

      expect(screen.getByRole("checkbox")).toBeRequired();
    });

    it("sets aria-required when required", () => {
      render(<Checkbox required />);

      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-required", "true");
    });

    it("hides asterisk from screen readers", () => {
      render(<Checkbox label="Field" required />);

      const asterisk = screen.getByText("*");
      expect(asterisk).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Custom Icons", () => {
    it("renders custom checked icon when checked", () => {
      render(
        <Checkbox
          checked
          onValueChange={() => {}}
          checkedIcon={<span data-testid="custom-check">✓</span>}
        />
      );

      expect(screen.getByTestId("custom-check")).toBeInTheDocument();
    });

    it("renders custom unchecked icon when unchecked", () => {
      render(
        <Checkbox
          checked={false}
          uncheckedIcon={<span data-testid="custom-unchecked">○</span>}
        />
      );

      expect(screen.getByTestId("custom-unchecked")).toBeInTheDocument();
    });

    it("renders custom indeterminate icon when indeterminate", () => {
      render(
        <Checkbox
          indeterminate
          indeterminateIcon={<span data-testid="custom-indeterminate">−</span>}
        />
      );

      expect(screen.getByTestId("custom-indeterminate")).toBeInTheDocument();
    });

    it("renders default check icon when checked without custom icon", () => {
      render(<Checkbox checked onValueChange={() => {}} />);

      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders default indeterminate icon when indeterminate without custom icon", () => {
      render(<Checkbox indeterminate />);

      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("Size and Shape", () => {
    it("sets data-size attribute with predefined size", () => {
      render(<Checkbox size="lg" classes={{ root: "container" }} />);

      const container = document.querySelector(".container");
      expect(container).toHaveAttribute("data-size", "lg");
    });

    it("does not set data-size for numeric size", () => {
      render(<Checkbox size={28} classes={{ root: "container" }} />);

      const container = document.querySelector(".container");
      expect(container).not.toHaveAttribute("data-size");
    });

    it("sets data-shape attribute", () => {
      render(<Checkbox shape="circle" classes={{ root: "container" }} />);

      const container = document.querySelector(".container");
      expect(container).toHaveAttribute("data-shape", "circle");
    });

    it("applies shape class from shape prop", () => {
      render(<Checkbox shape="circle" classes={{ checkbox: "checkbox" }} />);

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveClass("rounded-full");
    });
  });

  describe("Keyboard Navigation", () => {
    it("allows focusing via Tab key", async () => {
      const user = userEvent.setup();

      render(<Checkbox label="Focusable" />);

      await user.tab();

      expect(screen.getByRole("checkbox")).toHaveFocus();
    });

    it("toggles checkbox with Space key", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<Checkbox checked={false} onValueChange={onValueChange} />);

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();

      await user.keyboard(" ");

      expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it("does not toggle disabled checkbox with Space key", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<Checkbox disabled onValueChange={onValueChange} />);

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();

      await user.keyboard(" ");

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("Focus Events", () => {
    it("calls onFocus when checkbox gains focus", async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();

      render(<Checkbox onFocus={onFocus} />);

      await user.tab();

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it("calls onBlur when checkbox loses focus", async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();

      render(
        <>
          <Checkbox onBlur={onBlur} />
          <button>Other</button>
        </>
      );

      await user.tab();
      await user.tab();

      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("provides accessible name via label", () => {
      render(<Checkbox label="Accept terms" id="terms" />);

      expect(screen.getByRole("checkbox")).toHaveAccessibleName("Accept terms");
    });

    it("links description via aria-describedby", () => {
      render(
        <Checkbox
          id="notif"
          label="Notifications"
          description="Get email updates"
        />
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-describedby", "notif-description");
    });

    it("links both description and error via aria-describedby", () => {
      render(
        <Checkbox
          id="field"
          description="Help text"
          error
          errorMessage="Error text"
        />
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute(
        "aria-describedby",
        "field-description field-error"
      );
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = vi.fn();
      render(<Checkbox ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });

    it("ref provides access to input methods", () => {
      let inputRef: HTMLInputElement | null = null;

      render(
        <Checkbox
          ref={(el) => {
            inputRef = el;
          }}
          checked
          onValueChange={() => {}}
        />
      );

      expect(inputRef).not.toBeNull();
      expect(inputRef!.checked).toBe(true);
    });

    it("allows programmatic focus via ref", () => {
      let inputRef: HTMLInputElement | null = null;

      render(
        <Checkbox
          ref={(el) => {
            inputRef = el;
          }}
        />
      );

      inputRef!.focus();

      expect(screen.getByRole("checkbox")).toHaveFocus();
    });
  });

  describe("State ClassNames", () => {
    it("applies classes.checked when checked", () => {
      render(
        <Checkbox
          checked
          onValueChange={() => {}}
          classes={{ checkbox: "checkbox", checked: "is-checked" }}
        />
      );

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveClass("is-checked");
    });

    it("applies classes.unchecked when unchecked", () => {
      render(
        <Checkbox
          checked={false}
          classes={{ checkbox: "checkbox", unchecked: "is-unchecked" }}
        />
      );

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveClass("is-unchecked");
    });

    it("applies classes.indeterminate when indeterminate", () => {
      render(
        <Checkbox
          indeterminate
          classes={{ checkbox: "checkbox", indeterminate: "is-indeterminate" }}
        />
      );

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveClass("is-indeterminate");
    });
  });

  describe("ID and Name", () => {
    it("uses provided id", () => {
      render(<Checkbox id="custom-id" />);

      expect(screen.getByRole("checkbox")).toHaveAttribute("id", "custom-id");
    });

    it("generates id when only name is provided", () => {
      render(<Checkbox name="checkbox-name" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("id");
      expect(checkbox.id).toBeTruthy();
    });

    it("does not use name as id fallback", () => {
      render(<Checkbox name="checkbox-name" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.id).not.toBe("checkbox-name");
    });

    it("generates id when neither id nor name provided", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("id");
      expect(checkbox.id).toBeTruthy();
    });

    it("sets name attribute", () => {
      render(<Checkbox name="acceptTerms" />);

      expect(screen.getByRole("checkbox")).toHaveAttribute("name", "acceptTerms");
    });
  });

  describe("className Prop", () => {
    it("applies className to root container", () => {
      render(<Checkbox className="custom-root" />);

      const container = document.querySelector(".custom-root");
      expect(container).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).not.toHaveClass("custom-root");
    });
  });

  describe("Label Association", () => {
    it("clicking label toggles checkbox", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<Checkbox label="Click me" onValueChange={onValueChange} />);

      await user.click(screen.getByText("Click me"));

      expect(onValueChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Data Attributes on Checkbox Span", () => {
    it("sets data-checked on checkbox span when checked", () => {
      render(
        <Checkbox
          checked
          onValueChange={() => {}}
          classes={{ checkbox: "checkbox" }}
        />
      );

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveAttribute("data-checked", "true");
    });

    it("sets data-disabled on checkbox span when disabled", () => {
      render(<Checkbox disabled classes={{ checkbox: "checkbox" }} />);

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveAttribute("data-disabled", "true");
    });

    it("sets data-error on checkbox span when error", () => {
      render(<Checkbox error classes={{ checkbox: "checkbox" }} />);

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveAttribute("data-error", "true");
    });
  });
});
