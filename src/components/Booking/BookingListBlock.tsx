"use client";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { formatDateTime, formatSeconds } from "@/lib/utils/utilities";
import { setModalVisibility } from "@/redux/slices/modalSlice";
import {
  ArrowClockwise,
  Check,
  ClockClockwise,
  DotsThreeOutlineVertical,
  Download,
  Eye,
  X,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export type BookingStatus = "pending" | "accepted" | "declined";

export interface Booking {
  id: string;
  image: string;
  name: string;
  address: string;
  dateOfBooking: string;
  status: BookingStatus;
  email?: string;
  phone?: string;
  personCount: number;
  pg_name?: string;
  room_type?: string;
  room_id?: string;
}

export default function BookingListBlock({
  b,
  fetchBookings,
}: {
  b: any;
  fetchBookings: () => Promise<void>;
}) {
  //Loading States for individual actions
  const [actionLoading, setActionLoading] = useState<{
    accept: boolean;
    decline: boolean;
    revolk: boolean;
    download: boolean;
  }>({
    accept: false,
    decline: false,
    revolk: false,
    download: false,
  });
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false);

  const dispatch = useDispatch();
  const actionDropdownRef = useRef<HTMLDivElement>(null);

  const handleAccept = async (id: string, rent?: number, duration?: string) => {
    let amount = 0;
    switch (duration) {
      case "monthly":
        amount = rent || 0;
        break;
      case "quarterly":
        amount = (rent || 0) * 3;
        break;
      case "half-yearly":
        amount = (rent || 0) * 6;
        break;
      case "yearly":
        amount = (rent || 0) * 12;
        break;
      default:
        amount = rent || 0;
    }
    dispatch(
      setModalVisibility({
        open: true,
        type: "accept_and_initiatePayment",
        modalData: {
          caption: "Accept and Initiate Payment",
          booking_id: id,
          amount: amount,
          deposit_duration: duration,
        },
      })
    );
  };

  const handleDecline = async (id: string) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        target: id,
        decline: true,
      }));
      const payload = {
        status: "declined",
      };
      const res: ApiReturn<any> = await api_caller<any>(
        "PATCH",
        `${API.ADMIN.BOOKING.CHANGE_STATUS}`.replace(":id", id),
        payload
      );
      if (res?.success) {
        toast.success(res?.message || "Booking declined");
        fetchBookings();
      } else {
        throw new Error(res.message || "Failed to decline booking");
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        target: null,
        decline: false,
      }));
    }
  };

  const handleDownload = async (booking_id: string) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        target: booking_id,
        download: true,
      }));
      const res = await fetch(`/api/download/${booking_id}`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `booking_${booking_id}.pdf`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, target: null, download: false }));
    }
  };

  const handleRevolke = async (id: string) => {
    dispatch(
      setModalVisibility({
        open: true,
        type: "revolke_booking",
        modalData: {
          caption: "Accept and Initiate Payment",
          booking_id: id,
          room_id: b.room_id,
        },
      })
    );
  };

  const getStatusBadge = (status: BookingStatus) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      accepted: "bg-green-100 text-green-700 border-green-300",
      declined: "bg-red-100 text-red-700 border-red-300",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        actionDropdownRef.current &&
        !actionDropdownRef.current.contains(e.target as Node)
      )
        setShowActionDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      key={b.id}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
    >
      <div className="">
        <div className="flex justify-between items-center">
          <div className="flex justify-start gap-3 items-center">
            <p className="text-lg font-semibold text-gray-500">
              <span>{b.pg_name}</span> <span>({b.room_type} bed)</span>
            </p>
            <button
              data-tooltip="View Booking Details"
              className="flex justify-center items-center gap-1 text-sm border rounded-md px-2 py-1"
              onClick={() => {
                dispatch(
                  setModalVisibility({
                    open: true,
                    type: "viewbooking",
                    modalData: {
                      caption: "View Booking",
                      booking_id: b.id,
                      room_id: b.room_id,
                    },
                  })
                );
              }}
            >
              <Eye size={18} />
              <span>View</span>
            </button>
          </div>
          <div className="flex justify-start gap-6 items-center">
            <div
              data-tooltip={
                b?.status_timestamp
                  ? b?.status?.toUpperCase() +
                    ": " +
                    formatDateTime(b.status_timestamp)
                  : "Booking Pending"
              }
            >
              {getStatusBadge(b.status)}
            </div>
            <div
              data-tooltip="Download Booking PDF"
              className="border rounded-md p-2"
              onClick={() => {
                if (!actionLoading?.download) {
                  handleDownload(b.id);
                }
              }}
            >
              {actionLoading.download ? (
                <ArrowClockwise size={17} className="animate-spin" />
              ) : (
                <Download size={17} />
              )}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500">Booking Date: {b.dateOfBooking}</p>
      </div>
      <hr />
      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-17 h-17">
          <Image
            src={b.image || "/assets/profile.png"}
            alt={b.name}
            width={65}
            height={65}
            className="rounded-md border"
            objectFit="cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {b.name}
                </h3>
                {/* 👇 Light gray badge for person count */}
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                  {b.personCount} Person
                  {(b.personCount || 1) > 1 ? "s" : ""}
                </span>
              </div>

              <p className="text-xs text-gray-600 mt-1">{b.address}</p>
            </div>
          </div>
        </div>

        {/* 👇 Button logic based on status */}
        <div className="flex gap-2 justify-end items-center">
          {b.status === "pending" && (
            <>
              <button
                onClick={() =>
                  handleAccept(b.id, b?.room_rent, b?.deposit_duration)
                }
                className="flex justify-center items-center gap-1 py-1 px-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all text-sm"
                data-tooltip="Accept this Booking"
              >
                <Check size={15} weight="bold" />
                <span>Accept</span>
              </button>

              <button
                onClick={() => handleDecline(b.id)}
                className="flex justify-center items-center gap-1 py-1 px-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all text-sm"
                data-tooltip="Decline this Booking"
                disabled={actionLoading.decline}
              >
                {actionLoading.decline ? (
                  <ArrowClockwise
                    size={15}
                    weight="bold"
                    className="animate-spin"
                  />
                ) : (
                  <X size={15} weight="bold" />
                )}
                <span>Decline</span>
              </button>
            </>
          )}

          {b.status === "accepted" && (
            <div className="flex flex-row items-center gap-3">
              <div className="border border-1 rounded-md border-yellow-700 text-yellow-700 text-sm px-2 py-1 font-medium">
                {b.payment_at !== null && (
                  <span>Paymnet Done : {formatDateTime(b.payment_at)}</span>
                )}
                {b.payment_ttl !== 0 && (
                  <span>
                    Payment Session will expire in:{" "}
                    {formatSeconds(b.payment_ttl)}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleRevolke(b.id)}
                className="flex justify-center items-center gap-1 py-1 px-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition-all text-sm"
                data-tooltip="Revolke this Booking"
              >
                <ClockClockwise size={15} weight="bold" />
                <span>Revolke</span>
              </button>
            </div>
          )}

          {["revolked", "canceled"]?.includes(b?.status) && b?.reason && (
            <div className="relative group inline-block">
              <button className="flex justify-center items-center gap-1 py-1 px-2 rounded-lg text-yellow-700 border border-yellow-700 text-sm transition-all">
                <span>Reason</span>
              </button>

              {/* Tooltip Div */}
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                 w-60 bg-white text-gray-800 border border-gray-300 
                 rounded-lg shadow-lg py-3 px-2 text-sm opacity-0 pointer-events-none 
                 group-hover:opacity-100 group-hover:pointer-events-auto transition-all
                 max-h-40 overflow-y-auto z-50"
              >
                <h4 className="mb-1 text-yellow-700 font-medium">Message</h4>
                <hr className="py-1" />
                <span className="text-gray-600 font-semibold">{b.reason}</span>
              </div>
            </div>
          )}

          <div className="relative" ref={actionDropdownRef}>
            <button
              className="p-1 border rounded-md"
              onClick={() => setShowActionDropdown((prev) => !prev)}
            >
              <DotsThreeOutlineVertical
                size={18}
                className="text-gray-500"
                weight="fill"
              />
            </button>
            {/* Dropdown  */}
            {showActionDropdown && (
              <div className="absolute right-0 top-7 z-40 mt-2 w-32 origin-top-right rounded-md bg-white py-1 shadow-lg border">
                {b.status === "accepted" && (
                  <div>
                    <div
                      className="block px-4 py-2 text-xs hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        dispatch(
                          setModalVisibility({
                            open: true,
                            type: "genericConfirmation",
                            modalData: {
                              caption: "Close Payment Session",
                              placeholder: "close this Payment Session",
                              btnText: "Close Session",
                              endpoint:
                                API.ADMIN.BOOKING.CLOSE_PAYMENT_SESSION.replace(
                                  ":id",
                                  b.id
                                ),
                              method: "PATCH",
                            },
                          })
                        );
                      }}
                    >
                      Close Payment Session
                    </div>
                    <hr />
                  </div>
                )}

                <div
                  className="block px-4 py-2 text-xs text-red-600 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    dispatch(
                      setModalVisibility({
                        open: true,
                        type: "deletePG",
                        modalData: {
                          caption: "Delete Booking",
                          placeholder: "this Booking Ticket",
                          rowid: b.id,
                          target: "booking",
                        },
                      })
                    );
                  }}
                >
                  Delete Booking
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
