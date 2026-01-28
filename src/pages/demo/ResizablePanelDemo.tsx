import { useState } from "react";
import ResizablePanel from "../../components/ResizablePanel";

const ResizablePanelDemo = () => {
  const [width1, setWidth1] = useState(300);
  const [width2, setWidth2] = useState(350);
  const [width3, setWidth3] = useState(250);
  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [rightPanelWidth, setRightPanelWidth] = useState(250);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resizable Panel
        </h1>
        <p className="text-gray-600 mb-8">
          A panel component that can be resized by dragging its edge.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Right Resize (Default)
        </h2>
        <p className="text-gray-600 text-sm">
          Drag the right edge to resize the panel.
        </p>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <ResizablePanel
            initialWidth={width1}
            minWidth={200}
            maxWidth={500}
            onWidthChange={setWidth1}
            resizeDirection="right"
            className="h-40 bg-blue-50 rounded-lg border border-blue-200"
            resizeHandleClassName="bg-blue-300 hover:bg-blue-500 transition-colors"
          >
            <div className="p-4">
              <p className="text-blue-800 font-medium">Right Resizable Panel</p>
              <p className="text-blue-600 text-sm mt-2">
                Current width: {width1}px
              </p>
              <p className="text-blue-600 text-sm">Min: 200px | Max: 500px</p>
            </div>
          </ResizablePanel>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Left Resize</h2>
        <p className="text-gray-600 text-sm">
          Drag the left edge to resize the panel.
        </p>
        <div className="border border-gray-200 rounded-lg p-4 bg-white flex justify-end">
          <ResizablePanel
            initialWidth={width2}
            minWidth={200}
            maxWidth={600}
            onWidthChange={setWidth2}
            resizeDirection="left"
            className="h-40 bg-green-50 rounded-lg border border-green-200"
            resizeHandleClassName="bg-green-300 hover:bg-green-500 transition-colors"
          >
            <div className="p-4">
              <p className="text-green-800 font-medium">Left Resizable Panel</p>
              <p className="text-green-600 text-sm mt-2">
                Current width: {width2}px
              </p>
              <p className="text-green-600 text-sm">Min: 200px | Max: 600px</p>
            </div>
          </ResizablePanel>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Side-by-Side Panels
        </h2>
        <p className="text-gray-600 text-sm">
          Two resizable panels side by side, simulating a split view layout.
        </p>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex h-64">
            <ResizablePanel
              initialWidth={width3}
              minWidth={150}
              maxWidth={400}
              onWidthChange={setWidth3}
              resizeDirection="right"
              className="h-full bg-purple-50 border border-purple-200 rounded-l-lg"
              resizeHandleClassName="bg-purple-300 hover:bg-purple-500 transition-colors"
            >
              <div className="p-4">
                <p className="text-purple-800 font-medium">Sidebar</p>
                <p className="text-purple-600 text-sm mt-2">
                  Width: {width3}px
                </p>
                <ul className="mt-4 space-y-2 text-purple-700 text-sm">
                  <li className="px-2 py-1 bg-purple-100 rounded">Item 1</li>
                  <li className="px-2 py-1 bg-purple-100 rounded">Item 2</li>
                  <li className="px-2 py-1 bg-purple-100 rounded">Item 3</li>
                </ul>
              </div>
            </ResizablePanel>
            <div className="flex-1 bg-gray-50 border border-gray-200 border-l-0 rounded-r-lg p-4">
              <p className="text-gray-800 font-medium">Main Content</p>
              <p className="text-gray-600 text-sm mt-2">
                This area expands as the sidebar shrinks.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Three-Segment Layout
        </h2>
        <p className="text-gray-600 text-sm">
          Left and right panels are resizable, center expands to fill remaining
          space.
        </p>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex h-80">
            <ResizablePanel
              initialWidth={leftPanelWidth}
              minWidth={150}
              maxWidth={350}
              onWidthChange={setLeftPanelWidth}
              resizeDirection="right"
              className="h-full bg-indigo-50 border border-indigo-200 rounded-l-lg"
              resizeHandleClassName="bg-indigo-300 hover:bg-indigo-500 transition-colors"
            >
              <div className="p-4 h-full flex flex-col">
                <p className="text-indigo-800 font-medium">Left Panel</p>
                <p className="text-indigo-600 text-sm mt-2">
                  Width: {leftPanelWidth}px
                </p>
                <div className="mt-4 flex-1 space-y-2">
                  <div className="px-3 py-2 bg-indigo-100 rounded text-indigo-700 text-sm">
                    Navigation Item 1
                  </div>
                  <div className="px-3 py-2 bg-indigo-100 rounded text-indigo-700 text-sm">
                    Navigation Item 2
                  </div>
                  <div className="px-3 py-2 bg-indigo-100 rounded text-indigo-700 text-sm">
                    Navigation Item 3
                  </div>
                </div>
              </div>
            </ResizablePanel>

            <div className="flex-1 bg-gray-50 border-y border-gray-200 p-4 flex flex-col">
              <p className="text-gray-800 font-medium">Center Panel</p>
              <p className="text-gray-600 text-sm mt-2">
                Flexible width - expands to fill available space
              </p>
              <div className="mt-4 flex-1 bg-white rounded border border-gray-200 p-4">
                <p className="text-gray-500 text-sm">Main content area</p>
              </div>
            </div>

            <ResizablePanel
              initialWidth={rightPanelWidth}
              minWidth={150}
              maxWidth={350}
              onWidthChange={setRightPanelWidth}
              resizeDirection="left"
              className="h-full bg-teal-50 border border-teal-200 rounded-r-lg"
              resizeHandleClassName="bg-teal-300 hover:bg-teal-500 transition-colors"
            >
              <div className="p-4 h-full flex flex-col">
                <p className="text-teal-800 font-medium">Right Panel</p>
                <p className="text-teal-600 text-sm mt-2">
                  Width: {rightPanelWidth}px
                </p>
                <div className="mt-4 flex-1 space-y-2">
                  <div className="px-3 py-2 bg-teal-100 rounded text-teal-700 text-sm">
                    Details Section
                  </div>
                  <div className="px-3 py-2 bg-teal-100 rounded text-teal-700 text-sm">
                    Properties
                  </div>
                  <div className="px-3 py-2 bg-teal-100 rounded text-teal-700 text-sm">
                    Actions
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Custom Styling</h2>
        <p className="text-gray-600 text-sm">
          Panel with custom handle styling.
        </p>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <ResizablePanel
            initialWidth={300}
            minWidth={200}
            maxWidth={500}
            resizeDirection="right"
            className="h-32 bg-linear-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200"
            resizeHandleClassName="bg-gradient-to-b from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 transition-colors rounded-full"
          >
            <div className="p-4">
              <p className="text-orange-800 font-medium">Styled Handle</p>
              <p className="text-orange-600 text-sm mt-2">
                Custom gradient handle styling
              </p>
            </div>
          </ResizablePanel>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">ResizablePanel Props</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Prop
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Type
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Default
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-mono text-blue-600">children</td>
                <td className="px-4 py-3 text-gray-600">ReactNode</td>
                <td className="px-4 py-3 text-gray-500">-</td>
                <td className="px-4 py-3 text-gray-600">
                  Content to render inside the panel
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-blue-600">
                  initialWidth
                </td>
                <td className="px-4 py-3 text-gray-600">number</td>
                <td className="px-4 py-3 text-gray-500">-</td>
                <td className="px-4 py-3 text-gray-600">
                  Initial width of the panel in pixels
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-blue-600">minWidth</td>
                <td className="px-4 py-3 text-gray-600">number</td>
                <td className="px-4 py-3 text-gray-500">200</td>
                <td className="px-4 py-3 text-gray-600">
                  Minimum width constraint
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-blue-600">maxWidth</td>
                <td className="px-4 py-3 text-gray-600">number</td>
                <td className="px-4 py-3 text-gray-500">800</td>
                <td className="px-4 py-3 text-gray-600">
                  Maximum width constraint
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-blue-600">
                  onWidthChange
                </td>
                <td className="px-4 py-3 text-gray-600">
                  (width: number) =&gt; void
                </td>
                <td className="px-4 py-3 text-gray-500">-</td>
                <td className="px-4 py-3 text-gray-600">
                  Callback fired when width changes
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-blue-600">
                  resizeDirection
                </td>
                <td className="px-4 py-3 text-gray-600">"left" | "right"</td>
                <td className="px-4 py-3 text-gray-500">"right"</td>
                <td className="px-4 py-3 text-gray-600">
                  Which edge has the resize handle
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Styling Props</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Prop
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Type
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Default
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-mono text-blue-600">className</td>
                <td className="px-4 py-3 text-gray-600">string</td>
                <td className="px-4 py-3 text-gray-500">""</td>
                <td className="px-4 py-3 text-gray-600">
                  CSS class for the panel container
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-blue-600">
                  resizeHandleClassName
                </td>
                <td className="px-4 py-3 text-gray-600">string</td>
                <td className="px-4 py-3 text-gray-500">""</td>
                <td className="px-4 py-3 text-gray-600">
                  CSS class for the resize handle
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ResizablePanelDemo;
