"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  CaretLeft,
  CaretLeftIcon,
  CaretRight,
  CaretRightIcon,
  MapPinAreaIcon,
} from "@phosphor-icons/react";
import NoDataFound from "../NoDataFound/NoDataFound";

type Props = {
  id: string;
};

interface PGAttractionResponse {
  _id: string;
  place_name: string;
  address: string;
  description: string;
  image_url: string;
  image_id: string;
  state: string;
  country: string;
  time_taken_minutes: number;
  type: string;
}

/* ---------------- Skeleton ---------------- */
function FullWidthSkeleton() {
  return <section className="w-full h-[420px] bg-gray-200 animate-pulse" />;
}

export default function Attractions({ id }: Props) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PGAttractionResponse[]>([]);
  const [index, setIndex] = useState(1); // start from real first slide
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<NodeJS.Timeout | null>(null);

  /* -------- Fetch -------- */
  useEffect(() => {
    async function fetchAttractions() {
      try {
        const res: ApiReturn<PGAttractionResponse[] | PGAttractionResponse> =
          await api_caller("GET", API.PG.ATTRACTIONS.replace(":pg_id", id));

        if (!res.success || !res.data) {
          throw new Error("Failed to fetch attractions");
        }

        const data = Array.isArray(res.data) ? res.data : [res.data];
        setItems(data);
      } catch (e: any) {
        toast.error(e.message || "Failed to load attractions");
      } finally {
        setLoading(false);
      }
    }

    fetchAttractions();
  }, [id]);

  /* -------- Auto Slide -------- */
  const startAuto = () => {
    stopAuto();
    autoRef.current = setInterval(() => {
      move("right");
    }, 3000);
  };

  const stopAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
  };

  useEffect(() => {
    if (items.length > 1) startAuto();
    return stopAuto;
  }, [items, index]);

  /* -------- Movement -------- */
  const move = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;

    sliderRef.current.scrollTo({
      left: dir === "left" ? (index - 1) * width : (index + 1) * width,
      behavior: "smooth",
    });

    setIndex((prev) => (dir === "left" ? prev - 1 : prev + 1));
  };

  /* -------- Loop Correction -------- */
  const handleScrollEnd = () => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;

    // Jump from clone to real slide
    if (index === 0) {
      sliderRef.current.scrollTo({
        left: items.length * width,
        behavior: "auto",
      });
      setIndex(items.length);
    }

    if (index === items.length + 1) {
      sliderRef.current.scrollTo({
        left: width,
        behavior: "auto",
      });
      setIndex(1);
    }
  };

  useEffect(() => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    sliderRef.current.scrollTo({ left: width });
  }, [items]);

  if (loading) return <FullWidthSkeleton />;
  if (!items.length) return null;

  const slides = [
    items[items.length - 1], // clone last
    ...items,
    items[0], // clone first
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2 text-gray-800 text-center">
        Nearby Attractions 
      </h2>
      <div className="w-36 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      <p className="text-center text-gray-500 mb-10 mt-3">
        Explore popular attractions located close to your paying guest house.
      </p>

      {/* Section  */}

      {slides.length > 0 ? 
      <section className="relative w-full overflow-hidden bg-black">
        {/* Arrows */}
        <button
          onClick={() => move("left")}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80"
        >
          <CaretLeftIcon size={20} />
        </button>

        <button
          onClick={() => move("right")}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80"
        >
          <CaretRightIcon size={20} />
        </button>

        {/* Slider */}
        <div
          ref={sliderRef}
          onScroll={handleScrollEnd}
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
          className="flex w-full overflow-x-scroll scrollbar-hide scroll-smooth"
        >
          {slides.map((place, i) => (
            <div
              key={`${place._id}-${i}`}
              className="relative w-full h-[420px] shrink-0"
            >
              <Image
                src={place.image_url}
                alt={place.place_name}
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

              <div className="absolute inset-0 flex items-center">
                <div className="max-w-3xl px-6 lg:px-16 text-white">
                  <span className="inline-block mb-2 px-3 py-1 text-xs rounded bg-white/20">
                    {place.type} • {place.time_taken_minutes} mins away
                  </span>

                  <h2 className="text-3xl md:text-4xl font-semibold mb-3">
                    {place.place_name}
                  </h2>

                  <p className="text-sm md:text-base text-gray-200 max-w-xl mb-4">
                    {place.description}
                  </p>

                  <p className="text-xs text-gray-300 flex items-center gap-1">
                    <MapPinAreaIcon size={20} /> <span>{place.address}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> : <NoDataFound text="No attractions found near this paying guest house." />}
    </div>
  );
}
