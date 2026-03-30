/** Inline SVG illustrations for blog diagrams and cover icons */

export function CoverIcon({
  type,
  size = 64,
}: {
  type: "code" | "layers" | "rocket" | "puzzle" | "cpu" | "globe";
  size?: number;
}) {
  switch (type) {
    case "code":
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
          {/* Terminal window */}
          <rect x="10" y="15" width="100" height="90" rx="12" fill="white" fillOpacity={0.06} stroke="white" strokeOpacity={0.15} strokeWidth="1.5" />
          {/* Title bar */}
          <rect x="10" y="15" width="100" height="28" rx="12" fill="white" fillOpacity={0.04} />
          <rect x="10" y="31" width="100" height="12" fill="white" fillOpacity={0.04} />
          {/* Traffic lights */}
          <circle cx="26" cy="29" r="4" fill="#ef4444" />
          <circle cx="38" cy="29" r="4" fill="#eab308" />
          <circle cx="50" cy="29" r="4" fill="#22c55e" />
          {/* Code lines - angle brackets */}
          <path d="M35 62L22 75l13 13" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M85 62l13 13-13 13" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Forward slash */}
          <line x1="52" y1="56" x2="68" y2="94" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
          {/* Cursor blink */}
          <rect x="72" y="64" width="2" height="14" rx="1" fill="#60a5fa" opacity="0.7" />
        </svg>
      );
    case "layers":
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
          <path d="M60 15L15 40l45 25 45-25L60 15z" fill="#3b82f6" fillOpacity={0.15} stroke="#60a5fa" strokeWidth="2" />
          <path d="M15 55l45 25 45-25" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
          <path d="M15 75l45 25 45-25" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
          <circle cx="60" cy="40" r="6" fill="#60a5fa" fillOpacity={0.4} />
        </svg>
      );
    case "rocket":
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
          <path d="M60 10c-16 16-24 38-24 56h48c0-18-8-40-24-56z" fill="white" fillOpacity={0.08} stroke="white" strokeOpacity={0.2} strokeWidth="2" />
          <path d="M42 66c-8 4-16 14-16 22h16V66z" fill="#3b82f6" fillOpacity={0.2} stroke="#60a5fa" strokeWidth="1" />
          <path d="M78 66c8 4 16 14 16 22H78V66z" fill="#3b82f6" fillOpacity={0.2} stroke="#60a5fa" strokeWidth="1" />
          <circle cx="60" cy="48" r="8" fill="#60a5fa" fillOpacity={0.3} stroke="#60a5fa" strokeWidth="1.5" />
          <path d="M52 88l8 22 8-22" fill="#f97316" fillOpacity={0.4} stroke="#f97316" strokeOpacity={0.6} strokeWidth="1" />
        </svg>
      );
    case "puzzle":
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
          <rect x="12" y="12" width="42" height="42" rx="8" fill="#3b82f6" fillOpacity={0.12} stroke="#60a5fa" strokeWidth="1.5" />
          <rect x="66" y="12" width="42" height="42" rx="8" fill="#a78bfa" fillOpacity={0.12} stroke="#a78bfa" strokeWidth="1.5" />
          <rect x="12" y="66" width="42" height="42" rx="8" fill="#34d399" fillOpacity={0.12} stroke="#34d399" strokeWidth="1.5" />
          <rect x="66" y="66" width="42" height="42" rx="8" fill="#f97316" fillOpacity={0.12} stroke="#f97316" strokeWidth="1.5" />
          {/* Connector bumps */}
          <circle cx="54" cy="33" r="8" fill="#3b82f6" fillOpacity={0.2} stroke="#60a5fa" strokeWidth="1" />
          <circle cx="66" cy="87" r="8" fill="#a78bfa" fillOpacity={0.2} stroke="#a78bfa" strokeWidth="1" />
        </svg>
      );
    case "cpu":
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
          <rect x="28" y="28" width="64" height="64" rx="10" fill="white" fillOpacity={0.06} stroke="white" strokeOpacity={0.2} strokeWidth="2" />
          <rect x="42" y="42" width="36" height="36" rx="6" fill="#3b82f6" fillOpacity={0.15} stroke="#60a5fa" strokeWidth="1.5" />
          {/* Pins */}
          {[40, 52, 64, 76].map((x) => (
            <g key={`cpu-v-${x}`}>
              <line x1={x} y1="10" x2={x} y2="28" stroke="white" strokeOpacity={0.15} strokeWidth="2" strokeLinecap="round" />
              <line x1={x} y1="92" x2={x} y2="110" stroke="white" strokeOpacity={0.15} strokeWidth="2" strokeLinecap="round" />
            </g>
          ))}
          {[40, 52, 64, 76].map((y) => (
            <g key={`cpu-h-${y}`}>
              <line x1="10" y1={y} x2="28" y2={y} stroke="white" strokeOpacity={0.15} strokeWidth="2" strokeLinecap="round" />
              <line x1="92" y1={y} x2="110" y2={y} stroke="white" strokeOpacity={0.15} strokeWidth="2" strokeLinecap="round" />
            </g>
          ))}
          <circle cx="60" cy="60" r="6" fill="#60a5fa" fillOpacity={0.4} />
        </svg>
      );
    case "globe":
      return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="44" fill="white" fillOpacity={0.04} stroke="white" strokeOpacity={0.2} strokeWidth="2" />
          <ellipse cx="60" cy="60" rx="22" ry="44" fill="none" stroke="white" strokeOpacity={0.1} strokeWidth="1.5" />
          <ellipse cx="60" cy="60" rx="36" ry="44" fill="none" stroke="white" strokeOpacity={0.06} strokeWidth="1" />
          <line x1="16" y1="44" x2="104" y2="44" stroke="white" strokeOpacity={0.08} strokeWidth="1.5" />
          <line x1="16" y1="76" x2="104" y2="76" stroke="white" strokeOpacity={0.08} strokeWidth="1.5" />
          <circle cx="60" cy="60" r="6" fill="#3b82f6" fillOpacity={0.4} stroke="#60a5fa" strokeWidth="1" />
        </svg>
      );
  }
}

export function DiagramFrontendArchitecture() {
  const items = [
    {
      label: "HTML",
      sub: "Structure",
      color: "#e44d26",
      icon: (
        // HTML5 logo — Simple Icons path (24×24)
        <svg width="30" height="30" viewBox="0 0 24 24">
          <path
            fill="#e44d26"
            d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"
          />
        </svg>
      ),
    },
    {
      label: "CSS",
      sub: "Styling",
      color: "#264de4",
      icon: (
        // CSS3 logo — Simple Icons path (24×24)
        <svg width="30" height="30" viewBox="0 0 24 24">
          <path
            fill="#264de4"
            d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"
          />
        </svg>
      ),
    },
    {
      label: "JavaScript",
      sub: "Behavior",
      color: "#f0db4f",
      icon: (
        // JavaScript official yellow square logo
        <svg width="30" height="30" viewBox="0 0 630 630">
          <rect width="630" height="630" fill="#f7df1e" rx="40" />
          <path fill="#323330" d="M423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.37-38.1-25.37-17.34 0-28.33 11-28.33 25.37 0 17.76 11 24.95 36.4 35.95l14.8 6.34c50.3 21.57 78.7 43.56 78.7 93 0 53.3-41.87 82.5-98.1 82.5-54.98 0-90.5-26.2-107.88-60.54zm-209.13 5.13c9.3 16.5 17.76 30.45 37.93 30.45 19.3 0 31.5-7.58 31.5-37v-200.1h59.2V491.1c0 60.94-35.7 88.6-87.87 88.6-47.1 0-74.4-24.38-88.3-53.72z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 flex flex-col items-center gap-3 hover:bg-white/[0.06] transition-colors"
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: item.color + "18" }}
          >
            {item.icon}
          </div>
          <span className="font-semibold text-white text-base">{item.label}</span>
          <span className="text-sm text-gray-400">{item.sub}</span>
        </div>
      ))}
    </div>
  );
}

