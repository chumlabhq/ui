/**
 * The half of the consumer matrix a build cannot answer.
 *
 * `verify-consumer-matrix.mjs` installs the tarball into nine templates and
 * runs their production builds. That proves the package installs, resolves and
 * compiles; it says nothing about what happens when the application runs. Three
 * of the templates server-render, and a hydration mismatch is not a build
 * failure — React 19 hands it to `onRecoverableError` and the build exits 0.
 *
 * So this module starts each built application the way its framework does in
 * production, opens it in a browser, and asks three questions per component:
 *   - did it render (a painted box, not merely markup on disk),
 *   - did it hydrate without a recoverable error,
 *   - and does the thing it opens still open once hydrated.
 *
 * One route per component, because a mismatch reported against a page holding
 * thirty of them names no component and the production component stack is
 * minified. `__canary` is a route too: it mismatches by construction, and every
 * pass has to catch it — the hydration channel is read differently in each
 * framework, and a channel that has never fired is a channel nobody has tested.
 *
 * The render sweep was shown to fail on 2026-09-07 by deleting Switch from a
 * built scaffold's registry: "grid renders — 29 of 30 component(s) on one page,
 * missing from the registry: Switch", and the route for it reported 0 elements.
 * The component list comes from `ai/component-index.json` for that reason — a
 * component that ships without a consumer entry is a gap in the matrix, and a
 * list kept beside the templates would have been edited to match.
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { createServer as createSocketServer } from "node:net";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** See CANARY in `_app/all/registry.tsx`. */
const CANARY = "__canary";

/**
 * The library's own index, not a list kept beside the templates.
 *
 * It is what makes "every component" true rather than "every component someone
 * remembered to add": a component that ships without an entry in
 * `_app/all/registry.tsx` fails the grid check by its absence.
 */
const EXPECTED = JSON.parse(
  readFileSync(join(ROOT, "ai", "component-index.json"), "utf8"),
).components.map((component) => component.name);

/** The route that lists the routes; see ROUTES in `_app/all/registry.tsx`. */
const ROUTES = "__routes";

/** The control for the structural check; see MOVER in `_app/all/registry.tsx`. */
const MOVER = "__mover";

/**
 * Routes where the client is SUPPOSED to replace what the server sent, with the
 * reason. Everything else must keep every landmark the server rendered, in the
 * place the server put it.
 *
 * A short list on purpose: each entry is a component that renders one tree
 * before it has measured something and a different one after, which is a
 * correction rather than a defect — but it is also indistinguishable from one
 * without a reason written down.
 */
const DECLARED_REPLACEMENTS = {
  Table__responsive:
    "The server assumes a 1024px viewport, so it renders the card layout; the client " +
    "measures 1280 and renders the table. Both trees are correct for what each knew, and " +
    "the switch is the point of `responsiveBreakpoint`.",
  __mover: "The control. It exists to be faulted.",
};

/** Seeded before the sweep, for the one variant whose defect needs stored state. */
const ACCORDION_STORAGE_KEY = "chumlab-matrix-accordion";

/**
 * A floor on the affordances each component should fire, recorded from the
 * first green pass and identical across all five templates.
 *
 * It is what stops the sweep passing vacuously: a component that loses its
 * trigger stops being exercised, and with nothing to compare against that reads
 * as a pass rather than as the regression it is. A zero is a claim — this
 * component has no state to drive — not a gap.
 */
const EXPECTED_AFFORDANCES = {
  Accordion: 1,
  Avatar: 0,
  Breadcrumb: 0,
  Button: 0,
  CascadingDropdown: 1,
  Checkbox: 1,
  CountryFlag: 0,
  DatePicker: 1,
  Drawer: 1,
  Dropdown: 1,
  Input: 1,
  InternationalPhoneInput: 2,
  Loader: 0,
  Modal: 1,
  MultiSelectDropdown: 1,
  MultiSelectSearchableDropdown: 1,
  OtpInput: 1,
  Pagination: 1,
  RadioButton: 1,
  ResizablePanel: 1,
  SearchableDropdown: 1,
  Slider: 1,
  Stepper: 1,
  Switch: 1,
  TabPanel: 1,
  Table: 2,
  TextArea: 1,
  TimePicker: 2,
  Toast: 1,
  Tooltip: 1,
};

/**
 * The affordances, as properties rather than as a script per component.
 *
 * "Open every surface that opens, toggle every control that toggles" is a
 * statement about roles and state attributes, and writing it that way keeps the
 * sweep honest when a component changes its markup: what is asserted is that
 * the element reporting itself closed reports itself open afterwards, whichever
 * element that is.
 */
