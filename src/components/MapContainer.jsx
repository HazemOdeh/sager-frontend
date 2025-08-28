import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

/**
 * MapContainer Component
 *
 * Design Patterns Used:
 * 1. Singleton Pattern - Single map instance management
 * 2. Observer Pattern - Event-driven interactions with map and markers
 * 3. Strategy Pattern - Different visual strategies based on drone state
 * 4. Factory Pattern - Dynamic marker and popup creation
 * 5. Facade Pattern - Simplified interface over complex Mapbox API
 * 6. Command Pattern - Event handlers encapsulate user actions
 * 7. State Management Pattern - Ref-based state for map instances
 * 8. Lifecycle Management Pattern - Proper cleanup and initialization
 *
 * @param {Array} droneData - Array of drone objects with positions and properties
 * @param {string} selectedDrone - Currently selected drone registration
 * @param {Function} setSelectedDrone - Function to update selected drone
 */

// Mapbox access token configuration
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGF6ZW1vZGVoIiwiYSI6ImNtZXU3N2dpNzA0Zm0ybXNkaHJtYjJsbmwifQ.vi4MI973uksV4WNw6PvXNw";

// Configuration constants for better maintainability
const MAP_CONFIG = {
  STYLE: "mapbox://styles/mapbox/dark-v11",
  CENTER: [35.832253, 31.851025],
  ZOOM: 12,
  SELECTED_ZOOM: 15,
  FLY_DURATION: 1000,
  ANIMATION_BUFFER: 1100,
};

const DRONE_CONFIG = {
  MARKER_SIZE: 40,
  ICON_SIZE: 24,
  ARROW_SIZE: 12,
  PATH_WIDTH: 3,
  PATH_OPACITY: 0.8,
  CURVE_STEPS: 20,
  CURVE_OFFSET_FACTOR: 0.3,
  MAX_CURVE_OFFSET: 0.01,
};

const COLORS = {
  ACTIVE: "#00FF00",
  INACTIVE: "#FF0000",
  BORDER: "white",
  SELECTED_GLOW: "rgba(255, 255, 255, 0.8)",
};

/**
 * Creates smooth curved path from coordinates using quadratic Bezier curves
 * Pattern: Algorithm Strategy - Implements specific path smoothing strategy
 * @param {Array} coordinates - Array of [lng, lat] coordinate pairs
 * @returns {Array} Smoothed coordinate array
 */
/**
 * Creates smooth curved path from coordinates using quadratic Bezier curves
 * Pattern: Algorithm Strategy - Implements specific path smoothing strategy
 * @param {Array} coordinates - Array of [lng, lat] coordinate pairs
 * @returns {Array} Smoothed coordinate array
 */
const createCurvedPath = (coordinates) => {
  if (coordinates.length < 2) return coordinates;

  const curvedCoords = [coordinates[0]];

  for (let i = 0; i < coordinates.length - 1; i++) {
    const start = coordinates[i];
    const end = coordinates[i + 1];

    // Calculate midpoint and curve control point
    const midLat = (start[1] + end[1]) / 2;
    const midLng = (start[0] + end[0]) / 2;
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Create perpendicular curve offset
    const curveOffset = Math.min(
      distance * DRONE_CONFIG.CURVE_OFFSET_FACTOR,
      DRONE_CONFIG.MAX_CURVE_OFFSET
    );
    const controlLng = midLng - dy * curveOffset;
    const controlLat = midLat + dx * curveOffset;

    // Generate smooth curve using quadratic Bezier interpolation
    for (let t = 0; t <= DRONE_CONFIG.CURVE_STEPS; t++) {
      const u = t / DRONE_CONFIG.CURVE_STEPS;
      const u2 = u * u;
      const u3 = 1 - u;
      const u4 = u3 * u3;

      const lat = u4 * start[1] + 2 * u3 * u * controlLat + u2 * end[1];
      const lng = u4 * start[0] + 2 * u3 * u * controlLng + u2 * end[0];

      if (t > 0 || i === 0) curvedCoords.push([lng, lat]);
    }
  }

  return curvedCoords;
};

