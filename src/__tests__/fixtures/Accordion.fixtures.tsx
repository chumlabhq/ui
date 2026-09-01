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

const fixtures: Fixtures = [
  { name: "single-open", props: { type: "single", collapsible: true, defaultValue: "one" }, children: items },
  { name: "bordered", props: { type: "single", variant: "bordered", defaultValue: "one" }, children: items },
  { name: "separated", props: { type: "single", variant: "separated", defaultValue: "one" }, children: items },
  { name: "flush", props: { type: "single", variant: "flush", defaultValue: "one" }, children: items },
  { name: "multiple", props: { type: "multiple", defaultValue: ["one", "two"] }, children: items },
  { name: "headings", props: { type: "single", headingLevel: 3, defaultValue: "one" }, children: items },
  { name: "disabled", props: { type: "single", disabled: true }, children: items },
];
export default fixtures;
