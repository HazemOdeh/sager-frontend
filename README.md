# Sager Frontend 🚁🗺️

Sager is a **real-time drone monitoring and tracking system** built with **React**, designed with clean architecture and modern design patterns.  
It provides a responsive interface for tracking multiple drones on an interactive map with live updates via WebSocket communication.

---

## 🌟 Features

- **Real-Time Drone Tracking**: Live drone position updates via Socket.IO
- **Interactive Map**: Mapbox GL JS integration for smooth map interactions
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Drone Management**: Comprehensive drone details including registration, pilot info, battery status
- **Flight Path Visualization**: Visual representation of drone flight paths
- **Statistics Dashboard**: Real-time counters for active/inactive drones
- **Navigation System**: Intuitive tab-based navigation with mobile bottom bar and desktop sidebar
- **Notifications**: Real-time notification system with badge indicators

---

## 📂 Project Structure

```
sager-frontend/
├── public/                          # Static assets
│   ├── sagerLogo.png               # Application logo
│   ├── dashboard-svgrepo-com-2.svg # Navigation icons
│   ├── location-svgrepo-com-2.svg
│   ├── bell.svg                    # UI icons
│   ├── capture-svgrepo-com.svg
│   ├── language-svgrepo-com.svg
│   └── drone.svg
│
├── src/
│   ├── components/
│   │   ├── Layout.jsx              # Main layout wrapper
│   │   ├── MapContainer.jsx        # Mapbox GL map component
│   │   │
│   │   ├── dronedetails/
│   │   │   ├── DroneMenu.jsx       # Drone list and details panel
│   │   │   └── DroneCounterOverlay.jsx  # Statistics overlay
│   │   │
│   │   └── layout/
│   │       ├── Navbar.jsx          # Top navigation bar
│   │       ├── TabNavigation.jsx   # Responsive tab navigation
│   │       └── navbar/
│   │           ├── ActionButton.jsx      # Action button component
│   │           ├── BrandLogo.jsx         # Logo component
│   │           ├── UserInfo.jsx          # User info display
│   │           └── navbarConfig.js       # Navbar configuration
│   │
│   ├── pages/
│   │   └── MapPage.jsx             # Main map page component
│   │
│   ├── utils/
│   │   └── socket.js               # Socket.IO client configuration
│   │
│   ├── App.jsx                     # Application router setup
│   ├── App.css                     # Global styles
│   └── main.jsx                    # Application entry point
│
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── eslint.config.js                # ESLint configuration
└── README.md                       # Project documentation
```

---

## ▶️ How to Run

### Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Backend server** running on `http://localhost:9013` (for Socket.IO connection)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/HazemOdeh/sager-frontend.git
   cd sager-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The app will hot-reload when you make changes

### Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint for code quality checks
```

---

## 🛠️ Technology Stack

### Core Technologies
- **React 19.1.1** - UI library with latest features
- **Vite 7.1.2** - Next-generation frontend tooling
- **React Router 7.8.2** - Client-side routing

### UI & Styling
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **Lucide React 0.542.0** - Beautiful icon library

### Mapping & Visualization
- **Mapbox GL 3.14.0** - Interactive map rendering and controls

### Real-Time Communication
- **Socket.IO Client 4.8.1** - WebSocket communication for live updates

### Development Tools
- **ESLint 9.33.0** - Code quality and consistency
- **@vitejs/plugin-react** - React support for Vite

---

## 🏗️ Design Patterns & Architecture

### 1. **Container/Presenter Pattern**
- **MapPage**: Container component managing state and business logic
- **MapContainer, DroneMenu**: Presenter components focused on UI

### 2. **Component Composition Pattern**
- Modular components that can be composed together
- Reusable UI components (ActionButton, BrandLogo, UserInfo)
- Separation of concerns with dedicated component files

### 3. **Configuration Pattern**
- Centralized configuration objects (navbarConfig.js)
- Easy maintenance and consistent styling
- Single source of truth for component settings

### 4. **Observer Pattern**
- Socket.IO event listeners for real-time data
- React state updates trigger UI re-renders
- Event-driven architecture

### 5. **Factory Pattern**
- Dynamic CSS class generation based on state
- Marker and popup creation for map elements
- Responsive styling functions

### 6. **Responsive Design Pattern**
- Mobile-first approach with adaptive layouts
- Breakpoint-based component variations
- Unified components handling multiple screen sizes

### 7. **Singleton Pattern**
- Single map instance management
- Centralized Socket.IO connection
- Shared state across components

### 8. **Strategy Pattern**
- Different rendering strategies for mobile/desktop
- Conditional styling based on device type
- Visual state changes based on drone status

### 9. **Facade Pattern**
- Simplified interface over complex Mapbox API
- Clean component APIs hiding implementation details

---

## 📱 Components Documentation

### **Layout Components**

#### **Layout.jsx**
Main application wrapper providing consistent structure across all pages.
- Fixed navbar at the top
- Side/bottom navigation based on screen size
- Content area with React Router outlet

#### **Navbar.jsx**
Top navigation bar with brand, actions, and user information.
- **Features**: Logo, action buttons (capture, language, notifications), user info
- **Responsive**: Adaptive spacing and sizing across breakpoints
- **Accessibility**: ARIA labels and semantic HTML

#### **TabNavigation.jsx**
Responsive navigation system adapting to device type.
- **Mobile**: Fixed bottom navigation bar
- **Desktop**: Fixed left sidebar navigation
- **Routes**: Dashboard (`/`) and Map (`/map`)

### **Map Components**

#### **MapPage.jsx**
Main page orchestrating map, drone data, and overlays.
- **State Management**: Drone data, selection, statistics
- **Socket Integration**: Real-time drone position updates
- **Data Processing**: Merging drone data with historical positions

#### **MapContainer.jsx**
Mapbox GL map implementation with drone visualization.
- **Features**: Interactive markers, flight paths, popup details
- **Camera Control**: Automatic centering on selected drone
- **Event Handling**: Click events for drone selection

#### **DroneMenu.jsx**
Collapsible panel displaying drone list and details.
- **Tabs**: Drones list and flight history
- **Responsive**: Different layouts for mobile/desktop
- **Interactive**: Drone selection with detailed information

#### **DroneCounterOverlay.jsx**
Statistics overlay showing active/inactive drone counts.
- **Responsive**: Positioned differently on mobile/desktop
- **Real-time**: Updates automatically with drone status changes

### **Navbar Subcomponents**

#### **ActionButton.jsx**
Reusable action button with optional notification badge.
- **Configuration-driven**: Icon, label, action from config
- **Accessibility**: Proper ARIA labels and roles

#### **BrandLogo.jsx**
Application logo component with responsive sizing.

#### **UserInfo.jsx**
User information display with adaptive layout.
- **Desktop**: Full name and title
- **Mobile**: Condensed display

---

## ⚙️ Configuration

### Socket.IO Connection
```javascript
// src/utils/socket.js
const socket = io("http://localhost:9013", {
  transports: ["polling"],
});
```

### Environment Variables
Create a `.env` file for environment-specific configuration:
```env
VITE_SOCKET_URL=http://localhost:9013
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

---

## 🎨 Styling Approach

### Tailwind CSS
- **Utility-first**: Rapid UI development with utility classes
- **Responsive**: Built-in breakpoints (sm, md, lg, xl)
- **Custom Configuration**: Extended with custom colors and spacing

### Design System
- **Colors**: Black backgrounds with gray accents
- **Brand Color**: #F9000E (Sager red)
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent padding and margins

---

## 🚀 Key Features Breakdown

### Real-Time Tracking
- WebSocket connection via Socket.IO
- Live drone position updates
- Automatic map updates without page refresh

### Responsive Navigation
- **Desktop**: Fixed left sidebar with icon labels
- **Mobile**: Bottom navigation bar with touch-friendly targets
- Active state indicators with brand color

### Interactive Map
- Mapbox GL JS for smooth interactions
- Custom drone markers with status colors
- Flight path visualization with coordinate trails
- Popup details on marker click
- Camera following for selected drones

### Drone Management
- Comprehensive drone details panel
- Registration number, pilot, organization
- Battery level indicators
- Mission status tracking

---

## 📊 Data Flow

```
Backend (Socket.IO Server)
         ↓
  socket.io-client
         ↓
   MapPage Component
         ↓
    State Updates
         ↓
   Child Components (MapContainer, DroneMenu, DroneCounterOverlay)
         ↓
      UI Updates
```

---

## 🧪 Development Guidelines

### Code Quality
- ESLint configured for React best practices
- Consistent code formatting
- Component-level documentation with JSDoc
- Design patterns documented in code comments

### Component Standards
- Functional components with hooks
- Props destructuring for clarity
- Configuration-driven approach
- Accessibility considerations (ARIA labels)

### File Organization
- Feature-based folder structure
- Separated concerns (components, pages, utils)
- Reusable component extraction
- Configuration files for constants

---

## 📄 License

This project is private and proprietary.

---

## 👥 Authors

- **Hazem Odeh** - Frontend Engineer

---

## 🙏 Acknowledgments

- **Mapbox GL JS** for excellent mapping capabilities
- **Socket.IO** for real-time communication
- **Tailwind CSS** for rapid UI development
- **React Team** for the amazing library

---

**Built with ❤️ using React + Vite**
