import { test, expect } from "./_test";
import { MEASURE_DOCUMENT, underFloor } from "./_contrast-measure";
import { EXEMPT, LATE_SECTIONS, demoPages, demoPreviewRoutes, demoRoutes, outsideDemo, paintPending } from "./_demo-routes";

/**
 * Contrast as painted, over the demo PAGES.
 *
 * `contrast-painted` measures the 444 fixtures and has reported 0 findings for
 * months. It is right, and it is blind to three quarters of what a reader
 * actually looks at: the pages are not built from fixtures, so every class the
 * demo authors wrote for themselves — captions, scaffolding, trigger buttons —
 * is outside its population. Toast's page had 29 of its 58 triggers painted
 * `bg-cl-bg-elevated` on a card that is also `bg-cl-bg-elevated`, and nothing
 * measured it because nothing was pointed there.
 *
 * Same measurement, different roots. `MEASURE_DOCUMENT` is the same source the
 * fixture sweep evaluates, with the scope as a parameter — the first version of
 * this scan had `[data-fixture]` baked in, walked nothing on a demo page, and
 * reported a clean sweep over zero rows.
 *
 * IT WOULD NOT HAVE CAUGHT TOAST, and that is worth stating where the gate is
 * rather than leaving it implied. Toast's 29 triggers painted `bg-cl-bg-elevated`
 * on a card of the same token failed as a CONTROL BOUNDARY, not as text: their
 * labels were `text-cl-text` at full contrast. Planted — the trigger class put
 * back exactly as it was — this gate stays green. What would catch it is a
 * boundary check, and measuring one across these pages found 91 of 3961
 * controls with neither a fill nor a border clearing 3:1, most of them text
 * links and slider tick labels that correctly have no boundary. That is a
 * number nobody could stand behind as a pass/fail, so it is not built here.
 *
 * What this DOES catch is text, and there was plenty: 746 findings on the first
 * honest run, taken to 47 by six class idioms and one library palette. Planted
 * by restoring one of those idioms — `bg-cl-success/15 text-cl-success` on the
 * Table page — it reports 390 and names them at 4.09:1.
 *
 * The total moves between runs — 41289 and 41429 on two runs of the same tree,
 * then 47727 and 47867 once the routes were complete. That was put down to the
 * dropdown pages' country lists; measured per page it was /table alone, whose
 * server-side example fetched its rows from dummyjson.com after the page
 * rendered (see MEASURED_FLOOR). Since X4 those rows come from `e2e/fixtures/`
 * and the page waits for them, and the total is 48238 in all three engines.
 * Findings are what this asserts on; `measured`
 * is held per page against MEASURED_FLOOR, which catches a page measured half
 * rendered, and in total against a floor for a scan that walks nothing.
 *
 * The pages come from `_demo-routes.ts`: every route nested inside the docs
 * layout in App.tsx, read from its JSX. A one-line regex read 33 of 37 and the
 * four it missed were measured by nothing. What is left out — the site pages,
 * the fixtures, the catch-all — is printed on every run.
 *
 * And every /preview route the docs pages' phone-width frames load, each
 * measured as a page of its own, so what a frame shows is measured without
 * walking iframes.
 */
const ROUTES = [...demoRoutes(), ...demoPreviewRoutes()];

/**
 * CPU throttle, for proving the wait rather than for the gate.
 *
 * `DEMO_CONTRAST_CPU_THROTTLE=6` runs every page at 6× CPU slowdown through
 * CDP. The scan used to measure 150ms after network idle, and at 6× that read
 * /table while its Suspense fallback was still up: 47 elements against 5343.
 * Throttling is how a loaded machine is reproduced on demand, so the wait below
 * is proven against it rather than against whatever the load happened to be.
 */
const CPU_THROTTLE = Number(process.env.DEMO_CONTRAST_CPU_THROTTLE ?? 1);

/**
 * How long a page has to become ready before it fails by name.
 *
 * At 6× CPU the slowest page readied in 7108ms (/table, 2026-10-07), and
 * unthrottled none took over 1121ms. 30s is four times the throttled worst, so
 * a busy machine still measures every page, and a page that never readies
 * fails in seconds rather than being measured early or hanging the run.
 */
const READY_TIMEOUT_MS = 30_000;

/**
 * Whether a page is ready to measure, and if not, why.
 *
 * Ready is two things.
 * - The route's Suspense fallback is gone and the page's own heading is in
 *   `<main>`. Every demo page opens with a `<header><h1>` — `DocsHero` on the
 *   component pages, the same markup written out on the seven guides — inside
 *   the layout's `<Suspense>`, so the heading exists only once the page's chunk
 *   has rendered. The fallback (`DemoPageFallback`) is the `.suspense-delayed`
 *   block standing in for it. Network idle says nothing about either: a lazy
 *   chunk finishes downloading and then spends seconds of CPU rendering with no
 *   request in flight.
 * - Every `[aria-expanded="true"]` element's `aria-controls` target exists and
 *   is visible. The heading alone was not enough: at 6× CPU the "Empty State"
 *   example on /multi-select-searchable-dropdown, which is `defaultOpen`, had
 *   not shown its menu yet and the page measured 705 against a floor of 707.
 *   An expanded element with no `aria-controls`, or one naming no element, is
 *   reported rather than skipped: there is no surface to wait on, so the page
 *   never becomes ready and fails by name.
 *
 * Self-contained, because it runs in the page. `final` returns the report even
 * when not ready, so a page that times out says which condition held it.
 */
