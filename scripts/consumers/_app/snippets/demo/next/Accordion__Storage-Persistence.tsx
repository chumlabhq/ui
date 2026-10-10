import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <Accordion
      selectionMode="multiple"
      storageKey="accordion-demo-persist"
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
    >
      <AccordionItem value="persist-1">
        <AccordionTrigger>Persistent Item 1</AccordionTrigger>
        <AccordionContent>
          Expand this item and refresh the page — it will remain open.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="persist-2">
        <AccordionTrigger>Persistent Item 2</AccordionTrigger>
        <AccordionContent>
          State is saved to localStorage under the key &quot;accordion-demo-persist&quot;.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="persist-3">
        <AccordionTrigger>Persistent Item 3</AccordionTrigger>
        <AccordionContent>Clear localStorage to reset the state.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
