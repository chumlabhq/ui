import { useState } from "react";
import { Slider } from "../../components/Slider";
import type { SliderValue, SliderMark } from "../../components/Slider";
import { useTheme } from "./ThemeContext";
import {
  Section,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  text: `text-sm ${dark ? "text-gray-300" : "text-gray-600"}`,
  textMuted: `text-xs ${dark ? "text-gray-400" : "text-gray-500"}`,
  badge: `inline-flex px-2 py-0.5 rounded text-xs font-mono tabular-nums ${dark ? "bg-gray-800 text-gray-300 border border-white/10" : "bg-gray-100 text-gray-700 border border-gray-200"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
  slider: {
    root: "flex flex-col gap-2 w-full",
    label: `text-sm font-medium ${dark ? "text-gray-200" : "text-gray-700"}`,
    description: `text-xs ${dark ? "text-gray-400" : "text-gray-500"}`,
    wrapper: "relative select-none touch-none",
    track: `rounded-full ${dark ? "bg-white/[0.12]" : "bg-gray-200"}`,
    range: "rounded-full bg-indigo-500",
    thumb: `absolute rounded-full bg-white border-2 border-indigo-500 shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 hover:shadow-lg cursor-grab ${dark ? "focus-visible:ring-offset-gray-900" : "focus-visible:ring-offset-white"}`,
    thumbActive: "cursor-grabbing shadow-lg ring-2 ring-indigo-500 ring-offset-2",
    thumbDisabled: "opacity-50 cursor-not-allowed",
    tooltip: "absolute px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm whitespace-nowrap pointer-events-none",
    mark: "absolute",
    markDot: `rounded-full bg-white ${dark ? "border-2 border-gray-600" : "border-2 border-gray-300"}`,
    markDotActive: `${dark ? "border-indigo-400" : "border-indigo-500"} bg-white`,
    markLabel: `text-xs ${dark ? "text-gray-400" : "text-gray-500"}`,
    error: "text-sm text-red-500 mt-1",
  },
});

// ─── Custom thumb icons ──────────────────────────────────────────────────────

const HeartIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-rose-500">
    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-amber-500">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const VolumeIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={`w-3 h-3`}>
    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10a7.971 7.971 0 00-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

const SliderDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  // ─── State ──────────────────────────────────────────────────────────
  const [basic, setBasic] = useState(50);
  const [range, setRange] = useState<SliderValue>([25, 75]);
  const [stepped, setStepped] = useState(50);
  const [controlled, setControlled] = useState(30);
  const [volume, setVolume] = useState(65);
  const [price, setPrice] = useState<SliderValue>([200, 800]);
  const [temp, setTemp] = useState(22);
  const [opacity, setOpacity] = useState(80);
  const [custom1, setCustom1] = useState(50);
  const [custom2, setCustom2] = useState(3);
  const [vertical, setVertical] = useState(40);
  const [invertedVal, setInvertedVal] = useState(70);
  const [minDist, setMinDist] = useState<SliderValue>([20, 80]);
  const [commitVal, setCommitVal] = useState(50);
  const [lastCommit, setLastCommit] = useState(50);
  const [successVal, setSuccessVal] = useState(75);

  const tempMarks: SliderMark[] = [
    { value: 16, label: "16\u00b0C" },
    { value: 20, label: "20\u00b0C" },
    { value: 24, label: "24\u00b0C" },
    { value: 28, label: "28\u00b0C" },
    { value: 32, label: "32\u00b0C" },
  ];

  const ratingMarks: SliderMark[] = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
  ];

  return (
    <div className="space-y-10">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div className={`absolute inset-0 ${dark ? "bg-linear-to-br from-indigo-950/80 via-gray-900/60 to-blue-950/50" : "bg-linear-to-br from-indigo-50 via-white to-blue-50/80"}`} />
        <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl ${dark ? "bg-indigo-500/10" : "bg-indigo-200/40"}`} />
        <div className={`absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl ${dark ? "bg-blue-500/8" : "bg-blue-200/30"}`} />
        <div className="relative">
          <h1 className={`text-3xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>Slider</h1>
          <p className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}>
            A range input component supporting single and range values, discrete
            steps, marks with labels, value tooltips, custom thumb rendering,
            vertical orientation, and full keyboard navigation. Includes form
            integration with hidden inputs, label, error states, and the
            standard classes/unstyled system.
          </p>
          <div className="mt-5">
            <pre className={`p-3.5 rounded-xl text-[13px] leading-relaxed overflow-x-auto ${dark ? "bg-linear-to-br from-gray-800 to-gray-900 text-gray-300 border border-white/6" : "bg-gray-50 text-gray-700 border border-gray-200"}`}>
              <code>{`import { Slider } from "@chumlab/ui/slider";`}</code>
            </pre>
          </div>
        </div>
      </header>

      {/* ── Basic ────────────────────────────────────────────────────── */}
      <Section title="Basic Usage" description="Works out-of-the-box with built-in styles, dark mode, and keyboard navigation (arrow keys). No custom classes needed." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-col gap-6 max-w-sm">
            {/* Basic usage — works out-of-the-box with built-in styles */}
            <Slider
              label="Volume"
              value={basic}
              onValueChange={(v) => setBasic(v as number)}
            />
            <Slider
              label="Brightness"
              defaultValue={75}
              description="Adjust screen brightness"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Range ────────────────────────────────────────────────────── */}
      <Section title="Range Slider" description="Pass a [number, number] tuple as value for two-thumb range selection." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full max-w-sm space-y-3">
            <Slider value={range} onValueChange={setRange} classes={c.slider} />
            <div className={c.text}>
              Range: <span className={c.badge}>{(range as [number, number])[0]}</span> – <span className={c.badge}>{(range as [number, number])[1]}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── With Label & Description ──────────────────────────────── */}
      <Section title="Label & Description" description="Form-integrated slider with label, description, and error state." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-8 w-full max-w-sm">
            <Slider
              label="Volume"
              description="Adjust the playback volume"
              value={volume}
              onValueChange={(v) => setVolume(v as number)}
              classes={c.slider}
              showTooltip
              formatTooltip={(v) => `${v}%`}
            />
            <Slider
              label="Budget"
              description="This field is required"
              required
              error
              errorMessage="Please select a valid budget range"
              value={30}
              classes={c.slider}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Steps ────────────────────────────────────────────────────── */}
      <Section title="Steps" description="Discrete step increments snap the thumb to fixed values." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-8 w-full max-w-sm">
            <div className="space-y-2">
              <Slider value={stepped} onValueChange={(v) => setStepped(v as number)} step={10} classes={c.slider} showTooltip />
              <div className={c.textMuted}>Step: 10 — Value: {stepped}</div>
            </div>
            <div className="space-y-2">
              <Slider value={custom2} onValueChange={(v) => setCustom2(v as number)} min={1} max={5} step={1} classes={c.slider} showTooltip marks={ratingMarks} />
              <div className={c.textMuted}>Rating: {custom2} / 5</div>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Marks ────────────────────────────────────────────────────── */}
      <Section title="Marks" description="Visual tick marks with optional labels along the track. Customise dot size, style, or use renderMark for fully custom dots." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-12 w-full max-w-md">
            {/* Default marks */}
            <div className="space-y-1">
              <span className={c.label}>Default marks with labels</span>
              <Slider
                value={temp}
                onValueChange={(v) => setTemp(v as number)}
                min={16}
                max={32}
                step={1}
                marks={tempMarks}
                showTooltip
                formatTooltip={(v) => `${v}\u00b0C`}
                classes={c.slider}
              />
              <div className={c.textMuted}>Temperature: {temp}&deg;C</div>
            </div>

            {/* Larger dots */}
            <div className="space-y-1">
              <span className={c.label}>Large dots (10px)</span>
              <Slider
                defaultValue={50}
                marks={[
                  { value: 0, label: "0" },
                  { value: 25, label: "25" },
                  { value: 50, label: "50" },
                  { value: 75, label: "75" },
                  { value: 100, label: "100" },
                ]}
                markDotSize={10}
                classes={c.slider}
              />
            </div>

            {/* Dots only, no labels */}
            <div className="space-y-1">
              <span className={c.label}>Dots only (no labels)</span>
              <Slider
                defaultValue={60}
                marks={[0, 20, 40, 60, 80, 100].map((v) => ({ value: v }))}
                showMarkLabels={false}
                markDotSize={8}
                classes={c.slider}
              />
            </div>

            {/* Solid filled dots */}
            <div className="space-y-1">
              <span className={c.label}>Solid filled dots</span>
              <Slider
                defaultValue={3}
                min={1}
                max={5}
                step={1}
                marks={ratingMarks}
                markDotSize={10}
                classes={{
                  ...c.slider,
                  markDot: `rounded-full ${dark ? "bg-gray-600" : "bg-gray-300"}`,
                  markDotActive: dark ? "bg-indigo-400" : "bg-indigo-500",
                }}
              />
            </div>

            {/* Custom renderMark — line ticks */}
            <div className="space-y-1">
              <span className={c.label}>Custom renderMark (line ticks)</span>
              <Slider
                defaultValue={50}
                step={10}
                marks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => ({
                  value: v,
                  label: v % 20 === 0 ? String(v) : undefined,
                }))}
                renderMark={({ isActive }) => (
                  <div
                    style={{
                      width: "2px",
                      height: "10px",
                      borderRadius: "1px",
                      backgroundColor: isActive
                        ? (dark ? "#818cf8" : "#6366f1")
                        : (dark ? "#4b5563" : "#d1d5db"),
                      transform: "translateY(-50%)",
                    }}
                  />
                )}
                classes={c.slider}
              />
            </div>

            {/* Custom renderMark — diamond */}
            <div className="space-y-1">
              <span className={c.label}>Custom renderMark (diamonds)</span>
              <Slider
                defaultValue={40}
                marks={[0, 25, 50, 75, 100].map((v) => ({ value: v, label: `${v}%` }))}
                renderMark={({ isActive }) => (
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: isActive
                        ? (dark ? "#818cf8" : "#6366f1")
                        : (dark ? "#4b5563" : "#d1d5db"),
                      transform: "translateY(-50%) rotate(45deg)",
                    }}
                  />
                )}
                classes={c.slider}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Tooltip ──────────────────────────────────────────────────── */}
      <Section title="Tooltip" description="Show a value tooltip on hover/drag, or always. Use formatTooltip for custom display." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-10 w-full max-w-sm">
            <div className="space-y-1">
              <span className={c.label}>On hover/drag</span>
              <Slider value={basic} onValueChange={(v) => setBasic(v as number)} showTooltip classes={c.slider} />
            </div>
            <div className="space-y-1">
              <span className={c.label}>Always visible</span>
              <Slider value={opacity} onValueChange={(v) => setOpacity(v as number)} showTooltip tooltipAlways formatTooltip={(v) => `${v}%`} classes={c.slider} />
            </div>
            <div className="space-y-1">
              <span className={c.label}>Custom format (range)</span>
              <Slider
                value={price}
                onValueChange={setPrice}
                min={0}
                max={1000}
                step={10}
                showTooltip
                formatTooltip={(v) => `$${v}`}
                classes={c.slider}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Custom Thumb ─────────────────────────────────────────────── */}
      <Section title="Custom Thumb" description="Use renderThumb to render icons, images, or any content inside the thumb." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-10 w-full max-w-sm">
            <div className="space-y-1">
              <span className={c.label}>Heart icon</span>
              <Slider
                value={custom1}
                onValueChange={(v) => setCustom1(v as number)}
                renderThumb={() => (
                  <div className="flex items-center justify-center w-full h-full"><HeartIcon /></div>
                )}
                classes={{
                  ...c.slider,
                  thumb: `absolute rounded-full bg-white border-2 border-rose-400 shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 hover:shadow-lg cursor-grab ${dark ? "focus-visible:ring-offset-gray-900" : ""}`,
                  thumbActive: "cursor-grabbing shadow-lg ring-2 ring-rose-400 ring-offset-2",
                  range: "rounded-full bg-rose-400",
                }}
                showTooltip
              />
            </div>
            <div className="space-y-1">
              <span className={c.label}>Star rating</span>
              <Slider
                value={custom2}
                onValueChange={(v) => setCustom2(v as number)}
                min={1}
                max={5}
                step={1}
                renderThumb={() => (
                  <div className="flex items-center justify-center w-full h-full"><StarIcon /></div>
                )}
                classes={{
                  ...c.slider,
                  thumb: `absolute rounded-full bg-white border-2 border-amber-400 shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 hover:shadow-lg cursor-grab ${dark ? "focus-visible:ring-offset-gray-900" : ""}`,
                  thumbActive: "cursor-grabbing shadow-lg ring-2 ring-amber-400 ring-offset-2",
                  range: "rounded-full bg-amber-400",
                }}
                showTooltip
                formatTooltip={(v) => `${v} star${v !== 1 ? "s" : ""}`}
              />
            </div>
            <div className="space-y-1">
              <span className={c.label}>Volume icon</span>
              <Slider
                value={volume}
                onValueChange={(v) => setVolume(v as number)}
                renderThumb={() => (
                  <div className={`flex items-center justify-center w-full h-full ${dark ? "text-indigo-300" : "text-indigo-600"}`}>
                    <VolumeIcon />
                  </div>
                )}
                classes={c.slider}
                showTooltip
                formatTooltip={(v) => `${v}%`}
              />
            </div>
            <div className="space-y-1">
              <span className={c.label}>Emoji thumb</span>
              <Slider
                value={basic}
                onValueChange={(v) => setBasic(v as number)}
                renderThumb={({ value: v }) => (
                  <div className="flex items-center justify-center w-full h-full text-xs">
                    {v < 30 ? "\u{1F61E}" : v < 70 ? "\u{1F610}" : "\u{1F60A}"}
                  </div>
                )}
                classes={{
                  ...c.slider,
                  thumb: `absolute rounded-full bg-white border border-gray-300 shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 hover:shadow-lg cursor-grab ${dark ? "focus-visible:ring-offset-gray-900 border-gray-600" : ""}`,
                }}
                showTooltip
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Min Steps Between Thumbs ─────────────────────────────────── */}
      <Section title="Min Steps Between Thumbs" description="Enforce a minimum distance between range thumbs." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full max-w-sm space-y-3">
            <Slider
              value={minDist}
              onValueChange={setMinDist}
              minStepsBetweenThumbs={10}
              showTooltip
              classes={c.slider}
            />
            <div className={c.textMuted}>Min gap: 10 — Values: {(minDist as [number, number]).join(" – ")}</div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Controlled ───────────────────────────────────────────────── */}
      <Section title="Controlled" description="Fully controlled via value and onValueChange. External buttons can set the value." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full max-w-sm space-y-4">
            <Slider value={controlled} onValueChange={(v) => setControlled(v as number)} classes={c.slider} showTooltip />
            <div className="flex gap-2 flex-wrap">
              {[0, 25, 50, 75, 100].map((v) => (
                <button key={v} type="button" className={controlled === v ? c.btnPrimary : c.btn} onClick={() => setControlled(v)}>
                  {v}
                </button>
              ))}
            </div>
            <div className={c.text}>Value: <span className={c.badge}>{controlled}</span></div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Uncontrolled ─────────────────────────────────────────────── */}
      <Section title="Uncontrolled (defaultValue)" description="Use defaultValue for uncontrolled mode. The slider manages its own state." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full max-w-sm">
            <Slider defaultValue={40} classes={c.slider} showTooltip />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── onValueCommit ────────────────────────────────────────────── */}
      <Section title="onValueCommit" description="Fires only when the user finishes dragging (pointer up). Useful for debounced API calls." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full max-w-sm space-y-3">
            <Slider
              value={commitVal}
              onValueChange={(v) => setCommitVal(v as number)}
              onValueCommit={(v) => setLastCommit(v as number)}
              classes={c.slider}
              showTooltip
            />
            <div className={c.text}>
              Live: <span className={c.badge}>{commitVal}</span>{" "}
              Committed: <span className={c.badge}>{lastCommit}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Disabled ─────────────────────────────────────────────────── */}
      <Section title="Disabled" description="The slider is non-interactive when disabled." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-6 w-full max-w-sm">
            <Slider value={50} disabled classes={c.slider} />
            <Slider value={[20, 80]} disabled classes={c.slider} />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Success State ─────────────────────────────────────────────── */}
      <Section title="Success State" description="Display a success message for valid slider values." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Slider
            label="Volume"
            value={successVal}
            onValueChange={(v) => setSuccessVal(v as number)}
            success={successVal >= 50}
            successMessage="Good volume level"
            classes={c.slider}
          />
        </DemoWrapper>
      </Section>

      {/* ── Loading State ─────────────────────────────────────────────── */}
      <Section title="Loading State" description="Show a loading state while the value is being saved." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Slider label="Saving preference..." defaultValue={50} loading classes={c.slider} />
        </DemoWrapper>
      </Section>

      {/* ── Vertical ─────────────────────────────────────────────────── */}
      <Section title="Vertical" description="Set orientation to 'vertical' for a vertical slider." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-end gap-10 h-52">
            <div className="flex flex-col items-center gap-2">
              <Slider
                value={vertical}
                onValueChange={(v) => setVertical(v as number)}
                orientation="vertical"
                classes={c.slider}
                showTooltip
                style={{ height: "180px" }}
              />
              <span className={c.label}>{vertical}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Slider
                value={[20, 70]}
                orientation="vertical"
                classes={c.slider}
                showTooltip
                style={{ height: "180px" }}
              />
              <span className={c.label}>Range</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Inverted ─────────────────────────────────────────────────── */}
      <Section title="Inverted" description="Reverse the slider direction with the inverted prop." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full max-w-sm space-y-3">
            <Slider value={invertedVal} onValueChange={(v) => setInvertedVal(v as number)} inverted showTooltip classes={c.slider} />
            <div className={c.textMuted}>Inverted — Value: {invertedVal}</div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Color Variants ───────────────────────────────────────────── */}
      <Section title="Color Variants" description="Override the range and thumb classes for custom colors." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-6 w-full max-w-sm">
            {[
              { range: "bg-emerald-500", border: "border-emerald-500", ring: "ring-emerald-500", name: "Emerald", val: 65 },
              { range: "bg-rose-500", border: "border-rose-500", ring: "ring-rose-500", name: "Rose", val: 45 },
              { range: "bg-amber-500", border: "border-amber-500", ring: "ring-amber-500", name: "Amber", val: 80 },
              { range: "bg-cyan-500", border: "border-cyan-500", ring: "ring-cyan-500", name: "Cyan", val: 30 },
            ].map(({ range: rangeCls, border, ring, name, val }) => (
              <div key={name} className="space-y-1">
                <span className={c.label}>{name}</span>
                <Slider
                  defaultValue={val}
                  classes={{
                    ...c.slider,
                    range: `rounded-full ${rangeCls}`,
                    thumb: `absolute rounded-full bg-white ${border} shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:${ring} focus-visible:ring-offset-2 hover:shadow-lg cursor-grab ${dark ? "focus-visible:ring-offset-gray-900" : ""}`,
                    thumbActive: `cursor-grabbing shadow-lg ${ring} ring-2 ring-offset-2`,
                  }}
                />
              </div>
            ))}
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Custom Styling ───────────────────────────────────────────── */}
      <Section title="Custom Styling" description="Full control via the classes prop. Every part of the slider is customisable." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-6 w-full max-w-sm">
            {/* Rounded rectangle thumb */}
            <div className="space-y-1">
              <span className={c.label}>Rounded rectangle thumb</span>
              <Slider
                defaultValue={60}
                classes={{
                  ...c.slider,
                  thumb: `absolute rounded-md bg-indigo-500 shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 hover:shadow-lg cursor-grab ${dark ? "focus-visible:ring-offset-gray-900" : ""}`,
                  thumbActive: "cursor-grabbing shadow-lg",
                }}
              />
            </div>
            {/* Tall track */}
            <div className="space-y-1">
              <span className={c.label}>Tall track (12px)</span>
              <Slider
                defaultValue={45}
                classes={{
                  ...c.slider,
                  track: `rounded-full h-3 ${dark ? "bg-white/[0.08]" : "bg-gray-100"}`,
                  range: "rounded-full bg-gradient-to-r from-indigo-500 to-purple-500",
                  wrapper: "relative select-none touch-none py-1",
                }}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Unstyled ─────────────────────────────────────────────────── */}
      <Section title="Unstyled" description="Set unstyled to remove all default classes. Provide your own styling via the classes prop." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full max-w-sm">
            <Slider
              label="Custom slider"
              defaultValue={50}
              unstyled
              classes={{
                root: "flex flex-col gap-2",
                label: `text-sm font-medium ${dark ? "text-gray-200" : "text-gray-700"}`,
                wrapper: "relative h-6 select-none touch-none",
                track: `absolute top-1/2 -translate-y-1/2 w-full h-2 rounded-full ${dark ? "bg-gray-700" : "bg-gray-200"}`,
                range: `absolute h-2 rounded-full top-1/2 -translate-y-1/2 ${dark ? "bg-emerald-400" : "bg-emerald-500"}`,
                thumb: `absolute w-5 h-5 rounded-full border-2 shadow-md cursor-grab ${dark ? "bg-gray-200 border-emerald-400" : "bg-white border-emerald-500"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Form Integration ─────────────────────────────────────────── */}
      <Section title="Form Integration" description="Hidden inputs are rendered when name is set. The value is submitted with the form." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full max-w-sm space-y-3">
            <Slider
              name="brightness"
              label="Brightness"
              value={opacity}
              onValueChange={(v) => setOpacity(v as number)}
              required
              classes={c.slider}
              showTooltip
              formatTooltip={(v) => `${v}%`}
            />
            <div className={c.note}>Hidden input: <code>name="brightness" value="{opacity}"</code></div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Real World: Price Range ──────────────────────────────────── */}
      <Section title="Real World — Price Range Filter" description="A practical example: filtering products by price range with formatted tooltip." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full max-w-md space-y-4">
            <Slider
              label="Price Range"
              value={price}
              onValueChange={setPrice}
              min={0}
              max={1000}
              step={10}
              showTooltip
              tooltipAlways
              formatTooltip={(v) => `$${v}`}
              marks={[
                { value: 0, label: "$0" },
                { value: 250, label: "$250" },
                { value: 500, label: "$500" },
                { value: 750, label: "$750" },
                { value: 1000, label: "$1k" },
              ]}
              classes={c.slider}
            />
            <div className={`flex justify-between ${c.text}`}>
              <span>Min: <span className={c.badge}>${(price as [number, number])[0]}</span></span>
              <span>Max: <span className={c.badge}>${(price as [number, number])[1]}</span></span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Props Reference ──────────────────────────────────────────── */}
      <Section title="Props Reference" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="value" type="number | [number, number]" description="Current value — number for single, tuple for range" isDarkMode={dark} />
            <PropRow name="defaultValue" type="number | [number, number]" description="Default uncontrolled value" isDarkMode={dark} />
            <PropRow name="onValueChange" type="(value) => void" description="Fires on every value change during drag" isDarkMode={dark} />
            <PropRow name="onValueCommit" type="(value) => void" description="Fires when the user finishes dragging (pointer up)" isDarkMode={dark} />
            <PropRow name="min" type="number" defaultVal="0" description="Minimum value" isDarkMode={dark} />
            <PropRow name="max" type="number" defaultVal="100" description="Maximum value" isDarkMode={dark} />
            <PropRow name="step" type="number" defaultVal="1" description="Step increment" isDarkMode={dark} />
            <PropRow name="minStepsBetweenThumbs" type="number" defaultVal="0" description="Minimum distance between range thumbs (in steps)" isDarkMode={dark} />
            <PropRow name="orientation" type='"horizontal" | "vertical"' defaultVal='"horizontal"' description="Slider orientation" isDarkMode={dark} />
            <PropRow name="inverted" type="boolean" defaultVal="false" description="Reverse the slider direction" isDarkMode={dark} />
            <PropRow name="showTooltip" type="boolean" defaultVal="false" description="Show value tooltip on hover/drag" isDarkMode={dark} />
            <PropRow name="tooltipAlways" type="boolean" defaultVal="false" description="Always show tooltip" isDarkMode={dark} />
            <PropRow name="formatTooltip" type="(value: number) => string" defaultVal="String" description="Format the tooltip display value" isDarkMode={dark} />
            <PropRow name="marks" type="SliderMark[]" description="Array of { value, label? } for tick marks" isDarkMode={dark} />
            <PropRow name="showMarkLabels" type="boolean" defaultVal="true" description="Show mark label text" isDarkMode={dark} />
            <PropRow name="markDotSize" type="number" defaultVal="6" description="Diameter of mark dots in pixels" isDarkMode={dark} />
            <PropRow name="renderMark" type="(props) => ReactNode" description="Custom mark dot renderer. Receives { value, label, isActive, isDisabled, percent }" isDarkMode={dark} />
            <PropRow name="renderThumb" type="(props) => ReactNode" description="Custom thumb content renderer. Receives { value, index, isDragging, isDisabled }" isDarkMode={dark} />
            <PropRow name="label" type="ReactNode" description="Label above the slider" isDarkMode={dark} />
            <PropRow name="description" type="ReactNode" description="Description below the label" isDarkMode={dark} />
            <PropRow name="disabled" type="boolean" defaultVal="false" description="Disable the slider" isDarkMode={dark} />
            <PropRow name="required" type="boolean" defaultVal="false" description="Mark as required (appends *)" isDarkMode={dark} />
            <PropRow name="error" type="boolean" defaultVal="false" description="Error state" isDarkMode={dark} />
            <PropRow name="errorMessage" type="ReactNode" description="Error message shown below" isDarkMode={dark} />
            <PropRow name="name" type="string" description="Form input name — renders hidden input(s)" isDarkMode={dark} />
            <PropRow name="classes" type="SliderClasses" description="CSS class overrides per slot (root, track, range, thumb, tooltip, mark, etc.)" isDarkMode={dark} />
            <PropRow name="unstyled" type="boolean" defaultVal="false" description="Remove all default classes" isDarkMode={dark} />
            <PropRow name="ref" type="Ref<HTMLDivElement>" description="Forwarded ref to the root div" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ── SliderClasses Slots ──────────────────────────────────────── */}
      <Section title="SliderClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="root" type="string" description="Root container" isDarkMode={dark} />
            <PropRow name="label" type="string" description="Label element" isDarkMode={dark} />
            <PropRow name="description" type="string" description="Description text" isDarkMode={dark} />
            <PropRow name="wrapper" type="string" description="Track wrapper (contains track + thumbs)" isDarkMode={dark} />
            <PropRow name="track" type="string" description="Full-length track background" isDarkMode={dark} />
            <PropRow name="range" type="string" description="Filled portion of the track" isDarkMode={dark} />
            <PropRow name="thumb" type="string" description="Draggable thumb element" isDarkMode={dark} />
            <PropRow name="thumbActive" type="string" description="Active/dragging thumb" isDarkMode={dark} />
            <PropRow name="thumbDisabled" type="string" description="Disabled thumb" isDarkMode={dark} />
            <PropRow name="tooltip" type="string" description="Value tooltip" isDarkMode={dark} />
            <PropRow name="mark" type="string" description="Mark container" isDarkMode={dark} />
            <PropRow name="markDot" type="string" description="Mark tick dot" isDarkMode={dark} />
            <PropRow name="markDotActive" type="string" description="Active mark dot (within range)" isDarkMode={dark} />
            <PropRow name="markLabel" type="string" description="Mark label text" isDarkMode={dark} />
            <PropRow name="error" type="string" description="Error message" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ── Data Attributes ──────────────────────────────────────────── */}
      <Section title="Data Attributes" description="Use for CSS-based state styling." isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="data-disabled" type="Root, thumb" description="Present when disabled" isDarkMode={dark} />
            <PropRow name="data-error" type="Root" description="Present when error state is active" isDarkMode={dark} />
            <PropRow name="data-loading" type="Root" description="Present when loading=true" isDarkMode={dark} />
            <PropRow name="data-success" type="Root" description="Present when success=true (without error)" isDarkMode={dark} />
            <PropRow name="data-orientation" type="Root, wrapper" description='"horizontal" or "vertical"' isDarkMode={dark} />
            <PropRow name="data-index" type="Thumb" description="0 for single/first thumb, 1 for second range thumb" isDarkMode={dark} />
            <PropRow name="data-dragging" type="Thumb" description="Present when thumb is being dragged" isDarkMode={dark} />
            <PropRow name="data-disabled" type="Thumb" description="Present on disabled thumbs" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ── Accessibility ────────────────────────────────────────────── */}
      <Section title="Accessibility" description="Built-in accessibility features." isDarkMode={dark}>
        <div className={c.card}>
          <div className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {[
              'Each thumb renders role="slider" with aria-valuenow, aria-valuemin, and aria-valuemax',
              "aria-label per thumb provides an accessible name for screen readers",
              "Full keyboard control for value adjustment",
              'aria-orientation is set to match the orientation prop ("horizontal" or "vertical")',
              "Label is linked via aria-labelledby when provided",
              "Error message is linked via aria-describedby for screen reader announcements",
              "Hidden inputs are rendered for native form submission when name is set",
              "Range sliders render two separate slider roles — one per thumb",
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span className={`mt-0.5 shrink-0 ${dark ? "text-emerald-400" : "text-emerald-600"}`}>&#10003;</span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
        <div className={`${c.card} mt-3`}>
          <p className={`text-xs font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}>
            Keyboard Reference
          </p>
          <div className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {[
              ["Arrow Left / Down", "Decrease value by one step"],
              ["Arrow Right / Up", "Increase value by one step"],
              ["Home", "Set to minimum value"],
              ["End", "Set to maximum value"],
              ["Page Up", "Increase by larger step (10x)"],
              ["Page Down", "Decrease by larger step (10x)"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={c.kbd}>{key}</kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `value` with `onValueChange` for controlled mode, or `defaultValue` for uncontrolled. Pass a number for single-thumb, or a [number, number] tuple for range mode. Use `onValueCommit` to fire only when the user finishes dragging — useful for debounced API calls."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "When min equals max, the slider renders but is non-interactive.",
          "Steps that don't divide evenly into (max - min) still work — the last step snaps to max.",
          "Range mode: if minStepsBetweenThumbs pushes a thumb past min/max, it clamps at the boundary.",
          "Vertical sliders need an explicit height via style or classes (default wrapper is 200px).",
          "Touch events work via Pointer Events API — no separate touch handling needed.",
          "Tooltip positioning in vertical mode shifts to the left side of the thumb.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Pair every slider with a visible label or aria-label.",
          "Use formatTooltip to provide meaningful value context (e.g. '$50', '22°C').",
          "Set minStepsBetweenThumbs in range mode to prevent overlapping selections.",
          "Use onValueCommit for expensive operations (API calls, persistence).",
          "Add marks for key reference values (min, max, common choices).",
        ]}
        donts={[
          "Do not use a slider for precise numeric input — pair with an input field instead.",
          "Do not hide the value when it's critical — use tooltipAlways or adjacent display.",
          "Do not use step values so large that only 2-3 positions exist — use radio/segmented instead.",
          "Do not forget to set height on vertical sliders.",
        ]}
      />
    </div>
  );
};

export default SliderDemo;
