"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { Calendar, ClockAfternoon, HourglassMedium } from "@phosphor-icons/react";
import { FileDoc } from "@phosphor-icons/react/dist/ssr";
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
        `${API.ADMIN.BOOKING.VIEW}`.replace(":id", booking_id)
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

  const { accepted_at , payment_at , start_date , duration, persons, remarks } = data;

  return (
    <div className="space-y-6 max-h-[70vh] pr-2">
      

      {/* Booking Timeline */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Booking Timeline</h2>

        <div className="bg-gray-50 p-4 rounded-xl mt-3 border text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Start Date */}
            <div className="flex items-start gap-3">
              <Calendar size={22} className="text-blue-600 mt-1" />
              <div>
                <p className="font-medium">Start Date</p>
                <p className="text-sm text-gray-600">
                  {new Date(start_date).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>

            {/* Accepted At */}
            <div className="flex items-start gap-3">
              <ClockAfternoon size={22} className="text-green-600 mt-1" />
              <div>
                <p className="font-medium">Accepted At</p>
                <p className="text-sm text-gray-600">
                  {accepted_at
                    ? new Date(accepted_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                    : "—"}
                </p>
              </div>
            </div>

            {/* Payment At */}
            <div className="flex items-start gap-3">
              <ClockAfternoon size={22} className="text-purple-600 mt-1" />
              <div>
                <p className="font-medium">Payment At</p>
                <p className="text-sm text-gray-600">
                  {payment_at
                    ? new Date(payment_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                    : "—"}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-3">
              <HourglassMedium size={22} className="text-orange-600 mt-1" />
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-sm text-gray-600">
                  {duration?.year} years • {duration?.month} months
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remarks */}
      {remarks && <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Booking Remarks
        </h2>
        <div className="bg-gray-50 p-3 rounded-lg mt-2 border text-gray-700 flex gap-4">
          {remarks}
        </div>
      </div>}

      {/* Persons */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Person Details</h2>
        <div className="grid gap-4 mt-2">
          {persons?.map((person: any) => (
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
                    {person.first_name} {person.last_name}{" "}
                    <span className="text-sm font-medium">
                      {person.is_primary ? "(Primary)" : ""}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    {person.gender}, {person.age} years
                  </p>
                  {person.dial_code && person?.contact_number && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Contact No:</span>{" "}
                      {person.dial_code} {person.contact_number}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700 space-y-1 flex justify-between items-center">
                <div className="flex flex-col gap-2 w-3/5">
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
                <div className="w-2/5 flex justify-end">
                  <div className="border rounded-lg p-4 flex flex-col justify-center items-center gap-2 cursor-pointer hover:bg-gray-100 transition" onClick={()=> window?.open(person?.identity_image || "","_blank")}>
                    <FileDoc size={50} />
                    <span className="text-blue-500">View Document</span>
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
