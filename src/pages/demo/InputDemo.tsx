import { Input } from "../../components/Input";
import { Section, ComponentHeader, SearchIcon, ArrowRightIcon, CloseIcon } from "./components";

const InputDemo = () => {
  const inputStyles =
    "w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400";
  const inputWrapperStyles =
    "px-3 py-2 rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 gap-2";
  const inputWrapperErrorStyles =
    "px-3 py-2 rounded-lg border border-red-500 bg-white focus-within:ring-2 focus-within:ring-red-500 gap-2";
  const inputErrorStyles =
    "w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400";
  const inputDisabledStyles =
    "w-full bg-transparent outline-none text-gray-400 placeholder:text-gray-300 cursor-not-allowed";
  const labelStyles = "text-sm font-medium text-gray-700";

  return (
    <>
      <ComponentHeader
        title="Input"
        description="A flexible, accessible input component for your design system."
      />

      <Section title="Basic Input">
        <Input
          placeholder="Enter text..."
          className={inputStyles}
          wrapperClassName={inputWrapperStyles}
        />
      </Section>

      <Section title="With Label">
        <Input
          label="Email"
          placeholder="you@example.com"
          type="email"
          className={inputStyles}
          wrapperClassName={inputWrapperStyles}
          labelClassName={labelStyles}
          containerClassName="flex flex-col gap-1"
        />
        <Input
          label="Password"
          placeholder="Enter password"
          type="password"
          required
          className={inputStyles}
          wrapperClassName={inputWrapperStyles}
          labelClassName={labelStyles}
          containerClassName="flex flex-col gap-1"
        />
      </Section>

      <Section title="With Icons">
        <Input
          placeholder="Search..."
          leadingIcon={<SearchIcon />}
          className={inputStyles}
          wrapperClassName={inputWrapperStyles}
        />
        <Input
          placeholder="Enter amount"
          trailingIcon={<ArrowRightIcon />}
          className={inputStyles}
          wrapperClassName={inputWrapperStyles}
        />
        <Input
          placeholder="Search and go"
          leadingIcon={<SearchIcon />}
          trailingIcon={<ArrowRightIcon />}
          className={inputStyles}
          wrapperClassName={inputWrapperStyles}
        />
      </Section>

      <Section title="Clickable Icons">
        <Input
          placeholder="Search..."
          leadingIcon={<SearchIcon />}
          onLeadingIconClick={() => alert("Search clicked!")}
          trailingIcon={<CloseIcon />}
          onTrailingIconClick={() => alert("Clear clicked!")}
          className={inputStyles}
          wrapperClassName={inputWrapperStyles}
        />
      </Section>

      <Section title="Error State">
        <Input
          label="Email"
          placeholder="you@example.com"
          error
          errorMessage="Please enter a valid email address"
          className={inputErrorStyles}
          wrapperClassName={inputWrapperErrorStyles}
          labelClassName={labelStyles}
          errorClassName="text-sm text-red-500 mt-1"
          containerClassName="flex flex-col gap-1"
        />
      </Section>

      <Section title="Loading State">
        <Input
          placeholder="Loading..."
          isLoading
          className={inputStyles}
          wrapperClassName={inputWrapperStyles}
        />
        <Input
          placeholder="Custom loader size"
          isLoading
          loaderSize={20}
          className={inputStyles}
          wrapperClassName={inputWrapperStyles}
        />
        <Input
          placeholder="Custom loader component"
          isLoading
          loader={
            <span className="text-xs text-blue-500 animate-pulse">Loading...</span>
          }
          className={inputStyles}
          wrapperClassName={inputWrapperStyles}
        />
      </Section>

      <Section title="Disabled">
        <Input
          placeholder="Disabled input"
          disabled
          className={inputDisabledStyles}
          wrapperClassName={inputWrapperStyles}
        />
      </Section>

      <Section title="Full Width">
        <div className="w-full">
          <Input
            placeholder="Full width input"
            fullWidth
            className={inputStyles}
            wrapperClassName={inputWrapperStyles}
          />
        </div>
      </Section>

      <Section title="Different Input Types">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            className={inputStyles}
            wrapperClassName={inputWrapperStyles}
            labelClassName={labelStyles}
            containerClassName="flex flex-col gap-1"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            className={inputStyles}
            wrapperClassName={inputWrapperStyles}
            labelClassName={labelStyles}
            containerClassName="flex flex-col gap-1"
          />
          <Input
            label="Number"
            type="number"
            placeholder="0"
            className={inputStyles}
            wrapperClassName={inputWrapperStyles}
            labelClassName={labelStyles}
            containerClassName="flex flex-col gap-1"
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className={inputStyles}
            wrapperClassName={inputWrapperStyles}
            labelClassName={labelStyles}
            containerClassName="flex flex-col gap-1"
          />
          <Input
            label="URL"
            type="url"
            placeholder="https://example.com"
            className={inputStyles}
            wrapperClassName={inputWrapperStyles}
            labelClassName={labelStyles}
            containerClassName="flex flex-col gap-1"
          />
          <Input
            label="Date"
            type="date"
            className={inputStyles}
            wrapperClassName={inputWrapperStyles}
            labelClassName={labelStyles}
            containerClassName="flex flex-col gap-1"
          />
        </div>
      </Section>

      <Section title="Custom Theme Examples">
        <p className="text-sm text-gray-600 mb-4">
          Customize the input appearance to match your design system.
        </p>
        <div className="flex flex-wrap gap-6">
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Dark Theme:</p>
            <Input
              placeholder="Enter text..."
              className="w-full bg-transparent outline-none text-white placeholder:text-gray-400"
              wrapperClassName="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 focus-within:ring-2 focus-within:ring-gray-500 gap-2"
            />
          </div>
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Rounded Pill:</p>
            <Input
              placeholder="Search..."
              leadingIcon={<SearchIcon />}
              className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              wrapperClassName="px-4 py-2 rounded-full border border-gray-300 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white gap-2"
            />
          </div>
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Underline Style:</p>
            <Input
              placeholder="Enter text..."
              className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              wrapperClassName="px-1 py-2 border-b-2 border-gray-300 focus-within:border-blue-500 gap-2"
            />
          </div>
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Gradient Border:</p>
            <Input
              placeholder="Enter text..."
              className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              wrapperClassName="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-[2px] gap-2"
              containerClassName="[&>div]:bg-white [&>div]:rounded-md [&>div]:px-3 [&>div]:py-2"
            />
          </div>
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Green Accent:</p>
            <Input
              placeholder="Enter text..."
              className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              wrapperClassName="px-3 py-2 rounded-lg border border-green-300 bg-green-50 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 gap-2"
            />
          </div>
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Shadow Style:</p>
            <Input
              placeholder="Enter text..."
              className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              wrapperClassName="px-3 py-2 rounded-lg border-0 bg-white shadow-md focus-within:shadow-lg focus-within:ring-1 focus-within:ring-gray-200 gap-2"
            />
          </div>
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Using focusClassName:</p>
            <Input
              placeholder="Focus me..."
              className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              wrapperClassName="px-3 py-2 rounded-lg border border-gray-300 bg-white gap-2"
              focusClassName="focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 focus-within:bg-purple-50"
            />
          </div>
        </div>
      </Section>

      <Section title="Data Attributes">
        <p className="text-sm text-gray-600 mb-4">
          The Input component applies data attributes that can be used for CSS styling:
        </p>
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
                <td className="py-2 pr-4 font-mono text-blue-600">data-disabled</td>
                <td className="py-2 pr-4 text-gray-600">container, input</td>
                <td className="py-2 text-gray-600">Present when input is disabled or loading</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">data-error</td>
                <td className="py-2 pr-4 text-gray-600">container, input</td>
                <td className="py-2 text-gray-600">Present when input has an error</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">data-loading</td>
                <td className="py-2 pr-4 text-gray-600">container</td>
                <td className="py-2 text-gray-600">Present when input is in loading state</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Example usage: <code className="bg-gray-100 px-1 rounded">data-[disabled]:opacity-50</code>, <code className="bg-gray-100 px-1 rounded">data-[error]:border-red-500</code>
        </p>
      </Section>

      <Section title="Input Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">id</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">auto-generated</td>
                <td className="py-2 text-gray-600">
                  Custom ID for the input element
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">name</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Name attribute for the input
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">type</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"text"</td>
                <td className="py-2 text-gray-600">
                  HTML input type (text, email, password, etc.)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Label text for the input
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">required</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether the input is required
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether the input is disabled
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">error</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether the input is in error state
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">errorMessage</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Error message to display
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">leadingIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Icon to display before the input
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">trailingIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Icon to display after the input
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  onLeadingIconClick
                </td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when leading icon is clicked
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  onTrailingIconClick
                </td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when trailing icon is clicked
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">isLoading</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether the input is in loading state
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">loader</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">CircularLoader</td>
                <td className="py-2 text-gray-600">
                  Custom loader component
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">loaderSize</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">16</td>
                <td className="py-2 text-gray-600">
                  Size of the loader spinner in pixels
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">fullWidth</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether the input takes full width
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Input Styling Props">
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
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 text-gray-600">CSS class for the input element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">containerClassName</td>
                <td className="py-2 text-gray-600">CSS class for the outer container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">wrapperClassName</td>
                <td className="py-2 text-gray-600">CSS class for the input wrapper (contains icons)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">focusClassName</td>
                <td className="py-2 text-gray-600">CSS class for focus state (use focus-within: prefixed classes)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">labelClassName</td>
                <td className="py-2 text-gray-600">CSS class for the label element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">errorClassName</td>
                <td className="py-2 text-gray-600">CSS class for the error message</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="InputLabel Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Label content (required)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">required</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether to show required indicator (*)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">inputId</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  ID of the input element this label is for
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Custom className for the label
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default InputDemo;