const readiness = (final: boolean) => {
  const main = document.querySelector("main");
  const heading =
    !!main && !main.querySelector(".suspense-delayed") && !!main.querySelector("header h1")?.textContent?.trim();
  const visible = (el: Element) => {
    if (!el.getClientRects().length) return false;
    for (let n: Element | null = el; n; n = n.parentElement) {
      const style = getComputedStyle(n);
      if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) return false;
    }
    return true;
  };
  const expanded = [...document.querySelectorAll('[aria-expanded="true"]')];
  const pending: string[] = [];
  for (const el of expanded) {
    const name = `<${el.tagName.toLowerCase()}> "${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40)}"`;
    const ids = el.getAttribute("aria-controls")?.trim().split(/\s+/).filter(Boolean) ?? [];
    if (!ids.length) pending.push(`${name} is expanded with no aria-controls`);
    for (const id of ids) {
      const target = document.getElementById(id);
      if (!target) pending.push(`${name} aria-controls="${id}" resolves to nothing`);
      else if (!visible(target)) pending.push(`${name} controls #${id}, which is not visible`);
    }
  }
  const report = { heading, expanded: expanded.length, pending };
  return final || (heading && !pending.length) ? report : null;
};

/**
 * The fewest elements each page measures when it has rendered, per route.
 *
 * The lowest count either theme reached across three clean runs on 2026-10-07
 * (load 2.5-3.2, unthrottled), recorded as read. A page under its floor was
 * measured before it finished rendering, or lost content, and fails by name —
 * the scan's total cannot say which page went short, and a half-rendered
 * /table (47 elements, its Suspense fallback) sits inside the total's normal
 * movement.
 *
 * Every page read the same count in all three runs except /table: 5343 in
 * light every time and 5482/5342/5482 in dark. The 140 are its server-side
 * example's rows, fetched from dummyjson.com in an effect after the page
 * renders: on the first visit in a browser they land after the page is ready,
 * on later visits from cache before it, and at 6× CPU after it even from
 * cache. So /table's floor is the cold count, and those rows are the one piece
 * of late content on any page that neither the ready condition nor the floor
 * waits for.
 * That remote fetch, not the dropdown pages' country lists, is what moved the
 * total between runs: the five dropdown pages measured identically all three
 * times.
 *
 * X4, 2026-10-16: no page depends on a remote host any more. `_test.ts`
 * answers dummyjson.com and its images from `e2e/fixtures/`, and the scan
 * waits for what arrives late (`paintPending`: lazy images, /table's fetched
 * rows). Every page then measured the same count in Chromium, Firefox and
 * WebKit, both themes (48238 each); the two floors below that moved say why.
 */
