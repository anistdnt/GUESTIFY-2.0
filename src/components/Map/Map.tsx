"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, Pane } from 'react-leaflet';
import "leaflet-defaulticon-compatibility";
import { useEffect } from 'react';
import CustomRoutingMachine from './CustomRoutingMachine';


interface MapProps {
    clg_coords?: [number, number];
    position: [number, number];
    name?: string;
    address?: string;
}

// const MarkerPaneSetup: React.FC = () => {
//     const map = useMap();

//     useEffect(() => {
//         map.createPane('top-marker');
//         map.getPane('top-marker').style.zIndex = "700";
//     }, [map]);

//     return null;
// };

const Map: React.FC<MapProps> = ({ clg_coords, position, name, address }) => {

    return (
        <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: "350px", width: "100%", borderRadius: "12px" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Pane name="top-marker" style={{ zIndex: 700 }}>
                {/* PG Marker */}
                <Marker position={position}
                    eventHandlers={{
                        click: (e) => e.target.openPopup(),
                    }}>
                    <Popup>
                        {name && <div><strong>{name}</strong></div>}
                        {address && <div>{address}</div>}
                    </Popup>
                </Marker>
                {/* College Marker */}
                {clg_coords && (
                    <Marker position={clg_coords}
                        eventHandlers={{
                            click: (e) => e.target.openPopup(),
                        }}>
                        <Popup>College Location</Popup>
                    </Marker>
                )}
            </Pane>

            {clg_coords && (
                <CustomRoutingMachine from={position} to={clg_coords} />
            )}
        </MapContainer>
    );
};

export default Map;
