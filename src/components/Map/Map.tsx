'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import axios from 'axios';
import type { Feature, LineString } from 'geojson';
import { FullscreenControl, NavigationControl, GeolocateControl } from 'react-map-gl/maplibre';
import { MapPin, PushPinSimple } from '@phosphor-icons/react/dist/ssr';
import { PinPopup } from './PinPopup';
import { API } from '@/lib/api_const';

interface MapProps {
  clg_coords?: [number, number];
  position: [number, number] | [number, number][];
  name?: string;
  address?: string;
  clg_name?: string;
  clg_addr?: string;
  clg_pin?: string;
  clg_id?: string;
  pg_idno?: string;
}

export default function CustomMap({ clg_coords, position, name, address,  clg_name, clg_addr, clg_pin, clg_id, pg_idno }: MapProps) {
  // console.log("Map Props:", { clg_coords, position, name, address, clg_name, clg_addr, clg_pin, clg_id, pg_idno });
  const isMulti = Array.isArray(position[0]);

  const userCoord = useMemo(
    () => (!isMulti ? [position[1], position[0]] as [number, number] : null),
    [position, isMulti]
  );

  const clgCoord = useMemo(
    () => (clg_coords ? [clg_coords[1], clg_coords[0]] as [number, number] : null),
    [clg_coords]
  );

  const center = useMemo(() => {
    if (isMulti) return clgCoord;
    if (userCoord && clgCoord) {
      return [
        (userCoord[0] + clgCoord[0]) / 2,
        (userCoord[1] + clgCoord[1]) / 2,
      ];
    }
    return userCoord || clgCoord;
  }, [isMulti, userCoord, clgCoord]);

  const [routeGeoJSON, setRouteGeoJSON] = useState<Feature<LineString> | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const hasFetchedRef = useRef(false);

  // 🌍 map style state
  const [mapStyle, setMapStyle] = useState<string>('https://basemaps.cartocdn.com/gl/positron-gl-style/style.json');

  // Get user's actual location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.longitude, pos.coords.latitude]);
        },
        (err) => {
          console.error('Error getting location:', err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Fetch route when single PG + college
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
        setRouteGeoJSON(res.data as Feature<LineString>);

        // Extract distance (m) and duration (s)
        const summary = (res.data as any)?.features?.[0]?.properties?.summary;
        if (summary) {
          setDistance(summary.distance); // in meters
          setDuration(summary.duration); // in seconds
        }

        hasFetchedRef.current = true;
      } catch (error) {
        console.error('Failed to fetch route from ORS:', error);
      }
    };

    fetchRoute();
  }, [userCoord, clgCoord, isMulti]);

  // Format helpers
  const formatDistance = (m: number) => `${(m / 1000).toFixed(2)} km`;
  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h} hr ${m} min`;
    return `${m} min`;
  };

  return (
    <div style={{ height: "500px", width: "100%", position: "relative" }}>
      {/* Distance & Time Info */}
      {distance !== null && duration !== null && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 10,
            fontSize: "14px",
          }}
        >
          <div>
            <strong>Distance:</strong> {formatDistance(distance)}
          </div>
          <div>
            <strong>Time:</strong> {formatDuration(duration)}
          </div>
        </div>
      )}

      {/* Map Style Switcher */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 50,
          background: "white",
          padding: "6px 8px",
          borderRadius: "6px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 10,
          fontSize: "14px",
        }}
      >
        <select
          value={mapStyle}
          onChange={(e) => setMapStyle(e.target.value)}
          className="border p-1 rounded text-sm"
        >
          <option value="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json">
            Default
          </option>
          <option value="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json">
            Dark
          </option>
          <option value="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json">
            Voyager
          </option>
          <option
            value={`https://api.maptiler.com/maps/hybrid/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
          >
            Satellite
          </option>
        </select>
      </div>

      <Map
        initialViewState={{
          longitude: (userLocation || center)?.[0],
          latitude: (userLocation || center)?.[1],
          zoom: 12,
        }}
        style={{ width: "100%", height: "90%" }}
        mapStyle={mapStyle}
        mapLib={import("maplibre-gl")}
      >
        {/* Fullscreen Control */}
        <FullscreenControl position="top-right" />

        {/* Navigation Control */}
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation
          {...({ showUserHeading: true } as any)}
        />

        {/* User's current location */}
        {userLocation && (
          <Marker
            longitude={userLocation[0]}
            latitude={userLocation[1]}
            anchor="bottom"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 bg-[#4285F4]/20 rounded-full absolute" />
              <div className="w-4 h-4 bg-[#4285F4] border-[3px] border-white rounded-full shadow-md" />
            </div>
          </Marker>
        )}

        {/* PG Markers */}
        {isMulti
          ? (position as [number, number][]).map((coord, index) => (
              <Marker
                key={index}
                longitude={coord[1]}
                latitude={coord[0]}
                anchor="bottom"
                onClick={() => setActivePopup(`pg-${index}`)}
              >
                <div
                  style={{ fontSize: "24px", color: "red", cursor: "pointer" }}
                >
                  <MapPin size={30} color="#ac8720" weight="fill" />
                </div>
                {activePopup === `pg-${index}` && (
                  <PinPopup
                    cords={userCoord as [number, number]}
                    name={name}
                    address={address}
                    setActivePopup={setActivePopup}
                    isMulti={isMulti}
                    id={pg_idno}
                    endpoint={API.PG.GET_PG_BY_ID}
                  />
                )}
              </Marker>
            ))
          : userCoord && (
              <Marker
                longitude={userCoord[0]}
                latitude={userCoord[1]}
                anchor="bottom"
                onClick={() => setActivePopup("pg-single")}
              >
                <div
                  style={{ fontSize: "24px", color: "red", cursor: "pointer" }}
                >
                  <MapPin size={30} color="#ac8720" weight="fill" />
                </div>
                {activePopup === "pg-single" && name && address && (
                  <PinPopup
                    cords={userCoord as [number, number]}
                    name={name}
                    address={address}
                    setActivePopup={setActivePopup}
                    isMulti={isMulti}
                    id={pg_idno}
                    endpoint={API.PG.GET_PG_BY_ID}
                  />
                )}
              </Marker>
            )}

        {/* College Marker */}
        {clgCoord && (
          <Marker
            longitude={clgCoord[0]}
            latitude={clgCoord[1]}
            anchor="bottom"
            onClick={() => setActivePopup("college")}
          >
            <div style={{ fontSize: "24px", color: "blue", cursor: "pointer" }}>
              <PushPinSimple size={30} color="#ac8720" weight="fill" />
            </div>
            {activePopup === "college" && (
              <PinPopup
                cords={clgCoord as [number, number]}
                name={clg_name}
                address={`${clg_addr},${clg_pin}`}
                setActivePopup={setActivePopup}
                isMulti={isMulti}
                id={clg_id}
                endpoint={API.COLLEGE.GET_BY_ID}
              />
            )}
          </Marker>
        )}

        {/* Route Line */}
        {!isMulti && routeGeoJSON && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer
              id="route-layer"
              type="line"
              paint={{
                "line-color": "#007bff",
                "line-width": 4,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}