const AFFORDANCES = [
  {
    id: "expand",
    selector: "[aria-expanded='false']:not([disabled]):not([aria-disabled='true'])",
    expect: "aria-expanded=true",
  },
  {
    id: "check",
    selector:
      "[role='checkbox'][aria-checked='false'],[role='switch'][aria-checked='false'],[role='radio'][aria-checked='false']",
    expect: "aria-checked=true",
  },
  {
    id: "native-check",
    selector: "input[type='checkbox']:not(:checked),input[type='radio']:not(:checked)",
    expect: "checked",
  },
  {
    id: "tab",
    selector: "[role='tab'][aria-selected='false']:not([disabled]):not([aria-disabled='true'])",
    expect: "aria-selected=true",
  },
  {
    // The state is on the header cell and the control is the icon inside it —
    // Table sorts on the icon deliberately, so the element that changes and the
    // element that is pressed are not the same one.
    id: "sort",
    selector: "[aria-sort='none']",
    within: "button",
    expect: "aria-sort!=none",
  },
  {
    // A trigger that models itself as open/closed without aria-expanded. Scoped
    // to things that can be pressed on purpose: `data-state` is also how Table
    // marks an expandable ROW, and clicking a row asserts nothing.
    id: "state",
    selector:
      "button[data-state='closed'],[role='button'][data-state='closed'],[role='combobox'][data-state='closed']",
    expect: "data-state=open",
  },
  {
    id: "type",
    selector: "input[type='text'],input[type='tel'],input:not([type]),textarea",
    action: "type",
    expect: "value",
  },
  {
    // A separator with a value is a resize handle, which is a slider by another
    // name: ResizablePanel's is the only control in the library that is one.
    id: "slider",
    selector: "[role='slider'],[role='separator'][aria-valuenow]",
    action: "arrow",
    expect: "aria-valuenow-changed",
  },
  {
    // The control beside the one holding `aria-current`: a page button in
    // Pagination, a completed step in Stepper. Neither marks the control it is
    // about to move state to, so what is asserted is that the state moved.
    id: "current",
    selector:
      ":is(nav, ol, ul, div):has(> [aria-current], > * [aria-current]) > " +
      ":is(button, a, li:has(button)):not([aria-current])" +
      ":not([disabled]):not([data-disabled]):not([aria-disabled='true'])",
    within: "button",
    expect: "current",
  },
  {
    // The one affordance with nothing on the trigger to read: a tooltip sets no
    // state attribute on what opened it, so the surface appearing is the whole
    // observation — and that makes this the only rule that names a component.
    id: "hover",
    selector: "[data-component='Tooltip'] button",
    action: "hover",
    expect: "surface",
    surface: "[role='tooltip']",
  },
  {
    // The three components a host has to own: Modal, Drawer and Toast. The
    // trigger is the consumer's, the surface is the library's.
    id: "host",
    selector: "[data-probe='open']",
    expect: "surface",
    surface: "[role='dialog'],[role='alertdialog'],[role='status'],[role='alert']",
  },
];

/**
 * Installed before any framework code runs.
 *
 * React 19's default `onRecoverableError` is the global `reportError`, and
 * Next's own handler ends at the same place — a consumer cannot pass a callback
 * to a `hydrateRoot` Next owns. Wrapping `reportError` reads that channel one
 * level down rather than spying on the console, which is where React 19
 * stopped reporting mismatches. React Router's template passes the real
 * callback (see `app/entry.client.tsx`); both write to the same array, tagged
 * with which one saw it.
 */
const CAPTURE = () => {
  const seen = (window.__recoverable ??= []);
  const record = (source, error) => {
    const message = error && error.message ? error.message : String(error);
    seen.push(`${source}: ${message}`);
  };
  const original = typeof window.reportError === "function" ? window.reportError.bind(window) : null;
  window.reportError = (error) => {
    record("reportError", error);
    original?.(error);
  };
  window.addEventListener("error", (event) => record("error-event", event.error ?? event.message));
};

