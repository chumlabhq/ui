import { InternationalPhoneInput } from "../../components/InternationalPhoneInput";
import { fireEvent } from "@testing-library/react";
import { tick } from "./_act";
import type { Fixtures } from "./types";

const fixtures: Fixtures<typeof InternationalPhoneInput> = [
  { name: "default", props: {} },
  { name: "labelled", props: { label: "Phone", description: "Include country code." } },
  { name: "with-value", props: { defaultValue: { countryCode: "GB", phoneNumber: "2071234567" }, clearable: true } },
  { name: "country-open", props: {}, act: (c) => {
      const btn = c.querySelector("[role='combobox'], button");
      if (btn) fireEvent.click(btn);
    } },
  {
    name: "country-no-results",
    props: {},
    note: "Attempts countrySelectNoResults: open the country list, then type a string no country matches.",
    act: async (c) => {
      const btn = c.querySelector("[role='combobox'], button");
      if (btn) fireEvent.click(btn);
      await tick();
      const search = c.ownerDocument.querySelector("input[type='text'], input[role='searchbox']");
      if (search) fireEvent.change(search, { target: { value: "zzzzzznotacountry" } });
      await tick();
    },
  },
  { name: "error", props: { label: "Phone", error: true, errorMessage: "Invalid" } },
  { name: "success", props: { label: "Phone", success: true, successMessage: "Valid" } },
  { name: "disabled", props: { disabled: true } },
  { name: "readonly", props: { readOnly: true } },
  { name: "loading", props: { loading: true } },
];
export default fixtures;
