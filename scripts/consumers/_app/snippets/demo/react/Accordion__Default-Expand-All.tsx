import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <Accordion
      selectionMode="multiple"
      defaultExpandAll
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-start text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
    >
      <AccordionItem value="dea-1">
        <AccordionTrigger>All items start open</AccordionTrigger>
        <AccordionContent>This was expanded on mount.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="dea-2">
        <AccordionTrigger>Second item</AccordionTrigger>
        <AccordionContent>Also expanded on mount.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
