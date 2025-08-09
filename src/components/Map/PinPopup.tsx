"use client";

import { useEffect, useState } from "react";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import Image from "next/image";
import { Popup } from "react-map-gl/maplibre";

type PinPopupProps = {
  endpoint?: string;
  id?: string;
  cords: [number, number];
  name?: string;
  address?: string;
  setShowUserPopup: (show: boolean) => void;
  isMulti?: boolean;
};

function PinPopupLoader() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex flex-col gap-2">
        <div className="w-28 h-4 bg-gray-200 rounded" />
        <div className="w-20 h-3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function PinPopup({
  endpoint = "/college",
  id = "683f16cc02c7d973448cc5aa",
  cords,
  name,
  address,
  setShowUserPopup,
}: PinPopupProps) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const resData: ApiReturn<any> = await api_caller<any>(
          "GET",
          `${endpoint}/${id}`
        );

        if (isMounted) {
          if (resData.success && resData.data) {
            setData(resData.data);
          } else {
            setError("Data not found");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError("Error fetching data");
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint, id]);

  return (
    <div className="pin-popup arkabrata-chandra-personal-projects">
      <Popup
        longitude={cords[0]}
        latitude={cords[1]}
        onClose={() => setShowUserPopup(false)}
        closeOnClick={false}
      >
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : data ? (
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 border rounded-full flex-shrink-0">
              <Image
                src={data.image_url || data.pginfo.pg_image_url || "/assets/new_logo.png"}
                alt={data.college_name || data.pginfo.pg_name || "Logo"}
                fill
                className="object-cover rounded-full"
                sizes="48px"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {data.college_name || data.pginfo.pg_name || name}
              </h3>
              <p className="text-xs text-gray-600">
                {`${data.address || data.pginfo.address}, ${data.pincode || ''}`}
              </p>
            </div>
          </div>
        ) : (
          <PinPopupLoader />
        )}
      </Popup>
    </div>
  );
}
