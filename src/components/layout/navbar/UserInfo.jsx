/**
 * UserInfo Component
 *
 * Design Patterns Used:
 * 1. Component Composition Pattern - Reusable user information display
 * 2. Responsive Design Pattern - Different layouts for mobile/desktop
 * 3. Strategy Pattern - Different display strategies based on screen size
 * 4. Accessibility Pattern - ARIA labels for screen readers
 *
 * Displays user information with adaptive layout for different screen sizes
 */

import { NAVBAR_CONFIG, USER_INFO } from "./navbarConfig";

/**
 * User Info Component
 * Pattern: Component Composition - Reusable user information display
 * Pattern: Responsive Strategy - Different layouts for mobile/desktop
 *
 * Renders user information with:
 * - Mobile: Condensed name display
 * - Desktop: Full greeting with name and title
 */
const UserInfo = () => (
  <div className={NAVBAR_CONFIG.COLORS.TEXT_PRIMARY}>
    {/* Mobile: Condensed name display */}
    <div className="sm:hidden text-xs">
      <span
        className="font-semibold"
        aria-label={`User: ${USER_INFO.fullName}`}
      >
        {USER_INFO.fullName}
      </span>
    </div>

    {/* Desktop: Full user information */}
    <div className="hidden sm:block">
      <div className="text-xs md:text-sm">
        Hello,{" "}
        <span
          className="font-semibold"
          aria-label={`User: ${USER_INFO.fullName}`}
        >
          {USER_INFO.fullName}
        </span>
      </div>
      <div
        className={`text-[10px] md:text-xs ${NAVBAR_CONFIG.COLORS.TEXT_SECONDARY}`}
      >
        {USER_INFO.title}
      </div>
    </div>
  </div>
);

export default UserInfo;
