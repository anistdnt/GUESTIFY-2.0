"use client";

import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface RoutingProps {
  from?: [number, number]; // PG coords
  to?: [number, number];   // College coords
}

const CustomRoutingMachine: React.FC<RoutingProps> = ({ from, to }) => {
  const map = useMap();
  const [isReady, setIsReady] = useState(false);

  // Dynamically import to avoid SSR issues
  useEffect(() => {
    const load = async () => {
      try {
        await import("leaflet-routing-machine");
        setIsReady(true);
      } catch (err) {
        console.error("Routing machine load failed", err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!map || !from || !to || !isReady) return;

    const paneName = "route-pane";

    // Create route pane with lower zIndex if it doesn't exist
    if (!map.getPane(paneName)) {
      const routePane = map.createPane(paneName);
      routePane.style.zIndex = "399"; // Lower than marker-pane
    }

    const routingControl = (L as any).Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }],
        interactive: false, // Prevents blocking click
        pane: paneName,
      },
    }).addTo(map);

    return () => {
      try {
        map.removeControl(routingControl);
      } catch (e) {
        console.error("Failed to remove routing", e);
      }
    };
  }, [from, to, map, isReady]);

  return null;
};

export default CustomRoutingMachine;
