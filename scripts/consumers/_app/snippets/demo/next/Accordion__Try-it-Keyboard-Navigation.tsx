import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
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
      <AccordionItem value="kb-1">
        <AccordionTrigger>Click here to focus, then use arrow keys</AccordionTrigger>
        <AccordionContent>Press Space or Enter to toggle.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="kb-2">
        <AccordionTrigger>Press Home to go to first</AccordionTrigger>
        <AccordionContent>Second item content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="kb-3">
        <AccordionTrigger>Press End to go to last</AccordionTrigger>
        <AccordionContent>Third item content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="kb-4">
        <AccordionTrigger>Navigation wraps around (loop=true)</AccordionTrigger>
        <AccordionContent>
          Pressing down on the last item moves to the first, and vice versa.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
