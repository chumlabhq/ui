import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <Accordion type="single" collapsible orientation="horizontal" defaultValue="h-1">
                <AccordionItem value="h-1">
                  <AccordionTrigger>Overview</AccordionTrigger>
                  <AccordionContent>The first panel, opened along the inline axis.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="h-2">
                  <AccordionTrigger>Details</AccordionTrigger>
                  <AccordionContent>Arrow Left and Right move between the triggers here.</AccordionContent>
                </AccordionItem>
              </Accordion>
  );
}
