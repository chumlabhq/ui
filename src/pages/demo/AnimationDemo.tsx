import { Section, CodeBlock } from "./components";

const AnimationDemo = () => {
  return (
    <div className="space-y-12">
      <header>
        <div className="eyebrow mb-3">Guides</div>
        <div className="rule rule-t mb-8" />
        <h1
          className="font-sans font-medium text-fg mb-5 leading-[1.05]"
          style={{
            fontSize: "clamp(36px, 6vw, 56px)",
            letterSpacing: "-0.03em",
          }}
        >
          Animation.
        </h1>
        <p className="text-[15.5px] text-fg-secondary leading-[1.6] max-w-2xl">
          Built-in transitions, easing curves you can override, and how to
          plug in your own motion library without fighting our defaults.
        </p>
      </header>

      <Section
        title="Defaults"
        description="Every animated primitive ships with sensible defaults — quick, never bouncy."
      >
        <ul className="space-y-2 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl list-disc pl-5 marker:text-accent">
          <li>
            <span className="text-fg font-medium">Hover transitions</span>:{" "}
            <code className="font-mono text-[12px] text-accent">200ms ease-out</code>{" "}
            for color, background, and border.
          </li>
          <li>
            <span className="text-fg font-medium">Mount/unmount</span>:{" "}
            <code className="font-mono text-[12px] text-accent">
              cubic-bezier(0.32, 0.72, 0.24, 1)
            </code>{" "}
            for overlays and drawers — feels like a soft material.
          </li>
          <li>
            <span className="text-fg font-medium">Accordion expand</span>:
            CSS Grid <code className="font-mono text-[12px] text-accent">grid-template-rows: 0fr → 1fr</code>{" "}
            — measured-free, no JS layout reads.
          </li>
          <li>
            <span className="text-fg font-medium">Toast stack</span>:
            slide-in + fade, 300ms; auto-dismiss + manual close share the
            same exit transition.
          </li>
        </ul>
      </Section>

      <Section
        title="Reduced motion"
        description="Every transition collapses to instant snap-to-final-state when the user opts out."
      >
        <CodeBlock
          code={`@media (prefers-reduced-motion: reduce) {
  .my-component {
    transition: none !important;
    animation: none !important;
  }
}`}
        />
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          You don&rsquo;t need to wire this up yourself — Chumlab UI honours
          the OS preference automatically. Custom CSS you write on top of
          a primitive should follow the same rule.
        </p>
      </Section>

      <Section
        title="Bring your own motion"
        description="Use Framer Motion, Motion One, or anything else by passing className or rendering inside a motion wrapper."
      >
        <CodeBlock
          code={`import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@chumlab/ui";

<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Modal open={open} onOpenChange={setOpen}>
        ...
      </Modal>
    </motion.div>
  )}
</AnimatePresence>`}
        />
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          Most overlay primitives accept an{" "}
          <code className="font-mono text-[12px] text-accent">animation=&quot;none&quot;</code>{" "}
          prop to disable defaults so your motion library doesn&rsquo;t
          fight them.
        </p>
      </Section>
    </div>
  );
};

export default AnimationDemo;
