import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Dropdown } from "@chumlab/ui/dropdown";
import { Modal } from "@chumlab/ui/modal";
import { Tooltip } from "@chumlab/ui/tooltip";

/**
 * The four machines StrictMode's double invocation is hardest on: a portalled
 * anchored surface (Dropdown), a focus trap (Modal), a hover surface with a
 * timer (Tooltip), and the measure-then-settle frame every floating surface
 * runs before its first paint.
 */
const OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

export default function StrictShowcase() {
  const [open, setOpen] = useState(false);
  return (
    <main>
      <h1>chumlab-consumer-smoke</h1>
      <Button>Save</Button>
      <Dropdown options={OPTIONS} label="Fruit" />
      <Tooltip content="Tip">
        <button data-probe="tooltip-trigger">Hover</button>
      </Tooltip>
      <button data-probe="open-modal" onClick={() => setOpen(true)}>
        open modal
      </button>
      <Modal open={open} onOpenChange={setOpen} title="Title">
        <p>Body</p>
      </Modal>
    </main>
  );
}
