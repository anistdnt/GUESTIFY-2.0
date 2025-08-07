'use client';

import React , {useEffect}from 'react';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import axios from 'axios';
import type { Feature, LineString } from 'geojson';

interface MapProps {
  clg_coords?: [number, number];
  position: [number, number] | [number, number][];
  name?: string;
  address?: string;
}

export default function CustomMap({ clg_coords, position, name, address }: MapProps) {
  const isMulti = Array.isArray(position[0]);
  const userCoord = React.useMemo(() => {
    return !isMulti ? [position[1], position[0]] as [number, number] : null;
  }, [position, isMulti]);

  const clgCoord = React.useMemo(() => {
    return clg_coords ? [clg_coords[1], clg_coords[0]] as [number, number] : null;
  }, [clg_coords]);

  const center = isMulti ? clgCoord : [((userCoord as [number, number])[0] + clgCoord[0]) / 2, ((userCoord as [number, number])[1] + clgCoord[1]) / 2];

  const [routeGeoJSON, setRouteGeoJSON] = React.useState<Feature<LineString> | null>(null);
  const [showUserPopup, setShowUserPopup] = React.useState(false);
  const [showCollegePopup, setShowCollegePopup] = React.useState(false);



 const hasFetchedRef = React.useRef(false);

useEffect(() => {
  if (hasFetchedRef.current || isMulti || !userCoord || !clgCoord) return;

  const fetchRoute = async () => {
    try {
      const res = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        {
          coordinates: [userCoord, clgCoord],
        },
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_OPENROUTERSERVICE_API_KEY || '',
            'Content-Type': 'application/json',
          },
        }
      );

      const feature = res.data as Feature<LineString>;
      setRouteGeoJSON(feature);
      hasFetchedRef.current = true;
    } catch (error) {
      console.error('Failed to fetch route from ORS:', error);
    }
  };

  fetchRoute();
}, [userCoord?.[0], userCoord?.[1], clgCoord?.[0], clgCoord?.[1], isMulti]);


  return (
    <div style={{ height: '500px', width: '80%' }}>
      <Map
        initialViewState={{
          longitude: center[0],
          latitude: center[1],
          zoom: 12,
        }}
        style={{ width: '100%', height: '90%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        mapLib={import('maplibre-gl')}
      >
        {/* User Marker */}
        {isMulti ? (position as [number, number][]).map((coord, index) => (
          <>
            <Marker key={index} longitude={coord[1]} latitude={coord[0]} anchor="bottom">
              <div
                style={{ fontSize: '24px', color: 'red', cursor: 'pointer' }}
                onClick={() => setShowUserPopup(true)}
              >
                📍
              </div>
            </Marker>
            <Popup
              longitude={coord[1]} latitude={coord[0]}
              onClose={() => setShowUserPopup(false)}
              closeOnClick={false}
            >
              <div>
                <strong>{name}</strong>
                <br />
                {address}
              </div>
            </Popup>
          </>
        )) :
          (
            <>

              <Marker longitude={(userCoord as [number, number])[0]} latitude={(userCoord as [number, number])[1]} anchor="bottom">
                <div
                  style={{ fontSize: '24px', color: 'red', cursor: 'pointer' }}
                  onClick={() => setShowUserPopup(true)}
                >
                  📍
                </div>
              </Marker>
              {showUserPopup && name && address && (
                <Popup
                  longitude={(userCoord as [number, number])[0]}
                  latitude={(userCoord as [number, number])[1]}
                  onClose={() => setShowUserPopup(false)}
                  closeOnClick={false}
                >
                  <div>
                    <strong>{name}</strong>
                    <br />
                    {address}
                  </div>
                </Popup>
              )}
            </>
          )
        }



        {/* College Marker */}
        {clgCoord && (
          <>
            <Marker longitude={clgCoord[0]} latitude={clgCoord[1]} anchor="bottom">
              <div
                style={{ fontSize: '24px', color: 'blue', cursor: 'pointer' }}
                onClick={() => setShowCollegePopup(true)}
              >
                🎓
              </div>
            </Marker>

            {showCollegePopup && (
              <Popup
                longitude={clgCoord[0]}
                latitude={clgCoord[1]}
                onClose={() => setShowCollegePopup(false)}
                closeOnClick={false}
              >
                <div>
                  <strong>College</strong>
                  <br />
                  {clg_coords?.join(', ')}
                </div>
              </Popup>
            )}
          </>
        )}


        {/* Route Line from ORS */}
        {!isMulti && routeGeoJSON && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer
              id="route-layer"
              type="line"
              paint={{
                'line-color': '#007bff',
                'line-width': 4,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}