const MEASURED_FLOOR: Readonly<Record<string, number>> = {
  "introduction": 78,
  "getting-started": 107,
  "accessibility": 92,
  "guides/styling": 109,
  "guides/theming": 93,
  "guides/animation": 93,
  "guides/ai-llm": 86,
  // A2a, 947 -> 921: the API Reference lost the root onExpandedChange row and the
  // shape table of the event payload it passed (26 cells, measured HEAD vs now).
  // D11, 2026-10-17, 921 -> 915 (HEAD 932 -> now 915): Class overrides (96) and the old Anatomy (3) became Anatomy (82).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12cd, 2026-10-17, 915 -> 921 (HEAD 915 -> now 921): D Long labels (6).
  // D12e, 2026-10-18, 921 -> 935 (HEAD 935 -> now 935): none from D12e; HEAD already read 935: L25's defaultValue and onValueChange rows in the API Reference.
  "accordion": 935,
  // D11, 2026-10-17, 1084 -> 1060 (HEAD 1084 -> now 1060): Class overrides (59) and the old Anatomy (3) became Anatomy (38).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12e, 2026-10-18, 1060 -> 1077 (HEAD 1060 -> now 1077): Avatars in rows (17).
  "avatar": 1077,
  // A2e, 514 -> 512: the API Reference lost the separate icon prop's row (4
  // cells and its 2 code spans), folded into separator, whose rewritten
  // description gained one code span (517 -> 512 measured HEAD vs now).
  // D11, 2026-10-17, 512 -> 501 (HEAD 512 -> now 501): Class overrides (47) became Anatomy (36).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12b, 2026-10-17, 501 -> 504 (HEAD 501 -> now 504): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12e, 2026-10-18, 504 -> 515 (HEAD 504 -> now 515): Over a folder's contents (11).
  "breadcrumb": 515,
  // D11, 2026-10-17, 445 -> 439 (HEAD 447 -> now 439): Class overrides (23) and the old Anatomy (3) became Anatomy (18).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12cd, 2026-10-17, 439 -> 443 (HEAD 439 -> now 443): D Long labels (4).
  "button": 443,
  // D11, 2026-10-17, 732 -> 714 (HEAD 741 -> now 714): Class overrides (117) became Anatomy (90).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 714 -> 723 (HEAD 714 -> now 723): the new In a form (9).
  // D12cd, 2026-10-17, 723 -> 737 (HEAD 723 -> now 737): A When loading fails (10), C Starts open (4).
  // D12e, 2026-10-18, 737 -> 744 (HEAD 744 -> now 744): none from D12e; HEAD already read 744: L24's Starts open example open on load.
  "cascading-dropdown": 744,
  // D11, 2026-10-17, 411 -> 404 (HEAD 412 -> now 404): Class overrides (35) became Anatomy (27).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 404 -> 412 (HEAD 404 -> now 412): the new In a form (8).
  // D12cd, 2026-10-17, 412 -> 417 (HEAD 412 -> now 417): D Long labels (5).
  "checkbox": 417,
  // X4, 454 -> 455, 2026-10-16: lazy images are now loaded before measuring.
  // Chromium already showed the "invalid code" fallback ("??"), which Firefox
  // and WebKit held back until scrolled to (453); all three now also show the
  // Custom Base Path example's "US" fallback, whose /assets/flags image 404s.
  // D11, 2026-10-17, 455 -> 433 (HEAD 455 -> now 433): Class overrides (52) and the old Anatomy (3) became Anatomy (33).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // M2, 2026-10-21, 433 -> 437 (HEAD 433 -> now 437 in both themes): CountryFlagGroup's API Reference gained the `unstyled` row (4).
  "country-flag": 437,
  // D11, 2026-10-17, 975 -> 952 (HEAD 981 -> now 952): Class overrides (119) became Anatomy (90).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 952 -> 965 (HEAD 952 -> now 965): the new In a form (13).
  // D12b, 2026-10-17, 965 -> 968 (HEAD 965 -> now 968): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 968 -> 980 (HEAD 968 -> now 980): C Uncontrolled (6), D Long labels (6).
  // D12e, 2026-10-18, 980 -> 1044 (HEAD 1036 -> now 1044): Date and time together (8); the 56 before it were already on the page at HEAD: L24's Uncontrolled calendar open on load and L25's defaultValue row in the API Reference.
  // DT1, 2026-10-18, 1044 -> 1048: the API Reference's `showTodayIndicator` description now names `data-today`, `data-[today]:`, `classes.item` and `aria-current="date"`, four inline code spans (4).
  // S3, 2026-10-19, 1048 -> 1047: the Loading State section's trigger is disabled while loading, and a disabled control's text is not measured (-1).
  // G1, 2026-10-20, 1047 -> 1078 (now 1078 in both themes, two runs): A3 aca8bcac (every demo field named; captioned DemoLabels on this page).
  "date-picker": 1078,
  // D12b, 2026-10-17, 418 -> 431 (HEAD 425 -> now 431): the new At phone width and Long sheet (3 each): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 431 -> 435 (HEAD 431 -> now 435): C Uncontrolled (4).
  "drawer": 435,
  // A2c, 746 -> 744: the API Reference lost the CheckIcon row (4 cells), folded
  // into selectedIcon, and the rewritten icon descriptions gained one code span
  // (747 -> 744 measured HEAD vs now).
  // D11, 2026-10-17, 744 -> 727 (HEAD 744 -> now 727): Class overrides (71) became Anatomy (54).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 727 -> 736 (HEAD 727 -> now 736): the new In a form (9).
  // D12b, 2026-10-17, 736 -> 739 (HEAD 736 -> now 739): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 739 -> 753 (HEAD 739 -> now 753): A When loading fails (10), C Starts open (4).
  // D12e, 2026-10-18, 753 -> 757 (HEAD 757 -> now 757): none from D12e; HEAD already read 757: L24's Starts open example open on load.
  // G1, 2026-10-20, 757 -> 810 (now 810 in both themes, two runs): A3 aca8bcac (every demo field named; captioned DemoLabels on this page).
  "dropdown": 810,
  // D11, 2026-10-17, 530 -> 520 (HEAD 530 -> now 520): Class overrides (43) became Anatomy (33).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 520 -> 528 (HEAD 520 -> now 528): the new In a form (8).
  "input": 528,
  // D11, 2026-10-17, 946 -> 940 (HEAD 954 -> now 940): Class overrides (61) became Anatomy (47).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 940 -> 952 (HEAD 940 -> now 952): the new In a form (12).
  // D12b, 2026-10-17, 952 -> 955 (HEAD 952 -> now 955): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 955 -> 964 (HEAD 955 -> now 964): D Long labels (8, and 1 the new field portals).
  // S3, 2026-10-19, 964 -> 963: the loading section's number input is disabled while loading, and a disabled control's text is not measured (-1).
  "international-phone-input": 963,
  // L11, 426 -> 425: the In Context "Processing" button is now disabled while
  // it loads, and an inactive control's label is exempt from 1.4.3.
  // D11, 2026-10-17, 425 -> 399 (HEAD 425 -> now 399): Class overrides (62) became Anatomy (36).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  "loader": 399,
  // A2b, 495 -> 491: the API Reference lost the animation-off boolean's row (4
  // cells), folded into the reduceMotion row above it (measured HEAD vs now).
  // D12a, 2026-10-17, 491 -> 501 (HEAD 497 -> now 501): the new Form in a modal (4).
  // D12b, 2026-10-17, 501 -> 507 (HEAD 501 -> now 507): the new At phone width and Taller than the screen (3 each): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 507 -> 511 (HEAD 507 -> now 511): C Uncontrolled (4).
  "modal": 511,
  // D11, 2026-10-17, 684 -> 664 (HEAD 687 -> now 664): Class overrides (101) became Anatomy (78).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 664 -> 673 (HEAD 664 -> now 673): the new In a form (9).
  // D12b, 2026-10-17, 673 -> 676 (HEAD 673 -> now 676): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 676 -> 695 (HEAD 676 -> now 695): A When loading fails (10), C Uncontrolled (9).
  // D12e, 2026-10-18, 695 -> 700 (HEAD 700 -> now 700): none from D12e; HEAD already read 700: L24's Uncontrolled list open on load.
  // G1, 2026-10-20, 700 -> 733 (now 733 in both themes, two runs): A3 aca8bcac (every demo field named; captioned DemoLabels on this page).
  "multi-select-dropdown": 733,
  // D11, 2026-10-17, 707 -> 685 (HEAD 709 -> now 685): Class overrides (102) became Anatomy (78).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 685 -> 694 (HEAD 685 -> now 694): the new In a form (9); the onFocus/onBlur section
  // that was titled Form Integration is renamed Focus and blur events, 5 rows before and after.
  // D12b, 2026-10-17, 694 -> 697 (HEAD 694 -> now 697): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 697 -> 707 (HEAD 697 -> now 707): A When loading fails (10).
  // G1, 2026-10-20, 707 -> 715 (now 715 in both themes, two runs): A3 aca8bcac (every demo field named; captioned DemoLabels on this page).
  "multi-select-searchable-dropdown": 715,
  // A2f, 433 -> 429: the API Reference lost the group-name prop's row (4 cells),
  // folded into aria-label (measured A2e vs now; no other change on the page).
  // D11, 2026-10-17, 429 -> 420 (HEAD 429 -> now 420): Class overrides (40) became Anatomy (31).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 420 -> 428 (HEAD 420 -> now 428): the new In a form (8); the page's own Form Integration
  // section is unchanged at 8 rows.
  // D12b, 2026-10-17, 428 -> 431 (HEAD 428 -> now 431): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12e, 2026-10-18, 431 -> 436 (HEAD 431 -> now 436): A code in a dialog (5).
  "otp-input": 436,
  // D11, 2026-10-17, 634 -> 626 (HEAD 637 -> now 626): Class overrides (48) became Anatomy (37).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12b, 2026-10-17, 626 -> 629 (HEAD 626 -> now 629): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 629 -> 639 (HEAD 629 -> now 639): C Uncontrolled (10).
  // G1, 2026-10-20, 639 -> 640 (now 640 in both themes, two runs): not bisected: PaginationDemo.tsx is unchanged since D12cd, so the element came through the component or its generated reference (S3 1aee7467 and S4 14b8cacf touched both).
  "pagination": 640,
  // D11, 2026-10-17, 476 -> 465 (HEAD 476 -> now 465): Class overrides (48) and the old Anatomy (3) became Anatomy (40).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 465 -> 475 (HEAD 465 -> now 475): the new In a form (10).
  // D12cd, 2026-10-17, 475 -> 481 (HEAD 475 -> now 481): D Long labels (6).
  // D12e, 2026-10-18, 481 -> 494 (HEAD 481 -> now 494): Settings form (13).
  // G1, 2026-10-20, 494 -> 496 (now 496 in both themes, two runs): A3 aca8bcac (every demo field named; captioned DemoLabels on this page).
  "radio-button": 496,
  // D11, 2026-10-17, 359 -> 356 (HEAD 359 -> now 356): Class overrides (15) became Anatomy (12).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12b, 2026-10-17, 356 -> 359 (HEAD 356 -> now 359): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 359 -> 363 (HEAD 359 -> now 363): D Long labels (4).
  "resizable-panel": 363,
  // D11, 2026-10-17, 755 -> 736 (HEAD 756 -> now 736): Class overrides (83) became Anatomy (63).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 736 -> 745 (HEAD 736 -> now 745): the new In a form (9).
  // D12b, 2026-10-17, 745 -> 748 (HEAD 745 -> now 748): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 748 -> 762 (HEAD 748 -> now 762): A When loading fails (10), C Starts open (4).
  // D12e, 2026-10-18, 762 -> 768 (HEAD 768 -> now 768): none from D12e; HEAD already read 768: L24's Starts open example open on load.
  // G1, 2026-10-20, 768 -> 807 (now 807 in both themes, two runs): A3 aca8bcac (every demo field named; captioned DemoLabels on this page).
  "searchable-dropdown": 807,
  // D11, 2026-10-17, 545 -> 534 (HEAD 546 -> now 534): Class overrides (52) became Anatomy (40).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 534 -> 536 (HEAD 534 -> now 536): Form Integration (6) became In a form (8).
  "slider": 536,
  // D11, 2026-10-17, 682 -> 673 (HEAD 685 -> now 673): Class overrides (54) became Anatomy (42).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12b, 2026-10-17, 673 -> 676 (HEAD 673 -> now 676): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 676 -> 687 (HEAD 676 -> now 687): D Long labels (11).
  // D12e, 2026-10-18, 687 -> 695 (HEAD 687 -> now 695): A wizard with fields (8).
  "stepper": 695,
  // D11, 2026-10-17, 423 -> 413 (HEAD 423 -> now 413): Class overrides (44) became Anatomy (34).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 413 -> 421 (HEAD 413 -> now 421): the new In a form (8).
  // D12cd, 2026-10-17, 421 -> 425 (HEAD 421 -> now 425): D Long labels (4).
  "switch": 425,
  // D11, 2026-10-17, 677 -> 632 (HEAD 678 -> now 632): Class overrides (76) became Anatomy (30).
  // The dropped Type and Default columns carried no information (string, — on every slot); TabPanel's duplicate ResolvedClasses listing removed.
  // D12b, 2026-10-17, 632 -> 635 (HEAD 632 -> now 635): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 635 -> 643 (HEAD 635 -> now 643): D Long labels (8).
  // D12e, 2026-10-18, 643 -> 650 (HEAD 643 -> now 650): Tabs holding forms (7).
  // G1, 2026-10-20, 650 -> 651 (now 651 in both themes, two runs): not bisected: TabPanelDemo.tsx is unchanged since D12e, so the element came through the component or its generated reference (S3 1aee7467 and S4 14b8cacf touched both).
  "tab-panel": 651,
  // X4, 5342 -> 5543, 2026-10-16: the Server-Side example's rows are the 24
  // fixture products (10 a page) and its category filter, waited for, where
  // 5342 was the cold read with dummyjson.com's rows not yet landed.
  // D11, 2026-10-17, 5543 -> 5499 (HEAD 5543 -> now 5499): Class overrides (199) became Anatomy (155).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12cd, 2026-10-17, 5499 -> 5520 (HEAD 5499 -> now 5520): A When loading fails (21), measured once its own load lands (paintPending).
  // D12e, 2026-10-18, 5520 -> 5527 (HEAD 5527 -> now 5527): none from D12e; HEAD already read 5527: L25's ref row in the API Reference.
  "table": 5527,
  // D11, 2026-10-17, 504 -> 496 (HEAD 504 -> now 496): Class overrides (36) became Anatomy (28).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 496 -> 504 (HEAD 496 -> now 504): the new In a form (8).
  // S3, 2026-10-19, 504 -> 501: the API Reference's data-attribute table lost `data-auto-resize`, which never reached the DOM (name, values and condition, 3).
  "text-area": 501,
  // D11, 2026-10-17, 871 -> 862 (HEAD 893 -> now 862): Class overrides (127) became Anatomy (96).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12a, 2026-10-17, 862 -> 871 (HEAD 862 -> now 871): the new In a form (9).
  // D12b, 2026-10-17, 871 -> 874 (HEAD 871 -> now 874): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 874 -> 891 (HEAD 874 -> now 891): B Typed times outside the range (6, and 1 it portals), C Starts open (4), D Long labels (5, and 1 it portals).
  // D12e, 2026-10-18, 891 -> 988 (HEAD 988 -> now 988): none from D12e; HEAD already read 988: L24's Starts open list open on load.
  // G1, 2026-10-20, 988 -> 1029 (now 1029 in both themes, two runs): A3 aca8bcac (every demo field named; captioned DemoLabels on this page).
  "time-picker": 1029,
  // A2a, 564 -> 562: the API Reference lost the onRemove row (4 cells) and the
  // rewritten onDismiss(id) description gained two `id` code spans.
  // D11, 2026-10-17, 562 -> 560 (HEAD 563 -> now 560): Class overrides (43) became Anatomy (40).
  // The dropped Type and Default columns carried no information (string, — on every slot).
  // D12b, 2026-10-17, 560 -> 563 (HEAD 560 -> now 563): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 563 -> 567 (HEAD 563 -> now 567): D Long labels (4).
  // D12e, 2026-10-18, 567 -> 573 (HEAD 567 -> now 573): A toast after submit (6).
  "toast": 573,
  // 426 -> 423, 2026-10-08: the three gradient-with-arrow examples were removed (an arrow cannot take a gradient).
  // D12b, 2026-10-17, 423 -> 432 (HEAD 429 -> now 432): the new At phone width (3): its heading and the frame's caption;
  // the frame's content is the /preview route's, measured on its own below.
  // D12cd, 2026-10-17, 432 -> 437 (HEAD 432 -> now 437): C Uncontrolled (4, and its open tooltip's 1).
  "tooltip": 437,
  // D12b, 2026-10-17: the pages the phone-width frames load, one per preview
  // example, measured on their own. Each read the same count in both themes,
  // with no findings, in a Chromium scan with the spec's measurement.
  "preview/Breadcrumb/phone": 4,
  // L24 added this preview without a floor; D12e records the 6 a clean run reads.
  "preview/CascadingDropdown/phone": 6,
  "preview/DatePicker/phone": 47,
  "preview/Drawer/phone": 7,
  "preview/Drawer/long-sheet": 34,
  "preview/Dropdown/phone": 11,
  "preview/InternationalPhoneInput/phone": 6,
  "preview/Modal/phone": 6,
  "preview/Modal/tall": 29,
  "preview/MultiSelectDropdown/phone": 15,
  "preview/MultiSelectSearchableDropdown/phone": 15,
  "preview/OtpInput/phone": 3,
  "preview/Pagination/phone": 7,
  "preview/ResizablePanel/phone": 2,
  "preview/SearchableDropdown/phone": 13,
  "preview/Stepper/phone": 9,
  "preview/TabPanel/phone": 7,
  "preview/TimePicker/phone": 99,
  "preview/Toast/phone": 4,
  "preview/Tooltip/phone": 3,
};

