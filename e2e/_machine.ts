import { execFileSync } from "node:child_process";
import { cpus, freemem, loadavg, platform, totalmem } from "node:os";

/**
 * The machine a run is about to start on, and whether it may.
 *
 * WebKit and mobile runs have taken this 8 GB Mac down rather than failed on
 * it: during the D1 WebKit run launchd had about 105 xpcproxy processes in
 * flight, load reached 140 with the CPU 40% idle, and a WindowServer watchdog
 * restarted the machine (2026-10-21 09:24). Short of that, runs under load fail
 * on their own: 38 click-stability timeouts in Mobile Safari at load 42 (X1R),
 * 14 WebKit failures at a 5-minute load of 98 (A2a), every one passing on a
 * quiet re-run. Starting such a run on a machine that is already busy is how
 * it gets there, so the config refuses to start one.
 */

/** Projects this guard can refuse. Chromium, Firefox and the rest only print. */
export const GUARDED_PROJECTS = ["webkit", "Mobile Safari", "Mobile Chrome"];

/**
 * Memory free (`memory_pressure`'s system-wide free percentage) a guarded run
 * may not start below: the 25% at which a run is stopped, plus the 36 points
 * a single-worker WebKit run drew down at its worst (68% to 32% with video,
 * 69% to 35% without, forms + pagination + flex-shrink, 2026-10-26; Mobile
 * Chrome at 4 workers drew 69% to 42%). A run that starts under 60 can reach
 * the stop line on its own.
 */
export const MEMORY_FREE_FLOOR = 60;

/**
 * One-minute load a guarded run may not start above: one per core. A
 * single-worker WebKit run adds about 1 to 4.5 to load1 on its own (peaks of
 * 3.2 to 6.7 from a start near 2, 2026-10-26), so a run started at 8 stays in
 * the low teens; the failing runs above were at 42 and 98.
 */
export const LOAD1_CEILING = cpus().length;

export type Machine = { load1: number; memoryFree: number; swapUsedMb: number | null };

/**
 * `memory_pressure` rather than `os.freemem()` on macOS: freemem counts only
 * pages nobody holds, which on this machine is a few percent while the system
 * reports 70% free, and the stop rule is stated in the system's number.
 */
export function machine(): Machine {
  const load1 = Number(loadavg()[0].toFixed(2));
  if (platform() !== "darwin")
    return { load1, memoryFree: Math.round((freemem() / totalmem()) * 100), swapUsedMb: null };
  const pressure = execFileSync("memory_pressure", ["-Q"], { encoding: "utf8" });
  const swap = execFileSync("sysctl", ["-n", "vm.swapusage"], { encoding: "utf8" });
  return {
    load1,
    memoryFree: Number(/free percentage: (\d+)%/.exec(pressure)?.[1] ?? NaN),
    swapUsedMb: Number(/used = ([\d.]+)M/.exec(swap)?.[1] ?? NaN),
  };
}

/** Projects named on the command line; every project when none is. */
function selectedProjects(argv: string[], all: string[]): string[] {
  const named: string[] = [];
  argv.forEach((arg, i) => {
    if (arg.startsWith("--project=")) named.push(arg.slice("--project=".length));
    else if (arg === "--project" && argv[i + 1]) named.push(argv[i + 1]);
  });
  if (!named.length) return all;
  // `--project` takes globs as well as names.
  const matches = (pattern: string, name: string) =>
    new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`, "i").test(name);
  return all.filter((name) => named.some((pattern) => matches(pattern, name)));
}

/**
 * Prints the machine at the start of every run, and refuses a guarded run the
 * machine cannot carry. Called from the config, which every worker loads too:
 * only the runner prints. `--list` runs nothing and is never refused.
 * `E2E_MACHINE_GUARD=off` prints the refusal and starts anyway.
 */
export function guardRun(allProjects: string[]): void {
  if (process.env.TEST_WORKER_INDEX !== undefined) return;
  const m = machine();
  const guarded = selectedProjects(process.argv, allProjects).filter((p) => GUARDED_PROJECTS.includes(p));
  const breaches = [
    m.memoryFree < MEMORY_FREE_FLOOR && `memory free ${m.memoryFree}% is under ${MEMORY_FREE_FLOOR}%`,
    m.load1 > LOAD1_CEILING && `load1 ${m.load1} is over ${LOAD1_CEILING}`,
  ].filter(Boolean);
  console.error(
    `e2e machine: load1 ${m.load1} (ceiling ${LOAD1_CEILING}), memory free ${m.memoryFree}% ` +
      `(floor ${MEMORY_FREE_FLOOR}%), swap used ${m.swapUsedMb ?? "?"}MB; ` +
      `guarded projects in this run: ${guarded.join(", ") || "none"}`,
  );
  if (!guarded.length || !breaches.length || process.argv.includes("--list")) return;
  const refusal = `e2e machine guard: not starting ${guarded.join(", ")}: ${breaches.join("; ")}.`;
  if (process.env.E2E_MACHINE_GUARD === "off") {
    console.error(`${refusal} Starting anyway: E2E_MACHINE_GUARD=off.`);
    return;
  }
  throw new Error(`${refusal} Wait for the machine to settle, or set E2E_MACHINE_GUARD=off.`);
}
