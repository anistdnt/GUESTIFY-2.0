"use client"

import RoomCard from '@/components/DisplayCard/RoomCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ForkKnife, WifiHigh, ThermometerCold, ArrowLeft, ArrowRight, X } from '@phosphor-icons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { PGInfo, Room } from '@/types/pg_type';
import 'swiper/css';
import { Review } from '@/app/(sharedlayout)/pg/[id]/page';
import type { LatLngTuple } from 'leaflet';
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../Map/Map"), { ssr: false });
const Feedback = lazy(() => import('@/components/Feedback/Feedback'))
const SimilerPgs = lazy(()=> import("@/components/MainPageComponents/SimilerPgs"));

interface Iprops {
  id: string,
  pginfo: PGInfo,
  rooms: Room[],
  reviewData: Review[],
  clg_coords?: string,
  clg_name?: string,
  clg_addr?: string,
  clg_pin?: string
  clg_id?: string;
}
const PGInfoComponent = ({ pginfo, rooms, reviewData, id, clg_coords,  clg_name, clg_addr, clg_pin, clg_id }: Iprops) => {
  console.log("pginfo",pginfo);
  // const router = useRouter();
  //   const { id } = router.query;
  //   const [pgDetails, setPgDetails] = useState(null);

  //   useEffect(() => {
  //     if (id) {
  //       axios.get(`/api/pg/${id}`)
  //         .then(response => setPgDetails(response.data))
  //         .catch(error => console.error('Error fetching PG details:', error));
  //     }
  //   }, [id]);

  // if (!pgDetails) {
  //     return <p className="text-center mt-10">Loading PG details...</p>;
  // }

  // const [showReviewPanel, setShowReviewPanel] = useState<boolean>(false);
  // const [isClosing, setIsClosing] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const college_coords = clg_coords.split(",").map(coord => Number(coord)).reverse() as [number, number];

  // useEffect(() => {
  //   if (typeof clg_coords === "string") {
  //     college_coords.current = clg_coords.split(",").map(coord => Number(coord)).reverse() as [number, number];
  //     console.log("College Coordinates:", college_coords);
  //     // if (parts.length === 2) {
  //     //   const lon = Number(parts[0]);
  //     //   const lat = Number(parts[1]);
  //     //   if (!isNaN(lat) && !isNaN(lon)) {
  //     //     setLongitude(lon);
  //     //     setLatitude(lat);
  //     //   }
  //     // }
  //   }
  // }, [clg_coords]);

  // const handleCloseReviewPanel = () => {
  //     setIsClosing(true);
  //     setTimeout(() => {
  //         setShowReviewPanel(false);
  //         setIsClosing(false);
  //     }, 300);
  // };



  useEffect(() => { console.log(reviewData) }, [reviewData])
  const router = useRouter()
  // Default coordinates (can be replaced with actual PG location)

  const position: LatLngTuple =
    pginfo?.location
      ? [pginfo.location.coordinates[1], pginfo.location.coordinates[0]] :
      [28.6139, 77.2090]; // Delhi fallback
  return (
    <div className=" mx-auto">
      <ArrowLeft size={32} onClick={() => router.back()} className='mb-4 cursor-pointer' />
      <div className='flex flex-col sm:flex-row gap-6'>

        <img src={pginfo.pg_image_url}
          alt="PG Image"
          className="sm:w-[70%] rounded-lg max-h-[480px]" />

        {/* for slider use , will use it later */}

        {/* <Swiper spaceBetween={10} slidesPerView={1} className="mb-6">
                    {pgDetails.images.map((img, index) => (
          <SwiperSlide key={index}>
          <img src={img} alt={`PG Image ${index + 1}`} className="w-full rounded-lg" />
          </SwiperSlide>
          ))}

                    <SwiperSlide key="1">
                        <img src="/assets/sample1.jpg" alt={`PG Image`} className="w-full max-sm:max-w-[600px] rounded-lg" />
                    </SwiperSlide>

                </Swiper> */}

        <div className='w-full sm:w-full sm:max-w-[300px]'>
          <h1 className="text-3xl font-bold mb-3">{pginfo.pg_name}</h1>
          <span
            className={`${pginfo?.pg_type === "girls" && "bg-pink-500"
              } ${pginfo?.pg_type === "boys" && "bg-blue-500"} ${pginfo?.pg_type === "both" && "bg-yellow-700"
              } text-white text-xs px-2 py-1 rounded`}
          >
            {pginfo?.pg_type?.replace(
              pginfo?.pg_type[0],
              pginfo?.pg_type[0]?.toUpperCase()
            )}
          </span>

          <p className="text-xl font-semibold mt-4 mb-4">Rent: <span className='text-3xl text-red-500'>₹12000</span></p>
          <p className='flex flex-row gap-3 items-center mb-3'><WifiHigh size={20} /> <span className='font-semibold'>Wifi :</span> {pginfo.wifi_available === "yes" ? "Available" : "Not Available"}</p> {/* {pgDetails.wifi ? 'Available' : 'Not Available'} */}
          {/* <p className='flex flex-row gap-3 items-center mb-3'><ThermometerCold size={20} /><span className='font-semibold'>AC :</span>  Available</p> */}
          <p className='flex flex-row gap-3 items-center'><ForkKnife size={20} /> <span className='font-semibold'>Food :</span> {pginfo.food_available === "yes" ? "Provided" : "Not Provided"}</p> {/* {pgDetails.food ? 'Provided' : 'Not Provided'} */}
          <p className="mt-4 text-gray-600"><span className='font-semibold'>Address:</span> {pginfo.address}</p>
          <p className="mt-4 text-gray-600 mb-8"><span className='font-semibold'>Pincode:</span> {pginfo.pincode}</p>
          <button className="bg-buttons hover:bg-buttonsHover text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300">
            Get Contact Details
          </button>

        </div>
      </div>
      <div className="mt-6 p-4 bg-gray-100 border-l-4 border-yellow-500 rounded-lg shadow-sm">
        <p className="text-lg font-semibold text-gray-800"><strong>Rules:</strong></p>
        <p className="mt-2 text-gray-700 leading-relaxed">{pginfo.rules}</p>
      </div>

      <div className='w-full bg-yellow-100 flex flex-col sm:flex-row items-center justify-center gap-5 py-4 mt-6 rounded-md'>
        <span>Share your thoughts about this PG</span>
        <button
          className="text-buttonsHover flex flex-row items-center text-sm gap-1 hover:underline"
          onClick={() => { formRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>Write a Review <ArrowRight size={16} /></button>
      </div>

      <div className="grid grid-cols-1 max-sm:justify-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
        {rooms && rooms.map((room) => (
          <RoomCard
            key={room._id}
            title={`${room.room_type[0].toUpperCase() + room.room_type.slice(1)} Room`}
            rent={room.room_rent}
            foodIncluded={true}
            roomsAvailable={10}
            depositDuration={room.deposit_duration}
            imageUrls={[room.room_image_url]} // need to change it later
            amenities={[
              "AC",
              "Washroom",
              "Cupboard",
              "TV",
              "Cot",
              "Mattress",
              "WiFi",
              "Geyser",
            ]}
          />
        ))}
      </div>

      {/* Leaflet Map Section */}
      <div className="w-full h-[500px] flex justify-center items-center my-8">
        <Map clg_coords={college_coords} pgInfo={{position : position as [number, number] , name : pginfo.pg_name , address : pginfo.address, pg_idno : pginfo._id}} {...{ clg_name, clg_addr, clg_pin, clg_id}} />
      </div>

      <Suspense fallback={<FeedbackSkeleton />}>
        <SimilerPgs current_pgid={pginfo?._id} current_pg_cords={pginfo?.location?.coordinates}/>
      </Suspense>

      <Suspense fallback={<FeedbackSkeleton />}>
        <Feedback ref={formRef} {...{ reviewData, id }} />
      </Suspense>

      {/* review offcanvas */}
      {/* {showReviewPanel && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30">
                    <div
                        ref={panelRef}
                        className={`bg-white w-full max-w-screen-md h-full shadow-lg p-6 overflow-y-auto relative ${isClosing ? "animate-slideOutRight" : "animate-slideInRight"
                            }`}
                    >
                        
                        <button
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                            onClick={handleCloseReviewPanel}
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>

                        
                        <form className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Your Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Rating</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2">
                                    <option>5 - Excellent</option>
                                    <option>4 - Good</option>
                                    <option>3 - Average</option>
                                    <option>2 - Poor</option>
                                    <option>1 - Terrible</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Review</label>
                                <textarea
                                    rows={4}
                                    className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Write your feedback..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            )} */}

    </div>
  );
};

export default PGInfoComponent;


const FeedbackSkeleton = () => {
  return (
    <div className="w-4/5 max-w-[1200px] mx-auto min-h-screen bg-[#fafafa] py-8 flex flex-col gap-12 animate-pulse">
      {/* 1) Carousel Skeleton */}
      <div>
        <div className="h-8 bg-gray-300 rounded w-40 mx-auto mb-6" />

        <div className="relative w-[800px] mx-auto overflow-hidden bg-white rounded-md shadow p-4">
          <div className="flex" style={{ width: "800px" }}>
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="w-[400px] p-6 flex flex-col gap-4 bg-white"
              >
                <div className="w-[250px] h-[250px] bg-gray-200 rounded-full mx-auto" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 bg-gray-300 rounded w-full" />
                  <div className="flex gap-[2px]">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div
                        key={j}
                        className="w-5 h-5 bg-gray-300 rounded"
                      />
                    ))}
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 self-end" />
                </div>
              </div>
            ))}
          </div>

          {/* Prev/Next buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 bg-gray-300 rounded-full" />
          <div className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* 2) Form Skeleton */}
      <div className="bg-white p-8 rounded-md shadow w-full max-w-[800px] mx-auto">
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-300 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <div className="h-4 w-60 bg-gray-300 rounded" />
            <div className="w-[200px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center" />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-300 rounded" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded" />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-40 h-10 bg-gray-300 rounded-full mt-4" />
        </div>
      </div>
    </div>
  );
};

