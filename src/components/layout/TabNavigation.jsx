import { useLocation, useNavigate } from "react-router-dom";

/**
 * TabNavigation Component
 *
 * Design Patterns Used:
 * 1. Responsive Design Pattern - Adaptive layout for mobile/desktop
 * 2. Configuration Pattern - Centralized tab configuration
 * 3. Component Composition Pattern - Reusable tab button components
 * 4. State Management Pattern - Router-based active state management
 * 5. Factory Pattern - Dynamic tab generation from configuration
 * 6. Strategy Pattern - Different rendering strategies for mobile/desktop
 * 7. Observer Pattern - Reacts to route changes
 *
 * Provides navigation interface that adapts between:
 * - Mobile: Bottom navigation bar
 * - Desktop: Side navigation panel
 */

// Configuration constants for maintainability
const NAVIGATION_CONFIG = {
  BRAND_COLOR: "#F9000E",
  MOBILE_BREAKPOINT: "md",
  TRANSITION_DURATION: "200ms",
  Z_INDEX: {
    MOBILE: 40,
  },
};

// Tab configuration - easily extensible
const TAB_CONFIG = [
  {
    id: "dashboard",
    path: "/",
    icon: "/dashboard-svgrepo-com-2.svg",
    label: "DASHBOARD",
    ariaLabel: "Navigate to dashboard",
  },
  {
    id: "map",
    path: "/map",
    icon: "/location-svgrepo-com-2.svg",
    label: "MAP",
    ariaLabel: "Navigate to map view",
  },
];

/**
 * TabNavigation Component
 * Pattern: Facade Pattern - Simplifies complex navigation interface
 */
