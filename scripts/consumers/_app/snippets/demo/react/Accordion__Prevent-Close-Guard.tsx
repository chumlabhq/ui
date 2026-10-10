import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";
import { Switch } from "@chumlab/ui/switch";

export default function AccordionExample() {
  const [guardUnsaved, setGuardUnsaved] = useState(true);
  const [guardDecision, setGuardDecision] = useState("not fired yet");
  return (
    <>
      <Switch
        label="Unsaved changes"
        checked={guardUnsaved}
        onCheckedChange={setGuardUnsaved}
      />
      <Accordion
        selectionMode="single"
        collapsible
        defaultValue="pc-1"
        classes={
          {
            root: "w-full",
            item: "border-b border-cl-border last:border-b-0",
            trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
            icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
          }
        }
        preventClose={
          (value) => {
            setGuardDecision(JSON.stringify({ value, prevented: guardUnsaved }));
            return guardUnsaved;
          }
        }
      >
        <AccordionItem value="pc-1">
          <AccordionTrigger>Try closing me</AccordionTrigger>
          <AccordionContent>
            While "Unsaved changes" is on, the guard keeps this open.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="pc-2">
          <AccordionTrigger>Another guarded item</AccordionTrigger>
          <AccordionContent>Same guard applies to all items.</AccordionContent>
        </AccordionItem>
      </Accordion>
      <div
        className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        preventClose:
        {guardDecision}
      </div>
    </>
  );
}
