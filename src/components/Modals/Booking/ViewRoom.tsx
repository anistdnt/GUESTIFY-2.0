"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { Check, X } from "@phosphor-icons/react/dist/ssr";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface RoomImage {
  room_image_url: string;
  room_image_id: string;
  _id: string;
}

interface RoomData {
  _id: string;
  room_type: string;
  room_images: RoomImage[];
  room_rent: number;
  ac_available: string;
  attached_bathroom: string;
  deposit_duration: string;
  aminities: string[];
  booking_status?: string;
  booked_by?: string | null;
}

export const ViewRoom = ({ room_id }: { room_id: string }) => {
  const [data, setData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getRoomDetails() {
    try {
      setLoading(true);
      const res: ApiReturn<any> = await api_caller("GET", `${API.ROOM.VIEW_ROOM_DETAILS}`.replace(":id", room_id));
      if (res.success) setData(res.data);
      else throw new Error(res.message || "Failed to fetch room details");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRoomDetails();
  }, [room_id]);

  // Skeleton Loader
  const Skeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="w-full h-52 bg-gray-200 rounded-lg" />
      <div className="h-4 w-40 bg-gray-200 rounded" />
      <div className="h-4 w-28 bg-gray-200 rounded" />
      <div className="h-3 w-3/4 bg-gray-200 rounded" />
      <div className="h-3 w-2/3 bg-gray-200 rounded" />
      <div className="flex flex-wrap gap-2 mt-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-6 w-24 bg-gray-200 rounded-full" />
        ))}
      </div>
    </div>
  );

  // Error Message
  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  if (loading || !data) return <Skeleton />;

  const {
    room_type,
    room_images,
    room_rent,
    ac_available,
    attached_bathroom,
    deposit_duration,
    aminities,
  } = data;

  return (
    <div className="space-y-6 max-h-[70vh] pr-2">
      {/* Room Image */}
      <div className="relative h-52 rounded-lg mx-auto" style={{width: '500px'}}>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop
          className="h-full custom-swiper"
        >
          {room_images?.map((img, idx) => (
            <SwiperSlide key={idx}>
              <Image
                src={img?.room_image_url}
                alt={`Room image ${idx + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-t-xl"
              />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>

      {/* Basic Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Room Information</h2>
        <div className="bg-gray-50 p-3 rounded-lg mt-2 border text-gray-700 space-y-2">
          <p>
            <span className="font-semibold">Room Type:</span>{" "}
            {room_type.charAt(0).toUpperCase() + room_type.slice(1)}
          </p>
          <p>
            <span className="font-semibold">Rent:</span> ₹{room_rent.toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Deposit Duration:</span>{" "}
            {deposit_duration.charAt(0).toUpperCase() + deposit_duration.slice(1)}
          </p>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Room Features</h2>
        <div className="bg-gray-50 p-3 rounded-lg mt-2 border text-gray-700 grid gap-2">
          <p className="flex items-center gap-2">
            {ac_available === "yes" ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
            <span>Air Conditioning</span>
          </p>

          <p className="flex items-center gap-2">
            {attached_bathroom === "yes" ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
            <span>Attached Bathroom</span>
          </p>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Amenities</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {aminities.map((a, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-gray-100 border rounded-full text-sm text-gray-700"
            >
              {a.replace(/_/g, " ").toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
