import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <Accordion
      type="multiple"
      maxExpanded={2}
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent dark:text-cl-text dark:hover:bg-cl-bg-elevated dark:focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg",
          content: "px-4 py-4 text-sm text-cl-text-secondary",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
    >
      <AccordionItem value="max-1">
        <AccordionTrigger>First (open me)</AccordionTrigger>
        <AccordionContent>You can open up to 2 items at once.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="max-2">
        <AccordionTrigger>Second (open me too)</AccordionTrigger>
        <AccordionContent>Two items are now open.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="max-3">
        <AccordionTrigger>Third (blocked when 2 are open)</AccordionTrigger>
        <AccordionContent>Close one of the others first.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
