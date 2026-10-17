import { useState, type FC } from "react";
import { Section, PropsTable, PropRow } from "./Section.js";
import { preClass, scrollableCode } from "./codeBlock.js";
import { Inline } from "./inlineMarkdown.js";
import { NextIcon, ReactIcon } from "./Icons.js";
import {
  COMPONENT_DOCS,
  type ComponentDoc,
  type MemberDoc,
  type PartLine,
  type PropDoc,
} from "../generated/componentDocs.js";

/**
 * The reference sections every component page carries after its examples:
 * API Reference, then Data attributes, Types and CSS custom properties where
 * the component has them, then Keyboard Interactions and Accessibility. The
 * page's Anatomy is `ComponentAnatomy`, before the examples.
 *
 * Read out of `generated/componentDocs.ts`, which is built from the same
 * schemas and .ai.md files `doc-truth.contract` gates. The pages used to carry
 * their own tables — 1595 hand-written `<PropRow>`s, 263 of which named
 * neither a prop, a `classes` slot nor a data attribute, with 223 real props
 * missing altogether. A second copy of an API is a copy that drifts.
 */
const cardClass = "rounded-2xl border border-border-faint bg-bg-elevated p-5";




const memberRows = (members: MemberDoc[]) =>
  members.map((member) => (
    <PropRow
      key={member.name}
      name={member.required ? `${member.name} *` : member.name}
      type={member.type}
      description={member.description}
    />
  ));

const propRows = (props: PropDoc[]) =>
  props.map((prop) => (
    <PropRow
      key={prop.name}
      name={prop.required ? `${prop.name} *` : prop.name}
      type={prop.type}
      defaultVal={prop.default ?? undefined}
      description={prop.description}
    />
  ));

