/**
 * ActionButton Component
 *
 * Design Patterns Used:
 * 1. Component Composition Pattern - Reusable action button with optional badge
 * 2. Factory Pattern - Dynamic class generation based on configuration
 * 3. Strategy Pattern - Different button behaviors based on configuration
 * 4. Accessibility Pattern - ARIA labels and semantic HTML
 *
 * Reusable button component for navbar actions with optional notification badge
 */

import { NAVBAR_CONFIG } from "./navbarConfig";

/**
 * Generates responsive size classes for icons
 * Pattern: Factory Pattern - Creates consistent sizing across breakpoints
 * @returns {string} Combined CSS classes for icon sizing
 */
const getIconSizeClasses = () => "h-4 w-4 sm:h-5 sm:w-5";

/**
 * Generates responsive classes for notification badge
 * Pattern: Factory Pattern - Creates consistent badge styling
 * @returns {string} Combined CSS classes for notification badge
 */
const getBadgeClasses = () =>
  "absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 text-[10px] sm:text-xs rounded-full w-3.5 h-3.5 sm:w-5 sm:h-5 flex items-center justify-center font-semibold";

/**
 * Action Button Component
 * Pattern: Component Composition - Reusable action button with optional badge
 * @param {Object} props - Component props
 * @param {Object} props.button - Button configuration object
 * @param {string} props.button.icon - Icon source path
 * @param {string} props.button.alt - Alt text for icon
 * @param {string} props.button.ariaLabel - ARIA label for accessibility
 * @param {Function} props.button.action - Click handler function
 * @param {Object} [props.button.badge] - Optional badge configuration
 * @param {number} props.button.badge.count - Badge count number
 * @param {string} props.button.badge.ariaLabel - ARIA label for badge
 */
const ActionButton = ({ button }) => {
  const { icon, alt, ariaLabel, action, badge } = button;

  return (
    <button
      onClick={action}
      className={`relative ${NAVBAR_CONFIG.LAYOUT.PADDING.BUTTON} ${NAVBAR_CONFIG.COLORS.TEXT_SECONDARY} ${NAVBAR_CONFIG.COLORS.HOVER_TRANSITION}`}
      aria-label={ariaLabel}
      type="button"
    >
      <img
        src={icon}
        alt={alt}
        className={`${getIconSizeClasses()} brightness-0 invert opacity-60 ${
          NAVBAR_CONFIG.TRANSITIONS.HOVER_OPACITY
        }`}
        role="presentation"
      />

      {/* Notification Badge */}
      {badge && (
        <span
          className={`${getBadgeClasses()} ${
            NAVBAR_CONFIG.COLORS.NOTIFICATION_BADGE
          } ${NAVBAR_CONFIG.COLORS.TEXT_PRIMARY}`}
          aria-label={badge.ariaLabel}
          role="status"
        >
          {badge.count}
        </span>
      )}
    </button>
  );
};

export default ActionButton;
