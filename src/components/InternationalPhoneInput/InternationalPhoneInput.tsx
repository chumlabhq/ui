import { useState, useCallback, useMemo, useId, forwardRef } from "react";
import type { InternationalPhoneInputProps, CountryOption } from "./types";
import {
  DEFAULT_COUNTRIES,
  DEFAULT_PREFERRED_COUNTRIES,
  DEFAULT_COUNTRY,
} from "./constants";
import {
  findCountryByCode,
  formatPhoneNumber,
  validatePhoneNumber,
  sortCountryOptions,
  getDigitsOnly,
  parseInternationalNumber,
  formatForCopy,
} from "./utils";
import { CountryFlag } from "../CountryFlag";
import { SearchableDropdown } from "../SearchableDropdown";
import type { SearchableDropdownOptionType } from "../SearchableDropdown";

const InternationalPhoneInput = forwardRef<
  HTMLInputElement,
  InternationalPhoneInputProps
>(
  (
    {
      value,
      onChange,
      onCountryChange,
      defaultCountry = DEFAULT_COUNTRY,
      countries = DEFAULT_COUNTRIES,
      preferredCountries = DEFAULT_PREFERRED_COUNTRIES,
      id,
      name,
      label,
      required = false,
      disabled = false,
      error = false,
      errorMessage,
      placeholder = "Enter phone number",
      fullWidth = false,
      validateOnBlur = true,
      containerClassName = "",
      labelClassName = "",
      errorClassName = "",
      inputClassName = "",
      inputFocusClassName = "",
      inputWrapperClassName = "",
      countrySelectClassName = "",
      countrySelectTriggerClassName = "",
      countrySelectDropdownClassName = "",
      countrySelectSearchInputClassName = "",
      countrySelectOptionClassName = "",
      countrySelectOptionSelectedClassName = "",
      countrySelectOptionListClassName = "",
      countrySelectChevronClassName = "",
      countrySelectSelectedIndicatorClassName = "",
      countrySelectSelectedIndicator,
      countrySelectSearchIconClassName = "",
      countrySelectNoResultsClassName = "",
      countryDropdownPlaceholder = "Country",
      countrySearchPlaceholder = "Search countries...",
      enablePasteDetection = false,
      copyFormat = "e164",
      onPasteDetected,
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || name || generatedId;
    const errorId = `${inputId}-error`;

    const sortedCountries = useMemo(
      () => sortCountryOptions(countries, preferredCountries),
      [countries, preferredCountries],
    );

    const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
      () => {
        if (value?.countryCode) {
          const found = findCountryByCode(value.countryCode, sortedCountries);
          return found?.value || defaultCountry.toUpperCase();
        }
        const found = findCountryByCode(defaultCountry, sortedCountries);
        return found?.value || "US";
      },
    );

    const [phoneInput, setPhoneInput] = useState<string>(() => {
      if (value?.phoneNumber) {
        const country = findCountryByCode(
          value.countryCode || defaultCountry,
          sortedCountries,
        );
        return formatPhoneNumber(value.phoneNumber, country);
      }
      return "";
    });

    const [validationError, setValidationError] = useState<string>("");
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const selectedCountry = useMemo(
      () => findCountryByCode(selectedCountryCode, sortedCountries),
      [selectedCountryCode, sortedCountries],
    );

    const dropdownOptions: SearchableDropdownOptionType[] = useMemo(
      () =>
        sortedCountries.map((country) => ({
          value: country.value,
          label: `${country.name} ${country.dialCode}`,
          content: (
            <div className="flex items-center gap-2 min-w-0">
              <CountryFlag
                code={country.flag}
                size={22}
                className="rounded-[2px]"
                style={{ height: 17 }}
              />
              <span className="truncate text-sm">
                {country.name} ({country.dialCode})
              </span>
            </div>
          ),
          selectedContent: (
            <div className="flex items-center gap-2">
              <CountryFlag
                code={country.flag}
                size={22}
                className="rounded-[2px]"
                style={{ height: 17 }}
              />
              <span className="text-sm">{country.dialCode}</span>
            </div>
          ),
        })),
      [sortedCountries],
    );

    const emitChange = useCallback(
      (digits: string, country: CountryOption | null) => {
        if (!onChange) return;
        const phoneData = validatePhoneNumber(digits, country);
        onChange(phoneData);
      },
      [onChange],
    );

    const handleCountrySelect = useCallback(
      (countryValue: string | null) => {
        if (!countryValue) return;
        const country = sortedCountries.find((c) => c.value === countryValue);
        if (!country) return;

        setSelectedCountryCode(countryValue);
        setValidationError("");

        onCountryChange?.(country);

        const digits = getDigitsOnly(phoneInput);
        const formatted = formatPhoneNumber(digits, country);
        setPhoneInput(formatted);
        emitChange(digits, country);
      },
      [sortedCountries, phoneInput, onCountryChange, emitChange],
    );

    const handlePhoneInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const digits = getDigitsOnly(rawValue);
        const formatted = formatPhoneNumber(digits, selectedCountry);

        setPhoneInput(formatted);
        setValidationError("");
        emitChange(digits, selectedCountry);
      },
      [selectedCountry, emitChange],
    );

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      if (!validateOnBlur) return;

      const digits = getDigitsOnly(phoneInput);
      if (!digits) return;

      const phoneData = validatePhoneNumber(digits, selectedCountry);
      if (!phoneData.isValid) {
        setValidationError("Please enter a valid phone number");
      }
    }, [phoneInput, selectedCountry, validateOnBlur]);

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (!enablePasteDetection) return;

        const pastedText = e.clipboardData.getData("text");
        if (!pastedText) return;

        const parsed = parseInternationalNumber(pastedText, sortedCountries);

        if (parsed.detectedCountry) {
          e.preventDefault();

          setSelectedCountryCode(parsed.detectedCountry.value);
          const formatted = formatPhoneNumber(
            parsed.phoneNumber,
            parsed.detectedCountry
          );
          setPhoneInput(formatted);
          setValidationError("");

          onCountryChange?.(parsed.detectedCountry);
          emitChange(parsed.phoneNumber, parsed.detectedCountry);

          onPasteDetected?.({
            rawValue: pastedText,
            detectedCountry: parsed.detectedCountry,
            phoneNumber: parsed.phoneNumber,
          });
        } else if (parsed.phoneNumber) {
          e.preventDefault();

          const formatted = formatPhoneNumber(parsed.phoneNumber, selectedCountry);
          setPhoneInput(formatted);
          setValidationError("");
          emitChange(parsed.phoneNumber, selectedCountry);

          onPasteDetected?.({
            rawValue: pastedText,
            detectedCountry: null,
            phoneNumber: parsed.phoneNumber,
          });
        }
      },
      [
        enablePasteDetection,
        sortedCountries,
        selectedCountry,
        onCountryChange,
        emitChange,
        onPasteDetected,
      ]
    );

    const handleCopy = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        const digits = getDigitsOnly(phoneInput);
        if (!digits) return;

        e.preventDefault();
        const formatted = formatForCopy(digits, selectedCountry, copyFormat);
        e.clipboardData.setData("text/plain", formatted);
      },
      [phoneInput, selectedCountry, copyFormat]
    );

    const displayError = error || !!validationError;
    const displayErrorMessage = errorMessage || validationError;

    return (
      <div
        className={[containerClassName, fullWidth ? "w-full" : ""]
          .filter(Boolean)
          .join(" ")}
        data-disabled={disabled || undefined}
        data-error={displayError || undefined}
      >
        {label && (
          <label htmlFor={inputId} className={labelClassName}>
            {label}
            {required && <span aria-hidden="true">*</span>}
          </label>
        )}

        <div className={inputWrapperClassName}>
          <SearchableDropdown
            options={dropdownOptions}
            value={selectedCountryCode}
            onValueChange={handleCountrySelect}
            placeholder={countryDropdownPlaceholder}
            disabled={disabled}
            showSearch={true}
            searchPlaceholder={countrySearchPlaceholder}
            showChevron={true}
            selectedIcon={countrySelectSelectedIndicator}
            classes={{
              root: countrySelectClassName,
              trigger: countrySelectTriggerClassName,
              content: countrySelectDropdownClassName,
              searchInput: countrySelectSearchInputClassName,
              option: countrySelectOptionClassName,
              optionSelected: countrySelectOptionSelectedClassName,
              optionList: countrySelectOptionListClassName,
              chevron: countrySelectChevronClassName,
              checkIcon: countrySelectSelectedIndicatorClassName,
              searchIcon: countrySelectSearchIconClassName,
              noResults: countrySelectNoResultsClassName,
            }}
          />

          <input
            ref={ref}
            id={inputId}
            type="tel"
            name={name}
            value={phoneInput}
            onChange={handlePhoneInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onPaste={handlePaste}
            onCopy={handleCopy}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={displayError || undefined}
            aria-describedby={
              displayError && displayErrorMessage ? errorId : undefined
            }
            aria-required={required || undefined}
            className={[inputClassName, isFocused ? inputFocusClassName : ""]
              .filter(Boolean)
              .join(" ")}
            data-disabled={disabled || undefined}
            data-error={displayError || undefined}
            data-focused={isFocused || undefined}
          />
        </div>

        {displayError && displayErrorMessage && (
          <div id={errorId} role="alert" className={errorClassName}>
            {displayErrorMessage}
          </div>
        )}
      </div>
    );
  },
);

InternationalPhoneInput.displayName = "InternationalPhoneInput";

export default InternationalPhoneInput;
