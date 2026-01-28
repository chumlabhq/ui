import { useState } from "react";
import { Checkbox } from "../../components/Checkbox";
import { Section, ComponentHeader } from "./components";

const HeartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const EmptyHeartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const PauseIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const containerStyle = "flex items-start gap-3";
const labelContainerStyle = "flex flex-col";
const labelStyle = "text-sm font-medium text-gray-700";
const descriptionStyle = "text-xs text-gray-500";
const checkboxBaseStyle =
  "inline-flex items-center justify-center border-2 transition-colors cursor-pointer";
const checkboxStyle =
  "inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer";
const checkedStyle = "bg-blue-600 border-blue-600 text-white";
const uncheckedStyle = "bg-white border-gray-300";
const indeterminateStyle = "bg-blue-600 border-blue-600 text-white";
const iconStyle = "w-3 h-3";
const errorLabelStyle = "text-sm font-medium text-red-700";
const errorCheckboxStyle =
  "inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-pointer border-red-500";
const disabledCheckboxStyle =
  "inline-flex items-center justify-center w-5 h-5 border-2 rounded transition-colors cursor-not-allowed opacity-50";

const CheckboxDemo = () => {
  const [stateNotSelected, setStateNotSelected] = useState(false);
  const [stateSelected, setStateSelected] = useState(true);
  const [stateIndeterminate, setStateIndeterminate] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(true);

  const [basic, setBasic] = useState(false);
  const [withLabel, setWithLabel] = useState(true);
  const [withDescription, setWithDescription] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);
  const [customIcon, setCustomIcon] = useState(false);
  const [customStar, setCustomStar] = useState(true);
  const [error, setError] = useState(false);
  const [purple, setPurple] = useState(false);
  const [green, setGreen] = useState(true);

  const [sizeXs, setSizeXs] = useState(true);
  const [sizeSm, setSizeSm] = useState(true);
  const [sizeMd, setSizeMd] = useState(true);
  const [sizeLg, setSizeLg] = useState(true);
  const [sizeXl, setSizeXl] = useState(true);
  const [sizeCustom28, setSizeCustom28] = useState(true);
  const [sizeCustom40, setSizeCustom40] = useState(true);

  const [shapeSquare, setShapeSquare] = useState(true);
  const [shapeRounded, setShapeRounded] = useState(true);
  const [shapeCircle, setShapeCircle] = useState(true);

  const [comboSmSquare, setComboSmSquare] = useState(true);
  const [comboMdRounded, setComboMdRounded] = useState(true);
  const [comboLgCircle, setComboLgCircle] = useState(true);
  const [comboXlCircle, setComboXlCircle] = useState(true);

  const [customRoundedLg, setCustomRoundedLg] = useState(true);
  const [customRoundedXl, setCustomRoundedXl] = useState(true);

  const [uncheckedIconDemo, setUncheckedIconDemo] = useState(false);
  const [indeterminateIconDemo, setIndeterminateIconDemo] = useState(false);
  const [isIndeterminateCustom, setIsIndeterminateCustom] = useState(true);

  const [sizeClassNameDemo, setSizeClassNameDemo] = useState(true);

  const [formCheckbox1, setFormCheckbox1] = useState(false);
  const [formCheckbox2, setFormCheckbox2] = useState(true);

  return (
    <>
      <ComponentHeader
        title="Checkbox"
        description="A customizable checkbox component with support for labels, descriptions, icons, and various states."
      />

      <Section title="Checkbox States">
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-center gap-3">
            <Checkbox
              checked={stateNotSelected}
              onChange={(checked) => setStateNotSelected(checked)}
              size="xl"
              shape="rounded"
              checkboxClassName={checkboxBaseStyle}
              checkedClassName={checkedStyle}
              uncheckedClassName={uncheckedStyle}
            />
            <span className="text-base font-medium text-gray-700">Not selected</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Checkbox
              checked={stateSelected}
              onChange={(checked) => setStateSelected(checked)}
              size="xl"
              shape="rounded"
              checkboxClassName={checkboxBaseStyle}
              checkedClassName={checkedStyle}
              uncheckedClassName={uncheckedStyle}
            />
            <span className="text-base font-medium text-gray-700">Selected</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Checkbox
              checked={stateIndeterminate}
              indeterminate={isIndeterminate}
              onChange={() => {
                if (isIndeterminate) {
                  setIsIndeterminate(false);
                  setStateIndeterminate(true);
                } else if (stateIndeterminate) {
                  setStateIndeterminate(false);
                } else {
                  setIsIndeterminate(true);
                }
              }}
              size="xl"
              shape="rounded"
              checkboxClassName={checkboxBaseStyle}
              checkedClassName={checkedStyle}
              uncheckedClassName={uncheckedStyle}
              indeterminateClassName={indeterminateStyle}
            />
            <span className="text-base font-medium text-gray-700">Intermediate</span>
          </div>
        </div>
      </Section>

      <Section title="Basic Checkbox">
        <Checkbox
          checked={basic}
          onChange={(checked) => setBasic(checked)}
          checkboxClassName={checkboxStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
          iconClassName={iconStyle}
        />
      </Section>

      <Section title="With Label">
        <Checkbox
          label="Accept terms and conditions"
          checked={withLabel}
          onChange={(checked) => setWithLabel(checked)}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
          iconClassName={iconStyle}
        />
      </Section>

      <Section title="With Label and Description">
        <Checkbox
          label="Email notifications"
          description="Receive email updates about your account activity"
          checked={withDescription}
          onChange={(checked) => setWithDescription(checked)}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          descriptionClassName={descriptionStyle}
          checkboxClassName={checkboxStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
          iconClassName={iconStyle}
        />
      </Section>

      <Section title="Required">
        <Checkbox
          label="I agree to the privacy policy"
          required
          checked={false}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxStyle}
          uncheckedClassName={uncheckedStyle}
          iconClassName={iconStyle}
        />
      </Section>

      <Section title="Indeterminate State">
        <Checkbox
          label="Select all items"
          indeterminate={indeterminate}
          checked={false}
          onChange={() => setIndeterminate(!indeterminate)}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
          indeterminateClassName={indeterminateStyle}
          iconClassName={iconStyle}
        />
      </Section>

      <Section title="Custom Icons">
        <Checkbox
          label="Add to favorites"
          checked={customIcon}
          onChange={(checked) => setCustomIcon(checked)}
          checkedIcon={<HeartIcon className="w-3 h-3 text-white" />}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxStyle}
          checkedClassName="bg-red-500 border-red-500 text-white"
          uncheckedClassName={uncheckedStyle}
          iconClassName={iconStyle}
        />
        <Checkbox
          label="Star this item"
          checked={customStar}
          onChange={(checked) => setCustomStar(checked)}
          checkedIcon={<StarIcon className="w-3 h-3 text-white" />}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxStyle}
          checkedClassName="bg-yellow-500 border-yellow-500 text-white"
          uncheckedClassName={uncheckedStyle}
          iconClassName={iconStyle}
        />
      </Section>

      <Section title="Custom Unchecked Icon">
        <Checkbox
          label="Add to wishlist"
          checked={uncheckedIconDemo}
          onChange={(checked) => setUncheckedIconDemo(checked)}
          checkedIcon={<HeartIcon className="w-3 h-3 text-white" />}
          uncheckedIcon={<EmptyHeartIcon className="w-3 h-3 text-gray-400" />}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxStyle}
          checkedClassName="bg-red-500 border-red-500 text-white"
          uncheckedClassName="bg-white border-gray-300"
        />
      </Section>

      <Section title="Custom Indeterminate Icon">
        <Checkbox
          label="Partial selection (custom pause icon)"
          indeterminate={isIndeterminateCustom}
          checked={indeterminateIconDemo}
          onChange={() => {
            if (isIndeterminateCustom) {
              setIsIndeterminateCustom(false);
              setIndeterminateIconDemo(true);
            } else if (indeterminateIconDemo) {
              setIndeterminateIconDemo(false);
            } else {
              setIsIndeterminateCustom(true);
            }
          }}
          indeterminateIcon={<PauseIcon className="w-3 h-3 text-white" />}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
          indeterminateClassName="bg-amber-500 border-amber-500 text-white"
          iconClassName={iconStyle}
        />
      </Section>

      <Section title="Disabled States">
        <Checkbox
          label="Disabled unchecked"
          checked={false}
          disabled
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-sm font-medium text-gray-400"
          checkboxClassName={disabledCheckboxStyle}
          uncheckedClassName="bg-gray-100 border-gray-200"
          iconClassName={iconStyle}
        />
        <Checkbox
          label="Disabled checked"
          checked={true}
          disabled
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-sm font-medium text-gray-400"
          checkboxClassName={disabledCheckboxStyle}
          checkedClassName="bg-blue-400 border-blue-400 text-white"
          iconClassName={iconStyle}
        />
      </Section>

      <Section title="Error State">
        <Checkbox
          label="Accept terms to continue"
          checked={error}
          onChange={(checked) => setError(checked)}
          error
          errorMessage="You must accept the terms to continue"
          containerClassName="flex flex-col gap-1"
          className={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={errorLabelStyle}
          checkboxClassName={errorCheckboxStyle}
          checkedClassName="bg-red-500 border-red-500 text-white"
          uncheckedClassName="bg-white"
          iconClassName={iconStyle}
          errorClassName="text-sm text-red-500 ml-7"
        />
      </Section>

      <Section title="Custom Colors">
        <Checkbox
          label="Purple theme"
          checked={purple}
          onChange={(checked) => setPurple(checked)}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-sm font-medium text-purple-700"
          checkboxClassName={checkboxStyle}
          checkedClassName="bg-purple-600 border-purple-600 text-white"
          uncheckedClassName="bg-white border-purple-300"
          iconClassName={iconStyle}
        />
        <Checkbox
          label="Green theme"
          checked={green}
          onChange={(checked) => setGreen(checked)}
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-sm font-medium text-green-700"
          checkboxClassName={checkboxStyle}
          checkedClassName="bg-green-600 border-green-600 text-white"
          uncheckedClassName="bg-white border-green-300"
          iconClassName={iconStyle}
        />
      </Section>

      <Section title="Sizes (Predefined)">
        <Checkbox
          label="Extra Small (xs)"
          checked={sizeXs}
          onChange={(checked) => setSizeXs(checked)}
          size="xs"
          shape="rounded"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-xs font-medium text-gray-700"
          checkboxClassName={checkboxBaseStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
        />
        <Checkbox
          label="Small (sm)"
          checked={sizeSm}
          onChange={(checked) => setSizeSm(checked)}
          size="sm"
          shape="rounded"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-sm font-medium text-gray-700"
          checkboxClassName={checkboxBaseStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
        />
        <Checkbox
          label="Medium (md)"
          checked={sizeMd}
          onChange={(checked) => setSizeMd(checked)}
          size="md"
          shape="rounded"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxBaseStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
        />
        <Checkbox
          label="Large (lg)"
          checked={sizeLg}
          onChange={(checked) => setSizeLg(checked)}
          size="lg"
          shape="rounded"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-base font-medium text-gray-700"
          checkboxClassName={checkboxBaseStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
        />
        <Checkbox
          label="Extra Large (xl)"
          checked={sizeXl}
          onChange={(checked) => setSizeXl(checked)}
          size="xl"
          shape="rounded"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-lg font-medium text-gray-700"
          checkboxClassName={checkboxBaseStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
        />
      </Section>

      <Section title="Custom Size (Numeric)">
        <Checkbox
          label="28px custom size"
          checked={sizeCustom28}
          onChange={(checked) => setSizeCustom28(checked)}
          size={28}
          shape="rounded"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxBaseStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
        />
        <Checkbox
          label="40px custom size"
          checked={sizeCustom40}
          onChange={(checked) => setSizeCustom40(checked)}
          size={40}
          shape="rounded"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-lg font-medium text-gray-700"
          checkboxClassName={checkboxBaseStyle}
          checkedClassName="bg-indigo-600 border-indigo-600 text-white"
          uncheckedClassName={uncheckedStyle}
        />
      </Section>

      <Section title="Custom Size via sizeClassName">
        <Checkbox
          label="Size via Tailwind class (w-6 h-6)"
          checked={sizeClassNameDemo}
          onChange={(checked) => setSizeClassNameDemo(checked)}
          shape="rounded"
          sizeClassName="w-6 h-6"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxBaseStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
          iconClassName="w-4 h-4"
        />
      </Section>

      <Section title="Shapes">
        <Checkbox
          label="Square"
          checked={shapeSquare}
          onChange={(checked) => setShapeSquare(checked)}
          size="md"
          shape="square"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxBaseStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
        />
        <Checkbox
          label="Rounded"
          checked={shapeRounded}
          onChange={(checked) => setShapeRounded(checked)}
          size="md"
          shape="rounded"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxBaseStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
        />
        <Checkbox
          label="Circle"
          checked={shapeCircle}
          onChange={(checked) => setShapeCircle(checked)}
          size="md"
          shape="circle"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxBaseStyle}
          checkedClassName={checkedStyle}
          uncheckedClassName={uncheckedStyle}
        />
      </Section>

      <Section title="Shapes with Different Sizes">
        <Checkbox
          label="Small Square"
          checked={comboSmSquare}
          onChange={(checked) => setComboSmSquare(checked)}
          size="sm"
          shape="square"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-sm font-medium text-gray-700"
          checkboxClassName={checkboxBaseStyle}
          checkedClassName="bg-teal-600 border-teal-600 text-white"
          uncheckedClassName={uncheckedStyle}
        />
        <Checkbox
          label="Medium Rounded"
          checked={comboMdRounded}
          onChange={(checked) => setComboMdRounded(checked)}
          size="md"
          shape="rounded"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName={labelStyle}
          checkboxClassName={checkboxBaseStyle}
          checkedClassName="bg-orange-600 border-orange-600 text-white"
          uncheckedClassName={uncheckedStyle}
        />
        <Checkbox
          label="Large Circle"
          checked={comboLgCircle}
          onChange={(checked) => setComboLgCircle(checked)}
          size="lg"
          shape="circle"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-base font-medium text-gray-700"
          checkboxClassName={checkboxBaseStyle}
          checkedClassName="bg-pink-600 border-pink-600 text-white"
          uncheckedClassName={uncheckedStyle}
        />
        <Checkbox
          label="XL Circle"
          checked={comboXlCircle}
          onChange={(checked) => setComboXlCircle(checked)}
          size="xl"
          shape="circle"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-lg font-medium text-gray-700"
          checkboxClassName={checkboxBaseStyle}
          checkedClassName="bg-violet-600 border-violet-600 text-white"
          uncheckedClassName={uncheckedStyle}
        />
      </Section>

      <Section title="Custom Shape via shapeClassName">
        <Checkbox
          label="Custom rounded-lg"
          checked={customRoundedLg}
          onChange={(checked) => setCustomRoundedLg(checked)}
          size="lg"
          shapeClassName="rounded-lg"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-base font-medium text-gray-700"
          checkboxClassName={checkboxBaseStyle}
          checkedClassName="bg-cyan-600 border-cyan-600 text-white"
          uncheckedClassName={uncheckedStyle}
        />
        <Checkbox
          label="Custom rounded-xl"
          checked={customRoundedXl}
          onChange={(checked) => setCustomRoundedXl(checked)}
          size="xl"
          shapeClassName="rounded-xl"
          containerClassName={containerStyle}
          labelContainerClassName={labelContainerStyle}
          labelClassName="text-lg font-medium text-gray-700"
          checkboxClassName={checkboxBaseStyle}
          checkedClassName="bg-rose-600 border-rose-600 text-white"
          uncheckedClassName={uncheckedStyle}
        />
      </Section>

      <Section title="With id and name Props">
        <form className="flex flex-col gap-4">
          <Checkbox
            id="terms-checkbox"
            name="acceptTerms"
            label="I accept the terms and conditions"
            checked={formCheckbox1}
            onChange={(checked) => setFormCheckbox1(checked)}
            containerClassName={containerStyle}
            labelContainerClassName={labelContainerStyle}
            labelClassName={labelStyle}
            checkboxClassName={checkboxStyle}
            checkedClassName={checkedStyle}
            uncheckedClassName={uncheckedStyle}
            iconClassName={iconStyle}
          />
          <Checkbox
            id="newsletter-checkbox"
            name="subscribeNewsletter"
            label="Subscribe to newsletter"
            checked={formCheckbox2}
            onChange={(checked) => setFormCheckbox2(checked)}
            containerClassName={containerStyle}
            labelContainerClassName={labelContainerStyle}
            labelClassName={labelStyle}
            checkboxClassName={checkboxStyle}
            checkedClassName={checkedStyle}
            uncheckedClassName={uncheckedStyle}
            iconClassName={iconStyle}
          />
          <p className="text-xs text-gray-500 mt-2">
            Inspect the checkboxes to see custom <code className="bg-gray-100 px-1 rounded">id</code> and{" "}
            <code className="bg-gray-100 px-1 rounded">name</code> attributes
          </p>
        </form>
      </Section>

      <Section title="Checkbox Props">
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
                <td className="py-2 pr-4 font-mono text-blue-600">id</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">auto-generated</td>
                <td className="py-2 text-gray-600">Custom ID for the checkbox element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">name</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Name attribute for the checkbox</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">checked</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Whether the checkbox is checked</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">indeterminate</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Whether the checkbox is in indeterminate state</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onChange</td>
                <td className="py-2 pr-4 text-gray-600">(checked: boolean, event) =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Callback when checkbox state changes</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Label text for the checkbox</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">description</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Description text below the label</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Whether the checkbox is disabled</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">required</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Whether the checkbox is required</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">error</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Whether the checkbox is in error state</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">errorMessage</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Error message to display</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">size</td>
                <td className="py-2 pr-4 text-gray-600">"xs" | "sm" | "md" | "lg" | "xl" | number</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Checkbox size (predefined or custom pixel value)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">shape</td>
                <td className="py-2 pr-4 text-gray-600">"square" | "rounded" | "circle"</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Checkbox shape (border-radius)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">checkedIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">CheckIcon</td>
                <td className="py-2 text-gray-600">Custom icon when checked</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">uncheckedIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">null</td>
                <td className="py-2 text-gray-600">Custom icon when unchecked</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">indeterminateIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">MinusIcon</td>
                <td className="py-2 text-gray-600">Custom icon for indeterminate state</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Checkbox Styling Props">
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
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class for the label wrapper (checkbox + label)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">containerClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class for the outer container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">labelContainerClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class for label/description wrapper</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">labelClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class for the label text</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">descriptionClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class for the description text</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">checkboxClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Base CSS class for the checkbox box</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">checkedClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class applied when checkbox is checked</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">uncheckedClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class applied when checkbox is unchecked</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">indeterminateClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class applied when checkbox is indeterminate</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">iconClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class for the default icons</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">errorClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class for the error message</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">sizeClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class for custom size (overrides size prop styles)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">shapeClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">CSS class for custom shape (overrides shape prop)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Data Attributes">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Attribute</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Applied To</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">data-checked</td>
                <td className="py-2 pr-4 text-gray-600">container, checkbox span</td>
                <td className="py-2 text-gray-600">Present when checkbox is checked</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">data-indeterminate</td>
                <td className="py-2 pr-4 text-gray-600">container, checkbox span</td>
                <td className="py-2 text-gray-600">Present when checkbox is indeterminate</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">data-disabled</td>
                <td className="py-2 pr-4 text-gray-600">container, checkbox span</td>
                <td className="py-2 text-gray-600">Present when checkbox is disabled</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">data-error</td>
                <td className="py-2 pr-4 text-gray-600">container, checkbox span</td>
                <td className="py-2 text-gray-600">Present when checkbox has error</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">data-size</td>
                <td className="py-2 pr-4 text-gray-600">container, checkbox span</td>
                <td className="py-2 text-gray-600">Size value when using predefined sizes</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">data-shape</td>
                <td className="py-2 pr-4 text-gray-600">container, checkbox span</td>
                <td className="py-2 text-gray-600">Shape value (square, rounded, circle)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Size Reference">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Size</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Box Size</th>
                <th className="text-left py-2 font-medium text-gray-900">Icon Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">xs</td>
                <td className="py-2 pr-4 text-gray-600">14px</td>
                <td className="py-2 text-gray-600">10px</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">sm</td>
                <td className="py-2 pr-4 text-gray-600">16px</td>
                <td className="py-2 text-gray-600">12px</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">md</td>
                <td className="py-2 pr-4 text-gray-600">20px</td>
                <td className="py-2 text-gray-600">14px</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">lg</td>
                <td className="py-2 pr-4 text-gray-600">24px</td>
                <td className="py-2 text-gray-600">18px</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">xl</td>
                <td className="py-2 pr-4 text-gray-600">32px</td>
                <td className="py-2 text-gray-600">24px</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">number</td>
                <td className="py-2 pr-4 text-gray-600">Custom value</td>
                <td className="py-2 text-gray-600">60% of box size</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default CheckboxDemo;
