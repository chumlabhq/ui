import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <>
      <Accordion
        type="single"
        collapsible
        disabled
        classes={
          {
            root: "w-full",
            item: "border-b border-cl-border last:border-b-0",
            trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
            icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
          }
        }
      >
        <AccordionItem value="d-1">
          <AccordionTrigger>Disabled Item 1</AccordionTrigger>
          <AccordionContent>Content.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="d-2">
          <AccordionTrigger>Disabled Item 2</AccordionTrigger>
          <AccordionContent>Content.</AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        type="single"
        collapsible
        classes={
          {
            root: "w-full",
            item: "border-b border-cl-border last:border-b-0",
            trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
            icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
          }
        }
      >
        <AccordionItem value="di-1">
          <AccordionTrigger>Enabled Item</AccordionTrigger>
          <AccordionContent>This works.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="di-2" disabled>
          <AccordionTrigger>Disabled Item</AccordionTrigger>
          <AccordionContent>Can&apos;t open this.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="di-3">
          <AccordionTrigger>Another Enabled</AccordionTrigger>
          <AccordionContent>This also works.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
