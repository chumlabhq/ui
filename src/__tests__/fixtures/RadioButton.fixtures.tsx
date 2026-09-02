import { RadioGroup } from "../../components/RadioButton";
import { RadioButton } from "../../components/RadioButton";
import type { Fixtures } from "./types";

/**
 * RadioGroup takes RadioButton children, not an `options` array — passing
 * `options` renders an empty group, which is how its radio-level classes went
 * unexercised.
 */
const radios = (
  <>
    <RadioButton value="a" label="Apple" description="A fruit" />
    <RadioButton value="b" label="Banana" />
    <RadioButton value="c" label="Cherry" disabled />
  </>
);

const fixtures: Fixtures<typeof RadioGroup> = [
  { name: "default", props: {}, children: radios },
  { name: "labelled", props: { label: "Fruit", description: "Pick one." }, children: radios },
  { name: "with-value", props: { defaultValue: "a" }, children: radios },
  { name: "error", props: { label: "Fruit", error: true, errorMessage: "Required" }, children: radios },
  { name: "success", props: { label: "Fruit", success: true, successMessage: "Saved" }, children: radios },
  { name: "disabled", props: { disabled: true }, children: radios },
  { name: "loading", props: { loading: true }, children: radios },
  { name: "horizontal", props: { orientation: "horizontal" }, children: radios },
];
export default fixtures;
