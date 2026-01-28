import { useState } from "react";
import {
  Accordion,
  PlusIcon,
  MinusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../../components/Accordion";
import type { AccordionItemType } from "../../components/Accordion";

// Common styling classes for the demo
const defaultButtonClassName =
  "px-4 py-4 gap-3 cursor-pointer hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const defaultTitleClassName = "text-sm font-medium text-gray-900 text-left";
const defaultContentClassName = "px-4 py-4 text-sm text-gray-600";
const defaultIconClassName = "w-4 h-4 text-gray-500";
const defaultItemClassName = "border-b border-gray-200 last:border-b-0";

// Shimmer styling
const defaultShimmerItemClassName = "border-b border-gray-200 last:border-b-0";
const defaultShimmerHeaderClassName = "px-4 py-4";
const defaultShimmerTitleClassName =
  "h-4 w-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse";
const defaultShimmerIconClassName =
  "h-4 w-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse";
const defaultShimmerContentClassName = "px-4 py-4 space-y-3";
const defaultShimmerLineClassName =
  "h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse";

const AccordionDemo = () => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // Basic accordion items with string titles
  const basicItems: AccordionItemType[] = [
    {
      id: "basic-1",
      title: "What is React?",
      content:
        "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components.",
    },
    {
      id: "basic-2",
      title: "What is TypeScript?",
      content:
        "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
    },
    {
      id: "basic-3",
      title: "What is Tailwind CSS?",
      content:
        "Tailwind CSS is a utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.",
    },
  ];

  // Items with React Node titles (HTML)
  const richTitleItems: AccordionItemType[] = [
    {
      id: "rich-1",
      title: (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="font-semibold">Active Services</span>
          <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
            3 running
          </span>
        </div>
      ),
      content: (
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            API Server - Running on port 3000
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Database - Connected
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Cache Server - Online
          </li>
        </ul>
      ),
    },
    {
      id: "rich-2",
      title: (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-500 rounded-full" />
          <span className="font-semibold">Pending Tasks</span>
          <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
            5 items
          </span>
        </div>
      ),
      content: (
        <div className="space-y-3">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="font-medium text-yellow-800">Database Migration</p>
            <p className="text-sm text-yellow-600">Scheduled for 2:00 AM</p>
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="font-medium text-yellow-800">Security Audit</p>
            <p className="text-sm text-yellow-600">
              In progress - 60% complete
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "rich-3",
      title: (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="font-semibold">Alerts</span>
          <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
            2 critical
          </span>
        </div>
      ),
      content: (
        <div className="space-y-2">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-medium text-red-800">High CPU Usage</p>
            <p className="text-sm text-red-600">
              Server-02 is at 95% CPU utilization
            </p>
          </div>
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-medium text-red-800">Memory Warning</p>
            <p className="text-sm text-red-600">Available memory below 10%</p>
          </div>
        </div>
      ),
    },
  ];

  // Items with disabled state
  const itemsWithDisabled: AccordionItemType[] = [
    {
      id: "disabled-1",
      title: "Available Section",
      content: "This section is available and can be expanded.",
    },
    {
      id: "disabled-2",
      title: "Premium Feature (Locked)",
      content: "This content requires a premium subscription.",
      disabled: true,
    },
    {
      id: "disabled-3",
      title: "Another Available Section",
      content: "This section is also available for viewing.",
    },
  ];

  // FAQ style items
  const faqItems: AccordionItemType[] = [
    {
      id: "faq-1",
      title: "How do I reset my password?",
      content: (
        <div className="space-y-2">
          <p>To reset your password:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click on "Forgot Password" on the login page</li>
            <li>Enter your email address</li>
            <li>Check your inbox for the reset link</li>
            <li>Follow the link to create a new password</li>
          </ol>
        </div>
      ),
    },
    {
      id: "faq-2",
      title: "What payment methods do you accept?",
      content: (
        <div className="space-y-2">
          <p>We accept the following payment methods:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Credit Cards (Visa, MasterCard, American Express)</li>
            <li>PayPal</li>
            <li>Bank Transfer</li>
            <li>Apple Pay / Google Pay</li>
          </ul>
        </div>
      ),
    },
    {
      id: "faq-3",
      title: "How long does shipping take?",
      content: (
        <p>
          Shipping times vary by location. Standard shipping typically takes 5-7
          business days domestically and 10-14 business days for international
          orders. Express shipping options are available at checkout.
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accordion</h1>
        <p className="text-gray-600 mb-8">
          A flexible accordion component with no hardcoded styles. All styling
          is provided via className props, giving you full control over the
          appearance.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Basic Accordion</h2>
        <p className="text-sm text-gray-600">
          Simple accordion with string titles and text content. Only one item
          can be expanded at a time.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Accordion
            items={basicItems}
            itemClassName={defaultItemClassName}
            buttonClassName={defaultButtonClassName}
            titleClassName={defaultTitleClassName}
            contentClassName={defaultContentClassName}
            iconClassName={defaultIconClassName}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Multiple Expanded Items
        </h2>
        <p className="text-sm text-gray-600">
          Accordion that allows multiple items to be expanded simultaneously.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Accordion
            items={basicItems.map((item) => ({
              ...item,
              id: `multi-${item.id}`,
            }))}
            allowMultipleExpanded={true}
            preExpanded={["multi-basic-1", "multi-basic-2"]}
            itemClassName={defaultItemClassName}
            buttonClassName={defaultButtonClassName}
            titleClassName={defaultTitleClassName}
            contentClassName={defaultContentClassName}
            iconClassName={defaultIconClassName}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Rich Title Content
        </h2>
        <p className="text-sm text-gray-600">
          Accordion with React nodes as titles, including badges and status
          indicators.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Accordion
            items={richTitleItems}
            allowMultipleExpanded={true}
            itemClassName={defaultItemClassName}
            buttonClassName={defaultButtonClassName}
            titleClassName="text-left"
            contentClassName={defaultContentClassName}
            iconClassName={defaultIconClassName}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Custom Icons (Plus/Minus)
        </h2>
        <p className="text-sm text-gray-600">
          Accordion with different icons for expanded and collapsed states.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Accordion
            items={faqItems.map((item) => ({
              ...item,
              id: `pm-${item.id}`,
            }))}
            expandedIcon={<MinusIcon className="w-4 h-4 text-gray-500" />}
            collapsedIcon={<PlusIcon className="w-4 h-4 text-gray-500" />}
            itemClassName={defaultItemClassName}
            buttonClassName={defaultButtonClassName}
            titleClassName={defaultTitleClassName}
            contentClassName={defaultContentClassName}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Left Icon Position
        </h2>
        <p className="text-sm text-gray-600">
          Accordion with icons positioned on the left side instead of right.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Accordion
            items={basicItems.map((item) => ({
              ...item,
              id: `left-${item.id}`,
            }))}
            iconPosition="left"
            expandedIcon={<ChevronUpIcon className="w-4 h-4 text-blue-500" />}
            collapsedIcon={
              <ChevronDownIcon className="w-4 h-4 text-blue-500" />
            }
            itemClassName={defaultItemClassName}
            buttonClassName={defaultButtonClassName}
            titleClassName={defaultTitleClassName}
            contentClassName={defaultContentClassName}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Text Alignment Options
        </h2>
        <p className="text-sm text-gray-600">
          Control title and content alignment using titleClassName and
          contentClassName props.
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">
              Left aligned title & content (default)
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <Accordion
                items={[
                  {
                    id: "align-left",
                    title: "Left Aligned Title",
                    content: "This content is left aligned by default.",
                  },
                ]}
                buttonClassName={defaultButtonClassName}
                titleClassName="text-sm font-medium text-gray-900 text-left"
                contentClassName="px-4 py-4 text-sm text-gray-600 text-left"
                iconClassName={defaultIconClassName}
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Center aligned title & content
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <Accordion
                items={[
                  {
                    id: "align-center",
                    title: "Center Aligned Title",
                    content: "This content is center aligned.",
                  },
                ]}
                buttonClassName={defaultButtonClassName}
                titleClassName="text-sm font-medium text-gray-900 text-center"
                contentClassName="px-4 py-4 text-sm text-gray-600 text-center"
                iconClassName={defaultIconClassName}
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Right aligned title & content
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <Accordion
                items={[
                  {
                    id: "align-right",
                    title: "Right Aligned Title",
                    content: "This content is right aligned.",
                  },
                ]}
                buttonClassName={defaultButtonClassName}
                titleClassName="text-sm font-medium text-gray-900 text-right"
                contentClassName="px-4 py-4 text-sm text-gray-600 text-right"
                iconClassName={defaultIconClassName}
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Mixed alignment (left title, center content)
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <Accordion
                items={[
                  {
                    id: "align-mixed",
                    title: "Left Title with Center Content",
                    content:
                      "This content is center aligned while the title remains left aligned.",
                  },
                ]}
                buttonClassName={defaultButtonClassName}
                titleClassName="text-sm font-medium text-gray-900 text-left"
                contentClassName="px-4 py-4 text-sm text-gray-600 text-center"
                iconClassName={defaultIconClassName}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          With Disabled Items
        </h2>
        <p className="text-sm text-gray-600">
          Accordion with some items disabled and non-interactive.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Accordion
            items={itemsWithDisabled}
            itemClassName={defaultItemClassName}
            buttonClassName={defaultButtonClassName}
            titleClassName={defaultTitleClassName}
            contentClassName={defaultContentClassName}
            iconClassName={defaultIconClassName}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Custom Styling</h2>
        <p className="text-sm text-gray-600">
          Accordion with custom button, panel, and title styles via className
          props.
        </p>
        <div className="border border-blue-200 rounded-lg overflow-hidden bg-blue-50">
          <Accordion
            items={basicItems.map((item) => ({
              ...item,
              id: `styled-${item.id}`,
            }))}
            itemClassName="border-b border-blue-200 last:border-b-0"
            buttonClassName="px-6 py-5 gap-3 cursor-pointer hover:bg-blue-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            titleClassName="text-base font-semibold text-blue-900 text-left"
            contentClassName="px-6 py-5 text-blue-800"
            iconClassName="w-5 h-5 text-blue-500"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Without Dividers
        </h2>
        <p className="text-sm text-gray-600">
          Accordion without divider lines between items, using separate card
          styling.
        </p>
        <div className="rounded-lg overflow-hidden bg-white shadow-sm">
          <Accordion
            items={basicItems.map((item) => ({
              ...item,
              id: `nodiv-${item.id}`,
            }))}
            itemClassName="mb-1 last:mb-0"
            buttonClassName="px-4 py-4 gap-3 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            titleClassName={defaultTitleClassName}
            contentClassName="px-4 py-4 text-sm text-gray-600"
            iconClassName={defaultIconClassName}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">FAQ Style</h2>
        <p className="text-sm text-gray-600">
          Accordion styled for FAQ sections with pre-expanded first item and no
          zero expanded allowed.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Accordion
            items={faqItems}
            preExpanded={["faq-1"]}
            allowZeroExpanded={false}
            itemClassName={defaultItemClassName}
            buttonClassName={defaultButtonClassName}
            titleClassName="text-sm font-semibold text-gray-800 text-left"
            contentClassName="px-4 py-4 text-sm text-gray-600"
            iconClassName={defaultIconClassName}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          With onChange Callback
        </h2>
        <p className="text-sm text-gray-600">
          Accordion with a callback that tracks expanded items.
        </p>
        <div className="mb-3 p-3 bg-gray-100 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Currently expanded:{" "}
          </span>
          <span className="text-sm text-gray-600">
            {expandedIds.length > 0 ? expandedIds.join(", ") : "None"}
          </span>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Accordion
            items={basicItems.map((item) => ({
              ...item,
              id: `callback-${item.id}`,
            }))}
            allowMultipleExpanded={true}
            onChange={setExpandedIds}
            itemClassName={defaultItemClassName}
            buttonClassName={defaultButtonClassName}
            titleClassName={defaultTitleClassName}
            contentClassName={defaultContentClassName}
            iconClassName={defaultIconClassName}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Loading State</h2>
        <p className="text-sm text-gray-600">
          Accordion shimmer shown during loading state. All shimmer styles are
          customizable.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Accordion
            items={[]}
            isLoading={true}
            shimmerItemCount={4}
            shimmerItemClassName={defaultShimmerItemClassName}
            shimmerHeaderClassName={defaultShimmerHeaderClassName}
            shimmerTitleClassName={defaultShimmerTitleClassName}
            shimmerIconClassName={defaultShimmerIconClassName}
            shimmerContentClassName={defaultShimmerContentClassName}
            shimmerLineClassName={defaultShimmerLineClassName}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Card Style</h2>
        <p className="text-sm text-gray-600">
          Accordion items styled as individual cards with shadows.
        </p>
        <div className="space-y-3">
          {basicItems.map((item, index) => (
            <div
              key={`card-${item.id}`}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <Accordion
                items={[{ ...item, id: `card-${item.id}` }]}
                preExpanded={index === 0 ? [`card-${item.id}`] : []}
                buttonClassName={defaultButtonClassName}
                titleClassName={defaultTitleClassName}
                contentClassName={defaultContentClassName}
                iconClassName={defaultIconClassName}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Rich Panel Content
        </h2>
        <p className="text-sm text-gray-600">
          Accordion with complex React components in the panel content.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Accordion
            items={[
              {
                id: "rich-content-1",
                title: "User Profile",
                content: (
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      JD
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">John Doe</h4>
                      <p className="text-sm text-gray-500">
                        john.doe@example.com
                      </p>
                      <div className="mt-2 flex gap-2">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          Admin
                        </span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: "rich-content-2",
                title: "Statistics",
                content: (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">128</p>
                      <p className="text-sm text-gray-500">Projects</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">1.2k</p>
                      <p className="text-sm text-gray-500">Followers</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">98%</p>
                      <p className="text-sm text-gray-500">Success Rate</p>
                    </div>
                  </div>
                ),
              },
              {
                id: "rich-content-3",
                title: "Recent Activity",
                content: (
                  <div className="space-y-3">
                    {[
                      { action: "Created project", time: "2 hours ago" },
                      { action: "Updated settings", time: "5 hours ago" },
                      { action: "Invited team member", time: "1 day ago" },
                    ].map((activity, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-sm text-gray-700">
                          {activity.action}
                        </span>
                        <span className="text-xs text-gray-400">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                ),
              },
            ]}
            allowMultipleExpanded={true}
            preExpanded={["rich-content-1"]}
            itemClassName={defaultItemClassName}
            buttonClassName={defaultButtonClassName}
            titleClassName={defaultTitleClassName}
            contentClassName={defaultContentClassName}
            iconClassName={defaultIconClassName}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          AccordionItem Interface
        </h2>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Property
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Required
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
                <td className="py-2 pr-4 text-gray-500">Yes</td>
                <td className="py-2 text-gray-600">
                  Unique identifier for the accordion item
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">title</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">Yes</td>
                <td className="py-2 text-gray-600">
                  Title content (string or JSX)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">content</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">Yes</td>
                <td className="py-2 text-gray-600">
                  Panel content (string or JSX)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Whether the item is disabled
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Accordion Props</h2>
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
                <td className="py-2 pr-4 font-mono text-blue-600">items</td>
                <td className="py-2 pr-4 text-gray-600">AccordionItem[]</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Array of accordion items to render
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  allowMultipleExpanded
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Allow multiple items to be expanded simultaneously
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  allowZeroExpanded
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Allow all items to be collapsed
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  preExpanded
                </td>
                <td className="py-2 pr-4 text-gray-600">string[]</td>
                <td className="py-2 pr-4 text-gray-500">[]</td>
                <td className="py-2 text-gray-600">
                  IDs of items to be expanded initially
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onChange</td>
                <td className="py-2 pr-4 text-gray-600">
                  (expandedIds: string[]) =&gt; void
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when expanded items change
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">isLoading</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Show loading shimmer state
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  shimmerItemCount
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">5</td>
                <td className="py-2 text-gray-600">
                  Number of shimmer items when loading
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  expandedIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">
                  ChevronDown (rotated)
                </td>
                <td className="py-2 text-gray-600">
                  Custom icon for expanded state
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  collapsedIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">ChevronDown</td>
                <td className="py-2 text-gray-600">
                  Custom icon for collapsed state
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  iconPosition
                </td>
                <td className="py-2 pr-4 text-gray-600">"left" | "right"</td>
                <td className="py-2 pr-4 text-gray-500">"right"</td>
                <td className="py-2 text-gray-600">
                  Position of the expand/collapse icon
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  buttonProps
                </td>
                <td className="py-2 pr-4 text-gray-600">ButtonProps</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Additional props passed to the Button component
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Accordion Styling Props
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          All styling is controlled via className props. No default styles are
          applied - you have full control over the appearance.
        </p>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  accordionClassName
                </td>
                <td className="py-2 text-gray-600">Root accordion container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  itemClassName
                </td>
                <td className="py-2 text-gray-600">
                  Each accordion item wrapper (use for borders, spacing)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  buttonClassName
                </td>
                <td className="py-2 text-gray-600">
                  Accordion header button (padding, hover, focus styles)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  panelClassName
                </td>
                <td className="py-2 text-gray-600">
                  Accordion panel container (animated)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  contentClassName
                </td>
                <td className="py-2 text-gray-600">
                  Panel content wrapper (padding, text styles). Defaults to "px-4
                  py-4"
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  titleClassName
                </td>
                <td className="py-2 text-gray-600">
                  Title text element (font, color, alignment)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  iconClassName
                </td>
                <td className="py-2 text-gray-600">
                  Expand/collapse icon (size, color)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Shimmer Styling Props
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Customize the loading shimmer appearance with these className props.
        </p>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  shimmerClassName
                </td>
                <td className="py-2 text-gray-600">
                  Root shimmer container (falls back to accordionClassName)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  shimmerItemClassName
                </td>
                <td className="py-2 text-gray-600">
                  Each shimmer item wrapper (borders, spacing)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  shimmerHeaderClassName
                </td>
                <td className="py-2 text-gray-600">
                  Shimmer header row (padding, layout)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  shimmerTitleClassName
                </td>
                <td className="py-2 text-gray-600">
                  Shimmer title placeholder (size, color, animation)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  shimmerIconClassName
                </td>
                <td className="py-2 text-gray-600">
                  Shimmer icon placeholder (size, color, animation)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  shimmerContentClassName
                </td>
                <td className="py-2 text-gray-600">
                  Shimmer content area (padding, spacing)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  shimmerLineClassName
                </td>
                <td className="py-2 text-gray-600">
                  Shimmer content lines (height, color, animation)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          AccordionShimmer Props
        </h2>
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
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Container class for shimmer
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">itemCount</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">5</td>
                <td className="py-2 text-gray-600">
                  Number of shimmer items to display
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showExpandedItems
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">2</td>
                <td className="py-2 text-gray-600">
                  Number of items to show as expanded (with content shimmer)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  itemClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Each shimmer item wrapper
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  headerClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Shimmer header row</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  titleClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Shimmer title placeholder element
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  iconClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Shimmer icon placeholder element
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  contentClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Shimmer expanded content area
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  lineClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Shimmer content line elements
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Exported Icons</h2>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Icon
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  ChevronDownIcon
                </td>
                <td className="py-2 text-gray-600">
                  Default collapse icon (rotates on expand)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  ChevronUpIcon
                </td>
                <td className="py-2 text-gray-600">Alternative expand icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">PlusIcon</td>
                <td className="py-2 text-gray-600">
                  Plus icon for collapsed state
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">MinusIcon</td>
                <td className="py-2 text-gray-600">
                  Minus icon for expanded state
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Import icons from the Accordion component:{" "}
          <code className="bg-gray-100 px-1 rounded">
            {"import { PlusIcon, MinusIcon } from '../../components/Accordion'"}
          </code>
        </p>
      </section>
    </div>
  );
};

export default AccordionDemo;
