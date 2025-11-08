"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { Calendar, CurrencyInr, UsersThree } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import toast from "react-hot-toast";
import FadedImageSlider from "@/components/DisplayCard/FadedImageSlider";

type RoomDetails = {
  id: string;
  type: string;
  room_rent: number;
  deposit_duration: string;
  room_images: { room_image_url: string; room_image_id: string }[];
};

type BookingItem = {
  booking_id: string;
  booking_date: string;
  person_number: number;
  status: string;
  pg_name: string;
  status_timestamp: string | null;
  room_details: RoomDetails;
};

export default function BookingPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  // Fetch booking details
  const getBookings = async () => {
    try {
      const response: ApiReturn<any> = await api_caller("GET", `${API.BOOKING.ROOMLIST}?page=1&show=10&filter=all&search=PG`);
      if (response.success) {
        setBookings(response.data.bookings || []);
      } else {
        toast.error(response.message || "Failed to load bookings");
      }
    } catch (error) {
      toast.error("Unable to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600 animate-pulse">Loading bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
        <p className="text-lg font-semibold">No bookings found</p>
        <Link
          href="/"
          className="mt-4 bg-buttons hover:bg-buttonsHover text-white px-4 py-2 rounded text-center"
        >
          Explore PGs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Your Bookings
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.booking_id}
            className="relative group p-5 border border-indigo-200 rounded-2xl hover:shadow-xl hover:shadow-indigo-50 flex flex-col transition-all bg-white"
          >
            {/* Room Image Slider */}
            <div className="relative w-full h-48 overflow-hidden rounded-xl">
              <FadedImageSlider
                images={booking.room_details.room_images.map((img) => ({
                  pg_image_url: img.room_image_url,
                  pg_image_id: img.room_image_id,
                }))}
              />
              <span
                className={`absolute top-2 right-2 text-xs px-2 py-1 rounded text-white ${
                  booking.status === "pending"
                    ? "bg-yellow-500"
                    : booking.status === "confirmed"
                    ? "bg-green-500"
                    : booking.status === "cancelled"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </span>
            </div>

            {/* Info */}
            <div className="mt-4 flex flex-col flex-1">
              <h4 className="font-bold text-lg text-gray-900">
                {booking.pg_name}
              </h4>

              {/* Booking Details */}
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p className="flex items-center gap-2">
                  <Calendar size={16} />{" "}
                  <span>
                    {new Date(booking.booking_date).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <UsersThree size={16} /> {booking.person_number} Person
                  {booking.person_number > 1 ? "s" : ""}
                </p>
              </div>

              {/* Room Details */}
              <div className="mt-3 text-sm text-gray-700 border-t pt-2 space-y-1">
                <p>
                  Room Type:{" "}
                  <span className="font-medium capitalize">
                    {booking.room_details.type}
                  </span>
                </p>
                <p className="flex items-center gap-1">
                  Rent: <CurrencyInr size={12} />
                  {booking.room_details.room_rent} /{" "}
                  {booking.room_details.deposit_duration}
                </p>
              </div>

              <Link
                href={`/booking/${booking.booking_id}`}
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
