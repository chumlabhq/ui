import { useState } from "react";
import { Switch } from "../../components/Switch";
import { Section, ComponentHeader } from "./components";

const CheckIcon = () => (
  <svg
    className="w-2.5 h-2.5 text-blue-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg
    className="w-2.5 h-2.5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SunIcon = () => (
  <svg
    className="w-2.5 h-2.5 text-amber-500"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="w-2.5 h-2.5 text-indigo-400"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
  </svg>
);

const containerStyle = "flex items-center gap-3";
const labelContainerStyle = "flex flex-col";
const labelStyle = "text-sm font-medium text-gray-700";
const descriptionStyle = "text-xs text-gray-500";
const trackerStyle = "relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer";
const thumbStyle = "inline-flex items-center justify-center h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200";
const checkedTrackerStyle = "bg-blue-600";
const uncheckedTrackerStyle = "bg-gray-300";
const checkedThumbStyle = "translate-x-4.5";
const uncheckedThumbStyle = "translate-x-0.5";

const SwitchDemo = () => {
  const [basicSwitch, setBasicSwitch] = useState(false);
  const [labelSwitch, setLabelSwitch] = useState(true);
  const [descSwitch, setDescSwitch] = useState(false);
  const [iconSwitch, setIconSwitch] = useState(true);
  const [customSwitch, setCustomSwitch] = useState(false);
  const [themeSwitch, setThemeSwitch] = useState(false);

  return (
    <>
      <ComponentHeader
        title="Switch"
        description="A toggle switch component for binary on/off states."
      />

      <Section title="Basic Switch">
        <Switch
          isChecked={basicSwitch}
          handleToggle={() => setBasicSwitch(!basicSwitch)}
          containerClassName={containerStyle}
          trackerClassName={trackerStyle}
          thumbClassName={thumbStyle}
          checkedTrackerClassName={checkedTrackerStyle}
          uncheckedTrackerClassName={uncheckedTrackerStyle}
          checkedThumbClassName={checkedThumbStyle}
          uncheckedThumbClassName={uncheckedThumbStyle}
        />
      </Section>

      <Section title="With Label">
        <Switch
          label="Enable notifications"
          isChecked={labelSwitch}
          handleToggle={() => setLabelSwitch(!labelSwitch)}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          trackerClassName={trackerStyle}
          thumbClassName={thumbStyle}
          checkedTrackerClassName={checkedTrackerStyle}
          uncheckedTrackerClassName={uncheckedTrackerStyle}
          checkedThumbClassName={checkedThumbStyle}
          uncheckedThumbClassName={uncheckedThumbStyle}
        />
      </Section>

      <Section title="With Label and Description">
        <Switch
          label="Dark mode"
          description="Enable dark theme for the application"
          isChecked={descSwitch}
          handleToggle={() => setDescSwitch(!descSwitch)}
          containerClassName="flex items-center gap-4"
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          descriptionClassName={descriptionStyle}
          trackerClassName={trackerStyle}
          thumbClassName={thumbStyle}
          checkedTrackerClassName={checkedTrackerStyle}
          uncheckedTrackerClassName={uncheckedTrackerStyle}
          checkedThumbClassName={checkedThumbStyle}
          uncheckedThumbClassName={uncheckedThumbStyle}
        />
      </Section>

      <Section title="With Icons">
        <Switch
          label="Feature enabled"
          isChecked={iconSwitch}
          handleToggle={() => setIconSwitch(!iconSwitch)}
          checkedIcon={<CheckIcon />}
          uncheckedIcon={<CrossIcon />}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          trackerClassName={trackerStyle}
          thumbClassName={thumbStyle}
          checkedTrackerClassName={checkedTrackerStyle}
          uncheckedTrackerClassName={uncheckedTrackerStyle}
          checkedThumbClassName={checkedThumbStyle}
          uncheckedThumbClassName={uncheckedThumbStyle}
        />
      </Section>

      <Section title="Dark Mode / Light Mode Toggle">
        <Switch
          label="Theme"
          description={themeSwitch ? "Dark mode enabled" : "Light mode enabled"}
          isChecked={themeSwitch}
          handleToggle={() => setThemeSwitch(!themeSwitch)}
          checkedIcon={<MoonIcon />}
          uncheckedIcon={<SunIcon />}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          descriptionClassName={descriptionStyle}
          trackerClassName={trackerStyle}
          thumbClassName={thumbStyle}
          checkedTrackerClassName="bg-indigo-600"
          uncheckedTrackerClassName="bg-amber-400"
          checkedThumbClassName={checkedThumbStyle}
          uncheckedThumbClassName={uncheckedThumbStyle}
        />
      </Section>

      <Section title="Disabled States">
        <Switch
          label="Disabled (off)"
          isChecked={false}
          disabled
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={`${labelStyle} text-gray-400`}
          trackerClassName={`${trackerStyle} cursor-not-allowed opacity-50`}
          thumbClassName={thumbStyle}
          uncheckedTrackerClassName="bg-gray-200"
          uncheckedThumbClassName={uncheckedThumbStyle}
        />
        <Switch
          label="Disabled (on)"
          isChecked={true}
          disabled
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={`${labelStyle} text-gray-400`}
          trackerClassName={`${trackerStyle} cursor-not-allowed opacity-50`}
          thumbClassName={thumbStyle}
          checkedTrackerClassName="bg-blue-400"
          checkedThumbClassName={checkedThumbStyle}
        />
      </Section>

      <Section title="Custom Styling">
        <Switch
          label="Custom colors"
          isChecked={customSwitch}
          handleToggle={() => setCustomSwitch(!customSwitch)}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-sm font-semibold text-purple-700"
          trackerClassName={trackerStyle}
          thumbClassName={`${thumbStyle} shadow-lg`}
          checkedTrackerClassName="bg-purple-600"
          uncheckedTrackerClassName="bg-purple-200"
          checkedThumbClassName={checkedThumbStyle}
          uncheckedThumbClassName={uncheckedThumbStyle}
        />
      </Section>

      <Section title="Switch Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Prop</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Default</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Label text for the switch</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">description</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Description text below the label</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">isChecked</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Whether the switch is on</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">handleToggle</td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Callback when switch is toggled</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">id</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">auto-generated</td>
                <td className="py-2 text-gray-600">Custom ID for the switch element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Whether the switch is disabled</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">checkedIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Icon to show when checked</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">uncheckedIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Icon to show when unchecked</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Switch Styling Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Prop</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">containerClassName</td>
                <td className="py-2 text-gray-600">CSS class for the outer container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">labelContainerClassName</td>
                <td className="py-2 text-gray-600">CSS class for label/description wrapper</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">labelClassName</td>
                <td className="py-2 text-gray-600">CSS class for the label</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">descriptionClassName</td>
                <td className="py-2 text-gray-600">CSS class for the description</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">trackerClassName</td>
                <td className="py-2 text-gray-600">Base CSS class for the switch track</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">thumbClassName</td>
                <td className="py-2 text-gray-600">Base CSS class for the switch thumb</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">checkedTrackerClassName</td>
                <td className="py-2 text-gray-600">CSS class for track when checked</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">uncheckedTrackerClassName</td>
                <td className="py-2 text-gray-600">CSS class for track when unchecked</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">checkedThumbClassName</td>
                <td className="py-2 text-gray-600">CSS class for thumb when checked</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">uncheckedThumbClassName</td>
                <td className="py-2 text-gray-600">CSS class for thumb when unchecked</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default SwitchDemo;
