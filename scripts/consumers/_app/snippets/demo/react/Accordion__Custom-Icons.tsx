import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, ChevronDownIcon, ChevronUpIcon, MinusIcon, PlusIcon } from "@chumlab/ui/accordion";

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
        <AccordionItem value="icon-1">
          <AccordionTrigger
            expandedIcon={<MinusIcon className="w-4 h-4 text-cl-text-secondary" />}
            collapsedIcon={<PlusIcon className="w-4 h-4 text-cl-text-secondary" />}
          >
            Click to expand
          </AccordionTrigger>
          <AccordionContent>Using Plus/Minus icons.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="icon-2">
          <AccordionTrigger
            expandedIcon={<MinusIcon className="w-4 h-4 text-cl-text-secondary" />}
            collapsedIcon={<PlusIcon className="w-4 h-4 text-cl-text-secondary" />}
          >
            Another section
          </AccordionTrigger>
          <AccordionContent>Content with custom icons.</AccordionContent>
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
        <AccordionItem value="left-1">
          <AccordionTrigger
            iconPosition="start"
            expandedIcon={<ChevronUpIcon className="w-4 h-4 text-cl-accent" />}
            collapsedIcon={<ChevronDownIcon className="w-4 h-4 text-cl-accent" />}
          >
            Icon on the left
          </AccordionTrigger>
          <AccordionContent>The icon is positioned before the title.</AccordionContent>
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
        <AccordionItem value="noicon-1">
          <AccordionTrigger iconPosition="none">No icon shown</AccordionTrigger>
          <AccordionContent>The icon is completely hidden.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
