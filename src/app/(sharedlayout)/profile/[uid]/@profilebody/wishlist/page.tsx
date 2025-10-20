"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { CurrencyInr, Heart } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import toast from "react-hot-toast";
import FadedImageSlider from "@/components/DisplayCard/FadedImageSlider";

type Room = {
  room_type: string;
  room_rent: number;
};

type PGItem = {
  pg_id: string;
  pg_name: string;
  address: string;
  state: string;
  district: string;
  pg_type: string;
  pg_images: { pg_image_url: string; pg_image_id: string }[];
  food_available: string;
  wifi_available: string;
  rooms: Room[];
};

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<PGItem[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  // Fetch wishlist
  const getWishlist = async () => {
    try {
      const response: ApiReturn<any> = await api_caller<any>("GET", `${API.WISHLIST.VIEW}/${params.uid}`);
      if (response.success) {
        setWishlist(response.data || []);
      } else {
        toast.error(response.message || "Failed to load wishlist");
      }
    } catch (error) {
      toast.error("Unable to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (pgId: string) => {
    const prev = [...wishlist];
    // Optimistic UI update
    setWishlist((w) => w.filter((item) => item.pg_id !== pgId));

    try {
      const response = await api_caller("DELETE", `${API.WISHLIST.DELETE}/${pgId}`);
      if (!response.success) {
        setWishlist(prev); // rollback
        toast.error(response.error || "Failed to remove");
      } else {
        toast.success(response.message || "Removed from wishlist");
      }
    } catch {
      setWishlist(prev);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getWishlist();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600 animate-pulse">Loading wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
        <p className="text-lg font-semibold">Your wishlist is empty 🏠</p>
        <Link
          href="/explore"
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Explore PGs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.pg_id}
            className="relative group p-5 border border-indigo-200 rounded-2xl hover:shadow-xl hover:shadow-indigo-50 flex flex-col transition-all bg-white"
          >
            {/* Delete Heart Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                removeFromWishlist(item.pg_id);
              }}
              className="absolute top-3 left-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-sm transition-colors z-20"
              aria-label="Remove from wishlist"
            >
              <Heart size={20} weight="fill" color="#e0245e" />
            </button>

            {/* Image */}
            <Link href={`/pg/${item.pg_id}`} className="relative w-full h-48 overflow-hidden rounded-xl block">
              <FadedImageSlider images={item?.pg_images} />
              <span
                className={`absolute top-2 right-2 text-xs px-2 py-1 rounded text-white ${
                  item.pg_type === "girls"
                    ? "bg-pink-500"
                    : item.pg_type === "boys"
                    ? "bg-blue-500"
                    : "bg-yellow-600"
                }`}
              >
                {item.pg_type.charAt(0).toUpperCase() + item.pg_type.slice(1)}
              </span>
            </Link>

            {/* Info */}
            <div className="mt-4 flex flex-col flex-1">
              <h4 className="font-bold text-lg text-gray-900">
                {item.pg_name}
              </h4>
              <p className="text-gray-600 text-sm">{item.address}</p>

              {/* Features */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span
                  className={`px-2 py-1 rounded ${
                    item.food_available === "yes"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  Food {item.food_available === "yes" ? "Available" : "Not Available"}
                </span>
                <span
                  className={`px-2 py-1 rounded ${
                    item.wifi_available === "yes"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  WiFi {item.wifi_available === "yes" ? "Available" : "Not Available"}
                </span>
              </div>

              {/* Room Details */}
              <div className="mt-3 space-y-1 text-sm text-gray-700 flex justify-between">
                {item.rooms.map((room, i) => (
                  <p key={i} className="flex items-center gap-1">
                    {room.room_type.charAt(0).toUpperCase() + room.room_type.slice(1)} – <CurrencyInr size={12} />{room.room_rent}
                  </p>
                ))}
              </div>

              <Link
                href={`/pg/${item.pg_id}`}
                className="mt-5 bg-buttons hover:bg-buttonsHover text-white px-4 py-2 rounded text-center"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
