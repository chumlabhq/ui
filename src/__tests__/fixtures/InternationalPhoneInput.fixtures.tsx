import { InternationalPhoneInput } from "../../components/InternationalPhoneInput/index.js";
import type { Fixtures } from "./types.js";

const fixtures: Fixtures<typeof InternationalPhoneInput> = [
  { name: "default", props: {} },
  { name: "labelled", props: { label: "Phone", description: "Include country code." } },
  { name: "with-value", props: { defaultValue: { countryCode: "GB", phoneNumber: "2071234567" }, clearable: true } },
  {
    name: "country-open",
    props: {},
    act: (c, ui) => ui.click(c.querySelector("[role='combobox'], button")),
  },
  {
    name: "country-no-results",
    props: {},
    note: "Attempts countrySelectNoResults: open the country list, then type a string no country matches.",
    act: async (c, ui) => {
      ui.click(c.querySelector("[role='combobox'], button"));
      await ui.settle();
      ui.change(
        c.ownerDocument.querySelector("input[type='text'], input[role='searchbox']"),
        "zzzzzznotacountry",
      );
      await ui.settle();
    },
  },
  { name: "error", props: { label: "Phone", error: true, errorMessage: "Invalid" } },
  { name: "success", props: { label: "Phone", success: true, successMessage: "Valid" } },
  { name: "disabled", props: { disabled: true } },
  { name: "readonly", props: { readOnly: true } },
  { name: "loading", props: { loading: true } },
  { name: "required", props: { label: "Phone", required: true } },
];
export default fixtures;
