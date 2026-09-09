import { Accordion } from "../../components/Accordion/index.js";
import AccordionItem from "../../components/Accordion/components/AccordionItem.js";
import AccordionTrigger from "../../components/Accordion/components/AccordionTrigger.js";
import AccordionContent from "../../components/Accordion/components/AccordionContent.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";

/** The parts under `item` only exist when real items are nested inside. */
const items = (
  <>
    <AccordionItem value="one">
      <AccordionTrigger subtitle="Subtitle" leftSlot={<span>L</span>} rightSlot={<span>R</span>}>
        First
      </AccordionTrigger>
      <AccordionContent>First body</AccordionContent>
    </AccordionItem>
    <AccordionItem value="two" disabled>
      <AccordionTrigger>Second</AccordionTrigger>
      <AccordionContent>Second body</AccordionContent>
    </AccordionItem>
  </>
);

/**
 * Reproduces the axe violation: focusable content inside an aria-hidden slot.
 * A focusable span, not a button — nesting a button inside the trigger button
 * is invalid HTML and a different defect again.
 */
const focusableSlots = (
  <AccordionItem value="one">
    <AccordionTrigger leftSlot={<span tabIndex={0}>L</span>}>
      First
    </AccordionTrigger>
    <AccordionContent>Body</AccordionContent>
  </AccordionItem>
);

const fixtures: Fixtures<typeof Accordion> = [
  {
    name: "focusable-slot",
    // headingLevel 2: audited in isolation the trigger's default h3 has no h2
    // above it, which axe reads as a skipped level — an artefact of the scope,
    // not the component.
    props: { type: "single", collapsible: true, defaultValue: "one", headingLevel: 2 },
    children: focusableSlots,
    note: "A focusable node in an aria-hidden trigger slot — two critical axe violations before the slots were made inert.",
  },
  { name: "single-open", props: { type: "single", collapsible: true, defaultValue: "one" }, children: items },
  { name: "bordered", props: { type: "single", variant: "bordered", defaultValue: "one" }, children: items },
  { name: "separated", props: { type: "single", variant: "separated", defaultValue: "one" }, children: items },
  { name: "flush", props: { type: "single", variant: "flush", defaultValue: "one" }, children: items },
  { name: "multiple", props: { type: "multiple", defaultValue: ["one", "two"] }, children: items },
  { name: "headings", props: { type: "single", headingLevel: 3, defaultValue: "one" }, children: items },
  { name: "disabled", props: { type: "single", disabled: true }, children: items },
  {
    name: "announced",
    props: { type: "single", collapsible: true, defaultValue: "one", announceExpanded: true },
    children: items,
    note: "Adds a live region that announces the expanded panel; nothing rendered it before.",
  },
  {
    name: "classes-override",
    props: {
      type: "single",
      collapsible: true,
      defaultValue: "one",
      // A consumer restyling one slot, written the way the demo pages write it:
      // spacing and colour, and no cursor or focus ring of its own. `classes`
      // used to REPLACE the slot, so this rendered a trigger with no pointer
      // cursor and no focus indicator — a WCAG 2.4.7 failure on any override.
      // No fixture passed a `classes` value at all, so the cursor and
      // focus-ring gates rendered only un-overridden markup and reported green
      // while every demo page was wrong.
      classes: { trigger: "px-6 py-3 bg-cl-bg-elevated" },
    },
    children: items,
    note: "The only fixture that overrides a slot; without it the cursor and focus-ring gates never see the case the defect lived in.",
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
