import { OtpInput } from "../../components/OtpInput/index.js";
import type { Fixtures } from "./types.js";

const fixtures: Fixtures<typeof OtpInput> = [
  { name: "default", props: { length: 4 } },
  { name: "labelled", props: { length: 4, label: "Code", description: "Check your email." } },
  { name: "with-value", props: { length: 4, defaultValue: "12" } },
  { name: "error", props: { length: 4, label: "Code", error: true, errorMessage: "Wrong code" } },
  { name: "success", props: { length: 4, label: "Code", success: true, successMessage: "Verified" } },
  { name: "disabled", props: { length: 4, disabled: true } },
  { name: "loading", props: { length: 4, loading: true } },
  { name: "grouped", props: { length: 4, groups: [2, 2], separator: "-" }, note: "group and separator only exist when `groups` splits the field." },
  { name: "required", props: { length: 4, label: "Code", required: true } },
];
export default fixtures;
