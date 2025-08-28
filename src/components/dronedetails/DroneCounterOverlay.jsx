/**
 * DroneCounterOverlay Component
 *
 * Design Patterns Used:
 * 1. Component Composition Pattern - Reusable statistics display component
 * 2. Responsive Design Pattern - Adaptive layout for mobile/desktop
 * 3. Factory Pattern - Dynamic class generation based on layout type
 * 4. Configuration Pattern - Uses centralized styling configuration
 * 5. Strategy Pattern - Different display strategies for mobile/desktop
 *
 * Displays drone statistics in an overlay with:
 * - Responsive positioning (desktop: bottom-right, mobile: bottom-left)
 * - Adaptive sizing and spacing
 * - Consistent styling with backdrop blur
 * - Accessibility considerations
 */

// Configuration constants for the overlay component
const OVERLAY_CONFIG = {
  COLORS: {
    TEXT_SECONDARY: "text-gray-300",
    DRONE_ACTIVE: "text-red-400",
    OVERLAY_BG: "bg-gray-800 bg-opacity-95",
    BORDER: "border-gray-700",
  },
  LAYOUT: {
    Z_INDEX: {
      OVERLAY: 30,
    },
    SPACING: {
      DESKTOP: "space-x-1",
      MOBILE: "space-x-1",
    },
    POSITIONING: {
      DESKTOP: "fixed bottom-4 right-4",
      MOBILE: "fixed bottom-20 left-2",
    },
  },
  STYLING: {
    BACKDROP: "backdrop-blur-sm",
    RADIUS: "rounded-xl",
    SHADOW: "shadow-xl",
  },
};

// Label constants
const LABELS = {
  DRONE_STATUS: "Drone Flying",
};

/**
 * Generates container classes based on layout type
 * Pattern: Factory Pattern - Creates responsive positioning classes
 * @param {boolean} isMobile - Whether this is mobile layout
 * @returns {string} Combined CSS classes for container
 */
const getContainerClasses = (isMobile) => {
  const positioning = isMobile
    ? OVERLAY_CONFIG.LAYOUT.POSITIONING.MOBILE
    : OVERLAY_CONFIG.LAYOUT.POSITIONING.DESKTOP;

  const visibility = isMobile ? "md:hidden" : "hidden md:block";

  return `${visibility} ${positioning} z-${OVERLAY_CONFIG.LAYOUT.Z_INDEX.OVERLAY}`;
};

/**
 * Generates content wrapper classes
 * Pattern: Factory Pattern - Creates consistent styling classes
 * @returns {string} Combined CSS classes for content wrapper
 */
const getContentClasses = () => {
  return `${OVERLAY_CONFIG.COLORS.OVERLAY_BG} ${OVERLAY_CONFIG.STYLING.BACKDROP} ${OVERLAY_CONFIG.STYLING.RADIUS} ${OVERLAY_CONFIG.STYLING.SHADOW} ${OVERLAY_CONFIG.COLORS.BORDER} border`;
};

/**
 * Gets responsive padding based on layout type
 * Pattern: Strategy Pattern - Different padding strategies for mobile/desktop
 * @param {boolean} isMobile - Whether this is mobile layout
 * @returns {string} Padding CSS classes
 */
const getPaddingClasses = (isMobile) => {
  return isMobile ? "px-3 py-2" : "p-2";
};

/**
 * Gets responsive text size based on layout type
 * Pattern: Strategy Pattern - Different text size strategies for mobile/desktop
 * @param {boolean} isMobile - Whether this is mobile layout
 * @returns {string} Text size CSS classes
 */
const getTextSizeClasses = (isMobile) => {
  return isMobile ? "text-xs" : "text-sm";
};

/**
 * Gets responsive spacing based on layout type
 * Pattern: Strategy Pattern - Different spacing strategies for mobile/desktop
 * @param {boolean} isMobile - Whether this is mobile layout
 * @returns {string} Spacing CSS classes
 */
const getSpacingClasses = (isMobile) => {
  return isMobile
    ? OVERLAY_CONFIG.LAYOUT.SPACING.MOBILE
    : OVERLAY_CONFIG.LAYOUT.SPACING.DESKTOP;
};

/**
 * DroneCounterOverlay Component
 * Pattern: Component Composition - Reusable statistics display
 * Pattern: Responsive Design - Different layouts for mobile/desktop
 *
 * @param {Object} props - Component props
 * @param {Object} props.stats - Drone statistics object
 * @param {number} props.stats.active - Number of active/flying drones
 * @param {number} props.stats.inactive - Number of inactive drones
 * @param {number} props.stats.total - Total number of drones
 * @param {boolean} [props.isMobile=false] - Whether this is mobile layout
 */
const DroneCounterOverlay = ({ stats, isMobile = false }) => {
  const containerClasses = getContainerClasses(isMobile);
  const contentClasses = getContentClasses();
  const paddingClasses = getPaddingClasses(isMobile);
  const textSizeClasses = getTextSizeClasses(isMobile);
  const spacingClasses = getSpacingClasses(isMobile);

  return (
    <div
      className={containerClasses}
      role="complementary"
      aria-label="Drone statistics"
    >
      <div className={`${contentClasses} ${paddingClasses}`}>
        <div className={`flex items-center ${spacingClasses}`}>
          <span
            className={`${textSizeClasses} font-semibold ${OVERLAY_CONFIG.COLORS.DRONE_ACTIVE}`}
            aria-label={`${stats.active} active drones`}
          >
            {stats.active}
          </span>
          <span
            className={`${textSizeClasses} ${OVERLAY_CONFIG.COLORS.TEXT_SECONDARY}`}
          >
            {LABELS.DRONE_STATUS}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DroneCounterOverlay;
