/**
 * Where each part lives in the rendered DOM. Parts are not yet named in the
 * markup — that is Task 3 — so until then they are located by role or by the
 * element the component actually renders. Wrong selector, false failure, so
 * every one of these was read off a rendered fixture rather than guessed.
 */

export const SELECTOR: Record<string, string> = {
  // Breadcrumb marks the crumb on the <a>, Pagination on the page <button>, so
  // both are part of `item` even though neither is a list element.
  "item": '[role="option"], [role="menuitem"], [role="menuitemcheckbox"], [role="tab"], [role="gridcell"], li, tr, nav a, nav span[data-state], nav button[aria-label^="Page"]',
  // CascadingDropdown's submenu rows are menuitemcheckbox, not option; the
  // requirement moved onto `subItem` in Task 3b and the locator had to follow.
  "subItem": '[role="option"], [role="menuitemcheckbox"]',
  "control": '[role="switch"], [role="checkbox"], input[type="checkbox"] + span, span[data-state], [data-state]',
  "thumb": '[role="slider"], [role="switch"] span, span[data-state]',
  "input": "input",
  "itemIndicator": "[data-status], svg",
  // Stepper's label wrapper is a div carrying data-align, not a span.
  "itemText": "span[data-status], span[data-state], div[data-align], span",
  "itemIcon": "span[data-status], span[data-state], svg",
  "description": "[data-status]",
  "separator": "[data-next-status], [data-status]",
  "count": "span",
  "marker": "[data-state]",
  "clockDisplay": "[data-state]",
  "periodButton": "button",
  "clockNumber": "[data-selected], [data-disabled]",
  "presetTrigger": "button",
  "pinButton": "button",
  "countrySelect.item": '[role="option"]',
  // The validation message has no stable role — half the success elements carry
  // none — so the union includes both attributes. That is not circular: each
  // fixture renders exactly one of the two messages, so the OTHER attribute's
  // absence is still measured on a real element that could have carried it.
  "message": '[role="alert"], [role="status"], [data-invalid], [data-valid]',
};
