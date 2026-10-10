import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <Accordion
      selectionMode="single"
      defaultValue="nc-1"
      collapsible={false}
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
    >
      <AccordionItem value="nc-1">
        <AccordionTrigger>First Item (Always One Open)</AccordionTrigger>
        <AccordionContent>This accordion always keeps at least one item open.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="nc-2">
        <AccordionTrigger>Second Item</AccordionTrigger>
        <AccordionContent>
          Click me to switch - but you can&apos;t close everything.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
