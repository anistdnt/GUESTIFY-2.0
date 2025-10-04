"use client";
import Rating from "../Rating/Rating";
import { CurrencyInr, MapPin, UserPlus } from "@phosphor-icons/react/dist/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PGData } from "@/types/pg_type";
import { Room } from "@/types/pg_type";
import { useDispatch } from "react-redux";
import { setModalVisibility } from "@/redux/slices/modalSlice";
import FadedImageSlider from "./FadedImageSlider";

type Props = {
  item?: PGData;
  number_of_stars: number;
};

export default function DisplayCard({ item, number_of_stars }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { pginfo, rooms } = item || { pginfo: {}, rooms: [] };
  // Utility to extract coordinates from query string
  const [college_longitude, setLongitude] = useState<number | null>(null);
  const [college_latitude, setLatitude] = useState<number | null>(null);

  const params = useSearchParams();
  const clg_coords = params.get("coordinates");
  const clg_name = params.get("clg_name");
  const clg_addr = params.get("clg_addr");
  const clg_pin = params.get("clg_pin");
  const clg_id = params.get("clg_id") || "";

  return (
    <>
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="relative">
          <FadedImageSlider images={pginfo?.pg_images} />
          {/* PG Type Badge */}
          <span
            className={`absolute top-2 right-2 ${
              pginfo?.pg_type === "girls" && "bg-pink-500"
            } ${pginfo?.pg_type === "boys" && "bg-blue-500"} ${
              pginfo?.pg_type === "both" && "bg-yellow-700"
            } text-white text-xs px-2 py-1 rounded`}
          >
            {pginfo?.pg_type?.replace(
              pginfo?.pg_type[0],
              pginfo?.pg_type[0]?.toUpperCase()
            )}
          </span>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{pginfo?.pg_name}</h3>
              <p className="text-sm text-gray-600">{pginfo?.address}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold flex flex-row justify-center items-center text-priceCol">
                <span>
                  <CurrencyInr size={15} />
                </span>
                <span>{pginfo?.minRent}</span>
              </p>
              <p className="text-sm text-gray-500">onwards</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 mb-2 text-xs text-green-700">
            <span
              className={`${
                pginfo?.food_available === "yes" ? "bg-green-100" : "bg-red-200"
              } px-2 py-1 rounded`}
            >
              Food Available
            </span>
            <span
              className={`${
                pginfo?.wifi_available === "yes" ? "bg-green-100" : "bg-red-200"
              } px-2 py-1 rounded`}
            >
              WiFi Available
            </span>
            <div className="flex items-center gap-1">
              {number_of_stars && number_of_stars !== 0 && (
                <Rating no_of_star={number_of_stars} />
              )}
            </div>
          </div>

          <hr />

          <div className="flex flex-row">
            {rooms &&
              rooms?.map((room: Room, index: number) => (
                <div
                  key={index}
                  className="flex flex-col justify-start items-start text-sm text-gray-500 py-2"
                >
                  <p className="border-s-2 px-2">
                    {room?.room_type?.replace(
                      room?.room_type[0],
                      room?.room_type[0]?.toUpperCase()
                    )}{" "}
                    Room
                  </p>
                  <p className="font-bold flex flex-row justify-center items-center text-priceCol border-s-2 px-2">
                    <span>
                      <CurrencyInr size={10} />
                    </span>
                    <span>{room?.room_rent}</span>
                  </p>
                </div>
              ))}
          </div>

          <hr />
          <p className="mt-2 text-gray-700 text-sm">
            Home-cooked food, Wi-Fi, AC, and other amenities. Electricity
            included. Convenient location.
            <a href="#" className="text-blue-500">
              Read More
            </a>
          </p>

          <div className="flex flex-row flex-wrap gap-3 justify-between items-center text-sm text-gray-500 mt-3">
            <p className="flex flex-row justify-center items-center gap-2">
              <span>
                <MapPin size={18} weight="fill" />
              </span>{" "}
              <span>{pginfo?.linearDistance} km from the choosen location</span>
            </p>
            <div className="flex gap-4">
              <button
                className="bg-buttons hover:bg-buttonsHover text-white px-4 py-2 rounded"
                onClick={() => {
                  router.push(
                    `/pg/${pginfo?._id}?clg_coords=${encodeURIComponent(
                      clg_coords
                    )}&clg_name=${encodeURIComponent(
                      clg_name
                    )}&clg_addr=${encodeURIComponent(
                      clg_addr
                    )}&clg_pin=${clg_pin}&clg_id=${clg_id}`
                  );
                }}
              >
                View full details
              </button>
              <button
                className="bg-buttonsSecondary hover:bg-buttons text-white px-4 py-2 rounded flex justify-center items-center gap-2"
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
                <UserPlus size={20} color="#ffffff" weight="fill" />
                <span>Contact Owner</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
