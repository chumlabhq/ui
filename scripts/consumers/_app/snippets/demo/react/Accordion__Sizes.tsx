import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

const size = "sm";

export default function AccordionExample() {
  return (
    <Accordion
      type="single"
      collapsible
      size={size}
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          itemText: "flex-1 text-left",
          content: "overflow-hidden transition-[max-height,opacity,visibility]",
          icon: "shrink-0",
          description: "font-normal mt-0.5 text-cl-text-tertiary",
          header: ""
        }
      }
    >
      <AccordionItem value={`${size}-1`}>
        <AccordionTrigger>First Item</AccordionTrigger>
        <AccordionContent>
          Content in
          {size}
          size.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value={`${size}-2`}>
        <AccordionTrigger>Second Item</AccordionTrigger>
        <AccordionContent>
          More content in
          {size}
          size.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
