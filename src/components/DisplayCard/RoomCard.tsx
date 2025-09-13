import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Bathtub, CheckCircle, WifiHigh, Wind, X } from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";import Tooltip from "../Forms/Tooltip";
;

type Props = {
    title: string;
    rent: number;
    foodIncluded?: boolean;
    roomsAvailable: number;
    depositDuration: string;
    wifidetails?: {
        available: "yes" | "no";
        speed: string;
        cost: number;
        duration: string;
    };
    attachedBathroom?: string;
    airconditioned?: string;
    imageUrls: string[];
    amenities: string[];
};

const RoomCard = ({
    title,
    rent,
    foodIncluded = false,
    roomsAvailable,
    depositDuration,
    imageUrls,
    amenities,
    wifidetails,
    attachedBathroom,
    airconditioned,
}: Props) => {

    const [showAllAmenities, setShowAllAmenities] = useState<boolean>(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                setShowAllAmenities(false);
            }
        };

        if (showAllAmenities) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showAllAmenities]);


    return (
      <div className="max-w-xs bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-[1.02] hover:shadow-lg transition duration-300">
        <div className="relative h-48 w-full">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop
            className="h-full w-full custom-swiper"
          >
            {imageUrls.map((url, idx) => (
              <SwiperSlide key={idx}>
                <Image
                  src={url}
                  alt={`Room image ${idx + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {imageUrls.length} Photos
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h2 className="text-xl font-semibold text-gray-700 truncate">
            {title}
          </h2>

          <div className="text-sm text-gray-700">
            <span className="font-bold text-lg">₹{rent.toLocaleString()}</span>{" "}
            <span className="text-sm text-gray-600">
              ({foodIncluded ? "Food Included" : "Food Excluded"})
            </span>
          </div>

          {wifidetails && wifidetails.available === "yes" && (
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <WifiHigh size={16} className="text-green-600" />
              <span>
                WiFi: {wifidetails.speed} at ₹{wifidetails.cost} (
                {wifidetails.duration})
              </span>
            </div>
          )}

          <div className="text-sm text-gray-700 flex items-start gap-1">
            <Bathtub size={16} />
            <p>
              Attached Bathroom:{" "}
              <span className="font-semibold">
                {attachedBathroom === "yes" ? "Yes" : "No"}
              </span>
            </p>
          </div>

          <div className="text-sm text-gray-700 flex items-start gap-1">
            <Wind size={16} />
            <p>
              Air Conditioned:{" "}
              <span className="font-semibold">
                {airconditioned === "yes" ? "Yes" : "No"}
              </span>
            </p>
          </div>

          <div className="text-sm text-gray-700 flex items-start gap-1">
            <p>
              Deposit Duration:{" "}
              <span className="font-semibold">{depositDuration}</span>
            </p>
            <Tooltip text={`You Need to pay on ${depositDuration} basis`} />
          </div>

          {/* <div className="text-sm text-gray-700">
                    Rooms Available:{" "}
                    <span className="font-semibold">{roomsAvailable}</span>
                </div> */}

          <div>
            <h3 className="text-sm font-medium text-gray-800 mb-1">
              Amenities
            </h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {amenities.slice(0, 6).map((item, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 text-green-600 px-2 py-1"
                >
                  <CheckCircle className="text-green-600" size={20} /> {item}
                </span>
              ))}
              {amenities.length > 6 && (
                <span
                  className="text-buttons hover:underline text-sm cursor-pointer"
                  onClick={() => setShowAllAmenities(true)}
                >
                  +{amenities.length - 6} More
                </span>
              )}
            </div>
          </div>

          <button
            disabled
            className="mt-3 w-full bg-buttons text-white py-2 rounded-md hover:bg-buttonsHover transition disabled:cursor-not-allowed"
          >
            Book Now
          </button>
        </div>
        {showAllAmenities && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
            <div
              ref={modalRef}
              className="relative bg-white rounded-lg p-6 max-w-sm w-full shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  All Amenities
                </h3>
                <X
                  size={20}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => setShowAllAmenities(false)}
                />
              </div>

              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                {amenities.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
};

export default RoomCard;
