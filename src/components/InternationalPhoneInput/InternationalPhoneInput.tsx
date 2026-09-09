import {
  useCallback,
  useMemo,
  useId,
  forwardRef,
  useRef,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import type {
  InternationalPhoneInputProps,
  InternationalPhoneInputClasses,
  CountryOption,
  PhoneNumberValue,
  PhoneNumberData,
} from "./utils/types.js";
import {
  DEFAULT_COUNTRIES,
  DEFAULT_PREFERRED_COUNTRIES,
  DEFAULT_COUNTRY,
  DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES,
  UNSTYLED_INTERNATIONAL_PHONE_INPUT_CLASSES,
} from "./constants.js";
import {
  findCountryByCode,
  formatPhoneNumber,
  validatePhoneNumber,
  sortCountryOptions,
  getDigitsOnly,
  parseInternationalNumber,
  formatForCopy,
  computeCursorPosition,
} from "./utils.js";
import { CountryFlag } from "../CountryFlag/index.js";
import { SearchableDropdown } from "../SearchableDropdown/index.js";
import type { SearchableDropdownOption } from "../SearchableDropdown/index.js";
import { useControllableState } from "../../utils/useControllableState.js";
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect.js";
import { cn, composeClasses } from "../../utils/scopedCn.js";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
function resolveInitialCountry(
  value: PhoneNumberValue | undefined,
  defaultValue: PhoneNumberValue | undefined,
  defaultCountry: string,
  countries: CountryOption[],
): string {
  const code = value?.countryCode || defaultValue?.countryCode;
  if (code) {
    const found = findCountryByCode(code, countries);
    return found?.value || defaultCountry.toUpperCase();
  }
  const found = findCountryByCode(defaultCountry, countries);
  return found?.value || "US";
}

function resolveInitialPhone(
  value: PhoneNumberValue | undefined,
  defaultValue: PhoneNumberValue | undefined,
  defaultCountry: string,
  countries: CountryOption[],
): string {
  const src = value || defaultValue;
  if (src?.phoneNumber) {
    const country = findCountryByCode(
      src.countryCode || defaultCountry,
      countries,
    );
    return formatPhoneNumber(src.phoneNumber, country);
  }
  return "";
}

/**
 * Component: InternationalPhoneInput
 *
 * Purpose:
 * Phone number input with integrated country code selector, automatic formatting,
 * paste detection, copy format control, and extensible validation.
 *
 * AI Usage Guidelines:
 * - Use for any phone number entry requiring country selection
 * - Minimum: `<InternationalPhoneInput label="Phone" onValueChange={handler} />`
 * - Pair `value` with `onValueChange` for controlled mode
 * - Set `enablePasteDetection` for international number paste handling
 *
 * Behavior:
 * - Auto-formats numbers per country-specific patterns
 * - Validates phone length on blur (configurable via `validateOnBlur`)
 * - Country dropdown rendered via portal (never clipped by overflow)
 * - Auto-flips dropdown position when insufficient viewport space (disable with `forceDropdownPosition`)
 * - Copies in E.164, international, or national format
 *
 * Reference:
 * - INTERNATIONALPHONEINPUT.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/InternationalPhoneInputDemo.tsx — live demo
 */
const InternationalPhoneInput = forwardRef<
  HTMLInputElement,
  InternationalPhoneInputProps
>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      onCountryChange,
      defaultCountry = DEFAULT_COUNTRY,
      countries = DEFAULT_COUNTRIES,
      preferredCountries = DEFAULT_PREFERRED_COUNTRIES,
      id,
      name,
      label,
      description,
      loading = false,
      clearable = false,
      onClear,
      required = false,
      disabled = false,
      readOnly = false,
      error = false,
      errorMessage,
      success = false,
      successMessage,
      placeholder = "Enter phone number",
      fullWidth = false,
      validateOnBlur = true,
      validationMessage,
      validate,
      enablePasteDetection = false,
      copyFormat = "e164",
      onPasteDetected,
      countryDropdownPlaceholder = "Country",
      countrySearchPlaceholder = "Search countries...",
      countryDropdownAriaLabel = "Select country",
      selectedIcon,
      flagSize = 22,
      renderCountryOption,
      renderSelectedCountry,
      formatPatterns,
      lengthRules,
      className,
      style,
      classes: classesProp,
      unstyled = false,
      dropdownPosition,
      forceDropdownPosition,
      dropdownZIndex,
      dropdownGap,
      portalContainer,
      lockScroll,
      onFocus,
      onBlur,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...rest
    },
    ref,
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const baseClassesRaw = unstyled
      ? UNSTYLED_INTERNATIONAL_PHONE_INPUT_CLASSES
      : DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES;
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);

    const mergedClasses: Required<InternationalPhoneInputClasses> = useMemo(
      () => ({
        root: cn(baseClasses.root, classesProp?.root),
        label: cn(baseClasses.label, classesProp?.label),
        description: cn(baseClasses.description, classesProp?.description),
        control: cn(baseClasses.control, classesProp?.control),
        input: cn(baseClasses.input, classesProp?.input),
        message: cn(baseClasses.message, classesProp?.message),
        countrySelect: composeClasses(baseClasses.countrySelect, classesProp?.countrySelect),
        itemRow: cn(baseClasses.itemRow, classesProp?.itemRow),
        itemIcon: cn(baseClasses.itemIcon, classesProp?.itemIcon),
        itemText: cn(baseClasses.itemText, classesProp?.itemText),
        triggerRow: cn(baseClasses.triggerRow, classesProp?.triggerRow),
        flag: cn(baseClasses.flag, classesProp?.flag),
        value: cn(baseClasses.value, classesProp?.value),
      }),
      [classesProp, baseClasses],
    );

    const generatedId = useId();
    const inputId = id || generatedId;
    const labelId = `${inputId}-label`;

    // The phone field is a textbox with a placeholder and, without `label`, no
    // name — the placeholder is not one. The group around it carries a hardcoded
    // "Phone number input", which names the group and not the control.
    useAccessibleNameWarning("InternationalPhoneInput", {
      label,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    });
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const statusId = `${inputId}-status`;

    const sortedCountries = useMemo(
      () => sortCountryOptions(countries, preferredCountries),
      [countries, preferredCountries],
    );

    const [initialCountry] = useState(() =>
      resolveInitialCountry(value, defaultValue, defaultCountry, sortedCountries),
    );
    const [initialPhone] = useState(() =>
      resolveInitialPhone(value, defaultValue, defaultCountry, sortedCountries),
    );

    const [selectedCountryCode, setSelectedCountryCode] =
      useControllableState<string>({
        value: value?.countryCode
          ? findCountryByCode(value.countryCode, sortedCountries)?.value
          : undefined,
        defaultValue: initialCountry,
      });

    const [phoneInput, setPhoneInput] = useControllableState<string>({
      value: value
        ? formatPhoneNumber(
            value.phoneNumber,
            findCountryByCode(
              value.countryCode || defaultCountry,
              sortedCountries,
            ),
            formatPatterns,
          )
        : undefined,
      defaultValue: initialPhone,
    });

    const [hasValidationError, setHasValidationError] = useState(false);
    const [validationErrorMessage, setValidationErrorMessage] = useState<
      string | undefined
    >(undefined);

    const internalInputRef = useRef<HTMLInputElement>(null);
    const pendingCursorRef = useRef<number | null>(null);

    const mergedInputRef = useMemo(() => mergeRefs(internalInputRef, ref), [ref]);

    useIsomorphicLayoutEffect(() => {
      if (pendingCursorRef.current !== null && internalInputRef.current) {
        const pos = pendingCursorRef.current;
        internalInputRef.current.setSelectionRange(pos, pos);
        pendingCursorRef.current = null;
      }
    });

    const phoneInputRef = useRef(phoneInput);
    useEffect(() => {
      phoneInputRef.current = phoneInput;
    });

    const selectedCountry = useMemo(
      () => findCountryByCode(selectedCountryCode, sortedCountries),
      [selectedCountryCode, sortedCountries],
    );

    const dropdownOptions: SearchableDropdownOption[] = useMemo(
      () =>
        sortedCountries.map((country) => ({
          value: country.value,
          label: `${country.name} ${country.dialCode}`,
          content: renderCountryOption ? (
            renderCountryOption({
              country,
              isSelected: country.value === selectedCountryCode,
            })
          ) : (
            <div className={mergedClasses.itemRow || undefined}>
              <CountryFlag
                code={country.flag}
                size={flagSize}
                unstyled={unstyled}
                className={mergedClasses.itemIcon || undefined}
                style={{ height: Math.round((flagSize * 17) / 22) }}
              />
              <span className={mergedClasses.itemText || undefined}>
                {country.name} ({country.dialCode})
              </span>
            </div>
          ),
          selectedContent: renderSelectedCountry ? (
            renderSelectedCountry(country)
          ) : (
            <div className={mergedClasses.triggerRow || undefined}>
              <CountryFlag
                code={country.flag}
                size={flagSize}
                unstyled={unstyled}
                className={mergedClasses.flag || undefined}
                style={{ height: Math.round((flagSize * 17) / 22) }}
              />
              <span className={mergedClasses.value || undefined}>{country.dialCode}</span>
            </div>
          ),
        })),
      [
        sortedCountries,
        renderCountryOption,
        renderSelectedCountry,
        selectedCountryCode,
        flagSize,
        unstyled,
        mergedClasses.itemRow,
        mergedClasses.itemIcon,
        mergedClasses.itemText,
        mergedClasses.triggerRow,
        mergedClasses.flag,
        mergedClasses.value,
      ],
    );

    const runValidate = useCallback(
      (data: PhoneNumberData): { isValid: boolean; message?: string } => {
        if (!validate) return { isValid: data.isValid };
        const result = validate(data);
        return typeof result === "boolean"
          ? { isValid: result }
          : { isValid: result.valid, message: result.message };
      },
      [validate],
    );

    const emitChange = useCallback(
      (digits: string, country: CountryOption | null) => {
        if (!onValueChange) return;
        const phoneData = validatePhoneNumber(
          digits,
          country,
          lengthRules,
          formatPatterns,
        );
        const { isValid } = runValidate(phoneData);
        onValueChange({ ...phoneData, isValid });
      },
      [onValueChange, lengthRules, formatPatterns, runValidate],
    );

    const handleCountrySelect = useCallback(
      (countryValue: string | null) => {
        if (!countryValue || readOnly) return;
        const country = sortedCountries.find((c) => c.value === countryValue);
        if (!country) return;

        setSelectedCountryCode(countryValue);
        setHasValidationError(false);

        onCountryChange?.(country);

        const digits = getDigitsOnly(phoneInputRef.current);
        const formatted = formatPhoneNumber(digits, country, formatPatterns);
        setPhoneInput(formatted);
        emitChange(digits, country);
      },
      [
        sortedCountries,
        onCountryChange,
        emitChange,
        readOnly,
        setSelectedCountryCode,
        setPhoneInput,
        formatPatterns,
      ],
    );

    const handlePhoneInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (readOnly) return;
        const input = e.target;
        const rawValue = input.value;
        const cursorPos = input.selectionStart ?? rawValue.length;

        const digits = getDigitsOnly(rawValue);
        const formatted = formatPhoneNumber(
          digits,
          selectedCountry,
          formatPatterns,
        );

        pendingCursorRef.current = computeCursorPosition(
          rawValue,
          formatted,
          cursorPos,
        );

        setPhoneInput(formatted);
        setHasValidationError(false);
        emitChange(digits, selectedCountry);
      },
      [selectedCountry, emitChange, readOnly, setPhoneInput, formatPatterns],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        onBlur?.(e);

        if (!validateOnBlur) return;

        const digits = getDigitsOnly(phoneInput);
        if (!digits) return;

        const phoneData = validatePhoneNumber(
          digits,
          selectedCountry,
          lengthRules,
          formatPatterns,
        );
        const { isValid, message } = runValidate(phoneData);
        if (!isValid) {
          setHasValidationError(true);
          setValidationErrorMessage(message);
        }
      },
      [
        phoneInput,
        selectedCountry,
        validateOnBlur,
        onBlur,
        lengthRules,
        formatPatterns,
        runValidate,
      ],
    );

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (!enablePasteDetection || readOnly) return;

        const pastedText = e.clipboardData.getData("text");
        if (!pastedText) return;

        const parsed = parseInternationalNumber(
          pastedText,
          sortedCountries,
          preferredCountries,
        );

        if (parsed.detectedCountry) {
          e.preventDefault();

          setSelectedCountryCode(parsed.detectedCountry.value);
          const formatted = formatPhoneNumber(
            parsed.phoneNumber,
            parsed.detectedCountry,
            formatPatterns,
          );
          setPhoneInput(formatted);
          setHasValidationError(false);

          onCountryChange?.(parsed.detectedCountry);
          emitChange(parsed.phoneNumber, parsed.detectedCountry);

          onPasteDetected?.({
            rawValue: pastedText,
            detectedCountry: parsed.detectedCountry,
            phoneNumber: parsed.phoneNumber,
          });
        } else if (parsed.phoneNumber) {
          e.preventDefault();

          const formatted = formatPhoneNumber(
            parsed.phoneNumber,
            selectedCountry,
            formatPatterns,
          );
          setPhoneInput(formatted);
          setHasValidationError(false);
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
        readOnly,
        sortedCountries,
        preferredCountries,
        selectedCountry,
        onCountryChange,
        emitChange,
        onPasteDetected,
        setSelectedCountryCode,
        setPhoneInput,
        formatPatterns,
      ],
    );

    const handleCopy = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        const digits = getDigitsOnly(phoneInput);
        if (!digits) return;

        e.preventDefault();
        const formatted = formatForCopy(
          digits,
          selectedCountry,
          copyFormat,
          formatPatterns,
        );
        e.clipboardData.setData("text/plain", formatted);
      },
      [phoneInput, selectedCountry, copyFormat, formatPatterns],
    );

    const handleClear = useCallback(() => {
      if (onClear) {
        onClear();
        return;
      }
      setPhoneInput("");
      setHasValidationError(false);
      emitChange("", selectedCountry);
    }, [onClear, setPhoneInput, emitChange, selectedCountry]);

    const displayError = error || hasValidationError;
    const internalErrorMessage = hasValidationError
      ? (validationErrorMessage ??
        validationMessage ??
        "Please enter a valid phone number")
      : undefined;
    const displayErrorMessage = errorMessage || internalErrorMessage;
    const displaySuccess = success && !displayError;
    const displaySuccessMessage = displaySuccess ? successMessage : undefined;

    const describedByParts: string[] = [];
    if (description) describedByParts.push(descriptionId);
    if (displayError && displayErrorMessage) describedByParts.push(errorId);
    if (displaySuccess && displaySuccessMessage)
      describedByParts.push(successId);
    const ariaDescribedBy =
      describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

    const statusMessage = selectedCountry
      ? `${selectedCountry.name} ${selectedCountry.dialCode}`
      : "";

    const rootClassName = cn(mergedClasses.root, className) || undefined;
    const rootStyle: CSSProperties = {
      ...(fullWidth ? { width: "100%" } : {}),
      ...style,
    };
    const hasRootStyle = Object.keys(rootStyle).length > 0;

    return (
      <div
        className={rootClassName}
        style={hasRootStyle ? rootStyle : undefined}
        data-slot="root"
        data-disabled={disabled || undefined}
        data-error={displayError || undefined}
        data-valid={displaySuccess || undefined}
        data-readonly={readOnly || undefined}
        data-full-width={fullWidth || undefined}
        data-loading={loading || undefined}
      >
        {label && (
          <label
            id={labelId}
            htmlFor={inputId}
            className={mergedClasses.label || undefined}
            data-slot="label"
          >
            {label}
            {required && <span aria-hidden="true">*</span>}
          </label>
        )}

        {description && (
          <div id={descriptionId} className={mergedClasses.description || undefined}>{description}</div>
        )}

        <div
          className={cn(mergedClasses.control) || undefined}
          data-slot="wrapper"
          role="group"
          aria-labelledby={label ? labelId : undefined}
          aria-label={!label ? (ariaLabel || "Phone number input") : undefined}
        >
          <SearchableDropdown
            options={dropdownOptions}
            value={selectedCountryCode}
            onValueChange={handleCountrySelect}
            placeholder={countryDropdownPlaceholder}
            disabled={disabled || readOnly || loading}
            showSearch={true}
            searchPlaceholder={countrySearchPlaceholder}
            showChevron={true}
            selectedIcon={selectedIcon}
            aria-label={countryDropdownAriaLabel}
            dropdownPosition={dropdownPosition}
            forceDropdownPosition={forceDropdownPosition}
            dropdownZIndex={dropdownZIndex}
            dropdownGap={dropdownGap}
            portalContainer={portalContainer}
            lockScroll={lockScroll}
            // ADR 002 R6: the child's own bag, handed over whole. `unstyled`
            // travels the same path — baseClasses is already the unstyled set
            // when the prop is on, and structuralOnly recurses into this object.
            unstyled={unstyled}
            classes={mergedClasses.countrySelect}
          />

          <input
            ref={mergedInputRef}
            id={inputId}
            type="tel"
            // Default off: browser autofill of a full international number would
            // corrupt this national-number field (and the country/number split).
            // Overridable via `...rest` (e.g. autoComplete="tel-national").
            autoComplete="off"
            value={phoneInput}
            onChange={handlePhoneInputChange}
            onFocus={onFocus}
            onBlur={handleBlur}
            onPaste={handlePaste}
            onCopy={handleCopy}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={displayError || undefined}
            aria-describedby={ariaDescribedBy}
            aria-required={required || undefined}
            aria-label={!label ? ariaLabel : undefined}
            aria-labelledby={!label ? ariaLabelledBy : undefined}
            className={mergedClasses.input || undefined}
            data-slot="input"
            data-disabled={disabled || undefined}
            data-error={displayError || undefined}
            data-valid={displaySuccess || undefined}
            data-readonly={readOnly || undefined}
            {...rest}
          />
          {clearable && phoneInput && !disabled && !readOnly && (
            <button
              type="button"
              aria-label="Clear phone number"
              onClick={handleClear}
              style={{ cursor: "pointer" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>

        {name && (
          <>
            <input
              type="hidden"
              name={`${name}_country`}
              value={selectedCountryCode}
              aria-hidden="true"
            />
            <input
              type="hidden"
              name={name}
              value={
                selectedCountry
                  ? `${selectedCountry.dialCode}${getDigitsOnly(phoneInput)}`
                  : getDigitsOnly(phoneInput)
              }
              aria-hidden="true"
            />
          </>
        )}

        <div
          id={statusId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={SR_ONLY_STYLE}
        >
          {statusMessage}
        </div>

        {displayError && displayErrorMessage && (
          <div
            id={errorId}
            role="alert"
            data-invalid
            className={mergedClasses.message || undefined}
            data-slot="error"
          >
            {displayErrorMessage}
          </div>
        )}

        {displaySuccess && displaySuccessMessage && (
          <div
            id={successId}
            role="status"
            data-valid
            className={mergedClasses.message || undefined}
            data-slot="success"
          >
            {displaySuccessMessage}
          </div>
        )}
      </div>
    );
  },
);

InternationalPhoneInput.displayName = "InternationalPhoneInput";

export default InternationalPhoneInput;
