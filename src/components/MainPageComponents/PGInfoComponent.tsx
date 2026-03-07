"use client";

import RoomCard from "@/components/DisplayCard/RoomCard";
import "leaflet/dist/leaflet.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import {
  ForkKnife,
  WifiHigh,
  ThermometerCold,
  ArrowLeft,
  ArrowRight,
  X,
  MapPin,
  Star,
  Shield,
  Phone,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { PGInfo, Room } from "@/types/pg_type";
import "swiper/css";
import { Review } from "@/app/(sharedlayout)/pg/[id]/page";
import type { LatLngTuple } from "leaflet";
import dynamic from "next/dynamic";
import { getAmenityLabel } from "@/data/countryPhone";
import { useDispatch } from "react-redux";
import { setModalVisibility } from "@/redux/slices/modalSlice";
import { CameraPlus, Trash } from "@phosphor-icons/react/dist/ssr";
import { useWishlist } from "@/lib/hook/useWishlist";
import Attractions from "./Attractions";
import CommonButton from "../AppComponents/CommonButton";

const Map = dynamic(() => import("../Map/Map"), { ssr: false });
const Feedback = lazy(() => import("@/components/Feedback/Feedback"));
const SimilerPgs = lazy(
  () => import("@/components/MainPageComponents/SimilerPgs")
);

interface Iprops {
  id: string;
  pginfo: PGInfo;
  rooms: Room[];
  reviewData: Review[];
  clg_coords?: string;
  clg_name?: string;
  clg_addr?: string;
  clg_pin?: string;
  clg_id?: string;
}

// SwiperCore.use([Navigation, Pagination]);

