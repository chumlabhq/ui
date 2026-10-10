import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <div className="eyebrow mb-2">loop</div>
        <Accordion selectionMode="single" collapsible loop>
          <AccordionItem value="loop-1">
            <AccordionTrigger>First</AccordionTrigger>
            <AccordionContent>Wraps round to First from Last.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="loop-2">
            <AccordionTrigger>Last</AccordionTrigger>
            <AccordionContent>ArrowDown here goes back to First.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <div className="eyebrow mb-2">
          loop=
          {"{false}"}
          (default)
        </div>
        <Accordion selectionMode="single" collapsible loop={false}>
          <AccordionItem value="noloop-1">
            <AccordionTrigger>First</AccordionTrigger>
            <AccordionContent>Stops at the ends.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="noloop-2">
            <AccordionTrigger>Last</AccordionTrigger>
            <AccordionContent>ArrowDown here stays put.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
