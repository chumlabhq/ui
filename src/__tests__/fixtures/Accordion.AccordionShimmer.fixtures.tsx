import { AccordionShimmer } from "../../components/Accordion";
import type { Fixtures } from "./types";

/**
 * ADR 002: Accordion never renders AccordionShimmer — ACCORDION.ai.md:351 shows
 * the consumer writing it directly — so it carries its own anatomy and its own
 * fixtures, and the contract tier picks it up like any other component.
 */
const fixtures: Fixtures<typeof AccordionShimmer> = [
  { name: "default", props: {} },
  { name: "with-content", props: { showContent: true } },
  { name: "single", props: { count: 1 } },
  { name: "small", props: { size: "sm" } },
  { name: "bordered", props: { variant: "bordered" } },
  { name: "static", props: { animate: false } },
];

export default fixtures;