const PGInfoComponent = ({
  pginfo,
  rooms,
  reviewData,
  id,
  clg_coords,
  clg_name,
  clg_addr,
  clg_pin,
  clg_id,
}: Iprops) => {
  // console.log("pginfo", pginfo);

  const formRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  // const paginationRef = useRef<HTMLDivElement>(null);
  const college_coords = clg_coords?.split(",")
    .map((coord) => Number(coord))
    .reverse() as [number, number];

  // useEffect(() => {
  //   console.log(reviewData);
  // }, [reviewData]);
  const router = useRouter();

  const position: LatLngTuple = pginfo?.location
    ? [pginfo.location.coordinates[1], pginfo.location.coordinates[0]]
    : [28.6139, 77.209];

  const getPGTypeColor = (type: string) => {
    switch (type) {
      case "girls":
        return "bg-gradient-to-r from-pink-500 to-rose-500";
      case "boys":
        return "bg-gradient-to-r from-blue-500 to-indigo-500";
      case "both":
        return "bg-gradient-to-r from-amber-500 to-orange-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getAverageRating = () => {
    if (!reviewData || reviewData.length === 0) return 0;
    const sum = reviewData.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviewData.length).toFixed(1);
  };
  

  // Wishlist handler Hook
  const { addToWishlist, wishlistArray, isUserLoggedIn } = useWishlist();

  // console.log("Rendering PGInfoComponent with pginfo:", pginfo);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-all duration-300 group font-jakarta font-medium text-sm"
          >
            <div className="p-2 bg-gray-50 rounded-full group-hover:bg-primary-50 transition-colors">
              <ArrowLeft
                size={16}
                weight="bold"
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
            </div>
            <span>Back to Search</span>
          </button>

          <div className="flex items-center gap-3">
            <CommonButton
              variant="outline"
              size="sm"
              onClick={() => {
                dispatch(
                  setModalVisibility({
                    open: true,
                    type: "compare",
                    modalData: {
                      pg_id: pginfo?._id,
                      pg_name: pginfo?.pg_name,
                      minRent: pginfo?.minRent,
                      address: pginfo?.address,
                      pg_type: pginfo?.pg_type,
                      wifi: pginfo?.wifi_available,
                      food: pginfo?.food_available,
                      images: pginfo?.pg_images,
                      coordinates: pginfo?.location?.coordinates,
                      additional_wifi_charges: pginfo?.additional_wifi_charges,
                      charge_duration: pginfo?.charge_duration,
                    },
                  })
                );
              }}
            >
              Add to Compare
            </CommonButton>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Gallery Section */}
            <div className="lg:col-span-8 space-y-6">
              <div className="relative group overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 bg-white p-2">
                <img
                  src={pginfo?.pg_images[0]?.pg_image_url}
                  alt="PG Image"
                  className="w-full h-[450px] lg:h-[600px] object-cover rounded-[2rem] transition-transform duration-700 group-hover:scale-[1.02]"
                />
                
                {/* Float Badges */}
                <div className="absolute top-6 left-6 z-10 flex gap-2">
                  <span className={`${getPGTypeColor(pginfo?.pg_type)} text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-lg`}>
                    {pginfo?.pg_type} Only
                  </span>
                  {pginfo?.food_available === "yes" && (
                    <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-sm border border-white/20">
                      Food Included
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails Swiper */}
              <div className="relative px-2">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={16}
                  slidesPerView={1}
                  navigation={{
                    nextEl: ".custom-swiper-next",
                    prevEl: ".custom-swiper-prev",
                  }}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                  className="rounded-3xl"
                >
                  {pginfo?.pg_images?.slice(1)?.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="relative h-48 overflow-hidden rounded-3xl border border-gray-100 group cursor-pointer">
                        <img
                          src={img?.pg_image_url}
                          alt={`PG Carousel ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      </div>
                    </SwiperSlide>
                  ))}

                  {/* Custom Navigation */}
                  <div className="custom-swiper-prev absolute top-1/2 left-4 z-10 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-white transition-all">
                    <CaretLeft size={20} weight="bold" />
                  </div>
                  <div className="custom-swiper-next absolute top-1/2 right-4 z-10 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-white transition-all">
                    <CaretRight size={20} weight="bold" />
                  </div>
                </Swiper>
              </div>
            </div>

            {/* PG Details Sidebar */}
            <div className="lg:col-span-4 h-full">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full sticky top-32">
                <div className="space-y-8 flex-1">
                  {/* Title & Rating */}
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4 font-display tracking-tight leading-tight">
                      {pginfo.pg_name}
                    </h1>
                    
                    {reviewData && reviewData.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
                          <Star size={16} weight="fill" className="text-primary-600 mr-1.5" />
                          <span className="text-sm font-bold text-primary-700">
                            {getAverageRating()}
                          </span>
                        </div>
                        <span className="text-xs font-jakarta text-gray-400">
                          Based on {reviewData.length} reviews
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features & Pricing */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-100 group hover:border-primary-200 transition-colors">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-primary-50 transition-colors">
                          <WifiHigh size={20} className="text-primary-600" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Connectivity</span>
                      </div>
                      <p className="text-sm font-jakarta text-gray-700 font-medium">
                        {pginfo.wifi_available === "yes" ? "Ultra-fast Fiber WiFi Included" : "WiFi not available"}
                      </p>
                    </div>

                    <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-100 group hover:border-primary-200 transition-colors">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-primary-50 transition-colors">
                          <ForkKnife size={20} className="text-primary-600" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Dining</span>
                      </div>
                      <p className="text-sm font-jakarta text-gray-700 font-medium">
                        {pginfo.food_available === "yes" ? "Nutritious Homely Meals" : "Self-managed meals"}
                      </p>
                    </div>
                  </div>

                  {/* Rent Section */}
                  <div className="pt-4 border-t border-gray-50">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block mb-1">Starting from</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-semibold text-gray-900 font-display">₹{pginfo?.minRent}</span>
                          <span className="text-gray-400 font-jakarta text-sm">/mo</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-green-600 tracking-widest uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">
                          Best Value
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Map Link */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={18} />
                      <span className="text-sm font-jakarta leading-relaxed line-clamp-2">{pginfo.address}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-10 space-y-4">
                  <CommonButton
                    className="w-full"
                    onClick={() => {
                      dispatch(
                        setModalVisibility({
                          open: true,
                          type: "ownerinfo",
                          modalData: {
                            text: pginfo?.pg_name as string,
                            rowid: pginfo?._id as string,
                          },
                        })
                      );
                    }}
                  >
                    View Owner Contact
                  </CommonButton>

                  {isUserLoggedIn && (
                    <CommonButton
                      variant="outline"
                      className="w-full"
                      onClick={() => addToWishlist(pginfo?._id)}
                    >
                      {wishlistArray?.includes(pginfo?._id) ? (
                        <div className="flex items-center justify-center gap-2">
                          <Trash size={20} />
                          <span>Remove from Wishlist</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Star size={20} />
                          <span>Save for Later</span>
                        </div>
                      )}
                    </CommonButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rules Section */}
        <div className="animate-slideUp mb-24">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-8 bg-primary-200" />
              <span className="text-[10px] font-bold text-primary-600 tracking-widest uppercase">Community Guidelines</span>
              <div className="h-[1px] w-8 bg-primary-200" />
            </div>
            <h2 className="text-4xl font-semibold text-gray-900 font-display tracking-tight mb-4">
              House <span className="italic-serif text-primary-600">Rules</span>
            </h2>
          </div>
          
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-10 lg:p-14 border border-gray-100 relative overflow-hidden group">
            {/* Subtle Gradient Backdrop */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-50 rounded-full blur-[80px] opacity-50 transition-opacity group-hover:opacity-70" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4 space-y-6">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center">
                  <Shield size={32} weight="duotone" className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 font-display tracking-tight mb-3">
                    Safety & <span className="text-primary-600">Harmony</span>
                  </h3>
                  <p className="text-sm text-gray-400 font-jakarta leading-relaxed">
                    Guidelines crafted to ensure a safe, respectful, and premium living environment for all our residents.
                  </p>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-primary-600 mb-2">
                    <Star size={18} weight="fill" />
                    <span className="text-xs font-bold uppercase tracking-widest">Resident Note</span>
                  </div>
                  <p className="text-xs text-gray-400 font-jakarta leading-relaxed italic">
                    "Compliance with these rules helps us maintain the high standard of living you expect from Guestify."
                  </p>
                </div>
              </div>
              
              <div className="lg:col-span-8">
                <div className="bg-gray-50/50 rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-inner">
                  <div 
                    className="text-gray-700 leading-loose text-lg font-jakarta prose prose-primary prose-lg max-w-none 
                      [&>ul]:list-none [&>ul]:pl-0 [&>ul>li]:relative [&>ul>li]:pl-6
                      [&>ul>li]:before:content-[''] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-[14px]
                      [&>ul>li]:before:w-2 [&>ul>li]:before:h-2 [&>ul>li]:before:bg-primary-500 [&>ul>li]:before:rounded-full" 
                    dangerouslySetInnerHTML={{ __html: pginfo.rules }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review CTA Section */}
        <div className="animate-slideUp mb-24">
          <div className="relative rounded-[3rem] p-12 overflow-hidden bg-gray-900">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/30 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4">
                  <Star size={12} weight="fill" className="text-yellow-400" />
                  <span className="text-[10px] font-bold text-white tracking-widest uppercase">Community Driven</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white font-display mb-3 tracking-tight">
                  Share Your <span className="text-primary-400 italic-serif">Experience</span>
                </h3>
                <p className="text-white/60 font-jakarta max-w-md leading-relaxed">
                  Join hundreds of students in building a transparent community. Your feedback helps others find their safe haven.
                </p>
              </div>
              
              <CommonButton
                variant="primary"
                onClick={() => {
                  formRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Write a Review
              </CommonButton>
            </div>
          </div>
        </div>

        {/* Available Rooms Section */}
        <div className="animate-slideUp mb-24">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-8 bg-primary-200" />
              <span className="text-[10px] font-bold text-primary-600 tracking-widest uppercase">Room Selection</span>
              <div className="h-[1px] w-8 bg-primary-200" />
            </div>
            <h2 className="text-4xl font-semibold text-gray-900 font-display tracking-tight mb-4">
              Available <span className="italic-serif text-primary-600">Accommodations</span>
            </h2>
            <p className="text-gray-500 font-jakarta max-w-xl leading-relaxed">Curated living spaces designed for comfort, productivity, and peace of mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms &&
              rooms.map((room, index) => {
                // Getting room amenities labels
                const aminities = room?.aminities?.map((item: string) =>
                  getAmenityLabel(item)
                );
                return (
                  <div
                    key={room._id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <RoomCard
                      room_id={room._id}
                      title={`${
                        room.room_type[0].toUpperCase() +
                        room.room_type.slice(1)
                      } bed Room`}
                      rent={room.room_rent}
                      foodIncluded={pginfo.food_available === "yes"}
                      roomsAvailable={10}
                      depositDuration={room.deposit_duration}
                      imageUrls={room.room_images}
                      amenities={aminities}
                      wifidetails={
                        pginfo.wifi_available === "yes"
                          ? {
                              available: "yes",
                              speed: `${pginfo.wifi_speed} Mbps`,
                              cost: pginfo.additional_wifi_charges,
                              duration: pginfo.charge_duration,
                            }
                          : {
                              available: "no",
                              speed: "",
                              cost: 0,
                              duration: "",
                            }
                      }
                      attachedBathroom={room.attached_bathroom}
                      airconditioned={room.ac_available}
                      bookinginfo={{
                        booked_by: room?.booked_by,
                        booking_status: room?.booking_status
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Attractions Section */}
        <div className="animate-slideUp mb-24">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-8 bg-primary-200" />
              <span className="text-[10px] font-bold text-primary-600 tracking-widest uppercase">Explore Local</span>
              <div className="h-[1px] w-8 bg-primary-200" />
            </div>
            <h2 className="text-4xl font-semibold text-gray-900 font-display tracking-tight mb-4">
              Nearby <span className="italic-serif text-primary-600">Attractions</span>
            </h2>
            <p className="text-gray-500 font-jakarta max-w-xl leading-relaxed">Discover popular spots and essentials conveniently located just minutes from your stay.</p>
          </div>
          <Suspense fallback={<SimilarPGsSkeleton />}>
            <Attractions
              id={pginfo?._id}
            />
          </Suspense>
        </div>

        {/* Map Section */}
        <div className="animate-slideUp mb-24">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-8 bg-primary-200" />
              <span className="text-[10px] font-bold text-primary-600 tracking-widest uppercase">Quick Transit</span>
              <div className="h-[1px] w-8 bg-primary-200" />
            </div>
            <h2 className="text-4xl font-semibold text-gray-900 font-display tracking-tight mb-4">
              Location & <span className="italic-serif text-primary-600">Neighborhood</span>
            </h2>
            <p className="text-gray-500 font-jakarta max-w-xl leading-relaxed">Strategically situated with seamless connectivity to your college, food hubs, and medical centers.</p>
          </div>

          <div className="bg-white p-2 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
            <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden">
              <Map
                clg_coords={college_coords}
                pgInfo={{
                  position: position as [number, number],
                  name: pginfo.pg_name,
                  address: pginfo.address,
                  pg_idno: pginfo._id,
                }}
                {...{ clg_name, clg_addr, clg_pin, clg_id }}
              />
            </div>
          </div>
        </div>

        {/* Similar PGs Section */}
        <div className="animate-slideUp mb-24">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-8 bg-primary-200" />
              <span className="text-[10px] font-bold text-primary-600 tracking-widest uppercase">Other Choices</span>
              <div className="h-[1px] w-8 bg-primary-200" />
            </div>
            <h2 className="text-4xl font-semibold text-gray-900 font-display tracking-tight mb-4">
              Similar <span className="italic-serif text-primary-600">Accommodations</span>
            </h2>
            <p className="text-gray-500 font-jakarta max-w-xl leading-relaxed">Discover other premium stays in this neighborhood that might better fit your unique needs.</p>
          </div>
          <Suspense fallback={<SimilarPGsSkeleton />}>
            <SimilerPgs
              current_pgid={pginfo?._id}
              current_pg_cords={pginfo?.location?.coordinates}
            />
          </Suspense>
        </div>

        {/* Feedback Section */}
        <div className="animate-slideUp pb-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-8 bg-primary-200" />
              <span className="text-[10px] font-bold text-primary-600 tracking-widest uppercase">Verified Reviews</span>
              <div className="h-[1px] w-8 bg-primary-200" />
            </div>
            <h2 className="text-4xl font-semibold text-gray-900 font-display tracking-tight mb-4">
              Community <span className="italic-serif text-primary-600">Voice</span>
            </h2>
            <p className="text-gray-500 font-jakarta max-w-xl leading-relaxed">Hear from fellow students about their genuine living experiences at this property.</p>
          </div>
          <Suspense fallback={<FeedbackSkeleton />}>
            <Feedback ref={formRef} {...{ reviewData, id }} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PGInfoComponent;

const SimilarPGsSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4" />
        <div className="w-24 h-1 bg-gray-300 rounded mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
          >
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeedbackSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="text-center">
        <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4" />
        <div className="w-24 h-1 bg-gray-300 rounded mx-auto" />
      </div>

      {/* Reviews Carousel Skeleton */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="h-6 bg-gray-300 rounded w-32 mb-6" />

        <div className="relative overflow-hidden">
          <div className="flex gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="min-w-[350px] bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className="w-4 h-4 bg-gray-200 rounded" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Form Skeleton */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="h-6 bg-gray-300 rounded w-48 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Name field */}
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-100 rounded-lg" />
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-100 rounded-lg" />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-10 h-10 bg-gray-200 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Feedback textarea */}
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-32 bg-gray-100 rounded-lg" />
            </div>

            {/* Image upload */}
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-200" />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-8">
          <div className="w-40 h-12 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
