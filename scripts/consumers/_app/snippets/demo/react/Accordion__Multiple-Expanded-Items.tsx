import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <Accordion
      type="multiple"
      defaultValue={["multi-1", "multi-2"]}
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent dark:text-cl-text dark:hover:bg-cl-bg-elevated dark:focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
    >
      <AccordionItem value="multi-1">
        <AccordionTrigger>First Section</AccordionTrigger>
        <AccordionContent>This section can be open along with others.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="multi-2">
        <AccordionTrigger>Second Section</AccordionTrigger>
        <AccordionContent>Both sections can be expanded at the same time.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="multi-3">
        <AccordionTrigger>Third Section</AccordionTrigger>
        <AccordionContent>Open or close any section independently.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
