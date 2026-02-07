import { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
  AvatarShimmer,
  AvatarGroupShimmer,
} from "../../components/Avatar";
import { useTheme } from "./ThemeContext";
import { Section, CodeBlock, DemoWrapper } from "./components";

const subtleColors = {
  backgrounds: [
    "#e0e7ff",
    "#dbeafe",
    "#d1fae5",
    "#fef9c3",
    "#fce7f3",
    "#ede9fe",
    "#cffafe",
    "#fef2f2",
  ],
  text: [
    "#4f46e5",
    "#2563eb",
    "#059669",
    "#ca8a04",
    "#db2777",
    "#7c3aed",
    "#0891b2",
    "#ef4444",
  ],
};

const AvatarDemo = () => {
  const { isDarkMode } = useTheme();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="space-y-16">
      <header>
        <h1
          className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Avatar
        </h1>
        <p
          className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          A flexible avatar component for displaying user images, initials, or
          fallback content. Supports status indicators, badges, tooltips,
          auto-generated colors, and grouping.
        </p>

        <div className="mt-6">
          <h3
            className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import {
  Avatar,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
} from "@kern-ui/avatar";`}
          />
        </div>
      </header>

      <div className="space-y-12">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Examples
        </h2>

        <Section
          title="Basic Usage"
          description="Avatar with image, initials, and fallback content."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <Avatar
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
                alt="John Doe"
                name="John Doe"
              />
              <Avatar name="Jane Smith" autoColor colors={subtleColors} />
              <Avatar name="Alex" autoColor colors={subtleColors} />
              <Avatar
                fallback={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                className={isDarkMode ? "bg-gray-700" : "bg-gray-100"}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Loading State"
          description="Use the loading prop to show a shimmer placeholder while data is being fetched."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <Avatar loading />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  loading=true
                </p>
              </div>
              <div className="text-center">
                <Avatar loading size="lg" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Large loading
                </p>
              </div>
              <div className="text-center">
                <Avatar loading shape="rounded" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Rounded loading
                </p>
              </div>
              <div className="text-center">
                <Avatar loading shape="square" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Square loading
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Shimmer (Standalone)"
          description="Use AvatarShimmer component directly for custom loading layouts."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <AvatarShimmer size="xs" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  xs
                </p>
              </div>
              <div className="text-center">
                <AvatarShimmer size="sm" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  sm
                </p>
              </div>
              <div className="text-center">
                <AvatarShimmer size="md" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  md
                </p>
              </div>
              <div className="text-center">
                <AvatarShimmer size="lg" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  lg
                </p>
              </div>
              <div className="text-center">
                <AvatarShimmer size="xl" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  xl
                </p>
              </div>
              <div className="text-center">
                <AvatarShimmer shape="rounded" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  rounded
                </p>
              </div>
              <div className="text-center">
                <AvatarShimmer shape="square" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  square
                </p>
              </div>
              <div className="text-center">
                <AvatarShimmer animate={false} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  no animation
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Shimmer"
          description="Use AvatarGroupShimmer for loading group placeholders."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Default (3 avatars)
                </p>
                <AvatarGroupShimmer />
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  5 avatars with count
                </p>
                <AvatarGroupShimmer count={5} showCount />
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Large size with custom spacing
                </p>
                <AvatarGroupShimmer count={4} size="lg" spacing={-12} />
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Rounded shape
                </p>
                <AvatarGroupShimmer count={4} shape="rounded" />
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Custom ring color (matches dark background)
                </p>
                <div className="p-4 rounded-lg bg-gray-800">
                  <AvatarGroupShimmer count={4} ringColor="#1f2937" />
                </div>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  No animation
                </p>
                <AvatarGroupShimmer count={3} animate={false} />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Sizes"
          description="Available size presets: xs, sm, md, lg, xl, or custom number."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-end gap-4">
              <div className="text-center">
                <Avatar name="XS" size="xs" autoColor colors={subtleColors} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  xs (24px)
                </p>
              </div>
              <div className="text-center">
                <Avatar name="SM" size="sm" autoColor colors={subtleColors} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  sm (32px)
                </p>
              </div>
              <div className="text-center">
                <Avatar name="MD" size="md" autoColor colors={subtleColors} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  md (40px)
                </p>
              </div>
              <div className="text-center">
                <Avatar name="LG" size="lg" autoColor colors={subtleColors} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  lg (48px)
                </p>
              </div>
              <div className="text-center">
                <Avatar name="XL" size="xl" autoColor colors={subtleColors} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  xl (64px)
                </p>
              </div>
              <div className="text-center">
                <Avatar name="80" size={80} autoColor colors={subtleColors} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  custom (80px)
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Shapes"
          description="Available shapes: circle (default), rounded, and square."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <Avatar
                  name="Circle"
                  shape="circle"
                  autoColor
                  size="lg"
                  colors={subtleColors}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  circle
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  name="Rounded"
                  shape="rounded"
                  autoColor
                  size="lg"
                  colors={subtleColors}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  rounded
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  name="Square"
                  shape="square"
                  autoColor
                  size="lg"
                  colors={subtleColors}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  square
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Auto-Generated Colors"
          description="Enable autoColor to generate consistent colors based on the name."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-3 flex-wrap">
              <Avatar name="Alice" autoColor colors={subtleColors} />
              <Avatar name="Bob" autoColor colors={subtleColors} />
              <Avatar name="Charlie" autoColor colors={subtleColors} />
              <Avatar name="Diana" autoColor colors={subtleColors} />
              <Avatar name="Edward" autoColor colors={subtleColors} />
              <Avatar name="Fiona" autoColor colors={subtleColors} />
              <Avatar name="George" autoColor colors={subtleColors} />
              <Avatar name="Hannah" autoColor colors={subtleColors} />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Color Palette"
          description="Provide custom color palettes for auto-generation."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Subtle pastel palette
                </p>
                <div className="flex items-center gap-3">
                  <Avatar
                    name="Custom 1"
                    autoColor
                    colors={{
                      backgrounds: ["#e0f2fe", "#fce7f3", "#dcfce7"],
                      text: ["#0369a1", "#be185d", "#15803d"],
                    }}
                  />
                  <Avatar
                    name="Custom 2"
                    autoColor
                    colors={{
                      backgrounds: ["#e0f2fe", "#fce7f3", "#dcfce7"],
                      text: ["#0369a1", "#be185d", "#15803d"],
                    }}
                  />
                  <Avatar
                    name="Custom 3"
                    autoColor
                    colors={{
                      backgrounds: ["#e0f2fe", "#fce7f3", "#dcfce7"],
                      text: ["#0369a1", "#be185d", "#15803d"],
                    }}
                  />
                </div>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Brand colors
                </p>
                <div className="flex items-center gap-3">
                  <Avatar
                    name="Brand A"
                    autoColor
                    colors={{
                      backgrounds: ["#1e40af", "#7c3aed", "#0e7490"],
                      text: ["#ffffff", "#ffffff", "#ffffff"],
                    }}
                  />
                  <Avatar
                    name="Brand B"
                    autoColor
                    colors={{
                      backgrounds: ["#1e40af", "#7c3aed", "#0e7490"],
                      text: ["#ffffff", "#ffffff", "#ffffff"],
                    }}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Text Styling"
          description="Customize initials with textClassName and textStyle props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <Avatar
                name="Bold"
                autoColor
                colors={subtleColors}
                textClassName="font-bold"
              />
              <Avatar
                name="Light"
                autoColor
                colors={subtleColors}
                textClassName="font-light"
              />
              <Avatar
                name="Italic"
                autoColor
                colors={subtleColors}
                textStyle={{ fontStyle: "italic" }}
              />
              <Avatar
                name="Custom"
                className={isDarkMode ? "bg-gray-700" : "bg-gray-100"}
                textStyle={{ color: "#6366f1", fontWeight: 600 }}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Bordered Avatars"
          description="Add borders using the bordered prop (true for auto-generated, or custom string)."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <Avatar
                  name="Default"
                  autoColor
                  colors={subtleColors}
                  bordered
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  bordered=true
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  name="Custom"
                  autoColor
                  colors={subtleColors}
                  bordered="2px solid #a5b4fc"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  custom border
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
                  name="With Image"
                  bordered="2px solid #86efac"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  with image
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Status Indicator"
          description="Show online/offline/away/busy status with the status prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <Avatar
                  name="Online"
                  autoColor
                  colors={subtleColors}
                  status="online"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  online
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  name="Offline"
                  autoColor
                  colors={subtleColors}
                  status="offline"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  offline
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  name="Away"
                  autoColor
                  colors={subtleColors}
                  status="away"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  away
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  name="Busy"
                  autoColor
                  colors={subtleColors}
                  status="busy"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  busy
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Status Position"
          description="Customize status indicator position using a config object."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <Avatar
                  name="BR"
                  autoColor
                  colors={subtleColors}
                  status={{ type: "online", position: "bottom-right" }}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  bottom-right
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  name="BL"
                  autoColor
                  colors={subtleColors}
                  status={{ type: "online", position: "bottom-left" }}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  bottom-left
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  name="TR"
                  autoColor
                  colors={subtleColors}
                  status={{ type: "online", position: "top-right" }}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  top-right
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  name="TL"
                  autoColor
                  colors={subtleColors}
                  status={{ type: "online", position: "top-left" }}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  top-left
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Status Color"
          description="Override default status colors with the color property."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <Avatar
                name="Purple"
                autoColor
                colors={subtleColors}
                status={{ type: "online", color: "#8b5cf6" }}
              />
              <Avatar
                name="Pink"
                autoColor
                colors={subtleColors}
                status={{ type: "online", color: "#ec4899" }}
              />
              <Avatar
                name="Cyan"
                autoColor
                colors={subtleColors}
                status={{ type: "online", color: "#06b6d4" }}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Status Styling"
          description="Customize status indicator shape with statusClassName prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <Avatar
                  name="Round"
                  autoColor
                  colors={subtleColors}
                  status="online"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Default (circle)
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  name="Square"
                  autoColor
                  colors={subtleColors}
                  status="online"
                  statusClassName="rounded-sm"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Square
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  name="Ring"
                  autoColor
                  colors={subtleColors}
                  status="online"
                  statusClassName="rounded-full ring-2 ring-white"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  With ring
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Tooltip"
          description="Add tooltips using a string or config object."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <Avatar
                name="Simple"
                autoColor
                colors={subtleColors}
                tooltip="Simple tooltip"
              />
              <Avatar
                name="Config"
                autoColor
                colors={subtleColors}
                tooltip={{
                  content: "Custom tooltip with options",
                  side: "bottom",
                  sideOffset: 8,
                }}
              />
              <Avatar
                name="Delayed"
                autoColor
                colors={subtleColors}
                tooltip={{
                  content: "Appears after 500ms",
                  delayDuration: 500,
                }}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Image Configuration"
          description="Configure image loading behavior with imageConfig prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <Avatar
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
                  name="Lazy"
                  imageConfig={{ loading: "lazy" }}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  lazy (default)
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
                  name="Eager"
                  imageConfig={{ loading: "eager", decoding: "sync" }}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  eager load
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
                  name="High Priority"
                  imageConfig={{ fetchPriority: "high", loading: "eager" }}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  high priority
                </p>
              </div>
              <div className="text-center">
                <Avatar
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
                  name="Responsive"
                  imageConfig={{
                    srcSet:
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop 80w, https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop 150w",
                    sizes: "(max-width: 768px) 80px, 150px",
                  }}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  responsive srcSet
                </p>
              </div>
            </div>
          </DemoWrapper>
          <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}>
            <p className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}>
              <strong>Cached images:</strong> When a browser-cached image is used, the Avatar skips the fade-in animation 
              and renders instantly — no flash or opacity transition. This is handled automatically via a synchronous 
              <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>img.complete</code> check on mount.
            </p>
          </div>
        </Section>

        <Section
          title="Image Error Handling"
          description="Graceful fallback when image fails to load with onError callback."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <Avatar
                  src={
                    imageError ? "" : "https://invalid-url.example/image.jpg"
                  }
                  name="John Doe"
                  autoColor
                  colors={subtleColors}
                  onError={() => setImageError(true)}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Falls back to initials
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Clickable Avatars"
          description="Make avatars interactive by wrapping them in buttons or links."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => alert("Avatar clicked!")}
                className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 rounded-full"
              >
                <Avatar
                  name="Clickable"
                  autoColor
                  colors={subtleColors}
                  tooltip="Click me!"
                />
              </button>
              <a
                href="#avatar-group"
                className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 rounded-full"
              >
                <Avatar
                  name="Link"
                  autoColor
                  colors={subtleColors}
                  tooltip="Go to Avatar Group section"
                />
              </a>
              <button
                onClick={() => alert("Profile opened!")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <Avatar
                  name="Jane Doe"
                  autoColor
                  colors={subtleColors}
                  status="online"
                />
                <span
                  className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  Jane Doe
                </span>
              </button>
            </div>
          </DemoWrapper>
          <div
            className={`mt-4 p-3 rounded-lg ${
              isDarkMode
                ? "bg-blue-900/30 border border-blue-800"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <p
              className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}
            >
              <strong>About asChild prop:</strong> Avatar components support an{" "}
              <code
                className={`px-1 py-0.5 border rounded text-xs font-mono ${
                  isDarkMode
                    ? "bg-gray-800/80 border-gray-600 text-gray-300"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                asChild
              </code>{" "}
              prop for polymorphic rendering, which merges Avatar props onto a
              child element. However, for clickable avatars, wrapping is
              recommended as it provides better control over focus states, hover
              effects, and accessibility. The{" "}
              <code
                className={`px-1 py-0.5 border rounded text-xs font-mono ${
                  isDarkMode
                    ? "bg-gray-800/80 border-gray-600 text-gray-300"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                asChild
              </code>{" "}
              pattern is more useful for components like AvatarGroupCount where
              you might want to render as a custom element.
            </p>
          </div>
        </Section>

        <Section
          title="Avatar Group"
          description="Group multiple avatars with overlap effect."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Basic group
                </p>
                <AvatarGroup>
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  With max limit (max=3)
                </p>
                <AvatarGroup max={3}>
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                  <Avatar name="Edward" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Size"
          description="Control all child avatar sizes with the size prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Small group (size="sm")
                </p>
                <AvatarGroup size="sm">
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Large group (size="lg")
                </p>
                <AvatarGroup size="lg">
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Custom size (size=56)
                </p>
                <AvatarGroup size={56}>
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Server-Side Total"
          description="Use total prop when you know the count but don't have all avatar data."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <AvatarGroup max={3} total={150}>
              <Avatar name="Alice" autoColor colors={subtleColors} />
              <Avatar name="Bob" autoColor colors={subtleColors} />
              <Avatar name="Charlie" autoColor colors={subtleColors} />
            </AvatarGroup>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Spacing"
          description="Adjust overlap spacing between avatars."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Default spacing (-8px)
                </p>
                <AvatarGroup>
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Tight spacing (-12px)
                </p>
                <AvatarGroup spacing={-12}>
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  No overlap (8px gap)
                </p>
                <AvatarGroup spacing={8}>
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Ring Color"
          description="Customize the ring/separator color around grouped avatars."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div
                className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
              >
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Default (white)
                </p>
                <AvatarGroup max={3}>
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div className="p-4 rounded-lg bg-indigo-100">
                <p className="text-xs mb-3 text-indigo-600">
                  Matching background (indigo-100)
                </p>
                <AvatarGroup max={3} ringColor="#e0e7ff">
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div className="p-4 rounded-lg bg-gray-800">
                <p className="text-xs mb-3 text-gray-300">
                  Dark background (gray-800)
                </p>
                <AvatarGroup max={3} ringColor="#1f2937">
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Surplus Renderer"
          description="Use renderSurplus to customize the overflow indicator."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Custom text
                </p>
                <AvatarGroup
                  max={3}
                  renderSurplus={(count) => (
                    <span
                      className={`ml-2 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      and {count} others
                    </span>
                  )}
                >
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                  <Avatar name="Edward" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Custom badge style
                </p>
                <AvatarGroup
                  max={3}
                  renderSurplus={(count) => (
                    <div
                      className="ml-1 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-sm font-semibold"
                      style={{ zIndex: 0 }}
                    >
                      +{count}
                    </div>
                  )}
                >
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                  <Avatar name="Edward" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="RTL Support"
          description='Use dir="rtl" for right-to-left layouts.'
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  LTR (default)
                </p>
                <AvatarGroup max={3}>
                  <Avatar name="First" autoColor colors={subtleColors} />
                  <Avatar name="Second" autoColor colors={subtleColors} />
                  <Avatar name="Third" autoColor colors={subtleColors} />
                  <Avatar name="Fourth" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  RTL
                </p>
                <AvatarGroup max={3} dir="rtl">
                  <Avatar name="First" autoColor colors={subtleColors} />
                  <Avatar name="Second" autoColor colors={subtleColors} />
                  <Avatar name="Third" autoColor colors={subtleColors} />
                  <Avatar name="Fourth" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Styling"
          description="Customize the group container with className and style props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  With gap instead of overlap (spacing=0)
                </p>
                <AvatarGroup
                  className="flex items-center gap-2"
                  spacing={0}
                  max={4}
                >
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                  <Avatar name="Edward" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Centered alignment
                </p>
                <AvatarGroup
                  className="flex items-center justify-center"
                  max={4}
                >
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                  <Avatar name="Edward" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Variants"
          description="Available variants: stack (default), grid, and inline."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Stack variant (default)
                </p>
                <AvatarGroup variant="stack" max={4}>
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                  <Avatar name="Edward" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Inline variant
                </p>
                <div>
                  <AvatarGroup
                    variant="inline"
                    max={3}
                    className="inline-flex items-center ml-2"
                  >
                    <Avatar name="Alice" autoColor colors={subtleColors} />
                    <Avatar name="Bob" autoColor colors={subtleColors} />
                    <Avatar name="Charlie" autoColor colors={subtleColors} />
                    <Avatar name="Diana" autoColor colors={subtleColors} />
                  </AvatarGroup>
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Shape and Bordered"
          description="Apply shape and border styles to all children in the group."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Rounded shape for all
                </p>
                <AvatarGroup shape="rounded" max={4}>
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Square shape with border
                </p>
                <AvatarGroup
                  shape="square"
                  bordered="2px solid #6366f1"
                  max={4}
                >
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Reverse Order"
          description="Reverse the display order of avatars."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Normal order
                </p>
                <AvatarGroup max={4}>
                  <Avatar name="First" autoColor colors={subtleColors} />
                  <Avatar name="Second" autoColor colors={subtleColors} />
                  <Avatar name="Third" autoColor colors={subtleColors} />
                  <Avatar name="Fourth" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Reversed order
                </p>
                <AvatarGroup max={4} reverseOrder>
                  <Avatar name="First" autoColor colors={subtleColors} />
                  <Avatar name="Second" autoColor colors={subtleColors} />
                  <Avatar name="Third" autoColor colors={subtleColors} />
                  <Avatar name="Fourth" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Click Handler"
          description="Handle clicks on individual avatars within the group."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <AvatarGroup
              max={4}
              onAvatarClick={(index) =>
                alert(`Clicked avatar at index ${index}`)
              }
            >
              <Avatar name="Alice" autoColor colors={subtleColors} />
              <Avatar name="Bob" autoColor colors={subtleColors} />
              <Avatar name="Charlie" autoColor colors={subtleColors} />
              <Avatar name="Diana" autoColor colors={subtleColors} />
            </AvatarGroup>
            <p
              className={`text-xs mt-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Click any avatar to see the callback in action
            </p>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Gap"
          description="Use gap as an alias for spacing prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-6">
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  gap={4} (positive = no overlap)
                </p>
                <AvatarGroup gap={4} max={4}>
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
              <div>
                <p
                  className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  gap={-16} (more overlap)
                </p>
                <AvatarGroup gap={-16} max={4}>
                  <Avatar name="Alice" autoColor colors={subtleColors} />
                  <Avatar name="Bob" autoColor colors={subtleColors} />
                  <Avatar name="Charlie" autoColor colors={subtleColors} />
                  <Avatar name="Diana" autoColor colors={subtleColors} />
                </AvatarGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Count (Standalone)"
          description="Use AvatarGroupCount independently for custom layouts."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <AvatarGroupCount count={5} />
              <AvatarGroupCount count={99} />
              <AvatarGroupCount count={100} tooltip="View all members" />
              <AvatarGroupCount count={42} size="lg" />
              <AvatarGroupCount count={7} size="sm" />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Count Sizes"
          description="All available size options including custom numeric sizes."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-end gap-4">
              <div className="text-center">
                <AvatarGroupCount count={3} size="xs" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  xs
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={5} size="sm" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  sm
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={8} size="md" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  md
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={12} size="lg" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  lg
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={20} size="xl" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  xl
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={50} size={56} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  56px
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Count Shapes"
          description="Available shapes: circle (default), rounded, and square."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <AvatarGroupCount count={5} shape="circle" size="lg" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  circle
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={10} shape="rounded" size="lg" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  rounded
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={15} shape="square" size="lg" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  square
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Count Bordered"
          description="Add borders using the bordered prop (true for default or custom string)."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <AvatarGroupCount count={5} bordered />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  bordered=true
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={10} bordered="2px solid #6366f1" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  custom border
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount
                  count={15}
                  bordered="2px dashed #10b981"
                  shape="rounded"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  dashed + rounded
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Count Text Styling"
          description="Customize the count text with textClassName and textStyle props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <AvatarGroupCount count={5} textClassName="font-bold" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Bold text
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={10} textClassName="font-light" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Light text
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount
                  count={15}
                  textStyle={{ fontStyle: "italic" }}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Italic
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount
                  count={20}
                  textStyle={{ color: "#ec4899", fontWeight: 700 }}
                  className="font-medium bg-pink-100 text-pink-600 select-none px-2"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Custom color
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Count with Children"
          description="Use children prop to add custom content alongside the count."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <AvatarGroupCount count={5} size="lg">
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </AvatarGroupCount>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  With icon
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount
                  count={10}
                  size="lg"
                  className="font-medium bg-amber-100 text-amber-700 select-none px-2"
                >
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </AvatarGroupCount>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Star icon
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Count Variants"
          description="Available variants: solid (default), outline, and ghost."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <AvatarGroupCount count={5} variant="solid" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  solid
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={10} variant="outline" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  outline
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={15} variant="ghost" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  ghost
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Count Max"
          description="Use max prop to cap the displayed number."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <AvatarGroupCount count={50} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  No max
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={50} max={99} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  max=99 (under)
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={150} max={99} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  max=99 (over)
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={25} max={9} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  max=9 (over)
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Count Show Plus"
          description="Toggle the plus sign prefix using showPlus prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <AvatarGroupCount count={5} showPlus={true} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  showPlus=true (default)
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={5} showPlus={false} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  showPlus=false
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Count Format"
          description="Use a custom format function for the count display."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <AvatarGroupCount count={5} format={(n) => `${n} more`} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Custom text
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount
                  count={1500}
                  format={(n) =>
                    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
                  }
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Abbreviated
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount count={42} format={(n) => `#${n}`} />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  With prefix
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Count Tooltip"
          description="Tooltip with string or configuration object."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <AvatarGroupCount count={5} tooltip="5 more members" />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  String tooltip
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount
                  count={10}
                  tooltip={{
                    content: "View all 10 members",
                    side: "bottom",
                    sideOffset: 8,
                  }}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Config tooltip
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount
                  count={25}
                  tooltip={{
                    content: (
                      <div className="text-center">
                        <p className="font-semibold">25 more members</p>
                        <p className="text-xs opacity-75">Click to view all</p>
                      </div>
                    ),
                    align: "center",
                  }}
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Rich content
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Group Count Styling"
          description="Customize appearance with className and style props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <AvatarGroupCount
                  count={5}
                  className="font-semibold bg-indigo-100 text-indigo-600 select-none px-2"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Indigo theme
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount
                  count={10}
                  className="font-semibold bg-emerald-100 text-emerald-600 select-none px-2"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Emerald theme
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount
                  count={15}
                  className="font-bold bg-linear-to-r from-pink-500 to-violet-500 text-white select-none px-2"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Gradient
                </p>
              </div>
              <div className="text-center">
                <AvatarGroupCount
                  count={20}
                  style={{
                    border: "2px dashed #6366f1",
                    background: "transparent",
                    color: "#6366f1",
                  }}
                  className="font-medium select-none px-2"
                />
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Custom style
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Clickable Avatar Group Count"
          description="Make the count interactive by wrapping it in a button."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <AvatarGroup max={3}>
                <Avatar name="Alice" autoColor colors={subtleColors} />
                <Avatar name="Bob" autoColor colors={subtleColors} />
                <Avatar name="Charlie" autoColor colors={subtleColors} />
                <Avatar name="Diana" autoColor colors={subtleColors} />
                <Avatar name="Edward" autoColor colors={subtleColors} />
              </AvatarGroup>
              <button
                onClick={() => alert("View all members")}
                className="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 rounded-full"
              >
                <AvatarGroupCount count={12} tooltip="Click to view all" />
              </button>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Avatar Badge"
          description="Add notification badges to avatars."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="relative inline-block">
                <Avatar name="John" autoColor colors={subtleColors} />
                <AvatarBadge count={5} />
              </div>
              <div className="relative inline-block">
                <Avatar name="Jane" autoColor colors={subtleColors} />
                <AvatarBadge count={99} />
              </div>
              <div className="relative inline-block">
                <Avatar name="Alex" autoColor colors={subtleColors} />
                <AvatarBadge count={150} max={99} />
              </div>
              <div className="relative inline-block">
                <Avatar name="Sam" autoColor colors={subtleColors} />
                <AvatarBadge dot />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Badge Positions"
          description="Position badges at different corners."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="TR" autoColor colors={subtleColors} />
                  <AvatarBadge count={1} position="top-right" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  top-right
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="TL" autoColor colors={subtleColors} />
                  <AvatarBadge count={2} position="top-left" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  top-left
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="BR" autoColor colors={subtleColors} />
                  <AvatarBadge count={3} position="bottom-right" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  bottom-right
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="BL" autoColor colors={subtleColors} />
                  <AvatarBadge count={4} position="bottom-left" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  bottom-left
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Show Zero Badge"
          description="Use showZero to display badge even when count is 0."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Hidden" autoColor colors={subtleColors} />
                  <AvatarBadge count={0} />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  count=0 (hidden)
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Shown" autoColor colors={subtleColors} />
                  <AvatarBadge count={0} showZero />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  showZero=true
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Badge Sizes"
          description="Available badge sizes: xs, sm, md, lg."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="XS" autoColor colors={subtleColors} />
                  <AvatarBadge count={5} size="xs" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  xs
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="SM" autoColor colors={subtleColors} />
                  <AvatarBadge count={5} size="sm" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  sm
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="MD" autoColor colors={subtleColors} />
                  <AvatarBadge count={5} size="md" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  md (default)
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="LG" autoColor colors={subtleColors} size="lg" />
                  <AvatarBadge count={5} size="lg" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  lg
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Badge Variants"
          description="Available variants: solid (default), outline, and soft."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Solid" autoColor colors={subtleColors} />
                  <AvatarBadge count={5} variant="solid" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  solid
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Outline" autoColor colors={subtleColors} />
                  <AvatarBadge count={5} variant="outline" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  outline
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Soft" autoColor colors={subtleColors} />
                  <AvatarBadge count={5} variant="soft" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  soft
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Badge Colors"
          description="Use the color prop to quickly change the badge color."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Blue" autoColor colors={subtleColors} />
                  <AvatarBadge count={3} color="#3b82f6" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Blue
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Green" autoColor colors={subtleColors} />
                  <AvatarBadge count={7} color="#10b981" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Green
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Purple" autoColor colors={subtleColors} />
                  <AvatarBadge count={12} color="#8b5cf6" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Purple
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Dot" autoColor colors={subtleColors} />
                  <AvatarBadge dot color="#f59e0b" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Amber dot
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Badge Pulse Animation"
          description="Add a pulse animation to draw attention to the badge."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Pulse" autoColor colors={subtleColors} />
                  <AvatarBadge count={3} pulse />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  pulse=true
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Dot" autoColor colors={subtleColors} />
                  <AvatarBadge dot pulse color="#10b981" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Dot with pulse
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Badge Overlap"
          description="Control badge positioning for circular vs rectangular avatars."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar
                    name="Circular"
                    autoColor
                    colors={subtleColors}
                    shape="circle"
                  />
                  <AvatarBadge count={5} overlap="circular" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  circular (default)
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar
                    name="Rect"
                    autoColor
                    colors={subtleColors}
                    shape="square"
                  />
                  <AvatarBadge count={5} overlap="rectangular" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  rectangular
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar
                    name="Rounded"
                    autoColor
                    colors={subtleColors}
                    shape="rounded"
                  />
                  <AvatarBadge count={5} overlap="rectangular" />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  rounded + rectangular
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Badge Offset"
          description="Fine-tune badge position with the offset prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Default" autoColor colors={subtleColors} />
                  <AvatarBadge count={5} />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  No offset
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="X Offset" autoColor colors={subtleColors} />
                  <AvatarBadge count={5} offset={{ x: 4 }} />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  x: 4
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Y Offset" autoColor colors={subtleColors} />
                  <AvatarBadge count={5} offset={{ y: 4 }} />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  y: 4
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Both" autoColor colors={subtleColors} />
                  <AvatarBadge count={5} offset={{ x: -2, y: 2 }} />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  x: -2, y: 2
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Badge Invisible State"
          description="Hide the badge without unmounting using the invisible prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Visible" autoColor colors={subtleColors} />
                  <AvatarBadge count={5} invisible={false} />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  invisible=false
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Hidden" autoColor colors={subtleColors} />
                  <AvatarBadge count={5} invisible={true} />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  invisible=true
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Badge Styling"
          description="Customize badge appearance using style and className props. The className overrides the default styling classes."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Blue" autoColor colors={subtleColors} />
                  <AvatarBadge
                    count={3}
                    className="text-xs font-medium bg-blue-400 text-white rounded-full px-1.5"
                  />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Custom color
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Green" autoColor colors={subtleColors} />
                  <AvatarBadge
                    count={5}
                    className="text-xs font-medium bg-emerald-400 text-white rounded-full px-1.5"
                  />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Emerald
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name="Custom" autoColor colors={subtleColors} />
                  <AvatarBadge
                    count={7}
                    style={{
                      top: 0,
                      right: 0,
                      transform: "translate(25%, -25%)",
                    }}
                  />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Custom position
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar
                    name="Large"
                    autoColor
                    colors={subtleColors}
                    size="lg"
                  />
                  <AvatarBadge
                    count={99}
                    className="text-sm font-medium bg-red-500 text-white rounded-full px-2"
                  />
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Custom size
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Badge with Custom Content"
          description="Use the children prop to add custom content like icons inside the badge."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar
                    name="Icon"
                    autoColor
                    colors={subtleColors}
                    size="lg"
                  />
                  <AvatarBadge dot className="bg-emerald-500 rounded-full">
                    <svg
                      className="w-2 h-2 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </AvatarBadge>
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Check icon
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar
                    name="Star"
                    autoColor
                    colors={subtleColors}
                    size="lg"
                  />
                  <AvatarBadge className="text-xs bg-amber-400 text-amber-900 rounded-full min-w-[20px] h-[20px] px-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </AvatarBadge>
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Star icon
                </p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar
                    name="VIP"
                    autoColor
                    colors={subtleColors}
                    size="lg"
                  />
                  <AvatarBadge className="text-[10px] font-bold bg-linear-to-r from-amber-400 to-yellow-300 text-amber-900 rounded px-1.5 min-w-[20px] h-[18px]">
                    VIP
                  </AvatarBadge>
                </div>
                <p
                  className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Text badge
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="User Profile Example"
          description="A common use case combining avatar with user information."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <Avatar
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
                name="John Doe"
                size="lg"
                status="online"
                bordered={`2px solid ${isDarkMode ? "#4b5563" : "#e0e7ff"}`}
              />
              <div>
                <p
                  className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}
                >
                  John Doe
                </p>
                <p
                  className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  john@example.com
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Team Display Example"
          description="Display a team with avatar group and tooltip showing hidden members."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-center gap-4">
              <AvatarGroup max={4} showTooltip>
                <Avatar name="Alice Anderson" autoColor colors={subtleColors} />
                <Avatar name="Bob Brown" autoColor colors={subtleColors} />
                <Avatar name="Charlie Chen" autoColor colors={subtleColors} />
                <Avatar name="Diana Davis" autoColor colors={subtleColors} />
                <Avatar name="Edward Evans" autoColor colors={subtleColors} />
                <Avatar name="Fiona Foster" autoColor colors={subtleColors} />
              </AvatarGroup>
              <span
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Team Alpha
              </span>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Notification List Example"
          description="Combine avatars with badges for notification UIs."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              {[
                {
                  name: "Sarah Wilson",
                  message: "Sent you a message",
                  count: 3,
                  status: "online" as const,
                },
                {
                  name: "Mike Johnson",
                  message: "Mentioned you in a comment",
                  count: 1,
                  status: "away" as const,
                },
                {
                  name: "Emily Davis",
                  message: "Shared a file with you",
                  count: 0,
                  status: "offline" as const,
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
                  }`}
                >
                  <div className="relative">
                    <Avatar
                      name={item.name}
                      autoColor
                      colors={subtleColors}
                      status={item.status}
                    />
                    {item.count > 0 && <AvatarBadge count={item.count} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium truncate ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}
                    >
                      {item.name}
                    </p>
                    <p
                      className={`text-sm truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {item.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Data Attributes"
          description="The Avatar component applies data attributes for CSS-based styling."
          isDarkMode={isDarkMode}
        >
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`data-has-image="true"    // Root: when displaying an image
data-shape="circle"      // Root: current shape ("circle" | "square" | "rounded")`}
          />
        </Section>
      </div>

      <div className="space-y-8" id="avatar-group">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          API Reference
        </h2>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Avatar
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">src</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Image source URL
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">name</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Name for initials generation
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">alt</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Alt text for image
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">size</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "xs" | "sm" | "md" | "lg" | "xl" | number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "md"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Avatar size
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">shape</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "circle" | "rounded" | "square"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "circle"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Avatar shape
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    maxInitials
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    2
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Maximum initials to display
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    autoColor
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Generate colors from name
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">colors</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    AvatarColors
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Custom color palettes for autoColor
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">status</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    AvatarStatus | AvatarStatusConfig
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Status indicator
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">tooltip</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    ReactNode | AvatarTooltipConfig
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Tooltip content
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    bordered
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean | string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Border style or true for auto-generated
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    fallback
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    ReactNode
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Fallback content when no image/name
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    textClassName
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSS class for initials text
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    textStyle
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSSProperties
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Inline styles for initials text
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    statusClassName
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSS class for status indicator
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">loading</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Show shimmer placeholder while loading
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    imageConfig
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    AvatarImageConfig
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Image loading configuration (srcSet, sizes, loading,
                    fetchPriority, etc.)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onLoad</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    () =&gt; void
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Callback when image loads
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onError</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    () =&gt; void
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Callback when image fails to load
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    className
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    see below
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Override default styling classes
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">asChild</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Advanced: merge props with child element
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            AvatarGroup
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    children
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    ReactNode
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Avatar children to group
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">max</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Maximum visible avatars
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">size</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "xs" | "sm" | "md" | "lg" | "xl" | number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "md"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Default size for all child avatars
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">shape</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "circle" | "rounded" | "square"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Shape for all child avatars
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    bordered
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean | string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Border for all child avatars
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">total</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Total count for surplus display (server-side)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">spacing</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -8
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Overlap spacing (negative for overlap)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">gap</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Alias for spacing prop
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    ringColor
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "white"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Color of the ring around each avatar
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">variant</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "stack" | "grid" | "inline"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "stack"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Layout variant for the group
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    reverseOrder
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Reverse display order of avatars
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    showTooltip
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Show tooltip with hidden avatar names
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">dir</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "ltr" | "rtl"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "ltr"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Layout direction
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    renderSurplus
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    (count: number) =&gt; ReactNode
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Custom surplus/overflow renderer
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    onAvatarClick
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    (index: number, event: MouseEvent) =&gt; void
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Callback when an avatar is clicked
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    className
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    see below
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Override default styling classes
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">asChild</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Render as child element (polymorphic)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            AvatarGroupCount
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">count</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    required
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    The count to display
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">size</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "xs" | "sm" | "md" | "lg" | "xl" | number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "md"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Size of the count indicator
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">shape</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "circle" | "rounded" | "square"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "circle"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Shape of the count indicator
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">max</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Maximum count to display (shows "max+" if exceeded)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    showPlus
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    true
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Show "+" prefix before count
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">format</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    (count: number) =&gt; string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Custom formatter for count display
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">variant</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "solid" | "outline" | "ghost"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "solid"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Visual variant of the count
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">tooltip</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    ReactNode | AvatarTooltipConfig
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Tooltip content on hover
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    bordered
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean | string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Border style or true for default border
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    textClassName
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSS class for count text
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    textStyle
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSSProperties
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Inline styles for count text
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    aria-live
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "polite" | "assertive" | "off"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Announce count changes to screen readers
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    children
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    ReactNode
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Custom content alongside count
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    className
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    see below
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Override default styling classes
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">asChild</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Render as child element (polymorphic)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            AvatarBadge
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">count</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Badge count
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">max</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    99
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Maximum display count (shows "99+" if exceeded)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">dot</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Show as dot instead of count
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    position
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "top-right" | "top-left" | "bottom-right" | "bottom-left"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "top-right"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Badge position
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">offset</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    BadgeOffset
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Fine-tune position with x/y offset
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">color</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Quick color override
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">size</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "xs" | "sm" | "md" | "lg"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "md"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Badge size
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">variant</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "solid" | "outline" | "soft"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "solid"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Visual variant
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">overlap</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "rectangular" | "circular"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "circular"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Position anchor for avatar shape
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">pulse</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Add pulse animation
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    invisible
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Hide without unmounting
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    showZero
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Show badge when count is 0
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    aria-live
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "polite" | "assertive" | "off"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Announce changes to screen readers
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    className
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    see below
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Override default styling classes
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">asChild</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Render as child element (polymorphic)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            AvatarShimmer
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">size</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "xs" | "sm" | "md" | "lg" | "xl" | number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "md"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Shimmer size
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">shape</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "circle" | "rounded" | "square"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "circle"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Shimmer shape
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">animate</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    true
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Enable pulse animation
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    className
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    see below
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Override default styling classes
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">asChild</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Render as child element (polymorphic)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            AvatarGroupShimmer
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">count</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    3
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Number of shimmer avatars
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">size</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "xs" | "sm" | "md" | "lg" | "xl" | number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "md"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Size of each shimmer
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">shape</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "circle" | "rounded" | "square"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "circle"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Shape of each shimmer
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">spacing</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -8
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Overlap spacing between shimmers
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    ringColor
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "white"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Color of the ring around each shimmer
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">animate</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    true
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Enable pulse animation
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    showCount
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Show additional count shimmer at end
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    className
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Additional CSS classes for container
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">asChild</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Render as child element (polymorphic)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Type Definitions
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
                    type AvatarShape = "circle" | "rounded" | "square";
                    type AvatarStatus = "online" | "offline" | "away" | "busy";
                    type CornerPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";
                    type Direction = "ltr" | "rtl";
                    type TooltipSide = "top" | "right" | "bottom" | "left";
                    type TooltipAlign = "start" | "center" | "end";
                    type BadgeSize = "xs" | "sm" | "md" | "lg";
                    type BadgeVariant = "solid" | "outline" | "soft";
                    type BadgeOverlap = "rectangular" | "circular";
                    type CountVariant = "solid" | "outline" | "ghost";
                    type GroupVariant = "stack" | "grid" | "inline";

                    interface AvatarColors {
                      backgrounds?: string[];
                      borders?: string[];
                      text?: string[];
                    }

                    interface AvatarStatusConfig {
                      type: AvatarStatus;
                      position?: CornerPosition;
                      color?: string;
                      className?: string;
                    }

                    interface AvatarTooltipConfig {
                      content: React.ReactNode;
                      side?: TooltipSide;
                      align?: TooltipAlign;
                      sideOffset?: number;
                      delayDuration?: number;
                      className?: string;
                      showArrow?: boolean;
                    }

                    interface AvatarImageConfig {
                      srcSet?: string;
                      sizes?: string;
                      loading?: "lazy" | "eager";
                      decoding?: "sync" | "async" | "auto";
                      crossOrigin?: "anonymous" | "use-credentials";
                      referrerPolicy?: string;
                      fetchPriority?: "high" | "low" | "auto"; // Controls resource loading priority
                      className?: string;
                    }

                    interface BadgeOffset {
                      x?: number;
                      y?: number;
              }`}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Accessibility
        </h2>
        <div
          className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <h3
            className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Features
          </h3>
          <ul
            className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <li>
              Proper{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                role="img"
              </code>{" "}
              for avatars without images
            </li>
            <li>
              Meaningful{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-label
              </code>{" "}
              from name or alt prop
            </li>
            <li>
              Status indicators have{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-label
              </code>{" "}
              describing status type
            </li>
            <li>
              Badges use{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                role="status"
              </code>{" "}
              for notification semantics
            </li>
            <li>
              Support for{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-live
              </code>{" "}
              on badges and counts for dynamic updates
            </li>
            <li>
              Avatar groups use{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                role="group"
              </code>{" "}
              with descriptive label including count
            </li>
            <li>
              AvatarGroupCount uses{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                role="status"
              </code>{" "}
              with descriptive aria-label
            </li>
            <li>Images use lazy loading by default with proper alt text</li>
            <li>
              Wrap avatars in buttons/links for clickable interactions with
              proper focus states
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`p-4 rounded-lg border ${isDarkMode ? "border-blue-800 bg-blue-950/30 text-blue-300" : "border-blue-200 bg-blue-50 text-blue-800"}`}
      >
        <p className="text-sm">
          <strong>Note:</strong> The Avatar component accepts all standard HTML
          div attributes. AvatarGroup and AvatarGroupCount also accept standard
          HTML attributes which are spread onto their respective underlying
          elements.
        </p>
      </div>
    </div>
  );
};

export default AvatarDemo;
