  "use client";

  import { useEffect, useRef, useState } from "react";
  import { useParams } from "next/navigation";
  import { api_caller, ApiReturn } from "@/lib/api_caller";
  import { API } from "@/lib/api_const";
  import {
    Calendar,
    CheckCircle,
    CurrencyInr,
    HourglassHighIcon,
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
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);


    const filterDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearch(searchTerm);
      }, 800);

      return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
      setCurrentPage(1);
      setHasMore(true);
    }, [filterStatus, debouncedSearch]);


    // Fetch booking details
    const getBookings = async () => {
      try {
        setLoading(true);
        const buildUrl = `${API.BOOKING.ROOMLIST}?page=${currentPage}&show=12&filter=${filterStatus}&search=${debouncedSearch}`;
        const response: ApiReturn<any> = await api_caller("GET", buildUrl);
        // console.log(response, "response");
        if (response?.success) {
          const fetchedBookings = response?.data?.bookings || [];
          const totalPages = response?.data?.total_pages;
          // setBookings([...(fetchedBookings || [])]);
          setBookings((prev) => currentPage === 1 ? fetchedBookings : [...prev, ...fetchedBookings])

          // const initial: Record<string, number> = {};
          // fetchedBookings?.forEach((b: BookingItem) => {
          //   if (b.payment_ttl !== null) {
          //     initial[b.booking_id] = b.payment_ttl;
          //   }
          // });

          setCountdowns((prev) => {
            const updated = { ...prev };
            fetchedBookings.forEach((b: BookingItem) => {
              if (b.payment_ttl !== null) {
                updated[b.booking_id] = b.payment_ttl;
              }
            });
            return updated;
          });

          setHasMore(currentPage < totalPages)

        } else {
          toast.error(response?.message || "Failed to load bookings");
        }
      } catch (error) {
        toast.error("Unable to fetch bookings");
      } finally {
        setLoading(false);
        setIsFetchingMore(false)
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

    const PaymentButton = ({ booking_id, payment_ttl, payment_at }: { booking_id: string; payment_ttl: number | null; payment_at: string }) => {
      if (payment_ttl !== null && !payment_at) {
        return (
          <button
            data-tooltip={formatTTL(countdowns[booking_id] || 0)}
            className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-[10px] tracking-widest uppercase shadow-lg shadow-gray-900/10 hover:bg-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
      else if (payment_ttl !== null && payment_at) {
        return (
          <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 rounded-xl font-bold text-[10px] tracking-widest uppercase border border-green-100 shadow-sm" data-tooltip={formatDate(payment_at)}>
            <CheckCircle size={18} weight="bold" />
            <span>Success</span>
          </div>
        );
      }
      else {
        return null;
      }
    }

    const loaderRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
      if (!loaderRef.current || !scrollContainerRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            hasMore &&
            !isFetchingMore &&
            !loading
          ) {
            setIsFetchingMore(true);
            setCurrentPage((prev) => prev + 1);
          }
        },
        {
          root: scrollContainerRef.current,
          threshold: 0.2,
        }
      );

      observer.observe(loaderRef.current);

      return () => observer.disconnect();
    }, [hasMore, loading, isFetchingMore]);



    return (
      <div className="max-w-full space-y-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Refresh or Reset Filter Button */}
          <div className="flex items-center gap-4">
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
                  scrollContainerRef.current?.scrollTo({ top: 0 });
                } else {
                  getBookings();
                }
              }}
              className="p-3 bg-gray-900 text-white rounded-xl hover:bg-black shadow-lg shadow-gray-900/10 transition-all duration-300 active:scale-95"
            >
              <ArrowClockwise size={18} weight="bold" />
            </button>
          </div>

          <div className="flex-1 relative group">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by PG Name, Name or Address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl font-jakarta text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-100 transition-all duration-300"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center justify-between min-w-[160px] w-full md:w-auto px-5 py-3 text-[10px] font-bold tracking-widest uppercase rounded-xl border transition-all duration-300 ${
                dropdownOpen || filterStatus !== 'all'
                  ? "bg-primary-50 text-primary-600 border-primary-100 shadow-sm"
                  : "bg-gray-50/50 text-gray-400 border-gray-100 hover:border-gray-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <FunnelSimple size={18} weight="bold" />
                {filterStatus === "all"
                  ? "All Status"
                  : filterStatus}
              </span>
              <CaretDown size={14} weight="bold" className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 z-30 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                <div className="px-4 py-2 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  Filter by status
                </div>
                <ul className="space-y-1">
                  {["all", "pending", "accepted", "declined", "revolked"].map(
                    (s) => (
                      <li key={s}>
                        <button
                          onClick={() => {
                            setFilterStatus(s as BookingStatus | "all");
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all duration-200 ${
                            s === filterStatus
                              ? "bg-primary-50 text-primary-600"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {s === "all"
                            ? "All Status"
                            : s}
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {loading && currentPage === 1 ? (
          <div className="flex flex-col justify-center items-center min-h-[40vh] space-y-4">
            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-jakarta text-sm animate-pulse tracking-wide uppercase font-bold">Synchronizing your stays...</p>
          </div>
        ) : (
          <div
            className="h-[75vh] overflow-y-auto custom-scrollbar"
            ref={scrollContainerRef}
          >
            {bookings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                  {bookings.map((booking) => (
                    <div
                      key={booking.booking_id}
                      className="group relative bg-white border border-gray-100 rounded-[2rem] p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-100/10 flex flex-col"
                    >
                      {/* Room Image Slider */}
                      <div className="relative w-full h-48 overflow-hidden rounded-[1.5rem] bg-gray-50 flex-shrink-0">
                        <FadedImageSlider
                          images={booking.room_details.room_images.map(
                            (img) => ({
                              pg_image_url: img.room_image_url,
                              pg_image_id: img.room_image_id,
                            }),
                          )}
                        />
                        <div className="absolute top-3 right-3 z-20">
                          <div
                            data-tooltip={`${booking?.status?.toUpperCase()} on ${formatDate(
                              booking?.status_timestamp,
                            )}`}
                            className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-lg backdrop-blur-md border border-white/20 whitespace-nowrap ${
                                booking.status === "pending" ? "bg-amber-500/90 text-white" :
                                booking.status === "accepted" ? "bg-green-500/90 text-white" :
                                booking.status === "cancelled" || booking.status === "declined" ? "bg-red-500/90 text-white" : "bg-gray-500/90 text-white"
                             }`}
                          >
                            <span>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="mt-6 flex flex-col flex-1 px-2">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-lg font-normal text-gray-900 font-display tracking-tight group-hover:text-primary-600 transition-colors line-clamp-1">
                            {booking.pg_name}
                          </h4>
                          {booking.status === "pending" && (
                            <div data-tooltip="Waiting for Owner Approval" className="mt-1">
                              <HourglassHighIcon size={18} weight="bold" className="animate-spin text-amber-500"/>
                            </div>
                          )}
                        </div>

                        <div className="mt-1">
                           <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                              ID: {booking.booking_id}
                           </p>
                        </div>

                        {/* Booking Details */}
                        <div className="mt-5 space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                          <div className="flex items-center justify-between">
                            <p className="flex items-center gap-2 text-[11px] font-jakarta font-bold text-gray-600">
                              <Calendar size={14} className="text-primary-600" />
                              <span>{formatDate(booking.booking_date)}</span>
                            </p>
                            <p className="flex items-center gap-2 text-[11px] font-jakarta font-bold text-gray-600">
                              <UsersThree size={14} className="text-primary-600" />
                              <span>{booking.person_number} Person{booking.person_number > 1 ? 's' : ''}</span>
                            </p>
                          </div>
                          
                          <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between">
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{booking.room_details.type} Bed</span>
                             <p className="flex items-center gap-0.5 text-gray-900 font-jakarta font-bold text-sm">
                                <CurrencyInr size={14} weight="bold" className="text-primary-600" />
                                {booking.room_details.room_rent}
                                <span className="text-[10px] text-gray-400 font-normal ml-0.5">/{booking.room_details.deposit_duration}</span>
                             </p>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap sm:flex-nowrap items-center gap-3">
                          <PaymentButton
                            booking_id={booking?.booking_id}
                            payment_at={booking?.payment_at}
                            payment_ttl={booking?.payment_ttl}
                          />
                          <button
                            data-tooltip="View Booking Details"
                            className="flex-1 px-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-gray-50 transition-all duration-300"
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
                                }),
                              );
                            }}
                          >
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div ref={loaderRef} className="flex flex-col items-center justify-center py-12 space-y-4">
                  {isFetchingMore && hasMore && (
                    <>
                      <div className="w-8 h-8 border-3 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                      <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Fetching more stays...</p>
                    </>
                  )}
                  {!hasMore && bookings.length > 0 && (
                     <p className="text-[10px] text-gray-300 font-bold tracking-widest uppercase">End of journey</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 space-y-6 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-gray-100">
                  <MagnifyingGlass size={40} weight="thin" className="text-gray-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-normal text-gray-900 font-display tracking-tight">No stays <span className="italic-serif text-primary-600">discovered</span></h3>
                  <p className="text-gray-400 font-jakarta text-sm max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                    setCurrentPage(1);
                  }}
                  className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs tracking-widest uppercase shadow-xl hover:bg-black transition-all duration-300"
                >
                  Explore PGs
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
