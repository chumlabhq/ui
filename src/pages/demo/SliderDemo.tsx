import type { SliderClasses } from "../../components/Slider/index.js";
import {
  useState } from "react";
import { Slider } from "../../components/Slider/index.js";
import type { SliderValue,
  SliderMark } from "../../components/Slider/index.js";
import { Button } from "../../components/Button/index.js";
import { useTheme } from "./ThemeContext.js";
import {
  DocsHero,
  Section,
  DemoWrapper,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
  ComponentDocs,
  ComponentAnatomy,
  CopyPasteBlock,
  SetupNote,
} from "./components/index.js";
import { FormDemo } from "./components/FormDemo.js";

const getClasses = () => ({
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  text: `text-sm text-cl-text-secondary`,
  textMuted: `text-xs text-cl-text-secondary`,
  badge: `inline-flex px-2 py-0.5 rounded text-xs font-mono tabular-nums bg-cl-bg-hover text-cl-text-chrome border border-cl-text/10`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
  slider: {
    root: "flex flex-col gap-2 w-full",
    label: `text-sm font-medium text-cl-text`,
    description: `text-xs text-cl-text-secondary`,
    track: `rounded-full bg-cl-bg-track`,
    range: "rounded-full bg-cl-accent",
    thumb: `absolute rounded-full bg-white shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg`,
  } satisfies SliderClasses,
});

const HeartIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-cl-accent">
    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-cl-warning">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const VolumeIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={`w-3 h-3`}>
    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10a7.971 7.971 0 00-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const SliderDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses();

  const [basic, setBasic] = useState(50);

  const [basic2, setBasic2] = useState(50);

  const [basic22, setBasic22] = useState(50);

  const [range, setRange] = useState<SliderValue>([25, 75]);
  const [stepped, setStepped] = useState(50);
  const [controlled, setControlled] = useState(30);
  const [volume, setVolume] = useState(65);
  const [volume2, setVolume2] = useState(65);
  const [price, setPrice] = useState<SliderValue>([200, 800]);
  const [price2, setPrice2] = useState<SliderValue>([200, 800]);
  const [temp, setTemp] = useState(22);
  const [opacity, setOpacity] = useState(80);
  const [animFast, setAnimFast] = useState(3);
  const [animDefault, setAnimDefault] = useState(3);
  const [animSlow, setAnimSlow] = useState(3);
  const [animOff, setAnimOff] = useState(3);
  const [custom1, setCustom1] = useState(50);
  const [custom2, setCustom2] = useState(3);
  const [custom22, setCustom22] = useState(3);
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
      <DocsHero
        title="Slider"
        description="A range input component supporting single and range values, discrete steps, marks with labels, value tooltips, custom thumb rendering, vertical orientation, and full keyboard navigation. Includes form integration with hidden inputs, label, error states, and the standard classes/unstyled system."
        code={`import { Slider } from "@chumlab/ui/slider";`}
      />

      <SetupNote />

      <ComponentAnatomy name="Slider" />

      <Section title="Basic Usage" description="Works out-of-the-box with built-in styles, dark mode, and keyboard navigation (arrow keys). No custom classes needed." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-col gap-6 w-full sm:max-w-sm">
            {}
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

      <Section title="Range Slider" description="Pass a [number, number] tuple as value for two-thumb range selection." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-sm space-y-3">
            <Slider value={range} onValueChange={setRange} classes={c.slider} />
            <div className={c.text}>
              Range: <span className={c.badge}>{(range as [number, number])[0]}</span> – <span className={c.badge}>{(range as [number, number])[1]}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      <Section title="Label & Description" description="Form-integrated slider with label, description, and error state." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-8 w-full sm:max-w-sm">
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

      <Section title="Steps" description="Discrete step increments snap the thumb to fixed values." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-8 w-full sm:max-w-sm">
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

      <Section title="Marks" description="Visual tick marks with optional labels along the track. Customise dot size, style, or use renderMark for fully custom dots." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-12 w-full sm:max-w-md">
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
                  mark: `rounded-full bg-cl-bg-hover`,
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
                        ? ("var(--cl-accent)")
                        : ("var(--cl-bg-track)"),
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
                        ? ("var(--cl-accent)")
                        : ("var(--cl-bg-track)"),
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

      {/* ── Click-to-jump animation ──────────────────────────────────── */}
      <Section
        title="Click-to-Jump Animation"
        description="Use transitionDuration (ms) to control how fast the thumb glides when the user clicks a mark or any point on the track. Set to 0 to disable. The animation is automatically suppressed during an active drag so dragging stays responsive."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-col gap-6 w-full sm:max-w-sm">
            <div className="space-y-1">
              <span className={c.label}>transitionDuration={"{100}"} (snappy)</span>
              <Slider
                value={animFast}
                onValueChange={(v) => setAnimFast(v as number)}
                animationDuration={100}
                marks={ratingMarks}
                min={1}
                max={5}
                step={1}
                classes={c.slider}
              />
            </div>
            <div className="space-y-1">
              <span className={c.label}>transitionDuration={"{200}"} (default)</span>
              <Slider
                value={animDefault}
                onValueChange={(v) => setAnimDefault(v as number)}
                marks={ratingMarks}
                min={1}
                max={5}
                step={1}
                classes={c.slider}
              />
            </div>
            <div className="space-y-1">
              <span className={c.label}>transitionDuration={"{600}"} (relaxed)</span>
              <Slider
                value={animSlow}
                onValueChange={(v) => setAnimSlow(v as number)}
                animationDuration={600}
                marks={ratingMarks}
                min={1}
                max={5}
                step={1}
                classes={c.slider}
              />
            </div>
            <div className="space-y-1">
              <span className={c.label}>transitionDuration={"{0}"} (instant)</span>
              <Slider
                value={animOff}
                onValueChange={(v) => setAnimOff(v as number)}
                animationDuration={0}
                marks={ratingMarks}
                min={1}
                max={5}
                step={1}
                classes={c.slider}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      <Section title="Tooltip" description="Show a value tooltip on hover/drag, or always. Use formatTooltip for custom display." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-10 w-full sm:max-w-sm">
            <div className="space-y-1">
              <span className={c.label}>On hover/drag</span>
              <Slider value={basic2} onValueChange={(v) => setBasic2(v as number)} showTooltip classes={c.slider} />
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

      <Section title="Custom Thumb" description="Use renderThumb to render icons, images, or any content inside the thumb." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-10 w-full sm:max-w-sm">
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
                  thumb: `absolute rounded-full bg-white border-2 border-cl-border-input-focus shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg`,
                  range: "rounded-full bg-cl-accent/90",
                }}
                showTooltip
              />
            </div>
            <div className="space-y-1">
              <span className={c.label}>Star rating</span>
              <Slider
                value={custom22}
                onValueChange={(v) => setCustom22(v as number)}
                min={1}
                max={5}
                step={1}
                renderThumb={() => (
                  <div className="flex items-center justify-center w-full h-full"><StarIcon /></div>
                )}
                classes={{
                  ...c.slider,
                  thumb: `absolute rounded-full bg-white border-2 border-cl-warning shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-warning focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg`,
                  range: "rounded-full bg-cl-warning/30",
                }}
                showTooltip
                formatTooltip={(v) => `${v} star${v !== 1 ? "s" : ""}`}
              />
            </div>
            <div className="space-y-1">
              <span className={c.label}>Volume icon</span>
              <Slider
                value={volume2}
                onValueChange={(v) => setVolume2(v as number)}
                renderThumb={() => (
                  <div className={`flex items-center justify-center w-full h-full text-cl-accent`}>
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
                value={basic22}
                onValueChange={(v) => setBasic22(v as number)}
                renderThumb={({ value: v }) => (
                  <div className="flex items-center justify-center w-full h-full text-xs">
                    {v < 30 ? "\u{1F61E}" : v < 70 ? "\u{1F610}" : "\u{1F60A}"}
                  </div>
                )}
                classes={{
                  ...c.slider,
                  thumb: `absolute rounded-full bg-white border border-cl-border-input shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg`,
                }}
                showTooltip
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      <Section title="Min Steps Between Thumbs" description="Enforce a minimum distance between range thumbs." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-sm space-y-3">
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

      <Section title="Controlled" description="Fully controlled via value and onValueChange. External buttons can set the value." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-sm space-y-4">
            <Slider value={controlled} onValueChange={(v) => setControlled(v as number)} classes={c.slider} showTooltip />
            <div className="flex gap-2 flex-wrap">
              {[0, 25, 50, 75, 100].map((v) => (
                <Button
                  key={v}
                  size="sm"
                  className={
                    controlled === v
                      ? "rounded-cl-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90"
                      : "rounded-cl-md bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover"
                  }
                  onClick={() => setControlled(v)}
                >
                  {v}
                </Button>
              ))}
            </div>
            <div className={c.text}>Value: <span className={c.badge}>{controlled}</span></div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Uncontrolled ─────────────────────────────────────────────── */}
      <Section title="Uncontrolled (defaultValue)" description="Use defaultValue for uncontrolled mode. The slider manages its own state." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-sm">
            <Slider defaultValue={40} classes={c.slider} showTooltip />
          </div>
        </DemoWrapper>
      </Section>

      <Section title="onValueCommit" description="Fires only when the user finishes dragging (pointer up). Useful for debounced API calls." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-sm space-y-3">
            <Slider
              value={commitVal}
              onValueChange={(v) => setCommitVal(v as number)}
              onValueCommit={(v) => setLastCommit(v as number)}
              classes={c.slider}
              showTooltip
            />
            <div className={c.text}>
              Live: <span className={c.badge}>{commitVal}</span>{" "}
              Committed: <span className={c.badge} data-demo-action>{lastCommit}</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      <Section title="Disabled" description="The slider is non-interactive when disabled." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-6 w-full sm:max-w-sm">
            <Slider value={50} disabled classes={c.slider} />
            <Slider value={[20, 80]} disabled classes={c.slider} />
          </div>
        </DemoWrapper>
      </Section>

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

      <Section title="Loading State" description="Show a loading state while the value is being saved." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Slider label="Saving preference..." defaultValue={50} loading classes={c.slider} />
        </DemoWrapper>
      </Section>

      <Section title="Vertical" description="Set orientation to 'vertical' for a vertical slider." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-wrap items-end gap-10 h-52">
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

      <Section title="Inverted" description="Reverse the slider direction with the inverted prop." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-sm space-y-3">
            <Slider value={invertedVal} onValueChange={(v) => setInvertedVal(v as number)} inverted showTooltip classes={c.slider} />
            <div className={c.textMuted}>Inverted — Value: {invertedVal}</div>
          </div>
        </DemoWrapper>
      </Section>

      <Section title="Color Variants" description="Override the range and thumb classes for custom colors." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-6 w-full sm:max-w-sm">
            {[
              { range: "bg-cl-success", border: "border-cl-success", ring: "ring-cl-success", name: "Emerald", val: 65 },
              { range: "bg-cl-accent", border: "border-cl-border-input-focus", ring: "ring-cl-accent", name: "Rose", val: 45 },
              { range: "bg-cl-warning", border: "border-cl-warning", ring: "ring-cl-warning", name: "Amber", val: 80 },
              { range: "bg-cl-accent", border: "border-cl-border-input-focus", ring: "ring-cl-accent", name: "Cyan", val: 30 },
            ].map(({ range: rangeCls, border, ring, name, val }) => (
              <div key={name} className="space-y-1">
                <span className={c.label}>{name}</span>
                <Slider
                  defaultValue={val}
                  classes={{
                    ...c.slider,
                    range: `rounded-full ${rangeCls}`,
                    thumb: `absolute rounded-full bg-white ${border} shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:${ring} focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg`,
                  }}
                />
              </div>
            ))}
          </div>
        </DemoWrapper>
      </Section>

      <Section title="Custom Styling" description="Full control via the classes prop. Every part of the slider is customisable." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-6 w-full sm:max-w-sm">
            {/* Rounded rectangle thumb */}
            <div className="space-y-1">
              <span className={c.label}>Rounded rectangle thumb</span>
              <Slider
                defaultValue={60}
                classes={{
                  ...c.slider,
                  thumb: `absolute rounded-cl-md bg-cl-accent shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg`,
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
                  track: `rounded-full h-3 bg-cl-bg-hover`,
                  range: "rounded-full bg-gradient-to-r from-cl-accent/150 to-cl-accent",
                  control: "relative select-none touch-none py-1",
                }}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="In a form"
        description="A real form: the field with name and required, Submit and Reset, and the FormData the browser built, read back."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <FormDemo onEmpty="A Slider always holds a value, so required never blocks the submit. A range submits price[0] and price[1].">
            <Slider name="price" label="Price" min={0} max={100} defaultValue={[20, 80]} required />
          </FormDemo>
        </DemoWrapper>
      </Section>

      {/* ── Real World: Price Range ──────────────────────────────────── */}
      <Section title="Real World — Price Range Filter" description="A practical example: filtering products by price range with formatted tooltip." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-md space-y-4">
            <Slider
              label="Price Range"
              value={price2}
              onValueChange={setPrice2}
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

      <ComponentDocs name="Slider" />

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

      <CopyPasteBlock name="Slider" />
    </div>
  );
};

export default SliderDemo;
