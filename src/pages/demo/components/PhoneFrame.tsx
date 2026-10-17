/**
 * A demo example at a phone's viewport: an iframe, 360 px wide, loading
 * `/preview/<Component>/<example>`.
 *
 * An iframe, not a narrow div. Popovers place themselves against the viewport,
 * so a 360 px div on a desktop page still opens its menu into the desktop's
 * width; only a document 360 px wide shows where it lands on a phone. On a
 * page already narrower than the frame, the frame takes the page's width,
 * which is then the phone's.
 *
 * The section around it shows no code: it is the same component the page's
 * other sections show, at a narrower viewport.
 */
export function PhoneFrame({ route, lookFor, height = 640 }: { route: string; lookFor: string; height?: number }) {
  const [, , component = "", example = ""] = route.split("/");
  return (
    <figure data-phone-frame={route} className="space-y-2">
      {/* The border is on the wrapper: on the iframe, it would come out of the
          360 px the document inside gets. */}
      <div className="w-fit max-w-full overflow-hidden rounded-cl-md border border-cl-border">
        <iframe
          src={route}
          title={`${component}, ${example.replace(/-/g, " ")}, at 360 px`}
          loading="lazy"
          style={{ width: 360, height }}
          className="block max-w-full bg-cl-bg"
        />
      </div>
      <figcaption className="text-sm text-cl-text-secondary max-w-[360px]">
        <span className="font-medium text-cl-text">At phone width (360 px).</span> {lookFor}
      </figcaption>
    </figure>
  );
}