/**
 * Measured, recorded, not yet fixed — down only.
 *
 * The scan opened at 746 findings across 15 pages. Six class idioms and one
 * library palette accounted for 699 of them; these selectors are the tail,
 * and they are all real by the same rule the fixture sweep applies. They are
 * listed so the number cannot grow while they are worked through, and so that
 * "32 remaining" is a set someone can read rather than a total. T4 retired two
 * keys and four findings: Avatar's fallback initials took the accent token in
 * place of a hard-coded indigo (its dark key; the light key still covers the
 * page's red-on-red palette spans), and Table's footer band, a 50% text tint in
 * light only, became the subtle surface the dark theme already had.
 *
 * Roughly: one is a `::placeholder` (the fixture gate counts placeholders and
 * fails them too, and every fixture placeholder passes, so this is a demo input
 * specifically; T3 moved the Table and unstyled TimePicker placeholders to
 * --cl-text-tertiary and retired seven entries, 43 -> 36); the rest are single
 * semantic-token labels on light surfaces — the light-mode `--cl-warning` and `--cl-success`
 * are surface colours, not text colours, which is the same fact behind the
 * bulk fixes above.
 */
const RECORDED: ReadonlySet<string> = new Set([
  "avatar light span",
  "breadcrumb light span",
  "loader light div.flex.items-center",
  "resizable-panel light div.text-[10px].font-mono",
  "resizable-panel light div.text-xs.font-semibold",
  "slider dark div.flex.items-center",
  "stepper light span.text-sm.font-semibold",
  "tab-panel light div.text-xs.font-medium",
  "time-picker light input.flex-1.min-w-0::placeholder",
  // Same pair, renamed: white on the warning amber at 3.19:1. It was
  // `button.px-3.py-1.5` until the demo's triggers became `<Button>`, which puts
  // the label in the component's `itemText` span. The colours did not move.
  "toast light span.inline-flex.items-center",
]);