/** A static server for one built consumer, on an ephemeral port. */
export async function serve(root) {
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".json": "application/json",
  };
  const server = createServer((request, response) => {
    const path = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const candidates = [
      join(root, path === "/" ? "index.html" : path),
      join(root, `${path}.html`),
      join(root, path, "index.html"),
    ];
    const file = candidates.find((candidate) => candidate.startsWith(root) && existsSync(candidate));
    if (!file) {
      response.writeHead(404).end("not found");
      return;
    }
    const extension = file.slice(file.lastIndexOf("."));
    response.writeHead(200, { "content-type": types[extension] ?? "application/octet-stream" });
    response.end(readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}/`,
    close: () => new Promise((resolve) => server.close(resolve)),
    output: () => "",
  };
}

/** A port nothing is listening on, for the frameworks that will not take 0. */
async function freePort() {
  const socket = createSocketServer();
  await new Promise((resolve) => socket.listen(0, "127.0.0.1", resolve));
  const { port } = socket.address();
  await new Promise((resolve) => socket.close(resolve));
  return port;
}

/**
 * `npm run start` — `next start` or `react-router-serve`, whichever the
 * template declares. The production server, not the dev one: a dev server
 * would run its own error overlay and a different bundle.
 */
async function startApp(dir) {
  const port = await freePort();
  const child = spawn("npm", ["run", "start"], {
    cwd: dir,
    env: { ...process.env, PORT: String(port), NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
    // Its own process group, so the framework's child processes are killed
    // with it rather than being left holding the port.
    detached: true,
  });

  let log = "";
  child.stdout.on("data", (chunk) => (log += chunk));
  child.stderr.on("data", (chunk) => (log += chunk));

  const url = `http://127.0.0.1:${port}/`;
  const deadline = Date.now() + 60_000;
  for (;;) {
    if (child.exitCode !== null) throw new Error(`server exited (${child.exitCode}):\n${log}`);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (response.ok) break;
    } catch {
      // not listening yet
    }
    if (Date.now() > deadline) throw new Error(`server never answered on ${url}:\n${log}`);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  return {
    url,
    output: () => log,
    close: async () => {
      try {
        process.kill(-child.pid, "SIGTERM");
      } catch {
        child.kill("SIGTERM");
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    },
  };
}

/**
 * Landmarks the server rendered, and where each of them ended up.
 *
 * The hydration channel cannot see a whole class of defect: if the server and
 * the first client render agree, React is satisfied, and anything an effect
 * does afterwards — moving a subtree into a portal, replacing it — is reported
 * nowhere. `Tooltip` did precisely that, shipping its tip inside `<main>` from
 * the server and relocating it to `document.body` on mount, and every error
 * channel called the route clean.
 *
 * So this compares the two trees directly: the bytes the server sent against
 * the DOM once it has settled. Additions are fine — that is what a portal
 * appearing after hydration looks like, and it is the shape ADR 003 asks for.
 * A landmark that VANISHED or MOVED is the fault.
 *
 * Landmarks rather than every node: an id, a role, or a tag that means
 * something on its own. Classes and state attributes are deliberately not part
 * of the identity — those are supposed to change.
 */
const compareTrees = (page, html) =>
  page.evaluate(
    ([serverHtml]) => {
      const TAGS = new Set([
        "BUTTON", "INPUT", "TEXTAREA", "SELECT", "TABLE", "A", "IMG", "DIALOG",
        "NAV", "FORM", "LABEL", "H1", "H2", "H3", "H4", "H5", "H6",
      ]);
      const landmark = (element) =>
        element.id || element.getAttribute("role") || TAGS.has(element.tagName);
      const key = (element) =>
        element.id
          ? `${element.tagName}#${element.id}`
          : `${element.tagName}[${element.getAttribute("role") ?? ""}]:` +
            `${(element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 24)}`;
      const path = (element) => {
        const parts = [];
        for (let cursor = element.parentElement; cursor; cursor = cursor.parentElement) {
          parts.unshift(cursor.tagName);
        }
        return parts.join(">");
      };

      const parsed = new DOMParser().parseFromString(serverHtml, "text/html");
      // Only what the component rendered: the shell is `<main>`, and a server
      // cannot portal, so everything it produced is inside it.
      const shell = parsed.querySelector("main");
      if (!shell) return { faults: [{ kind: "no-shell", key: "main", from: "", to: "" }], seen: 0 };

      const live = [...document.querySelectorAll("*")].filter(landmark);
      const index = new Map();
      for (const element of live) {
        const entry = index.get(key(element)) ?? [];
        entry.push(path(element));
        index.set(key(element), entry);
      }

      const faults = [];
      const server = [...shell.querySelectorAll("*")].filter(landmark);
      for (const element of server) {
        const paths = index.get(key(element));
        if (!paths) {
          faults.push({ kind: "vanished", key: key(element), from: path(element), to: "" });
        } else if (!paths.includes(path(element))) {
          faults.push({ kind: "moved", key: key(element), from: path(element), to: paths[0] });
        }
      }
      return { faults, seen: server.length };
    },
    [html],
  );

/** Everything the page can tell us about one component, after it has settled. */
async function inspect(page) {
  return page.evaluate(() => {
    const section = document.querySelector("[data-component]");
    if (!section) return { present: false };
    const box = section.getBoundingClientRect();
    // A component whose whole render is a portal — an open Modal, a Drawer —
    // leaves its own section empty, so "did it render" has to count what landed
    // outside the page shell too. Boxes rather than nodes: a framework's
    // injected scripts and templates are elements with no size.
    const shell = document.querySelector("main");
    const outside = [...document.body.querySelectorAll("*")].filter((element) => {
      if (shell?.contains(element)) return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }).length;
    return {
      present: true,
      name: section.getAttribute("data-component"),
      // A fiber on the element is the proof hydration ran at all: without it,
      // "no recoverable errors" is a statement about a page React never
      // touched.
      hydrated: Object.keys(section).some((key) => key.startsWith("__reactFiber$")),
      painted: (box.width > 0 && box.height > 0) || outside > 0,
      elements: section.querySelectorAll("*").length + outside,
      outside,
      recoverable: [...new Set(window.__recoverable ?? [])],
    };
  });
}

/** Every state attribute the sweep reads, off one element. */
const STATE = (element) => ({
  expanded: element.getAttribute("aria-expanded"),
  checked: element.getAttribute("aria-checked"),
  selected: element.getAttribute("aria-selected"),
  sort: element.getAttribute("aria-sort"),
  state: element.getAttribute("data-state"),
  value: element.getAttribute("aria-valuenow"),
  native: element.checked ?? null,
  text: element.value ?? null,
});

/** Whatever currently holds `aria-current`, named however it names itself. */
const labelled = (page) =>
  page
    .locator("[aria-current]")
    .first()
    .evaluate((element) => element.getAttribute("aria-label") ?? element.textContent, undefined, {
      timeout: 2000,
    })
    .catch(() => null);

/**
 * Fires one affordance and reports what the state attribute did.
 *
 * Held as an element handle rather than as a locator: a click that opens a
 * surface re-renders the trigger, and a locator re-queried afterwards can match
 * a different element or none at all — which is a harness failure wearing the
 * costume of a component failure.
 */
async function fire(page, affordance) {
  const locator = page.locator(affordance.selector).first();
  // Counted before it is waited for: `elementHandle` waits out its whole
  // timeout when nothing matches, and most rules match nothing on most
  // components — nine rules against thirty routes turned a 30-second sweep
  // into an eight-minute one.
  if ((await locator.count()) === 0) return null;
  const handle = await locator.elementHandle({ timeout: 2000 }).catch(() => null);
  if (!handle) return null;

  const before = await handle.evaluate(STATE).catch(() => ({}));

  // Some state lives on a container whose control is a descendant; where there
  // is none, the element is its own control.
  const inner = affordance.within ? locator.locator(affordance.within).first() : null;
  const control =
    inner && (await inner.count()) > 0
      ? ((await inner.elementHandle({ timeout: 2000 }).catch(() => null)) ?? handle)
      : handle;

  // Read before the click, for the rules whose state is not on the control.
  const currentBefore = affordance.expect === "current" ? await labelled(page) : null;

  try {
    if (affordance.action === "type") {
      await control.fill("42", { timeout: 5000 });
    } else if (affordance.action === "hover") {
      await control.hover({ timeout: 5000 });
    } else if (affordance.action === "arrow") {
      await control.focus({ timeout: 5000 });
      await page.keyboard.press("ArrowRight");
    } else {
      await control.click({ timeout: 5000 });
    }
  } catch (error) {
    return { id: affordance.id, ok: false, detail: `could not act: ${String(error).split("\n")[0]}` };
  }

  await page.waitForTimeout(250);

  if (affordance.expect === "current") {
    const currentAfter = await labelled(page);
    return {
      id: affordance.id,
      ok: currentAfter !== null && currentAfter !== currentBefore,
      detail: `aria-current ${currentBefore} → ${currentAfter}`,
    };
  }

  if (affordance.expect === "surface") {
    const surface = page.locator(affordance.surface).first();
    const ok = (await surface.count()) > 0 && (await surface.isVisible().catch(() => false));
    return { id: affordance.id, ok, detail: ok ? "surface opened" : "nothing opened" };
  }

  // A detached handle means the click replaced the node rather than updating
  // it; the same selector's first match is then the honest thing to read.
  const connected = await handle.evaluate((element) => element.isConnected).catch(() => false);
  const after = connected
    ? await handle.evaluate(STATE).catch(() => ({}))
    : await page
        .locator(affordance.selector)
        .first()
        .evaluate(STATE, undefined, { timeout: 2000 })
        .catch(() => ({}));

  const verdict = {
    "aria-expanded=true": [after.expanded === "true", `aria-expanded=${after.expanded}`],
    "aria-checked=true": [after.checked === "true", `aria-checked=${after.checked}`],
    checked: [after.native === true, `checked=${after.native}`],
    "aria-selected=true": [after.selected === "true", `aria-selected=${after.selected}`],
    "aria-sort!=none": [after.sort !== "none" && after.sort != null, `aria-sort=${after.sort}`],
    "data-state=open": [after.state === "open", `data-state=${after.state}`],
    value: [Boolean(after.text) && after.text !== before.text, `value=${JSON.stringify(after.text ?? null)}`],
    "aria-valuenow-changed": [
      after.value !== before.value,
      `aria-valuenow ${before.value} → ${after.value}`,
    ],
  }[affordance.expect];

  return {
    id: affordance.id,
    ok: verdict[0],
    detail: connected ? verdict[1] : `${verdict[1]} (trigger was replaced)`,
  };
}

/** The route `RefPaths` renders on; see REF_PATHS in `_app/all/registry.tsx`. */
const REF_PATHS = "__refpaths";

/**
 * Presses Tab until focus is on what `selector` matches, from a fresh page.
 *
 * Keyboard rather than `element.focus()`: Tooltip opens on keyboard focus only,
 * and a programmatic focus is not one. Bounded, because a probe that tabs
 * forever is a hang that reads as a slow component.
 */
async function tabTo(page, selector) {
  for (let press = 0; press < 12; press += 1) {
    await page.keyboard.press("Tab");
    if (await page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)) return true;
  }
  return false;
}

/**
 * The two ref paths React 18 and 19 disagree about, asserted on what a user
 * would see rather than on the ref itself.
 *
 * A broken submenu anchor is still a submenu in the DOM — `aria-expanded` goes
 * true and every item is there — so presence proves nothing: on React 18 it sat
 * at 0,0 with opacity 0. The placement is the assertion: a non-empty box beside
 * the item that opened it, faded all the way in. "Beside" allows either side,
 * because the surface flips left when the item is near the viewport edge.
 *
 * For `asChild` the consumer's own ref is read, because that is what React 18
 * dropped while the library's internal ref kept the tooltip working.
 */
async function refPathChecks(page, url) {
  const ready = async () => {
    await page.goto(url, { waitUntil: "load", timeout: 30_000 });
    await page
      .waitForFunction(() => Boolean(window.__refPaths), { timeout: 15_000 })
      .catch(() => {});
  };

  await ready();
  const trigger = `[data-component='${REF_PATHS}'] button[aria-haspopup]`;
  let submenu = { ok: false, detail: "the CascadingDropdown trigger never took keyboard focus" };
  if (await tabTo(page, trigger)) {
    await page.keyboard.press("Enter");
    const parent = page.locator("[role='menuitem'][aria-haspopup='menu']").first();
    const opened = await parent
      .waitFor({ state: "visible", timeout: 3000 })
      .then(() => true, () => false);
    if (!opened) {
      submenu = { ok: false, detail: "the menu did not open on Enter" };
    } else {
      for (let press = 0; press < 4 && !(await parent.getAttribute("data-highlighted")); press += 1) {
        await page.keyboard.press("ArrowDown");
      }
      await page.keyboard.press("ArrowRight");
      const faded = await page
        .waitForFunction(
          () => {
            const surface = document.querySelector("[data-cascading-submenu]");
            return Boolean(surface) && getComputedStyle(surface).opacity === "1";
          },
          undefined,
          { timeout: 2000 },
        )
        .then(() => true, () => false);
      const placed = await page.evaluate(() => {
        const surface = document.querySelector("[data-cascading-submenu]");
        const item = document.querySelector("[role='menuitem'][aria-expanded='true']");
        if (!surface || !item) return null;
        const s = surface.getBoundingClientRect();
        const i = item.getBoundingClientRect();
        return {
          x: Math.round(s.left),
          y: Math.round(s.top),
          width: Math.round(s.width),
          height: Math.round(s.height),
          opacity: getComputedStyle(surface).opacity,
          beside:
            (Math.abs(s.left - i.right) <= 16 || Math.abs(s.right - i.left) <= 16) &&
            s.top < i.bottom &&
            s.bottom > i.top,
        };
      });
      submenu = !placed
        ? { ok: false, detail: "no submenu surface after ArrowRight" }
        : {
            ok: faded && placed.width > 0 && placed.height > 0 && placed.beside,
            detail:
              `submenu at (${placed.x},${placed.y}) ${placed.width}x${placed.height} opacity ${placed.opacity}` +
              (placed.beside ? ", beside its item" : ", NOT beside its item"),
            line: `submenu placed (${placed.x},${placed.y}) opacity ${placed.opacity}`,
          };
    }
  }

  await ready();
  const resolved = await page.evaluate(() => window.__refPaths ?? null);
  const focused = await tabTo(page, "#refpaths-tip");
  const tip = focused
    ? await page
        .locator("[role='tooltip']")
        .first()
        .waitFor({ state: "visible", timeout: 3000 })
        .then(() => true, () => false)
    : false;
  const asChild = {
    ok: Boolean(resolved?.asChildIsTarget) && tip,
    detail:
      `consumer ref → ${resolved ? resolved.asChild : "never reported"}` +
      `${resolved?.asChildIsTarget ? " (the trigger)" : ""}; ` +
      `tooltip ${tip ? "opened" : "did NOT open"} on keyboard focus`,
    line: `asChild ref → ${resolved ? resolved.asChild : "never reported"}`,
  };

  return { submenu, asChild };
}

/**
 * One component, on its own route: render, hydration and a smoke interaction.
 * Not a second test suite — the unit and e2e tiers cover behaviour far better
 * than a consumer application can. What this catches is a component that works
 * in the dev harness and not in a real framework's runtime.
 */
async function sweepComponent(page, url, name, { ssr }) {
  const crashes = [];
  const onError = (error) => crashes.push(error.message);
  page.on("pageerror", onError);
  try {
    await page.goto(url, { waitUntil: "load", timeout: 30_000 });
    // Hydration is asynchronous: React Router and Next both hydrate in a
    // transition, so the fiber is not there when `load` fires.
    await page
      .waitForFunction(
        () => {
          const section = document.querySelector("[data-component]");
          return !!section && Object.keys(section).some((key) => key.startsWith("__reactFiber$"));
        },
        { timeout: 15_000 },
      )
      .catch(() => {});
    await page.waitForTimeout(250);

    // Fetched rather than read from the page: `document.documentElement` is
    // already the hydrated tree, so the only way to see what the server sent is
    // to ask the server again.
    const served = ssr
      ? await fetch(url)
          .then((response) => response.text())
          .catch(() => "")
      : "";

    const seen = await inspect(page);
    const result = {
      name,
      present: seen.present,
      hydrated: Boolean(seen.hydrated),
      painted: Boolean(seen.painted),
      elements: seen.elements ?? 0,
      outside: seen.outside ?? 0,
      recoverable: seen.recoverable ?? [],
      crashes: [...crashes],
      affordances: [],
      // Compared before the sweep touches anything: an affordance that opens a
      // menu changes the tree on purpose.
      structure: served ? await compareTrees(page, served) : { faults: [], seen: 0 },
    };

    // The canary is the control and has nothing to interact with; every other
    // route is swept whether or not it is expected to have an affordance,
    // because "expected none, found one" is worth seeing too.
    if (name !== CANARY && result.hydrated) {
      for (const affordance of AFFORDANCES) {
        try {
          const outcome = await fire(page, affordance);
          if (outcome) result.affordances.push(outcome);
          // Each rule starts from the closed state: an open filter dialog
          // swallows the click the next rule aims at the header behind it,
          // which reads as the component failing rather than the sweep.
          if (outcome) {
            await page.keyboard.press("Escape");
            await page.waitForTimeout(150);
          }
        } catch (error) {
          // Contained per component: a harness failure on one route is a
          // finding about that route, not a reason to abandon the other thirty.
          result.affordances.push({
            id: affordance.id,
            ok: false,
            detail: `harness: ${String(error).split("\n")[0]}`,
          });
        }
      }
      const after = await inspect(page);
      result.recoverable = [...new Set([...result.recoverable, ...(after.recoverable ?? [])])];
      result.crashes = [...crashes];
    }

    if (!ssr) result.recoverable = [];
    return result;
  } finally {
    page.off("pageerror", onError);
  }
}

/**
 * The whole runtime pass for one consumer: the grid page, then every component
 * on its own route.
 *
 * Returns the per-route results beside the steps, because the SSR record in
 * `docs/adr/003-ssr-hydration.json` is derived from them — `ai/component-index.json`
 * used to assert `"ssr": "safe"` with nothing behind it.
 */
export async function runtimeChecks(dir, target) {
  const { chromium } = await import("@playwright/test");
  const app =
    target.runtime.serve === "static" ? await serve(join(dir, target.output)) : await startApp(dir);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(CAPTURE);

  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const ssr = Boolean(target.ssr);
  const steps = [];
  try {
    // The grid: all thirty in one tree, which is the page the SSR targets
    // prerender and the only one that can answer "do they render together".
    const grid = await sweepComponent(page, app.url, "__grid", { ssr: false });
    const painted = await page.evaluate(() =>
      [...document.querySelectorAll("[data-component]")].map((section) => {
        const box = section.getBoundingClientRect();
        return {
          name: section.getAttribute("data-component"),
          painted: box.width > 0 && box.height > 0 && section.querySelectorAll("*").length > 0,
        };
      }),
    );
    const blank = painted.filter((entry) => !entry.painted).map((entry) => entry.name);
    const absent = EXPECTED.filter((name) => !painted.some((entry) => entry.name === name));
    steps.push({
      label: "grid renders",
      ok: absent.length === 0 && blank.length === 0 && grid.crashes.length === 0,
      output:
        `${painted.length} of ${EXPECTED.length} component(s) on one page, ${blank.length} blank` +
        (absent.length ? `\n      missing from the registry: ${absent.join(", ")}` : "") +
        (blank.length ? `\n      blank: ${blank.join(", ")}` : "") +
        (grid.crashes.length ? `\n      crash: ${grid.crashes.join(" | ")}` : ""),
    });

    // What to sweep comes from the running application, not from a list kept
    // here: three frameworks generate their routes from the registry, and a
    // second copy beside the driver is a copy that drifts.
    await page.goto(`${app.url}${target.runtime.route(ROUTES)}`, { waitUntil: "load" });
    const names = JSON.parse(await page.locator("[data-routes]").first().innerText()).filter(
      (name) => name !== ROUTES,
    );

    // Seeded once, on the application's own origin, before anything is swept:
    // `Accordion__stored` only diverges when storage already holds a value, and
    // it has to be there before the page loads, not after.
    await page.evaluate(
      ([key]) => window.localStorage.setItem(key, JSON.stringify(["one"])),
      [ACCORDION_STORAGE_KEY],
    );

    const results = [];
    for (const name of names) {
      results.push(await sweepComponent(page, `${app.url}${target.runtime.route(name)}`, name, { ssr }));
    }

    const components = results.filter((result) => EXPECTED.includes(result.name));
    const variants = results.filter(
      (result) => result.name !== CANARY && !EXPECTED.includes(result.name),
    );
    const canary = results.find((result) => result.name === CANARY);

    const missing = EXPECTED.filter((name) => !names.includes(name));
    if (missing.length) {
      steps.push({
        label: "routes",
        ok: false,
        output: `the application routes ${names.length} name(s) and does not route: ${missing.join(", ")}`,
      });
    }

    const unrendered = components.filter((result) => !result.painted || result.elements === 0);
    steps.push({
      label: `renders ${components.length - unrendered.length}/${components.length}`,
      ok: unrendered.length === 0,
      output:
        unrendered.length === 0
          ? `every component painted on its own route`
          : unrendered
              .map((r) => `${r.name}: painted=${r.painted} elements=${r.elements} ${r.crashes[0] ?? ""}`)
              .join("\n      "),
    });

    const blankVariants = variants.filter((result) => !result.painted || result.elements === 0);
    steps.push({
      label: `variants ${variants.length - blankVariants.length}/${variants.length}`,
      ok: blankVariants.length === 0,
      output:
        `${variants.map((result) => result.name).join(", ")}` +
        (blankVariants.length
          ? `\n      blank: ${blankVariants.map((r) => r.name).join(", ")}`
          : ""),
    });

    const crashed = [...components, ...variants].filter((result) => result.crashes.length > 0);
    steps.push({
      label: "no uncaught error",
      ok: crashed.length === 0,
      output:
        crashed.length === 0
          ? "no component threw in the browser"
          : crashed.map((r) => `${r.name}: ${r.crashes.join(" | ")}`).join("\n      "),
    });

    if (ssr) {
      const routed = [...components, ...variants];
      const notHydrated = routed.filter((result) => !result.hydrated);
      const mismatched = routed.filter((result) => result.recoverable.length > 0);
      steps.push({
        label: "hydration",
        // Both halves: no errors, AND React actually hydrated every route. A
        // page React never reached reports no errors either.
        ok: mismatched.length === 0 && notHydrated.length === 0,
        output:
          `${routed.length - notHydrated.length} of ${routed.length} route(s) hydrated, ` +
          `${mismatched.length} with a recoverable error` +
          (notHydrated.length ? `\n      never hydrated: ${notHydrated.map((r) => r.name).join(", ")}` : "") +
          (mismatched.length
            ? `\n      ${mismatched.map((r) => `${r.name}: ${r.recoverable.join(" | ")}`).join("\n      ")}`
            : ""),
      });
      const undeclared = routed.filter(
        (result) => result.structure.faults.length > 0 && !DECLARED_REPLACEMENTS[result.name],
      );
      const mover = results.find((result) => result.name === MOVER);
      steps.push({
        label: "server tree preserved",
        // Both halves, like the canary: nothing moved that should not have,
        // AND the one thing that should have moved was seen to.
        ok: undeclared.length === 0 && Boolean(mover?.structure.faults.length),
        output:
          `${routed.reduce((total, r) => total + r.structure.seen, 0)} server landmark(s) ` +
          `across ${routed.length} route(s), ${undeclared.length} moved or vanished` +
          (undeclared.length
            ? `\n      ${undeclared
                .flatMap((result) =>
                  result.structure.faults.map(
                    (fault) =>
                      `${result.name}: ${fault.kind} ${fault.key}` +
                      (fault.kind === "moved" ? ` — ${fault.from} → ${fault.to}` : ` — ${fault.from}`),
                  ),
                )
                .join("\n      ")}`
            : "") +
          (mover?.structure.faults.length
            ? `\n      control: __mover ${mover.structure.faults[0].kind} as expected, and ` +
              `React reported ${mover.recoverable.length} recoverable error(s) for it`
            : "\n      the __mover control was NOT faulted: this check is not reading anything"),
      });
      steps.push({
        label: "canary caught",
        ok: Boolean(canary && canary.recoverable.length > 0),
        output: canary
          ? canary.recoverable.length
            ? `the planted mismatch was reported — ${canary.recoverable.join(" | ")}`
            : "the planted mismatch was NOT reported: this template's hydration channel is unread, " +
              "and every clean result above is unproven"
          : "no canary route",
      });
    }

    const failed = components.flatMap((result) =>
      result.affordances.filter((a) => !a.ok).map((a) => `${result.name}/${a.id}: ${a.detail}`),
    );
    const short = components.filter(
      (result) => result.affordances.length < (EXPECTED_AFFORDANCES[result.name] ?? 0),
    );
    const fired = components.reduce((total, result) => total + result.affordances.length, 0);
    steps.push({
      label: "interactions",
      ok: failed.length === 0 && short.length === 0,
      output:
        `${fired} affordance(s) fired across ` +
        `${components.filter((r) => r.affordances.length > 0).length} component(s); ` +
        `${components.filter((r) => r.affordances.length === 0).length} with none (` +
        `${components.filter((r) => r.affordances.length === 0).map((r) => r.name).join(", ")})` +
        (short.length
          ? `\n      below the recorded floor: ${short
              .map((r) => `${r.name} ${r.affordances.length}/${EXPECTED_AFFORDANCES[r.name]}`)
              .join(", ")}`
          : "") +
        (failed.length ? `\n      ${failed.join("\n      ")}` : ""),
    });

    const refs = await refPathChecks(page, `${app.url}${target.runtime.route(REF_PATHS)}`);
    process.stdout.write(
      `  ref paths: ${refs.submenu.line ?? refs.submenu.detail}; ${refs.asChild.line}\n`,
    );
    steps.push(
      { label: "submenu placed", ok: refs.submenu.ok, output: refs.submenu.detail },
      { label: "asChild ref", ok: refs.asChild.ok, output: refs.asChild.detail },
    );

    steps.push({
      label: "no console error",
      ok: consoleErrors.length === 0,
      output: consoleErrors.slice(0, 6).join(" | ") || "clean across every route",
    });

    // The whole per-component result set, beside the scaffold. The steps above
    // are a verdict; this is the evidence, and `--keep` leaves it readable.
    writeFileSync(
      join(dir, "runtime-report.json"),
      `${JSON.stringify({ target: target.name, url: app.url, results }, null, 2)}\n`,
      "utf8",
    );

    return { steps, results };
  } finally {
    await browser.close();
    await app.close();
  }
}
