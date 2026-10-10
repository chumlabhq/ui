import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <>
      <Accordion selectionMode="single" defaultValue="basic-1" collapsible>
        <AccordionItem value="basic-1">
          <AccordionTrigger>What is React?</AccordionTrigger>
          <AccordionContent>
            React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="basic-2">
          <AccordionTrigger>What is TypeScript?</AccordionTrigger>
          <AccordionContent>
            TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="basic-3">
          <AccordionTrigger>What is Tailwind CSS?</AccordionTrigger>
          <AccordionContent>
            Tailwind CSS is a utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
