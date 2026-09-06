import Toast from "../../components/Toast/Toast.js";
import { Dismissable } from "./_harness.js";
import type { Fixtures } from "./types.js";

const fixtures: Fixtures<typeof Toast> = [
  { name: "default", props: { id: "t1", onRemove: () => {}, message: "Saved" } },
  { name: "with-description", props: { id: "t2", onRemove: () => {}, message: "Saved", description: "Your changes are live." } },
  { name: "with-content", props: { id: "t3", onRemove: () => {}, message: "Saved", content: <button>Undo</button> }, note: "There is no `action` prop; extra nodes go through `content`." },
  { name: "success", props: { id: "t4", onRemove: () => {}, message: "Saved", type: "success", showProgress: true }, note: "The prop is `type`, not `variant`." },
  {
    name: "dismissable",
    props: { id: "t5", onRemove: () => {} },
    note: "Toast never unmounts itself; `onRemove` is the host's job, so a fixture that can be closed needs an owner.",
    render: () => (
      <Dismissable>
        {(onRemove) => (
          <Toast id="fixture-toast" message="Saved" duration={Infinity} onRemove={onRemove} />
        )}
      </Dismissable>
    ),
  },
  {
    name: "no-close-button",
    props: { id: "t6", onRemove: () => {}, message: "Saved", showCloseButton: false },
    note: "Removes the only interactive element in the toast.",
  },
];
export default fixtures;
