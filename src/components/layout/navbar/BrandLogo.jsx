/**
 * BrandLogo Component
 *
 * Design Patterns Used:
 * 1. Component Composition Pattern - Reusable brand logo component
 * 2. Responsive Design Pattern - Adaptive sizing across breakpoints
 * 3. Configuration Pattern - Centralized logo configuration
 * 4. Accessibility Pattern - Proper alt text and semantic HTML
 *
 * Displays the brand logo with responsive sizing
 */

import { NAVBAR_CONFIG } from "./navbarConfig";

/**
 * Brand Logo Component
 * Pattern: Component Composition - Reusable brand logo with responsive sizing
 *
 * Renders the brand logo with:
 * - Responsive sizing across breakpoints
 * - Proper accessibility attributes
 * - Centralized configuration
 */
const BrandLogo = () => (
  <img
    src={NAVBAR_CONFIG.BRAND.LOGO_SRC}
    alt={NAVBAR_CONFIG.BRAND.LOGO_ALT}
    className="h-3 sm:h-7 md:h-8 w-auto"
    role="img"
  />
);

export default BrandLogo;