export default function MapContainer({
  droneData,
  selectedDrone,
  setSelectedDrone,
}) {
  // Ref Management Pattern - Persistent references across re-renders
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const isProgrammaticMove = useRef(false);

  /**
   * Creates stable callback for resetting drone selection
   * Pattern: Callback Pattern - Memoized event handler to prevent unnecessary re-renders
   * Pattern: Guard Pattern - Prevents reset during programmatic map movements
   */
  const resetSelection = useCallback(() => {
    // Guard clause: Don't reset if this is a programmatic move (like flyTo)
    if (isProgrammaticMove.current) {
      return;
    }
    console.log("User interaction detected - resetting selection");
    setSelectedDrone(null);
  }, [setSelectedDrone]);

  /**
   * Map Initialization Effect
   * Pattern: Singleton Pattern - Ensures only one map instance exists
   * Pattern: Lifecycle Management - Proper setup and cleanup
   */
  useEffect(() => {
    // Singleton guard: prevent multiple map instances
    if (mapRef.current) return;

    // Initialize Mapbox map with configuration
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAP_CONFIG.STYLE,
      center: MAP_CONFIG.CENTER,
      zoom: MAP_CONFIG.ZOOM,
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Cleanup function for component unmounting
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  /**
   * Map Event Listeners Setup Effect
   * Pattern: Observer Pattern - Map observes user interactions and responds accordingly
   * Pattern: Event Delegation - Multiple event types handled through common interface
   */
  useEffect(() => {
    if (!mapRef.current) return;

    /**
     * Event Handler Factory - Creates consistent event handlers
     * Pattern: Factory Pattern - Standardized event handler creation
     */
    const createInteractionHandler = (eventType) => () => {
      console.log(`${eventType} interaction detected`);
      resetSelection();
    };

    // Create specific event handlers
    const handleDragStart = createInteractionHandler("Drag");
    const handleWheel = createInteractionHandler("Wheel");
    const handleBoxZoomStart = createInteractionHandler("BoxZoom");
    const handleDoubleClick = createInteractionHandler("DoubleClick");
    const handleTouchStart = createInteractionHandler("Touch");

    /**
     * Map Click Handler - Handles clicks on map background
     * Pattern: Event Filtering - Distinguishes between marker and map clicks
     */
    const handleClick = (e) => {
      // Check if click was on the map itself, not on a marker
      const features = mapRef.current.queryRenderedFeatures(e.point);
      const clickedOnMarker =
        e.originalEvent.target.closest(".mapboxgl-marker");

      if (!clickedOnMarker && features.length === 0) {
        console.log("Map background clicked");
        resetSelection();
      }
    };

    // Register event listeners using Observer pattern
    const eventHandlers = [
      ["dragstart", handleDragStart],
      ["wheel", handleWheel],
      ["boxzoomstart", handleBoxZoomStart],
      ["dblclick", handleDoubleClick],
      ["touchstart", handleTouchStart],
      ["click", handleClick],
    ];

    eventHandlers.forEach(([event, handler]) => {
      mapRef.current.on(event, handler);
    });

    // Cleanup function - removes all event listeners
    return () => {
      if (mapRef.current) {
        eventHandlers.forEach(([event, handler]) => {
          mapRef.current.off(event, handler);
        });
      }
    };
  }, [resetSelection]);

  /**
   * Determines drone status and color based on registration pattern
   * Pattern: Strategy Pattern - Different color strategies based on drone state
   * @param {string} registration - Drone registration number
   * @returns {Object} Status information and color
   */
  const getDroneStatus = (registration) => {
    const isFlyable = registration.split("-")[1]?.startsWith("B");
    return {
      isFlyable,
      color: isFlyable ? COLORS.ACTIVE : COLORS.INACTIVE,
      status: isFlyable ? "Active" : "Inactive",
    };
  };

  /**
   * Creates drone marker element with styling and directional indicator
   * Pattern: Factory Pattern - Creates standardized marker elements
   * Pattern: Builder Pattern - Builds complex DOM elements step by step
   * @param {Object} drone - Drone data object
   * @param {string} color - Marker color
   * @returns {HTMLElement} Configured marker element
   */
  const createMarkerElement = (drone, color) => {
    // Create main marker container
    const el = document.createElement("div");
    el.className = "drone-marker";
    Object.assign(el.style, {
      width: `${DRONE_CONFIG.MARKER_SIZE}px`,
      height: `${DRONE_CONFIG.MARKER_SIZE}px`,
      background: color,
      borderRadius: "50%",
      border: `2px solid ${COLORS.BORDER}`,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `rotate(${drone.properties.yaw}deg)`,
    });

    // Create directional arrow indicator
    const arrow = document.createElement("div");
    Object.assign(arrow.style, {
      position: "absolute",
      width: "0",
      height: "0",
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      borderBottom: `${DRONE_CONFIG.ARROW_SIZE}px solid ${color}`,
      top: "-14px",
      left: "50%",
      transform: "translateX(-50%)",
    });
    el.appendChild(arrow);

    // Create drone icon
    const img = document.createElement("img");
    Object.assign(img, {
      src: "/drone.svg",
      style: `width: ${DRONE_CONFIG.ICON_SIZE}px; height: ${DRONE_CONFIG.ICON_SIZE}px; pointer-events: none;`,
    });
    el.appendChild(img);

    return el;
  };

  /**
   * Creates popup content for drone information display
   * Pattern: Template Method - Standardized popup content generation
   * @param {Object} drone - Drone data object
   * @returns {mapboxgl.Popup} Configured popup instance
   */
  const createDronePopup = (drone) => {
    const { registration, Name, altitude, pilot, organization, yaw } =
      drone.properties;

    return new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    }).setHTML(`
      <div style="
        background-color: #000;
        padding: 8px;
        border-radius: 6px;
        font-size: 13px;
      ">
        <strong>${Name}</strong><br/>
        Registration: ${registration}<br/>
        Altitude: ${altitude} m<br/>
        Flight Time: ${drone.positions.length}s<br/>
        Pilot: ${pilot}<br/>
        Org: ${organization}<br/>
        Yaw: ${yaw}°
      </div>
    `);
  };

  /**
   * Drone Markers and Paths Update Effect
   * Pattern: Command Pattern - Encapsulates marker and path update operations
   * Pattern: State Synchronization - Keeps visual state in sync with data
   */
  useEffect(() => {
    if (!mapRef.current) return;

    droneData.forEach((drone) => {
      const reg = drone.properties.registration;
      const coords = drone.geometry.coordinates;
      const { color } = getDroneStatus(reg);

      /**
       * Marker Management - Update existing or create new markers
       * Pattern: Flyweight Pattern - Reuses existing marker instances when possible
       */
      if (markersRef.current[reg]) {
        // Update existing marker position and rotation
        markersRef.current[reg].marker.setLngLat(coords);
        markersRef.current[
          reg
        ].element.style.transform = `rotate(${drone.properties.yaw}deg)`;
      } else {
        // Create new marker with all components
        const el = createMarkerElement(drone, color);
        const popup = createDronePopup(drone);

        // Create Mapbox marker instance
        const marker = new mapboxgl.Marker(el)
          .setLngLat(coords)
          .setPopup(popup)
          .addTo(mapRef.current);

        /**
         * Event Handlers for Marker Interactions
         * Pattern: Event Handler Pattern - Encapsulates marker-specific interactions
         */
        el.addEventListener("mouseenter", () => popup.addTo(mapRef.current));
        el.addEventListener("mouseleave", () => popup.remove());

        // Handle drone click - prevent event bubbling to map
        el.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent map click event
          console.log("Drone clicked:", reg);
          setSelectedDrone(reg);
        });

        // Store marker reference for future updates
        markersRef.current[reg] = { marker, element: el };
      }

      /**
       * Visual State Update - Update marker appearance based on selection
       * Pattern: State Pattern - Different visual states based on selection
       */
      if (markersRef.current[reg]) {
        const isSelected = reg === selectedDrone;
        const element = markersRef.current[reg].element;

        element.style.boxShadow = isSelected
          ? `0 0 20px ${COLORS.SELECTED_GLOW}`
          : "none";
        element.style.zIndex = isSelected ? "10" : "1";
      }

      /**
       * Flight Path Rendering
       * Pattern: Strategy Pattern - Different rendering strategies for paths
       */
      if (drone.positions.length > 1) {
        const pathId = `path-${reg}`;
        const smoothCoords = createCurvedPath(drone.positions);

        // Update existing path or create new one
        if (mapRef.current.getSource(pathId)) {
          mapRef.current.getSource(pathId).setData({
            type: "Feature",
            geometry: { type: "LineString", coordinates: smoothCoords },
          });
        } else {
          // Create new path source and layer
          mapRef.current.addSource(pathId, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: { type: "LineString", coordinates: smoothCoords },
            },
          });

          mapRef.current.addLayer({
            id: pathId,
            type: "line",
            source: pathId,
            paint: {
              "line-color": color,
              "line-width": DRONE_CONFIG.PATH_WIDTH,
              "line-opacity": DRONE_CONFIG.PATH_OPACITY,
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
          });
        }
      }
    });

    /**
     * Camera Control - Fly to selected drone
     * Pattern: Command Pattern - Encapsulates camera movement command
     */
    if (selectedDrone && markersRef.current[selectedDrone]) {
      const drone = droneData.find(
        (d) => d.properties.registration === selectedDrone
      );

      if (drone) {
        console.log("Flying to drone:", selectedDrone);

        // Set flag to prevent reset during programmatic movement
        isProgrammaticMove.current = true;

        mapRef.current.flyTo({
          center: drone.geometry.coordinates,
          zoom: MAP_CONFIG.SELECTED_ZOOM,
          duration: MAP_CONFIG.FLY_DURATION,
          essential: true,
        });

        // Reset flag after animation completes
        setTimeout(() => {
          isProgrammaticMove.current = false;
        }, MAP_CONFIG.ANIMATION_BUFFER);
      }
    }
  }, [droneData, selectedDrone, setSelectedDrone]);

  return (
    <div className="flex w-full h-full">
      {/* Map Container */}
      {/* Pattern: Container Pattern - Encapsulates map rendering in isolated container */}
      <div
        ref={mapContainerRef}
        className="flex-1 relative"
        role="application"
        aria-label="Interactive drone tracking map"
      />
    </div>
  );
}
