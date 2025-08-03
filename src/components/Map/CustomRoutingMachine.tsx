"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
// If you have @types/leaflet-routing-machine installed, you can import types as well
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

interface RoutingProps {
    from?: [number, number]; // [lat, lon] e.g. PG coords
    to?: [number, number];   // [lat, lon] e.g. college coords
}

const CustomRoutingMachine: React.FC<RoutingProps> = ({ from, to }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;
        // Create routing control
        // @ts-ignore: leaflet-routing-machine attaches Routing to window.L
        const routingControl = (window as any)?.L.Routing.control({
            waypoints: [
                L.latLng(from[0], from[1]),
                L.latLng(to[0], to[1]),
            ],
            lineOptions: {
                styles: [{ color: "blue", weight: 4 }],
                interactive: false,
                pane: 'overlayPane',
            },
            routeWhileDragging: false,
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
        }).addTo(map);

        // Cleanup routing control on unmount
        return () => {
            if (map && routingControl) {
                try {
                    map.removeControl(routingControl);
                } catch (error) {
                    console.error("Error removing routing control:", error);
                }
            }
        };
    }, [from, to, map]);

    return null;
};

export default CustomRoutingMachine;
