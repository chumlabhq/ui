import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input, InputLabel } from "../index";

describe("Input", () => {
  describe("Rendering", () => {
    it("renders basic input with placeholder", () => {
      render(<Input placeholder="Enter text" />);

      expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    });

    it("renders with label", () => {
      render(<Input label="Email" />);

      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("renders required indicator when required", () => {
      render(<Input label="Email" required />);

      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("associates label with input via htmlFor", () => {
      render(<Input label="Email" id="email-input" />);

      const label = screen.getByText("Email");
      expect(label).toHaveAttribute("for", "email-input");
    });

    it("generates id from name when id not provided", () => {
      render(<Input label="Email" name="user-email" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "user-email");
    });

    it("applies fullWidth class when fullWidth=true", () => {
      render(<Input fullWidth containerClassName="test-container" />);

      const container = document.querySelector(".test-container");
      expect(container).toHaveClass("w-full");
    });
  });

  describe("Input Types", () => {
    it("renders text input by default", () => {
      render(<Input />);

      expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
    });

    it("renders email input when type=email", () => {
      render(<Input type="email" />);

      expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
    });

    it("renders password input when type=password", () => {
      render(<Input type="password" />);

      // Password inputs don't have textbox role
      const input = document.querySelector("input");
      expect(input).toHaveAttribute("type", "password");
    });
  });

  describe("Controlled Input", () => {
    it("accepts value prop", () => {
      render(<Input value="test value" onChange={() => {}} />);

      expect(screen.getByRole("textbox")).toHaveValue("test value");
    });

    it("calls onChange when user types", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<Input onChange={onChange} />);

      await user.type(screen.getByRole("textbox"), "hello");

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("Disabled State", () => {
    it("disables input when disabled=true", () => {
      render(<Input disabled />);

      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("disables input when isLoading=true", () => {
      render(<Input isLoading />);

      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("sets data-disabled attribute when disabled", () => {
      render(<Input disabled containerClassName="test-container" />);

      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-disabled", "true");
    });

    it("sets data-loading attribute when loading", () => {
      render(<Input isLoading containerClassName="test-container" />);

      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-loading", "true");
    });
  });

  describe("Error State", () => {
    it("sets aria-invalid when error=true", () => {
      render(<Input error />);

      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("renders error message when error and errorMessage provided", () => {
      render(<Input error errorMessage="Invalid input" />);

      expect(screen.getByRole("alert")).toHaveTextContent("Invalid input");
    });

    it("does not render error message when error=false", () => {
      render(<Input error={false} errorMessage="Invalid input" />);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("sets aria-describedby to error element", () => {
      render(<Input id="test-input" error errorMessage="Invalid" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "test-input-error");
    });

    it("sets data-error attribute when error=true", () => {
      render(<Input error containerClassName="test-container" />);

      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-error", "true");
    });
  });

  describe("Icons", () => {
    it("renders leading icon", () => {
      render(<Input leadingIcon={<span data-testid="leading">L</span>} />);

      expect(screen.getByTestId("leading")).toBeInTheDocument();
    });

    it("renders trailing icon", () => {
      render(<Input trailingIcon={<span data-testid="trailing">T</span>} />);

      expect(screen.getByTestId("trailing")).toBeInTheDocument();
    });

    it("renders both icons simultaneously", () => {
      render(
        <Input
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
        <Input
          leadingIcon={<span>L</span>}
          onLeadingIconClick={onClick}
          leadingIconLabel="Search"
        />
      );

      await user.click(screen.getByRole("button", { name: "Search" }));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("calls onTrailingIconClick when trailing icon clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Input
          trailingIcon={<span>T</span>}
          onTrailingIconClick={onClick}
          trailingIconLabel="Clear"
        />
      );

      await user.click(screen.getByRole("button", { name: "Clear" }));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not render button role when no onClick handler", () => {
      render(<Input leadingIcon={<span>L</span>} />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("applies cursor-pointer class when icon is clickable", () => {
      render(
        <Input
          leadingIcon={<span data-testid="icon">L</span>}
          onLeadingIconClick={() => {}}
          leadingIconLabel="Search"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("cursor-pointer");
    });
  });

  describe("Loading State", () => {
    it("renders loader when isLoading=true", () => {
      render(<Input isLoading />);

      // CircularLoader has aria-hidden but is in the DOM
      const loader = document.querySelector('[aria-hidden="true"]');
      expect(loader).toBeInTheDocument();
    });

    it("renders custom loader when provided", () => {
      render(<Input isLoading loader={<span data-testid="custom-loader">Loading...</span>} />);

      expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
    });

    it("does not render loader when isLoading=false", () => {
      render(<Input isLoading={false} />);

      const loader = document.querySelector('[aria-hidden="true"]');
      expect(loader).not.toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("allows tabbing to input", async () => {
      const user = userEvent.setup();

      render(<Input placeholder="Tab target" />);

      await user.tab();

      expect(screen.getByPlaceholderText("Tab target")).toHaveFocus();
    });

    it("allows tabbing to clickable leading icon", async () => {
      const user = userEvent.setup();

      render(
        <Input
          leadingIcon={<span>L</span>}
          onLeadingIconClick={() => {}}
          leadingIconLabel="Search"
        />
      );

      await user.tab();

      expect(screen.getByRole("button", { name: "Search" })).toHaveFocus();
    });

    it("allows tabbing to clickable trailing icon", async () => {
      const user = userEvent.setup();

      render(
        <Input
          trailingIcon={<span>T</span>}
          onTrailingIconClick={() => {}}
          trailingIconLabel="Clear"
        />
      );

      await user.tab(); // Focus input first
      await user.tab(); // Focus trailing icon

      expect(screen.getByRole("button", { name: "Clear" })).toHaveFocus();
    });

    it("activates leading icon with Enter key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Input
          leadingIcon={<span>L</span>}
          onLeadingIconClick={onClick}
          leadingIconLabel="Search"
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
        <Input
          leadingIcon={<span>L</span>}
          onLeadingIconClick={onClick}
          leadingIconLabel="Search"
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
        <Input
          trailingIcon={<span>T</span>}
          onTrailingIconClick={onClick}
          trailingIconLabel="Clear"
        />
      );

      await user.tab(); // Focus input
      await user.tab(); // Focus trailing icon
      await user.keyboard("{Enter}");

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("activates trailing icon with Space key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Input
          trailingIcon={<span>T</span>}
          onTrailingIconClick={onClick}
          trailingIconLabel="Clear"
        />
      );

      await user.tab(); // Focus input
      await user.tab(); // Focus trailing icon
      await user.keyboard(" ");

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not activate non-clickable icon on keyboard", async () => {
      const user = userEvent.setup();

      render(<Input leadingIcon={<span>L</span>} placeholder="input" />);

      // Non-clickable icon should not be focusable
      await user.tab();
      expect(screen.getByPlaceholderText("input")).toHaveFocus();
    });
  });

  describe("Accessibility", () => {
    it("sets aria-required when required", () => {
      render(<Input required />);

      expect(screen.getByRole("textbox")).toHaveAttribute("aria-required", "true");
    });

    it("hides required asterisk from screen readers", () => {
      render(<Input label="Email" required />);

      const asterisk = screen.getByText("*");
      expect(asterisk).toHaveAttribute("aria-hidden", "true");
    });

    it("provides accessible name via label", () => {
      render(<Input label="Username" id="username" />);

      expect(screen.getByRole("textbox")).toHaveAccessibleName("Username");
    });

    it("icon buttons have accessible labels", () => {
      render(
        <Input
          leadingIcon={<span>🔍</span>}
          onLeadingIconClick={() => {}}
          leadingIconLabel="Search"
          trailingIcon={<span>✕</span>}
          onTrailingIconClick={() => {}}
          trailingIconLabel="Clear input"
        />
      );

      expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Clear input" })).toBeInTheDocument();
    });
  });

  describe("Native Input Events", () => {
    it("calls onBlur when input loses focus", async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();

      render(<Input onBlur={onBlur} />);

      await user.click(screen.getByRole("textbox"));
      await user.tab();

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it("calls onFocus when input gains focus", async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();

      render(<Input onFocus={onFocus} />);

      await user.click(screen.getByRole("textbox"));

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it("calls onKeyDown on key press", async () => {
      const user = userEvent.setup();
      const onKeyDown = vi.fn();

      render(<Input onKeyDown={onKeyDown} />);

      await user.type(screen.getByRole("textbox"), "a");

      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = vi.fn();
      render(<Input ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });

    it("ref provides access to input methods", () => {
      let inputRef: HTMLInputElement | null = null;

      render(
        <Input
          ref={(el) => {
            inputRef = el;
          }}
          defaultValue="test"
        />
      );

      expect(inputRef).not.toBeNull();
      expect(inputRef!.value).toBe("test");
    });
  });

  describe("Custom Styling", () => {
    it("applies containerClassName to container", () => {
      render(<Input containerClassName="custom-container" />);

      expect(document.querySelector(".custom-container")).toBeInTheDocument();
    });

    it("applies wrapperClassName to wrapper", () => {
      render(<Input wrapperClassName="custom-wrapper" />);

      expect(document.querySelector(".custom-wrapper")).toBeInTheDocument();
    });

    it("applies className to input", () => {
      render(<Input className="custom-input" />);

      expect(screen.getByRole("textbox")).toHaveClass("custom-input");
    });

    it("applies labelClassName to label", () => {
      render(<Input label="Email" labelClassName="custom-label" />);

      expect(screen.getByText("Email")).toHaveClass("custom-label");
    });

    it("applies errorClassName to error message", () => {
      render(<Input error errorMessage="Error" errorClassName="custom-error" />);

      expect(screen.getByRole("alert")).toHaveClass("custom-error");
    });

    it("applies wrapperFocusClassName to wrapper", () => {
      render(<Input wrapperFocusClassName="custom-focus" />);

      expect(document.querySelector(".custom-focus")).toBeInTheDocument();
    });
  });
});

describe("InputLabel", () => {
  it("renders label text", () => {
    render(<InputLabel label="Email" inputId="email" />);

    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders required indicator", () => {
    render(<InputLabel label="Email" inputId="email" required />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("associates with input via htmlFor", () => {
    render(<InputLabel label="Email" inputId="email-input" />);

    expect(screen.getByText("Email")).toHaveAttribute("for", "email-input");
  });

  it("applies className", () => {
    render(<InputLabel label="Email" inputId="email" className="custom-label" />);

    expect(screen.getByText("Email")).toHaveClass("custom-label");
  });

  it("renders ReactNode as label", () => {
    render(
      <InputLabel
        label={<span data-testid="custom-label">Custom Label</span>}
        inputId="email"
      />
    );

    expect(screen.getByTestId("custom-label")).toBeInTheDocument();
  });
});
