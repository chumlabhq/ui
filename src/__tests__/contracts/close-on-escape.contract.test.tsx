/** @jsxImportSource react */
/**
 * Which surfaces a consumer may stop closing on Escape, and how.
 *
 * A dialog, a drawer and a toast are things a product can reasonably hold open:
 * a form with unsaved changes, a toast the user has to act on. They share one
 * switch, `closeOnEscape`, on by default. Toast spelled it with `dismiss` for
 * `close` until 2026-10-08, so the three named the same decision two ways; the
 * derivation below still matches either verb, so a return of the old name fails.
 *
 * Everything else that closes on Escape — the listbox and menu surfaces and
 * Tooltip — keeps no switch at all: the APG listbox, combobox and menu patterns
 * require Escape to close them, and WCAG 1.4.13 requires tooltip content to be
 * dismissible without moving the pointer.
 *
 * Both sets are read from source: a component directory with an Escape-close
 * path of its own, or one that uses the shared menu navigation (whose Escape
 * calls `onClose`). Those whose props declare an Escape switch defaulting to on
 * are the population; the rest are the excluded set.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ts from "typescript";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import { createElement, type ComponentType, type ReactNode } from "react";
import * as lib from "../../index.js";
import { ToastProvider, useToast } from "../../components/Toast/index.js";
import { Modal } from "../../components/Modal/index.js";
import { Drawer, DrawerBody } from "../../components/Drawer/index.js";
import { Tooltip } from "../../components/Tooltip/index.js";
import { componentNames } from "../../test/emittedAttributes.js";
import { fixturesFor } from "../fixtures/index.js";
import { fixtureSession } from "../fixtures/_act.contract.js";
import { setReducedMotion } from "../../test/matchMedia.js";

const ROOT = join(process.cwd(), "src/components");
const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "__tests__" ? [] : sourceFiles(path);
    return /\.tsx?$/.test(entry) && !/\.test\./.test(entry) ? [path] : [];
  });
const parse = (file: string) =>
  ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

/** A call that closes something: the handler, a setter put to false, or the change callback. */
const CLOSES = /\b(handleClose|onClose|setOpen|setIsOpen|setDropdownOpen|onOpenChange|close\w*)\s*\(|\bset\w*Open\(\s*false|\.close\(/;

/** Does any function in this file compare a key with "Escape" and close something? */
const closesOnEscape = (file: string): boolean => {
  const sf = parse(file);
  let found = false;
  const visit = (node: ts.Node): void => {
    if (found) return;
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node) || ts.isFunctionDeclaration(node)) {
      const text = node.getText(sf);
      if (/\.(key|code)\s*[!=]==?\s*["']Escape["']|["']Escape["']\s*[!=]==?\s*\w+\.(key|code)|case\s+["']Escape["']/.test(text) && CLOSES.test(text)) {
        // The innermost such function decides, so a large handler that also
        // closes on another key does not count on its own.
        let inner = false;
        ts.forEachChild(node, function child(n: ts.Node) {
          if (inner) return;
          if ((ts.isArrowFunction(n) || ts.isFunctionExpression(n)) && /["']Escape["']/.test(n.getText(sf))) {
            inner = true;
            return;
          }
          ts.forEachChild(n, child);
        });
        if (!inner) {
          found = true;
          return;
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found;
};

const usesMenuNavigation = (file: string) => /from\s+["'][^"']*useMenuNavigation(\.js)?["']/.test(readFileSync(file, "utf8"));

/** Escape switches a component's own props declare, with the default its component destructures. */
const switchesIn = (files: string[]) => {
  const declared: Array<{ component: string; prop: string; defaultValue: string | null; at: string }> = [];
  for (const file of files) {
    const sf = parse(file);
    const visit = (node: ts.Node): void => {
      if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && /Props$/.test(node.name.text)) {
        const component = node.name.text.replace(/Props$/, "");
        ts.forEachChild(node, function members(m: ts.Node) {
          if (ts.isPropertySignature(m) && /^(close|dismiss)OnEscape$/.test(m.name.getText(sf))) {
            declared.push({ component, prop: m.name.getText(sf), defaultValue: null, at: `${basename(file)}:${sf.getLineAndCharacterOfPosition(m.getStart(sf)).line + 1}` });
          }
          ts.forEachChild(m, members);
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  for (const d of declared) {
    const file = files.find((f) => basename(f) === `${d.component}.tsx`);
    if (!file) continue;
    const sf = parse(file);
    const visit = (node: ts.Node): void => {
      if (ts.isBindingElement(node) && node.initializer && (node.propertyName ?? node.name).getText(sf) === d.prop) {
        d.defaultValue ??= node.initializer.getText(sf);
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return declared;
};

const inventory = componentNames()
  .filter((name) => statSync(join(ROOT, name)).isDirectory())
  .map((name) => {
    const files = sourceFiles(join(ROOT, name));
    const closes = files.some(closesOnEscape) || files.some(usesMenuNavigation);
    return { name, closes, switches: closes ? switchesIn(files) : [] };
  })
  .filter((c) => c.closes);

/** The consumer-facing switches: declared, and on unless the consumer turns them off. */
const POPULATION = inventory.flatMap((c) =>
  c.switches.filter((s) => s.defaultValue === "true").map((s) => ({ ...s, directory: c.name })),
);
const EXCLUDED = inventory.filter((c) => c.switches.length === 0).map((c) => c.name);

beforeEach(() => {
  setReducedMotion(false);
  vi.useFakeTimers({ shouldAdvanceTime: true });
});
afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  cleanup();
});

const settle = () =>
  act(async () => {
    vi.advanceTimersByTime(600);
  });

const Toasts = ({ children, closeOnEscape }: { children?: ReactNode; closeOnEscape?: boolean }) => {
  const Show = () => {
    const toast = useToast();
    return <button onClick={() => toast.info("Kept message", { duration: Infinity })}>Show toast</button>;
  };
  // The prop is spread so the contract compiles against either spelling: it is
  // the assertions, not the type checker, that say which name is honoured.
  const props = closeOnEscape === undefined ? {} : ({ closeOnEscape } as Record<string, boolean>);
  return (
    <ToastProvider {...props}>
      <Show />
      {children}
    </ToastProvider>
  );
};

/** Each population member, opened, with a way to tell whether it closed. */
const OPENERS: Record<
  string,
  (props: Record<string, unknown>) => Promise<{ closed: () => boolean }>
> = {
  Modal: async (props) => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} disableAnimation title="Dialog" {...props}>
        <p>Dialog body</p>
      </Modal>,
    );
    return { closed: () => onOpenChange.mock.calls.some(([open]) => open === false) };
  },
  Drawer: async (props) => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange} aria-label="Panel" duration={0} {...props}>
        <DrawerBody>Panel body</DrawerBody>
      </Drawer>,
    );
    return { closed: () => onOpenChange.mock.calls.some(([open]) => open === false) };
  },
  ToastProvider: async (props) => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Toasts closeOnEscape={props.closeOnEscape as boolean | undefined} />);
    await user.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByText("Kept message")).toBeInTheDocument();
    return { closed: () => !screen.queryByText("Kept message") };
  },
};

describe("close-on-escape contract", () => {
  it("derives its population and excluded set from source", () => {
    console.log(
      `CLOSE_ON_ESCAPE population ${POPULATION.length}: ${POPULATION.map((p) => `${p.component}.${p.prop}=${p.defaultValue} (${p.at})`).join(", ")}`,
    );
    console.log(`CLOSE_ON_ESCAPE excluded ${EXCLUDED.length}: ${EXCLUDED.join(", ")}`);
    expect(POPULATION.length, "no Escape switch found — the derivation read nothing").toBeGreaterThan(0);
    expect(EXCLUDED.length, "no Escape-closing surface without a switch — the derivation read nothing").toBeGreaterThan(0);
  });

  for (const member of POPULATION) {
    describe(member.component, () => {
      it("calls its switch closeOnEscape", () => {
        expect(member.prop, `${member.component} spells the Escape switch ${member.prop} (${member.at})`).toBe("closeOnEscape");
      });

      it("has an opener here", () => {
        expect(OPENERS[member.component], `${member.component} has a switch and nothing here opens it`).toBeDefined();
      });

      it("closes on Escape by default", async () => {
        const surface = await OPENERS[member.component]!({});
        await userEvent.setup({ advanceTimers: vi.advanceTimersByTime }).keyboard("{Escape}");
        await settle();
        expect(surface.closed(), `${member.component} did not close on Escape with no prop`).toBe(true);
      });

      it("stays open on Escape with closeOnEscape={false}", async () => {
        const surface = await OPENERS[member.component]!({ closeOnEscape: false });
        await userEvent.setup({ advanceTimers: vi.advanceTimersByTime }).keyboard("{Escape}");
        await settle();
        expect(surface.closed(), `${member.component} closed on Escape with closeOnEscape={false}`).toBe(false);
      });
    });
  }

  /**
   * An open surface that declines Escape still owns the key. A toast listens
   * last and ignores a marked Escape, so if the surface on top did not mark it,
   * the toast underneath would be dismissed by a key aimed at the dialog.
   */
  describe("a surface that declines Escape still marks it handled", () => {
    const CASES: Array<{ name: string; surface: (onOpenChange: () => void) => ReactNode }> = [
      {
        name: "Modal",
        surface: (onOpenChange) => (
          <Modal open onOpenChange={onOpenChange} disableAnimation closeOnEscape={false} title="Dialog">
            <p>Dialog body</p>
          </Modal>
        ),
      },
      {
        name: "Drawer (modal)",
        surface: (onOpenChange) => (
          <Drawer open onOpenChange={onOpenChange} aria-label="Panel" duration={0} closeOnEscape={false}>
            <DrawerBody>Panel body</DrawerBody>
          </Drawer>
        ),
      },
      {
        name: "Drawer (non-modal)",
        surface: (onOpenChange) => (
          <Drawer open onOpenChange={onOpenChange} aria-label="Panel" duration={0} modal={false} closeOnEscape={false}>
            <DrawerBody>Panel body</DrawerBody>
          </Drawer>
        ),
      },
    ];
    for (const c of CASES) {
      it(`${c.name} over an open toast: neither closes`, async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const onOpenChange = vi.fn();
        const { rerender } = render(<Toasts />);
        await user.click(screen.getByRole("button", { name: "Show toast" }));
        rerender(<Toasts>{c.surface(onOpenChange)}</Toasts>);
        await user.keyboard("{Escape}");
        await settle();
        expect(onOpenChange, `${c.name} closed on Escape with closeOnEscape={false}`).not.toHaveBeenCalled();
        expect(screen.queryByText("Kept message"), `the toast behind ${c.name} was dismissed by its Escape`).toBeInTheDocument();
      });
    }

    // Decided earlier: a non-modal drawer that does close takes the key too, so the
    // top-most surface wins and the toast is not also dismissed.
    it("Drawer (non-modal) that closes over an open toast leaves the toast", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onOpenChange = vi.fn();
      const { rerender } = render(<Toasts />);
      await user.click(screen.getByRole("button", { name: "Show toast" }));
      rerender(
        <Toasts>
          <Drawer open onOpenChange={onOpenChange} aria-label="Panel" duration={0} modal={false}>
            <DrawerBody>Panel body</DrawerBody>
          </Drawer>
        </Toasts>,
      );
      await user.keyboard("{Escape}");
      await settle();
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(screen.queryByText("Kept message"), "the toast behind a closing non-modal drawer was dismissed").toBeInTheDocument();
    });
  });

  /**
   * The excluded set keeps Escape: no switch in its props, and the key still
   * closes it. Opened from each one's own fixture; a controlled fixture is
   * opened uncontrolled instead, so that closing is something it can do.
   */
  describe("surfaces that always close on Escape", () => {
    const OPEN_FIXTURE: Record<string, string> = {
      Tooltip: "open",
      Dropdown: "open",
      SearchableDropdown: "open",
      MultiSelectDropdown: "open",
      MultiSelectSearchableDropdown: "open",
      CascadingDropdown: "open",
      DatePicker: "open",
      TimePicker: "open",
      Breadcrumb: "collapsed-open",
      Pagination: "rows-per-page-open",
      Table: "filter-open",
    };
    const isOpen = () =>
      document.querySelectorAll('[aria-expanded="true"]').length + document.querySelectorAll('[role="tooltip"]').length;

    for (const name of EXCLUDED) {
      describe(name, () => {
        it("declares no Escape switch in its props", () => {
          const own = switchesIn(sourceFiles(join(ROOT, name)));
          expect(own.map((s) => `${s.component}.${s.prop} (${s.at})`)).toEqual([]);
        });

        it("still closes on Escape", async () => {
          const fixture = fixturesFor(name).find((f) => f.name === OPEN_FIXTURE[name]);
          expect(fixture, `${name} closes on Escape and nothing here says which fixture opens it`).toBeDefined();
          const Component = (lib as Record<string, unknown>)[name] as ComponentType<Record<string, unknown>>;
          const session = fixtureSession();
          const props = { ...(fixture!.props as Record<string, unknown>) };
          if ("open" in props) {
            props.defaultOpen = props.open;
            delete props.open;
          }
          await session.mountFixture(Component, { ...fixture!, props });
          expect(isOpen(), `${name}/${fixture!.name} rendered nothing open`).toBeGreaterThan(0);
          // Tooltip handles Escape on its trigger, the element its content describes.
          const tip = document.querySelector<HTMLElement>('[role="tooltip"]');
          const target =
            (tip?.id && document.querySelector<HTMLElement>(`[aria-describedby~="${tip.id}"]`)) ||
            (document.activeElement !== document.body && document.activeElement) ||
            document.querySelector<HTMLElement>('[aria-expanded="true"]') ||
            document.body;
          fireEvent.keyDown(target as HTMLElement, { key: "Escape", code: "Escape" });
          await settle();
          expect(isOpen(), `${name} did not close on Escape`).toBe(0);
          session.unmount();
        });
      });
    }
  });
});

