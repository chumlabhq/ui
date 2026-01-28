import { useState } from "react";
import { Pagination } from "../../components/Pagination";
import { Section, ComponentHeader } from "./components";

// Custom Arrow Icons
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const CaretDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

// Double Arrow Icons
const DoubleArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);

const DoubleArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);

const PaginationDemo = () => {
  // Basic pagination state
  const [basicPage, setBasicPage] = useState(1);

  // With rows per page
  const [rowsPage, setRowsPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Styled pagination
  const [styledPage, setStyledPage] = useState(1);
  const [styledRowsPerPage, setStyledRowsPerPage] = useState(10);

  // Many pages pagination
  const [manyPagesPage, setManyPagesPage] = useState(1);

  // Custom row options
  const [customRowsPage, setCustomRowsPage] = useState(1);
  const [customRowsPerPage, setCustomRowsPerPage] = useState(20);

  // Dark theme
  const [darkPage, setDarkPage] = useState(3);
  const [darkRowsPerPage, setDarkRowsPerPage] = useState(25);

  // Compact pagination
  const [compactPage, setCompactPage] = useState(1);

  // Custom icons pagination
  const [customIconsPage, setCustomIconsPage] = useState(1);
  const [customIconsRowsPerPage, setCustomIconsRowsPerPage] = useState(10);

  // Double arrow icons pagination
  const [doubleArrowPage, setDoubleArrowPage] = useState(1);

  return (
    <>
      <ComponentHeader
        title="Pagination"
        description="A flexible pagination component with optional rows per page selector. Can be used standalone or with tables."
      />

      <Section title="Basic Pagination">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Simple pagination without rows per page selector. Current page: {basicPage}
          </p>
          <Pagination
            currentPage={basicPage}
            totalPages={5}
            onPageChange={setBasicPage}
            containerClassName="flex items-center gap-2"
            navButtonClassName="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            pageButtonClassName="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50"
            activePageButtonClassName="px-3 py-1 rounded-lg bg-blue-600 text-white"
            ellipsisClassName="px-2 text-gray-400"
            prevIconClassName="w-5 h-5 text-gray-600"
            nextIconClassName="w-5 h-5 text-gray-600"
          />
        </div>
      </Section>

      <Section title="With Rows Per Page Selector">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Shows {rowsPerPage} rows per page, page {rowsPage} of {Math.ceil(100 / rowsPerPage)}
          </p>
          <Pagination
            currentPage={rowsPage}
            totalPages={Math.ceil(100 / rowsPerPage)}
            rowsPerPage={rowsPerPage}
            onPageChange={setRowsPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows);
              setRowsPage(1);
            }}
            showRowsPerPage={true}
            containerClassName="flex items-center justify-between gap-4"
            rowSelectorClassName="flex items-center gap-2"
            rowSelectorDropdownWrapperClassName="relative"
            rowSelectorButtonClassName="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
            rowSelectorDropdownClassName="absolute bottom-full mb-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10"
            rowSelectorOptionClassName="px-4 py-1.5 hover:bg-gray-50 w-full text-left data-[selected]:bg-blue-50 data-[selected]:text-blue-600"
            labelClassName="text-sm text-gray-600"
            navContainerClassName="flex items-center gap-2"
            navButtonClassName="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            pageButtonClassName="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50"
            activePageButtonClassName="px-3 py-1 rounded-lg bg-blue-600 text-white"
            ellipsisClassName="px-2 text-gray-400"
            prevIconClassName="w-5 h-5 text-gray-600"
            nextIconClassName="w-5 h-5 text-gray-600"
            dropdownIconClassName="w-4 h-4 text-gray-500"
          />
        </div>
      </Section>

      <Section title="Custom Icons">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Using custom arrow icons instead of default chevrons
          </p>
          <Pagination
            currentPage={customIconsPage}
            totalPages={Math.ceil(100 / customIconsRowsPerPage)}
            rowsPerPage={customIconsRowsPerPage}
            onPageChange={setCustomIconsPage}
            onRowsPerPageChange={(rows) => {
              setCustomIconsRowsPerPage(rows);
              setCustomIconsPage(1);
            }}
            showRowsPerPage={true}
            prevIcon={ArrowLeftIcon}
            nextIcon={ArrowRightIcon}
            dropdownIcon={CaretDownIcon}
            containerClassName="flex items-center justify-between gap-4"
            rowSelectorClassName="flex items-center gap-2"
            rowSelectorDropdownWrapperClassName="relative"
            rowSelectorButtonClassName="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
            rowSelectorDropdownClassName="absolute bottom-full mb-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10"
            rowSelectorOptionClassName="px-4 py-1.5 hover:bg-gray-50 w-full text-left data-[selected]:bg-blue-50 data-[selected]:text-blue-600"
            labelClassName="text-sm text-gray-600"
            navContainerClassName="flex items-center gap-2"
            navButtonClassName="p-2 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
            pageButtonClassName="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50"
            activePageButtonClassName="px-3 py-1 rounded-lg bg-indigo-600 text-white"
            ellipsisClassName="px-2 text-gray-400"
            prevIconClassName="w-5 h-5 text-indigo-600"
            nextIconClassName="w-5 h-5 text-indigo-600"
            dropdownIconClassName="w-4 h-4 text-gray-500"
          />
        </div>
      </Section>

      <Section title="Double Arrow Icons">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Using double arrow icons for a different look
          </p>
          <Pagination
            currentPage={doubleArrowPage}
            totalPages={20}
            onPageChange={setDoubleArrowPage}
            prevIcon={DoubleArrowLeftIcon}
            nextIcon={DoubleArrowRightIcon}
            containerClassName="flex items-center gap-2"
            navButtonClassName="p-2 rounded-full border border-green-200 bg-green-50 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
            pageButtonClassName="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50"
            activePageButtonClassName="px-3 py-1 rounded-lg bg-green-600 text-white"
            ellipsisClassName="px-2 text-gray-400"
            prevIconClassName="w-5 h-5 text-green-600"
            nextIconClassName="w-5 h-5 text-green-600"
          />
        </div>
      </Section>

      <Section title="Many Pages">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Pagination with many pages shows ellipsis. Current page: {manyPagesPage}
          </p>
          <Pagination
            currentPage={manyPagesPage}
            totalPages={50}
            onPageChange={setManyPagesPage}
            containerClassName="flex items-center gap-2"
            navButtonClassName="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            pageButtonClassName="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50"
            activePageButtonClassName="px-3 py-1 rounded-lg bg-blue-600 text-white"
            ellipsisClassName="px-2 text-gray-400"
            prevIconClassName="w-5 h-5 text-gray-600"
            nextIconClassName="w-5 h-5 text-gray-600"
          />
        </div>
      </Section>

      <Section title="Custom Row Options">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Custom row options: [20, 40, 60, 80, 100]
          </p>
          <Pagination
            currentPage={customRowsPage}
            totalPages={Math.ceil(200 / customRowsPerPage)}
            rowsPerPage={customRowsPerPage}
            rowOptions={[20, 40, 60, 80, 100]}
            onPageChange={setCustomRowsPage}
            onRowsPerPageChange={(rows) => {
              setCustomRowsPerPage(rows);
              setCustomRowsPage(1);
            }}
            showRowsPerPage={true}
            rowsPerPageLabel="items"
            containerClassName="flex items-center justify-between gap-4"
            rowSelectorClassName="flex items-center gap-2"
            rowSelectorDropdownWrapperClassName="relative"
            rowSelectorButtonClassName="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
            rowSelectorDropdownClassName="absolute bottom-full mb-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10"
            rowSelectorOptionClassName="px-4 py-1.5 hover:bg-gray-50 w-full text-left data-[selected]:bg-blue-50 data-[selected]:text-blue-600"
            labelClassName="text-sm text-gray-600"
            navContainerClassName="flex items-center gap-2"
            navButtonClassName="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            pageButtonClassName="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50"
            activePageButtonClassName="px-3 py-1 rounded-lg bg-blue-600 text-white"
            ellipsisClassName="px-2 text-gray-400"
            prevIconClassName="w-5 h-5 text-gray-600"
            nextIconClassName="w-5 h-5 text-gray-600"
            dropdownIconClassName="w-4 h-4 text-gray-500"
          />
        </div>
      </Section>

      <Section title="Styled Pagination">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Custom styled pagination with rounded buttons
          </p>
          <Pagination
            currentPage={styledPage}
            totalPages={10}
            rowsPerPage={styledRowsPerPage}
            onPageChange={setStyledPage}
            onRowsPerPageChange={(rows) => {
              setStyledRowsPerPage(rows);
              setStyledPage(1);
            }}
            showRowsPerPage={true}
            containerClassName="flex items-center justify-between gap-6 bg-gray-50 p-4 rounded-xl"
            rowSelectorClassName="flex items-center gap-2"
            rowSelectorDropdownWrapperClassName="relative"
            rowSelectorButtonClassName="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow"
            rowSelectorDropdownClassName="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-10 min-w-[80px]"
            rowSelectorOptionClassName="px-4 py-2 hover:bg-purple-50 w-full text-left data-[selected]:bg-purple-100 data-[selected]:text-purple-700"
            labelClassName="text-sm font-medium text-gray-700"
            navContainerClassName="flex items-center gap-1"
            navButtonClassName="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            pageButtonClassName="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow flex items-center justify-center"
            activePageButtonClassName="w-10 h-10 rounded-full bg-purple-600 text-white shadow-md flex items-center justify-center"
            pageButtonsContainerClassName="flex items-center gap-1"
            ellipsisClassName="px-2 text-gray-400"
            prevIconClassName="w-5 h-5 text-gray-600"
            nextIconClassName="w-5 h-5 text-gray-600"
            dropdownIconClassName="w-4 h-4 text-gray-500"
          />
        </div>
      </Section>

      <Section title="Dark Theme">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Dark themed pagination
          </p>
          <div className="bg-gray-900 p-6 rounded-xl">
            <Pagination
              currentPage={darkPage}
              totalPages={15}
              rowsPerPage={darkRowsPerPage}
              onPageChange={setDarkPage}
              onRowsPerPageChange={(rows) => {
                setDarkRowsPerPage(rows);
                setDarkPage(1);
              }}
              showRowsPerPage={true}
              containerClassName="flex items-center justify-between gap-4"
              rowSelectorClassName="flex items-center gap-2"
              rowSelectorDropdownWrapperClassName="relative"
              rowSelectorButtonClassName="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700"
              rowSelectorDropdownClassName="absolute bottom-full mb-1 left-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-10"
              rowSelectorOptionClassName="px-4 py-1.5 text-gray-200 hover:bg-gray-700 w-full text-left data-[selected]:bg-blue-900 data-[selected]:text-blue-300"
              labelClassName="text-sm text-gray-400"
              navContainerClassName="flex items-center gap-2"
              navButtonClassName="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              pageButtonClassName="px-3 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700"
              activePageButtonClassName="px-3 py-1 rounded-lg bg-blue-600 text-white border border-blue-500"
              ellipsisClassName="px-2 text-gray-500"
              prevIconClassName="w-5 h-5 text-gray-400"
              nextIconClassName="w-5 h-5 text-gray-400"
              dropdownIconClassName="w-4 h-4 text-gray-400"
            />
          </div>
        </div>
      </Section>

      <Section title="Compact Pagination">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Compact size for tight spaces
          </p>
          <Pagination
            currentPage={compactPage}
            totalPages={8}
            onPageChange={setCompactPage}
            containerClassName="flex items-center gap-1"
            navButtonClassName="p-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            pageButtonClassName="px-2 py-0.5 text-sm rounded border border-gray-200 hover:bg-gray-50"
            activePageButtonClassName="px-2 py-0.5 text-sm rounded bg-blue-600 text-white"
            ellipsisClassName="px-1 text-gray-400 text-sm"
            prevIconClassName="w-4 h-4 text-gray-600"
            nextIconClassName="w-4 h-4 text-gray-600"
          />
        </div>
      </Section>

      <Section title="Pagination Props">
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
                <td className="py-2 pr-4 font-mono text-blue-600">currentPage</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">required</td>
                <td className="py-2 text-gray-600">The current active page</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">totalPages</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">required</td>
                <td className="py-2 text-gray-600">Total number of pages</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onPageChange</td>
                <td className="py-2 pr-4 text-gray-600">(page: number) =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">required</td>
                <td className="py-2 text-gray-600">Callback when page changes</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showRowsPerPage</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Show the rows per page selector</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">rowsPerPage</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Current rows per page value (required when showRowsPerPage is true)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onRowsPerPageChange</td>
                <td className="py-2 pr-4 text-gray-600">(rows: number) =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Callback when rows per page changes</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">rowOptions</td>
                <td className="py-2 pr-4 text-gray-600">number[]</td>
                <td className="py-2 pr-4 text-gray-500">[5, 10, 25, 50, 100]</td>
                <td className="py-2 text-gray-600">Available options for rows per page</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">rowsPerPageLabel</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"rows"</td>
                <td className="py-2 text-gray-600">Label shown after the rows selector</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Custom Icon Props">
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
                <td className="py-2 pr-4 font-mono text-blue-600">prevIcon</td>
                <td className="py-2 pr-4 text-gray-600">ComponentType | ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">ChevronLeftIcon</td>
                <td className="py-2 text-gray-600">Custom icon component for previous button</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">nextIcon</td>
                <td className="py-2 pr-4 text-gray-600">ComponentType | ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">ChevronRightIcon</td>
                <td className="py-2 text-gray-600">Custom icon component for next button</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">dropdownIcon</td>
                <td className="py-2 pr-4 text-gray-600">ComponentType | ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">ChevronDownIcon</td>
                <td className="py-2 text-gray-600">Custom icon component for dropdown button</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Styling Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Prop</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">containerClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for the outer container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">rowSelectorClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for the rows per page selector container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">rowSelectorButtonClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for the rows selector button</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">rowSelectorDropdownClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for the rows dropdown menu</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">rowSelectorDropdownWrapperClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for the dropdown wrapper (default: "relative")</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">rowSelectorOptionClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for each dropdown option</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">labelClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for "Show" and rows label text</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">navContainerClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for the navigation container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">navButtonClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for prev/next buttons</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">pageButtonClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for page number buttons</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">activePageButtonClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for the active page button</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">pageButtonsContainerClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for the page buttons container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">ellipsisClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for ellipsis element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">prevIconClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for previous icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">nextIconClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for next icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">dropdownIconClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">CSS class for dropdown icon</td>
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
                <td className="py-2 pr-4 font-mono text-blue-600">data-disabled</td>
                <td className="py-2 pr-4 text-gray-600">nav buttons</td>
                <td className="py-2 text-gray-600">Present when prev/next button is disabled</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">data-selected</td>
                <td className="py-2 pr-4 text-gray-600">row options</td>
                <td className="py-2 text-gray-600">Present on the currently selected row option</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">aria-current="page"</td>
                <td className="py-2 pr-4 text-gray-600">page buttons</td>
                <td className="py-2 text-gray-600">Present on the active page button</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">aria-expanded</td>
                <td className="py-2 pr-4 text-gray-600">rows selector button</td>
                <td className="py-2 text-gray-600">Indicates if dropdown is open</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default PaginationDemo;
