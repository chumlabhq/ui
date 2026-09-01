import { RadioGroup } from "../../components/RadioButton";
import type { Fixtures } from "./types";

/**
 * The radio itself, not the group. Its nine keys live in DEFAULT_RADIO_CLASSES,
 * a second class set on the same barrel that the registry used to skip — which
 * is how they went unchecked while fixtures.contract stayed green.
 */
const inGroup = (node: React.ReactNode) => <RadioGroup>{node}</RadioGroup>;

const fixtures: Fixtures = [
  { name: "default", props: { value: "a", label: "Apple" }, wrap: inGroup },
  { name: "described", props: { value: "a", label: "Apple", description: "A fruit" }, wrap: inGroup },
  { name: "disabled", props: { value: "a", label: "Apple", disabled: true }, wrap: inGroup },
  {
    name: "checked",
    props: { value: "a", label: "Apple" },
    wrap: (node) => <RadioGroup defaultValue="a">{node}</RadioGroup>,
  },
  {
    name: "error",
    props: { value: "a", label: "Apple" },
    wrap: (node) => <RadioGroup error errorMessage="Required">{node}</RadioGroup>,
  },
  {
    name: "loading",
    props: { value: "a", label: "Apple" },
    wrap: (node) => <RadioGroup loading>{node}</RadioGroup>,
  },
];
export default fixtures;
