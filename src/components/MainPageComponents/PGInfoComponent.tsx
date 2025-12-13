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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with back button */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-headingCol transition-colors duration-200 group"
          >
            <ArrowLeft
              size={24}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Image */}
            <div className="lg:col-span-2">
              <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={pginfo?.pg_images[0]?.pg_image_url}
                  alt="PG Image"
                  className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Image Carousel */}
              <div className="mt-6">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={24}
                  slidesPerView={1}
                  navigation={{
                    nextEl: ".custom-swiper-next",
                    prevEl: ".custom-swiper-prev",
                  }}
                  // pagination={{
                  //   clickable: true,
                  //   el: paginationRef.current,
                  // }}
                  breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                  loop={true}
                  // onBeforeInit={(swiper) => {
                  //   // Assign pagination element dynamically
                  //   if (paginationRef.current) {
                  //     (swiper.params.pagination as any).el = paginationRef.current;
                  //   }
                  // }}
                >
                  {pginfo?.pg_images?.slice(1)?.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={img?.pg_image_url}
                        alt={`PG Carousel ${idx + 1}`}
                        className="w-full h-[300px] object-cover rounded-2xl"
                      />
                    </SwiperSlide>
                  ))}

                  {/* Rounded Navigation Buttons */}
                  <div className="custom-swiper-prev absolute top-1/2 left-2 z-10 -translate-y-1/2 cursor-pointer bg-white rounded-full p-3 flex justify-center items-center hover:bg-gray-200 transition shadow-[0_0px_6px_rgba(0,0,0,0.3),0_0_10px_rgba(0,0,0,0.2)]">
                    <CaretLeft size={20} />
                  </div>
                  <div className="custom-swiper-next absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer bg-white rounded-full p-3 flex justify-center items-center hover:bg-gray-200 transition shadow-[0_0px_6px_rgba(0,0,0,0.3),0_0_10px_rgba(0,0,0,0.2)]">
                    <CaretRight size={20} />
                  </div>
                </Swiper>
                {/* <div ref={paginationRef} className="flex justify-center mt-4"></div> */}
              </div>
            </div>

            {/* PG Details Card */}
            <div className="lg:col-span-1">
              <div className="glass-effect rounded-2xl p-8 shadow-xl border border-white/20 hover-lift">
                <div className="space-y-6">
                  {/* PG Name and Type */}
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                      {pginfo.pg_name}
                    </h1>
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`${getPGTypeColor(
                          pginfo?.pg_type
                        )} text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg`}
                      >
                        {pginfo?.pg_type?.replace(
                          pginfo?.pg_type[0],
                          pginfo?.pg_type[0]?.toUpperCase()
                        )}{" "}
                        Only
                      </span>
                      {reviewData && reviewData.length > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                          <Star
                            size={16}
                            className="text-yellow-500 fill-yellow-500"
                          />
                          <span className="text-sm font-semibold text-gray-700">
                            {getAverageRating()}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({reviewData.length} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rent Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Starting from</p>
                    <p className="text-4xl font-bold text-green-600">
                      ₹{pginfo?.minRent}
                    </p>
                    <p className="text-sm text-gray-500">per month</p>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Shield size={20} className="text-blue-600" />
                      Amenities
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-colors duration-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <WifiHigh size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">
                            WiFi
                          </span>
                          <p className="text-sm text-gray-500">
                            {pginfo.wifi_available === "yes"
                              ? "High-speed internet"
                              : "Not Available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-orange-200 transition-colors duration-200">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <ForkKnife size={20} className="text-orange-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">
                            Food
                          </span>
                          <p className="text-sm text-gray-500">
                            {pginfo.food_available === "yes"
                              ? "Homely meals included"
                              : "Not Provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <MapPin size={20} className="text-red-500" />
                      Location
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 mb-1">{pginfo.address}</p>
                      <p className="text-sm text-gray-500">
                        Pincode: {pginfo.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Contact Button */}
                  <button
                    className="w-full bg-buttons hover:bg-buttonsHover text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
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
                    <Phone size={20} />
                    Get Contact Details
                  </button>
                  {isUserLoggedIn && <button
                    className="w-full text-buttons border-2 border-buttons hover:text-white hover:bg-buttons hover:border-0  font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    onClick={() => {
                      addToWishlist(pginfo?._id);
                    }}
                  >
                    {wishlistArray?.includes(pginfo?._id) ? <p className="flex justify-center items-center gap-1">
                      <Trash size={20} />
                      <span>Remove from Wishlist</span>
                    </p> : <p className="flex justify-center items-center gap-1">
                      <CameraPlus size={20} />
                      <span>Add to Wishlist</span>
                    </p>}
                    
                  </button>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rules Section */}
        <div className="animate-slideUp mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-yellow-500 hover-lift">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield size={24} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  House Rules & Guidelines
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: pginfo.rules }}>
                  {/* {pginfo.rules} */}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Review CTA Section */}
        <div className="animate-slideUp mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold mb-2">
                  Share Your Experience
                </h3>
                <p className="text-blue-100">
                  Help others by sharing your thoughts about this PG
                </p>
              </div>
              <button
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-xl transition duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                onClick={() => {
                  formRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Write a Review
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Available Rooms Section */}
        <div className="animate-slideUp mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Available Rooms
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
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
                      } Room`}
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

        {/* Map Section */}
        <div className="animate-slideUp mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Location & Nearby
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="bg-white h-[450px] rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="h-[500px] w-full">
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
        <div className="animate-slideUp mb-12">
          <Suspense fallback={<SimilarPGsSkeleton />}>
            <SimilerPgs
              current_pgid={pginfo?._id}
              current_pg_cords={pginfo?.location?.coordinates}
            />
          </Suspense>
        </div>

        {/* Feedback Section */}
        <div className="animate-slideUp">
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
