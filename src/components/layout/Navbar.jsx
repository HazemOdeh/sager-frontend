/**
 * Navbar Component
 *
 * Design Patterns Used:
 * 1. Responsive Design Pattern - Adaptive layout and sizing across breakpoints
 * 2. Component Composition Pattern - Composed of separated, reusable components
 * 3. Configuration Pattern - Uses centralized configuration from external file
 * 4. Container Pattern - Orchestrates layout of child components
 * 5. Facade Pattern - Simplifies complex navigation header interface
 * 6. Separation of Concerns - Each component handles its own responsibility
 * 7. Accessibility Pattern - ARIA labels and semantic HTML structure
 *
 * Main navigation header that orchestrates:
 * - Brand logo component
 * - Action buttons with notifications
 * - User information display
 * - Responsive layout management
 */

// Import separated components and configuration
import BrandLogo from "./navbar/BrandLogo";
import ActionButton from "./navbar/ActionButton";
import UserInfo from "./navbar/UserInfo";
import { NAVBAR_CONFIG, ACTION_BUTTONS } from "./navbar/navbarConfig";

/**
 * Main Navbar Component
 * Pattern: Facade Pattern - Simplifies complex navigation header interface
 * Pattern: Container Pattern - Encapsulates and orchestrates child components
 * Pattern: Composition Pattern - Builds complex UI from simpler components
 *
 * Renders a responsive navigation header with brand, actions, and user info
 */
export default function Navbar() {
  return (
    <header
      className={`flex sticky top-0 z-${NAVBAR_CONFIG.LAYOUT.Z_INDEX} justify-between items-center ${NAVBAR_CONFIG.COLORS.BACKGROUND} ${NAVBAR_CONFIG.LAYOUT.PADDING.CONTAINER}`}
      role="banner"
    >
      {/* Brand Section */}
      {/* Pattern: Component Composition - Delegates brand display to specialized component */}
      <div className="flex-shrink-0">
        <BrandLogo />
      </div>

      {/* Actions and User Section */}
      {/* Pattern: Responsive Layout - Adaptive spacing across breakpoints */}
      <div
        className={`flex items-center ${NAVBAR_CONFIG.LAYOUT.SPACING.TABLET} md:${NAVBAR_CONFIG.LAYOUT.SPACING.DESKTOP}`}
      >
        {/* Action Buttons Container */}
        {/* Pattern: Factory Pattern - Dynamic component generation from configuration */}
        <div
          className={`flex items-center ${NAVBAR_CONFIG.LAYOUT.SPACING.MOBILE} sm:${NAVBAR_CONFIG.LAYOUT.SPACING.TABLET} md:${NAVBAR_CONFIG.LAYOUT.SPACING.DESKTOP}`}
        >
          {ACTION_BUTTONS.map((button) => (
            <ActionButton key={button.id} button={button} />
          ))}
        </div>

        {/* User Information */}
        {/* Pattern: Component Composition - Delegates user info display to specialized component */}
        <UserInfo />
      </div>
    </header>
  );
}
