import Toast from "../../components/Toast/Toast.js";
import { Dismissable } from "./_harness.js";
import type { Fixtures } from "./types.js";

const fixtures: Fixtures<typeof Toast> = [
  { name: "default", props: { id: "t1", onDismiss: () => {}, message: "Saved" } },
  { name: "with-description", props: { id: "t2", onDismiss: () => {}, message: "Saved", description: "Your changes are live." } },
  {
    name: "with-content",
    props: {
      id: "t3",
      onDismiss: () => {},
      message: "Saved",
      // Not a control. A bare `<button>` here fell back to the browser's focus
      // ring — `rgb(0, 95, 204)` in Chrome — which measures 1.75:1 on the
      // toast's surface; `contrast-painted` reported it from 2026-09-06 and it
      // was recorded as an accepted finding on 09-07. It was never a Toast
      // defect: the close button beside it rings correctly. Giving it a ring
      // here is worse — `unstyled.contract` then sees decorative utilities the
      // library cannot strip, because they are not the library's. The slot
      // takes arbitrary nodes, so the fixture models an arbitrary node;
      // interactive content inside a Toast is the consumer's to style.
      content: <span>Undo</span>,
    },
    note: "There is no `action` prop; extra nodes go through `content`.",
  },
  { name: "success", props: { id: "t4", onDismiss: () => {}, message: "Saved", variant: "success", showProgress: true } },
  {
    name: "dismissable",
    props: { id: "t5", onDismiss: () => {} },
    note: "Toast never unmounts itself; `onDismiss` is where the host removes it, so a fixture that can be closed needs an owner.",
    render: () => (
      <Dismissable>
        {(onDismiss) => (
          <Toast id="fixture-toast" message="Saved" duration={Infinity} onDismiss={onDismiss} />
        )}
      </Dismissable>
    ),
  },
  {
    name: "escape-dismissable",
    props: { id: "t7", onDismiss: () => {}, message: "Saved", duration: Infinity, closeOnEscape: true },
    note: "`ToastProvider` sets this on its newest toast. Escape runs the close button's path, so the owner removes it.",
    render: () => (
      <Dismissable>
        {(onDismiss) => (
          <Toast id="fixture-toast-escape" message="Saved" duration={Infinity} closeOnEscape onDismiss={onDismiss} />
        )}
      </Dismissable>
    ),
  },
  {
    name: "no-close-button",
    props: { id: "t6", onDismiss: () => {}, message: "Saved", showCloseButton: false },
    note: "Removes the only interactive element in the toast.",
  },
];
export default fixtures;