/**
 * The plant, in the suite rather than in a docblock.
 *
 * This scan's first version had `[data-fixture]` baked into its roots, walked
 * nothing on a demo page and reported a clean sweep over zero rows. That was
 * caught by a planted 1.5:1 paragraph run by hand. Running it here means the
 * next time the roots, the theme setup or `MEASURE_DOCUMENT` stops reaching
 * the page, the gate says so instead of printing a tick. One page, ~3s.
 */
test("the scan notices text under AA", async ({ page }) => {
  await page.goto("/button", { waitUntil: "networkidle" });

  const findings = async () => {
    const rows = (await page.evaluate(MEASURE_DOCUMENT)) as Array<{
      key: string; ratio: number; exact?: number; floor?: number; detail: string; unmeasurable?: boolean;
    }>;
    return rows.filter((r) => !r.unmeasurable && underFloor(r, r.floor ?? 4.5));
  };

  const before = await findings();

  await page.evaluate(() => {
    const p = document.createElement("p");
    p.textContent = "planted, deliberately illegible";
    p.style.color = "#8a8a8a";
    p.style.background = "#7a7a7a";
    p.style.fontSize = "14px";
    p.id = "planted-low-contrast";
    document.body.appendChild(p);
  });

  const after = await findings();
  expect(
    after.length,
    "a paragraph planted at roughly 1.1:1 was not reported, so this scan is walking nothing",
  ).toBeGreaterThan(before.length);
});

