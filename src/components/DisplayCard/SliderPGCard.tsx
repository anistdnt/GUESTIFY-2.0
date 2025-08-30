"use client";
import Image from "next/image";
import Rating from "../Rating/Rating";
import { CurrencyInr, MapPin } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { PGData } from "@/types/pg_type";
import { House } from "@phosphor-icons/react/dist/ssr";

type Props = {
  item?: PGData;
  number_of_stars: number;
};

export default function SliderPGCard({ item, number_of_stars }: Props) {
  const router = useRouter();
  const { pginfo } = item;
  const params = useSearchParams();
  const clg_coords = params.get("clg_coords");
  const clg_name = params.get("clg_name");
  const clg_addr = params.get("clg_addr");
  const clg_pin = params.get("clg_pin");
  const clg_id = params.get("clg_id") || "";

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="relative">
        <Image
          className="w-full h-60 object-cover"
          src={pginfo?.pg_image_url || "/assets/sample1.jpg"}
          alt="PG Image"
          width={500}
          height={500}
        />
        <span
          className={`absolute top-2 right-2 ${
            pginfo?.pg_type === "girls"
              ? "bg-pink-500"
              : pginfo?.pg_type === "boys"
              ? "bg-blue-500"
              : "bg-yellow-700"
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
          {number_of_stars && number_of_stars !== 0 && (
            <Rating no_of_star={number_of_stars} />
          )}
        </div>

        <hr />

        <p className="mt-2 text-gray-700 text-sm">
          Home-cooked food, Wi-Fi, AC, and other amenities. Electricity
          included. Convenient location.
          <a href="#" className="text-blue-500">
            Read More
          </a>
        </p>

        <div className="flex flex-row flex-wrap gap-3 justify-end items-center text-sm text-gray-500 mt-3">
          <button
            className="bg-buttons hover:bg-buttonsHover text-white px-4 py-2 rounded flex items-center justify-center gap-1"
            onClick={() =>
              router.push(
                `/pg/${pginfo?._id}?clg_coords=${encodeURIComponent(
                  clg_coords!
                )}&clg_name=${encodeURIComponent(
                  clg_name!
                )}&clg_addr=${encodeURIComponent(
                  clg_addr!
                )}&clg_pin=${clg_pin}&clg_id=${clg_id}`
              )
            }
          >
            <House size={20} />
            <span>View full details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
