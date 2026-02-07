import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextArea, TextAreaLabel } from "../index";

describe("TextArea", () => {
  describe("Rendering", () => {
    it("renders basic textarea with placeholder", () => {
      render(<TextArea placeholder="Enter text" />);

      expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    });

    it("renders with label", () => {
      render(<TextArea label="Description" />);

      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("renders required indicator when required", () => {
      render(<TextArea label="Description" required />);

      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("associates label with textarea via htmlFor", () => {
      render(<TextArea label="Description" id="description-input" />);

      const label = screen.getByText("Description");
      expect(label).toHaveAttribute("for", "description-input");
    });

    it("generates id from name when id not provided", () => {
      render(<TextArea label="Description" name="user-description" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("id", "user-description");
    });

    it("applies fullWidth class when fullWidth=true", () => {
      render(<TextArea fullWidth containerClassName="test-container" />);

      const container = document.querySelector(".test-container");
      expect(container).toHaveClass("w-full");
    });

    it("renders with default rows value of 4", () => {
      render(<TextArea />);

      expect(screen.getByRole("textbox")).toHaveAttribute("rows", "4");
    });

    it("renders with custom rows value", () => {
      render(<TextArea rows={8} />);

      expect(screen.getByRole("textbox")).toHaveAttribute("rows", "8");
    });
  });

  describe("Controlled TextArea", () => {
    it("accepts value prop", () => {
      render(<TextArea value="test value" onChange={() => {}} />);

      expect(screen.getByRole("textbox")).toHaveValue("test value");
    });

    it("calls onChange when user types", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<TextArea onChange={onChange} />);

      await user.type(screen.getByRole("textbox"), "hello");

      expect(onChange).toHaveBeenCalled();
    });

    it("handles multiline input", async () => {
      const user = userEvent.setup();

      render(<TextArea defaultValue="" />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Line 1{enter}Line 2");

      expect(textarea).toHaveValue("Line 1\nLine 2");
    });
  });

  describe("Disabled State", () => {
    it("disables textarea when disabled=true", () => {
      render(<TextArea disabled />);

      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("disables textarea when isLoading=true", () => {
      render(<TextArea isLoading />);

      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("sets data-disabled attribute when disabled", () => {
      render(<TextArea disabled containerClassName="test-container" />);

      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-disabled", "true");
    });

    it("sets data-loading attribute when loading", () => {
      render(<TextArea isLoading containerClassName="test-container" />);

      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-loading", "true");
    });
  });

  describe("Error State", () => {
    it("sets aria-invalid when error=true", () => {
      render(<TextArea error />);

      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("renders error message when error and errorMessage provided", () => {
      render(<TextArea error errorMessage="Invalid input" />);

      expect(screen.getByRole("alert")).toHaveTextContent("Invalid input");
    });

    it("does not render error message when error=false", () => {
      render(<TextArea error={false} errorMessage="Invalid input" />);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("sets aria-describedby to error element", () => {
      render(<TextArea id="test-textarea" error errorMessage="Invalid" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-describedby", "test-textarea-error");
    });

    it("sets data-error attribute when error=true", () => {
      render(<TextArea error containerClassName="test-container" />);

      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-error", "true");
    });
  });

  describe("Icons", () => {
    it("renders leading icon", () => {
      render(<TextArea leadingIcon={<span data-testid="leading">L</span>} />);

      expect(screen.getByTestId("leading")).toBeInTheDocument();
    });

    it("renders trailing icon", () => {
      render(<TextArea trailingIcon={<span data-testid="trailing">T</span>} />);

      expect(screen.getByTestId("trailing")).toBeInTheDocument();
    });

    it("renders both icons simultaneously", () => {
      render(
        <TextArea
          leadingIcon={<span data-testid="leading">L</span>}
          trailingIcon={<span data-testid="trailing">T</span>}
        />
      );

      expect(screen.getByTestId("leading")).toBeInTheDocument();
      expect(screen.getByTestId("trailing")).toBeInTheDocument();
    });
  });

  describe("Clickable Icons", () => {
    it("calls onLeadingIconClick when leading icon clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <TextArea
          leadingIcon={<span>L</span>}
          onLeadingIconClick={onClick}
          leadingIconLabel="Format"
        />
      );

      await user.click(screen.getByRole("button", { name: "Format" }));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("calls onTrailingIconClick when trailing icon clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <TextArea
          trailingIcon={<span>T</span>}
          onTrailingIconClick={onClick}
          trailingIconLabel="Clear"
        />
      );

      await user.click(screen.getByRole("button", { name: "Clear" }));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not render button role when no onClick handler", () => {
      render(<TextArea leadingIcon={<span>L</span>} />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("applies cursor-pointer class when icon is clickable", () => {
      render(
        <TextArea
          leadingIcon={<span data-testid="icon">L</span>}
          onLeadingIconClick={() => {}}
          leadingIconLabel="Format"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("cursor-pointer");
    });
  });

  describe("Loading State", () => {
    it("renders loader when isLoading=true", () => {
      render(<TextArea isLoading />);

      // CircularLoader has aria-hidden but is in the DOM
      const loader = document.querySelector('[aria-hidden="true"]');
      expect(loader).toBeInTheDocument();
    });

    it("renders custom loader when provided", () => {
      render(<TextArea isLoading loader={<span data-testid="custom-loader">Loading...</span>} />);

      expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
    });

    it("does not render loader when isLoading=false", () => {
      render(<TextArea isLoading={false} />);

      const loader = document.querySelector('[aria-hidden="true"]');
      expect(loader).not.toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("allows tabbing to textarea", async () => {
      const user = userEvent.setup();

      render(<TextArea placeholder="Tab target" />);

      await user.tab();

      expect(screen.getByPlaceholderText("Tab target")).toHaveFocus();
    });

    it("allows tabbing to clickable leading icon", async () => {
      const user = userEvent.setup();

      render(
        <TextArea
          leadingIcon={<span>L</span>}
          onLeadingIconClick={() => {}}
          leadingIconLabel="Format"
        />
      );

      await user.tab();

      expect(screen.getByRole("button", { name: "Format" })).toHaveFocus();
    });

    it("allows tabbing to clickable trailing icon", async () => {
      const user = userEvent.setup();

      render(
        <TextArea
          trailingIcon={<span>T</span>}
          onTrailingIconClick={() => {}}
          trailingIconLabel="Clear"
        />
      );

      await user.tab(); // Focus textarea first
      await user.tab(); // Focus trailing icon

      expect(screen.getByRole("button", { name: "Clear" })).toHaveFocus();
    });

    it("activates leading icon with Enter key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <TextArea
          leadingIcon={<span>L</span>}
          onLeadingIconClick={onClick}
          leadingIconLabel="Format"
        />
      );

      await user.tab();
      await user.keyboard("{Enter}");

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("activates leading icon with Space key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <TextArea
          leadingIcon={<span>L</span>}
          onLeadingIconClick={onClick}
          leadingIconLabel="Format"
        />
      );

      await user.tab();
      await user.keyboard(" ");

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("activates trailing icon with Enter key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <TextArea
          trailingIcon={<span>T</span>}
          onTrailingIconClick={onClick}
          trailingIconLabel="Clear"
        />
      );

      await user.tab(); // Focus textarea
      await user.tab(); // Focus trailing icon
      await user.keyboard("{Enter}");

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("activates trailing icon with Space key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <TextArea
          trailingIcon={<span>T</span>}
          onTrailingIconClick={onClick}
          trailingIconLabel="Clear"
        />
      );

      await user.tab(); // Focus textarea
      await user.tab(); // Focus trailing icon
      await user.keyboard(" ");

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not activate non-clickable icon on keyboard", async () => {
      const user = userEvent.setup();

      render(<TextArea leadingIcon={<span>L</span>} placeholder="textarea" />);

      // Non-clickable icon should not be focusable
      await user.tab();
      expect(screen.getByPlaceholderText("textarea")).toHaveFocus();
    });
  });

  describe("Accessibility", () => {
    it("sets aria-required when required", () => {
      render(<TextArea required />);

      expect(screen.getByRole("textbox")).toHaveAttribute("aria-required", "true");
    });

    it("hides required asterisk from screen readers", () => {
      render(<TextArea label="Description" required />);

      const asterisk = screen.getByText("*");
      expect(asterisk).toHaveAttribute("aria-hidden", "true");
    });

    it("provides accessible name via label", () => {
      render(<TextArea label="Description" id="description" />);

      expect(screen.getByRole("textbox")).toHaveAccessibleName("Description");
    });

    it("icon buttons have accessible labels", () => {
      render(
        <TextArea
          leadingIcon={<span>📝</span>}
          onLeadingIconClick={() => {}}
          leadingIconLabel="Format text"
          trailingIcon={<span>✕</span>}
          onTrailingIconClick={() => {}}
          trailingIconLabel="Clear textarea"
        />
      );

      expect(screen.getByRole("button", { name: "Format text" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Clear textarea" })).toBeInTheDocument();
    });
  });

  describe("Native TextArea Events", () => {
    it("calls onBlur when textarea loses focus", async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();

      render(<TextArea onBlur={onBlur} />);

      await user.click(screen.getByRole("textbox"));
      await user.tab();

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it("calls onFocus when textarea gains focus", async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();

      render(<TextArea onFocus={onFocus} />);

      await user.click(screen.getByRole("textbox"));

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it("calls onKeyDown on key press", async () => {
      const user = userEvent.setup();
      const onKeyDown = vi.fn();

      render(<TextArea onKeyDown={onKeyDown} />);

      await user.type(screen.getByRole("textbox"), "a");

      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to textarea element", () => {
      const ref = vi.fn();
      render(<TextArea ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLTextAreaElement);
    });

    it("ref provides access to textarea methods", () => {
      let textareaRef: HTMLTextAreaElement | null = null;

      render(
        <TextArea
          ref={(el) => {
            textareaRef = el;
          }}
          defaultValue="test"
        />
      );

      expect(textareaRef).not.toBeNull();
      expect(textareaRef!.value).toBe("test");
    });
  });

  describe("Custom Styling", () => {
    it("applies containerClassName to container", () => {
      render(<TextArea containerClassName="custom-container" />);

      expect(document.querySelector(".custom-container")).toBeInTheDocument();
    });

    it("applies wrapperClassName to wrapper", () => {
      render(<TextArea wrapperClassName="custom-wrapper" />);

      expect(document.querySelector(".custom-wrapper")).toBeInTheDocument();
    });

    it("applies className to textarea", () => {
      render(<TextArea className="custom-textarea" />);

      expect(screen.getByRole("textbox")).toHaveClass("custom-textarea");
    });

    it("applies labelClassName to label", () => {
      render(<TextArea label="Description" labelClassName="custom-label" />);

      expect(screen.getByText("Description")).toHaveClass("custom-label");
    });

    it("applies errorClassName to error message", () => {
      render(<TextArea error errorMessage="Error" errorClassName="custom-error" />);

      expect(screen.getByRole("alert")).toHaveClass("custom-error");
    });

    it("applies wrapperFocusClassName to wrapper", () => {
      render(<TextArea wrapperFocusClassName="custom-focus" />);

      expect(document.querySelector(".custom-focus")).toBeInTheDocument();
    });
  });
});

describe("TextAreaLabel", () => {
  it("renders label text", () => {
    render(<TextAreaLabel label="Description" textAreaId="description" />);

    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders required indicator", () => {
    render(<TextAreaLabel label="Description" textAreaId="description" required />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("associates with textarea via htmlFor", () => {
    render(<TextAreaLabel label="Description" textAreaId="description-input" />);

    expect(screen.getByText("Description")).toHaveAttribute("for", "description-input");
  });

  it("applies className", () => {
    render(<TextAreaLabel label="Description" textAreaId="description" className="custom-label" />);

    expect(screen.getByText("Description")).toHaveClass("custom-label");
  });

  it("renders ReactNode as label", () => {
    render(
      <TextAreaLabel
        label={<span data-testid="custom-label">Custom Label</span>}
        textAreaId="description"
      />
    );

    expect(screen.getByTestId("custom-label")).toBeInTheDocument();
  });
});
