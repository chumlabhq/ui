import { describe, it, expect } from "vitest";
import {
  PHONE_FORMATTING_PATTERNS,
  DEFAULT_COUNTRIES,
  DEFAULT_PREFERRED_COUNTRIES,
  DEFAULT_COUNTRY,
  PHONE_LENGTH_RULES,
  DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES,
  UNSTYLED_INTERNATIONAL_PHONE_INPUT_CLASSES,
} from "../constants";

// ─── PHONE_FORMATTING_PATTERNS ────────────────────────────────────────────────

describe("PHONE_FORMATTING_PATTERNS", () => {
  // Lines 33-40: GERMANY pattern
  describe("GERMANY", () => {
    const { pattern } = PHONE_FORMATTING_PATTERNS.GERMANY;

    it("applies to the 'de' country", () => {
      expect(PHONE_FORMATTING_PATTERNS.GERMANY.countries).toContain("de");
    });

    it("returns raw digits when length <= 4", () => {
      expect(pattern("1234")).toBe("1234");
      expect(pattern("12")).toBe("12");
    });

    it("formats with one space when length is 5-8", () => {
      expect(pattern("12345")).toBe("1234 5");
      expect(pattern("12345678")).toBe("1234 5678");
    });

    it("formats with two spaces when length > 8", () => {
      expect(pattern("1234567890")).toBe("1234 5678 90");
    });
  });

  // Lines 41-48: JAPAN pattern
  describe("JAPAN", () => {
    const { pattern } = PHONE_FORMATTING_PATTERNS.JAPAN;

    it("applies to the 'jp' country", () => {
      expect(PHONE_FORMATTING_PATTERNS.JAPAN.countries).toContain("jp");
    });

    it("returns raw digits when length <= 3", () => {
      expect(pattern("123")).toBe("123");
      expect(pattern("1")).toBe("1");
    });

    it("formats with one dash when length is 4-7", () => {
      expect(pattern("1234")).toBe("123-4");
      expect(pattern("1234567")).toBe("123-4567");
    });

    it("formats with two dashes when length > 7", () => {
      expect(pattern("12345678901")).toBe("123-4567-8901");
    });
  });

  // Lines 49-55: INDIA pattern
  describe("INDIA", () => {
    const { pattern } = PHONE_FORMATTING_PATTERNS.INDIA;

    it("applies to the 'in' country", () => {
      expect(PHONE_FORMATTING_PATTERNS.INDIA.countries).toContain("in");
    });

    it("returns raw digits when length <= 5", () => {
      expect(pattern("12345")).toBe("12345");
      expect(pattern("1")).toBe("1");
    });

    it("formats with a space after 5 digits", () => {
      expect(pattern("123456")).toBe("12345 6");
      expect(pattern("9876543210")).toBe("98765 43210");
    });
  });

  // Lines 56-62: AUSTRALIA pattern
  describe("AUSTRALIA", () => {
    const { pattern } = PHONE_FORMATTING_PATTERNS.AUSTRALIA;

    it("applies to the 'au' country", () => {
      expect(PHONE_FORMATTING_PATTERNS.AUSTRALIA.countries).toContain("au");
    });

    it("returns raw digits when length <= 4", () => {
      expect(pattern("1234")).toBe("1234");
      expect(pattern("9")).toBe("9");
    });

    it("formats with spaces after digit 4 and 7", () => {
      expect(pattern("123456789")).toBe("1234 567 89");
      expect(pattern("12345678")).toBe("1234 567 8");
    });
  });

  // Lines 63-71: BRAZIL pattern
  describe("BRAZIL", () => {
    const { pattern } = PHONE_FORMATTING_PATTERNS.BRAZIL;

    it("applies to the 'br' country", () => {
      expect(PHONE_FORMATTING_PATTERNS.BRAZIL.countries).toContain("br");
    });

    it("returns raw digits when length <= 2", () => {
      expect(pattern("12")).toBe("12");
      expect(pattern("1")).toBe("1");
    });

    it("formats with area code when length is 3-7", () => {
      expect(pattern("123")).toBe("(12) 3");
      expect(pattern("1234567")).toBe("(12) 34567");
    });

    it("formats with area code and dash when length > 7", () => {
      expect(pattern("12345678901")).toBe("(12) 34567-8901");
    });
  });

  // Lines 72-79: CHINA pattern
  describe("CHINA", () => {
    const { pattern } = PHONE_FORMATTING_PATTERNS.CHINA;

    it("applies to the 'cn' country", () => {
      expect(PHONE_FORMATTING_PATTERNS.CHINA.countries).toContain("cn");
    });

    it("returns raw digits when length <= 3", () => {
      expect(pattern("123")).toBe("123");
      expect(pattern("1")).toBe("1");
    });

    it("formats with one space when length is 4-7", () => {
      expect(pattern("1234")).toBe("123 4");
      expect(pattern("1234567")).toBe("123 4567");
    });

    it("formats with two spaces when length > 7", () => {
      expect(pattern("12345678901")).toBe("123 4567 8901");
    });
  });
});

