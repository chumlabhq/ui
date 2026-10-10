import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, MinusIcon, PlusIcon } from "@chumlab/ui/accordion";

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
            trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
            icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
          }
        }
      >
        <AccordionItem value="anim-rotate">
          <AccordionTrigger iconAnimation="rotate">
            Toggle to see rotate animation
          </AccordionTrigger>
          <AccordionContent>The chevron rotates 180 degrees.</AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        selectionMode="single"
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
        <AccordionItem value="anim-switch">
          <AccordionTrigger
            iconAnimation="switch"
            expandedIcon={<MinusIcon className="w-4 h-4 text-cl-text-secondary" />}
            collapsedIcon={<PlusIcon className="w-4 h-4 text-cl-text-secondary" />}
          >
            Toggle to see switch animation
          </AccordionTrigger>
          <AccordionContent>Icon swaps between plus and minus.</AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        selectionMode="single"
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
        <AccordionItem value="anim-none">
          <AccordionTrigger iconAnimation="none">Toggle with no animation</AccordionTrigger>
          <AccordionContent>Icon has no transition.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
