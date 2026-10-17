import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <div className="w-full max-w-md">
      <Accordion selectionMode="single" defaultValue="address">
        <AccordionItem value="address">
          <AccordionTrigger>
            Can I change the delivery address after the order has left the warehouse?
          </AccordionTrigger>
          <AccordionContent>
            Yes, until the courier collects the parcel from the depot. After that, the courier's own redirection service is the only way to change it, and it may charge for the change.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="refund">
          <AccordionTrigger>
            How long does a refund take to reach a card issued outside the European Union?
          </AccordionTrigger>
          <AccordionContent>
            Five to ten working days after we receive the return.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
