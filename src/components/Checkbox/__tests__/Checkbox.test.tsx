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

    it("applies custom className to label wrapper", () => {
      render(<Checkbox className="custom-class" />);

      const label = screen.getByRole("checkbox").closest("label");
      expect(label).toHaveClass("custom-class");
    });

    it("applies containerClassName to container", () => {
      render(<Checkbox containerClassName="custom-container" />);

      const container = document.querySelector(".custom-container");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Controlled Behavior", () => {
    it("reflects checked state", () => {
      render(<Checkbox checked onChange={() => {}} />);

      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("reflects unchecked state", () => {
      render(<Checkbox checked={false} />);

      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("calls onChange with checked value when clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<Checkbox checked={false} onChange={onChange} />);

      await user.click(screen.getByRole("checkbox"));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(true, expect.any(Object));
    });

    it("calls onChange with unchecked value when unchecking", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<Checkbox checked={true} onChange={onChange} />);

      await user.click(screen.getByRole("checkbox"));

      expect(onChange).toHaveBeenCalledWith(false, expect.any(Object));
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
      render(<Checkbox indeterminate containerClassName="container" />);

      const container = document.querySelector(".container");
      expect(container).toHaveAttribute("data-indeterminate", "true");
    });
  });

  describe("Disabled State", () => {
    it("disables checkbox when disabled=true", () => {
      render(<Checkbox disabled />);

      expect(screen.getByRole("checkbox")).toBeDisabled();
    });

    it("does not call onChange when disabled", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<Checkbox disabled onChange={onChange} />);

      await user.click(screen.getByRole("checkbox"));

      expect(onChange).not.toHaveBeenCalled();
    });

    it("sets data-disabled attribute when disabled", () => {
      render(<Checkbox disabled containerClassName="container" />);

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
      render(<Checkbox error containerClassName="container" />);

      const container = document.querySelector(".container");
      expect(container).toHaveAttribute("data-error", "true");
    });

    it("applies errorClassName to error message", () => {
      render(<Checkbox error errorMessage="Error" errorClassName="custom-error" />);

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
          onChange={() => {}}
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
      render(<Checkbox checked onChange={() => {}} />);

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
      render(<Checkbox size="lg" containerClassName="container" />);

      const container = document.querySelector(".container");
      expect(container).toHaveAttribute("data-size", "lg");
    });

    it("does not set data-size for numeric size", () => {
      render(<Checkbox size={28} containerClassName="container" />);

      const container = document.querySelector(".container");
      expect(container).not.toHaveAttribute("data-size");
    });

    it("sets data-shape attribute", () => {
      render(<Checkbox shape="circle" containerClassName="container" />);

      const container = document.querySelector(".container");
      expect(container).toHaveAttribute("data-shape", "circle");
    });

    it("applies sizeClassName when provided", () => {
      render(<Checkbox sizeClassName="custom-size" checkboxClassName="checkbox" />);

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveClass("custom-size");
    });

    it("applies shapeClassName when provided", () => {
      render(<Checkbox shapeClassName="custom-shape" checkboxClassName="checkbox" />);

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveClass("custom-shape");
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
      const onChange = vi.fn();

      render(<Checkbox checked={false} onChange={onChange} />);

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();

      await user.keyboard(" ");

      expect(onChange).toHaveBeenCalledWith(true, expect.any(Object));
    });

    it("does not toggle disabled checkbox with Space key", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<Checkbox disabled onChange={onChange} />);

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();

      await user.keyboard(" ");

      expect(onChange).not.toHaveBeenCalled();
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

      await user.tab(); // Focus checkbox
      await user.tab(); // Focus button

      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("provides accessible name via label", () => {
      render(<Checkbox label="Accept terms" id="terms" />);

      // Asterisk is aria-hidden so not included in accessible name
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
          onChange={() => {}}
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
    it("applies checkedClassName when checked", () => {
      render(
        <Checkbox
          checked
          onChange={() => {}}
          checkboxClassName="checkbox"
          checkedClassName="is-checked"
        />
      );

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveClass("is-checked");
    });

    it("applies uncheckedClassName when unchecked", () => {
      render(
        <Checkbox
          checked={false}
          checkboxClassName="checkbox"
          uncheckedClassName="is-unchecked"
        />
      );

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveClass("is-unchecked");
    });

    it("applies indeterminateClassName when indeterminate", () => {
      render(
        <Checkbox
          indeterminate
          checkboxClassName="checkbox"
          indeterminateClassName="is-indeterminate"
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

    it("uses name as fallback for id", () => {
      render(<Checkbox name="checkbox-name" />);

      expect(screen.getByRole("checkbox")).toHaveAttribute("id", "checkbox-name");
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

  describe("Label Association", () => {
    it("clicking label toggles checkbox", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<Checkbox label="Click me" onChange={onChange} />);

      await user.click(screen.getByText("Click me"));

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Data Attributes on Checkbox Span", () => {
    it("sets data-checked on checkbox span when checked", () => {
      render(
        <Checkbox
          checked
          onChange={() => {}}
          checkboxClassName="checkbox"
        />
      );

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveAttribute("data-checked", "true");
    });

    it("sets data-disabled on checkbox span when disabled", () => {
      render(<Checkbox disabled checkboxClassName="checkbox" />);

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveAttribute("data-disabled", "true");
    });

    it("sets data-error on checkbox span when error", () => {
      render(<Checkbox error checkboxClassName="checkbox" />);

      const checkboxSpan = document.querySelector(".checkbox");
      expect(checkboxSpan).toHaveAttribute("data-error", "true");
    });
  });
});
