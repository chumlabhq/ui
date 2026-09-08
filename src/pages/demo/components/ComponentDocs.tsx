import { useState, type FC } from "react";
import { Section, PropsTable, PropRow } from "./Section.js";
import { preClass, scrollableCode } from "./codeBlock.js";
import { NextIcon, ReactIcon } from "./Icons.js";
import {
  COMPONENT_DOCS,
  type ComponentDoc,
  type MemberDoc,
  type PropDoc,
} from "../generated/componentDocs.js";

/**
 * The four reference sections every component page carries: Anatomy, API
 * Reference, Accessibility and Keyboard Interactions.
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
        title="Anatomy"
        description="The parts this component composes, taken from its own example — so it cannot describe a composition the code does not use."
      >
        <pre className={preClass} {...scrollableCode}>
          <code>{doc.anatomy}</code>
        </pre>
      </Section>

      <Section
        title="API Reference"
        description={`Generated from ${doc.name}.schema.json. Required props are marked with an asterisk.`}
      >
        <div className={cardClass}>
          <PropsTable>{propRows(doc.props)}</PropsTable>
        </div>
        {doc.subComponents.map((sub) => (
          <div key={sub.name} className="mt-6">
            <h3 className="font-mono text-[13px] text-fg mb-3">{sub.name}</h3>
            <div className={cardClass}>
              <PropsTable>{propRows(sub.props)}</PropsTable>
            </div>
          </div>
        ))}
      </Section>

      {doc.classes.length > 0 && (
        <Section
          title="Class overrides"
          description="Every slot the classes prop accepts, read off the *Classes interfaces. A slot with no description has none on its type either."
        >
          {doc.classes.map((map) => (
            <div key={map.map} className="mt-6 first:mt-0">
              <h3 className="font-mono text-[13px] text-fg mb-3">{map.map}</h3>
              <div className={cardClass}>
                <PropsTable>{memberRows(map.keys)}</PropsTable>
              </div>
            </div>
          ))}
        </Section>
      )}

      {doc.dataAttributes.length > 0 && (
        <Section
          title="Data attributes"
          description="What the component puts on the DOM, for your own CSS and your own tests. Read off the JSX, so it is what ships rather than what was written down."
        >
          <div className="overflow-x-auto w-full min-w-0">
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

      {doc.accessibility.length > 0 && (
        <Section title="Accessibility">
          <div className={cardClass}>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-fg-secondary">
              {doc.accessibility.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {doc.keyboard && (
        <Section title="Keyboard Interactions">
          {doc.keyboard.note && (
            <p className="text-sm leading-relaxed text-fg-secondary max-w-[680px]">
              {doc.keyboard.note}
            </p>
          )}
          {doc.keyboard.rows.length > 0 && (
            <div className="overflow-x-auto w-full min-w-0">
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
                        {row.description.replace(/`/g, "")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      )}
    </>
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
