import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@chumlab/ui/accordion";

export default function FAQ() {
  return (
    <Accordion type="single" collapsible defaultValue="q1">
      <AccordionItem value="q1">
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <AccordionContent>
          You can return any item within 30 days of purchase.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger>How long does shipping take?</AccordionTrigger>
        <AccordionContent>
          Standard shipping takes 3-5 business days.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
