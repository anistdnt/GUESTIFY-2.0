import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Bathtub, CheckCircle, WifiHigh, Wind, X } from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";
import Tooltip from "../Forms/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { setModalVisibility } from "@/redux/slices/modalSlice";
import { ArrowsOut } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
type Props = {
  room_id: string;
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
  imageUrls: { room_image_url: string; room_image_id: string }[];
  amenities: string[];
  bookinginfo: {
    booked_by?: string | null;
    booking_status?: string;
  };
};

const RoomCard = ({
  room_id,
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
  bookinginfo,
}: Props) => {
  const [showAllAmenities, setShowAllAmenities] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const profile_info = useSelector((state: RootState) => state.user_slice.userData);

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

  const getTooltipText = () => {
    switch (bookinginfo?.booking_status) {
      case "pending":
        return "Booking Pending Approval";
      case "booked":
        return "This Room is Already Booked";
      default:
        return "Click here to Raise a Booking Request";
    }
  }

  return (
    <div className="h-[550px] bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-[1.02] hover:shadow-lg transition duration-300 flex flex-col">
      <div className="relative h-48 w-full">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop
          className="h-full w-full custom-swiper"
        >
          {imageUrls.map((img, idx) => (
            <SwiperSlide key={idx}>
              <Image
                src={img?.room_image_url}
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

      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-col justify-start items-start gap-1 mb-1">
            <div className="flex justify-between items-center flex-1 w-full">
              <h2 className="text-2xl font-semibold text-gray-600 truncate">
                {title}
              </h2>
              <button data-tooltip="View in Enlarged form" data-tooltip-pos="left" className="p-1 bg-gray-100 rounded-md hover:bg-gray-300 transition" onClick={() => {
                dispatch(
                  setModalVisibility({
                    open: true,
                    type: "roomimageprev",
                    modalData: {
                      images: imageUrls,
                    },
                  })
                );
              }}>
                <ArrowsOut size={20} />
              </button>
            </div>

            <div className="text-sm text-gray-700">
              <span className="font-bold text-lg">
                ₹{rent.toLocaleString()}
              </span>{" "}
              <span className="text-sm text-gray-600">
                ({foodIncluded ? "Food Included" : "Food Excluded"})
              </span>
            </div>
          </div>

          <hr />

          <div className="bg-gray-100 p-2 my-1 rounded-md space-y-2">
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
          </div>

          {/* <div className="text-sm text-gray-700">
                    Rooms Available:{" "}
                    <span className="font-semibold">{roomsAvailable}</span>
                </div> */}

          <hr/>

          <div className="mt-1">
            <h3 className="text-sm font-medium text-gray-800 mb-1">
              Amenities
            </h3>
            <div className="flex flex-wrap gap-2 text-sm items-center">
              {amenities.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 text-green-600 px-2 py-1"
                >
                  <CheckCircle className="text-green-600" size={20} /> {item}
                </span>
              ))}
              {amenities.length > 3 && (
                <span
                  className="text-buttons hover:underline text-sm cursor-pointer"
                  onClick={() => setShowAllAmenities(true)}
                >
                  +{amenities.length - 3} More...
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          className="mt-3 w-full bg-buttons text-white py-2 rounded-md hover:bg-buttonsHover transition disabled:cursor-not-allowed disabled:bg-gray-400"
          data-tooltip={getTooltipText()}
          disabled={bookinginfo?.booked_by !== null}
          onClick={() => {
            if(profile_info && profile_info?._id){
              dispatch(
                setModalVisibility({
                  open: true,
                  type: "roombooking",
                  modalData: {
                    caption: "Create New Booking",
                    room_id: room_id,
                    title: title,
                  },
                })
              );
            } else {
              router?.push('/login');
            }
          }}
        >
          {bookinginfo?.booked_by !== null ? "Already Booked" : "Book Now"}
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
