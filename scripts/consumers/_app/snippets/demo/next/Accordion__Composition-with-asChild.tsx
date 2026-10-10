import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <Accordion selectionMode="single" collapsible defaultValue="ac-1">
      <AccordionItem value="ac-1">
        <AccordionTrigger asChild>
          <button
            className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium cursor-pointer text-cl-text hover:bg-cl-bg-hover"
          >
            Your own button, styled your way
          </button>
        </AccordionTrigger>
        <AccordionContent>
          `asChild` hands the trigger&rsquo;s props to the element you pass, so this is your markup with the accordion&rsquo;s keyboard handling and `aria-expanded` on it.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="ac-2">
        <AccordionTrigger>An ordinary trigger</AccordionTrigger>
        <AccordionContent>
          Both behave identically; only the rendered element differs.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
