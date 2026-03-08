"use client";

import { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlass,
  FunnelSimple,
  CaretDown,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import NoDataFound from "@/components/NoDataFound/NoDataFound";
import {
  ArrowClockwise,
} from "@phosphor-icons/react/dist/ssr";
import BookingListBlock from "@/components/Booking/BookingListBlock";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { deleteSuccess, triggerRefetch } from "@/redux/slices/modalSlice";

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

const SkeletonRow = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/5"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">(
    "all"
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPerPageMenu, setShowPerPageMenu] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const perPageDropdownRef = useRef<HTMLDivElement>(null);

  const isRefetch = useSelector(
    (state: RootState) => state.modal_slice.isRefetch
  );
  const isDeleted = useSelector(
    (state: RootState) => state.modal_slice.isDeleted
  );
  const dispatch = useDispatch();

  function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  }
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchBookings();
    dispatch(triggerRefetch(false));
    dispatch(deleteSuccess(true));
  }, [currentPage, perPage, filterStatus, debouncedSearch, isRefetch, isDeleted]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res: ApiReturn<any> = await api_caller<any>(
        "GET",
        `${API.ADMIN.BOOKING.LIST}?page=${currentPage}&show=${perPage}&filter=${filterStatus}&search=${debouncedSearch}`
      );
      if (res.success) {
        setBookings(
          res.data.bookings.map((b: any) => ({
            id: b?.booking_id,
            name: b?.user_name,
            address: b?.user_address,
            dateOfBooking: b?.booking_date?.slice(0, 10),
            status: b?.status,
            status_timestamp: b?.status_timestamp,
            reason: b?.reason || "",
            image: b?.user_image,
            personCount: b?.person_number || 0,
            pg_name: b?.pg_name || "",
            room_type: b?.room_type || "",
            room_id: b?.room_id || "",
            room_rent: b?.room_rent || 0,
            deposit_duration: b?.deposit_duration || "",
            payment_at: b?.payment_at,
            payment_ttl: b?.payment_ttl,
          }))
        );
        setTotalPages(res.data.total_pages);
      } else {
        toast.error(res.message || "Failed to fetch bookings");
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(e.target as Node)
      )
        setDropdownOpen(false);

      if (
        perPageDropdownRef.current &&
        !perPageDropdownRef.current.contains(e.target as Node)
      )
        setShowPerPageMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="p-6 space-y-6">
      
      {/* Cinematic Heading Banner */}
      <div className="relative overflow-hidden bg-white rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 group">
        {/* Decorative Background Element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-50 rounded-full blur-3xl group-hover:bg-primary-100/50 transition-colors duration-700"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-[10px] font-bold uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse"></span>
              Reservation Management
            </div>
            <h1 className="text-gray-400 font-medium text-lg font-jakarta">
              Explore Your
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-display tracking-tight">
              Booking <span className="text-primary-600">Requests</span>
            </h2>
            <p className="text-gray-500 max-w-2xl font-jakarta text-sm leading-relaxed pt-2">
              Empower your management operations with a unified interface for handling all tenant booking requests. Precision in oversight ensures high-fidelity property management.
            </p>
          </div>
          
          <div className="hidden lg:block text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Active Requests</p>
            <p className="text-3xl font-bold text-gray-900 font-display">{bookings.length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-[0_0_10px_0_rgba(0,0,0,0.12)] p-6">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Refresh or Reset Filter Button */}
          <div>
            <button
              data-tooltip="Refresh or Reset Filters"
              onClick={() => {
                if(filterStatus !== "all" || searchTerm !== "" || currentPage !==1){
                  setSearchTerm("");
                  setFilterStatus("all");
                  setCurrentPage(1);
                } else {
                  fetchBookings();
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
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 font-jakarta text-sm"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between w-44 px-4 py-2 text-sm font-bold font-jakarta text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all focus:ring-4 focus:ring-primary-500/10 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <FunnelSimple size={18} className="text-gray-500" />
                {filterStatus === "all"
                  ? "All Status"
                  : filterStatus.charAt(0).toUpperCase() +
                    filterStatus.slice(1)}
              </span>
              <CaretDown size={14} className="text-gray-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 animate-fadeIn">
                <div className="px-4 py-2 border-b text-gray-600 font-semibold text-sm">
                  Filter by status
                </div>
                <ul className="py-2 text-sm text-gray-700">
                  {["all", "pending", "accepted", "declined", "revolked"].map((s) => (
                    <li key={s}>
                      <button
                        onClick={() => {
                          setFilterStatus(s as BookingStatus | "all");
                          setDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 rounded-lg transition-colors duration-150 font-bold ${
                          s === filterStatus
                            ? "bg-primary-50 text-primary-600"
                            : "hover:bg-primary-50/50 text-gray-600"
                        }`}
                      >
                        {s === "all"
                          ? "All Status"
                          : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Booking Cards */}
        <div className="space-y-4">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => <SkeletonRow key={i} />)
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <NoDataFound text="No Bookings found" />
            </div>
          ) : (
            bookings.map((b) => (
              <BookingListBlock b={b} key={b.id} fetchBookings={fetchBookings}/>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && bookings.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-3">
            {/* Per page dropdown */}
            <div className="relative" ref={perPageDropdownRef}>
              <button
                onClick={() => setShowPerPageMenu((prev) => !prev)}
                className="flex items-center justify-between px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-yellow-400 focus:outline-none w-32"
              >
                {perPage} per page
                <CaretDown size={14} className="ml-2 text-gray-500" />
              </button>

              {showPerPageMenu && (
                <div className="absolute left-0 bottom-12 z-30 w-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 animate-fadeIn">
                  <div className="px-4 py-2 border-b text-gray-600 font-semibold text-sm">
                    Rows per page
                  </div>
                  <ul className="py-2 text-sm text-gray-700">
                    {[5, 10, 20, 50].map((num) => (
                      <li key={num}>
                        <button
                          onClick={() => {
                            setPerPage(num);
                            setCurrentPage(1);
                            setShowPerPageMenu(false);
                          }}
                          className={`block w-full px-4 py-2 text-left hover:bg-yellow-50 ${
                            num === perPage ? "bg-yellow-100 font-medium" : ""
                          }`}
                        >
                          {num} rows
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
              >
                <CaretLeft size={16} weight="bold" />
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
