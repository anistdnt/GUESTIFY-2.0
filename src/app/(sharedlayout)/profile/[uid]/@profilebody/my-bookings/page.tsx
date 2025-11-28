"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import {
  Calendar,
  CheckCircle,
  CurrencyInr,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import toast from "react-hot-toast";
import FadedImageSlider from "@/components/DisplayCard/FadedImageSlider";
import { setModalVisibility } from "@/redux/slices/modalSlice";
import { useDispatch } from "react-redux";
import { formatDate, formatTTL } from "@/lib/utils/utilities";
import { BookingStatus } from "@/components/Booking/BookingListBlock";
import {
  ArrowClockwise,
  CaretDown,
  FunnelSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react";

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
  payment_ttl: number | null;
  payment_at: string | null;
};

export default function BookingPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [countdowns, setCountdowns] = useState<Record<string, number>>({});
  const params = useParams();
  const dispatch = useDispatch();

  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 800);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch booking details
  const getBookings = async () => {
    try {
      setLoading(true);
      const buildUrl = `${API.BOOKING.ROOMLIST}?page=${currentPage}&filter=${filterStatus}&search=${debouncedSearch}`;
      const response: ApiReturn<any> = await api_caller("GET", buildUrl);
      // console.log(response, "response");
      if (response?.success) {
        const fetchedBookings = response?.data?.bookings;
        setBookings([...(fetchedBookings || [])]);

        const initial: Record<string, number> = {};
        fetchedBookings?.forEach((b: BookingItem) => {
          if (b.payment_ttl !== null) {
            initial[b.booking_id] = b.payment_ttl;
          }
        });
        setCountdowns(initial);
      } else {
        toast.error(response?.message || "Failed to load bookings");
      }
    } catch (error) {
      toast.error("Unable to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, [currentPage, filterStatus, debouncedSearch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated: Record<string, number> = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (updated[id] > 0) updated[id] -= 1;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const PaymentButton = ({booking_id, payment_ttl, payment_at}: {booking_id: string; payment_ttl: number | null ; payment_at: string})=>{
    if(payment_ttl !== null && !payment_at){
      return (
        <button
          data-tooltip={formatTTL(countdowns[booking_id] || 0)}
          className="mt-5 me-2 bg-buttons hover:bg-buttonsHover text-white px-4 py-2 rounded text-center disabled:cursor-not-allowed"
          onClick={() => {
            dispatch(
              setModalVisibility({
                open: true,
                type: "paymentSession",
                modalData: {
                  booking_id: booking_id,
                },
              })
            );
          }}
          disabled={payment_ttl === 0}
        >
          Make Payment
        </button>
      );
    } 
    else if(payment_ttl !== null && payment_at){
      return (
        <button className="bg-green-600 mt-5 me-2 text-white px-4 py-2 rounded text-center flex justify-center items-center gap-2" data-tooltip={formatDate(payment_at)}>
          <CheckCircle size={20} /><span>Payment Done</span>
        </button>
      );
    }
    else {
      return null;
    }
  }

  return (
    <div className="max-w-full">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Refresh or Reset Filter Button */}
        <div>
          <button
            data-tooltip="Refresh or Reset Filters"
            onClick={() => {
              if (
                filterStatus !== "all" ||
                searchTerm !== "" ||
                currentPage !== 1
              ) {
                setSearchTerm("");
                setFilterStatus("all");
                setCurrentPage(1);
              } else {
                getBookings();
              }
            }}
            className="p-3 border rounded-md bg-gray-100 hover:bg-gray-200 transition"
          >
            <ArrowClockwise size={16} />
          </button>
        </div>
        <div className="flex-1 relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by PG Name, Name or Address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative" ref={filterDropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between w-40 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-yellow-500"
          >
            <span className="flex items-center gap-2">
              <FunnelSimple size={18} className="text-gray-500" />
              {filterStatus === "all"
                ? "All Status"
                : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
            </span>
            <CaretDown size={14} className="text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 animate-fadeIn">
              <div className="px-4 py-2 border-b text-gray-600 font-semibold text-sm">
                Filter by status
              </div>
              <ul className="py-2 text-sm text-gray-700">
                {["all", "pending", "accepted", "declined", "revolked"].map(
                  (s) => (
                    <li key={s}>
                      <button
                        onClick={() => {
                          setFilterStatus(s as BookingStatus | "all");
                          setDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 rounded-md transition-colors duration-150 ${
                          s === filterStatus
                            ? "bg-yellow-100 font-medium text-yellow-800"
                            : "hover:bg-yellow-50"
                        }`}
                      >
                        {s === "all"
                          ? "All Status"
                          : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-gray-600 animate-pulse">Loading bookings...</p>
        </div>
      ) : (
        <div>
          {bookings.length > 0 ? (
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
                  </div>

                  {/* Info */}
                  <div className="mt-4 flex flex-col flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-lg text-gray-900">
                        {booking.pg_name}
                      </h4>
                      <div
                        data-tooltip={`${booking?.status?.toUpperCase()} on ${formatDate(
                          booking?.status_timestamp
                        )}`}
                        className={`text-xs px-2 py-1 rounded-md text-white ${
                          booking.status === "pending"
                            ? "bg-yellow-500"
                            : booking.status === "accepted"
                            ? "bg-green-500"
                            : booking.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </div>
                    </div>

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

                    <div className="flex justify-between">
                      <PaymentButton booking_id={booking?.booking_id} payment_at={booking?.payment_at} payment_ttl={booking?.payment_ttl}/>
                      <button
                        data-tooltip="View Booking Details"
                        className={`mt-5 bg-buttons hover:bg-buttonsHover text-white px-4 py-2 flex-1 rounded text-center`}
                        onClick={() => {
                          dispatch(
                            setModalVisibility({
                              open: true,
                              type: "viewbooking",
                              modalData: {
                                caption: "View Booking",
                                booking_id: booking.booking_id,
                                room_id: booking.room_details.id,
                              },
                            })
                          );
                        }}
                      >
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
              <p className="text-lg font-semibold">No bookings found</p>
              <Link
                href="/"
                className="mt-4 bg-buttons hover:bg-buttonsHover text-white px-4 py-2 rounded text-center"
              >
                Explore PGs
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
