import logoSmall from "../assets/images/logo-small.png";

/**
 * Shared FAQ accordion icon — the bare Chumlab logo (no chip, no background,
 * no border). Used on both the Home page's FAQ preview and the full /faq
 * page.
 *
 * Rotation is not applied here. Hand this component to an
 * `AccordionTrigger`'s `expandedIcon` prop, then add
 * `group-data-[state=open]:rotate-[360deg]` to the accordion's `iconWrapper`
 * class (plus `group` on the trigger) — the wrapper drives the 360° spin on
 * open and the reverse spin on close.
 */
export function FaqLogoIcon() {
  return (
    <img
      src={logoSmall}
      alt=""
      draggable={false}
      className="w-5 h-5 object-contain shrink-0"
    />
  );
}

export default FaqLogoIcon;
