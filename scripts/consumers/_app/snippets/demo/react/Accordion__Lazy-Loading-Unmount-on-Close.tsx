import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <>
      <Accordion
        selectionMode="single"
        collapsible
        classes={
          {
            root: "w-full",
            item: "border-b border-cl-border last:border-b-0",
            trigger: "flex w-full items-center justify-between px-4 py-4 text-start text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
            icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
          }
        }
      >
        <AccordionItem value="lazy-1">
          <AccordionTrigger>Lazy Loaded Content</AccordionTrigger>
          <AccordionContent lazyLoad>
            This content was not in the DOM until you opened it.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        selectionMode="single"
        collapsible
        classes={
          {
            root: "w-full",
            item: "border-b border-cl-border last:border-b-0",
            trigger: "flex w-full items-center justify-between px-4 py-4 text-start text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
            icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
          }
        }
      >
        <AccordionItem value="unmount-1">
          <AccordionTrigger>Unmount on Close</AccordionTrigger>
          <AccordionContent keepMounted={false}>
            This content is removed from the DOM when closed.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
