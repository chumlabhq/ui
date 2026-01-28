import { useState } from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  type DrawerDirection,
} from "../../components/Drawer";
import { Button } from "../../components/Button";

const directions: DrawerDirection[] = ["left", "right", "top", "bottom"];

// Icons
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// Sample data
const menuItems = [
  { icon: HomeIcon, label: "Dashboard", active: true },
  { icon: UsersIcon, label: "Team" },
  { icon: FolderIcon, label: "Projects" },
  { icon: ChartIcon, label: "Analytics" },
  { icon: SettingsIcon, label: "Settings" },
];

const cartItems = [
  { id: 1, name: "Wireless Headphones", price: 199.99, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" },
  { id: 2, name: "Smart Watch", price: 299.99, quantity: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" },
  { id: 3, name: "Laptop Stand", price: 79.99, quantity: 2, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop" },
];

const notifications = [
  { id: 1, title: "New comment", message: "Sarah mentioned you in a comment", time: "2 min ago", unread: true },
  { id: 2, title: "Task completed", message: "Project milestone has been reached", time: "1 hour ago", unread: true },
  { id: 3, title: "New follower", message: "John started following you", time: "3 hours ago", unread: false },
  { id: 4, title: "Payment received", message: "You received $500 from client", time: "Yesterday", unread: false },
];

const DrawerDemo = () => {
  const [openDrawer, setOpenDrawer] = useState<DrawerDirection | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [overlayDemoOpen, setOverlayDemoOpen] = useState<string | null>(null);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Drawer</h2>
        <p className="text-gray-600">
          A sliding panel that appears from the edge of the screen for navigation, forms, and contextual content.
        </p>
      </div>

      {/* Real-world Examples */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Real-World Examples</h3>
        <p className="text-sm text-gray-600">
          Common drawer patterns used in modern applications.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setMenuOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
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
        </div>

        {/* Navigation Menu Drawer */}
        <Drawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          direction="left"
          size="280px"
          aria-label="Navigation menu"
          drawerClassName="flex flex-col bg-gray-900"
        >
          <DrawerHeader className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-white font-semibold text-lg">FlowRated</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </DrawerHeader>
          <DrawerBody className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href="#"
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
                {["Website Redesign", "Mobile App", "API Integration"].map((project) => (
                  <a
                    key={project}
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {project}
                  </a>
                ))}
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter className="px-4 py-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">John Doe</p>
                <p className="text-gray-400 text-xs truncate">john@example.com</p>
              </div>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </DrawerFooter>
        </Drawer>

        {/* Shopping Cart Drawer */}
        <Drawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          direction="right"
          size="400px"
          aria-label="Shopping cart"
          drawerClassName="flex flex-col bg-white"
        >
          <DrawerHeader className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <CartIcon />
              <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
              <span className="bg-gray-100 text-gray-600 text-sm font-medium px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              aria-label="Close cart"
            >
              <CloseIcon />
            </button>
          </DrawerHeader>
          <DrawerBody className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-emerald-600 font-semibold mt-1">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button className="px-2 py-1 text-gray-500 hover:text-gray-700">−</button>
                        <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                        <button className="px-2 py-1 text-gray-500 hover:text-gray-700">+</button>
                      </div>
                      <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DrawerBody>
          <DrawerFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
              <Button
                onClick={() => setCartOpen(false)}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
              >
                Checkout
              </Button>
              <button
                onClick={() => setCartOpen(false)}
                className="w-full py-2 text-gray-600 text-sm hover:text-gray-900 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </DrawerFooter>
        </Drawer>

        {/* Notifications Drawer */}
        <Drawer
          open={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          direction="right"
          size="380px"
          aria-label="Notifications"
          drawerClassName="flex flex-col bg-white"
        >
          <DrawerHeader className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <BellIcon />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              aria-label="Close notifications"
            >
              <CloseIcon />
            </button>
          </DrawerHeader>
          <DrawerBody className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    notification.unread ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      notification.unread ? "bg-blue-500" : "bg-transparent"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notification.unread ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DrawerBody>
          <DrawerFooter className="px-6 py-4 border-t border-gray-200">
            <div className="flex gap-3">
              <Button
                onClick={() => setNotificationsOpen(false)}
                className="flex-1 py-2.5 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
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

        {/* Settings Drawer */}
        <Drawer
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          direction="right"
          size="420px"
          aria-label="Settings"
          drawerClassName="flex flex-col bg-white"
        >
          <DrawerHeader className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <SettingsIcon />
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
            </div>
            <button
              onClick={() => setSettingsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              aria-label="Close settings"
            >
              <CloseIcon />
            </button>
          </DrawerHeader>
          <DrawerBody className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Profile Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile</h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-500">john.doe@example.com</p>
                    <button className="text-sm text-violet-600 font-medium mt-1 hover:text-violet-700">
                      Edit profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Appearance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Dark mode</p>
                      <p className="text-sm text-gray-500">Use dark theme</p>
                    </div>
                    <button className="relative w-11 h-6 bg-gray-200 rounded-full transition-colors">
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Compact mode</p>
                      <p className="text-sm text-gray-500">Reduce spacing</p>
                    </div>
                    <button className="relative w-11 h-6 bg-violet-600 rounded-full transition-colors">
                      <span className="absolute left-6 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email notifications</p>
                      <p className="text-sm text-gray-500">Receive email updates</p>
                    </div>
                    <button className="relative w-11 h-6 bg-violet-600 rounded-full transition-colors">
                      <span className="absolute left-6 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Push notifications</p>
                      <p className="text-sm text-gray-500">Browser notifications</p>
                    </div>
                    <button className="relative w-11 h-6 bg-gray-200 rounded-full transition-colors">
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Language */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Language & Region</h3>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter className="px-6 py-4 border-t border-gray-200">
            <div className="flex gap-3">
              <Button
                onClick={() => setSettingsOpen(false)}
                className="flex-1 py-2.5 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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

        {/* Filter Drawer (Bottom) */}
        <Drawer
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          direction="bottom"
          size="auto"
          aria-label="Filters"
          drawerClassName="bg-white rounded-t-2xl max-h-[85vh]"
        >
          <DrawerHeader className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={() => setFilterOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              aria-label="Close filters"
            >
              <CloseIcon />
            </button>
          </DrawerHeader>
          <DrawerBody className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 140px)" }}>
            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {["Electronics", "Clothing", "Home", "Sports", "Books", "Toys"].map((cat) => (
                    <button
                      key={cat}
                      className="px-4 py-2 bg-gray-100 hover:bg-amber-100 hover:text-amber-700 rounded-full text-sm font-medium transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-gray-200"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-sm text-gray-600 ml-1">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <Button
                onClick={() => setFilterOpen(false)}
                className="flex-1 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
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
      </section>

      {/* Direction Variants */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Directions</h3>
        <p className="text-sm text-gray-600">
          Drawers can slide in from any edge of the screen.
        </p>
        <div className="flex flex-wrap gap-3">
          {directions.map((direction) => (
            <Button
              key={direction}
              onClick={() => setOpenDrawer(direction)}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium capitalize"
            >
              {direction}
            </Button>
          ))}
        </div>

        {directions.map((direction) => (
          <Drawer
            key={direction}
            open={openDrawer === direction}
            onClose={() => setOpenDrawer(null)}
            direction={direction}
            size={direction === "top" || direction === "bottom" ? "200px" : "320px"}
            aria-label={`${direction} drawer`}
            drawerClassName="flex flex-col bg-white"
          >
            <DrawerHeader className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {direction} Drawer
              </h2>
              <button
                onClick={() => setOpenDrawer(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                aria-label="Close drawer"
              >
                <CloseIcon />
              </button>
            </DrawerHeader>
            <DrawerBody className="flex-1 overflow-y-auto p-5">
              <p className="text-gray-600">
                This drawer slides in from the <strong className="text-gray-900">{direction}</strong> edge of the screen.
              </p>
            </DrawerBody>
            <DrawerFooter className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200">
              <Button
                onClick={() => setOpenDrawer(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setOpenDrawer(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Confirm
              </Button>
            </DrawerFooter>
          </Drawer>
        ))}
      </section>

      {/* Overlay Customization */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Overlay Customization</h3>
        <p className="text-sm text-gray-600">
          Customize the overlay backdrop color and opacity.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setOverlayDemoOpen("dark")}
            className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
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
            className="px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Light Overlay
          </Button>
        </div>

        <Drawer
          open={overlayDemoOpen === "dark"}
          onClose={() => setOverlayDemoOpen(null)}
          direction="right"
          size="360px"
          overlayOpacity={0.75}
          aria-label="Dark overlay drawer"
          drawerClassName="flex flex-col bg-white"
        >
          <DrawerHeader className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Dark Overlay</h2>
            <button
              onClick={() => setOverlayDemoOpen(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              aria-label="Close drawer"
            >
              <CloseIcon />
            </button>
          </DrawerHeader>
          <DrawerBody className="flex-1 overflow-y-auto p-5">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-sm">
                <code className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-800">overlayOpacity={0.75}</code>
              </p>
              <p className="text-gray-500 text-sm mt-2">Creates a darker backdrop for better focus.</p>
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
          drawerClassName="flex flex-col bg-white"
        >
          <DrawerHeader className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Blue Tint</h2>
            <button
              onClick={() => setOverlayDemoOpen(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              aria-label="Close drawer"
            >
              <CloseIcon />
            </button>
          </DrawerHeader>
          <DrawerBody className="flex-1 overflow-y-auto p-5">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-gray-600 text-sm">
                <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-800">overlayColor="rgb(30, 58, 138)"</code>
              </p>
              <p className="text-gray-500 text-sm mt-2">Custom overlay color for branded experiences.</p>
            </div>
          </DrawerBody>
        </Drawer>

        <Drawer
          open={overlayDemoOpen === "light"}
          onClose={() => setOverlayDemoOpen(null)}
          direction="right"
          size="360px"
          overlayColor="white"
          overlayOpacity={0.8}
          aria-label="Light overlay drawer"
          drawerClassName="flex flex-col bg-white shadow-2xl border-l border-gray-200"
        >
          <DrawerHeader className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Light Overlay</h2>
            <button
              onClick={() => setOverlayDemoOpen(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              aria-label="Close drawer"
            >
              <CloseIcon />
            </button>
          </DrawerHeader>
          <DrawerBody className="flex-1 overflow-y-auto p-5">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-sm">
                <code className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-800">overlayColor="white"</code>
              </p>
              <p className="text-gray-500 text-sm mt-2">Subtle white overlay for a softer effect.</p>
            </div>
          </DrawerBody>
        </Drawer>
      </section>

      {/* Props Table */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Drawer Props</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Prop</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Default</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">open</td>
                <td className="py-3 px-4 text-gray-600">boolean</td>
                <td className="py-3 px-4 text-gray-400">—</td>
                <td className="py-3 px-4 text-gray-600">Whether the drawer is open (required)</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">onClose</td>
                <td className="py-3 px-4 text-gray-600">() =&gt; void</td>
                <td className="py-3 px-4 text-gray-400">—</td>
                <td className="py-3 px-4 text-gray-600">Callback when drawer should close (required)</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">children</td>
                <td className="py-3 px-4 text-gray-600">ReactNode</td>
                <td className="py-3 px-4 text-gray-400">—</td>
                <td className="py-3 px-4 text-gray-600">Content to render inside the drawer</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">direction</td>
                <td className="py-3 px-4 text-gray-600">"left" | "right" | "top" | "bottom"</td>
                <td className="py-3 px-4 text-gray-500">"left"</td>
                <td className="py-3 px-4 text-gray-600">Direction from which the drawer appears</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">size</td>
                <td className="py-3 px-4 text-gray-600">string</td>
                <td className="py-3 px-4 text-gray-500">"300px"</td>
                <td className="py-3 px-4 text-gray-600">Width (left/right) or height (top/bottom)</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">overlayColor</td>
                <td className="py-3 px-4 text-gray-600">string</td>
                <td className="py-3 px-4 text-gray-500">"black"</td>
                <td className="py-3 px-4 text-gray-600">Color of the overlay backdrop</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">overlayOpacity</td>
                <td className="py-3 px-4 text-gray-600">number</td>
                <td className="py-3 px-4 text-gray-500">0.5</td>
                <td className="py-3 px-4 text-gray-600">Opacity of the overlay (0-1)</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">duration</td>
                <td className="py-3 px-4 text-gray-600">number</td>
                <td className="py-3 px-4 text-gray-500">300</td>
                <td className="py-3 px-4 text-gray-600">Animation duration in milliseconds</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">lockBackgroundScroll</td>
                <td className="py-3 px-4 text-gray-600">boolean</td>
                <td className="py-3 px-4 text-gray-500">true</td>
                <td className="py-3 px-4 text-gray-600">Whether to lock background scroll when open</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">closeOnOverlayClick</td>
                <td className="py-3 px-4 text-gray-600">boolean</td>
                <td className="py-3 px-4 text-gray-500">true</td>
                <td className="py-3 px-4 text-gray-600">Whether clicking overlay closes drawer</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">closeOnEscape</td>
                <td className="py-3 px-4 text-gray-600">boolean</td>
                <td className="py-3 px-4 text-gray-500">true</td>
                <td className="py-3 px-4 text-gray-600">Whether pressing Escape closes drawer</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">drawerClassName</td>
                <td className="py-3 px-4 text-gray-600">string</td>
                <td className="py-3 px-4 text-gray-500">""</td>
                <td className="py-3 px-4 text-gray-600">CSS class for the drawer panel</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">overlayClassName</td>
                <td className="py-3 px-4 text-gray-600">string</td>
                <td className="py-3 px-4 text-gray-500">""</td>
                <td className="py-3 px-4 text-gray-600">CSS class for the overlay backdrop</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">rootClassName</td>
                <td className="py-3 px-4 text-gray-600">string</td>
                <td className="py-3 px-4 text-gray-500">""</td>
                <td className="py-3 px-4 text-gray-600">CSS class for the root portal wrapper</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">aria-label</td>
                <td className="py-3 px-4 text-gray-600">string</td>
                <td className="py-3 px-4 text-gray-400">—</td>
                <td className="py-3 px-4 text-gray-600">Accessible label for the drawer</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">aria-labelledby</td>
                <td className="py-3 px-4 text-gray-600">string</td>
                <td className="py-3 px-4 text-gray-400">—</td>
                <td className="py-3 px-4 text-gray-600">ID of element that labels the drawer</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-blue-600 text-xs">aria-describedby</td>
                <td className="py-3 px-4 text-gray-600">string</td>
                <td className="py-3 px-4 text-gray-400">—</td>
                <td className="py-3 px-4 text-gray-600">ID of element that describes the drawer</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DrawerDemo;