export function DiagramFrontendVsBackend() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.05] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9h6v6H9z" />
            </svg>
          </div>
          <span className="font-bold text-blue-300 text-lg">Frontend</span>
        </div>
        <div className="space-y-3">
          {["UI Components", "User Interactions", "Visual Feedback", "Responsive Layout", "Animations"].map((item) => (
            <div key={item} className="flex items-center gap-3 text-[15px] text-gray-300">
              <div className="w-2 h-2 rounded-full bg-blue-400/60" />
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.05] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="8" rx="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" />
              <circle cx="6" cy="6" r="1.5" fill="#a78bfa" />
              <circle cx="6" cy="18" r="1.5" fill="#a78bfa" />
            </svg>
          </div>
          <span className="font-bold text-purple-300 text-lg">Backend</span>
        </div>
        <div className="space-y-3">
          {["Server Logic", "Database Queries", "Authentication", "API Endpoints", "Data Processing"].map((item) => (
            <div key={item} className="flex items-center gap-3 text-[15px] text-gray-300">
              <div className="w-2 h-2 rounded-full bg-purple-400/60" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DiagramComponentBasedUI() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex items-center gap-2 mb-5 text-sm text-gray-400 font-medium">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        Component Tree
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.08] px-5 py-3 text-sm text-emerald-300 font-semibold">
          &lt;App /&gt;
        </div>
        <div className="pl-6 border-l border-white/[0.06] ml-4 flex flex-col gap-3">
          <div className="rounded-lg border border-blue-500/25 bg-blue-500/[0.08] px-5 py-3 text-sm text-blue-300 font-medium">
            &lt;Header /&gt;
          </div>
          <div className="rounded-lg border border-blue-500/25 bg-blue-500/[0.08] px-5 py-3 text-sm text-blue-300 font-medium">
            &lt;MainContent /&gt;
          </div>
          <div className="pl-6 border-l border-white/[0.06] ml-4 flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-lg border border-violet-500/25 bg-violet-500/[0.08] px-4 py-2.5 text-sm text-violet-300">
                  &lt;Card /&gt;
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.08] px-4 py-2.5 text-sm text-amber-300">
                &lt;Button /&gt;
              </div>
              <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.08] px-4 py-2.5 text-sm text-amber-300">
                &lt;Input /&gt;
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-blue-500/25 bg-blue-500/[0.08] px-5 py-3 text-sm text-blue-300 font-medium">
            &lt;Footer /&gt;
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiagramLearningPath() {
  const steps = [
    { label: "HTML & CSS", level: "Beginner", color: "#22c55e" },
    { label: "JavaScript", level: "Beginner", color: "#eab308" },
    { label: "Frameworks", level: "Intermediate", color: "#3b82f6" },
    { label: "Performance", level: "Advanced", color: "#a78bfa" },
    { label: "System Design", level: "Expert", color: "#ec4899" },
  ];

  return (
    <div className="flex flex-col gap-1">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-start gap-5">
          <div className="flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2"
              style={{
                borderColor: step.color + "50",
                backgroundColor: step.color + "18",
                color: step.color,
              }}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="w-0.5 h-8 bg-white/[0.08]" />
            )}
          </div>
          <div className="pt-2 pb-5">
            <span className="text-base text-white font-semibold">{step.label}</span>
            <span
              className="text-xs ml-3 px-2 py-0.5 rounded-full font-medium"
              style={{ color: step.color, backgroundColor: step.color + "15" }}
            >
              {step.level}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DiagramHtmlStructure() {
  const elements = [
    { tag: "<header>", color: "#3b82f6", w: "full" },
    { tag: "<h1>", color: "#60a5fa", w: "3/4" },
    { tag: "<p>", color: "#818cf8", w: "full" },
    { tag: "<img>", color: "#a78bfa", w: "1/2" },
    { tag: "<button>", color: "#c084fc", w: "1/4" },
    { tag: "<footer>", color: "#3b82f6", w: "full" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-4">Page Structure</div>
      <div className="flex flex-col gap-2.5">
        {elements.map((el) => (
          <div
            key={el.tag}
            className="rounded-lg px-4 py-2.5 text-sm font-mono font-medium border"
            style={{
              borderColor: el.color + "30",
              backgroundColor: el.color + "10",
              color: el.color,
              width: el.w === "full" ? "100%" : el.w === "3/4" ? "75%" : el.w === "1/2" ? "50%" : "35%",
            }}
          >
            {el.tag}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiagramBeforeAfterCss() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-4">Without CSS</div>
        <div className="space-y-2 font-serif">
          <div className="text-base text-gray-400 underline">Welcome</div>
          <div className="text-sm text-gray-500">A paragraph of text here.</div>
          <div className="text-sm text-gray-500 border border-gray-600 px-2 py-0.5 inline-block">Click Me</div>
        </div>
      </div>
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-6">
        <div className="text-xs text-blue-400 font-medium uppercase tracking-wider mb-4">With CSS</div>
        <div className="space-y-3">
          <div className="text-xl font-bold text-white">Welcome</div>
          <div className="text-sm text-gray-300 leading-relaxed">A paragraph of text here.</div>
          <div className="text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-lg inline-block">Click Me</div>
        </div>
      </div>
    </div>
  );
}

export function DiagramInteractionFlow() {
  const steps = [
    { label: "User clicks button", icon: "pointer", color: "#60a5fa" },
    { label: "JavaScript runs handler", icon: "code", color: "#eab308" },
    { label: "DOM updates", icon: "refresh", color: "#34d399" },
    { label: "User sees result", icon: "eye", color: "#a78bfa" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex-1 flex items-center gap-3">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border"
                style={{
                  borderColor: step.color + "40",
                  backgroundColor: step.color + "15",
                  color: step.color,
                }}
              >
                {i + 1}
              </div>
              <span className="text-xs text-gray-400 text-center leading-snug">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 hidden sm:block">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiagramCombinedFlow() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-3">
        {[
          { label: "HTML", sub: "Structure", color: "#e44d26" },
          { label: "CSS", sub: "Styling", color: "#264de4" },
          { label: "JavaScript", sub: "Behavior", color: "#f0db4f" },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div
              className="flex-1 rounded-lg border px-4 py-3 text-center"
              style={{
                borderColor: item.color + "35",
                backgroundColor: item.color + "12",
              }}
            >
              <div className="text-sm font-bold" style={{ color: item.color }}>{item.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{item.sub}</div>
            </div>
            {i < 2 && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 hidden sm:block">
                <path d="M12 5v14" />
                <path d="m5 12 7 7 7-7" />
              </svg>
            )}
          </div>
        ))}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 hidden sm:block mx-1">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
        <div className="flex-1 w-full sm:w-auto rounded-lg border border-emerald-500/30 bg-emerald-500/[0.08] px-4 py-3 text-center">
          <div className="text-sm font-bold text-emerald-400">Webpage</div>
          <div className="text-xs text-gray-500 mt-0.5">Final Result</div>
        </div>
      </div>
    </div>
  );
}

export function DiagramHtmlCssJsPath() {
  const steps = [
    { label: "Learn HTML deeply", level: "Week 1\u20132", color: "#e44d26" },
    { label: "Master CSS layouts", level: "Week 3\u20135", color: "#264de4" },
    { label: "JS fundamentals", level: "Week 6\u201310", color: "#f0db4f" },
    { label: "Build real projects", level: "Week 11\u201314", color: "#22c55e" },
    { label: "Frameworks", level: "Week 15+", color: "#3b82f6" },
  ];

  return (
    <div className="flex flex-col gap-1">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-start gap-5">
          <div className="flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2"
              style={{
                borderColor: step.color + "50",
                backgroundColor: step.color + "18",
                color: step.color,
              }}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-0.5 h-8 bg-white/[0.08]" />}
          </div>
          <div className="pt-2 pb-5">
            <span className="text-base text-white font-semibold">{step.label}</span>
            <span
              className="text-xs ml-3 px-2 py-0.5 rounded-full font-medium"
              style={{ color: step.color, backgroundColor: step.color + "15" }}
            >
              {step.level}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Blog 3: How the Web Works diagrams ─────────────────────────────────────

function FlowArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mx-1 hidden sm:block">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function DiagramWebFlowOverview() {
  const steps = [
    { label: "URL", color: "#8b5cf6" },
    { label: "DNS", color: "#6366f1" },
    { label: "Connect", color: "#3b82f6" },
    { label: "Request", color: "#06b6d4" },
    { label: "Server", color: "#14b8a6" },
    { label: "Response", color: "#22c55e" },
    { label: "Render", color: "#84cc16" },
    { label: "Page", color: "#eab308" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max diagram-stagger">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-1">
            <div
              className="px-3 py-2 rounded-lg border text-xs font-semibold text-center min-w-[60px] animate-pipeline-glow"
              style={{
                borderColor: step.color + "35",
                backgroundColor: step.color + "12",
                color: step.color,
                "--glow-color": step.color + "20",
                animationDelay: `${i * 0.3}s`,
              } as React.CSSProperties}
            >
              {step.label}
            </div>
            {i < steps.length - 1 && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 animate-arrow-draw" style={{ animationDelay: `${i * 0.08 + 0.15}s` }}>
                <path d="M5 12h14" strokeDasharray="30" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiagramUrlBreakdown() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="font-mono text-sm sm:text-base text-gray-400 mb-5 flex flex-wrap gap-0 diagram-stagger">
        <span className="text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">https://</span>
        <span className="text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">example.com</span>
        <span className="text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">/about</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 diagram-scale-stagger">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-3">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Protocol</div>
          <div className="text-sm text-gray-400">How data is transferred (securely)</div>
        </div>
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/[0.05] px-4 py-3">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Domain</div>
          <div className="text-sm text-gray-400">Human-readable server address</div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.05] px-4 py-3">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Path</div>
          <div className="text-sm text-gray-400">Which page you want</div>
        </div>
      </div>
    </div>
  );
}

export function DiagramDnsFlow() {
  const steps = [
    { label: "Browser", sub: "\"What is example.com?\"", color: "#8b5cf6" },
    { label: "DNS Server", sub: "Looks up records", color: "#6366f1" },
    { label: "IP Address", sub: "192.0.2.1", color: "#22c55e" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3 flex-1">
            <div
              className="flex-1 rounded-lg border px-4 py-4 text-center animate-pipeline-glow"
              style={{
                borderColor: step.color + "30",
                backgroundColor: step.color + "10",
                "--glow-color": step.color + "18",
                animationDelay: `${i * 0.8}s`,
              } as React.CSSProperties}
            >
              <div className="text-sm font-bold mb-1" style={{ color: step.color }}>{step.label}</div>
              <div className="text-xs text-gray-500">{step.sub}</div>
            </div>
            {i < steps.length - 1 && <FlowArrow />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiagramRenderingPipeline() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col gap-4">
        {/* Parse row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className="rounded-lg border border-blue-500/25 bg-blue-500/[0.06] px-4 py-3 text-center animate-pipeline-glow"
            style={{ "--glow-color": "rgba(59,130,246,0.15)", animationDelay: "0s" } as React.CSSProperties}
          >
            <div className="text-xs text-gray-500 mb-1">HTML</div>
            <div className="text-sm font-semibold text-blue-400">DOM</div>
          </div>
          <div
            className="rounded-lg border border-violet-500/25 bg-violet-500/[0.06] px-4 py-3 text-center animate-pipeline-glow"
            style={{ "--glow-color": "rgba(139,92,246,0.15)", animationDelay: "0.3s" } as React.CSSProperties}
          >
            <div className="text-xs text-gray-500 mb-1">CSS</div>
            <div className="text-sm font-semibold text-violet-400">CSSOM</div>
          </div>
        </div>
        {/* Arrow down */}
        <div className="flex justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="m5 12 7 7 7-7" />
          </svg>
        </div>
        {/* Merge */}
        <div
          className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-4 py-3 text-center animate-pipeline-glow"
          style={{ "--glow-color": "rgba(16,185,129,0.15)", animationDelay: "0.6s" } as React.CSSProperties}
        >
          <div className="text-sm font-semibold text-emerald-400">Render Tree</div>
          <div className="text-xs text-gray-500 mt-1">Visible elements + computed styles</div>
        </div>
        {/* Arrow down */}
        <div className="flex justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="m5 12 7 7 7-7" />
          </svg>
        </div>
        {/* Final row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className="rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-center animate-pipeline-glow"
            style={{ "--glow-color": "rgba(245,158,11,0.15)", animationDelay: "0.9s" } as React.CSSProperties}
          >
            <div className="text-sm font-semibold text-amber-400">Layout</div>
            <div className="text-xs text-gray-500 mt-1">Calculate positions and sizes</div>
          </div>
          <div
            className="rounded-lg border border-rose-500/25 bg-rose-500/[0.06] px-4 py-3 text-center animate-pipeline-glow"
            style={{ "--glow-color": "rgba(244,63,94,0.15)", animationDelay: "1.2s" } as React.CSSProperties}
          >
            <div className="text-sm font-semibold text-rose-400">Paint</div>
            <div className="text-xs text-gray-500 mt-1">Draw pixels on screen</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Blog 4: What is the DOM diagrams ────────────────────────────────────────

export function DiagramDomTree() {
  // Node positions (x center, y center) on a 480x340 canvas
  const nodes = [
    { id: "doc",  label: "document",   x: 240, y: 30,  color: "#6b7280", glow: "rgba(107,114,128,0.12)", delay: "0s" },
    { id: "html", label: "<html>",     x: 240, y: 90,  color: "#3b82f6", glow: "rgba(59,130,246,0.12)",  delay: "0.3s" },
    { id: "head", label: "<head>",     x: 120, y: 155, color: "#a78bfa", glow: "rgba(167,139,250,0.12)", delay: "0.6s" },
    { id: "body", label: "<body>",     x: 360, y: 155, color: "#06b6d4", glow: "rgba(6,182,212,0.12)",   delay: "0.6s" },
    { id: "title",label: "<title>",    x: 120, y: 220, color: "#c084fc", glow: "rgba(192,132,252,0.12)", delay: "0.9s" },
    { id: "h1",   label: "<h1>",       x: 280, y: 220, color: "#22c55e", glow: "rgba(34,197,94,0.12)",   delay: "0.9s" },
    { id: "p",    label: "<p>",        x: 440, y: 220, color: "#f59e0b", glow: "rgba(245,158,11,0.12)",  delay: "0.9s" },
    { id: "t1",   label: "\"My Page\"",x: 120, y: 285, color: "#9ca3af", glow: "none", delay: "1.2s", text: true },
    { id: "t2",   label: "\"Hello\"",  x: 280, y: 285, color: "#9ca3af", glow: "none", delay: "1.2s", text: true },
    { id: "t3",   label: "\"Welcome\"",x: 440, y: 285, color: "#9ca3af", glow: "none", delay: "1.2s", text: true },
  ] as const;

  // Edges: [from-index, to-index]
  const edges: [number, number][] = [
    [0, 1], // document → html
    [1, 2], // html → head
    [1, 3], // html → body
    [2, 4], // head → title
    [3, 5], // body → h1
    [3, 6], // body → p
    [4, 7], // title → text
    [5, 8], // h1 → text
    [6, 9], // p → text
  ];

  const nodeH = 32;

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-6 overflow-x-auto">
      <svg viewBox="0 0 480 310" className="w-full max-w-[520px] mx-auto" style={{ minWidth: 360 }}>
        {/* Edges */}
        {edges.map(([fi, ti]) => {
          const f = nodes[fi];
          const t = nodes[ti];
          return (
            <line
              key={`${f.id}-${t.id}`}
              x1={f.x} y1={f.y + nodeH / 2}
              x2={t.x} y2={t.y - nodeH / 2}
              stroke="white"
              strokeOpacity="0.08"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const isText = "text" in n && n.text;
          const w = isText ? 80 : n.label.length * 9 + 28;
          return (
            <g key={n.id}>
              <rect
                x={n.x - w / 2}
                y={n.y - nodeH / 2}
                width={w}
                height={nodeH}
                rx={8}
                fill={n.color + (isText ? "08" : "14")}
                stroke={n.color + (isText ? "15" : "35")}
                strokeWidth="1"
                className={n.glow !== "none" ? "animate-pipeline-glow" : ""}
                style={n.glow !== "none" ? { "--glow-color": n.glow, animationDelay: n.delay } as React.CSSProperties : undefined}
              />
              <text
                x={n.x}
                y={n.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={n.color}
                fontSize={isText ? "10" : "12"}
                fontFamily="ui-monospace, monospace"
                fontWeight={isText ? "400" : "600"}
                opacity={isText ? 0.6 : 1}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function DiagramDomRenderingPipeline() {
  const stages = [
    { label: "HTML", result: "DOM", color: "#3b82f6" },
    { label: "CSS", result: "CSSOM", color: "#8b5cf6" },
    { label: "Combine", result: "Render Tree", color: "#22c55e" },
    { label: "Calculate", result: "Layout", color: "#f59e0b" },
    { label: "Draw", result: "Paint", color: "#ef4444" },
    { label: "Run JS", result: "Interactive", color: "#06b6d4" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stage, i) => (
          <div
            key={stage.label}
            className="rounded-lg border px-3 py-4 text-center animate-pipeline-glow"
            style={{
              borderColor: stage.color + "30",
              backgroundColor: stage.color + "10",
              "--glow-color": stage.color + "15",
              animationDelay: `${i * 0.4}s`,
            } as React.CSSProperties}
          >
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">{stage.label}</div>
            <div className="text-sm font-bold" style={{ color: stage.color }}>{stage.result}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiagramDomUpdateCycle() {
  const steps = [
    { label: "JS updates DOM", color: "#eab308" },
    { label: "Reflow", sub: "Recalculate layout", color: "#f97316" },
    { label: "Repaint", sub: "Redraw pixels", color: "#ef4444" },
    { label: "Updated UI", color: "#22c55e" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3 flex-1">
            <div
              className="flex-1 rounded-lg border px-4 py-4 text-center animate-pipeline-glow"
              style={{
                borderColor: step.color + "30",
                backgroundColor: step.color + "10",
                "--glow-color": step.color + "18",
                animationDelay: `${i * 0.6}s`,
              } as React.CSSProperties}
            >
              <div className="text-sm font-bold mb-0.5" style={{ color: step.color }}>{step.label}</div>
              {step.sub && <div className="text-xs text-gray-500">{step.sub}</div>}
            </div>
            {i < steps.length - 1 && <FlowArrow />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Blog 5: Flexbox vs Grid diagrams ────────────────────────────────────────

export function DiagramFlexboxLayout() {
  const items = ["Logo", "Home", "About", "Contact", "Login"];
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">display: flex</div>
      {/* Container outline */}
      <div className="rounded-lg border border-dashed border-pink-500/30 bg-pink-500/[0.03] p-4">
        <div className="flex items-center justify-between gap-3">
          {items.map((item, i) => (
            <div
              key={item}
              className="px-4 py-2.5 rounded-lg border text-sm font-medium text-center animate-pipeline-glow"
              style={{
                borderColor: "#ec4899" + "30",
                backgroundColor: "#ec4899" + (i === 0 ? "18" : "0a"),
                color: i === 0 ? "#ec4899" : "#9ca3af",
                "--glow-color": "rgba(236,72,153,0.1)",
                animationDelay: `${i * 0.4}s`,
              } as React.CSSProperties}
            >
              {item}
            </div>
          ))}
        </div>
        {/* Axis arrow */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
          <svg width="100%" height="12" className="text-pink-500/30">
            <line x1="0" y1="6" x2="100%" y2="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
            <polygon points="100%,6 94%,2 94%,10" fill="currentColor" />
          </svg>
          <span className="text-[10px] text-pink-400/50 whitespace-nowrap">main axis (row)</span>
        </div>
      </div>
    </div>
  );
}

export function DiagramGridLayout() {
  const cells = Array.from({ length: 6 }, (_, i) => `Card ${i + 1}`);
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">display: grid</div>
      <div className="rounded-lg border border-dashed border-orange-500/30 bg-orange-500/[0.03] p-4">
        <div className="grid grid-cols-3 gap-3">
          {cells.map((cell, i) => (
            <div
              key={cell}
              className="px-3 py-6 rounded-lg border text-sm font-medium text-center animate-pipeline-glow"
              style={{
                borderColor: "#f97316" + "30",
                backgroundColor: "#f97316" + "0a",
                color: "#f97316",
                "--glow-color": "rgba(249,115,22,0.1)",
                animationDelay: `${i * 0.3}s`,
              } as React.CSSProperties}
            >
              {cell}
            </div>
          ))}
        </div>
        {/* Axis labels */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
          <span className="text-[10px] text-orange-400/50">3 columns \u00d7 2 rows</span>
          <span className="text-[10px] text-orange-400/50">gap: 16px</span>
        </div>
      </div>
    </div>
  );
}

export function DiagramFlexboxVsGridTable() {
  const rows = [
    { feature: "Dimension", flex: "One-dimensional", grid: "Two-dimensional" },
    { feature: "Direction", flex: "Row OR column", grid: "Row AND column" },
    { feature: "Best For", flex: "Components", grid: "Layouts" },
    { feature: "Control", flex: "Content-based", grid: "Layout-based" },
    { feature: "Complexity", flex: "Simple", grid: "More powerful" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Feature</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-pink-400 uppercase tracking-wider">Flexbox</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Grid</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.feature} className={i < rows.length - 1 ? "border-b border-white/[0.04]" : ""}>
              <td className="px-5 py-3 text-gray-400 font-medium">{row.feature}</td>
              <td className="px-5 py-3 text-gray-300">{row.flex}</td>
              <td className="px-5 py-3 text-gray-300">{row.grid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DiagramLayoutDecisionFlow() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col items-center gap-2">
        {/* Question */}
        <div className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white text-center">
          How many directions do you need?
        </div>
        {/* Branch lines */}
        <div className="flex items-start w-full max-w-md">
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-px h-6 bg-white/[0.1]" />
            <div className="text-xs text-gray-600 mb-1">One direction</div>
            <div
              className="rounded-xl border px-6 py-4 text-center w-full animate-pipeline-glow"
              style={{ borderColor: "#ec489930", backgroundColor: "#ec489910", "--glow-color": "rgba(236,72,153,0.12)" } as React.CSSProperties}
            >
              <div className="text-base font-bold text-pink-400 mb-1">Flexbox</div>
              <div className="text-xs text-gray-500">Row or column alignment</div>
            </div>
          </div>
          <div className="w-12" />
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-px h-6 bg-white/[0.1]" />
            <div className="text-xs text-gray-600 mb-1">Two directions</div>
            <div
              className="rounded-xl border px-6 py-4 text-center w-full animate-pipeline-glow"
              style={{ borderColor: "#f9731630", backgroundColor: "#f9731610", "--glow-color": "rgba(249,115,22,0.12)", animationDelay: "0.5s" } as React.CSSProperties}
            >
              <div className="text-base font-bold text-orange-400 mb-1">Grid</div>
              <div className="text-xs text-gray-500">Rows and columns layout</div>
            </div>
          </div>
        </div>
        {/* Both */}
        <div className="w-px h-4 bg-white/[0.06]" />
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-6 py-3 text-center">
          <div className="text-sm font-semibold text-emerald-400">Both? Use both together.</div>
          <div className="text-xs text-gray-500 mt-0.5">Grid for structure, Flexbox for alignment</div>
        </div>
      </div>
    </div>
  );
}

// ─── Blog 6: JavaScript vs TypeScript diagrams ──────────────────────────────

export function DiagramJsVsTsLayers() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col items-center gap-0 max-w-sm mx-auto">
        {/* TypeScript layer */}
        <div
          className="w-full rounded-t-xl border border-blue-500/30 bg-blue-500/[0.08] px-6 py-5 text-center animate-pipeline-glow"
          style={{ "--glow-color": "rgba(59,130,246,0.12)", animationDelay: "0.5s" } as React.CSSProperties}
        >
          <div className="text-base font-bold text-blue-400 mb-1">TypeScript</div>
          <div className="text-xs text-gray-500">Static types, interfaces, enums, generics</div>
        </div>
        {/* JS layer */}
        <div
          className="w-full rounded-b-xl border border-t-0 border-yellow-500/30 bg-yellow-500/[0.08] px-6 py-5 text-center animate-pipeline-glow"
          style={{ "--glow-color": "rgba(234,179,8,0.12)" } as React.CSSProperties}
        >
          <div className="text-base font-bold text-yellow-400 mb-1">JavaScript</div>
          <div className="text-xs text-gray-500">Variables, functions, DOM, events, async</div>
        </div>
        <div className="mt-3 text-xs text-gray-600 text-center">TypeScript compiles down to JavaScript. Everything JS can do, TS can do too.</div>
      </div>
    </div>
  );
}

export function DiagramJsVsTsTable() {
  const rows = [
    { aspect: "Type System", js: "Dynamic", ts: "Static" },
    { aspect: "Learning Curve", js: "Easy", ts: "Moderate" },
    { aspect: "Error Detection", js: "Runtime", ts: "Compile-time" },
    { aspect: "Scalability", js: "Medium", ts: "High" },
    { aspect: "Tooling", js: "Good", ts: "Excellent" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aspect</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-yellow-400 uppercase tracking-wider">JavaScript</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-blue-400 uppercase tracking-wider">TypeScript</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.aspect} className={i < rows.length - 1 ? "border-b border-white/[0.04]" : ""}>
              <td className="px-5 py-3 text-gray-400 font-medium">{row.aspect}</td>
              <td className="px-5 py-3 text-gray-300">{row.js}</td>
              <td className="px-5 py-3 text-gray-300">{row.ts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DiagramJsTsErrorTimeline() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* JS side */}
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/[0.04] p-5">
          <div className="text-sm font-bold text-yellow-400 mb-4">JavaScript</div>
          <div className="flex flex-col gap-2">
            {["Write code", "Ship to production", "User hits the bug", "You find out"].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0"
                  style={{
                    borderColor: i === 3 ? "#ef444440" : "#eab30830",
                    backgroundColor: i === 3 ? "#ef444415" : "#eab30808",
                    color: i === 3 ? "#ef4444" : "#eab308",
                  }}
                >
                  {i + 1}
                </div>
                <span className={`text-xs ${i === 3 ? "text-red-400 font-semibold" : "text-gray-500"}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
        {/* TS side */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-5">
          <div className="text-sm font-bold text-blue-400 mb-4">TypeScript</div>
          <div className="flex flex-col gap-2">
            {["Write code", "Editor shows error", "You fix it instantly", "Ship safely"].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0"
                  style={{
                    borderColor: i === 1 ? "#22c55e40" : "#3b82f630",
                    backgroundColor: i === 1 ? "#22c55e15" : "#3b82f608",
                    color: i === 1 ? "#22c55e" : "#3b82f6",
                  }}
                >
                  {i + 1}
                </div>
                <span className={`text-xs ${i === 1 ? "text-emerald-400 font-semibold" : "text-gray-500"}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiagramJsTsLearningPath() {
  const steps = [
    { label: "JavaScript fundamentals", level: "Start here", color: "#eab308" },
    { label: "Build real projects in JS", level: "Practice", color: "#f97316" },
    { label: "Learn TypeScript basics", level: "Level up", color: "#3b82f6" },
    { label: "Use TS in real apps", level: "Apply", color: "#8b5cf6" },
    { label: "Advanced types & patterns", level: "Master", color: "#ec4899" },
  ];

  return (
    <div className="flex flex-col gap-1">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-start gap-5">
          <div className="flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2"
              style={{
                borderColor: step.color + "50",
                backgroundColor: step.color + "18",
                color: step.color,
              }}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-0.5 h-8 bg-white/[0.08]" />}
          </div>
          <div className="pt-2 pb-5">
            <span className="text-base text-white font-semibold">{step.label}</span>
            <span
              className="text-xs ml-3 px-2 py-0.5 rounded-full font-medium"
              style={{ color: step.color, backgroundColor: step.color + "15" }}
            >
              {step.level}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Blog 7: Async JavaScript diagrams ───────────────────────────────────────

export function DiagramSyncVsAsync() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Sync */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
        <div className="text-sm font-bold text-gray-300 mb-4">Synchronous</div>
        <div className="flex flex-col gap-2">
          {["Task 1", "Task 2", "Task 3"].map((task, i) => (
            <div key={task} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border border-gray-600/30 bg-gray-600/10 text-gray-400">{i + 1}</div>
              <div className="flex-1 h-9 rounded-lg border border-gray-500/20 bg-gray-500/[0.06] flex items-center px-3 text-xs text-gray-400 font-medium">{task}</div>
            </div>
          ))}
          <div className="text-[10px] text-gray-600 mt-1 text-center">Each waits for the previous</div>
        </div>
      </div>
      {/* Async */}
      <div className="rounded-xl border border-orange-500/15 bg-orange-500/[0.03] p-5">
        <div className="text-sm font-bold text-orange-400 mb-4">Asynchronous</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border border-orange-500/30 bg-orange-500/10 text-orange-400">1</div>
            <div className="flex-1 h-9 rounded-lg border border-orange-500/20 bg-orange-500/[0.06] flex items-center px-3 text-xs text-orange-300 font-medium">Task 1</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border border-violet-500/30 bg-violet-500/10 text-violet-400">2</div>
            <div className="flex-1 h-9 rounded-lg border border-dashed border-violet-500/25 bg-violet-500/[0.04] flex items-center px-3 text-xs text-violet-400 font-medium gap-2">
              Task 2
              <span className="text-[9px] text-violet-500/60 bg-violet-500/10 px-1.5 py-0.5 rounded">async</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border border-orange-500/30 bg-orange-500/10 text-orange-400">3</div>
            <div className="flex-1 h-9 rounded-lg border border-orange-500/20 bg-orange-500/[0.06] flex items-center px-3 text-xs text-orange-300 font-medium">Task 3 (runs before Task 2 finishes)</div>
          </div>
          <div className="text-[10px] text-gray-600 mt-1 text-center">JS doesn't wait, it moves on</div>
        </div>
      </div>
    </div>
  );
}

export function DiagramEventLoop() {
  const boxes = [
    { label: "Call Stack", sub: "Runs code one at a time", color: "#3b82f6", pos: "left" },
    { label: "Web APIs", sub: "setTimeout, fetch, DOM events", color: "#f97316", pos: "right" },
    { label: "Callback Queue", sub: "Waiting to be executed", color: "#8b5cf6", pos: "right" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {boxes.map((box) => (
          <div
            key={box.label}
            className="rounded-lg border px-4 py-4 text-center animate-pipeline-glow"
            style={{
              borderColor: box.color + "30",
              backgroundColor: box.color + "0a",
              "--glow-color": box.color + "15",
            } as React.CSSProperties}
          >
            <div className="text-sm font-bold mb-1" style={{ color: box.color }}>{box.label}</div>
            <div className="text-[11px] text-gray-500">{box.sub}</div>
          </div>
        ))}
      </div>
      {/* Event loop indicator */}
      <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-3 text-center animate-pipeline-glow" style={{ "--glow-color": "rgba(16,185,129,0.15)", animationDelay: "0.5s" } as React.CSSProperties}>
        <div className="text-sm font-bold text-emerald-400 mb-0.5">Event Loop</div>
        <div className="text-[11px] text-gray-500">Checks: Is the call stack empty? Move next task from queue.</div>
      </div>
    </div>
  );
}

export function DiagramPromiseLifecycle() {
  const states = [
    { label: "Pending", sub: "Waiting for result", color: "#eab308" },
    { label: "Fulfilled", sub: ".then() runs", color: "#22c55e" },
    { label: "Rejected", sub: ".catch() runs", color: "#ef4444" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col items-center gap-2">
        {/* Pending */}
        <div
          className="rounded-xl border px-6 py-3.5 text-center w-full max-w-xs animate-pipeline-glow"
          style={{ borderColor: states[0].color + "30", backgroundColor: states[0].color + "0a", "--glow-color": states[0].color + "15" } as React.CSSProperties}
        >
          <div className="text-sm font-bold" style={{ color: states[0].color }}>{states[0].label}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">{states[0].sub}</div>
        </div>
        {/* Branch */}
        <div className="flex items-start w-full max-w-md">
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-px h-6 bg-white/[0.1]" />
            <div
              className="rounded-xl border px-5 py-3 text-center w-full animate-pipeline-glow"
              style={{ borderColor: states[1].color + "30", backgroundColor: states[1].color + "0a", "--glow-color": states[1].color + "15", animationDelay: "0.6s" } as React.CSSProperties}
            >
              <div className="text-sm font-bold" style={{ color: states[1].color }}>{states[1].label}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{states[1].sub}</div>
            </div>
          </div>
          <div className="w-8" />
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-px h-6 bg-white/[0.1]" />
            <div
              className="rounded-xl border px-5 py-3 text-center w-full animate-pipeline-glow"
              style={{ borderColor: states[2].color + "30", backgroundColor: states[2].color + "0a", "--glow-color": states[2].color + "15", animationDelay: "1.2s" } as React.CSSProperties}
            >
              <div className="text-sm font-bold" style={{ color: states[2].color }}>{states[2].label}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{states[2].sub}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiagramAsyncAwaitFlow() {
  const steps = [
    { label: "async function called", color: "#f97316" },
    { label: "await pauses here", color: "#eab308" },
    { label: "Promise resolves", color: "#22c55e" },
    { label: "Execution resumes", color: "#3b82f6" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3 flex-1">
            <div
              className="flex-1 rounded-lg border px-3 py-4 text-center animate-pipeline-glow"
              style={{
                borderColor: step.color + "30",
                backgroundColor: step.color + "0a",
                "--glow-color": step.color + "15",
                animationDelay: `${i * 0.6}s`,
              } as React.CSSProperties}
            >
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Step {i + 1}</div>
              <div className="text-xs font-bold" style={{ color: step.color }}>{step.label}</div>
            </div>
            {i < steps.length - 1 && <FlowArrow />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiagramFullAsyncFlow() {
  const steps = [
    { label: "Call Stack", sub: "Runs synchronous code", color: "#3b82f6" },
    { label: "Web APIs", sub: "fetch, timers, DOM", color: "#f97316" },
    { label: "Callback queue", sub: "Tasks wait their turn", color: "#8b5cf6" },
    { label: "Event loop", sub: "Pushes work when stack is clear", color: "#10b981" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-1 min-w-0 sm:min-w-max">
        {steps.flatMap((step, i) => {
          const box = (
            <div
              key={step.label}
              className="w-full sm:w-[140px] rounded-lg border px-3 py-3.5 text-center animate-pipeline-glow"
              style={{
                borderColor: step.color + "35",
                backgroundColor: step.color + "0c",
                "--glow-color": step.color + "18",
                animationDelay: `${i * 0.35}s`,
              } as React.CSSProperties}
            >
              <div className="text-xs font-bold" style={{ color: step.color }}>
                {step.label}
              </div>
              <div className="text-[10px] text-gray-500 mt-1 leading-snug">{step.sub}</div>
            </div>
          );
          if (i < steps.length - 1) {
            return [
              box,
              <div key={`arrow-${i}`} className="flex justify-center py-0.5 sm:py-0 sm:px-0.5 shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeOpacity="0.15"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="rotate-90 sm:rotate-0"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>,
            ];
          }
          return [box];
        })}
      </div>
      <p className="mt-4 text-center text-[11px] text-gray-500 leading-relaxed max-w-xl mx-auto">
        Work flows out to Web APIs, then through the queue; the event loop moves callbacks back onto the call stack when it is empty. One thread, many scheduled tasks.
      </p>
    </div>
  );
}

// ─── APIs: REST vs GraphQL diagrams ─────────────────────────────────────────

export function DiagramApiCommunication() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/[0.08] px-6 py-4 text-center w-full sm:max-w-[200px]">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">Frontend</div>
            <div className="text-sm text-gray-200 font-medium">Client app</div>
            <div className="text-[11px] text-gray-500 mt-1">Browser / mobile WebView</div>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] font-medium text-cyan-400/90">Request</span>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeOpacity="0.5" strokeWidth="2" className="rotate-90 sm:rotate-0">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            <span className="text-[10px] font-medium text-violet-400/90">Response</span>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeOpacity="0.5" strokeWidth="2" className="-rotate-90 sm:rotate-180">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
          <div className="rounded-xl border border-violet-500/30 bg-violet-500/[0.08] px-6 py-4 text-center w-full sm:max-w-[200px]">
            <div className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-1">API server</div>
            <div className="text-sm text-gray-200 font-medium">Backend</div>
            <div className="text-[11px] text-gray-500 mt-1">Validates, reads DB, returns JSON</div>
          </div>
        </div>
        <p className="text-center text-[11px] text-gray-500">The frontend does not read your database directly — it asks the API, which returns structured data (usually JSON).</p>
      </div>
    </div>
  );
}

export function DiagramFullApiRequestFlow() {
  const steps = [
    { n: "1", label: "User action", sub: "Click, navigation, submit", color: "#3b82f6" },
    { n: "2", label: "Frontend sends request", sub: "fetch / axios", color: "#06b6d4" },
    { n: "3", label: "API receives & processes", sub: "Auth, business logic, DB", color: "#8b5cf6" },
    { n: "4", label: "Response (often JSON)", sub: "Status + body", color: "#eab308" },
    { n: "5", label: "UI updates", sub: "Render state, lists, errors", color: "#22c55e" },
  ];
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col gap-0 max-w-lg mx-auto">
        {steps.map((step, i) => (
          <div key={step.label} className="flex gap-4">
            <div className="flex flex-col items-center w-10 shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2"
                style={{ borderColor: step.color + "55", backgroundColor: step.color + "18", color: step.color }}
              >
                {step.n}
              </div>
              {i < steps.length - 1 && <div className="w-0.5 flex-1 min-h-6 bg-white/[0.08]" />}
            </div>
            <div className="pb-6 pt-1.5">
              <div className="text-sm font-semibold text-white">{step.label}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{step.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiagramRestApiStructure() {
  const endpoints = [
    { method: "GET", path: "/api/users", color: "#3b82f6" },
    { method: "GET", path: "/api/users/1", color: "#6366f1" },
    { method: "GET", path: "/api/posts", color: "#8b5cf6" },
  ];
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        <div className="flex-1 space-y-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Frontend requests</div>
          {endpoints.map((ep) => (
            <div
              key={ep.path}
              className="rounded-lg border px-3 py-2 flex items-center gap-2 text-xs font-mono"
              style={{ borderColor: ep.color + "35", backgroundColor: ep.color + "0a" }}
            >
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: ep.color, backgroundColor: ep.color + "20" }}>
                {ep.method}
              </span>
              <span className="text-gray-300">{ep.path}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.15" className="rotate-90 sm:rotate-0">
            <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" />
            <path d="m12 5 7 7-7 7" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex-1 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 flex flex-col justify-center text-center">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">REST API</div>
          <div className="text-sm text-gray-200 font-medium">One resource per URL</div>
          <div className="text-[11px] text-gray-500 mt-2 leading-relaxed">Each endpoint returns a fixed shape. Combine data by calling multiple routes.</div>
        </div>
      </div>
    </div>
  );
}

export function DiagramGraphqlFlow() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="flex-1 rounded-lg border border-pink-500/25 bg-pink-500/[0.06] p-4">
          <div className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-2">Single endpoint</div>
          <div className="text-xs font-mono text-gray-300 mb-3">POST /graphql</div>
          <pre className="text-[10px] sm:text-[11px] text-gray-400 font-mono leading-relaxed whitespace-pre-wrap">{`{
  user(id: 1) {
    name
    email
  }
}`}</pre>
        </div>
        <div className="flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.2" className="rotate-90 sm:rotate-0">
            <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" />
            <path d="m12 5 7 7-7 7" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex-1 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] p-4 flex flex-col justify-center">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">Response</div>
          <pre className="text-[10px] sm:text-[11px] text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">{`{
  "data": {
    "user": {
      "name": "…",
      "email": "…"
    }
  }
}`}</pre>
          <p className="text-[10px] text-gray-500 mt-3">Only the fields you asked for — no fixed “user object” blob unless you request it.</p>
        </div>
      </div>
    </div>
  );
}

export function DiagramRestVsGraphql() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-5">
        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">REST</div>
        <div className="space-y-2 mb-3">
          {["GET /user/1", "GET /user/1/posts"].map((line) => (
            <div key={line} className="rounded-md border border-blue-500/20 bg-blue-500/[0.06] px-3 py-2 text-[11px] font-mono text-gray-300">
              {line}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed">Multiple round-trips to assemble a screen. Each response shape is whatever the server defined for that route.</p>
      </div>
      <div className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/[0.04] p-5">
        <div className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-3">GraphQL</div>
        <pre className="text-[10px] text-gray-300 font-mono leading-relaxed whitespace-pre-wrap mb-3">{`{
  user(id: 1) {
    name
    posts { title }
  }
}`}</pre>
        <p className="text-[11px] text-gray-500 leading-relaxed">One request describes the graph you need. Server resolves nested fields in one go.</p>
      </div>
    </div>
  );
}

export function DiagramApiDecisionFlow() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col items-center gap-3 max-w-md mx-auto text-center">
        <div className="rounded-lg border border-gray-500/25 bg-white/[0.04] px-5 py-3 w-full">
          <div className="text-xs text-gray-400">What are you building?</div>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/[0.08] px-4 py-3">
            <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Simple / stable</div>
            <div className="text-sm text-gray-200">Fixed resources, few clients</div>
            <div className="text-xs text-blue-300/80 mt-2 font-semibold">→ REST is often enough</div>
          </div>
          <div className="rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/[0.08] px-4 py-3">
            <div className="text-[10px] font-bold text-fuchsia-400 uppercase mb-1">Complex / varied</div>
            <div className="text-sm text-gray-200">Many screens, evolving fields</div>
            <div className="text-xs text-fuchsia-300/80 mt-2 font-semibold">→ Consider GraphQL</div>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 pt-2">Teams often use REST for public CRUD APIs and GraphQL for product apps — or mix both behind a gateway.</p>
      </div>
    </div>
  );
}

// ─── Client storage: LocalStorage, SessionStorage, Cookies ────────────────

export function DiagramLocalStorageLifecycle() {
  const events = [
    { label: "setItem('theme', 'dark')", ok: true, sub: "Written to disk (origin)" },
    { label: "Page refresh", ok: true, sub: "Still there" },
    { label: "Close tab / new tab", ok: true, sub: "Same origin can read" },
    { label: "Quit browser", ok: true, sub: "Persists until cleared" },
  ];
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col gap-3">
        {events.map((ev, i) => (
          <div key={ev.label} className="flex items-start gap-3">
            <div className="flex flex-col items-center w-8 shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold">
                ✓
              </div>
              {i < events.length - 1 && <div className="w-0.5 flex-1 min-h-4 bg-emerald-500/20" />}
            </div>
            <div className="pb-2 pt-0.5">
              <div className="text-sm font-medium text-gray-200">{ev.label}</div>
              <div className="text-[11px] text-gray-500">{ev.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-gray-500 text-center leading-relaxed">
        localStorage is keyed by origin (scheme + host + port). Clearing site data or private browsing rules can still remove it.
      </p>
    </div>
  );
}

export function DiagramSessionStorageLifecycle() {
  const events = [
    { label: "Tab opens — setItem('step', '1')", state: "alive", sub: "Scoped to this tab's session" },
    { label: "Same-tab navigations / SPA route changes", state: "alive", sub: "Value remains" },
    { label: "Duplicate tab (some browsers copy storage)", state: "copy", sub: "Behavior varies — new tab ≠ same session by default" },
    { label: "Tab closed", state: "gone", sub: "SessionStorage wiped for that tab" },
  ];
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col gap-3">
        {events.map((ev, i) => (
          <div key={ev.label} className="flex items-start gap-3">
            <div className="flex flex-col items-center w-8 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                  ev.state === "gone"
                    ? "bg-rose-500/15 border-rose-500/40 text-rose-400"
                    : ev.state === "copy"
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                      : "bg-sky-500/15 border-sky-500/40 text-sky-400"
                }`}
              >
                {ev.state === "gone" ? "✕" : ev.state === "copy" ? "~" : "●"}
              </div>
              {i < events.length - 1 && <div className="w-0.5 flex-1 min-h-4 bg-white/[0.06]" />}
            </div>
            <div className="pb-2 pt-0.5">
              <div className="text-sm font-medium text-gray-200">{ev.label}</div>
              <div className="text-[11px] text-gray-500">{ev.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-gray-500 text-center leading-relaxed">
        Rule of thumb: if it should die when the tab dies, sessionStorage is a good fit.
      </p>
    </div>
  );
}

export function DiagramCookieFlow() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col gap-5">
        <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-center">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Browser stores cookies</div>
          <div className="text-[11px] text-gray-400 font-mono">Set-Cookie: session=abc; Path=/; HttpOnly; Secure</div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-[10px] text-gray-500">
          <span className="text-amber-200/80">Every matching request</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-500/50 rotate-90 sm:rotate-0 shrink-0">
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="m12 5 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-violet-200/80">Browser attaches Cookie header</span>
        </div>
        <div className="rounded-lg border border-violet-500/25 bg-violet-500/[0.06] px-4 py-3">
          <div className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-2 text-center">HTTP request</div>
          <div className="text-[11px] text-gray-400 font-mono">GET /dashboard HTTP/1.1{"\n"}Cookie: session=abc</div>
        </div>
        <div className="flex justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/20 shrink-0">
            <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="m5 12 7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-4 py-3 text-center">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Server</div>
          <div className="text-[11px] text-gray-400">Reads cookie → session / auth / personalization</div>
        </div>
      </div>
    </div>
  );
}

export function DiagramStorageUseCaseComparison() {
  const cols = [
    {
      title: "localStorage",
      color: "#34d399",
      tag: "Long-lived client",
      bullets: ["Theme, language", "Draft UX prefs", "Non-secret flags"],
    },
    {
      title: "sessionStorage",
      color: "#38bdf8",
      tag: "One tab",
      bullets: ["Wizard steps", "Ephemeral UI state", "Tab-scoped drafts"],
    },
    {
      title: "Cookies",
      color: "#fbbf24",
      tag: "Server-visible",
      bullets: ["Sessions (HttpOnly)", "CSRF tokens*", "Attribution / consent*"],
    },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cols.map((c) => (
          <div
            key={c.title}
            className="rounded-xl border px-4 py-4"
            style={{ borderColor: c.color + "35", backgroundColor: c.color + "0a" }}
          >
            <div className="text-sm font-bold mb-0.5" style={{ color: c.color }}>
              {c.title}
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">{c.tag}</div>
            <ul className="space-y-2">
              {c.bullets.map((b) => (
                <li key={b} className="text-[12px] text-gray-300 flex gap-2">
                  <span style={{ color: c.color }}>•</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-500 text-center leading-relaxed">
        *Use cookies deliberately: size limits, SameSite policy, and privacy regulations still apply.
      </p>
    </div>
  );
}

export function DiagramStorageDecisionFlow() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col items-center gap-2 max-w-lg mx-auto text-center">
        <div className="rounded-lg border border-gray-500/25 bg-white/[0.04] px-5 py-3 w-full text-sm text-gray-200">What are you storing?</div>
        <div className="w-px h-3 bg-white/10" />
        <div className="grid grid-cols-1 gap-2 w-full">
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.07] px-4 py-2.5 text-left">
            <span className="text-emerald-400 font-semibold text-xs">Persistent across visits</span>
            <span className="text-gray-400 text-xs block mt-0.5">
              → prefer localStorage (strings only; still XSS-sensitive)
            </span>
          </div>
          <div className="rounded-lg border border-sky-500/25 bg-sky-500/[0.07] px-4 py-2.5 text-left">
            <span className="text-sky-400 font-semibold text-xs">Only while this tab is open</span>
            <span className="text-gray-400 text-xs block mt-0.5">→ prefer sessionStorage</span>
          </div>
          <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.07] px-4 py-2.5 text-left">
            <span className="text-amber-400 font-semibold text-xs">Server must read it on requests</span>
            <span className="text-gray-400 text-xs block mt-0.5">
              → cookies (consider HttpOnly, Secure, SameSite)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── React.js diagrams ──────────────────────────────────────────────────────

export function DiagramReactComponentTree() {
  const chip = (label: string, color: string) => (
    <span
      className="inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold"
      style={{ borderColor: color + "40", backgroundColor: color + "14", color }}
    >
      {label}
    </span>
  );
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <p className="text-[11px] text-gray-500 mb-4">Small pieces compose into screens; data flows down via props.</p>
      <div className="space-y-3 text-[11px]">
        <div>{chip("App", "#22d3ee")}</div>
        <div className="flex flex-wrap gap-3 pl-4 border-l-2 border-cyan-500/20">
          {chip("Header", "#38bdf8")}
          {chip("Sidebar", "#38bdf8")}
          <div className="flex flex-col gap-2">
            {chip("Main", "#38bdf8")}
            <div className="pl-3 border-l-2 border-sky-500/20 flex flex-wrap gap-2">
              {chip("Card", "#67e8f9")}
              {chip("Button", "#a5f3fc")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiagramReactStateFlow() {
  const steps = [
    { label: "User event", color: "#f97316" },
    { label: "setState", color: "#eab308" },
    { label: "Schedule render", color: "#a855f7" },
    { label: "Reconcile", color: "#6366f1" },
    { label: "Update DOM", color: "#22c55e" },
  ];
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-1">
        {steps.flatMap((step, i) => {
          const box = (
            <div
              key={step.label}
              className="rounded-lg border px-3 py-2.5 text-center text-[11px] font-medium flex-1 min-w-[100px]"
              style={{ borderColor: step.color + "35", backgroundColor: step.color + "10", color: step.color }}
            >
              {step.label}
            </div>
          );
          if (i < steps.length - 1) {
            return [
              box,
              <div key={`arrow-${i}`} className="flex justify-center sm:px-0.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeOpacity="0.2"
                  className="rotate-90 sm:rotate-0"
                >
                  <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" />
                  <path d="m12 5 7 7-7 7" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>,
            ];
          }
          return [box];
        })}
      </div>
      <p className="mt-4 text-[11px] text-gray-500 text-center leading-relaxed">
        Changing state is how you tell React the UI snapshot is stale; React figures out the diff.
      </p>
    </div>
  );
}

export function DiagramReactHookLifecycle() {
  const phases = [
    { title: "Mount", sub: "Setup runs after commit", color: "#22c55e" },
    { title: "Update", sub: "Re-runs when deps change", color: "#eab308" },
    { title: "Unmount", sub: "Cleanup runs on teardown", color: "#ef4444" },
  ];
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {phases.map((p) => (
          <div
            key={p.title}
            className="rounded-lg border px-4 py-3 text-center"
            style={{ borderColor: p.color + "30", backgroundColor: p.color + "0c" }}
          >
            <div className="text-xs font-bold mb-1" style={{ color: p.color }}>
              {p.title}
            </div>
            <div className="text-[10px] text-gray-500 leading-snug">{p.sub}</div>
          </div>
        ))}
      </div>
      <pre className="mt-4 text-[10px] text-gray-400 font-mono rounded-lg border border-white/[0.06] bg-[#0d0d1a] p-3 overflow-x-auto whitespace-pre">{`useEffect(() => {
  return () => { /* cleanup */ };
}, [depA, depB]);`}</pre>
    </div>
  );
}

export function DiagramReactVirtualDom() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/[0.06] p-4">
        <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Virtual tree</div>
        <div className="space-y-2 text-[11px] text-gray-300 font-mono">
          <div>{"<App>"}</div>
          <div className="pl-2">{"<List />"}</div>
          <div className="pl-4">{"<Item key={id} />"}</div>
        </div>
        <p className="text-[10px] text-gray-500 mt-3 leading-relaxed">Plain JS descriptions of UI — cheap to create and compare.</p>
      </div>
      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4">
        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Real DOM</div>
        <div className="rounded border border-white/10 bg-black/20 p-3 text-[11px] text-gray-400 font-mono">
          browser nodes · layout · paint
        </div>
        <p className="text-[10px] text-gray-500 mt-3 leading-relaxed">
          React commits a small set of mutations instead of you calling imperative DOM APIs everywhere.
        </p>
      </div>
    </div>
  );
}

export function DiagramUseStateFlow() {
  const steps = [
    { label: "State value", sub: "e.g. count in memory", color: "#22d3ee" },
    { label: "Render", sub: "UI shows count", color: "#38bdf8" },
    { label: "User action", sub: "click, input…", color: "#f97316" },
    { label: "setState", sub: "schedule update", color: "#eab308" },
    { label: "Re-render", sub: "new UI snapshot", color: "#a855f7" },
  ];
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-1">
        {steps.flatMap((step, i) => {
          const box = (
            <div
              key={step.label}
              className="rounded-lg border px-3 py-2.5 flex-1 min-w-[108px] text-center"
              style={{ borderColor: step.color + "35", backgroundColor: step.color + "10" }}
            >
              <div className="text-[11px] font-semibold" style={{ color: step.color }}>
                {step.label}
              </div>
              <div className="text-[9px] text-gray-500 mt-0.5 leading-snug">{step.sub}</div>
            </div>
          );
          if (i < steps.length - 1) {
            return [
              box,
              <div key={`u-${i}`} className="flex justify-center shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeOpacity="0.2"
                  className="rotate-90 sm:rotate-0"
                >
                  <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" />
                  <path d="m12 5 7 7-7 7" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>,
            ];
          }
          return [box];
        })}
      </div>
      <p className="mt-4 text-[11px] text-gray-500 text-center leading-relaxed">
        The setter tells React state changed; React re-renders so the UI stays a function of that state.
      </p>
    </div>
  );
}

export function DiagramUseEffectFlow() {
  const row = (n: string, title: string, sub: string, color: string) => (
    <div className="flex gap-3 items-start">
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
        style={{ backgroundColor: color + "22", color }}
      >
        {n}
      </span>
      <div>
        <div className="text-sm font-medium text-gray-200">{title}</div>
        <div className="text-[11px] text-gray-500">{sub}</div>
      </div>
    </div>
  );
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-4">
      {row("1", "Render committed", "Paint hits the screen", "#6366f1")}
      {row("2", "useEffect runs", "After commit; async to the paint you just saw", "#22c55e")}
      {row("3", "Dependency change", "React runs cleanup (if any), then the new effect body", "#eab308")}
      {row("4", "Unmount", "Final cleanup runs so you do not leak listeners/timers", "#ef4444")}
      <p className="text-[10px] text-gray-500 pt-1 leading-relaxed">
        Empty deps `[]` means “run once after mount.” Omitting the array means “run after every commit” — usually a bug unless you mean it.
      </p>
    </div>
  );
}

export function DiagramUseMemoOptimization() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-rose-500/25 bg-rose-500/[0.05] p-4">
        <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Without useMemo</div>
        <p className="text-[11px] text-gray-400 mb-3">Parent re-renders → expensive function runs again even when inputs did not change.</p>
        <div className="flex flex-wrap gap-1">
          {["R1", "R2", "R3", "R4", "R5"].map((x) => (
            <span key={x} className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
              calc
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4">
        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">With useMemo</div>
        <p className="text-[11px] text-gray-400 mb-3">Dependency array unchanged → reuse cached result; skip redundant work.</p>
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">calc</span>
          <span className="text-[10px] text-gray-500">when `data` changes only</span>
        </div>
      </div>
    </div>
  );
}

export function DiagramHooksCombinedFlow() {
  const blocks = [
    { title: "useState", sub: "Holds users list", color: "#22d3ee" },
    { title: "useEffect", sub: "Fetch on mount → setUsers", color: "#a855f7" },
    { title: "useMemo", sub: "Derive total from users", color: "#34d399" },
  ];
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 sm:gap-2">
        {blocks.flatMap((b, i) => {
          const card = (
            <div
              key={b.title}
              className="flex-1 rounded-lg border px-3 py-3 text-center"
              style={{ borderColor: b.color + "35", backgroundColor: b.color + "10" }}
            >
              <div className="text-xs font-bold" style={{ color: b.color }}>
                {b.title}
              </div>
              <div className="text-[10px] text-gray-500 mt-1 leading-snug">{b.sub}</div>
            </div>
          );
          if (i < blocks.length - 1) {
            return [
              card,
              <div key={`c-${i}`} className="flex items-center justify-center py-1 sm:py-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeOpacity="0.15"
                  className="rotate-90 sm:rotate-0 shrink-0"
                >
                  <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" />
                  <path d="m12 5 7 7-7 7" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>,
            ];
          }
          return [card];
        })}
      </div>
      <p className="mt-4 text-[11px] text-gray-500 text-center">
        State holds truth; effects sync with the world; memoization avoids redoing heavy derives on unrelated renders.
      </p>
    </div>
  );
}

export function DiagramEs6Transformation() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-5">
        <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">Before (pre-ES6)</div>
        <pre className="text-[11px] sm:text-xs text-gray-400 font-mono leading-relaxed whitespace-pre-wrap break-all">
          {`var count = 0;
function greet(name) {
  return "Hello " + name;
}
var msg = "Hi " + user.name;`}
        </pre>
        <p className="mt-3 text-[10px] text-gray-500 leading-relaxed">Hoisting, noisy concatenation, easy to leak `var` across blocks.</p>
      </div>
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">After (ES6+)</div>
        <pre className="text-[11px] sm:text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-all">
          {`let count = 0;
const greet = (name) =>
  \`Hello \${name}\`;
const msg = \`Hi \${user.name}\`;`}
        </pre>
        <p className="mt-3 text-[10px] text-gray-500 leading-relaxed">Block scope, arrow syntax, template literals — same behavior, less surface area.</p>
      </div>
    </div>
  );
}

export function BlogDiagram({ type }: { type: string }) {
  switch (type) {
    case "frontend-architecture":
      return <DiagramFrontendArchitecture />;
    case "frontend-vs-backend":
      return <DiagramFrontendVsBackend />;
    case "component-based-ui":
      return <DiagramComponentBasedUI />;
    case "learning-path":
      return <DiagramLearningPath />;
    case "html-structure":
      return <DiagramHtmlStructure />;
    case "before-after-css":
      return <DiagramBeforeAfterCss />;
    case "interaction-flow":
      return <DiagramInteractionFlow />;
    case "combined-flow":
      return <DiagramCombinedFlow />;
    case "html-css-js-path":
      return <DiagramHtmlCssJsPath />;
    case "web-flow-overview":
      return <DiagramWebFlowOverview />;
    case "url-breakdown":
      return <DiagramUrlBreakdown />;
    case "dns-flow":
      return <DiagramDnsFlow />;
    case "rendering-pipeline":
      return <DiagramRenderingPipeline />;
    case "dom-tree":
      return <DiagramDomTree />;
    case "dom-rendering-pipeline":
      return <DiagramDomRenderingPipeline />;
    case "dom-update-cycle":
      return <DiagramDomUpdateCycle />;
    case "flexbox-layout":
      return <DiagramFlexboxLayout />;
    case "grid-layout":
      return <DiagramGridLayout />;
    case "flexbox-vs-grid-table":
      return <DiagramFlexboxVsGridTable />;
    case "layout-decision-flow":
      return <DiagramLayoutDecisionFlow />;
    case "js-vs-ts-layers":
      return <DiagramJsVsTsLayers />;
    case "js-vs-ts-table":
      return <DiagramJsVsTsTable />;
    case "js-ts-error-timeline":
      return <DiagramJsTsErrorTimeline />;
    case "js-ts-learning-path":
      return <DiagramJsTsLearningPath />;
    case "sync-vs-async":
      return <DiagramSyncVsAsync />;
    case "event-loop":
      return <DiagramEventLoop />;
    case "promise-lifecycle":
      return <DiagramPromiseLifecycle />;
    case "async-await-flow":
      return <DiagramAsyncAwaitFlow />;
    case "full-async-flow":
      return <DiagramFullAsyncFlow />;
    case "es6-transformation":
      return <DiagramEs6Transformation />;
    case "api-communication":
      return <DiagramApiCommunication />;
    case "full-api-request-flow":
      return <DiagramFullApiRequestFlow />;
    case "rest-api-structure":
      return <DiagramRestApiStructure />;
    case "graphql-flow":
      return <DiagramGraphqlFlow />;
    case "rest-vs-graphql":
      return <DiagramRestVsGraphql />;
    case "api-decision-flow":
      return <DiagramApiDecisionFlow />;
    case "localstorage-lifecycle":
      return <DiagramLocalStorageLifecycle />;
    case "sessionstorage-lifecycle":
      return <DiagramSessionStorageLifecycle />;
    case "cookie-flow":
      return <DiagramCookieFlow />;
    case "storage-use-case-comparison":
      return <DiagramStorageUseCaseComparison />;
    case "storage-decision-flow":
      return <DiagramStorageDecisionFlow />;
    case "react-component-tree":
      return <DiagramReactComponentTree />;
    case "react-state-flow":
      return <DiagramReactStateFlow />;
    case "react-hook-lifecycle":
      return <DiagramReactHookLifecycle />;
    case "react-virtual-dom":
      return <DiagramReactVirtualDom />;
    case "usestate-flow":
      return <DiagramUseStateFlow />;
    case "useeffect-flow":
      return <DiagramUseEffectFlow />;
    case "usememo-optimization":
      return <DiagramUseMemoOptimization />;
    case "hooks-combined-flow":
      return <DiagramHooksCombinedFlow />;
    case "react-rerender-control":
      return <DiagramReactRerenderControl />;
    case "react-lazy-loading":
      return <DiagramReactLazyLoading />;
    case "react-virtualization":
      return <DiagramReactVirtualization />;
    case "react-rendering-flow":
      return <DiagramReactRenderingFlow />;
    case "react-feature-structure":
      return <DiagramReactFeatureStructure />;
    case "react-component-layers":
      return <DiagramReactComponentLayers />;
    case "react-state-layers":
      return <DiagramReactStateLayers />;
    case "react-full-architecture":
      return <DiagramReactFullArchitecture />;
    case "nextjs-file-routing":
      return <DiagramNextjsFileRouting />;
    case "nextjs-rendering-strategies":
      return <DiagramNextjsRenderingStrategies />;
    case "nextjs-use-cases":
      return <DiagramNextjsUseCases />;
    case "nextjs-vs-react-table":
      return <DiagramNextjsVsReactTable />;
    case "react-nextjs-comparison":
      return <DiagramReactNextjsComparison />;
    case "rendering-csr-vs-ssr":
      return <DiagramRenderingCsrVsSsr />;
    case "react-nextjs-decision":
      return <DiagramReactNextjsDecision />;
    default:
      return null;
  }
}

// ─── Blog: React Performance diagrams ─────────────────────────────────────────

function DiagramReactRerenderControl() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-red-500/15 bg-red-500/[0.03] p-5">
          <div className="text-sm font-bold text-red-400 mb-3">Without React.memo</div>
          <div className="flex flex-col gap-2">
            <div className="rounded-lg border border-red-500/25 bg-red-500/[0.08] px-4 py-2.5 text-xs text-red-300 font-medium">Parent re-renders</div>
            <div className="pl-5 border-l border-white/[0.06] ml-3 flex flex-col gap-2">
              {["Child A", "Child B", "Child C"].map((c) => (
                <div key={c} className="rounded-lg border border-red-500/20 bg-red-500/[0.05] px-3 py-2 text-xs text-red-400/70 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  {c} re-renders
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.03] p-5">
          <div className="text-sm font-bold text-emerald-400 mb-3">With React.memo</div>
          <div className="flex flex-col gap-2">
            <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-2.5 text-xs text-emerald-300 font-medium">Parent re-renders</div>
            <div className="pl-5 border-l border-white/[0.06] ml-3 flex flex-col gap-2">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] px-3 py-2 text-xs text-emerald-400/70 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Child A (props changed)
              </div>
              {["Child B", "Child C"].map((c) => (
                <div key={c} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-gray-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                  {c} skipped
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiagramReactLazyLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
        <div className="text-sm font-bold text-gray-300 mb-3">Without Code Splitting</div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/[0.05] px-4 py-6 text-center">
          <div className="text-2xl font-bold text-red-400 mb-1">1.8 MB</div>
          <div className="text-xs text-gray-500">Single bundle, loads everything</div>
        </div>
      </div>
      <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.03] p-5">
        <div className="text-sm font-bold text-emerald-400 mb-3">With Lazy Loading</div>
        <div className="flex flex-col gap-2">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-2 text-center animate-pipeline-glow" style={{ "--glow-color": "rgba(16,185,129,0.12)" } as React.CSSProperties}>
            <div className="text-sm font-bold text-emerald-400">200 KB</div>
            <div className="text-[10px] text-gray-500">Initial bundle</div>
          </div>
          {["Route A: 80 KB", "Route B: 120 KB", "Modal: 60 KB"].map((chunk) => (
            <div key={chunk} className="rounded-lg border border-dashed border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-center">
              <div className="text-[11px] text-gray-500">{chunk} <span className="text-gray-600">(on demand)</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiagramReactVirtualization() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
        <div className="text-sm font-bold text-gray-300 mb-3">No Virtualization</div>
        <div className="rounded-lg border border-white/[0.06] overflow-hidden">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={`px-3 py-1.5 text-[10px] border-b border-white/[0.04] ${i < 3 ? "text-red-400/70 bg-red-500/[0.04]" : "text-red-400/40 bg-red-500/[0.02]"}`}>
              Item {i + 1} {i >= 3 && <span className="text-gray-700">(off screen, still mounted)</span>}
            </div>
          ))}
          <div className="px-3 py-1 text-[9px] text-gray-700 bg-red-500/[0.02]">... 992 more items mounted</div>
        </div>
      </div>
      <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.03] p-5">
        <div className="text-sm font-bold text-emerald-400 mb-3">With Virtualization</div>
        <div className="rounded-lg border border-white/[0.06] overflow-hidden">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="px-3 py-1.5 text-[10px] border-b border-white/[0.04] text-emerald-400/70 bg-emerald-500/[0.04]">
              Item {i + 1} <span className="text-emerald-500/40">(visible, mounted)</span>
            </div>
          ))}
          <div className="px-3 py-2 text-[9px] text-gray-600 bg-white/[0.02] text-center">
            997 items exist but are <span className="text-emerald-400/60 font-medium">not in the DOM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiagramReactRenderingFlow() {
  const steps = [
    { label: "State Change", color: "#f97316" },
    { label: "Virtual DOM", color: "#eab308" },
    { label: "Diffing", color: "#3b82f6" },
    { label: "Real DOM", color: "#22c55e" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3 flex-1">
            <div
              className="flex-1 rounded-lg border px-3 py-4 text-center animate-pipeline-glow"
              style={{
                borderColor: step.color + "30",
                backgroundColor: step.color + "0a",
                "--glow-color": step.color + "15",
                animationDelay: `${i * 0.5}s`,
              } as React.CSSProperties}
            >
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Step {i + 1}</div>
              <div className="text-xs font-bold" style={{ color: step.color }}>{step.label}</div>
            </div>
            {i < steps.length - 1 && <FlowArrow />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Blog: Structure Large React Apps diagrams ────────────────────────────────

function DiagramReactFeatureStructure() {
  const features = [
    { name: "auth", items: ["components/", "hooks/", "services/"], color: "#3b82f6" },
    { name: "dashboard", items: ["components/", "hooks/", "services/"], color: "#8b5cf6" },
    { name: "profile", items: ["components/", "hooks/"], color: "#06b6d4" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-4">features/</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {features.map((f) => (
          <div
            key={f.name}
            className="rounded-lg border px-4 py-4 animate-pipeline-glow"
            style={{ borderColor: f.color + "25", backgroundColor: f.color + "08", "--glow-color": f.color + "12" } as React.CSSProperties}
          >
            <div className="text-sm font-bold mb-3" style={{ color: f.color }}>{f.name}/</div>
            <div className="flex flex-col gap-1.5">
              {f.items.map((item) => (
                <div key={item} className="text-xs text-gray-500 font-mono pl-3 border-l border-white/[0.06]">{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagramReactComponentLayers() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-5">
          <div className="text-sm font-bold text-blue-400 mb-3">Container (Logic)</div>
          <div className="flex flex-col gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />Fetches data</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />Manages state</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />Handles events</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />Passes props down</div>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
          <div className="text-sm font-bold text-emerald-400 mb-3">UI (Presentation)</div>
          <div className="flex flex-col gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" />Receives props</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" />Renders UI</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" />No business logic</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" />Easy to test</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiagramReactStateLayers() {
  const layers = [
    { label: "Local State", sub: "useState, useReducer", scope: "Component", color: "#22c55e" },
    { label: "Context", sub: "useContext, Providers", scope: "Feature / App", color: "#3b82f6" },
    { label: "State Library", sub: "Zustand, Redux, TanStack Query", scope: "Global / Server", color: "#8b5cf6" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col gap-3">
        {layers.map((layer, i) => (
          <div
            key={layer.label}
            className="rounded-lg border px-5 py-4 flex items-center justify-between animate-pipeline-glow"
            style={{
              borderColor: layer.color + "25",
              backgroundColor: layer.color + "08",
              "--glow-color": layer.color + "12",
              animationDelay: `${i * 0.4}s`,
            } as React.CSSProperties}
          >
            <div>
              <div className="text-sm font-bold" style={{ color: layer.color }}>{layer.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{layer.sub}</div>
            </div>
            <div className="text-[10px] text-gray-600 bg-white/[0.04] px-2.5 py-1 rounded-full font-medium">{layer.scope}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagramReactFullArchitecture() {
  const sections = [
    { name: "app/", items: ["routes/", "store/"], color: "#f97316" },
    { name: "features/", items: ["auth/", "dashboard/", "profile/", "settings/"], color: "#3b82f6" },
    { name: "shared/", items: ["components/", "hooks/", "utils/", "constants/"], color: "#22c55e" },
    { name: "assets/", items: ["images/", "fonts/"], color: "#8b5cf6" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-4">src/</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sections.map((s) => (
          <div
            key={s.name}
            className="rounded-lg border px-4 py-3.5 animate-pipeline-glow"
            style={{ borderColor: s.color + "25", backgroundColor: s.color + "08", "--glow-color": s.color + "10" } as React.CSSProperties}
          >
            <div className="text-sm font-bold font-mono mb-2" style={{ color: s.color }}>{s.name}</div>
            <div className="flex flex-wrap gap-1.5">
              {s.items.map((item) => (
                <span key={item} className="text-[11px] text-gray-500 font-mono bg-white/[0.04] px-2 py-0.5 rounded">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Blog: What is Next.js diagrams ───────────────────────────────────────────

function DiagramNextjsFileRouting() {
  const routes = [
    { file: "app/page.tsx", route: "/", color: "#3b82f6" },
    { file: "app/about/page.tsx", route: "/about", color: "#8b5cf6" },
    { file: "app/blog/page.tsx", route: "/blog", color: "#06b6d4" },
    { file: "app/blog/[id]/page.tsx", route: "/blog/:id", color: "#22c55e" },
    { file: "app/api/user/route.ts", route: "/api/user", color: "#f97316" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2">File</div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 hidden sm:block">Route</div>
        {routes.map((r) => (
          <div key={r.file} className="contents">
            <div className="text-sm font-mono text-gray-400 py-1.5 border-t border-white/[0.04]">{r.file}</div>
            <div className="text-sm font-mono font-semibold py-1.5 border-t border-white/[0.04]" style={{ color: r.color }}>
              <span className="sm:hidden text-gray-600">{"\u2192 "}</span>{r.route}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagramNextjsRenderingStrategies() {
  const strategies = [
    { name: "CSR", full: "Client-Side", when: "Interactive dashboards", speed: "Slow initial", seo: "Poor", color: "#eab308" },
    { name: "SSR", full: "Server-Side", when: "Dynamic pages", speed: "Medium", seo: "Great", color: "#3b82f6" },
    { name: "SSG", full: "Static Generation", when: "Blogs, docs", speed: "Fastest", seo: "Great", color: "#22c55e" },
    { name: "ISR", full: "Incremental Static", when: "Updated content", speed: "Fast", seo: "Great", color: "#8b5cf6" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {strategies.map((s) => (
          <div
            key={s.name}
            className="rounded-lg border px-4 py-4 animate-pipeline-glow"
            style={{ borderColor: s.color + "25", backgroundColor: s.color + "08", "--glow-color": s.color + "12" } as React.CSSProperties}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base font-bold" style={{ color: s.color }}>{s.name}</span>
              <span className="text-xs text-gray-500">{s.full}</span>
            </div>
            <div className="flex flex-col gap-1 text-xs text-gray-400">
              <div>Best for: <span className="text-gray-300">{s.when}</span></div>
              <div>Speed: <span className="text-gray-300">{s.speed}</span></div>
              <div>SEO: <span className="text-gray-300">{s.seo}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagramNextjsUseCases() {
  const cases = [
    { use: "Marketing", strategy: "SSG", color: "#22c55e" },
    { use: "Blog / Docs", strategy: "SSG + ISR", color: "#8b5cf6" },
    { use: "Dashboard", strategy: "SSR / CSR", color: "#3b82f6" },
    { use: "E-commerce", strategy: "SSG + SSR", color: "#f97316" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cases.map((c) => (
          <div key={c.use} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-300 font-medium">{c.use}</span>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ color: c.color, backgroundColor: c.color + "15" }}
            >
              {c.strategy}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagramNextjsVsReactTable() {
  const rows = [
    { feature: "Routing", react: "Manual setup", next: "Built-in (file-based)" },
    { feature: "SEO", react: "Limited (CSR)", next: "Strong (SSR + SSG)" },
    { feature: "Rendering", react: "CSR only", next: "CSR + SSR + SSG + ISR" },
    { feature: "Backend", react: "Separate", next: "Built-in API routes" },
    { feature: "Setup", react: "Manual config", next: "Pre-configured" },
    { feature: "Performance", react: "You optimize", next: "Optimized by default" },
  ];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Feature</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">React</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-blue-400 uppercase tracking-wider">Next.js</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.feature} className={i < rows.length - 1 ? "border-b border-white/[0.04]" : ""}>
              <td className="px-5 py-3 text-gray-400 font-medium">{row.feature}</td>
              <td className="px-5 py-3 text-gray-300">{row.react}</td>
              <td className="px-5 py-3 text-gray-300">{row.next}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Blog: Next.js vs React diagrams ──────────────────────────────────────────

function DiagramReactNextjsComparison() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5">
        <div className="text-lg font-bold text-cyan-400 mb-4">React</div>
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Library</div>
        <div className="flex flex-col gap-2">
          {["Components & UI", "State management", "Virtual DOM", "JSX syntax"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />{item}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-gray-600">
          You add: routing, SEO, APIs, build config
        </div>
      </div>
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-5">
        <div className="text-lg font-bold text-blue-400 mb-4">Next.js</div>
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Framework (includes React)</div>
        <div className="flex flex-col gap-2">
          {["Everything React has", "File-based routing", "SSR / SSG / ISR", "API routes", "Image optimization", "SEO built-in"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />{item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiagramRenderingCsrVsSsr() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/[0.04] p-5">
          <div className="text-sm font-bold text-yellow-400 mb-3">CSR (React default)</div>
          <div className="flex flex-col gap-2">
            {[
              { step: "Browser loads empty HTML", dim: false },
              { step: "Downloads JavaScript bundle", dim: false },
              { step: "JS executes and renders UI", dim: false },
              { step: "User finally sees content", dim: true },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 shrink-0">{i + 1}</div>
                <span className={`text-xs ${s.dim ? "text-yellow-400 font-medium" : "text-gray-500"}`}>{s.step}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/[0.04] p-5">
          <div className="text-sm font-bold text-blue-400 mb-3">SSR (Next.js)</div>
          <div className="flex flex-col gap-2">
            {[
              { step: "Server renders full HTML", dim: false },
              { step: "User sees content immediately", dim: true },
              { step: "JS hydrates for interactivity", dim: false },
              { step: "Page is fully interactive", dim: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border border-blue-500/30 bg-blue-500/10 text-blue-400 shrink-0">{i + 1}</div>
                <span className={`text-xs ${s.dim ? "text-emerald-400 font-medium" : "text-gray-500"}`}>{s.step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiagramReactNextjsDecision() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white text-center">
          What are you building?
        </div>
        <div className="flex items-start w-full max-w-lg">
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-px h-6 bg-white/[0.1]" />
            <div className="text-xs text-gray-600 mb-1">Learning / Simple SPA / No SEO</div>
            <div
              className="rounded-xl border px-5 py-4 text-center w-full animate-pipeline-glow"
              style={{ borderColor: "#06b6d430", backgroundColor: "#06b6d410", "--glow-color": "rgba(6,182,212,0.12)" } as React.CSSProperties}
            >
              <div className="text-base font-bold text-cyan-400 mb-1">React</div>
              <div className="text-xs text-gray-500">Full control, manual setup</div>
            </div>
          </div>
          <div className="w-10" />
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-px h-6 bg-white/[0.1]" />
            <div className="text-xs text-gray-600 mb-1">Production / SEO / Full-stack</div>
            <div
              className="rounded-xl border px-5 py-4 text-center w-full animate-pipeline-glow"
              style={{ borderColor: "#3b82f630", backgroundColor: "#3b82f610", "--glow-color": "rgba(59,130,246,0.12)", animationDelay: "0.5s" } as React.CSSProperties}
            >
              <div className="text-base font-bold text-blue-400 mb-1">Next.js</div>
              <div className="text-xs text-gray-500">Built-in everything, ship faster</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
