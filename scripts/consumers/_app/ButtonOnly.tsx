import { Button } from "@chumlab/ui/button";

/**
 * One subpath, one component.
 *
 * The README claims the package tree-shakes and nothing asserted it. What the
 * check reads for afterwards is not the absence of a filename — a bundler is
 * free to name chunks anything — but the absence of markup only Table and
 * DatePicker write: `data-table-filter-content` and the calendar's weekday row
 * label. A string literal survives minification; an identifier does not.
 */
export default function ButtonOnly() {
  return (
    <main>
      <h1>chumlab-consumer-smoke</h1>
      <Button>Save</Button>
    </main>
  );
}
