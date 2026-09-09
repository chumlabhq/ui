import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="pc-1"
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent dark:text-cl-text dark:hover:bg-cl-bg-elevated dark:focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
      preventClose={
        (value) => {
          return !window.confirm(
            `Close "${value}"? You have unsaved changes.`,
          );
        }
      }
    >
      <AccordionItem value="pc-1">
        <AccordionTrigger>Try closing me</AccordionTrigger>
        <AccordionContent>
          A confirmation dialog will appear before this closes.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="pc-2">
        <AccordionTrigger>Another guarded item</AccordionTrigger>
        <AccordionContent>Same guard applies to all items.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
