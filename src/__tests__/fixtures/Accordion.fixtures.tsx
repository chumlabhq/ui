import { Accordion } from "../../components/Accordion";
import AccordionItem from "../../components/Accordion/components/AccordionItem";
import AccordionTrigger from "../../components/Accordion/components/AccordionTrigger";
import AccordionContent from "../../components/Accordion/components/AccordionContent";
import type { Fixtures } from "./types";

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
];
export default fixtures;
