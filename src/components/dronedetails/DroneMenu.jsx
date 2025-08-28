import { useState } from "react";
import { ChevronsUp, ChevronsDown, X } from "lucide-react";

/**
 * DroneMenu Component
 *
 * Design Patterns Used:
 * 1. Compound Component Pattern - Combines multiple UI patterns (tabs, modal, sidebar)
 * 2. Responsive Design Pattern - Adapts layout based on screen size (mobile modal vs desktop sidebar)
 * 3. State Management Pattern - Uses local state for UI interactions
 * 4. Render Props Pattern - Uses conditional rendering based on state
 * 5. Event Handler Pattern - Encapsulates user interactions
 * 6. Separation of Concerns - Separates mobile and desktop UI logic
 *
 * @param {Array} droneData - Array of drone objects with properties
 * @param {string} selectedDrone - Currently selected drone registration
 * @param {Function} setSelectedDrone - Function to update selected drone
 */
const DroneMenu = ({ droneData, selectedDrone, setSelectedDrone }) => {
  // UI State Management
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("drones");
  const [isOpen, setIsOpen] = useState(false);

  // Constants for better maintainability
  const TABS = {
    DRONES: "drones",
    HISTORY: "history",
  };

  const COLORS = {
    PRIMARY: "#F9000E",
    SUCCESS: "#5CFC00",
    DARK: "black",
    GRAY: "gray",
  };

  /**
   * Mobile Modal Overlay Component
   * Pattern: Render Prop / Function Component
   * Purpose: Provides backdrop for mobile modal with click-to-close functionality
   */
  const MobileOverlay = () => (
    <div
      className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={() => setIsOpen(false)}
      role="button"
      tabIndex={0}
      aria-label="Close drone menu"
    />
  );

  /**
   * Determines status color based on drone registration pattern
   * Pattern: Strategy Pattern - Different color strategies based on registration prefix
   * @param {string} registration - Drone registration number
   * @returns {string} CSS class for status indicator color
   */
  const getStatusColor = (registration) => {
    const prefix = registration.split("-")[1]?.startsWith("B");
    return prefix ? "bg-[#5CFC00]" : "bg-[#F9000E]";
  };

  /**
   * Handle drone selection with callback
   * Pattern: Event Handler Pattern - Encapsulates selection logic
   * @param {string} registration - Drone registration to select
   * @param {boolean} closeModal - Whether to close mobile modal after selection
   */
  const handleDroneSelect = (registration, closeModal = false) => {
    setSelectedDrone(registration);
    if (closeModal) setIsOpen(false);
  };

  /**
   * Generates common tab button classes
   * Pattern: Factory Pattern - Creates consistent styling based on state
   * @param {string} tab - Tab identifier
   * @param {string} size - Text size class ('text-xs' or 'text-sm')
   * @returns {string} Combined CSS classes
   */
  const getTabClasses = (tab, size = "text-sm") => {
    const isActive = activeTab === tab;
    return `px-3 py-2 ${size} font-medium transition-colors ${
      isActive
        ? "text-white border-b-2 border-[#F9000E]"
        : "text-gray-400 hover:text-white"
    }`;
  };

  /**
   * Generates common drone item classes
   * Pattern: Factory Pattern - Creates consistent styling based on selection state
   * @param {string} registration - Drone registration
   * @returns {string} Combined CSS classes
   */
  const getDroneItemClasses = (registration) => {
    const isSelected = selectedDrone === registration;
    return `border-b border-gray-700 cursor-pointer transition-colors ${
      isSelected ? "bg-gray-600" : "hover:bg-gray-700"
    }`;
  };

  /**
   * Drone Item Component
   * Pattern: Component Composition - Reusable drone display component
   * @param {Object} drone - Drone data object
   * @param {boolean} isMobile - Whether this is rendered in mobile context
   */
  const DroneItem = ({ drone, isMobile = false }) => {
    const { registration, Name, serial, pilot, organization } =
      drone.properties;
    const textSizes = isMobile ? "text-xs" : "text-sm";
    const detailTextSize = isMobile ? "text-[10px]" : "text-xs";
    const padding = isMobile ? "p-3" : "p-4";

    return (
      <div
        onClick={() => handleDroneSelect(registration, isMobile)}
        className={`${getDroneItemClasses(registration)} ${padding}`}
      >
        {/* Drone Header with Name and Status */}
        <div className="flex items-start justify-between mb-2">
          <h3 className={`text-white font-medium ${textSizes} truncate pr-2`}>
            {Name}
          </h3>
          <div
            className={`w-2 h-2 rounded-full mt-0.5 flex-shrink-0 ${getStatusColor(
              registration
            )}`}
            aria-label={`Drone status: ${
              registration.split("-")[1]?.startsWith("B")
                ? "Active"
                : "Inactive"
            }`}
          />
        </div>

        {/* Drone Details */}
        <div className={`space-y-1 ${detailTextSize}`}>
          <div className="flex justify-between gap-2">
            <span className="text-gray-400">Serial #</span>
            <span
              className={`text-gray-300 font-mono truncate ${detailTextSize}`}
            >
              {serial}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-400">
              Registration{isMobile ? "" : " #"}
            </span>
            <span
              className={`text-gray-300 font-mono truncate ${detailTextSize}`}
            >
              {registration}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-400">Pilot</span>
            <span className={`text-gray-300 truncate ${detailTextSize}`}>
              {pilot}
            </span>
          </div>
          {!isMobile && organization && (
            <div className="flex justify-between gap-2">
              <span className="text-gray-400">Organization</span>
              <span className="text-gray-300 truncate">{organization}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Tab Button Component
   * Pattern: Component Composition - Reusable tab button
   * @param {string} tabId - Tab identifier
   * @param {string} label - Tab display label
   * @param {boolean} isMobile - Whether this is rendered in mobile context
   */
  const TabButton = ({ tabId, label, isMobile = false }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`${getTabClasses(tabId, isMobile ? "text-xs" : "text-sm")} ${
        tabId === TABS.HISTORY ? "ml-4" : ""
      }`}
    >
      {label}
    </button>
  );

  /**
   * Collapse Button Component
   * Pattern: Component Composition - Reusable collapse toggle
   * @param {number} size - Icon size
   */
  const CollapseButton = ({ size = 20 }) => (
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="text-gray-400 hover:text-white transition-colors p-1"
      aria-label={collapsed ? "Expand menu" : "Collapse menu"}
    >
      {collapsed ? <ChevronsUp size={size} /> : <ChevronsDown size={size} />}
    </button>
  );

  return (
    <>
      {/* Mobile: Floating Action Button */}
      {/* Pattern: Conditional Rendering - Only show on mobile when menu is closed */}
      <button
        onClick={() => setIsOpen(true)}
        className={`md:hidden fixed right-4 bottom-20 z-30 bg-black text-white p-3 rounded-full shadow-lg hover:bg-[#F9000E] transition-all ${
          isOpen ? "hidden" : "block"
        }`}
        aria-label="Open drone menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {/* Pattern: Conditional Rendering - Render overlay only when modal is open */}
      {isOpen && <MobileOverlay />}

      {/* Mobile: Bottom Sheet Modal */}
      {/* Pattern: Responsive Design - Different UI for mobile vs desktop */}
      <div
        className={`
          md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
          ${collapsed ? "h-[60px]" : "h-[70vh] max-h-[600px]"}
          flex flex-col
        `}
      >
        {/* Mobile Header with close button */}
        {/* Pattern: Header Pattern - Consistent header across all views */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-white font-semibold text-sm">DRONE FLYING</h2>
          <div className="flex items-center space-x-2">
            <CollapseButton size={18} />
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close drone menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Content Area */}
        {/* Pattern: Conditional Rendering - Only show content when not collapsed */}
        {!collapsed && (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Tab Navigation */}
            {/* Pattern: Tab Pattern - Consistent tab navigation */}
            <div className="flex px-4 pb-2 border-b border-gray-700">
              <TabButton tabId={TABS.DRONES} label="Drones" isMobile={true} />
              <TabButton
                tabId={TABS.HISTORY}
                label="Flights History"
                isMobile={true}
              />
            </div>

            {/* Tab Content */}
            {/* Pattern: Content Switching - Display different content based on active tab */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === TABS.DRONES && (
                <div className="pb-2">
                  {droneData.map((drone) => (
                    <DroneItem
                      key={drone.properties.registration}
                      drone={drone}
                      isMobile={true}
                    />
                  ))}
                </div>
              )}

              {activeTab === TABS.HISTORY && (
                <div className="p-4 text-gray-400 text-xs">
                  No flights history available.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Side Panel */}
      {/* Pattern: Responsive Design - Different UI layout for desktop screens */}
      <div
        className={`
          hidden md:block fixed z-10 bg-black border border-gray-700 overflow-hidden transition-all duration-300
          md:w-80 md:left-[80px] md:top-16
          lg:w-80 lg:left-[96px] lg:top-16
          xl:w-96 xl:left-[112px] xl:top-16
          ${collapsed ? "h-[50px]" : "md:h-[calc(100vh-4rem)]"}
          shadow-xl
        `}
      >
        {/* Desktop Header */}
        {/* Pattern: Header Pattern - Consistent header design */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 cursor-pointer">
          <h2 className="text-white font-semibold">DRONE FLYING</h2>
          <CollapseButton size={20} />
        </div>

        {/* Desktop Content Area */}
        {/* Pattern: Conditional Rendering - Only show content when not collapsed */}
        {!collapsed && (
          <div className="flex flex-col h-[calc(100%-50px)]">
            {/* Tab Navigation */}
            {/* Pattern: Tab Pattern - Consistent tab navigation for desktop */}
            <div className="flex px-4 pb-2 border-b border-gray-700">
              <TabButton tabId={TABS.DRONES} label="Drones" />
              <TabButton tabId={TABS.HISTORY} label="Flights History" />
            </div>

            {/* Tab Content */}
            {/* Pattern: Content Switching - Display different content based on active tab */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {activeTab === TABS.DRONES && (
                <div className="pb-2">
                  {droneData.map((drone) => (
                    <DroneItem
                      key={drone.properties.registration}
                      drone={drone}
                      isMobile={false}
                    />
                  ))}
                </div>
              )}

              {activeTab === TABS.HISTORY && (
                <div className="p-4 text-gray-400 text-sm">
                  No flights history available.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DroneMenu;
