import { Button } from "@chumlab/ui/button";
import { Dropdown } from "@chumlab/ui/dropdown";

/**
 * The showcase for the consumer that installs neither optional peer.
 *
 * Subpaths only, and no Table or DatePicker. `@chumlab/ui` re-exports every
 * component from one barrel, so importing the root pulls in the chunks that
 * need `@tanstack/react-table` and `date-fns` whether or not the app uses
 * them. `peerDependenciesMeta` says those two are optional; this is what makes
 * that claim checkable rather than a note in the manifest.
 */
const OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

export default function MinimalShowcase() {
  return (
    <main>
      <h1>chumlab-consumer-smoke</h1>
      <Button>Save</Button>
      <Dropdown options={OPTIONS} label="Fruit" />
    </main>
  );
}
