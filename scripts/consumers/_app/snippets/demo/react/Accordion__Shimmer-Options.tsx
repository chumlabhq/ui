import { AccordionShimmer } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  return (
    <>
      <AccordionShimmer count={3} showContent />
      <AccordionShimmer count={2} animate={false} />
      <AccordionShimmer count={2} size="sm" />
    </>
  );
}
