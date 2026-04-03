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
});
