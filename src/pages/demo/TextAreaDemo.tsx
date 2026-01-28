import { TextArea } from "../../components/TextArea";
import { Section, ComponentHeader, SearchIcon, CloseIcon } from "./components";

const TextAreaDemo = () => {
  const textAreaStyles =
    "w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400";
  const textAreaWrapperStyles =
    "px-3 py-2 rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 gap-2";
  const textAreaWrapperErrorStyles =
    "px-3 py-2 rounded-lg border border-red-500 bg-white focus-within:ring-2 focus-within:ring-red-500 gap-2";
  const textAreaErrorStyles =
    "w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400";
  const textAreaDisabledStyles =
    "w-full bg-transparent outline-none text-gray-400 placeholder:text-gray-300 cursor-not-allowed";
  const labelStyles = "text-sm font-medium text-gray-700";

  return (
    <>
      <ComponentHeader
        title="TextArea"
        description="A flexible, accessible textarea component for multi-line text input."
      />

      <Section title="Basic TextArea">
        <TextArea
          placeholder="Enter your message..."
          className={textAreaStyles}
          wrapperClassName={textAreaWrapperStyles}
        />
      </Section>

      <Section title="With Label">
        <TextArea
          label="Description"
          placeholder="Enter a description..."
          className={textAreaStyles}
          wrapperClassName={textAreaWrapperStyles}
          labelClassName={labelStyles}
          containerClassName="flex flex-col gap-1"
        />
        <TextArea
          label="Comments"
          placeholder="Add your comments..."
          required
          className={textAreaStyles}
          wrapperClassName={textAreaWrapperStyles}
          labelClassName={labelStyles}
          containerClassName="flex flex-col gap-1"
        />
      </Section>

      <Section title="Different Row Sizes">
        <TextArea
          placeholder="2 rows"
          rows={2}
          className={textAreaStyles}
          wrapperClassName={textAreaWrapperStyles}
        />
        <TextArea
          placeholder="4 rows (default)"
          rows={4}
          className={textAreaStyles}
          wrapperClassName={textAreaWrapperStyles}
        />
        <TextArea
          placeholder="6 rows"
          rows={6}
          className={textAreaStyles}
          wrapperClassName={textAreaWrapperStyles}
        />
      </Section>

      <Section title="With Icons">
        <TextArea
          placeholder="Search content..."
          leadingIcon={<SearchIcon />}
          className={textAreaStyles}
          wrapperClassName={textAreaWrapperStyles}
        />
        <TextArea
          placeholder="Type and clear..."
          trailingIcon={<CloseIcon />}
          className={textAreaStyles}
          wrapperClassName={textAreaWrapperStyles}
        />
        <TextArea
          placeholder="Both icons"
          leadingIcon={<SearchIcon />}
          trailingIcon={<CloseIcon />}
          className={textAreaStyles}
          wrapperClassName={textAreaWrapperStyles}
        />
      </Section>

      <Section title="Clickable Icons">
        <TextArea
          placeholder="Click the icons..."
          leadingIcon={<SearchIcon />}
          onLeadingIconClick={() => alert("Search clicked!")}
          trailingIcon={<CloseIcon />}
          onTrailingIconClick={() => alert("Clear clicked!")}
          className={textAreaStyles}
          wrapperClassName={textAreaWrapperStyles}
        />
      </Section>

      <Section title="Error State">
        <TextArea
          label="Bio"
          placeholder="Tell us about yourself..."
          error
          errorMessage="Bio must be at least 50 characters"
          className={textAreaErrorStyles}
          wrapperClassName={textAreaWrapperErrorStyles}
          labelClassName={labelStyles}
          errorClassName="text-sm text-red-500 mt-1"
          containerClassName="flex flex-col gap-1"
        />
      </Section>

      <Section title="Loading State">
        <TextArea
          placeholder="Loading..."
          isLoading
          className={textAreaStyles}
          wrapperClassName={textAreaWrapperStyles}
        />
        <TextArea
          placeholder="Custom loader size"
          isLoading
          loaderSize={20}
          className={textAreaStyles}
          wrapperClassName={textAreaWrapperStyles}
        />
        <TextArea
          placeholder="Custom loader component"
          isLoading
          loader={
            <span className="text-xs text-blue-500 animate-pulse">Loading...</span>
          }
          className={textAreaStyles}
          wrapperClassName={textAreaWrapperStyles}
        />
      </Section>

      <Section title="Disabled">
        <TextArea
          placeholder="Disabled textarea"
          disabled
          className={textAreaDisabledStyles}
          wrapperClassName={textAreaWrapperStyles}
        />
      </Section>

      <Section title="Full Width">
        <div className="w-full">
          <TextArea
            placeholder="Full width textarea"
            fullWidth
            className={textAreaStyles}
            wrapperClassName={textAreaWrapperStyles}
          />
        </div>
      </Section>

      <Section title="Custom Theme Examples">
        <p className="text-sm text-gray-600 mb-4">
          Customize the textarea appearance to match your design system.
        </p>
        <div className="flex flex-wrap gap-6">
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">Dark Theme:</p>
            <TextArea
              placeholder="Enter text..."
              rows={3}
              className="w-full bg-transparent outline-none text-white placeholder:text-gray-400 resize-none"
              wrapperClassName="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 focus-within:ring-2 focus-within:ring-gray-500 gap-2"
            />
          </div>
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">Rounded Style:</p>
            <TextArea
              placeholder="Write your message..."
              rows={3}
              leadingIcon={<SearchIcon />}
              className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 resize-none"
              wrapperClassName="px-4 py-3 rounded-2xl border border-gray-300 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white gap-2"
            />
          </div>
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">Underline Style:</p>
            <TextArea
              placeholder="Enter text..."
              rows={3}
              className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 resize-none"
              wrapperClassName="px-1 py-2 border-b-2 border-gray-300 focus-within:border-blue-500 gap-2"
            />
          </div>
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">Gradient Border:</p>
            <TextArea
              placeholder="Enter text..."
              rows={3}
              className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 resize-none"
              wrapperClassName="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-[2px] gap-2"
              containerClassName="[&>div]:bg-white [&>div]:rounded-md [&>div]:px-3 [&>div]:py-2"
            />
          </div>
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">Green Accent:</p>
            <TextArea
              placeholder="Enter text..."
              rows={3}
              className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 resize-none"
              wrapperClassName="px-3 py-2 rounded-lg border border-green-300 bg-green-50 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 gap-2"
            />
          </div>
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">Shadow Style:</p>
            <TextArea
              placeholder="Enter text..."
              rows={3}
              className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 resize-none"
              wrapperClassName="px-3 py-2 rounded-lg border-0 bg-white shadow-md focus-within:shadow-lg focus-within:ring-1 focus-within:ring-gray-200 gap-2"
            />
          </div>
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">Using focusClassName:</p>
            <TextArea
              placeholder="Focus me..."
              rows={3}
              className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 resize-none"
              wrapperClassName="px-3 py-2 rounded-lg border border-gray-300 bg-white gap-2"
              focusClassName="focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 focus-within:bg-purple-50"
            />
          </div>
        </div>
      </Section>

      <Section title="Data Attributes">
        <p className="text-sm text-gray-600 mb-4">
          The TextArea component applies data attributes that can be used for CSS styling:
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
                <td className="py-2 pr-4 text-gray-600">container, textarea</td>
                <td className="py-2 text-gray-600">Present when textarea is disabled or loading</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">data-error</td>
                <td className="py-2 pr-4 text-gray-600">container, textarea</td>
                <td className="py-2 text-gray-600">Present when textarea has an error</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">data-loading</td>
                <td className="py-2 pr-4 text-gray-600">container</td>
                <td className="py-2 text-gray-600">Present when textarea is in loading state</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Example usage: <code className="bg-gray-100 px-1 rounded">data-[disabled]:opacity-50</code>, <code className="bg-gray-100 px-1 rounded">data-[error]:border-red-500</code>
        </p>
      </Section>

      <Section title="TextArea Props">
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
                  Custom ID for the textarea element
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">name</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Name attribute for the textarea
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Label text for the textarea
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">required</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether the textarea is required
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether the textarea is disabled
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">rows</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">4</td>
                <td className="py-2 text-gray-600">
                  Number of visible text lines
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">error</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether the textarea is in error state
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
                  Icon to display before the textarea
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">trailingIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Icon to display after the textarea
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
                  Whether the textarea is in loading state
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
                  Whether the textarea takes full width
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">ref</td>
                <td className="py-2 pr-4 text-gray-600">React.Ref&lt;HTMLTextAreaElement&gt;</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Ref forwarded to the textarea element
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          <strong>Note:</strong> TextArea extends native <code className="bg-gray-100 px-1 rounded">TextareaHTMLAttributes</code> and accepts all standard textarea props such as <code className="bg-gray-100 px-1 rounded">value</code>, <code className="bg-gray-100 px-1 rounded">defaultValue</code>, <code className="bg-gray-100 px-1 rounded">onChange</code>, <code className="bg-gray-100 px-1 rounded">onBlur</code>, <code className="bg-gray-100 px-1 rounded">onFocus</code>, <code className="bg-gray-100 px-1 rounded">placeholder</code>, <code className="bg-gray-100 px-1 rounded">maxLength</code>, <code className="bg-gray-100 px-1 rounded">minLength</code>, <code className="bg-gray-100 px-1 rounded">readOnly</code>, <code className="bg-gray-100 px-1 rounded">autoFocus</code>, <code className="bg-gray-100 px-1 rounded">cols</code>, <code className="bg-gray-100 px-1 rounded">wrap</code>, etc.
        </p>
      </Section>

      <Section title="TextArea Styling Props">
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
                <td className="py-2 text-gray-600">CSS class for the textarea element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">containerClassName</td>
                <td className="py-2 text-gray-600">CSS class for the outer container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">wrapperClassName</td>
                <td className="py-2 text-gray-600">CSS class for the textarea wrapper (contains icons)</td>
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

      <Section title="TextAreaLabel Props">
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
                <td className="py-2 pr-4 font-mono text-blue-600">textAreaId</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  ID of the textarea element this label is for
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

export default TextAreaDemo;
