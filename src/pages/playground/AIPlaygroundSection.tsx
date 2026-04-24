import { useState } from "react";
import PlaygroundOnboarding from "./PlaygroundOnboarding";
import ConversationDemo from "./ConversationDemo";

export default function AIPlaygroundSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        id="ai-playground"
        className="relative min-h-screen flex items-center justify-center px-6 sm:px-10 pt-20 overflow-hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(99,102,241,0.12)_0%,rgba(168,85,247,0.05)_40%,transparent_70%)] blur-[40px]"
        />

        <div className="relative max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <h2 className="text-[28px] sm:text-4xl lg:text-[42px] xl:text-5xl font-bold tracking-tight leading-[1.08] mb-5 whitespace-nowrap">
                <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                  Build components with{" "}
                </span>
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                    AI.
                  </span>
                  <span
                    aria-hidden
                    className="absolute -inset-2 -z-10 rounded-full bg-[radial-gradient(ellipse,rgba(99,102,241,0.25)_0%,transparent_70%)] blur-md"
                  />
                </span>
              </h2>

              <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">
                Describe what you need, or drop a screenshot. The playground
                writes clean React and Next.js code using the Chumlab
                components you already ship with.
              </p>

              <ul className="space-y-4 mb-9">
                <FeatureRow
                  title="From a prompt"
                  detail="A sentence becomes a working component."
                />
                <FeatureRow
                  title="From a screenshot"
                  detail="Drop an image. Get matching markup."
                />
                <FeatureRow
                  title="Uses your stack"
                  detail="Built on the Chumlab components you already have."
                />
                <FeatureRow
                  title="Production ready"
                  detail="Typed props, ARIA, dark mode out of the box."
                />
              </ul>

              <div className="relative self-start group">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-3 rounded-2xl bg-gradient-to-r from-blue-600/50 via-indigo-500/50 to-violet-600/50 opacity-60 blur-2xl group-hover:opacity-90 group-hover:-inset-4 transition-all duration-500"
                />
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="cursor-pointer relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-[15px] font-semibold text-white overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shadow-[0_10px_30px_-6px_rgba(79,70,229,0.55),0_4px_12px_-2px_rgba(124,58,237,0.45)] hover:shadow-[0_18px_40px_-6px_rgba(79,70,229,0.7),0_6px_18px_-2px_rgba(124,58,237,0.6)]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600" />
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-60" />
                  <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  <SparkleGlyph />
                  <span className="relative">Try the AI Playground</span>
                  <svg
                    className="relative group-hover:translate-x-1 transition-transform duration-300"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <ConversationDemo />
            </div>
          </div>
        </div>
      </section>

      <PlaygroundOnboarding open={open} onOpenChange={setOpen} />
    </>
  );
}

function FeatureRow({ title, detail }: { title: string; detail: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-0.5 w-5 h-5 rounded-md bg-gradient-to-br from-blue-500/25 to-indigo-500/25 border border-blue-400/20 flex items-center justify-center shrink-0">
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-300"
          aria-hidden
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <div>
        <div className="text-[14px] font-medium text-white/90">{title}</div>
        <div className="text-[13.5px] text-white/50 leading-snug">
          {detail}
        </div>
      </div>
    </li>
  );
}

function SparkleGlyph() {
  return (
    <svg
      className="relative drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 3l1.6 4.4 4.4 1.6-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3zM18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
    </svg>
  );
}