// ─── Static exports ───────────────────────────────────────────────────────────

describe("DEFAULT_PREFERRED_COUNTRIES", () => {
  it("exports the correct default preferred countries", () => {
    expect(DEFAULT_PREFERRED_COUNTRIES).toEqual(["us", "gb", "ca", "au"]);
  });
});

describe("DEFAULT_COUNTRY", () => {
  it("defaults to 'us'", () => {
    expect(DEFAULT_COUNTRY).toBe("us");
  });
});

describe("DEFAULT_COUNTRIES", () => {
  it("contains at least one entry", () => {
    expect(DEFAULT_COUNTRIES.length).toBeGreaterThan(0);
  });

  it("includes United States with correct dial code", () => {
    const us = DEFAULT_COUNTRIES.find((c) => c.value === "US");
    expect(us).toBeDefined();
    expect(us?.dialCode).toBe("+1");
  });

  it("includes United Kingdom with correct dial code", () => {
    const gb = DEFAULT_COUNTRIES.find((c) => c.value === "GB");
    expect(gb).toBeDefined();
    expect(gb?.dialCode).toBe("+44");
  });

  it("every entry has required fields", () => {
    for (const country of DEFAULT_COUNTRIES) {
      expect(country).toHaveProperty("value");
      expect(country).toHaveProperty("label");
      expect(country).toHaveProperty("flag");
      expect(country).toHaveProperty("dialCode");
      expect(country).toHaveProperty("name");
    }
  });
});

describe("PHONE_LENGTH_RULES", () => {
  it("contains a DEFAULT rule", () => {
    expect(PHONE_LENGTH_RULES.DEFAULT).toBeDefined();
    expect(PHONE_LENGTH_RULES.DEFAULT.min).toBe(7);
    expect(PHONE_LENGTH_RULES.DEFAULT.max).toBe(15);
  });

  it("contains a US rule with min and max both 10", () => {
    expect(PHONE_LENGTH_RULES.US).toEqual({ min: 10, max: 10 });
  });
});

describe("DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES", () => {
  it("has all required class keys", () => {
    const keys = [
      "root",
      "label",
      "description",
      "wrapper",
      "input",
      "error",
      "success",
      "countrySelect",
      "countrySelectTrigger",
      "countrySelectDropdown",
      "countrySelectSearchInput",
      "countrySelectSearchInputElement",
      "countrySelectOption",
      "countrySelectOptionSelected",
      "countrySelectOptionList",
      "countrySelectChevron",
      "countrySelectCheckIcon",
      "countrySelectSearchIcon",
      "countrySelectNoResults",
    ] as const;
    for (const key of keys) {
      expect(DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES).toHaveProperty(key);
    }
  });
});

describe("UNSTYLED_INTERNATIONAL_PHONE_INPUT_CLASSES", () => {
  it("all class values are empty strings", () => {
    for (const value of Object.values(UNSTYLED_INTERNATIONAL_PHONE_INPUT_CLASSES)) {
      expect(value).toBe("");
    }
  });
});
