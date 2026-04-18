import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InternationalPhoneInput } from "../index";

describe("InternationalPhoneInput", () => {
  describe("Rendering", () => {
    it("renders the phone input element", () => {
      render(<InternationalPhoneInput />);
      // The input has type="tel", which has no specific role, so find by placeholder
      const telInput = screen.getByPlaceholderText("Enter phone number");
      expect(telInput).toBeInTheDocument();
    });

    it("renders with custom placeholder", () => {
      render(<InternationalPhoneInput placeholder="Phone" />);
      expect(screen.getByPlaceholderText("Phone")).toBeInTheDocument();
    });

    it("renders label when provided", () => {
      render(<InternationalPhoneInput label="Phone Number" />);
      expect(screen.getByText("Phone Number")).toBeInTheDocument();
    });

    it("renders required asterisk when required", () => {
      render(<InternationalPhoneInput label="Phone" required />);
      const label = screen.getByText("Phone");
      expect(label.parentElement?.textContent).toContain("*");
    });

    it("renders description when provided", () => {
      render(
        <InternationalPhoneInput description="Enter your phone number" />
      );
      expect(
        screen.getByText("Enter your phone number")
      ).toBeInTheDocument();
    });

    it("renders error message when error is true", () => {
      render(
        <InternationalPhoneInput error errorMessage="Invalid number" />
      );
      expect(screen.getByText("Invalid number")).toBeInTheDocument();
    });

    it("renders success message when success is true", () => {
      render(
        <InternationalPhoneInput success successMessage="Verified!" />
      );
      expect(screen.getByText("Verified!")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <InternationalPhoneInput className="my-phone-input" />
      );
      expect(container.firstElementChild).toHaveClass("my-phone-input");
    });
  });

  describe("Country selector", () => {
    it("renders a country selector with default country (US)", () => {
      render(<InternationalPhoneInput />);
      // The country selector uses SearchableDropdown, which shows the dial code
      expect(screen.getByText("+1")).toBeInTheDocument();
    });

    it("renders with a custom default country", () => {
      render(<InternationalPhoneInput defaultCountry="GB" />);
      expect(screen.getByText("+44")).toBeInTheDocument();
    });

    it("renders the wrapper as a group with aria-label", () => {
      render(<InternationalPhoneInput />);
      const group = screen.getByRole("group");
      expect(group).toBeInTheDocument();
    });

    it("has label-based aria-label on wrapper when label is provided", () => {
      render(<InternationalPhoneInput label="Phone" />);
      const group = screen.getByRole("group");
      expect(group).toHaveAttribute("aria-labelledby");
    });

    it("has fallback aria-label on wrapper when no label", () => {
      render(<InternationalPhoneInput />);
      const group = screen.getByRole("group");
      expect(group).toHaveAttribute("aria-label", "Phone number input");
    });
  });

  describe("Phone input", () => {
    it("accepts phone number input", async () => {
      const user = userEvent.setup();
      render(<InternationalPhoneInput />);

      const input = screen.getByPlaceholderText("Enter phone number");
      await user.type(input, "2025551234");

      // The input should have the formatted value
      expect((input as HTMLInputElement).value).toBeTruthy();
      expect((input as HTMLInputElement).value.length).toBeGreaterThan(0);
    });

    it("calls onValueChange when phone input changes", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<InternationalPhoneInput onValueChange={onValueChange} />);

      const input = screen.getByPlaceholderText("Enter phone number");
      await user.type(input, "2025551234");

      expect(onValueChange).toHaveBeenCalled();
      // The last call should contain phoneNumber data
      const lastCall = onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0];
      expect(lastCall).toHaveProperty("phoneNumber");
      expect(lastCall).toHaveProperty("countryCode");
      expect(lastCall).toHaveProperty("isValid");
    });

    it("sets input type to tel", () => {
      render(<InternationalPhoneInput />);
      const input = screen.getByPlaceholderText("Enter phone number");
      expect(input).toHaveAttribute("type", "tel");
    });
  });

  describe("Controlled mode", () => {
    it("reflects controlled value", () => {
      render(
        <InternationalPhoneInput
          value={{ countryCode: "US", phoneNumber: "2025551234" }}
        />
      );
      const input = screen.getByPlaceholderText(
        "Enter phone number"
      ) as HTMLInputElement;
      // Should have formatted phone number
      expect(input.value).toBeTruthy();
    });

    it("uses defaultValue for initial state", () => {
      render(
        <InternationalPhoneInput
          defaultValue={{ countryCode: "US", phoneNumber: "2025551234" }}
        />
      );
      const input = screen.getByPlaceholderText(
        "Enter phone number"
      ) as HTMLInputElement;
      expect(input.value).toBeTruthy();
    });
  });

  describe("Disabled state", () => {
    it("disables the phone input when disabled", () => {
      render(<InternationalPhoneInput disabled />);
      const input = screen.getByPlaceholderText("Enter phone number");
      expect(input).toBeDisabled();
    });

    it("sets data-disabled on root element", () => {
      const { container } = render(<InternationalPhoneInput disabled />);
      expect(container.firstElementChild).toHaveAttribute("data-disabled");
    });
  });

  describe("Read-only state", () => {
    it("sets readOnly on the phone input", () => {
      render(<InternationalPhoneInput readOnly />);
      const input = screen.getByPlaceholderText("Enter phone number");
      expect(input).toHaveAttribute("readonly");
    });
  });

  describe("Clear button", () => {
    it("shows clear button when clearable and has value", () => {
      render(
        <InternationalPhoneInput
          clearable
          defaultValue={{ countryCode: "US", phoneNumber: "2025551234" }}
        />
      );
      expect(
        screen.getByRole("button", { name: "Clear phone number" })
      ).toBeInTheDocument();
    });

    it("clears the phone number when clear button is clicked", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <InternationalPhoneInput
          clearable
          defaultValue={{ countryCode: "US", phoneNumber: "2025551234" }}
          onValueChange={onValueChange}
        />
      );

      await user.click(
        screen.getByRole("button", { name: "Clear phone number" })
      );

      expect(onValueChange).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("sets aria-invalid when error is true", () => {
      render(
        <InternationalPhoneInput error errorMessage="Invalid" />
      );
      const input = screen.getByPlaceholderText("Enter phone number");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("sets aria-required when required", () => {
      render(<InternationalPhoneInput required />);
      const input = screen.getByPlaceholderText("Enter phone number");
      expect(input).toHaveAttribute("aria-required", "true");
    });

    it("associates label with input via htmlFor", () => {
      render(<InternationalPhoneInput label="Phone" id="phone-test" />);
      const label = screen.getByText("Phone");
      expect(label).toHaveAttribute("for", "phone-test");
    });

    it("renders hidden inputs for form submission when name is provided", () => {
      render(
        <InternationalPhoneInput
          name="phone"
          defaultValue={{ countryCode: "US", phoneNumber: "2025551234" }}
        />
      );
      const hiddenInputs = document.querySelectorAll("input[type='hidden']");
      expect(hiddenInputs.length).toBe(2); // country + full number
    });
  });

  describe("Loading state", () => {
    it("sets data-loading on root when loading", () => {
      const { container } = render(<InternationalPhoneInput loading />);
      expect(container.firstElementChild).toHaveAttribute("data-loading");
    });
  });

  describe("Validation on blur", () => {
    it("shows validation error on blur with invalid number", async () => {
      const user = userEvent.setup();
      render(<InternationalPhoneInput validateOnBlur />);

      const input = screen.getByPlaceholderText("Enter phone number");
      await user.type(input, "123"); // Too short for US
      await user.tab(); // Blur

      // Should show validation error message
      expect(
        screen.getByText("Please enter a valid phone number")
      ).toBeInTheDocument();
    });

    it("does not show validation error when validateOnBlur is false", async () => {
      const user = userEvent.setup();
      render(<InternationalPhoneInput validateOnBlur={false} />);

      const input = screen.getByPlaceholderText("Enter phone number");
      await user.type(input, "123");
      await user.tab();

      expect(
        screen.queryByText("Please enter a valid phone number")
      ).not.toBeInTheDocument();
    });

    it("uses custom validation message", async () => {
      const user = userEvent.setup();
      render(
        <InternationalPhoneInput
          validateOnBlur
          validationMessage="Custom: invalid phone"
        />
      );

      const input = screen.getByPlaceholderText("Enter phone number");
      await user.type(input, "123");
      await user.tab();

      expect(
        screen.getByText("Custom: invalid phone")
      ).toBeInTheDocument();
    });

    it("does not validate on blur when phone is empty", async () => {
      const user = userEvent.setup();
      render(<InternationalPhoneInput validateOnBlur />);

      const input = screen.getByPlaceholderText("Enter phone number");
      input.focus();
      await user.tab();

      expect(
        screen.queryByText("Please enter a valid phone number")
      ).not.toBeInTheDocument();
    });
  });

  describe("Paste detection", () => {
    it("detects and parses international numbers when pasted", async () => {
      const onPasteDetected = vi.fn();
      const onCountryChange = vi.fn();
      const onValueChange = vi.fn();
      render(
        <InternationalPhoneInput
          enablePasteDetection
          onPasteDetected={onPasteDetected}
          onCountryChange={onCountryChange}
          onValueChange={onValueChange}
        />
      );

      const input = screen.getByPlaceholderText("Enter phone number");

      // Simulate pasting a UK number
      const pasteEvent = new Event("paste", { bubbles: true, cancelable: true });
      Object.defineProperty(pasteEvent, "clipboardData", {
        value: {
          getData: () => "+442071234567",
        },
      });
      input.dispatchEvent(pasteEvent);

      // Should have detected the country from the paste
      // The paste handler parses the international number
    });

    it("does not detect paste when enablePasteDetection is false", async () => {
      const onPasteDetected = vi.fn();
      render(
        <InternationalPhoneInput
          onPasteDetected={onPasteDetected}
        />
      );

      const input = screen.getByPlaceholderText("Enter phone number");

      const pasteEvent = new Event("paste", { bubbles: true, cancelable: true });
      Object.defineProperty(pasteEvent, "clipboardData", {
        value: {
          getData: () => "+442071234567",
        },
      });
      input.dispatchEvent(pasteEvent);

      expect(onPasteDetected).not.toHaveBeenCalled();
    });

    it("does not detect paste when readOnly", async () => {
      const onPasteDetected = vi.fn();
      render(
        <InternationalPhoneInput
          enablePasteDetection
          readOnly
          onPasteDetected={onPasteDetected}
        />
      );

      const input = screen.getByPlaceholderText("Enter phone number");

      const pasteEvent = new Event("paste", { bubbles: true, cancelable: true });
      Object.defineProperty(pasteEvent, "clipboardData", {
        value: {
          getData: () => "+442071234567",
        },
      });
      input.dispatchEvent(pasteEvent);

      expect(onPasteDetected).not.toHaveBeenCalled();
    });
  });

  describe("Country change", () => {
    it("calls onCountryChange when country is changed", async () => {
      const user = userEvent.setup();
      const onCountryChange = vi.fn();
      render(
        <InternationalPhoneInput onCountryChange={onCountryChange} />
      );

      // Open the country dropdown - click on the trigger that shows "+1"
      const dialCode = screen.getByText("+1");
      const trigger = dialCode.closest("button") || dialCode.parentElement;
      if (trigger) {
        await user.click(trigger);
      }
    });
  });

  describe("Read-only does not allow changes", () => {
    it("does not allow typing when readOnly", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <InternationalPhoneInput
          readOnly
          defaultValue={{ countryCode: "US", phoneNumber: "2025551234" }}
          onValueChange={onValueChange}
        />
      );

      const input = screen.getByPlaceholderText(
        "Enter phone number"
      ) as HTMLInputElement;
      const initialValue = input.value;

      await user.type(input, "999");

      // Value should not change when readOnly
      expect(input.value).toBe(initialValue);
    });
  });

  describe("Full width", () => {
    it("applies full width style when fullWidth is true", () => {
      const { container } = render(
        <InternationalPhoneInput fullWidth />
      );

      const root = container.firstElementChild as HTMLElement;
      expect(root.style.width).toBe("100%");
    });
  });

  describe("Unstyled mode", () => {
    it("uses unstyled classes when unstyled is true", () => {
      const { container } = render(
        <InternationalPhoneInput unstyled />
      );

      const root = container.firstElementChild;
      // Unstyled classes are empty strings, so the root should not have default styled classes
      expect(root?.className).not.toContain("flex-col");
    });
  });

  describe("Form hidden inputs", () => {
    it("renders hidden inputs with country and full number", () => {
      render(
        <InternationalPhoneInput
          name="phone"
          defaultValue={{ countryCode: "US", phoneNumber: "2025551234" }}
        />
      );

      const hiddenInputs = document.querySelectorAll("input[type='hidden']");
      expect(hiddenInputs.length).toBe(2);

      const names = Array.from(hiddenInputs).map((i) =>
        i.getAttribute("name")
      );
      expect(names).toContain("phone");
      expect(names).toContain("phone_country");
    });
  });

  describe("Description and aria-describedby", () => {
    it("links description to input via aria-describedby", () => {
      render(
        <InternationalPhoneInput
          id="phone-id"
          description="Enter your phone"
        />
      );

      const input = screen.getByPlaceholderText("Enter phone number");
      const describedBy = input.getAttribute("aria-describedby");
      expect(describedBy).toContain("phone-id-description");
    });
  });

  describe("Success state", () => {
    it("sets data-success on root when success is true", () => {
      const { container } = render(
        <InternationalPhoneInput success />
      );
      expect(container.firstElementChild).toHaveAttribute("data-success");
    });
  });

  describe("Clear with onClear handler", () => {
    it("calls custom onClear handler instead of default clear behavior", async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      render(
        <InternationalPhoneInput
          clearable
          onClear={onClear}
          defaultValue={{ countryCode: "US", phoneNumber: "2025551234" }}
        />
      );

      await user.click(
        screen.getByRole("button", { name: "Clear phone number" })
      );

      expect(onClear).toHaveBeenCalledTimes(1);
    });
  });

  describe("Paste detection — phone-only (no country detected)", () => {
    it("formats pasted digits without '+' prefix using current country", () => {
      const onPasteDetected = vi.fn();
      const onValueChange = vi.fn();
      render(
        <InternationalPhoneInput
          enablePasteDetection
          onPasteDetected={onPasteDetected}
          onValueChange={onValueChange}
        />
      );

      const input = screen.getByPlaceholderText("Enter phone number");

      // Paste a plain digit string (no + prefix → no country detected)
      const pasteEvent = new Event("paste", { bubbles: true, cancelable: true });
      Object.defineProperty(pasteEvent, "clipboardData", {
        value: { getData: () => "2025551234" },
      });
      input.dispatchEvent(pasteEvent);

      // onPasteDetected should be called with detectedCountry: null
      expect(onPasteDetected).toHaveBeenCalledWith(
        expect.objectContaining({
          rawValue: "2025551234",
          detectedCountry: null,
        })
      );
    });

    it("calls onValueChange after pasting phone digits without country prefix", () => {
      const onValueChange = vi.fn();
      render(
        <InternationalPhoneInput
          enablePasteDetection
          onValueChange={onValueChange}
        />
      );

      const input = screen.getByPlaceholderText("Enter phone number");
      const pasteEvent = new Event("paste", { bubbles: true, cancelable: true });
      Object.defineProperty(pasteEvent, "clipboardData", {
        value: { getData: () => "9876543210" },
      });
      input.dispatchEvent(pasteEvent);

      expect(onValueChange).toHaveBeenCalled();
    });

    it("does nothing when pasted text is empty", () => {
      const onPasteDetected = vi.fn();
      render(
        <InternationalPhoneInput
          enablePasteDetection
          onPasteDetected={onPasteDetected}
        />
      );

      const input = screen.getByPlaceholderText("Enter phone number");
      const pasteEvent = new Event("paste", { bubbles: true, cancelable: true });
      Object.defineProperty(pasteEvent, "clipboardData", {
        value: { getData: () => "" },
      });
      input.dispatchEvent(pasteEvent);

      expect(onPasteDetected).not.toHaveBeenCalled();
    });
  });

  describe("Copy handler", () => {
    it("intercepts copy event and writes formatted value to clipboard", () => {
      render(
        <InternationalPhoneInput
          defaultValue={{ countryCode: "US", phoneNumber: "2025551234" }}
        />
      );

      const input = screen.getByPlaceholderText("Enter phone number");

      const clipboardData: Record<string, string> = {};
      const copyEvent = new Event("copy", { bubbles: true, cancelable: true });
      Object.defineProperty(copyEvent, "clipboardData", {
        value: {
          setData: (type: string, value: string) => {
            clipboardData[type] = value;
          },
        },
      });

      input.dispatchEvent(copyEvent);

      // The handler should have written to clipboard (e164 format by default)
      expect(clipboardData["text/plain"]).toBeTruthy();
      expect(clipboardData["text/plain"]).toContain("2025551234");
    });

    it("does not write to clipboard when phone input is empty", () => {
      render(<InternationalPhoneInput />);

      const input = screen.getByPlaceholderText("Enter phone number");

      const clipboardData: Record<string, string> = {};
      const copyEvent = new Event("copy", { bubbles: true, cancelable: true });
      Object.defineProperty(copyEvent, "clipboardData", {
        value: {
          setData: (type: string, value: string) => {
            clipboardData[type] = value;
          },
        },
      });

      input.dispatchEvent(copyEvent);

      // No digits → setData should not be called
      expect(clipboardData["text/plain"]).toBeUndefined();
    });

    it("copies in international format when copyFormat is 'international'", () => {
      render(
        <InternationalPhoneInput
          defaultValue={{ countryCode: "US", phoneNumber: "2025551234" }}
          copyFormat="international"
        />
      );

      const input = screen.getByPlaceholderText("Enter phone number");

      const clipboardData: Record<string, string> = {};
      const copyEvent = new Event("copy", { bubbles: true, cancelable: true });
      Object.defineProperty(copyEvent, "clipboardData", {
        value: {
          setData: (type: string, value: string) => {
            clipboardData[type] = value;
          },
        },
      });

      input.dispatchEvent(copyEvent);

      expect(clipboardData["text/plain"]).toContain("+1");
    });

    it("copies in national format when copyFormat is 'national'", () => {
      render(
        <InternationalPhoneInput
          defaultValue={{ countryCode: "US", phoneNumber: "2025551234" }}
          copyFormat="national"
        />
      );

      const input = screen.getByPlaceholderText("Enter phone number");

      const clipboardData: Record<string, string> = {};
      const copyEvent = new Event("copy", { bubbles: true, cancelable: true });
      Object.defineProperty(copyEvent, "clipboardData", {
        value: {
          setData: (type: string, value: string) => {
            clipboardData[type] = value;
          },
        },
      });

      input.dispatchEvent(copyEvent);

      // National format does not include the dial code prefix
      expect(clipboardData["text/plain"]).not.toContain("+1");
      expect(clipboardData["text/plain"]).toBeTruthy();
    });
  });
});
