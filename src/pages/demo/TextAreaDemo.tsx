import { useState, useRef } from "react";
import { TextArea, TextAreaLabel } from "../../components/TextArea";
import { useTheme } from "./ThemeContext";
import { Section, CodeBlock, DemoWrapper } from "./components";


const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const CloseIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const MessageIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SendIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const FileIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
  </svg>
);


const TextAreaDemo = () => {
  const { isDarkMode } = useTheme();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textValue, setTextValue] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  const getTextAreaClassNames = () => ({
    textArea: `w-full bg-transparent outline-none resize-none ${
      isDarkMode
        ? "text-white placeholder:text-gray-500"
        : "text-gray-900 placeholder:text-gray-400"
    }`,
    wrapper: `px-3 py-2 rounded-lg border gap-2 ${
      isDarkMode
        ? "border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400"
        : "border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
    }`,
    wrapperError: `px-3 py-2 rounded-lg border gap-2 ${
      isDarkMode
        ? "border-red-400 bg-gray-700 focus-within:ring-2 focus-within:ring-red-400"
        : "border-red-500 bg-white focus-within:ring-2 focus-within:ring-red-500"
    }`,
    label: `text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`,
    error: `text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`,
    container: "flex flex-col gap-1",
    disabled: `w-full bg-transparent outline-none cursor-not-allowed resize-none ${
      isDarkMode
        ? "text-gray-500 placeholder:text-gray-600"
        : "text-gray-400 placeholder:text-gray-300"
    }`,
    wrapperDisabled: `px-3 py-2 rounded-lg border gap-2 opacity-60 ${
      isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-100"
    }`,
  });

  const classes = getTextAreaClassNames();

  return (
    <div className="space-y-16">
      <header>
        <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          TextArea
        </h1>
        <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          A flexible, accessible textarea component for multi-line text input. Supports icons,
          loading states, error handling, and extensive customization through className props.
        </p>

        <div className="mt-6">
          <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import { TextArea, TextAreaLabel } from "@kern-ui/textarea";`}
          />
        </div>
      </header>

      <div className="space-y-12">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Examples
        </h2>

        <Section
          title="Basic TextArea"
          description="A simple multi-line text input with no additional props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full max-w-md">
              <TextArea
                placeholder="Enter your message..."
                textAreaClassName={classes.textArea}
                wrapperClassName={classes.wrapper}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="With Label"
          description="Use the label prop to add an accessible label above the textarea."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <TextArea
                label="Description"
                placeholder="Enter a description..."
                textAreaClassName={classes.textArea}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <TextArea
                label="Comments"
                placeholder="Add your comments..."
                textAreaClassName={classes.textArea}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Required Fields"
          description="Add required prop to show an asterisk (*) indicator and set aria-required."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <TextArea
                label="Bio"
                placeholder="Tell us about yourself..."
                required
                textAreaClassName={classes.textArea}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <TextArea
                label="Feedback"
                placeholder="Share your feedback..."
                required
                textAreaClassName={classes.textArea}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Different Row Sizes"
          description="Control the visible height with the rows prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4 w-full max-w-md">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  2 rows
                </p>
                <TextArea
                  placeholder="Small textarea (2 rows)"
                  rows={2}
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  4 rows (default)
                </p>
                <TextArea
                  placeholder="Default textarea (4 rows)"
                  rows={4}
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  6 rows
                </p>
                <TextArea
                  placeholder="Large textarea (6 rows)"
                  rows={6}
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="With Icons"
          description="Add leading and trailing icons using the leadingIcon and trailingIcon props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4 w-full max-w-md">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Leading icon
                </p>
                <TextArea
                  placeholder="Write your message..."
                  leadingIcon={<MessageIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Trailing icon
                </p>
                <TextArea
                  placeholder="Enter content..."
                  trailingIcon={<FileIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Both icons
                </p>
                <TextArea
                  placeholder="Search and filter content..."
                  leadingIcon={<SearchIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  trailingIcon={<SendIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Clickable Icons"
          description="Make icons interactive with onLeadingIconClick and onTrailingIconClick. Use leadingIconLabel and trailingIconLabel for accessibility."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4 w-full max-w-md">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Message with clear button
                </p>
                <TextArea
                  placeholder="Type your message..."
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  leadingIcon={<MessageIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  trailingIcon={textValue ? <CloseIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} /> : undefined}
                  onTrailingIconClick={() => setTextValue("")}
                  trailingIconLabel="Clear text"
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  With send button
                </p>
                <TextArea
                  placeholder="Write something and click send..."
                  leadingIcon={<MessageIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  trailingIcon={<SendIcon className={`${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />}
                  onTrailingIconClick={() => alert("Message sent!")}
                  trailingIconLabel="Send message"
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Error State"
          description="Use error and errorMessage props to display validation errors."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4 w-full max-w-md">
              <TextArea
                label="Bio"
                placeholder="Tell us about yourself..."
                value="Hi"
                error
                errorMessage="Bio must be at least 50 characters"
                textAreaClassName={classes.textArea}
                wrapperClassName={classes.wrapperError}
                labelClassName={classes.label}
                errorClassName={classes.error}
                containerClassName={classes.container}
              />
              <TextArea
                label="Feedback"
                placeholder="Share your feedback..."
                error
                errorMessage={
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Feedback is required
                  </span>
                }
                textAreaClassName={classes.textArea}
                wrapperClassName={classes.wrapperError}
                labelClassName={classes.label}
                errorClassName={classes.error}
                containerClassName={classes.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Loading State"
          description="Use loading to show a loader and disable the textarea. Customize with loader and loaderSize props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4 w-full max-w-md">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Default loader
                </p>
                <TextArea
                  placeholder="Loading..."
                  loading
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Custom loader size (loaderSize=20)
                </p>
                <TextArea
                  placeholder="Loading..."
                  loading
                  loaderSize={20}
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Custom loader component
                </p>
                <TextArea
                  placeholder="Processing..."
                  loading
                  loader={
                    <span className={`text-xs animate-pulse ${isDarkMode ? "text-blue-400" : "text-blue-500"}`}>
                      Saving...
                    </span>
                  }
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Loading with icon
                </p>
                <TextArea
                  placeholder="Submitting..."
                  loading
                  leadingIcon={<MessageIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Disabled State"
          description="Disable the textarea with the disabled prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4 w-full max-w-md">
              <TextArea
                placeholder="Disabled textarea"
                disabled
                className={classes.disabled}
                wrapperClassName={classes.wrapperDisabled}
              />
              <TextArea
                label="Disabled with value"
                value="This content cannot be edited"
                disabled
                className={classes.disabled}
                wrapperClassName={classes.wrapperDisabled}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <TextArea
                placeholder="Disabled with icon"
                disabled
                leadingIcon={<MessageIcon className={isDarkMode ? "text-gray-500" : "text-gray-400"} />}
                className={classes.disabled}
                wrapperClassName={classes.wrapperDisabled}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Full Width"
          description="Use fullWidth prop to make the textarea span the full container width."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <TextArea
                placeholder="Full width textarea"
                fullWidth
                textAreaClassName={classes.textArea}
                wrapperClassName={classes.wrapper}
              />
              <TextArea
                label="Full width with label"
                placeholder="Enter your detailed message..."
                fullWidth
                textAreaClassName={classes.textArea}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom ID and Name"
          description="Set custom id and name attributes for form handling."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="max-w-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  alert(`Form submitted!\nMessage: ${formData.get("user-message")}\nFeedback: ${formData.get("user-feedback")}`);
                }}
                className="space-y-4"
              >
                <TextArea
                  id="message-textarea"
                  name="user-message"
                  label="Message"
                  placeholder="Enter your message"
                  rows={3}
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                  labelClassName={classes.label}
                  containerClassName={classes.container}
                />
                <TextArea
                  id="feedback-textarea"
                  name="user-feedback"
                  label="Feedback"
                  placeholder="Share your feedback"
                  rows={3}
                  textAreaClassName={classes.textArea}
                  wrapperClassName={classes.wrapper}
                  labelClassName={classes.label}
                  containerClassName={classes.container}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Submit Form
                </button>
              </form>
            </div>
          </DemoWrapper>
          <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}>
            <p className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}>
              <strong>Note:</strong> The textarea ID is auto-generated if not provided. It uses{" "}
              <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>
                id || useId()
              </code>{" "}
              fallback chain.
            </p>
          </div>
        </Section>

        <Section
          title="Ref Forwarding"
          description="Access the underlying textarea element using React refs."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4 w-full max-w-md">
              <TextArea
                ref={textAreaRef}
                placeholder="Click the buttons to interact with me"
                textAreaClassName={classes.textArea}
                wrapperClassName={classes.wrapper}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => textAreaRef.current?.focus()}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Focus TextArea
                </button>
                <button
                  onClick={() => textAreaRef.current?.select()}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Select All
                </button>
                <button
                  onClick={() => alert(`Current value: "${textAreaRef.current?.value}"`)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Get Value
                </button>
                <button
                  onClick={() => {
                    if (textAreaRef.current) {
                      textAreaRef.current.value = "Text inserted via ref!";
                    }
                  }}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Set Value
                </button>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="TextAreaLabel Standalone"
          description="Use TextAreaLabel separately for custom layouts."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4 w-full max-w-md">
              <div>
                <TextAreaLabel
                  label="Standalone Label"
                  htmlFor="custom-textarea"
                  className={classes.label}
                />
                <div className="mt-1">
                  <textarea
                    id="custom-textarea"
                    placeholder="Native textarea with TextAreaLabel"
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border outline-none resize-none ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                    }`}
                  />
                </div>
              </div>
              <div>
                <TextAreaLabel
                  label="Required Field"
                  htmlFor="required-textarea"
                  required
                  className={classes.label}
                />
                <p className={`text-xs mt-0.5 mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Required indicator (*) is added automatically
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Theme Examples"
          description="Customize the textarea appearance using className props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Rounded Style
                </p>
                <TextArea
                  placeholder="Write your message..."
                  rows={3}
                  leadingIcon={<MessageIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                  className={`w-full bg-transparent outline-none resize-none ${isDarkMode ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`}
                  wrapperClassName={`px-4 py-3 rounded-2xl border gap-2 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-blue-400"
                      : "border-gray-300 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white"
                  }`}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Underline Style
                </p>
                <TextArea
                  placeholder="Enter text..."
                  rows={3}
                  className={`w-full bg-transparent outline-none resize-none ${isDarkMode ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`}
                  wrapperClassName={`px-1 py-2 border-b-2 gap-2 ${
                    isDarkMode
                      ? "border-gray-600 focus-within:border-blue-400"
                      : "border-gray-300 focus-within:border-blue-500"
                  }`}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Green Accent
                </p>
                <TextArea
                  placeholder="Enter text..."
                  rows={3}
                  className={`w-full bg-transparent outline-none resize-none ${isDarkMode ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`}
                  wrapperClassName={`px-3 py-2 rounded-lg border gap-2 ${
                    isDarkMode
                      ? "border-green-700 bg-green-900/30 focus-within:ring-2 focus-within:ring-green-500"
                      : "border-green-300 bg-green-50 focus-within:ring-2 focus-within:ring-green-500"
                  }`}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Shadow Style
                </p>
                <TextArea
                  placeholder="Enter text..."
                  rows={3}
                  className={`w-full bg-transparent outline-none resize-none ${isDarkMode ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`}
                  wrapperClassName={`px-3 py-2 rounded-lg border-0 shadow-md gap-2 ${
                    isDarkMode
                      ? "bg-gray-700 focus-within:shadow-lg focus-within:ring-1 focus-within:ring-gray-600"
                      : "bg-white focus-within:shadow-lg focus-within:ring-1 focus-within:ring-gray-200"
                  }`}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Focus styles via wrapperClassName
                </p>
                <TextArea
                  placeholder="Focus me..."
                  rows={3}
                  className={`w-full bg-transparent outline-none resize-none ${isDarkMode ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`}
                  wrapperClassName={`px-3 py-2 rounded-lg border gap-2 ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"} ${isDarkMode
                    ? "focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-purple-400 focus-within:bg-purple-900/20"
                    : "focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 focus-within:bg-purple-50"
                  }`}
                />
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Large TextArea
                </p>
                <TextArea
                  placeholder="Large textarea..."
                  rows={3}
                  className={`w-full bg-transparent outline-none text-lg resize-none ${isDarkMode ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`}
                  wrapperClassName={`px-4 py-3 rounded-lg border gap-3 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-blue-400"
                      : "border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500"
                  }`}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Data Attributes"
          description="The TextArea component applies data attributes for CSS-based styling."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="overflow-x-auto">
              <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
                <thead>
                  <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <th className="text-left py-3 pr-4 font-semibold">Attribute</th>
                    <th className="text-left py-3 pr-4 font-semibold">Applied To</th>
                    <th className="text-left py-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">data-disabled</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      container, textarea
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Present when textarea is disabled or loading
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">data-error</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      container, textarea
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Present when textarea has an error
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">data-loading</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      container
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Present when textarea is in loading state
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={`text-sm mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Example usage:{" "}
              <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                data-[disabled]:opacity-50
              </code>
              ,{" "}
              <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                data-[error]:border-red-500
              </code>
            </p>
          </DemoWrapper>
        </Section>

        <Section
          title="Feedback Form Example"
          description="A practical example combining multiple textarea features."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Feedback submitted!");
              }}
              className="max-w-md space-y-4"
            >
              <TextArea
                label="Your Feedback"
                placeholder="Tell us what you think about our product..."
                required
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                leadingIcon={<MessageIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} />}
                trailingIcon={feedbackText ? <CloseIcon className={isDarkMode ? "text-gray-400" : "text-gray-500"} /> : undefined}
                onTrailingIconClick={() => setFeedbackText("")}
                trailingIconLabel="Clear feedback"
                textAreaClassName={classes.textArea}
                wrapperClassName={classes.wrapper}
                labelClassName={classes.label}
                containerClassName={classes.container}
              />
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {feedbackText.length}/500 characters
                </span>
                <label className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <input type="checkbox" className="rounded" />
                  Contact me about this feedback
                </label>
              </div>
              <button
                type="submit"
                className={`w-full py-2 rounded-lg font-medium text-white transition-colors ${
                  isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Submit Feedback
              </button>
            </form>
          </DemoWrapper>
        </Section>
      </div>

      <div className="space-y-8">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          API Reference
        </h2>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            TextArea
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">id</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>auto-generated</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom ID for the textarea element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">name</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Name attribute for form submission
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">label</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Label text displayed above the textarea
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">rows</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>4</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Number of visible text lines
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">required</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the textarea is required (shows * and sets aria-required)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">disabled</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the textarea is disabled
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">error</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the textarea is in error state (sets aria-invalid)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">errorMessage</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Error message displayed below the textarea
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">leadingIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Icon displayed before the textarea
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">trailingIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Icon displayed after the textarea
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onLeadingIconClick</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>() =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Callback when leading icon is clicked
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onTrailingIconClick</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>() =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Callback when trailing icon is clicked
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">leadingIconLabel</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Accessible label for clickable leading icon
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">trailingIconLabel</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Accessible label for clickable trailing icon
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">loading</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Show loading state (disables textarea and shows loader)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">loader</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>CircularLoader</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom loader component
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">loaderSize</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>16</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Size of the default loader in pixels
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">fullWidth</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether the textarea spans full container width
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">ref</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>React.Ref&lt;HTMLTextAreaElement&gt;</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Ref forwarded to the textarea element
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Styling Props
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">className</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the root container element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">textAreaClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the native textarea element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">containerClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the outer container (includes label and error)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">wrapperClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the textarea wrapper (contains icons and textarea)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">labelClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the label element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">errorClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the error message element
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            TextAreaLabel
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">label</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>required</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Label content to display
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">required</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether to show required indicator (*)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">htmlFor</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    ID of the textarea element (for htmlFor attribute)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">className</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>""</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the label element
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Type Definitions
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`interface TextAreaLabelProps {
  label: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onLeadingIconClick?: () => void;
  onTrailingIconClick?: () => void;
  leadingIconLabel?: string;
  trailingIconLabel?: string;
  loading?: boolean;
  loader?: ReactNode;
  loaderSize?: number;
  fullWidth?: boolean;
  containerClassName?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}`}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Accessibility
        </h2>
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Features
          </h3>
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>
              Label is automatically associated with textarea via{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                htmlFor
              </code>
            </li>
            <li>
              Required textareas have{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-required="true"
              </code>
            </li>
            <li>
              Error state sets{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-invalid="true"
              </code>{" "}
              and connects error message via{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-describedby
              </code>
            </li>
            <li>
              Error messages use{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                role="alert"
              </code>{" "}
              for screen reader announcements
            </li>
            <li>
              Clickable icons are keyboard accessible (Enter/Space) and have{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                role="button"
              </code>
            </li>
            <li>
              Use{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                leadingIconLabel
              </code>{" "}
              and{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                trailingIconLabel
              </code>{" "}
              for accessible icon buttons
            </li>
            <li>
              Loader has{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-hidden="true"
              </code>{" "}
              as it's decorative
            </li>
            <li>Supports ref forwarding for programmatic focus management</li>
          </ul>
        </div>

        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Keyboard Navigation
          </h3>
          <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Tab
              </kbd>{" "}
              - Move focus to/from textarea
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Enter
              </kbd>{" "}
              /{" "}
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Space
              </kbd>{" "}
              - Activate clickable icons when focused
            </li>
          </ul>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          <strong>Note:</strong> TextArea extends native{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
            TextareaHTMLAttributes
          </code>{" "}
          and accepts all standard textarea props such as{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>value</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>defaultValue</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>onChange</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>onBlur</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>onFocus</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>placeholder</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>maxLength</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>minLength</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>readOnly</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>autoFocus</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>cols</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>wrap</code>, etc.
        </p>
      </div>
    </div>
  );
};

export default TextAreaDemo;
