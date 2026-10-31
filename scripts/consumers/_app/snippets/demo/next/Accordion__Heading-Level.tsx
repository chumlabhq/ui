import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

const level = 2;

export default function AccordionExample() {
  return (
    <Accordion
      selectionMode="single"
      collapsible
      headingLevel={level}
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-start text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
    >
      <AccordionItem value={`hl-${level}`}>
        <AccordionTrigger>
          Trigger wrapped in h
          {level}
        </AccordionTrigger>
        <AccordionContent>
          Content under an h
          {level}
          heading.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
