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
      <div className="flex flex-col justify-center items-center min-h-[40vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-gray-400 font-jakarta text-sm animate-pulse tracking-wide uppercase font-bold">Refining your selections...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 space-y-6 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-gray-100 mb-2">
          <Heart size={40} weight="thin" className="text-gray-200" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-normal text-gray-900 font-display tracking-tight">Your wishlist is <span className="italic-serif text-primary-600">empty</span></h3>
          <p className="text-gray-400 font-jakarta text-sm max-w-xs mx-auto">Start exploring our premium PGs to find your perfect stay and save them here.</p>
        </div>
        <Link
          href="/"
          className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs tracking-widest uppercase shadow-xl hover:bg-black transition-all duration-300"
        >
          Explore Stays
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-full space-y-10">
      <div className="flex items-center justify-between px-2">
         <h3 className="text-2xl font-normal text-gray-900 font-display tracking-tight">Curated <span className="italic-serif text-primary-600">Wishlist</span></h3>
         <p className="text-xs text-gray-400 font-bold tracking-widest uppercase font-jakarta">{wishlist.length} {wishlist.length === 1 ? 'Stay' : 'Stays'} saved</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
        {wishlist.map((item) => (
          <div
            key={item.pg_id}
            className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-100/20 hover:-translate-y-1"
          >
            {/* Image Section */}
            <div className="relative w-full h-64 overflow-hidden rounded-[2rem] shadow-inner bg-gray-50">
               <FadedImageSlider images={item?.pg_images} />
               
               {/* Badges Overlay */}
               <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg backdrop-blur-md border border-white/20 ${
                    item.pg_type === "girls"
                      ? "bg-pink-500/80 text-white"
                      : item.pg_type === "boys"
                      ? "bg-blue-500/80 text-white"
                      : "bg-amber-500/80 text-white"
                  }`}>
                    {item.pg_type}
                  </span>
               </div>

               {/* Remove from wishlist button */}
               <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(item.pg_id);
                  }}
                  className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:scale-110 transition-all duration-300 z-20 border border-white"
                  aria-label="Remove from wishlist"
               >
                  <Heart
                    size={20}
                    weight="fill"
                    className="text-red-500"
                  />
               </button>

               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Info Section */}
            <div className="mt-6 px-3 pb-4 space-y-4">
               <div className="space-y-1">
                  <Link href={`/pg/${item.pg_id}`}>
                    <h4 className="text-xl font-normal text-gray-900 font-display tracking-tight group-hover:text-primary-600 transition-colors">
                      {item.pg_name}
                    </h4>
                  </Link>
                  <p className="text-xs text-inherit font-jakarta text-gray-400 line-clamp-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-100"></span>
                    {item.address}
                  </p>
               </div>

               {/* Feature Tags */}
               <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-50 mt-4">
                  <div className={`px-3 py-1 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${
                    item.food_available === "yes" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                  }`}>
                    <span className={`w-1 h-1 rounded-full ${item.food_available === 'yes' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                    Food
                  </div>
                  <div className={`px-3 py-1 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${
                    item.wifi_available === "yes" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-red-50 text-red-600 border border-red-100"
                  }`}>
                    <span className={`w-1 h-1 rounded-full ${item.wifi_available === 'yes' ? 'bg-blue-600' : 'bg-red-600'}`}></span>
                    WiFi
                  </div>
               </div>

               {/* Room Catalogue Accordion */}
               <div className="pt-2">
                  <button
                    onClick={() => toggleAccordion(item.pg_id)}
                    className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                      openAccordion === item.pg_id 
                        ? "bg-primary-50 text-primary-600 border-primary-100 shadow-sm" 
                        : "bg-gray-50/50 text-gray-400 border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      Enlisted Rooms
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        openAccordion === item.pg_id ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-500"
                      }`}>
                        {item.rooms?.length}
                      </span>
                    </span>
                    {openAccordion === item.pg_id ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
                  </button>

                  {openAccordion === item.pg_id && (
                    <div className="mt-3 bg-gray-50/50 rounded-2xl p-2 space-y-2 border border-gray-100 max-h-48 overflow-y-auto custom-scrollbar">
                      {Catelogueloading ? (
                        <div className="py-4 text-center">
                          <div className="w-5 h-5 border-2 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Checking status...</p>
                        </div>
                      ) : roomcatelogue?.length === 0 ? (
                        <p className="py-4 text-center text-[10px] text-gray-400 uppercase font-bold tracking-widest">No rooms listed</p>
                      ) : (
                        roomcatelogue?.map((room: CatelogueType, i: number) => (
                          <div
                            key={i}
                            className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm group/room hover:border-primary-100 transition-all duration-300"
                          >
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">{room.room_type} Bed</span>
                              <p className="flex items-center gap-0.5 text-gray-900 font-jakarta font-bold text-sm">
                                <CurrencyInr size={14} weight="bold" className="text-primary-600" />
                                {room.room_rent}
                                <span className="text-[10px] text-gray-400 font-normal ml-1 lowercase">/{room.deposit_duration}</span>
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
                              disabled={room.booked_by !== null}
                              className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                                room.booked_by !== null 
                                  ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                                  : "bg-primary-600 text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700"
                              }`}
                            >
                              {room.booked_by !== null ? 'Booked' : 'Book Now'}
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
               </div>

               {/* View Details Button */}
               <Link
                  href={`/pg/${item.pg_id}`}
                  className="block w-full text-center py-4 bg-yellow-50 text-yellow-600 rounded-2xl font-bold text-xs tracking-widest uppercase shadow-xl hover:bg-yellow-600 hover:text-white transition-all duration-300 mt-2"
               >
                  View Full Details
               </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