/**
 * The floor is decided on the unrounded ratio, in both directions.
 *
 * The lower pair is the one that shipped: `--cl-accent` text on `--cl-accent-bg`
 * over white, 4.4999:1, which every caller passed because it compared the
 * two-decimal `ratio` (4.50). The upper pair also rounds to 4.50 and sits just
 * over the floor, so a fix that over-corrected would fail it. Colours chosen by
 * computation; which side of the floor they fall on is MEASURE's answer.
 */
test("decides the text floor on the unrounded ratio, both directions", async ({ page }) => {
  await page.setContent(`
    <style>p { font: 16px sans-serif; background: rgba(37, 99, 235, 0.1); margin: 8px; }</style>
    <p class="plant-below" style="color: rgb(37, 99, 235)">below</p>
    <p class="plant-above" style="color: rgb(46, 98, 235)">above</p>`);
  const rows = (await page.evaluate(MEASURE_DOCUMENT)) as Array<{
    key: string; ratio: number; exact?: number; floor?: number; unmeasurable?: boolean;
  }>;
  const below = rows.find((r) => r.key === "p.plant-below");
  const above = rows.find((r) => r.key === "p.plant-above");
  expect(below?.ratio, "the lower pair should round to the floor, or it tests nothing").toBe(4.5);
  expect(above?.ratio, "the upper pair should round to the floor, or it tests nothing").toBe(4.5);
  expect(below && underFloor(below, 4.5), `4.4999:1 must fail: ${JSON.stringify(below)}`).toBe(true);
  expect(above && underFloor(above, 4.5), `4.5001:1 must pass: ${JSON.stringify(above)}`).toBe(false);
});

