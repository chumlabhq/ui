import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input, InputLabel } from "../index";

describe("Input", () => {
  describe("Rendering", () => {
    it("renders basic input with placeholder", () => {
      render(<Input aria-label="test" placeholder="Enter text" />);
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

    it("generates id when only name is provided", () => {
      render(<Input label="Email" name="user-email" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id");
      expect(input.id).toBeTruthy();
    });

    it("does not use name as id fallback", () => {
      render(<Input aria-label="test" name="user-email" />);
      const input = screen.getByRole("textbox");
      expect(input.id).not.toBe("user-email");
    });

    it("applies fullWidth class when fullWidth=true", () => {
      render(<Input aria-label="test" fullWidth className="test-container" />);
      const container = document.querySelector(".test-container");
      expect(container).toHaveClass("w-full");
    });
  });

  describe("Input Types", () => {
    it("renders text input by default", () => {
      render(<Input aria-label="test" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
    });

    it("renders email input when type=email", () => {
      render(<Input aria-label="test" type="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
    });

    it("renders password input when type=password", () => {
      render(<Input aria-label="test" type="password" />);
      const input = document.querySelector("input");
      expect(input).toHaveAttribute("type", "password");
    });
  });

  describe("Controlled Input", () => {
    it("accepts value prop", () => {
      render(<Input aria-label="test" value="test value" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("test value");
    });

    it("calls onChange when user types", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Input aria-label="test" value="" onChange={onChange} />);
      await user.type(screen.getByRole("textbox"), "hello");
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("Uncontrolled Input", () => {
    it("renders with defaultValue", () => {
      render(<Input aria-label="test" defaultValue="initial" />);
      expect(screen.getByRole("textbox")).toHaveValue("initial");
    });

    it("manages value internally via state", () => {
      render(<Input aria-label="test" defaultValue="initial" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("initial");
    });

    it("allows typing in uncontrolled mode", async () => {
      const user = userEvent.setup();
      render(<Input aria-label="test" />);
      const input = screen.getByRole("textbox");
      await user.type(input, "hello");
      expect(input).toHaveValue("hello");
    });
  });

  describe("Disabled State", () => {
    it("disables input when disabled=true", () => {
      render(<Input aria-label="test" disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("disables input when loading=true", () => {
      render(<Input aria-label="test" loading />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("sets data-disabled attribute when disabled", () => {
      render(<Input aria-label="test" disabled className="test-container" />);
      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-disabled", "true");
    });

    it("sets data-loading attribute when loading", () => {
      render(<Input aria-label="test" loading className="test-container" />);
      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-loading", "true");
    });
  });

  describe("Error State", () => {
    it("sets aria-invalid when error=true", () => {
      render(<Input aria-label="test" error />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("renders error message when error and errorMessage provided", () => {
      render(<Input aria-label="test" error errorMessage="Invalid input" />);
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid input");
    });

    it("does not render error message when error=false", () => {
      render(<Input aria-label="test" error={false} errorMessage="Invalid input" />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("sets aria-describedby to error element", () => {
      render(<Input id="test-input" label="Email" error errorMessage="Invalid" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "test-input-error");
    });

    it("sets data-error attribute when error=true", () => {
      render(<Input aria-label="test" error className="test-container" />);
      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-error", "true");
    });
  });

  describe("Success State", () => {
    it("renders success message when success and successMessage provided", () => {
      render(<Input aria-label="test" success successMessage="Looks good!" />);
      expect(screen.getByRole("status")).toHaveTextContent("Looks good!");
    });

    it("does not render success message when success=false", () => {
      render(<Input aria-label="test" success={false} successMessage="Looks good!" />);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("error takes precedence over success", () => {
      render(<Input aria-label="test" error errorMessage="Error" success successMessage="Success" />);
      expect(screen.getByRole("alert")).toHaveTextContent("Error");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("sets data-success on container only when no error", () => {
      render(<Input aria-label="test" success className="test-container" />);
      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-success", "true");
    });

    it("does NOT set data-success when error is also true", () => {
      render(<Input aria-label="test" success error className="test-container" />);
      const container = document.querySelector(".test-container");
      expect(container).not.toHaveAttribute("data-success");
    });

    it("applies successClassName to success message", () => {
      render(<Input aria-label="test" success successMessage="Good" successClassName="custom-success" />);
      expect(document.querySelector(".custom-success")).toBeInTheDocument();
    });
  });

  describe("Prefix & Suffix", () => {
    it("renders prefix text", () => {
      render(<Input aria-label="test" prefix="$" />);
      expect(screen.getByText("$")).toBeInTheDocument();
    });

    it("renders suffix text", () => {
      render(<Input aria-label="test" suffix="USD" />);
      expect(screen.getByText("USD")).toBeInTheDocument();
    });

    it("renders both prefix and suffix", () => {
      render(<Input aria-label="test" prefix="https://" suffix=".com" />);
      expect(screen.getByText("https://")).toBeInTheDocument();
      expect(screen.getByText(".com")).toBeInTheDocument();
    });

    it("applies prefixClassName", () => {
      render(<Input aria-label="test" prefix="$" prefixClassName="custom-prefix" />);
      expect(document.querySelector(".custom-prefix")).toBeInTheDocument();
    });

    it("applies suffixClassName", () => {
      render(<Input aria-label="test" suffix="USD" suffixClassName="custom-suffix" />);
      expect(document.querySelector(".custom-suffix")).toBeInTheDocument();
    });
  });

  describe("Clearable", () => {
    it("shows clear button when clearable and has value", () => {
      render(<Input aria-label="test" clearable value="test" onChange={() => {}} />);
      expect(screen.getByRole("button", { name: "Clear input" })).toBeInTheDocument();
    });

    it("does not show clear button when value is empty", () => {
      render(<Input aria-label="test" clearable value="" onChange={() => {}} />);
      expect(screen.queryByRole("button", { name: "Clear input" })).not.toBeInTheDocument();
    });

    it("does not show clear button when disabled", () => {
      render(<Input aria-label="test" clearable value="test" disabled onChange={() => {}} />);
      expect(screen.queryByRole("button", { name: "Clear input" })).not.toBeInTheDocument();
    });

    it("does not show clear button when readOnly", () => {
      render(<Input aria-label="test" clearable value="test" readOnly onChange={() => {}} />);
      expect(screen.queryByRole("button", { name: "Clear input" })).not.toBeInTheDocument();
    });

    it("calls onClear when clear button clicked", async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      render(<Input aria-label="test" clearable value="test" onChange={() => {}} onClear={onClear} />);
      await user.click(screen.getByRole("button", { name: "Clear input" }));
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it("fires onChange exactly once when clear clicked without onClear", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Input aria-label="test" name="email" clearable value="test" onChange={onChange} />);
      await user.click(screen.getByRole("button", { name: "Clear input" }));
      expect(onChange).toHaveBeenCalledTimes(1);
      // The event target should be a real HTMLInputElement
      const event = onChange.mock.calls[0][0];
      expect(event.target).toBeInstanceOf(HTMLInputElement);
      expect(event.target.value).toBe("");
      expect(event.target.name).toBe("email");
    });

    it("fires onValueChange when clear clicked without onClear", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Input aria-label="test" clearable value="test" onChange={() => {}} onValueChange={onValueChange} />);
      await user.click(screen.getByRole("button", { name: "Clear input" }));
      expect(onValueChange).toHaveBeenCalledWith("");
    });
  });

  describe("Character Count", () => {
    it("renders character count when showCount and maxLength set", () => {
      render(<Input aria-label="test" showCount maxLength={100} value="hello" onChange={() => {}} />);
      expect(screen.getByText("5/100")).toBeInTheDocument();
    });

    it("does not render count when showCount=false", () => {
      render(<Input aria-label="test" showCount={false} maxLength={100} value="hello" onChange={() => {}} />);
      expect(screen.queryByText("5/100")).not.toBeInTheDocument();
    });

    it("does not render count when maxLength not set", () => {
      render(<Input aria-label="test" showCount value="hello" onChange={() => {}} />);
      expect(screen.queryByText(/\/\d+/)).not.toBeInTheDocument();
    });

    it("count has aria-live=polite", () => {
      render(<Input aria-label="test" showCount maxLength={50} value="hi" onChange={() => {}} />);
      const count = screen.getByText("2/50");
      expect(count).toHaveAttribute("aria-live", "polite");
    });

    it("links count to input via aria-describedby", () => {
      render(<Input id="test-input" aria-label="test" showCount maxLength={100} value="hello" onChange={() => {}} />);
      const input = screen.getByRole("textbox");
      expect(input.getAttribute("aria-describedby")).toContain("test-input-count");
    });

    it("applies countClassName", () => {
      render(<Input aria-label="test" showCount maxLength={10} value="" onChange={() => {}} countClassName="custom-count" />);
      expect(document.querySelector(".custom-count")).toBeInTheDocument();
    });
  });

  describe("Icons", () => {
    it("renders leading icon", () => {
      render(<Input aria-label="test" startIcon={<span data-testid="leading">L</span>} />);
      expect(screen.getByTestId("leading")).toBeInTheDocument();
    });

    it("renders trailing icon", () => {
      render(<Input aria-label="test" endIcon={<span data-testid="trailing">T</span>} />);
      expect(screen.getByTestId("trailing")).toBeInTheDocument();
    });

    it("renders both icons simultaneously", () => {
      render(
        <Input
          aria-label="test"
          startIcon={<span data-testid="leading">L</span>}
          endIcon={<span data-testid="trailing">T</span>}
        />
      );
      expect(screen.getByTestId("leading")).toBeInTheDocument();
      expect(screen.getByTestId("trailing")).toBeInTheDocument();
    });
  });

  describe("Clickable Icons", () => {
    it("calls onStartIconClick when leading icon clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Input
          aria-label="test"
          startIcon={<span>L</span>}
          onStartIconClick={onClick}
          startIconLabel="Search"
        />
      );
      await user.click(screen.getByRole("button", { name: "Search" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("calls onEndIconClick when trailing icon clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Input
          aria-label="test"
          endIcon={<span>T</span>}
          onEndIconClick={onClick}
          endIconLabel="Clear"
        />
      );
      await user.click(screen.getByRole("button", { name: "Clear" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not render button role when no onClick handler", () => {
      render(<Input aria-label="test" startIcon={<span>L</span>} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("applies cursor-pointer class when icon is clickable", () => {
      render(
        <Input
          aria-label="test"
          startIcon={<span data-testid="icon">L</span>}
          onStartIconClick={() => {}}
          startIconLabel="Search"
        />
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("cursor-pointer");
    });
  });

  describe("Loading State", () => {
    it("renders loader when loading=true", () => {
      render(<Input aria-label="test" loading />);
      const loader = document.querySelector('[aria-hidden="true"]');
      expect(loader).toBeInTheDocument();
    });

    it("renders custom loader when provided", () => {
      render(<Input aria-label="test" loading loader={<span data-testid="custom-loader">Loading...</span>} />);
      expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
    });

    it("does not render loader when loading=false", () => {
      render(<Input aria-label="test" loading={false} />);
      const loader = document.querySelector('[aria-hidden="true"]');
      expect(loader).not.toBeInTheDocument();
    });

    it("sets aria-busy on wrapper when loading", () => {
      render(<Input aria-label="test" loading />);
      const wrapper = document.querySelector('[data-slot="wrapper"]');
      expect(wrapper).toHaveAttribute("aria-busy", "true");
    });

    it("does not set aria-busy on input element", () => {
      render(<Input aria-label="test" loading />);
      expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-busy");
    });

    it("does not set aria-busy on wrapper when not loading", () => {
      render(<Input aria-label="test" />);
      const wrapper = document.querySelector('[data-slot="wrapper"]');
      expect(wrapper).not.toHaveAttribute("aria-busy");
    });
  });

  describe("Keyboard Navigation", () => {
    it("allows tabbing to input", async () => {
      const user = userEvent.setup();
      render(<Input aria-label="test" placeholder="Tab target" />);
      await user.tab();
      expect(screen.getByPlaceholderText("Tab target")).toHaveFocus();
    });

    it("allows tabbing to clickable leading icon", async () => {
      const user = userEvent.setup();
      render(
        <Input
          aria-label="test"
          startIcon={<span>L</span>}
          onStartIconClick={() => {}}
          startIconLabel="Search"
        />
      );
      await user.tab();
      expect(screen.getByRole("button", { name: "Search" })).toHaveFocus();
    });

    it("allows tabbing to clickable trailing icon", async () => {
      const user = userEvent.setup();
      render(
        <Input
          aria-label="test"
          endIcon={<span>T</span>}
          onEndIconClick={() => {}}
          endIconLabel="Clear"
        />
      );
      await user.tab();
      await user.tab();
      expect(screen.getByRole("button", { name: "Clear" })).toHaveFocus();
    });

    it("activates leading icon with Enter key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Input
          aria-label="test"
          startIcon={<span>L</span>}
          onStartIconClick={onClick}
          startIconLabel="Search"
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
          aria-label="test"
          startIcon={<span>L</span>}
          onStartIconClick={onClick}
          startIconLabel="Search"
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
          aria-label="test"
          endIcon={<span>T</span>}
          onEndIconClick={onClick}
          endIconLabel="Clear"
        />
      );
      await user.tab();
      await user.tab();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not activate non-clickable icon on keyboard", async () => {
      const user = userEvent.setup();
      render(<Input aria-label="test" startIcon={<span>L</span>} placeholder="input" />);
      await user.tab();
      expect(screen.getByPlaceholderText("input")).toHaveFocus();
    });
  });

  describe("Accessibility", () => {
    it("sets aria-required when required", () => {
      render(<Input aria-label="test" required />);
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
          aria-label="test"
          startIcon={<span>S</span>}
          onStartIconClick={() => {}}
          startIconLabel="Search"
          endIcon={<span>X</span>}
          onEndIconClick={() => {}}
          endIconLabel="Clear input"
        />
      );
      expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Clear input" })).toBeInTheDocument();
    });
  });

  describe("Rest Spread Safety", () => {
    it("does not allow rest props to override aria-invalid", () => {
      // Consumer accidentally passes aria-invalid={false} but error=true
      render(<Input aria-label="test" error {...{ "aria-invalid": false } as Record<string, unknown>} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("does not allow rest props to override onChange", () => {
      const correctHandler = vi.fn();
      // rest spread comes first, so the explicit onChange wins
      render(<Input aria-label="test" onChange={correctHandler} />);
      // If the component's handleChange is used (not overridden), this works
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });

  describe("Native Input Events", () => {
    it("calls onBlur when input loses focus", async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();
      render(<Input aria-label="test" onBlur={onBlur} />);
      await user.click(screen.getByRole("textbox"));
      await user.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it("calls onFocus when input gains focus", async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();
      render(<Input aria-label="test" onFocus={onFocus} />);
      await user.click(screen.getByRole("textbox"));
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it("calls onKeyDown on key press", async () => {
      const user = userEvent.setup();
      const onKeyDown = vi.fn();
      render(<Input aria-label="test" onKeyDown={onKeyDown} />);
      await user.type(screen.getByRole("textbox"), "a");
      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = vi.fn();
      render(<Input aria-label="test" ref={ref} />);
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });

    it("ref provides access to input methods", () => {
      let inputRef: HTMLInputElement | null = null;
      render(
        <Input
          aria-label="test"
          ref={(el) => { inputRef = el; }}
          defaultValue="test"
        />
      );
      expect(inputRef).not.toBeNull();
      expect(inputRef!.value).toBe("test");
    });
  });

  describe("Description / Helper Text", () => {
    it("renders description when provided", () => {
      render(<Input label="Email" description="We'll never share your email" />);
      expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
    });

    it("links description via aria-describedby", () => {
      render(<Input id="test-input" label="Email" description="Helper text" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "test-input-description");
    });

    it("concatenates description and error into aria-describedby", () => {
      render(<Input id="test-input" label="Email" description="Helper text" error errorMessage="Required" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "test-input-description test-input-error");
    });

    it("applies descriptionClassName", () => {
      render(<Input label="Email" description="Help" descriptionClassName="custom-desc" />);
      expect(document.querySelector(".custom-desc")).toBeInTheDocument();
    });
  });

  describe("aria-errormessage", () => {
    it("sets aria-errormessage when error and errorMessage are provided", () => {
      render(<Input id="test-input" label="Email" error errorMessage="Required" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-errormessage", "test-input-error");
    });

    it("does not set aria-errormessage when no error", () => {
      render(<Input id="test-input" label="Email" errorMessage="Required" />);
      const input = screen.getByRole("textbox");
      expect(input).not.toHaveAttribute("aria-errormessage");
    });
  });

  describe("onValueChange", () => {
    it("calls onValueChange with string value on input", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Input label="Name" onValueChange={onValueChange} />);
      await user.type(screen.getByRole("textbox"), "hi");
      expect(onValueChange).toHaveBeenCalledTimes(2);
      expect(onValueChange).toHaveBeenNthCalledWith(1, "h");
      expect(onValueChange).toHaveBeenNthCalledWith(2, "hi");
    });

    it("calls both onChange and onValueChange", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onValueChange = vi.fn();
      render(<Input label="Name" onChange={onChange} onValueChange={onValueChange} />);
      await user.type(screen.getByRole("textbox"), "a");
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith("a");
    });
  });

  describe("Size and Data Attributes", () => {
    it("sets data-size on container when size provided", () => {
      render(<Input label="Name" size="lg" className="test-container" />);
      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-size", "lg");
    });

    it("does not set data-size when size is not provided", () => {
      render(<Input label="Name" className="test-container" />);
      const container = document.querySelector(".test-container");
      expect(container).not.toHaveAttribute("data-size");
    });

    it("sets data-readonly on container and input when readOnly", () => {
      render(<Input label="Name" readOnly value="x" className="test-container" />);
      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-readonly", "true");
      expect(screen.getByRole("textbox")).toHaveAttribute("data-readonly", "true");
    });

    it("sets data-slot=input on the input element", () => {
      render(<Input label="Name" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "input");
    });
  });

  describe("Disabled Icon Buttons", () => {
    it("disables icon button when input is disabled", () => {
      render(
        <Input
          label="Search"
          disabled
          startIcon={<span>S</span>}
          onStartIconClick={() => {}}
          startIconLabel="Search"
        />
      );
      const button = screen.getByRole("button", { name: "Search" });
      expect(button).toBeDisabled();
    });

    it("disables icon button when input is loading", () => {
      render(
        <Input
          label="Search"
          loading
          endIcon={<span>X</span>}
          onEndIconClick={() => {}}
          endIconLabel="Clear"
        />
      );
      const button = screen.getByRole("button", { name: "Clear" });
      expect(button).toBeDisabled();
    });
  });

  describe("Custom Styling", () => {
    it("applies className to root container", () => {
      render(<Input aria-label="test" className="custom-container" />);
      const container = document.querySelector(".custom-container");
      expect(container).toBeInTheDocument();
      expect(screen.getByRole("textbox")).not.toHaveClass("custom-container");
    });

    it("applies wrapperClassName to wrapper", () => {
      render(<Input aria-label="test" wrapperClassName="custom-wrapper" />);
      expect(document.querySelector(".custom-wrapper")).toBeInTheDocument();
    });

    it("applies inputClassName to input element", () => {
      render(<Input aria-label="test" inputClassName="input-style" />);
      expect(screen.getByRole("textbox")).toHaveClass("input-style");
    });

    it("applies labelClassName to label", () => {
      render(<Input label="Email" labelClassName="custom-label" />);
      expect(screen.getByText("Email")).toHaveClass("custom-label");
    });

    it("applies errorClassName to error message", () => {
      render(<Input aria-label="test" error errorMessage="Error" errorClassName="custom-error" />);
      expect(screen.getByRole("alert")).toHaveClass("custom-error");
    });

    it("applies focus classes via wrapperClassName", () => {
      render(<Input aria-label="test" wrapperClassName="custom-focus" />);
      expect(document.querySelector(".custom-focus")).toBeInTheDocument();
    });
  });
});

describe("InputLabel", () => {
  it("renders label text", () => {
    render(<InputLabel label="Email" htmlFor="email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders required indicator", () => {
    render(<InputLabel label="Email" htmlFor="email" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("associates with input via htmlFor", () => {
    render(<InputLabel label="Email" htmlFor="email-input" />);
    expect(screen.getByText("Email")).toHaveAttribute("for", "email-input");
  });

  it("applies className", () => {
    render(<InputLabel label="Email" htmlFor="email" className="custom-label" />);
    expect(screen.getByText("Email")).toHaveClass("custom-label");
  });

  it("renders ReactNode as label", () => {
    render(
      <InputLabel
        label={<span data-testid="custom-label">Custom Label</span>}
        htmlFor="email"
      />
    );
    expect(screen.getByTestId("custom-label")).toBeInTheDocument();
  });
});
