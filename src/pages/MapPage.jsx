/**
 * MapPage Component
 *
 * Design Patterns Used:
 * 1. Container/Presenter Pattern - Manages state and coordinates child components
 * 2. Observer Pattern - Listens to real-time socket updates
 * 3. State Management Pattern - Centralized drone data and selection state
 * 4. Component Composition Pattern - Composes map, menu, and overlay components
 * 5. Event-Driven Architecture - Socket-based real-time updates
 * 6. Data Transformation Pattern - Processes and aggregates drone statistics
 * 7. Lifecycle Management Pattern - Proper socket connection/cleanup
 * 8. Separation of Concerns - Delegates UI components to specialized modules
 *
 * Main page component that orchestrates:
 * - Real-time drone data via WebSocket
 * - Interactive map with drone visualization
 * - Drone selection and navigation
 * - Statistics display through separated overlay component
 * - Clean component composition and state management
 */

import { useEffect, useState } from "react";
import DroneMenu from "../components/dronedetails/DroneMenu";
import MapContainer from "../components/MapContainer";
import DroneCounterOverlay from "../components/dronedetails/DroneCounterOverlay";
import socket from "../utils/socket";

// Configuration constants for maintainability
const MAP_PAGE_CONFIG = {
  COLORS: {
    TEXT_PRIMARY: "text-white",
  },
};

// Drone status classification constants
const DRONE_STATUS = {
  ACTIVE_PREFIX: "B",
};

/**
 * Determines if a drone is active based on registration pattern
 * Pattern: Strategy Pattern - Classification strategy for drone status
 * @param {string} registration - Drone registration number
 * @returns {boolean} Whether the drone is active/flying
 */
const isDroneActive = (registration) => {
  return !registration.split("-")[1]?.startsWith(DRONE_STATUS.ACTIVE_PREFIX);
};

/**
 * Calculates drone statistics from drone data array
 * Pattern: Data Transformation Pattern - Aggregates data for display
 * @param {Array} droneData - Array of drone objects
 * @returns {Object} Statistics object with counts
 */
const calculateDroneStats = (droneData) => {
  const activeDrones = droneData.filter((drone) =>
    isDroneActive(drone.properties.registration)
  );
  const inactiveDrones = droneData.filter(
    (drone) => !isDroneActive(drone.properties.registration)
  );

  return {
    active: activeDrones.length,
    inactive: inactiveDrones.length,
    total: droneData.length,
  };
};

/**
 * Processes incoming drone data and merges with existing data
 * Pattern: Data Merging Strategy - Maintains historical positions while updating current state
 * @param {Array} previousData - Current drone data array
 * @param {Object} newData - Incoming socket data with drone updates
 * @returns {Array} Updated drone data array
 */
const mergeDroneData = (previousData, newData) => {
  const updated = [...previousData];

  newData.features.forEach((newDrone) => {
    const registration = newDrone.properties.registration;
    const existingIndex = updated.findIndex(
      (drone) => drone.properties.registration === registration
    );

    if (existingIndex !== -1) {
      // Update existing drone with new position and properties
      const existing = updated[existingIndex];
      updated[existingIndex] = {
        ...existing,
        positions: [...existing.positions, newDrone.geometry.coordinates],
        geometry: newDrone.geometry,
        properties: {
          ...existing.properties,
          ...newDrone.properties,
        },
      };
    } else {
      // Add new drone with initial position
      updated.push({
        ...newDrone,
        positions: [newDrone.geometry.coordinates],
      });
    }
  });

  return updated;
};

/**
 * Main MapPage Component
 * Pattern: Container Pattern - Orchestrates state and child components
 * Pattern: Observer Pattern - Manages real-time data subscriptions
 */
export default function MapPage() {
  // State management for drone data and UI
  const [droneData, setDroneData] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [droneStats, setDroneStats] = useState({
    active: 0,
    inactive: 0,
    total: 0,
  });

  /**
   * Socket Connection and Data Management Effect
   * Pattern: Observer Pattern - Subscribes to real-time drone updates
   * Pattern: Lifecycle Management - Proper connection setup and cleanup
   */
  useEffect(() => {
    /**
     * Socket connection handler
     * Pattern: Event Handler Pattern - Handles connection events
     */
    const handleConnect = () => {
      console.log("✅ Socket Connected:", socket.id);
    };

    /**
     * Socket message handler
     * Pattern: Event Handler Pattern - Processes incoming drone data
     * Pattern: State Update Pattern - Merges new data with existing state
     */
    const handleMessage = (data) => {
      setDroneData((previousData) => mergeDroneData(previousData, data));
    };

    // Register socket event listeners
    socket.on("connect", handleConnect);
    socket.on("message", handleMessage);

    // Cleanup function for component unmounting
    return () => {
      socket.off("connect", handleConnect);
      socket.off("message", handleMessage);
    };
  }, []);

  /**
   * Drone Statistics Calculation Effect
   * Pattern: Derived State Pattern - Calculates stats from primary data
   * Pattern: Observer Pattern - Reacts to drone data changes
   */
  useEffect(() => {
    const stats = calculateDroneStats(droneData);
    setDroneStats(stats);
  }, [droneData]);

  return (
    <div
      className={`relative w-full h-screen ${MAP_PAGE_CONFIG.COLORS.TEXT_PRIMARY}`}
    >
      {/* Map Container */}
      {/* Pattern: Component Composition - Delegates map rendering to specialized component */}
      <MapContainer
        selectedDrone={selectedDrone}
        setSelectedDrone={setSelectedDrone}
        droneData={droneData}
      />

      {/* Desktop Drone Counter Overlay */}
      {/* Pattern: Responsive Design - Desktop-specific statistics display */}
      <DroneCounterOverlay stats={droneStats} isMobile={false} />

      {/* Mobile Drone Counter Overlay */}
      {/* Pattern: Responsive Design - Mobile-specific statistics display */}
      <DroneCounterOverlay stats={droneStats} isMobile={true} />

      {/* Drone Menu */}
      {/* Pattern: Component Composition - Delegates drone menu to specialized component */}
      <DroneMenu
        selectedDrone={selectedDrone}
        setSelectedDrone={setSelectedDrone}
        droneData={droneData}
      />
    </div>
  );
}
