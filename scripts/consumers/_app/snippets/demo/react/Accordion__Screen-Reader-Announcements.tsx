import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <Accordion
      type="multiple"
      announceExpanded
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
    >
      <AccordionItem value="ann-1">
        <AccordionTrigger>Toggle me (check screen reader)</AccordionTrigger>
        <AccordionContent>Screen readers will announce the state change.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="ann-2">
        <AccordionTrigger>Another item</AccordionTrigger>
        <AccordionContent>Announces count of expanded items.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
