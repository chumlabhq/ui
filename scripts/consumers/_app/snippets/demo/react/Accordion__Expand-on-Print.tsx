import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <Accordion
      selectionMode="single"
      collapsible
      expandOnPrint
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
    >
      <AccordionItem value="print-1">
        <AccordionTrigger>Visible in Print</AccordionTrigger>
        <AccordionContent>
          This content will be visible when printing, even if collapsed on screen.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="print-2">
        <AccordionTrigger>Also Visible in Print</AccordionTrigger>
        <AccordionContent>All collapsed content expands for print media.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
