import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FORM_FIXTURES, valueProps } from "../../__tests__/fixtures/_forms.js";

/**
 * One form field inside a real `<form>`, for `forms.spec.ts`.
 *
 * `/__fixtures/forms/<Component>?mode=required|uncontrolled|controlled`. The
 * field is named `f`; `uncontrolled` starts it from the fixture's default, and
 * `controlled` holds the same value in state here, so a reset that called the
 * change handler would show on screen as well as in `data-changes`.
 * `data-resets` counts the form's reset events, so a spec can wait for the
 * reset to have happened before it reads that nothing changed.
 *
 * Not a registry fixture on purpose: every fixture is walked by visual,
 * a11y-full and contrast-painted, and a form harness is not a state of a
 * component worth a screenshot. It reads the same `_forms.tsx` table as
 * `form-participation.contract`, so the two tiers cannot drift apart.
 */
export default function FormRoute() {
  const { field } = useParams();
  const mode = new URLSearchParams(useLocation().search).get("mode") ?? "required";
  const fixture = FORM_FIXTURES.find((f) => f.id.split("/")[1] === field);
  const [state, setState] = useState<unknown>(fixture?.initial);
  const [submits, setSubmits] = useState(0);
  const [changes, setChanges] = useState(0);
  const [resets, setResets] = useState(0);

  if (!fixture) return <p data-fixture-error="">No form fixture for "{field}".</p>;

  const keys = valueProps(fixture);
  const props: Record<string, unknown> = { name: "f" };
  if (mode === "required") props.required = true;
  if (mode === "uncontrolled") props[keys.defaultValue] = fixture.initial;
  if (mode === "controlled") {
    props[keys.value] = state;
    props[keys.onChange] = (value: unknown) => {
      setChanges((n) => n + 1);
      setState(value);
    };
  }

  return (
    <main style={{ padding: 24, maxWidth: 480 }}>
      <form
        data-form-harness={fixture.id}
        data-mode={mode}
        data-submits={submits}
        data-changes={changes}
        data-resets={resets}
        data-documented={JSON.stringify(fixture.formData)}
        data-empty={JSON.stringify(fixture.empty)}
        data-blocks={String(fixture.blocks)}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmits((n) => n + 1);
        }}
        onReset={() => setResets((n) => n + 1)}
      >
        {fixture.render(props)}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>
      </form>
    </main>
  );
}