const TabNavigation = () => {
  // Router hooks for navigation state management
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Determines if a tab is currently active based on route
   * Pattern: Strategy Pattern - Route matching strategy
   * @param {string} tabPath - The path to check against current location
   * @returns {boolean} Whether the tab is active
   */
  const isTabActive = (tabPath) => location.pathname === tabPath;

  /**
   * Handles tab navigation with route change
   * Pattern: Command Pattern - Encapsulates navigation action
   * @param {string} path - Target route path
   */
  const handleTabNavigation = (path) => {
    navigate(path);
  };

  /**
   * Generates CSS classes for tab buttons based on state
   * Pattern: Factory Pattern - Creates consistent styling based on state
   * @param {boolean} isActive - Whether the tab is currently active
   * @param {boolean} isMobile - Whether this is for mobile layout
   * @returns {string} Combined CSS classes
   */
  const getTabButtonClasses = (isActive, isMobile = false) => {
    const baseClasses = `relative flex flex-col items-center transition-all duration-${NAVIGATION_CONFIG.TRANSITION_DURATION}`;
    const mobileClasses = `py-3 px-6 flex-1 ${isActive ? "bg-gray-800" : ""}`;
    const desktopClasses = `py-4 lg:py-5 xl:py-6 px-2 lg:px-3 xl:px-4 group ${
      isActive ? "bg-gray-800" : "hover:bg-gray-800"
    }`;

    return `${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`;
  };

  /**
   * Generates CSS classes for tab icons based on state
   * Pattern: Factory Pattern - Creates consistent icon styling
   * @param {boolean} isActive - Whether the tab is currently active
   * @param {boolean} isMobile - Whether this is for mobile layout
   * @returns {string} Combined CSS classes for icon
   */
  const getIconClasses = (isActive, isMobile = false) => {
    const baseClasses = "brightness-0 invert";
    const activeClasses = "";
    const inactiveClasses = isMobile
      ? "opacity-60"
      : "opacity-60 group-hover:opacity-100";
    const sizeClasses = isMobile
      ? "w-5 h-5 mb-1"
      : "w-5 h-5 lg:w-6 lg:h-6 mb-1 lg:mb-2";

    return `${baseClasses} ${sizeClasses} ${
      isActive ? activeClasses : inactiveClasses
    }`;
  };

  /**
   * Generates CSS classes for tab labels based on state
   * Pattern: Factory Pattern - Creates consistent label styling
   * @param {boolean} isActive - Whether the tab is currently active
   * @param {boolean} isMobile - Whether this is for mobile layout
   * @returns {string} Combined CSS classes for label
   */
  const getLabelClasses = (isActive, isMobile = false) => {
    const baseClasses = `font-medium transition-colors duration-${NAVIGATION_CONFIG.TRANSITION_DURATION}`;
    const sizeClasses = isMobile
      ? "text-[10px]"
      : "text-[10px] lg:text-xs text-center leading-tight";
    const colorClasses = isActive
      ? "text-white"
      : isMobile
      ? "text-gray-500"
      : "text-gray-500 group-hover:text-gray-300";

    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  };

  /**
   * Mobile Tab Button Component
   * Pattern: Component Composition - Reusable mobile tab button
   * @param {Object} tab - Tab configuration object
   */
  const MobileTabButton = ({ tab }) => {
    const isActive = isTabActive(tab.path);

    return (
      <button
        onClick={() => handleTabNavigation(tab.path)}
        className={getTabButtonClasses(isActive, true)}
        aria-label={tab.ariaLabel}
        aria-current={isActive ? "page" : undefined}
      >
        {/* Active indicator bar */}
        {isActive && (
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ backgroundColor: NAVIGATION_CONFIG.BRAND_COLOR }}
            aria-hidden="true"
          />
        )}

        {/* Tab icon */}
        <img
          src={tab.icon}
          alt=""
          className={getIconClasses(isActive, true)}
          role="presentation"
        />

        {/* Tab label */}
        <span className={getLabelClasses(isActive, true)}>{tab.label}</span>
      </button>
    );
  };

  /**
   * Desktop Tab Button Component
   * Pattern: Component Composition - Reusable desktop tab button
   * @param {Object} tab - Tab configuration object
   */
  const DesktopTabButton = ({ tab }) => {
    const isActive = isTabActive(tab.path);

    return (
      <button
        onClick={() => handleTabNavigation(tab.path)}
        className={getTabButtonClasses(isActive, false)}
        aria-label={tab.ariaLabel}
        aria-current={isActive ? "page" : undefined}
      >
        {/* Active indicator line */}
        {isActive && (
          <div
            className="absolute left-0 top-0 bottom-0 w-0.5 lg:w-1"
            style={{ backgroundColor: NAVIGATION_CONFIG.BRAND_COLOR }}
            aria-hidden="true"
          />
        )}

        {/* Tab icon */}
        <img
          src={tab.icon}
          alt=""
          className={getIconClasses(isActive, false)}
          role="presentation"
        />

        {/* Tab label */}
        <span className={getLabelClasses(isActive, false)}>{tab.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile: Bottom Navigation Bar */}
      {/* Pattern: Responsive Design - Mobile-specific navigation layout */}
      <nav
        className={`${NAVIGATION_CONFIG.MOBILE_BREAKPOINT}:hidden fixed bottom-0 left-0 right-0 z-${NAVIGATION_CONFIG.Z_INDEX.MOBILE} bg-black border-t border-gray-800`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex justify-around">
          {TAB_CONFIG.map((tab) => (
            <MobileTabButton key={tab.id} tab={tab} />
          ))}
        </div>
      </nav>

      {/* Desktop: Side Navigation Panel */}
      {/* Pattern: Responsive Design - Desktop-specific navigation layout */}
      <nav
        className={`hidden ${NAVIGATION_CONFIG.MOBILE_BREAKPOINT}:flex sticky top-16 left-0 flex-col h-[calc(100vh-4rem)] w-20 lg:w-24 xl:w-28 bg-black`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col">
          {TAB_CONFIG.map((tab) => (
            <DesktopTabButton key={tab.id} tab={tab} />
          ))}
        </div>
      </nav>
    </>
  );
};

export default TabNavigation;
