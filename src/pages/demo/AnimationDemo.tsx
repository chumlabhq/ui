import { useState } from "react";
import { Section, CodeBlock, DemoWrapper } from "./components/index.js";
import { Dropdown } from "../../components/Dropdown/index.js";

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
            <code className="font-mono text-[12px] text-accent">transition-colors</code>{" "}
            for color, background, and border; the components that pin a
            duration use{" "}
            <code className="font-mono text-[12px] text-accent">duration-200</code>.
          </li>
          <li>
            <span className="text-fg font-medium">Drawer slide</span>:{" "}
            <code className="font-mono text-[12px] text-accent">
              cubic-bezier(0.32, 0.72, 0, 1)
            </code>{" "}
            — feels like a soft material. Modal is plainer: an opacity and
            scale transition over{" "}
            <code className="font-mono text-[12px] text-accent">animationDuration</code>,
            200ms by default.
          </li>
          <li>
            <span className="text-fg font-medium">Accordion expand</span>: a{" "}
            <code className="font-mono text-[12px] text-accent">max-height</code>{" "}
            and opacity transition, 300ms{" "}
            <code className="font-mono text-[12px] text-accent">ease-in-out</code>{" "}
            by default. It measures: the panel reads its own{" "}
            <code className="font-mono text-[12px] text-accent">scrollHeight</code>{" "}
            on open, because a height transition cannot animate to{" "}
            <code className="font-mono text-[12px] text-accent">auto</code>.
          </li>
          <li>
            <span className="text-fg font-medium">Toast stack</span>: slide-in +
            fade over{" "}
            <code className="font-mono text-[12px] text-accent">animationDuration</code>,
            500ms by default; auto-dismiss and manual close share the same exit
            transition.
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
          Modal takes{" "}
          <code className="font-mono text-[12px] text-accent">disableAnimation</code>{" "}
          to drop its defaults entirely, and both Modal and Toast take{" "}
          <code className="font-mono text-[12px] text-accent">animationDuration</code>{" "}
          to retime them, so your motion library doesn&rsquo;t fight them.
          Drawer and Tooltip expose neither — override their transitions
          through{" "}
          <code className="font-mono text-[12px] text-accent">classes</code>{" "}
          instead.
        </p>
      </Section>

      <Section
        title="Keeping the node for an exit"
        description="A closed surface is unmounted, so there is nothing left to animate out. `keepMounted` leaves it in the DOM, hidden, and lets your exit transition play."
      >
        <CodeBlock
          code={`// Without keepMounted the element is gone before the transition starts.
<Dropdown options={options} keepMounted />`}
        />
        <KeepMountedExample />
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          Close both menus and inspect the DOM. The first has removed its
          listbox entirely; the second still has one, carrying{" "}
          <code className="font-mono text-[12px] text-accent">display: none</code>.
          That surviving node is what an exit animation, a measurement, or a
          test query needs. It is also a node the browser keeps laying out, so
          it is opt-in rather than the default.
        </p>
      </Section>
    </div>
  );
};

const KEEP_OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry" },
];

/**
 * Two identical dropdowns differing only in `keepMounted`. The difference is
 * visible only once both are closed, which is the whole point of the prop.
 */
const KeepMountedExample = () => {
  const [count, setCount] = useState<number | null>(null);
  return (
    <DemoWrapper className="mt-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="eyebrow mb-2">default — unmounts when closed</div>
          <Dropdown options={KEEP_OPTIONS} placeholder="Pick a fruit" />
        </div>
        <div>
          <div className="eyebrow mb-2">keepMounted — stays, hidden</div>
          <Dropdown options={KEEP_OPTIONS} placeholder="Pick a fruit" keepMounted />
        </div>
      </div>
      <button
        type="button"
        className="mt-6 text-[13px] text-accent underline underline-offset-4"
        onClick={() =>
          setCount(document.querySelectorAll("[role='listbox']").length)
        }
      >
        Count the listboxes in the document
      </button>
      {count !== null && (
        <p className="mt-2 text-[13px] text-fg-secondary">
          {count} listbox{count === 1 ? "" : "es"} in the DOM right now — close
          both menus and count again.
        </p>
      )}
    </DemoWrapper>
  );
};

export default AnimationDemo;
