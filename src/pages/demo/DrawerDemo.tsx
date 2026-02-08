import { useState, useRef } from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  type DrawerDirection,
} from "../../components/Drawer";
import { Button } from "../../components/Button";
import { useTheme } from "./ThemeContext";
import { Section, CodeBlock, DemoWrapper, ComponentHeader } from "./components";

const directions: DrawerDirection[] = ["left", "right", "top", "bottom"];

const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CartIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const BellIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const FilterIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const HomeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const FolderIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);

const ChartIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const menuItems = [
  { icon: HomeIcon, label: "Dashboard", active: true },
  { icon: UsersIcon, label: "Team" },
  { icon: FolderIcon, label: "Projects" },
  { icon: ChartIcon, label: "Analytics" },
  { icon: SettingsIcon, label: "Settings" },
];

const cartItems = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 199.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 299.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Laptop Stand",
    price: 79.99,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop",
  },
];

const notifications = [
  {
    id: 1,
    title: "New comment",
    message: "Sarah mentioned you in a comment",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Task completed",
    message: "Project milestone has been reached",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "New follower",
    message: "John started following you",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 4,
    title: "Payment received",
    message: "You received $500 from client",
    time: "Yesterday",
    unread: false,
  },
];

const DrawerDemo = () => {
  const { isDarkMode } = useTheme();
  const [openDrawer, setOpenDrawer] = useState<DrawerDirection | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [overlayDemoOpen, setOverlayDemoOpen] = useState<string | null>(null);
  const [swipeOpen, setSwipeOpen] = useState(false);
  const [snapOpen, setSnapOpen] = useState(false);
  const [snapPoint, setSnapPoint] = useState(0);
  const [nonModalOpen, setNonModalOpen] = useState(false);
  const [keepMountedOpen, setKeepMountedOpen] = useState(false);
  const [closeButtonOpen, setCloseButtonOpen] = useState(false);
  const [stackedOuterOpen, setStackedOuterOpen] = useState(false);
  const [stackedInnerOpen, setStackedInnerOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState<string | null>(null);
  const [persistentOpen, setPersistentOpen] = useState(false);
  const [scrollTestOpen, setScrollTestOpen] = useState(false);
  const [transitionOpen, setTransitionOpen] = useState(false);
  const [transitionStatus, setTransitionStatus] = useState("");
  const keepMountedInputRef = useRef<HTMLInputElement>(null);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const unreadCount = notifications.filter((n) => n.unread).length;

  const panelBg = isDarkMode ? "bg-gray-900" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-600";
  const textMuted = isDarkMode ? "text-gray-500" : "text-gray-400";
  const hoverBg = isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100";
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-50";

  return (
    <div className="space-y-16">
      <ComponentHeader
        title="Drawer"
        description="A sliding panel that appears from the edge of the screen for navigation, forms, and contextual content."
        isDarkMode={isDarkMode}
      />

      <div className="space-y-12">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Examples
        </h2>

        <Section
          title="Real-World Examples"
          description="Common drawer patterns used in modern applications."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              onClick={() => setMenuOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <MenuIcon />
              Navigation Menu
            </Button>
            <Button
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <CartIcon />
              Shopping Cart
            </Button>
            <Button
              onClick={() => setNotificationsOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium relative"
            >
              <BellIcon />
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            <Button
              onClick={() => setSettingsOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
            >
              <SettingsIcon />
              Settings
            </Button>
            <Button
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              <FilterIcon />
              Filters
            </Button>
          </DemoWrapper>

          <CodeBlock
            isDarkMode={isDarkMode}
            code={`
                <Drawer
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                direction="left"
                size="280px"
                aria-label="Navigation menu"
                classes={{ panel: "flex flex-col bg-gray-900" }}
              >
                <DrawerHeader>...</DrawerHeader>
                <DrawerBody>...</DrawerBody>
                <DrawerFooter>...</DrawerFooter>
              </Drawer>
          `}
          />

          <Drawer
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            direction="left"
            size="280px"
            aria-label="Navigation menu"
            classes={{ panel: "flex flex-col bg-gray-900" }}
          >
            <DrawerHeader className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="text-white font-semibold text-lg">
                  Kern UI
                </span>
              </div>
              <DrawerCloseButton className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white">
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-3">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      item.active
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <item.icon />
                    <span className="font-medium">{item.label}</span>
                  </a>
                ))}
              </nav>
              <div className="mt-8 px-3">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Recent Projects
                </p>
                <div className="space-y-1">
                  {["Website Redesign", "Mobile App", "API Integration"].map(
                    (project) => (
                      <a
                        key={project}
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {project}
                      </a>
                    ),
                  )}
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter className="px-4 py-4 border-t border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    John Doe
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    john@example.com
                  </p>
                </div>
              </div>
            </DrawerFooter>
          </Drawer>

          <Drawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            direction="right"
            size="400px"
            aria-label="Shopping cart"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-6 py-4 border-b ${borderColor}`}
            >
              <div className={`flex items-center gap-2 ${textPrimary}`}>
                <CartIcon />
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <span
                  className={`${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"} text-sm font-medium px-2 py-0.5 rounded-full`}
                >
                  {cartItems.length}
                </span>
              </div>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-4 p-4 ${cardBg} rounded-xl`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${textPrimary} truncate`}>
                        {item.name}
                      </h3>
                      <p className="text-emerald-600 font-semibold mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div
                          className={`flex items-center border ${borderColor} rounded-lg`}
                        >
                          <button className={`px-2 py-1 ${textSecondary}`}>
                            −
                          </button>
                          <span
                            className={`px-3 py-1 text-sm font-medium ${textPrimary}`}
                          >
                            {item.quantity}
                          </span>
                          <button className={`px-2 py-1 ${textSecondary}`}>
                            +
                          </button>
                        </div>
                        <button className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors">
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DrawerBody>
            <DrawerFooter
              className={`px-6 py-4 border-t ${borderColor} ${cardBg}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className={textSecondary}>Subtotal</span>
                  <span className={`font-medium ${textPrimary}`}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={textSecondary}>Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
                <div
                  className={`flex items-center justify-between pt-3 border-t ${borderColor}`}
                >
                  <span className={`font-semibold ${textPrimary}`}>Total</span>
                  <span className={`text-xl font-bold ${textPrimary}`}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={() => setCartOpen(false)}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Checkout
                </Button>
              </div>
            </DrawerFooter>
          </Drawer>

          <Drawer
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            direction="right"
            size="380px"
            aria-label="Notifications"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-6 py-4 border-b ${borderColor}`}
            >
              <div className={`flex items-center gap-2 ${textPrimary}`}>
                <BellIcon />
                <h2 className="text-lg font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto">
              <div
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-6 py-4 ${hoverBg} transition-colors cursor-pointer ${
                      notification.unread
                        ? isDarkMode
                          ? "bg-blue-950/30"
                          : "bg-blue-50/50"
                        : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                          notification.unread ? "bg-blue-500" : "bg-transparent"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${notification.unread ? `font-semibold ${textPrimary}` : `font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}`}
                        >
                          {notification.title}
                        </p>
                        <p className={`text-sm ${textSecondary} mt-0.5`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs ${textMuted} mt-1`}>
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DrawerBody>
            <DrawerFooter className={`px-6 py-4 border-t ${borderColor}`}>
              <div className="flex gap-3">
                <Button
                  onClick={() => setNotificationsOpen(false)}
                  className={`flex-1 py-2.5 ${isDarkMode ? "text-gray-300 bg-gray-800 hover:bg-gray-700" : "text-gray-700 bg-gray-100 hover:bg-gray-200"} rounded-lg font-medium transition-colors text-sm`}
                >
                  Mark all as read
                </Button>
                <Button
                  onClick={() => setNotificationsOpen(false)}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  View all
                </Button>
              </div>
            </DrawerFooter>
          </Drawer>

          <Drawer
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            direction="right"
            size="420px"
            aria-label="Settings"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-6 py-4 border-b ${borderColor}`}
            >
              <div className={`flex items-center gap-2 ${textPrimary}`}>
                <SettingsIcon />
                <h2 className="text-lg font-semibold">Settings</h2>
              </div>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <h3 className={`text-sm font-semibold ${textPrimary} mb-4`}>
                    Profile
                  </h3>
                  <div
                    className={`flex items-center gap-4 p-4 ${cardBg} rounded-xl`}
                  >
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      JD
                    </div>
                    <div>
                      <p className={`font-semibold ${textPrimary}`}>John Doe</p>
                      <p className={`text-sm ${textSecondary}`}>
                        john.doe@example.com
                      </p>
                      <button className="text-sm text-violet-600 dark:text-violet-400 font-medium mt-1 hover:text-violet-700 dark:hover:text-violet-300">
                        Edit profile
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`text-sm font-semibold ${textPrimary} mb-4`}>
                    Appearance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${textPrimary}`}>
                          Dark mode
                        </p>
                        <p className={`text-sm ${textSecondary}`}>
                          Use dark theme
                        </p>
                      </div>
                      <button
                        className={`relative w-11 h-6 ${isDarkMode ? "bg-violet-600" : "bg-gray-200"} rounded-full transition-colors`}
                      >
                        <span
                          className={`absolute ${isDarkMode ? "left-6" : "left-1"} top-1 w-4 h-4 bg-white rounded-full shadow transition-transform`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${textPrimary}`}>
                          Compact mode
                        </p>
                        <p className={`text-sm ${textSecondary}`}>
                          Reduce spacing
                        </p>
                      </div>
                      <button className="relative w-11 h-6 bg-violet-600 rounded-full transition-colors">
                        <span className="absolute left-6 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`text-sm font-semibold ${textPrimary} mb-4`}>
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${textPrimary}`}>
                          Email notifications
                        </p>
                        <p className={`text-sm ${textSecondary}`}>
                          Receive email updates
                        </p>
                      </div>
                      <button className="relative w-11 h-6 bg-violet-600 rounded-full transition-colors">
                        <span className="absolute left-6 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${textPrimary}`}>
                          Push notifications
                        </p>
                        <p className={`text-sm ${textSecondary}`}>
                          Browser notifications
                        </p>
                      </div>
                      <button
                        className={`relative w-11 h-6 ${isDarkMode ? "bg-gray-600" : "bg-gray-200"} rounded-full transition-colors`}
                      >
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`text-sm font-semibold ${textPrimary} mb-4`}>
                    Language & Region
                  </h3>
                  <select
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`}
                  >
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter className={`px-6 py-4 border-t ${borderColor}`}>
              <div className="flex gap-3">
                <Button
                  onClick={() => setSettingsOpen(false)}
                  className={`flex-1 py-2.5 ${isDarkMode ? "text-gray-300 bg-gray-800 hover:bg-gray-700" : "text-gray-700 bg-gray-100 hover:bg-gray-200"} rounded-lg font-medium transition-colors`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setSettingsOpen(false)}
                  className="flex-1 py-2.5 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
                >
                  Save changes
                </Button>
              </div>
            </DrawerFooter>
          </Drawer>

          <Drawer
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            direction="bottom"
            size="auto"
            aria-label="Filters"
            classes={{ panel: `${panelBg} rounded-t-2xl max-h-[85vh]` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-6 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Filters
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody
              className="p-6 overflow-y-auto"
              style={{ maxHeight: "calc(85vh - 140px)" }}
            >
              <div className="space-y-6">
                <div>
                  <h3 className={`text-sm font-semibold ${textPrimary} mb-3`}>
                    Price Range
                  </h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${isDarkMode ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900"}`}
                    />
                    <span className={textMuted}>—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${isDarkMode ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900"}`}
                    />
                  </div>
                </div>

                <div>
                  <h3 className={`text-sm font-semibold ${textPrimary} mb-3`}>
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Electronics",
                      "Clothing",
                      "Home",
                      "Sports",
                      "Books",
                      "Toys",
                    ].map((cat) => (
                      <button
                        key={cat}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isDarkMode ? "bg-gray-700 hover:bg-amber-900 hover:text-amber-300 text-gray-300" : "bg-gray-100 hover:bg-amber-100 hover:text-amber-700"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`text-sm font-semibold ${textPrimary} mb-3`}>
                    Rating
                  </h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < rating ? "text-amber-400" : isDarkMode ? "text-gray-600" : "text-gray-200"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className={`text-sm ${textSecondary} ml-1`}>
                            & up
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter
              className={`px-6 py-4 border-t ${borderColor} ${cardBg}`}
            >
              <div className="flex gap-3">
                <Button
                  onClick={() => setFilterOpen(false)}
                  className={`flex-1 py-3 ${isDarkMode ? "text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700" : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"} rounded-xl font-medium transition-colors`}
                >
                  Clear all
                </Button>
                <Button
                  onClick={() => setFilterOpen(false)}
                  className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
                >
                  Show results
                </Button>
              </div>
            </DrawerFooter>
          </Drawer>
        </Section>

        <Section
          title="Directions"
          description="Drawers can slide in from any edge of the screen."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            {directions.map((dir) => (
              <Button
                key={dir}
                onClick={() => setOpenDrawer(dir)}
                className={`px-4 py-2.5 rounded-lg transition-colors font-medium capitalize ${isDarkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {dir}
              </Button>
            ))}
          </DemoWrapper>

          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Drawer
  open={isOpen}
  onClose={() => setIsOpen(false)}
  direction="right" // "left" | "right" | "top" | "bottom"
  size="320px"
  aria-label="Example drawer"
>
  <DrawerHeader>...</DrawerHeader>
  <DrawerBody>...</DrawerBody>
  <DrawerFooter>...</DrawerFooter>
</Drawer>`}
          />

          {directions.map((dir) => (
            <Drawer
              key={dir}
              open={openDrawer === dir}
              onClose={() => setOpenDrawer(null)}
              direction={dir}
              size={dir === "top" || dir === "bottom" ? "200px" : "320px"}
              aria-label={`${dir} drawer`}
              classes={{ panel: `flex flex-col ${panelBg}` }}
            >
              <DrawerHeader
                className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
              >
                <h2
                  className={`text-lg font-semibold ${textPrimary} capitalize`}
                >
                  {dir} Drawer
                </h2>
                <DrawerCloseButton
                  className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
                >
                  <CloseIcon />
                </DrawerCloseButton>
              </DrawerHeader>
              <DrawerBody className="flex-1 overflow-y-auto p-5">
                <p className={textSecondary}>
                  This drawer slides in from the{" "}
                  <strong className={textPrimary}>{dir}</strong> edge of the
                  screen.
                </p>
              </DrawerBody>
              <DrawerFooter
                className={`flex items-center justify-end gap-3 px-5 py-4 border-t ${borderColor}`}
              >
                <Button
                  onClick={() => setOpenDrawer(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? "text-gray-300 bg-gray-800 hover:bg-gray-700" : "text-gray-700 bg-gray-100 hover:bg-gray-200"}`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setOpenDrawer(null)}
                  className="px-4 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
                >
                  Confirm
                </Button>
              </DrawerFooter>
            </Drawer>
          ))}
        </Section>

        <Section
          title="Overlay Customization"
          description="Customize the overlay backdrop color and opacity."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              onClick={() => setOverlayDemoOpen("dark")}
              className="px-4 py-2.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
            >
              Dark Overlay
            </Button>
            <Button
              onClick={() => setOverlayDemoOpen("blur")}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Blue Tint
            </Button>
            <Button
              onClick={() => setOverlayDemoOpen("light")}
              className={`px-4 py-2.5 border rounded-lg transition-colors font-medium ${isDarkMode ? "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
            >
              Light Overlay
            </Button>
            <Button
              onClick={() => setOverlayDemoOpen("blur")}
              className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Blur Overlay
            </Button>
          </DemoWrapper>

          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Drawer overlayColor="rgb(30, 58, 138)" overlayOpacity={0.4} ...>
  ...
</Drawer>

// Blur overlay
<Drawer overlayBlur={12} overlayOpacity={0.3} ...>
  ...
</Drawer>`}
          />

          <Drawer
            open={overlayDemoOpen === "dark"}
            onClose={() => setOverlayDemoOpen(null)}
            direction="right"
            size="360px"
            overlayOpacity={0.75}
            aria-label="Dark overlay drawer"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Dark Overlay
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <div className={`p-4 ${cardBg} rounded-xl`}>
                <p className={`${textSecondary} text-sm`}>
                  <code
                    className={`px-1.5 py-0.5 rounded ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                  >
                    overlayOpacity=&#123;0.75&#125;
                  </code>
                </p>
                <p className={`${textMuted} text-sm mt-2`}>
                  Creates a darker backdrop for better focus.
                </p>
              </div>
            </DrawerBody>
          </Drawer>

          <Drawer
            open={overlayDemoOpen === "blur"}
            onClose={() => setOverlayDemoOpen(null)}
            direction="right"
            size="360px"
            overlayColor="rgb(30, 58, 138)"
            overlayOpacity={0.4}
            aria-label="Blue overlay drawer"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Blue Tint
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <div
                className={`p-4 ${isDarkMode ? "bg-blue-950/30" : "bg-blue-50"} rounded-xl`}
              >
                <p className={`${textSecondary} text-sm`}>
                  <code
                    className={`px-1.5 py-0.5 rounded ${isDarkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"}`}
                  >
                    overlayColor="rgb(30, 58, 138)"
                  </code>
                </p>
                <p className={`${textMuted} text-sm mt-2`}>
                  Custom overlay color for branded experiences.
                </p>
              </div>
            </DrawerBody>
          </Drawer>

          <Drawer
            open={overlayDemoOpen === "light"}
            onClose={() => setOverlayDemoOpen(null)}
            direction="right"
            size="360px"
            overlayColor={isDarkMode ? "rgb(17, 24, 39)" : "white"}
            overlayOpacity={0.8}
            aria-label="Light overlay drawer"
            classes={{
              panel: `flex flex-col ${panelBg} shadow-2xl border-l ${borderColor}`,
            }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Light Overlay
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <div className={`p-4 ${cardBg} rounded-xl`}>
                <p className={`${textSecondary} text-sm`}>
                  <code
                    className={`px-1.5 py-0.5 rounded ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                  >
                    overlayColor="white"
                  </code>
                </p>
                <p className={`${textMuted} text-sm mt-2`}>
                  Subtle overlay for a softer effect.
                </p>
              </div>
            </DrawerBody>
          </Drawer>

          <Drawer
            open={overlayDemoOpen === "blur"}
            onClose={() => setOverlayDemoOpen(null)}
            direction="right"
            size="360px"
            overlayBlur={12}
            overlayOpacity={0.3}
            aria-label="Blur overlay drawer"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Blur Overlay
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              />
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <div className={`p-4 ${cardBg} rounded-xl`}>
                <p className={`${textSecondary} text-sm`}>
                  <code
                    className={`px-1.5 py-0.5 rounded ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                  >
                    overlayBlur=&#123;12&#125;
                  </code>
                </p>
                <p className={`${textMuted} text-sm mt-2`}>
                  Frosted glass effect using backdrop-filter blur.
                </p>
              </div>
            </DrawerBody>
          </Drawer>
        </Section>

        <Section
          title="Custom Animation Duration"
          description="Control how fast the drawer animates in and out."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              onClick={() => setDurationOpen("fast")}
              className="px-4 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
            >
              Fast (100ms)
            </Button>
            <Button
              onClick={() => setDurationOpen("normal")}
              className={`px-4 py-2.5 rounded-lg transition-colors font-medium ${isDarkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Normal (300ms)
            </Button>
            <Button
              onClick={() => setDurationOpen("slow")}
              className="px-4 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              Slow (600ms)
            </Button>
          </DemoWrapper>

          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Drawer duration={100} ...>Fast transition</Drawer>
<Drawer duration={300} ...>Normal (default)</Drawer>
<Drawer duration={600} ...>Slow, dramatic transition</Drawer>`}
          />

          <Drawer
            open={durationOpen === "fast"}
            onClose={() => setDurationOpen(null)}
            direction="right"
            size="360px"
            duration={100}
            aria-label="Fast animation drawer"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Fast (100ms)
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <div className={`p-4 ${cardBg} rounded-xl`}>
                <p className={`${textSecondary} text-sm`}>
                  <code
                    className={`px-1.5 py-0.5 rounded ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                  >
                    duration=&#123;100&#125;
                  </code>
                </p>
                <p className={`${textMuted} text-sm mt-2`}>
                  Snappy transition for quick interactions.
                </p>
              </div>
            </DrawerBody>
          </Drawer>

          <Drawer
            open={durationOpen === "normal"}
            onClose={() => setDurationOpen(null)}
            direction="right"
            size="360px"
            duration={300}
            aria-label="Normal animation drawer"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Normal (300ms)
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <div className={`p-4 ${cardBg} rounded-xl`}>
                <p className={`${textSecondary} text-sm`}>
                  <code
                    className={`px-1.5 py-0.5 rounded ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                  >
                    duration=&#123;300&#125;
                  </code>
                </p>
                <p className={`${textMuted} text-sm mt-2`}>
                  Default animation speed — balanced and smooth.
                </p>
              </div>
            </DrawerBody>
          </Drawer>

          <Drawer
            open={durationOpen === "slow"}
            onClose={() => setDurationOpen(null)}
            direction="right"
            size="360px"
            duration={600}
            aria-label="Slow animation drawer"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Slow (600ms)
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <div className={`p-4 ${cardBg} rounded-xl`}>
                <p className={`${textSecondary} text-sm`}>
                  <code
                    className={`px-1.5 py-0.5 rounded ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                  >
                    duration=&#123;600&#125;
                  </code>
                </p>
                <p className={`${textMuted} text-sm mt-2`}>
                  Slow, dramatic transition for emphasis.
                </p>
              </div>
            </DrawerBody>
          </Drawer>
        </Section>

        <Section
          title="Swipeable Drawer"
          description="Touch-enabled drawers with swipe-to-dismiss gesture support."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              onClick={() => setSwipeOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Swipeable Bottom Sheet
            </Button>
          </DemoWrapper>

          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Drawer
  open={isOpen}
  onClose={() => setIsOpen(false)}
  direction="bottom"
  size="60vh"
  swipeable
  swipeThreshold={0.4}
  classes={{ panel: "bg-white rounded-t-2xl" }}
>
  <DrawerHeader>
    <div className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full my-3" />
  </DrawerHeader>
  <DrawerBody>Swipe down to close</DrawerBody>
</Drawer>`}
          />

          <Drawer
            open={swipeOpen}
            onClose={() => setSwipeOpen(false)}
            direction="bottom"
            size="60vh"
            swipeable
            aria-label="Swipeable drawer"
            classes={{ panel: `${panelBg} rounded-t-2xl` }}
          >
            <DrawerHeader className={`px-6 pt-3 pb-4 border-b ${borderColor}`}>
              <div
                className={`mx-auto w-12 h-1.5 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"} rounded-full mb-4`}
              />
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-semibold ${textPrimary}`}>
                  Swipeable Drawer
                </h2>
                <DrawerCloseButton
                  className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
                />
              </div>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-6">
              <div className={`p-4 ${cardBg} rounded-xl mb-4`}>
                <p className={`${textSecondary} text-sm`}>
                  Swipe down on this drawer to dismiss it. The gesture threshold
                  determines how far you need to drag before the drawer closes.
                </p>
              </div>
              <div className="space-y-3">
                {["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"].map(
                  (item) => (
                    <div
                      key={item}
                      className={`p-4 ${cardBg} rounded-xl flex items-center justify-between`}
                    >
                      <span className={textPrimary}>{item}</span>
                      <span className={textMuted}>Detail</span>
                    </div>
                  ),
                )}
              </div>
            </DrawerBody>
          </Drawer>
        </Section>

        <Section
          title="Snap Points"
          description="Drawers with multiple snap positions for partial open states."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              onClick={() => {
                setSnapPoint(0);
                setSnapOpen(true);
              }}
              className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Bottom Sheet with Snap Points
            </Button>
          </DemoWrapper>

          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Drawer
  open={isOpen}
  onClose={() => setIsOpen(false)}
  direction="bottom"
  size="100dvh"
  swipeable
  snapPoints={[0.3, 0.6, 1]}
  activeSnapPointIndex={snapPoint}
  onSnapPointIndexChange={setSnapPoint}
  classes={{ panel: "flex flex-col overflow-hidden rounded-t-2xl" }}
>
  <DrawerHeader>...</DrawerHeader>
  <DrawerBody className="flex-1 overflow-y-auto">...</DrawerBody>
</Drawer>`}
          />

          <Drawer
            open={snapOpen}
            onClose={() => setSnapOpen(false)}
            direction="bottom"
            size="100dvh"
            swipeable
            snapPoints={[0.3, 0.6, 1]}
            activeSnapPointIndex={snapPoint}
            onSnapPointIndexChange={setSnapPoint}
            aria-label="Snap points drawer"
            classes={{
              panel: `flex flex-col overflow-hidden ${panelBg} rounded-t-2xl`,
            }}
          >
            <DrawerHeader
              className={`shrink-0 px-6 pt-3 pb-4 border-b ${borderColor}`}
            >
              <div
                className={`mx-auto w-12 h-1.5 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"} rounded-full mb-4`}
              />
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-semibold ${textPrimary}`}>
                  Snap Points
                </h2>
                <DrawerCloseButton
                  className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
                />
              </div>
              <p className={`text-sm ${textSecondary} mt-1`}>
                Current: {Math.round([0.3, 0.6, 1][snapPoint] * 100)}% of
                viewport — Swipe or use buttons below
              </p>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-6">
              <div className="flex gap-2 mb-6 shrink-0">
                {[0, 1, 2].map((i) => (
                  <Button
                    key={i}
                    onClick={() => setSnapPoint(i)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      snapPoint === i
                        ? "bg-teal-600 text-white"
                        : isDarkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {Math.round([0.3, 0.6, 1][i] * 100)}%
                  </Button>
                ))}
              </div>
              <div className="space-y-3">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className={`p-4 ${cardBg} rounded-xl flex items-center justify-between`}
                  >
                    <span className={textPrimary}>Content item {i + 1}</span>
                    <span className={textMuted}>#{i + 1}</span>
                  </div>
                ))}
              </div>
            </DrawerBody>
          </Drawer>
        </Section>

        <Section
          title="Non-Modal Drawer"
          description="Persistent drawers without overlay, focus trap, or scroll lock. Ideal for sidebars and navigation."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              onClick={() => setNonModalOpen(!nonModalOpen)}
              className={`px-4 py-2.5 rounded-lg transition-colors font-medium ${
                nonModalOpen
                  ? "bg-rose-600 text-white hover:bg-rose-700"
                  : isDarkMode
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {nonModalOpen ? "Close Sidebar" : "Open Sidebar"}
            </Button>
          </DemoWrapper>

          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Drawer
  open={isOpen}
  onClose={() => setIsOpen(false)}
  direction="left"
  size="250px"
  modal={false}
>
  <DrawerHeader>Sidebar</DrawerHeader>
  <DrawerBody>Navigation links</DrawerBody>
</Drawer>`}
          />

          <Drawer
            open={nonModalOpen}
            onClose={() => setNonModalOpen(false)}
            direction="left"
            size="250px"
            modal={false}
            aria-label="Sidebar navigation"
            classes={{
              panel: `flex flex-col ${panelBg} shadow-2xl border-r ${borderColor}`,
            }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-4 py-4 border-b ${borderColor}`}
            >
              <span className={`font-semibold ${textPrimary}`}>Sidebar</span>
              <DrawerCloseButton
                className={`p-1.5 ${hoverBg} rounded-lg transition-colors ${textSecondary}`}
              />
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto py-2">
              <nav className="space-y-1 px-3">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      item.active
                        ? isDarkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-900"
                        : `${textSecondary} ${hoverBg}`
                    }`}
                  >
                    <item.icon />
                    <span className="font-medium text-sm">{item.label}</span>
                  </a>
                ))}
              </nav>
            </DrawerBody>
          </Drawer>
        </Section>

        <Section
          title="Keep Mounted"
          description="Preserve drawer content state (form inputs, scroll position) across open/close cycles."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              onClick={() => setKeepMountedOpen(true)}
              className="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Open Form Drawer
            </Button>
          </DemoWrapper>

          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Drawer
  open={isOpen}
  onClose={() => setIsOpen(false)}
  keepMounted
  initialFocus={inputRef}
>
  <input ref={inputRef} data-autofocus />
</Drawer>`}
          />

          <Drawer
            open={keepMountedOpen}
            onClose={() => setKeepMountedOpen(false)}
            direction="right"
            size="400px"
            keepMounted
            initialFocus={keepMountedInputRef}
            aria-label="Form drawer"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-6 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Edit Profile
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              />
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <p className={`text-sm ${textMuted}`}>
                  Close and reopen — your input is preserved via keepMounted.
                </p>
                <div>
                  <label
                    className={`block text-sm font-medium ${textPrimary} mb-1.5`}
                  >
                    Full Name
                  </label>
                  <input
                    ref={keepMountedInputRef}
                    type="text"
                    placeholder="Enter your name"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${isDarkMode ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900"}`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textPrimary} mb-1.5`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${isDarkMode ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900"}`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textPrimary} mb-1.5`}
                  >
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${isDarkMode ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900"}`}
                  />
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter className={`px-6 py-4 border-t ${borderColor}`}>
              <div className="flex gap-3">
                <Button
                  onClick={() => setKeepMountedOpen(false)}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${isDarkMode ? "text-gray-300 bg-gray-800 hover:bg-gray-700" : "text-gray-700 bg-gray-100 hover:bg-gray-200"}`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setKeepMountedOpen(false)}
                  className="flex-1 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Save
                </Button>
              </div>
            </DrawerFooter>
          </Drawer>
        </Section>

        <Section
          title="DrawerCloseButton"
          description="Built-in close button that auto-connects to the drawer's onClose via context."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              onClick={() => setCloseButtonOpen(true)}
              className={`px-4 py-2.5 rounded-lg transition-colors font-medium ${isDarkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Open Drawer
            </Button>
          </DemoWrapper>

          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import { DrawerCloseButton } from "kern-ui/Drawer";

<Drawer open={isOpen} onClose={() => setIsOpen(false)}>
  <DrawerHeader>
    <h2>Title</h2>
    {/* Auto-wired to onClose via context */}
    <DrawerCloseButton className="p-2 rounded-full hover:bg-gray-100" />
  </DrawerHeader>
</Drawer>`}
          />

          <Drawer
            open={closeButtonOpen}
            onClose={() => setCloseButtonOpen(false)}
            direction="right"
            size="360px"
            aria-label="Close button demo"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                DrawerCloseButton
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              />
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <div className={`p-4 ${cardBg} rounded-xl`}>
                <p className={`${textSecondary} text-sm`}>
                  The close button above uses{" "}
                  <code
                    className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
                  >
                    DrawerCloseButton
                  </code>
                  , which automatically connects to the drawer's{" "}
                  <code
                    className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
                  >
                    onClose
                  </code>{" "}
                  via React context. No manual wiring needed.
                </p>
              </div>
            </DrawerBody>
          </Drawer>
        </Section>

        <Section
          title="Stacked Drawers"
          description="When multiple drawers are open, Escape only closes the topmost one. Scroll lock is ref-counted."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              onClick={() => setStackedOuterOpen(true)}
              className="px-4 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
            >
              Open Stacked Drawers
            </Button>
          </DemoWrapper>

          <CodeBlock
            isDarkMode={isDarkMode}
            code={`{/* Outer drawer */}
<Drawer open={outerOpen} onClose={() => setOuterOpen(false)} direction="right">
  <DrawerBody>
    <button onClick={() => setInnerOpen(true)}>Open Inner</button>
  </DrawerBody>
</Drawer>

{/* Inner drawer — Escape only closes this one */}
<Drawer open={innerOpen} onClose={() => setInnerOpen(false)} direction="right">
  <DrawerBody>Press Escape to close only this drawer</DrawerBody>
</Drawer>`}
          />

          <Drawer
            open={stackedOuterOpen}
            onClose={() => setStackedOuterOpen(false)}
            direction="right"
            size="400px"
            aria-label="Outer stacked drawer"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Outer Drawer
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <div className={`p-4 ${cardBg} rounded-xl mb-4`}>
                <p className={`${textSecondary} text-sm`}>
                  This is the outer drawer. Click the button below to open an
                  inner drawer on top.
                </p>
              </div>
              <Button
                onClick={() => setStackedInnerOpen(true)}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Open Inner Drawer
              </Button>
            </DrawerBody>
          </Drawer>

          <Drawer
            open={stackedInnerOpen}
            onClose={() => setStackedInnerOpen(false)}
            direction="right"
            size="340px"
            aria-label="Inner stacked drawer"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Inner Drawer
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <div className={`p-4 ${cardBg} rounded-xl`}>
                <p className={`${textSecondary} text-sm`}>
                  Press{" "}
                  <kbd
                    className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
                  >
                    Escape
                  </kbd>{" "}
                  to close only this drawer. The outer drawer stays open.
                </p>
              </div>
            </DrawerBody>
          </Drawer>
        </Section>

        <Section
          title="Close Behavior"
          description="Control how the drawer can be dismissed and whether the background remains interactive."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              onClick={() => setPersistentOpen(true)}
              className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Persistent Drawer
            </Button>
            <Button
              onClick={() => setScrollTestOpen(true)}
              className={`px-4 py-2.5 rounded-lg transition-colors font-medium ${isDarkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              No Scroll Lock
            </Button>
          </DemoWrapper>

          <CodeBlock
            isDarkMode={isDarkMode}
            code={`{/* Only closeable via close button */}
<Drawer
  closeOnOverlayClick={false}
  closeOnEscape={false}
  ...
>
  <DrawerCloseButton />
</Drawer>

{/* Background remains scrollable and interactive */}
<Drawer lockScroll={false} ...>
  ...
</Drawer>`}
          />

          <Drawer
            open={persistentOpen}
            onClose={() => setPersistentOpen(false)}
            direction="right"
            size="380px"
            closeOnOverlayClick={false}
            closeOnEscape={false}
            aria-label="Persistent drawer"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Persistent Drawer
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <div className={`p-4 ${cardBg} rounded-xl space-y-3`}>
                <p className={`${textSecondary} text-sm`}>
                  This drawer ignores overlay clicks and the Escape key. Use the
                  close button above or the button below to dismiss.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                    <code
                      className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                    >
                      closeOnOverlayClick=&#123;false&#125;
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                    <code
                      className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                    >
                      closeOnEscape=&#123;false&#125;
                    </code>
                  </div>
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter className={`px-5 py-4 border-t ${borderColor}`}>
              <Button
                onClick={() => setPersistentOpen(false)}
                className="w-full py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Close Drawer
              </Button>
            </DrawerFooter>
          </Drawer>

          <Drawer
            open={scrollTestOpen}
            onClose={() => setScrollTestOpen(false)}
            direction="right"
            size="360px"
            lockScroll={false}
            aria-label="No scroll lock drawer"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                No Scroll Lock
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <div className={`p-4 ${cardBg} rounded-xl`}>
                <p className={`${textSecondary} text-sm`}>
                  <code
                    className={`px-1.5 py-0.5 rounded ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                  >
                    lockScroll=&#123;false&#125;
                  </code>
                </p>
                <p className={`${textMuted} text-sm mt-2`}>
                  The background page remains scrollable and interactive while
                  this drawer is open. Try scrolling the page behind the
                  overlay.
                </p>
              </div>
            </DrawerBody>
          </Drawer>
        </Section>

        <Section
          title="Transition Callback"
          description="Run logic after the drawer's open or close animation completes."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              onClick={() => {
                setTransitionStatus("");
                setTransitionOpen(true);
              }}
              className="px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium"
            >
              Open with Callback
            </Button>
            {transitionStatus && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                  transitionStatus === "Opened"
                    ? isDarkMode
                      ? "bg-green-900 text-green-300"
                      : "bg-green-100 text-green-700"
                    : isDarkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    transitionStatus === "Opened"
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
                {transitionStatus}
              </span>
            )}
          </DemoWrapper>

          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Drawer
  onTransitionEnd={(open) => {
    console.log(open ? "Fully opened" : "Fully closed");
  }}
  ...
>
  ...
</Drawer>`}
          />

          <Drawer
            open={transitionOpen}
            onClose={() => setTransitionOpen(false)}
            direction="right"
            size="360px"
            onTransitionEnd={(isOpen) =>
              setTransitionStatus(isOpen ? "Opened" : "Closed")
            }
            aria-label="Transition callback drawer"
            classes={{ panel: `flex flex-col ${panelBg}` }}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Transition Callback
              </h2>
              <DrawerCloseButton
                className={`p-2 ${hoverBg} rounded-full transition-colors ${textSecondary}`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <div className={`p-4 ${cardBg} rounded-xl`}>
                <p className={`${textSecondary} text-sm`}>
                  The{" "}
                  <code
                    className={`px-1.5 py-0.5 rounded ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                  >
                    onTransitionEnd
                  </code>{" "}
                  callback fires after the animation completes. Close this
                  drawer and watch the status badge update.
                </p>
              </div>
            </DrawerBody>
          </Drawer>
        </Section>
      </div>

      <div className="space-y-6">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          API Reference
        </h2>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Drawer Props
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
                  <td className="py-3 pr-4 font-mono text-blue-500">open</td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>boolean</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>—</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Whether the drawer is open (required)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onClose</td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>
                    () =&gt; void
                  </td>
                  <td className={`py-3 pr-4 ${textMuted}`}>—</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Callback when drawer should close (required)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    direction
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>
                    "left" | "right" | "top" | "bottom"
                  </td>
                  <td className={`py-3 pr-4 ${textMuted}`}>"left"</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Direction from which the drawer appears
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">size</td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>string</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>"300px"</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Width (left/right) or height (top/bottom)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">classes</td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>
                    DrawerClasses
                  </td>
                  <td className={`py-3 pr-4 ${textMuted}`}>{"{}"}</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Class overrides merged via cn() (tailwind-merge) for root,
                    overlay, and panel. Z-index is overridable via
                    classes.root/classes.panel
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    className
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>string</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>—</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Applied to the panel element (not the root wrapper)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    overlayColor
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>string</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>"black"</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Color of the overlay backdrop
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    overlayOpacity
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>number</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>0.5</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Opacity of the overlay (0–1)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    duration
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>number</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>300</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Animation duration in milliseconds
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    lockScroll
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>boolean</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>true</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Lock background scroll; when false the overlay passes
                    pointer events through so the page stays interactive
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    closeOnOverlayClick
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>boolean</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>true</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Whether clicking overlay closes drawer
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    closeOnEscape
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>boolean</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>true</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Whether pressing Escape closes drawer
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    trapFocus
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>boolean</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>true</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Whether to trap focus inside the drawer
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    restoreFocus
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>boolean</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>true</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Whether to restore focus on close
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    portalContainer
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>
                    HTMLElement | null
                  </td>
                  <td className={`py-3 pr-4 ${textMuted}`}>document.body</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Custom container for the portal
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    overlayBlur
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>number</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>0</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Backdrop blur in pixels (backdrop-filter)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    initialFocus
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>
                    RefObject&lt;HTMLElement&gt;
                  </td>
                  <td className={`py-3 pr-4 ${textMuted}`}>—</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Element to focus when drawer opens
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    onTransitionEnd
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>
                    (open: boolean) =&gt; void
                  </td>
                  <td className={`py-3 pr-4 ${textMuted}`}>—</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Fires after open/close animation completes
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    keepMounted
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>boolean</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>false</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Keep content in DOM when closed (preserves state)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">modal</td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>boolean</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>true</td>
                  <td className={`py-3 ${textSecondary}`}>
                    When false, no overlay/focus trap/scroll lock
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    swipeable
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>boolean</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>false</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Enable swipe/drag gesture to dismiss
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    swipeThreshold
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>number</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>0.4</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Fraction of drawer size to trigger dismiss (0–1)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    snapPoints
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>number[]</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>—</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Array of fractions (0–1) for snap positions
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    activeSnapPointIndex
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>number</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>—</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Controlled snap point index into the snapPoints array
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    defaultSnapPointIndex
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>number</td>
                  <td className={`py-3 pr-4 ${textMuted}`}>0</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Initial snap point index (uncontrolled)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    onSnapPointIndexChange
                  </td>
                  <td className={`py-3 pr-4 ${textSecondary}`}>
                    (index: number) =&gt; void
                  </td>
                  <td className={`py-3 pr-4 ${textMuted}`}>—</td>
                  <td className={`py-3 ${textSecondary}`}>
                    Fires when active snap point index changes
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
            code={`interface DrawerClasses {
  root?: string;    // Merged via cn() with DEFAULT_CLASS_NAMES.root
  overlay?: string; // Merged via cn() with DEFAULT_CLASS_NAMES.overlay
  panel?: string;   // Merged via cn() with DEFAULT_CLASS_NAMES.panel
}

type DrawerDirection = "left" | "right" | "top" | "bottom";

// Exported defaults (can be imported from the package)
// z-index is overridable via classes.root / classes.panel
const DEFAULT_CLASS_NAMES: Required<DrawerClasses> = {
  root: "z-999999",
  overlay: "fixed inset-0 transition-opacity",
  panel: "fixed z-999999",
};

// Data attributes on the root wrapper:
// data-state="open" | "closed"
// data-direction="left" | "right" | "top" | "bottom"
// aria-hidden="true" when keepMounted and closed

// className prop applies to the panel element (not the root wrapper)
// Panel gets inert attribute when keepMounted and closed

// Sub-component props
interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {}
interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {}
interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {}
interface DrawerCloseButtonProps extends HTMLAttributes<HTMLButtonElement> {}

// Context hook
const context = useDrawerContext();
// => { onClose: () => void; titleId: string } | null

// Scroll lock safety reset (for error boundary recovery)
import { resetScrollLock } from "kern-ui/Drawer/utils/helpers";`}
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
              Uses{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                role="dialog"
              </code>{" "}
              with{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-modal="true"
              </code>
            </li>
            <li>
              Focus is automatically trapped inside the drawer when open (modal
              mode); hidden and{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-hidden
              </code>{" "}
              elements are excluded from the focus trap
            </li>
            <li>Focus is restored to the trigger element on close</li>
            <li>
              Supports{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                initialFocus
              </code>{" "}
              ref and{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                data-autofocus
              </code>{" "}
              attribute for initial focus control
            </li>
            <li>
              Background scroll is locked while the drawer is open (ref-counted
              for stacked drawers)
            </li>
            <li>
              Escape key closes the topmost drawer only (stacked drawers
              supported)
            </li>
            <li>
              Overlay closes on click (not pointerdown) to prevent accidental
              dismissal
            </li>
            <li>
              Respects{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                prefers-reduced-motion
              </code>{" "}
              — animations are disabled when the user prefers reduced motion
              (SSR-safe via{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                useSyncExternalStore
              </code>
              )
            </li>
            <li>
              When{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                keepMounted
              </code>{" "}
              is true, the closed drawer gets{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-hidden
              </code>{" "}
              and{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                inert
              </code>{" "}
              — fully hidden from assistive technology
            </li>
            <li>
              Swipeable drawers set{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                touch-action
              </code>{" "}
              to prevent browser gesture conflicts on mobile
            </li>
            <li>
              Auto-wires{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-labelledby
              </code>{" "}
              from DrawerHeader via React context
            </li>
            <li>
              Supports{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-label
              </code>
              ,{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-labelledby
              </code>
              , and{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-describedby
              </code>
            </li>
            <li>
              All directions (left, right, top, bottom) use GPU-composited{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                transform
              </code>{" "}
              animations for smooth 60fps transitions
            </li>
          </ul>
        </div>

        <div
          className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <h3
            className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Keyboard Navigation
          </h3>
          <ul
            className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Escape
              </kbd>{" "}
              — Close the drawer
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Tab
              </kbd>{" "}
              — Cycle focus through focusable elements (trapped)
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Shift + Tab
              </kbd>{" "}
              — Cycle focus backwards (trapped)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DrawerDemo;