export const ComponentDocs: FC<{ name: string }> = ({ name }) => {
  const doc: ComponentDoc | undefined = COMPONENT_DOCS[name];
  if (!doc) return null;

  return (
    <>
      <Section
        title="API Reference"
        description={`Generated from ${doc.name}.schema.json. Required props are marked with an asterisk. Standard HTML and ARIA attributes are forwarded to the underlying element and are not listed.`}
      >
        {/* Loader has no root props — all four loaders are sub-components — and
            an empty table with headers and no rows reads as a documentation
            gap rather than as a component that takes none. */}
        {doc.props.length > 0 && (
          <div className={cardClass}>
            <PropsTable>{propRows(doc.props)}</PropsTable>
          </div>
        )}
        {doc.subComponents.map((sub) => (
          <div key={sub.name} className="mt-6 first:mt-0">
            <h3 className="font-mono text-[13px] text-fg mb-3">{sub.name}</h3>
            <div className={cardClass}>
              <PropsTable>{propRows(sub.props)}</PropsTable>
            </div>
          </div>
        ))}
      </Section>

      {doc.dataAttributes.length > 0 && (
        <Section
          title="Data attributes"
          description="What the component puts on the DOM, for your own CSS and your own tests. Read off the JSX, so it is what ships rather than what was written down."
        >
          <div className="code-scroll overflow-x-auto w-full min-w-0">
            <table className="w-full table-fixed text-left min-w-[560px]">
              <colgroup>
                <col className="w-[34%]" />
                <col className="w-[30%]" />
                <col className="w-[36%]" />
              </colgroup>
              <thead>
                <tr className="text-fg-tertiary rule rule-b">
                  <th className="px-4 py-2 eyebrow">Attribute</th>
                  <th className="px-4 py-2 eyebrow">Values</th>
                  <th className="px-4 py-2 eyebrow">Present</th>
                </tr>
              </thead>
              <tbody>
                {doc.dataAttributes.map((attribute) => (
                  <tr key={attribute.name} className="rule rule-t">
                    <td className="px-4 py-2 font-mono text-[13px] align-top break-words" style={{ color: "var(--accent)" }}>
                      {attribute.name}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs align-top break-words text-fg-secondary">
                      {attribute.values.length > 0 ? attribute.values.join(" | ") : "—"}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs align-top break-words text-fg-tertiary">
                      {attribute.when}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {doc.shapes.length > 0 && (
        <Section
          title="Types"
          description="The shapes a prop asks you to build, and what an exported hook hands back."
        >
          {doc.shapes.map((shape) => (
            <div key={shape.name} className="mt-6 first:mt-0">
              <h3 className="font-mono text-[13px] text-fg mb-1">{shape.name}</h3>
              {shape.description && (
                <p className="text-[13px] text-fg-secondary mb-3 max-w-[680px]">{shape.description}</p>
              )}
              <div className={cardClass}>
                <PropsTable>{memberRows(shape.members)}</PropsTable>
              </div>
            </div>
          ))}
        </Section>
      )}

      {doc.cssVariables.length > 0 && (
        <Section
          title="CSS custom properties"
          description="Set by the component on its own elements, so your CSS can read them."
        >
          <div className={cardClass}>
            <ul className="list-disc pl-5 space-y-2 text-sm text-fg-secondary">
              {doc.cssVariables.map((variable) => (
                <li key={variable} className="font-mono text-[13px]">
                  {variable}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {doc.keyboard && (
        <Section title="Keyboard Interactions">
          {doc.keyboard.note && (
            <p className="text-sm leading-relaxed text-fg-secondary max-w-[680px]">
              <Inline text={doc.keyboard.note} />
            </p>
          )}
          {doc.keyboard.rows.length > 0 && (
            <div className="code-scroll overflow-x-auto w-full min-w-0">
              <table className="w-full table-fixed text-left min-w-[520px]">
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[70%]" />
                </colgroup>
                <thead>
                  <tr className="text-fg-tertiary rule rule-b">
                    <th className="px-4 py-2 eyebrow">Key</th>
                    <th className="px-4 py-2 eyebrow">Behaviour</th>
                  </tr>
                </thead>
                <tbody>
                  {doc.keyboard.rows.map((row) => (
                    <tr key={row.keys} className="rule rule-t">
                      <td className="px-4 py-2 font-mono text-[13px] align-top text-fg">
                        {row.keys.replace(/`/g, "")}
                      </td>
                      <td className="px-4 py-2 text-[13px] align-top text-fg-secondary">
                        <Inline text={row.description} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      )}
      {doc.accessibility.length > 0 && (
        <Section title="Accessibility">
          <div className={cardClass}>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-fg-secondary">
              {doc.accessibility.map((line) => (
                <li key={line}>
                  <Inline text={line} />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

    </>
  );
};

/** A tree or usage line, its mark set in the margin where a reader scans for it. */
const partLines = (lines: PartLine[]) => {
  const width = Math.max(...lines.map((line) => line.code.length));
  return lines.map((line, i) => (
    <span key={i} className="block">
      {line.code.padEnd(width + 4)}
      {line.mark && <span className="text-fg-tertiary">{`// ${line.mark}`}</span>}
    </span>
  ));
};

/**
 * The page's Anatomy, before its examples.
 *
 * Every page gets the parts-and-slots table: each `classes` key, the element
 * its class is applied to, and the key's own JSDoc, all generated from the
 * types and the source (`scripts/build-component-docs.mjs`). A slot list
 * written by hand beside the types is a second copy that drifts.
 *
 * Only a component a consumer must assemble gets a tag tree, each tag marked
 * required or optional: Accordion, RadioButton and Toast, by the rule the
 * generator states. One whose sub-tags are optional, as Modal's are, gets a
 * usage pattern instead, every part marked optional — drawing a required tree
 * for it would tell a reader to write tags it does not need.
 *
 * `doc` replaces the generated entry, which is how demo-anatomy.contract plants
 * a table that disagrees with the types.
 */
export const ComponentAnatomy: FC<{ name: string; doc?: ComponentDoc }> = ({ name, doc: override }) => {
  const doc = override ?? COMPONENT_DOCS[name];
  if (!doc) return null;
  const { parts } = doc;
  const multipart = new Set(parts.slots.map((slot) => slot.part)).size > 1;

  return (
    <Section
      title="Anatomy"
      description="The tags you write and the parts each classes key styles, generated from the types and the source."
    >
      {parts.tree && (
        <div data-anatomy="tree" className="space-y-3">
          <h3 className="font-mono text-[13px] text-fg">Tag tree</h3>
          {parts.why && <p className="text-[13px] text-fg-secondary max-w-[680px]">{parts.why}</p>}
          <pre className={preClass} {...scrollableCode}>
            <code>{partLines(parts.tree)}</code>
          </pre>
        </div>
      )}

      {parts.usage && (
        <div data-anatomy="usage" className="space-y-3">
          <h3 className="font-mono text-[13px] text-fg">Usage pattern</h3>
          <p className="text-[13px] text-fg-secondary max-w-[680px]">
            {`${doc.name} works on its own. These parts are optional, for when you want its layout.`}
          </p>
          <pre className={preClass} {...scrollableCode}>
            <code>{partLines(parts.usage)}</code>
          </pre>
        </div>
      )}

      {parts.slots.length > 0 && (
        <div data-anatomy="slots" className="space-y-3">
          <h3 className="font-mono text-[13px] text-fg">Parts and slots</h3>
          <div className="code-scroll overflow-x-auto w-full min-w-0">
            <table className="w-full table-fixed text-left min-w-[600px]">
              <colgroup>
                <col className="w-[26%]" />
                <col className="w-[20%]" />
                <col className="w-[54%]" />
              </colgroup>
              <thead>
                <tr className="text-fg-tertiary rule rule-b">
                  <th className="px-4 py-2 eyebrow">Slot</th>
                  <th className="px-4 py-2 eyebrow">Element</th>
                  <th className="px-4 py-2 eyebrow">Styles</th>
                </tr>
              </thead>
              <tbody>
                {parts.slots.map((slot) => (
                  <tr key={`${slot.part}.${slot.slot}`} data-slot={`${slot.part}.${slot.slot}`} className="rule rule-t">
                    <td className="px-4 py-2 font-mono text-[13px] align-top break-words" style={{ color: "var(--accent)" }}>
                      {multipart ? `${slot.part}.${slot.slot}` : slot.slot}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs align-top break-words text-fg-secondary">{slot.element}</td>
                    <td className="px-4 py-2 text-[13px] align-top text-fg-secondary">
                      <Inline text={slot.description} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Section>
  );
};

/**
 * The copy-paste block: the snippet, both framework variants, and the setup
 * answer.
 *
 * The code here is the code `scripts/consumers/_app/snippets/` holds, which the
 * consumer matrix typechecks and builds in five real applications. A copy
 * button that ships code nobody compiled is worse than no copy button.
 */
export const CopyPasteBlock: FC<{ name: string }> = ({ name }) => {
  const doc = COMPONENT_DOCS[name];
  const [variant, setVariant] = useState<"react" | "next">("react");
  const [copied, setCopied] = useState(false);
  if (!doc?.snippets) return null;

  const code = doc.snippets[variant];
  const copy = () => {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };

  const tab = (key: "react" | "next", label: string) => (
    <button
      key={key}
      type="button"
      onClick={() => setVariant(key)}
      aria-pressed={variant === key}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[13px] transition-colors cursor-pointer ${
        variant === key
          ? "bg-bg-elevated text-fg border border-border-soft"
          : "text-fg-tertiary border border-transparent hover:text-fg-secondary"
      }`}
    >
      {key === "react" ? <ReactIcon /> : <NextIcon />}
      {label}
    </button>
  );

  return (
    <Section
      title="Copy and paste"
      description="Compiled by the consumer matrix in Vite, Next (app and pages) and React Router before it reaches this page."
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {tab("react", "React")}
          {tab("next", "Next.js")}
        </div>
        <button
          type="button"
          onClick={copy}
          className="px-3 py-1 rounded-md border border-border-soft text-[13px] text-fg-secondary hover:border-border-active transition-colors cursor-pointer"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className={preClass} {...scrollableCode}>
        <code>{code}</code>
      </pre>

      <p className="text-sm leading-relaxed text-fg-secondary max-w-[680px]">
        {variant === "next" ? (
          doc.snippets.needsClientBoundary ? (
            <>
              The only difference from the React version is the{" "}
              <code className="font-mono text-[12px]">&quot;use client&quot;</code> line, and it is
              there for your code rather than ours: this example holds state and event handlers.
              Every {doc.name} entry already ships the directive itself, so importing one never
              obliges you to declare a boundary.
            </>
          ) : (
            <>
              Identical to the React version. This example has no state and no handlers of its own,
              and <code className="font-mono text-[12px]">{doc.subpath}</code> already ships{" "}
              <code className="font-mono text-[12px]">&quot;use client&quot;</code>, so it renders in
              a server component untouched.
            </>
          )
        ) : (
          <>
            Import <code className="font-mono text-[12px]">@chumlab/ui/styles.css</code> once, at
            your app entry. There is no Tailwind config step — see below.
          </>
        )}
      </p>
    </Section>
  );
};

/**
 * The setup answer, once per page, with the reason rather than a reassurance.
 *
 * Every claim here is a check in `verify-consumer-matrix.mjs`'s `vite-tailwind4`
 * target, which builds a consumer's own Tailwind v4 app — their preflight,
 * their dark-mode strategy, a token name that collides with ours — and asks a
 * browser what it computed.
 */
export const SetupNote: FC = () => (
  <Section
    title="Setup"
    description="One import. No Tailwind configuration, no content globs, no plugin."
  >
    <div className={cardClass}>
      <pre className={preClass} {...scrollableCode}>
        <code>{'import "@chumlab/ui/styles.css";'}</code>
      </pre>
      <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-fg-secondary mt-4">
        <li>
          <strong className="text-fg">Our utilities cannot reach your markup.</strong> Every one is
          emitted as <code className="font-mono text-[12px]">.flex:where(.cl-s)</code> — a marker
          class the components stamp on the elements they render themselves. Your own{" "}
          <code className="font-mono text-[12px]">&lt;div className=&quot;flex&quot;&gt;</code>{" "}
          carries no marker and never matches. The wrapper is{" "}
          <code className="font-mono text-[12px]">:where()</code> on purpose, so it adds no
          specificity: ours is (0,1,0), yours is (0,1,0), and where you do target one of our
          elements you are at parity rather than outranked.
        </li>
        <li>
          <strong className="text-fg">Your token overrides win, in either import order.</strong> The
          design tokens are declared inside{" "}
          <code className="font-mono text-[12px]">@layer chumlab.tokens</code>, which the stylesheet
          names first in its layer statement. An unlayered rule beats any layered one in the
          cascade, so a plain{" "}
          <code className="font-mono text-[12px]">:root {'{'} --cl-accent: #ff00aa {'}'}</code> in
          your CSS takes effect without <code className="font-mono text-[12px]">!important</code>{" "}
          and regardless of which stylesheet you import first.
        </li>
        <li>
          <strong className="text-fg">No preflight ships.</strong> Only the theme and utility layers
          are emitted, so our reset and yours cannot collide — the matrix asserts a consumer
          button keeps the background their own preflight gave it.
        </li>
      </ul>
    </div>
  </Section>
);
