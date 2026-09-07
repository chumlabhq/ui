import { describe, it, expect } from "vitest";
import { isStructural } from "../../../utils/classLayers.js";
import {
  PHONE_FORMATTING_PATTERNS,
  DEFAULT_COUNTRIES,
  DEFAULT_PREFERRED_COUNTRIES,
  DEFAULT_COUNTRY,
  PHONE_LENGTH_RULES,
  DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES,
  UNSTYLED_INTERNATIONAL_PHONE_INPUT_CLASSES,
} from "../constants.js";

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

  /**
   * The list is a packed string now — `<ISO2><dial>|<name>` joined by `~` —
   * unpacked at module load, which is 2.16 KB gzipped smaller than the array of
   * object literals it replaced. These are the invariants the packing rests on:
   * a two-character code, a numeric dial code, and the two fields that are
   * derived rather than stored. A hand-edit to the string that breaks any of
   * them would otherwise show up as one wrong flag in one dropdown row.
   */
  it("unpacks every row into the shape the packing derives", () => {
    expect(DEFAULT_COUNTRIES).toHaveLength(193);
    const broken = DEFAULT_COUNTRIES.filter(
      (country) =>
        country.value.length !== 2 ||
        country.flag !== country.value.toLowerCase() ||
        !/^\+\d+$/.test(country.dialCode) ||
        country.label !== `${country.name} (${country.dialCode})` ||
        country.name.length === 0,
    );
    expect(broken).toEqual([]);
  });

  it("has no duplicate country code", () => {
    const codes = DEFAULT_COUNTRIES.map((country) => country.value);
    expect(new Set(codes).size).toBe(codes.length);
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

/**
 * ADR 002 R6: `countrySelect` holds SearchableDropdown's own bag, so walking
 * the top level alone would skip every class inside it — which is precisely
 * where `unstyled` has to keep working.
 */
const flatten = (bag: object, prefix = ""): [string, string][] =>
  Object.entries(bag).flatMap(([k, v]) =>
    typeof v === "string"
      ? [[prefix + k, v] as [string, string]]
      : v && typeof v === "object"
        ? flatten(v as object, `${prefix}${k}.`)
        : [],
  );

describe("DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES", () => {
  it("has all required class keys", () => {
    const keys = ["root", "label", "description", "control", "input", "message",
      "itemRow", "itemIcon", "itemText", "triggerRow", "flag", "value"] as const;
    for (const key of keys) {
      expect(DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES).toHaveProperty(key);
    }
  });

  /**
   * ADR 002 R6: `countrySelect` is SearchableDropdown's own bag, not a string.
   * This replaces the old flat-key propagation check — it asserts the child's
   * slots are present in BOTH paths, so `unstyled` cannot quietly stop at the
   * boundary while `classes` keeps crossing it.
   */
  it("hands the country picker a child bag on both the styled and unstyled path", () => {
    for (const set of [DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES, UNSTYLED_INTERNATIONAL_PHONE_INPUT_CLASSES]) {
      const child = set.countrySelect;
      expect(typeof child, "countrySelect must carry the child's bag, not a string").toBe("object");
      for (const slot of ["trigger", "content", "item", "list", "icon", "searchControl", "searchInput", "searchIcon", "itemIndicator", "empty"]) {
        expect(child, `countrySelect.${slot} missing`).toHaveProperty(slot);
      }
    }
    // and unstyled must actually have stripped the child's decoration
    const styled = (DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES.countrySelect as Record<string, string>).content;
    const bare = (UNSTYLED_INTERNATIONAL_PHONE_INPUT_CLASSES.countrySelect as Record<string, string>).content;
    expect(styled).toContain("shadow-lg");
    expect(bare, "unstyled stopped at the R6 boundary").not.toContain("shadow-lg");
    expect(bare, "unstyled dropped the child's structural utilities").toContain("overflow-hidden");
  });
});

describe("UNSTYLED_INTERNATIONAL_PHONE_INPUT_CLASSES", () => {
  // Was: "all class values are empty strings". That invariant WAS the defect
  // ADR 001 describes — it made `unstyled` strip layout along with decoration,
  // so an unstyled phone input lost `flex flex-col` and stacked wrong. The set
  // is now derived from the defaults, and the invariant is the split itself.
  it("every value carries only structural utilities", () => {
    for (const [key, value] of flatten(UNSTYLED_INTERNATIONAL_PHONE_INPUT_CLASSES)) {
      const decorative = value.split(/\s+/).filter((t) => t && !isStructural(t));
      expect(decorative, `${key} kept decorative utilities`).toEqual([]);
    }
  });

  it("keeps every structural utility its default declares", () => {
    const unstyled = new Map(flatten(UNSTYLED_INTERNATIONAL_PHONE_INPUT_CLASSES));
    for (const [key, value] of flatten(DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES)) {
      const expected = value.split(/\s+/).filter((t) => t && isStructural(t));
      const actual = new Set((unstyled.get(key) ?? "").split(/\s+/).filter(Boolean));
      const dropped = expected.filter((t) => !actual.has(t));
      expect(dropped, `${key} dropped structural utilities`).toEqual([]);
    }
  });
});
