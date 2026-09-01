import Toast from "../../components/Toast/Toast";
import { Dismissable } from "./_harness";
import type { Fixtures } from "./types";

const fixtures: Fixtures = [
  { name: "default", props: { message: "Saved" } },
  { name: "with-description", props: { message: "Saved", description: "Your changes are live." } },
  { name: "with-action", props: { message: "Saved", action: <button>Undo</button> } },
  { name: "variants", props: { message: "Saved", variant: "success", showProgress: true } },
  {
    name: "dismissable",
    props: {},
    note: "Toast never unmounts itself; `onRemove` is the host's job, so a fixture that can be closed needs an owner.",
    render: () => (
      <Dismissable>
        {(onRemove) => (
          <Toast id="fixture-toast" message="Saved" duration={Infinity} onRemove={onRemove} />
        )}
      </Dismissable>
    ),
  },
];
export default fixtures;