/**
 * WCAG 1.4.13: content that appears on hover or focus can be dismissed without
 * moving the pointer or the focus. Tooltip handled Escape on its trigger only,
 * so a tooltip opened by hover, with focus anywhere else, ignored the key — and
 * inside an open Modal the Modal's capture-phase listener took Escape first and
 * closed the dialog under the tooltip.
 */
describe("Tooltip dismisses on Escape wherever focus is", () => {
  const tip = () => screen.queryByRole("tooltip");
  const Tipped = () => (
    <Tooltip content="Tip text" delayDuration={0}>
      <button>Has a tooltip</button>
    </Tooltip>
  );

  it("closes a hover-opened tooltip while another button has focus", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <>
        <button>Elsewhere</button>
        <Tipped />
      </>,
    );
    screen.getByRole("button", { name: "Elsewhere" }).focus();
    await user.hover(screen.getByRole("button", { name: "Has a tooltip" }));
    await settle();
    expect(tip(), "hover did not open the tooltip").toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Elsewhere" }));
    await user.keyboard("{Escape}");
    await settle();
    expect(tip(), "Escape left a hover-opened tooltip open while focus was elsewhere").not.toBeInTheDocument();
  });

  it("closes a hover-opened tooltip while nothing has focus", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Tipped />);
    await user.hover(screen.getByRole("button", { name: "Has a tooltip" }));
    await settle();
    expect(tip()).toBeInTheDocument();
    expect(document.activeElement).toBe(document.body);
    await user.keyboard("{Escape}");
    await settle();
    expect(tip(), "Escape left a hover-opened tooltip open with focus on body").not.toBeInTheDocument();
  });

  it("closes a focus-opened tooltip, as before", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Tipped />);
    await user.tab();
    await settle();
    expect(tip(), "keyboard focus did not open the tooltip").toBeInTheDocument();
    await user.keyboard("{Escape}");
    await settle();
    expect(tip()).not.toBeInTheDocument();
    expect(document.activeElement, "focus left the trigger").toBe(screen.getByRole("button", { name: "Has a tooltip" }));
  });

  const HOSTS: Array<{ name: string; host: (onOpenChange: () => void, children: ReactNode) => ReactNode }> = [
    {
      name: "Modal",
      host: (onOpenChange, children) => (
        <Modal open onOpenChange={onOpenChange} disableAnimation title="Dialog">
          {children}
        </Modal>
      ),
    },
    {
      name: "Drawer",
      host: (onOpenChange, children) => (
        <Drawer open onOpenChange={onOpenChange} aria-label="Panel" duration={0}>
          <DrawerBody>{children}</DrawerBody>
        </Drawer>
      ),
    },
  ];

  for (const h of HOSTS) {
    it(`inside an open ${h.name}: the first Escape closes only the tooltip, the second the ${h.name}`, async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onOpenChange = vi.fn();
      // Focus on another control inside the host, not on the trigger: a dialog
      // focuses its first control on open, and if that is the trigger the old
      // trigger-only handler happened to work.
      render(
        <>
          {h.host(
            onOpenChange,
            <>
              <button>Elsewhere</button>
              <Tipped />
            </>,
          )}
        </>,
      );
      screen.getByRole("button", { name: "Elsewhere" }).focus();
      await user.hover(screen.getByRole("button", { name: "Has a tooltip" }));
      await settle();
      expect(tip(), `hover did not open the tooltip inside the ${h.name}`).toBeInTheDocument();
      await user.keyboard("{Escape}");
      await settle();
      expect(tip(), "the first Escape left the tooltip open").not.toBeInTheDocument();
      expect(onOpenChange, `the ${h.name} closed on the Escape that was the tooltip's`).not.toHaveBeenCalled();
      await user.keyboard("{Escape}");
      await settle();
      expect(onOpenChange, `the second Escape did not reach the ${h.name}`).toHaveBeenCalledWith(false);
    });

    it(`with no tooltip open, Escape still closes the ${h.name}`, async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onOpenChange = vi.fn();
      render(<>{h.host(onOpenChange, <Tipped />)}</>);
      expect(tip()).not.toBeInTheDocument();
      await user.keyboard("{Escape}");
      await settle();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  }
});

void createElement;
