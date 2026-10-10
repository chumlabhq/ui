import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <div className="flex flex-col gap-8">
      {
        (["default", "bordered", "separated", "flush"] as const).map((variant) => (
          <div key={variant}>
            <div className="eyebrow mb-2">
              {variant}
            </div>
            <Accordion
              selectionMode="single"
              collapsible
              variant={variant}
              defaultValue={`v-${variant}`}
            >
              <AccordionItem value={`v-${variant}`}>
                <AccordionTrigger>Shipping</AccordionTrigger>
                <AccordionContent>Dispatched within two working days.</AccordionContent>
              </AccordionItem>
              <AccordionItem value={`v-${variant}-2`}>
                <AccordionTrigger>Returns</AccordionTrigger>
                <AccordionContent>Thirty days, unworn, receipt not required.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))
      }
    </div>
  );
}