/**
 * Whether the page now measures `floor` elements, for the re-read to wait on.
 *
 * A function rather than the expression string: Playwright evaluates a string
 * predicate with `eval` inside the page, which the site's CSP refuses
 * (`script-src` has no 'unsafe-eval'). The refusal rejects the wait at
 * once, so the first planted delay read "re-read also short" instead of
 * naming the element.
 */
/**
 * Whether the page has finished painting what arrives after it is ready —
 * lazy images and LATE_SECTIONS (see `paintPending`). A function built from
 * the source for the same CSP reason as `measuresAtLeast` below.
 */
const painted = new Function("section", `return (${paintPending})(section).length === 0;`) as (
  section: string | null,
) => boolean;

const measuresAtLeast = new Function(
  "floor",
  `return ${MEASURE_DOCUMENT}.filter((r) => !r.unmeasurable).length >= floor;`,
) as (floor: number) => boolean;

type Row = {
  key: string;
  text?: string;
  ratio: number;
  exact?: number;
  floor?: number;
  detail: string;
  unmeasurable?: boolean;
};

test("every demo page clears AA on the text it paints", async ({ page }) => {
  // Scaled with the throttle: the run is CPU-bound, 55s unthrottled, 2m at 6×.
  test.setTimeout(600_000 * CPU_THROTTLE);
  await page.setViewportSize({ width: 1280, height: 1200 });
  if (CPU_THROTTLE !== 1) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU_THROTTLE });
  }

  /**
   * Coverage, from a source the route walk does not read: the page files.
   * Every `src/pages/demo/*Demo.tsx` has a route this scan measures, or an
   * exemption in `_demo-routes.ts` that says why. Checked before anything is
   * measured, because a scan over the wrong pages has nothing to say.
   */
  const pages = demoPages();
  const uncovered = pages
    .filter((p) => !EXEMPT[p.file] && !p.routes.some((r) => ROUTES.includes(r)))
    .map((p) => `${p.file} (routes: ${p.routes.join(", ") || "none"})`);
  const staleExemptions = pages
    .filter((p) => EXEMPT[p.file] && p.routes.some((r) => ROUTES.includes(r)))
    .map((p) => p.file);
  const covered = pages.length - Object.keys(EXEMPT).length;
  console.log(
    `DEMO_CONTRAST_COVERAGE routes=${ROUTES.length} page-files=${pages.length} ` +
      `exempt=${Object.keys(EXEMPT).join(",")} pages-to-cover=${covered} uncovered=${uncovered.length}`,
  );
  console.log(
    `DEMO_CONTRAST_LEFT_OUT ${outsideDemo().map((o) => `${o.path} (${o.reason})`).join("; ")}`,
  );
  expect(uncovered, "demo pages no measured route renders — the route list missed them").toEqual([]);
  expect(staleExemptions, "exempt from coverage and measured anyway — delete the exemption").toEqual([]);

  const findings: Array<{ route: string; theme: string; key: string; ratio: number; detail: string }> = [];
  const short: Array<{ route: string; theme: string; measured: number; floor: number; named: string[] }> = [];

  /**
   * What a read under its floor was missing, by selector, text and paint.
   *
   * It never decides anything: the page has already failed its floor, and it
   * still fails whatever this finds. It reloads the page, waits for it to be
   * ready and then for it to measure its floor, inside the same
   * READY_TIMEOUT_MS, and names every element the re-read has that the short
   * read did not. /avatar read 1082 against 1084 once at 6× CPU and nothing
   * could say which two elements were absent.
   */
  const missingFrom = async (route: string, floor: number, shortRows: Row[]): Promise<string[]> => {
    await page.goto(`/${route}`, { waitUntil: "networkidle" });
    const deadline = Date.now() + READY_TIMEOUT_MS;
    const left = () => ({ timeout: Math.max(1, deadline - Date.now()) });
    const reached = await page
      .waitForFunction(readiness, false, left())
      .then(() => page.waitForFunction(painted, LATE_SECTIONS[route] ?? null, left()))
      .then(() =>
        page.waitForFunction(measuresAtLeast, floor, left()),
      )
      .then(() => true, () => false);
    const again = ((await page.evaluate(MEASURE_DOCUMENT)) as Row[]).filter((r) => !r.unmeasurable);
    if (!reached || again.length < floor) {
      return [`re-read also short: ${again.length}/${floor}, missing elements unnamed`];
    }
    const id = (r: Row) => `${r.key} "${r.text ?? ""}" ${r.detail}`;
    const unmatched = new Map<string, number>();
    for (const r of shortRows) if (!r.unmeasurable) unmatched.set(id(r), (unmatched.get(id(r)) ?? 0) + 1);
    const missing: string[] = [];
    for (const r of again) {
      const n = unmatched.get(id(r)) ?? 0;
      if (n > 0) unmatched.set(id(r), n - 1);
      else missing.push(id(r));
    }
    return [`${missing.length} named`, ...missing];
  };
  const notReady: string[] = [];
  const perPage: Array<{ route: string; theme: string; measured: number; readyMs: number; expanded: number }> = [];
  let measured = 0;

  for (const route of ROUTES) {
    for (const theme of ["light", "dark"] as const) {
      /**
       * Set the way a user sets it, then load.
       *
       * Poking `data-theme` on an already-rendered page leaves it half
       * repainted: the site's provider toggles a `light` AND a `dark` class and
       * writes localStorage, so an attribute on its own flipped the surfaces
       * and left the text. That produced 4787 "findings" whose detail read
       * `rgb(237,239,244) on rgb(250,250,247)` — the dark foreground on the
       * light page, a state no reader can reach.
       */
      await page.addInitScript(
        ([key, value]) => window.localStorage.setItem(key, value),
        ["chumlab-theme", theme] as const,
      );
      const started = Date.now();
      await page.goto(`/${route}`, { waitUntil: "networkidle" });
      const section = LATE_SECTIONS[route] ?? null;
      const ready = await page
        .waitForFunction(readiness, false, { timeout: READY_TIMEOUT_MS })
        .then((handle) => handle.jsonValue() as Promise<{ expanded: number }>)
        .then(
          (report) =>
            page
              .waitForFunction(painted, section, { timeout: Math.max(1, READY_TIMEOUT_MS - (Date.now() - started)) })
              .then(() => report),
          () => null,
        )
        .catch(() => null);
      const readyMs = Date.now() - started;
      if (!ready) {
        const report = await page.evaluate(readiness, true);
        const why = [
          ...(report?.heading ? [] : ["no page heading in <main>, or the Suspense fallback still up"]),
          ...(report?.pending ?? []),
          ...(await page.evaluate(paintPending, section)),
        ];
        notReady.push(`${route} (${theme}) not ready after ${READY_TIMEOUT_MS}ms: ${why.join("; ")}`);
        continue;
      }
      const rows = (await page.evaluate(MEASURE_DOCUMENT)) as Row[];
      let onPage = 0;
      for (const row of rows) {
        if (row.unmeasurable) continue;
        onPage += 1;
        if (underFloor(row, row.floor ?? 4.5)) findings.push({ route, theme, ...row });
      }
      measured += onPage;
      perPage.push({ route, theme, measured: onPage, readyMs, expanded: ready.expanded });
      const floor = MEASURED_FLOOR[route];
      if (floor !== undefined && onPage < floor) {
        short.push({ route, theme, measured: onPage, floor, named: await missingFrom(route, floor, rows) });
      }
    }
  }

  console.log(
    `DEMO_CONTRAST pages=${ROUTES.length} measured=${measured} findings=${findings.length} ` +
      `| page-files=${pages.length} exempt=${Object.keys(EXEMPT).length} covered=${covered - uncovered.length}/${covered}` +
      (CPU_THROTTLE !== 1 ? ` cpu-throttle=${CPU_THROTTLE}x` : ""),
  );
  for (const p of perPage) {
    console.log(
      `DEMO_CONTRAST_PAGE ${p.route} ${p.theme} measured=${p.measured} ` +
        `expanded-waited=${p.expanded} ready=${p.readyMs}ms`,
    );
  }
  for (const f of findings.slice(0, 1200)) {
    console.log(`DEMO_CONTRAST_FINDING ${f.route} ${f.theme} ${f.ratio} ${f.key} :: ${f.detail}`);
  }

  expect(notReady, "pages that never became ready, so were not measured").toEqual([]);

  for (const s of short) {
    console.log(`DEMO_CONTRAST_SHORT ${s.route} ${s.theme} measured=${s.measured} floor=${s.floor} — ${s.named[0]}`);
    for (const m of s.named.slice(1)) console.log(`DEMO_CONTRAST_MISSING ${s.route} ${s.theme} ${m}`);
  }
  expect(
    short.map((s) => `${s.route} (${s.theme}): measured ${s.measured}, floor ${s.floor}; ${s.named.join(" | ")}`),
    "pages measured under their floor — rendered partly, or lost content",
  ).toEqual([]);
  expect(
    ROUTES.filter((r) => MEASURED_FLOOR[r] === undefined),
    "routes with no recorded floor — record the count a clean run reads",
  ).toEqual([]);
  expect(
    Object.keys(MEASURED_FLOOR).filter((r) => !ROUTES.includes(r)),
    "floors recorded for routes the scan no longer has — delete them",
  ).toEqual([]);
  expect(measured, "nothing was measured — the scan walked no elements").toBeGreaterThan(2000);

  const key = (f: { route: string; theme: string; key: string }) => `${f.route} ${f.theme} ${f.key}`;
  const fresh = findings.filter((f) => !RECORDED.has(key(f)));
  expect(
    fresh.map((f) => `${f.route} ${f.theme} ${f.ratio}:1 ${f.key} (${f.detail})`).sort(),
    "painted under AA on a demo page. The pages are not fixtures, so this is the only thing " +
      "measuring the classes the demo authors wrote for themselves",
  ).toEqual([]);

  // Down only: a recorded selector that no longer fails is deleted, not left
  // standing, or the list becomes a place where fixed things hide.
  const stale = [...RECORDED].filter((k) => !findings.some((f) => key(f) === k));
  expect(stale.sort(), "recorded as failing and no longer failing — delete the entry").toEqual([]);
});
