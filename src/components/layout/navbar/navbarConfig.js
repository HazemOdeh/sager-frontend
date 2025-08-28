/**
 * Navbar Configuration
 *
 * Design Patterns Used:
 * 1. Configuration Pattern - Centralized configuration for maintainability
 * 2. Singleton Pattern - Single source of truth for navbar settings
 * 3. Factory Pattern - Configuration objects for component generation
 *
 * Centralized configuration for all navbar-related components including:
 * - Layout settings (spacing, padding, z-index)
 * - Color schemes and theming
 * - Brand information
 * - Action button configurations
 * - User information
 */

// Configuration constants for better maintainability
export const NAVBAR_CONFIG = {
  BRAND: {
    LOGO_SRC: "/sagerLogo.png",
    LOGO_ALT: "Sager Logo",
  },
  LAYOUT: {
    Z_INDEX: 50,
    SPACING: {
      MOBILE: "space-x-1",
      TABLET: "space-x-2",
      DESKTOP: "space-x-4",
    },
    PADDING: {
      CONTAINER: "px-3 sm:px-4 md:px-6 py-2 sm:py-3",
      BUTTON: "p-1 sm:p-1.5 md:p-2",
    },
  },
  COLORS: {
    BACKGROUND: "bg-black",
    TEXT_PRIMARY: "text-white",
    TEXT_SECONDARY: "text-gray-400",
    NOTIFICATION_BADGE: "bg-red-500",
    HOVER_TRANSITION: "hover:text-white transition-colors",
  },
  TRANSITIONS: {
    DEFAULT: "transition-colors",
    HOVER_OPACITY: "hover:opacity-100",
  },
};

// Action buttons configuration - easily extensible
export const ACTION_BUTTONS = [
  {
    id: "capture",
    icon: "/capture-svgrepo-com.svg",
    alt: "Capture",
    ariaLabel: "Open capture tool",
    action: () => console.log("Capture clicked"),
  },
  {
    id: "language",
    icon: "/language-svgrepo-com.svg",
    alt: "Language",
    ariaLabel: "Change language settings",
    action: () => console.log("Language clicked"),
  },
  {
    id: "notifications",
    icon: "/bell.svg",
    alt: "Notifications",
    ariaLabel: "View notifications",
    action: () => console.log("Notifications clicked"),
    badge: {
      count: 1,
      ariaLabel: "1 unread notification",
    },
  },
];

// User information configuration
export const USER_INFO = {
  fullName: "Hazem Odeh",
  title: "Frontend Engineer",
};
