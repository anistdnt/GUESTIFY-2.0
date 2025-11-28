"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { CaretDown, CaretUp, CurrencyInr, Heart } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import toast from "react-hot-toast";
import FadedImageSlider from "@/components/DisplayCard/FadedImageSlider";
import { useDispatch, useSelector } from "react-redux";
import { removeWishlistData } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { setModalVisibility } from "@/redux/slices/modalSlice";

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

type CatelogueType = {
  _id: string;
  room_type: string;
  room_rent: string | number;
  deposit_duration: string;
  pg_id: string;
  booking_at?: string;
  booked_by?: string;
  booking_status?: string;
};

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<PGItem[]>([]);
  const [roomcatelogue, setRoomCatelogue] = useState<CatelogueType[]>([]);
  const [loading, setLoading] = useState(true);
  const [Catelogueloading, setCatelogueLoading] = useState<boolean>(false);
  const params = useParams();
  const dispatch = useDispatch();

  const profile_info = useSelector(
    (state: RootState) => state.user_slice.userData
  );

  //Accordian State
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

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

  // Fetch Rooms Catelogue
  const getRoomsCatelogue = async (pg_id: string) => {
    try {
      setCatelogueLoading(true);
      const response: ApiReturn<any> = await api_caller<any>("GET", `${API.ROOM.CATELOGUE?.replace(":pgid",pg_id)}`);
      if (response.success) {
        setRoomCatelogue(response.data || []);
      } else {
        toast.error(response.message || "Failed to load wishlist");
        setRoomCatelogue([]);
      }
    } catch (error) {
      toast.error("Unable to fetch wishlist");
    } finally {
      setCatelogueLoading(false);
    }
  };

  // Toggle accordian handler
  const toggleAccordion = (pgId: string) => {
    if (openAccordion === pgId) {
      setOpenAccordion(null);
      return;
    }
    setOpenAccordion(pgId);
    getRoomsCatelogue(pgId);
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
        dispatch(removeWishlistData(pgId));
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
        <p className="text-lg font-semibold">Your wishlist is empty</p>
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
    <div className="max-w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
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
              className={`absolute top-3 left-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-sm transition-colors z-20 ${
                profile_info?.wishlist?.includes(item?.pg_id)
                  ? "heart-animate"
                  : ""
              }`}
              aria-label="Remove from wishlist"
            >
              <Heart
                size={20}
                weight="fill"
                color="#e0245e"
                className="transition-all duration-300"
              />
            </button>

            {/* Image */}
            <Link
              href={`/pg/${item.pg_id}`}
              className="relative w-full h-48 overflow-hidden rounded-xl block"
            >
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
                  Food{" "}
                  {item.food_available === "yes"
                    ? "Available"
                    : "Not Available"}
                </span>
                <span
                  className={`px-2 py-1 rounded ${
                    item.wifi_available === "yes"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  WiFi{" "}
                  {item.wifi_available === "yes"
                    ? "Available"
                    : "Not Available"}
                </span>
              </div>

              {/* Room Catalogue Accordion Trigger */}
              <button
                onClick={() => toggleAccordion(item.pg_id)}
                className="mt-4 w-full bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-left text-sm font-medium flex justify-between items-center"
              >
                <span className="flex items-center gap-2">
                  Enlisted Rooms
                  <span className="bg-gray-400 text-white h-5 w-5 flex items-center justify-center rounded-full text-xs">
                    {item.rooms?.length}
                  </span>
                </span>

                <span>
                  {openAccordion === item.pg_id ? (
                    <CaretUp size={15} />
                  ) : (
                    <CaretDown size={15} />
                  )}
                </span>
              </button>

              {openAccordion === item.pg_id && (
                <div className="mt-3 border rounded p-3 space-y-3 h-32 overflow-y-auto scrollbar-hide">
                  {Catelogueloading ? (
                    <p className="text-gray-500 text-sm">Loading rooms...</p>
                  ) : roomcatelogue?.length === 0 ? (
                    <p className="text-gray-500 text-sm">No rooms found.</p>
                  ) : (
                    roomcatelogue?.map((room: CatelogueType, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm border-b pb-2"
                      >
                        <div>
                          <p className="font-medium text-gray-500">{`${room.room_type?.toUpperCase()} BED`}</p>
                          <p className="flex items-center gap-1 text-gray-700">
                            <CurrencyInr size={12} />{" "}
                            <span className="font-semibold">
                              {room.room_rent}
                            </span>{" "}
                            ({room.deposit_duration})
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            dispatch(
                              setModalVisibility({
                                open: true,
                                type: "roombooking",
                                modalData: {
                                  caption: "Create New Booking",
                                  room_id: room._id,
                                  title: `${item.pg_name}(${room.room_type})`,
                                },
                              })
                            );
                          }}
                          data-tooltip={
                            !room.booking_status
                              ? "Book from here"
                              : room.booking_status
                          }
                          data-tooltip-pos="left"
                          className="bg-buttons hover:bg-buttonsHover text-white px-3 py-1 rounded text-sm disabled:cursor-not-allowed"
                          disabled={room.booked_by !== null}
                        >
                          {room.booked_by !== null ? 'Booked' : 'Book Now'}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

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
