"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export const ViewBooking = ({ booking_id }: { booking_id: string }) => {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function getBookingDetails() {
    try {
      setLoading(true);
      const res: ApiReturn<any> = await api_caller(
        "GET",
        `${API.BOOKING.VIEW}`.replace(":id", booking_id)
      );
      if (res.success) {
        setData(res.data);
      } else {
        throw new Error(res.message || "Failed to fetch booking details");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBookingDetails();
  }, [booking_id]);

  const Skeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="h-5 w-40 bg-gray-200 rounded" />
      <div className="bg-gray-100 p-3 rounded-lg border">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
      </div>

      <div className="h-5 w-44 bg-gray-200 rounded mt-6" />
      <div className="bg-gray-100 p-3 rounded-lg border flex gap-4">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>

      <div className="h-5 w-40 bg-gray-200 rounded mt-6" />
      <div className="grid gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-3 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 rounded" />
              <div className="h-3 w-1/3 bg-gray-200 rounded" />
              <div className="h-24 w-40 bg-gray-200 rounded-lg mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="p-4 text-red-600 text-sm bg-red-50 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  if (loading || !data) return <Skeleton />;

  const { room_id, duration, persons } = data;

  return (
    <div className="space-y-6 max-h-[70vh] pr-2">
      {/* Room Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Room Information
        </h2>
        <div className="bg-gray-50 p-3 rounded-lg mt-2 border text-gray-700">
          <p>
            <span className="font-medium">Room ID:</span> {room_id}
          </p>
        </div>
      </div>

      {/* Duration */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Booking Duration
        </h2>
        <div className="bg-gray-50 p-3 rounded-lg mt-2 border text-gray-700 flex gap-4">
          <p>
            <span className="font-medium">Years:</span> {duration?.year}
          </p>
          <p>
            <span className="font-medium">Months:</span> {duration?.month}
          </p>
        </div>
      </div>

      {/* Persons */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Person Details</h2>
        <div className="grid gap-4 mt-2">
          {persons?.map((person) => (
            <div
              key={person._id}
              className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                  <Image
                    src={person.image}
                    alt={person.first_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {person.first_name} {person.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {person.gender}, {person.age} years
                  </p>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700 space-y-1 flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {person.address}
                  </p>
                  <p>
                    <span className="font-medium">Identity Type:</span>{" "}
                    {person.type_of_identity.toUpperCase()}
                  </p>
                  <p className="border rounded-md bg-gray-50 py-1 px-2">
                    <span className="font-semibold">
                      {person.type_of_identity.toUpperCase() || "Identity"} ID:
                    </span>{" "}
                    {person.identity_id}
                  </p>
                </div>
                <div className="mt-2">
                  <div className="relative w-40 h-24 rounded-lg overflow-hidden border">
                    <Image
                      src={person.identity_image}
                      alt="Identity"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
